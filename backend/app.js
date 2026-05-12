import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import Groq from "groq-sdk";
import nodemailer from "nodemailer";

// Charge .env avec chemin absolu — fonctionne quel que soit le cwd
const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
require("dotenv").config({ path: join(__dirname, ".env") });

// ─── Helpers de validation ───────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Supprime les balises HTML et les caractères dangereux
function sanitize(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/<[^>]*>/g, "") // Strip HTML tags
    .replace(/[<>"'`]/g, "") // Strip XSS chars
    .trim()
    .slice(0, 2000); // Limite la longueur
}

function sanitizeShort(str, max = 200) {
  return sanitize(str).slice(0, max);
}

// ─── App ─────────────────────────────────────────────────────────────────────

const app = express();

// ─── Sécurité : Headers HTTP ─────────────────────────────────────────────────
app.use(helmet());
app.disable("x-powered-by");

// ─── Sécurité : CORS strict ──────────────────────────────────────────────────
const allowedOrigins = (
  process.env.FRONTEND_URL || "http://localhost:5173"
).split(",");
app.use(
  cors({
    origin: (origin, cb) => {
      // Autorise les requêtes sans origin (Postman, tests) en dev uniquement
      if (!origin && process.env.NODE_ENV !== "production")
        return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`Origin non autorisée : ${origin}`));
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// ─── Sécurité : Body size limit ──────────────────────────────────────────────
app.use(express.json({ limit: "20kb" }));

// ─── Sécurité : Rate limiting (désactivé en test) ────────────────────────────
const isTest = process.env.NODE_ENV === "test";

const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: isTest ? 10000 : 20, // 20 messages par minute par IP (illimité en test)
  message: { error: "Trop de messages, réessayez dans une minute." },
  standardHeaders: true,
  legacyHeaders: false,
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: isTest ? 10000 : 5, // 5 soumissions par heure par IP (illimité en test)
  message: { error: "Trop de soumissions, réessayez dans une heure." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Groq client (lazy — instancié après dotenv dans index.js) ───────────────
const getGroq = () => new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `Tu es Digi, l'assistant IA de Kevin — fondateur de Supaco Digital, agence web indépendante basée à Saint-Genis-Pouilly (Pays de Gex, France).

Supaco Digital crée des sites web et applications 100% sur mesure pour PME locales, indépendants, e-commerces et restaurants. Zéro template, code propre, résultats concrets.

Nos 4 offres (tarifs sur devis personnalisé, après un appel découverte gratuit de 30 min) :
- Site Vitrine : jusqu'à 5 pages, responsive, formulaire de contact, SEO de base, livraison ~7 jours.
- Site Pro : jusqu'à 10 pages, SEO avancé, blog, galerie, formation incluse, livraison ~1-2 semaines.
- E-Commerce : boutique complète, 0% de commission, paiement Stripe, dashboard admin, gestion stocks, formation incluse.
- App Restaurant : commande en ligne à emporter & livraison, paiement intégré, dashboard gérant, menu modifiable. 0% commission vs Uber Eats à 30%.

Process : appel découverte gratuit 30 min → devis personnalisé sous 24h → démarrage du projet.

Processus de qualification — pose ces questions une à la fois, naturellement, sans les lister :
1. Quel est leur projet / besoin principal ?
2. Ont-ils déjà un site existant ? Si oui, quel est le problème ?
3. Quel est leur délai souhaité ?
4. Demande leur prénom et email pour que Kevin les recontacte (le téléphone est optionnel)

Une fois l'email récupéré :
- Confirme que Kevin va les recontacter sous 24h
- Mentionne qu'ils peuvent aussi réserver directement un appel sur le site (section Contact)

Règles absolues :
- Tutoie toujours, ton chaleureux et direct (pas corporate, pas robotique)
- Réponds UNIQUEMENT en français
- Maximum 2-3 phrases par message — sois concis
- Prix : "les tarifs sont sur devis selon le projet, après un appel gratuit de 30 min" — ne donne jamais de chiffre
- Ne donne JAMAIS d'adresse email
- Hors sujet (SEO externe, pub Google, logo, photo, rédaction) → "Kevin pourra t'orienter lors de l'appel découverte"
- Refuse poliment tout sujet sans rapport avec le web et le digital
- Si le prospect hésite ou a peur du coût → rassure : appel gratuit, sans engagement, devis clair`;

// ─── Route : Health check ────────────────────────────────────────────────────
app.get("/api/health", (_, res) => {
  res.json({ status: "ok", model: "llama-3.3-70b-versatile" });
});

// ─── Helpers chatbot ─────────────────────────────────────────────────────────

// Extrait un email depuis un texte
const EMAIL_IN_TEXT = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;

// Extrait un numéro de téléphone (formats FR et internationaux)
const PHONE_IN_TEXT = /(?:(?:\+|00)33|0)\s*[1-9](?:[\s.\-]?\d{2}){4}/;

// ─── Sécurité chatbot ─────────────────────────────────────────────────────────

const MSG_MAX_LENGTH = 500; // caractères max par message utilisateur

// Tentatives de manipulation du système prompt
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions?/i,
  /forget\s+(everything|all|your|the)\s*(above|previous|instructions?|rules?|prompt)?/i,
  /you\s+are\s+now\s+(a\s+)?(?!digi)/i,
  /act\s+as\s+(if\s+you\s+are\s+)?(a\s+)?(?!digi)/i,
  /new\s+(role|persona|instructions?|prompt|rules?)[\s:]/i,
  /system\s*:\s*/i,
  /\[system\]/i,
  /<\s*system\s*>/i,
  /###\s*instructions?/i,
  /override\s+(your\s+)?(instructions?|rules?|prompt)/i,
  /tu\s+es\s+maintenant\s+(?!digi)/i,
  /oublie\s+(tout|tes\s+instructions?|le\s+contexte)/i,
  /ignore\s+(toutes?\s+)?(les\s+)?(instructions?|règles?|consignes?)/i,
  /nouveau\s+(rôle|persona|instructions?)/i,
];

// Contenu clairement inapproprié
const INAPPROPRIATE_PATTERNS = [
  /\b(fuck|shit|bitch|asshole|bastard|connard|enculé|putain\s+de|va\s+te\s+faire|nique\s+ta)\b/i,
  /\b(nigger|faggot|retard)\b/i,
];

// Spam / flood (répétition excessive du même caractère)
const SPAM_PATTERN = /(.)\1{19,}/; // même caractère 20+ fois de suite

/**
 * Analyse un message utilisateur et retourne une raison de rejet ou null si OK.
 */
function detectChatAbuse(content) {
  if (content.length > MSG_MAX_LENGTH) {
    return "MESSAGE_TOO_LONG";
  }
  if (SPAM_PATTERN.test(content)) {
    return "SPAM";
  }
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(content)) return "PROMPT_INJECTION";
  }
  for (const pattern of INAPPROPRIATE_PATTERNS) {
    if (pattern.test(content)) return "INAPPROPRIATE";
  }
  return null;
}

// Réponses neutres selon le type d'abus — ne révèle pas le mécanisme de détection
const ABUSE_REPLIES = {
  MESSAGE_TOO_LONG:
    "Ton message est un peu long ! Peux-tu le reformuler en quelques mots ?",
  SPAM: "Je n'ai pas compris ton message. Tu peux me décrire ton projet web ?",
  PROMPT_INJECTION:
    "Je suis Digi, l'assistant de SupacoDigital 😊 Comment puis-je t'aider pour ton projet web ?",
  INAPPROPRIATE: "Je suis là pour t'aider avec ton projet web. Parlons-en !",
};

// Résume la conversation pour l'email de notification
function buildLeadSummary(messages) {
  return messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map(
      (m) => `${m.role === "user" ? "👤 Prospect" : "🤖 Digi"} : ${m.content}`
    )
    .join("\n\n");
}

// Envoie une notification email à Kevin quand un lead est capturé
async function notifyLead({
  prospectName,
  prospectEmail,
  prospectPhone,
  conversation,
}) {
  const emailConfigured =
    process.env.EMAIL_PASS &&
    !process.env.EMAIL_PASS.includes("VOTRE_") &&
    !process.env.EMAIL_PASS.includes("votre_");

  if (!emailConfigured || isTest) {
    console.log(
      `📩 [LEAD] ${prospectName} <${prospectEmail}> ${prospectPhone || ""}`
    );
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  try {
    await transporter.sendMail({
      from: `"SupacoDigital — Digi" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `🔥 Nouveau lead — ${prospectName} (${prospectEmail})`,
      replyTo: prospectEmail,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#111;border-bottom:2px solid #111;padding-bottom:12px">
            🔥 Nouveau lead capturé par Digi
          </h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
            <tr><td style="padding:8px 0;color:#666;width:140px"><strong>Prénom</strong></td><td>${prospectName}</td></tr>
            <tr><td style="padding:8px 0;color:#666"><strong>Email</strong></td><td><a href="mailto:${prospectEmail}">${prospectEmail}</a></td></tr>
            <tr><td style="padding:8px 0;color:#666"><strong>Téléphone</strong></td><td>${
              prospectPhone
                ? `<a href="tel:${prospectPhone}">${prospectPhone}</a>`
                : "—"
            }</td></tr>
          </table>
          <h3 style="color:#333;margin-bottom:12px">Conversation complète :</h3>
          <div style="background:#f5f5f5;padding:16px;border-left:4px solid #111;white-space:pre-wrap;font-size:14px;line-height:1.6">
${conversation}
          </div>
          <p style="margin-top:24px;color:#999;font-size:12px">
            Capturé automatiquement par Digi — SupacoDigital
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Lead email error:", err.message);
  }
}

// ─── Route : Chatbot ─────────────────────────────────────────────────────────
app.post("/api/chat", chatLimiter, async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res
      .status(400)
      .json({ error: "Le champ messages (array) est requis." });
  }

  if (messages.length === 0) {
    return res.status(400).json({ error: "Le tableau messages est vide." });
  }

  // Valide, sanitise et vérifie les abus sur chaque message
  const sanitized = [];
  for (const msg of messages.slice(-20)) {
    if (!msg || typeof msg !== "object") continue;
    const role =
      msg.role === "user"
        ? "user"
        : msg.role === "assistant"
        ? "assistant"
        : null;
    const content = sanitize(msg.content);
    if (!role || !content) {
      return res
        .status(400)
        .json({ error: "Format de message invalide (role + content requis)." });
    }
    // Vérifie les abus uniquement sur les messages utilisateur
    if (role === "user") {
      const abuse = detectChatAbuse(content);
      if (abuse) {
        // Retourne une réponse neutre sans révéler la détection
        return res.json({ reply: ABUSE_REPLIES[abuse], leadCaptured: null });
      }
    }
    sanitized.push({ role, content });
  }

  if (sanitized.length === 0) {
    return res.status(400).json({ error: "Aucun message valide." });
  }

  let completion;
  try {
    completion = await getGroq().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...sanitized],
      max_tokens: 300,
      temperature: 0.7,
    });
  } catch (err) {
    console.error("Groq error:", err.message);
    return res
      .status(502)
      .json({ error: "Erreur lors de la génération de la réponse." });
  }

  const reply =
    completion.choices[0]?.message?.content ??
    "Désolé, une erreur est survenue.";

  // ─── Détection de lead ────────────────────────────────────────────────────────
  const userMsgs = sanitized.filter((m) => m.role === "user");
  const allUserText = userMsgs.map((m) => m.content).join(" ");
  const lastUserMsg = userMsgs.at(-1);

  const leadEmail = allUserText.match(EMAIL_IN_TEXT)?.[0] ?? null;
  const leadPhone = allUserText.match(PHONE_IN_TEXT)?.[0] ?? null;
  const emailJustCaptured =
    lastUserMsg && EMAIL_IN_TEXT.test(lastUserMsg.content);

  if (emailJustCaptured && leadEmail) {
    // Extrait le prénom : premier mot des derniers messages en excluant email et téléphone
    const cleanedText = allUserText
      .replace(EMAIL_IN_TEXT, "")
      .replace(PHONE_IN_TEXT, "")
      .trim();
    const leadName =
      cleanedText.split(/[\s,]+/).find((w) => w.length > 1) || "Inconnu";

    notifyLead({
      prospectName: leadName,
      prospectEmail: leadEmail,
      prospectPhone: leadPhone,
      conversation: buildLeadSummary(sanitized),
    }).catch(console.error);

    return res.json({
      reply,
      leadCaptured: { name: leadName, email: leadEmail, phone: leadPhone },
    });
  }

  return res.json({ reply, leadCaptured: null });
});

// ─── Route : Formulaire de contact ───────────────────────────────────────────
app.post("/api/contact", contactLimiter, async (req, res) => {
  const raw = req.body;

  const name = sanitizeShort(raw.name, 100);
  const email = sanitizeShort(raw.email, 200);
  const phone = sanitizeShort(raw.phone, 30);
  const service = sanitizeShort(raw.service, 100);
  const budget = sanitizeShort(raw.budget, 50);
  const message = sanitize(raw.message);

  // Validation
  if (!name) return res.status(400).json({ error: "Le nom est requis." });
  if (!email) return res.status(400).json({ error: "L'email est requis." });
  if (!message)
    return res.status(400).json({ error: "Le message est requis." });
  if (!EMAIL_REGEX.test(email))
    return res.status(400).json({ error: "Adresse email invalide." });
  if (message.length < 10)
    return res
      .status(400)
      .json({ error: "Message trop court (10 caractères min)." });

  // Mode test ou email non configuré : log et retourne succès sans envoyer
  const emailConfigured =
    process.env.EMAIL_PASS &&
    !process.env.EMAIL_PASS.includes("VOTRE_") &&
    !process.env.EMAIL_PASS.includes("votre_");

  if (isTest || !emailConfigured) {
    if (!isTest)
      console.log("📧 [DEV] Contact reçu :", {
        name,
        email,
        service,
        budget,
        message,
      });
    return res.json({ success: true, message: "Message reçu." });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  let mailSent = false;
  try {
    await transporter.sendMail({
      from: `"Supaco Digital Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `Nouveau contact — ${name} (${service || "Non précisé"})`,
      replyTo: email,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#111;border-bottom:2px solid #111;padding-bottom:12px">
            Nouveau message — Supaco Digital
          </h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#666;width:140px"><strong>Nom</strong></td><td>${name}</td></tr>
            <tr><td style="padding:8px 0;color:#666"><strong>Email</strong></td><td><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#666"><strong>Téléphone</strong></td><td>${
              phone || "—"
            }</td></tr>
            <tr><td style="padding:8px 0;color:#666"><strong>Service</strong></td><td>${
              service || "—"
            }</td></tr>
            <tr><td style="padding:8px 0;color:#666"><strong>Budget</strong></td><td>${
              budget || "—"
            }</td></tr>
          </table>
          <div style="margin-top:24px;padding:16px;background:#f5f5f5;border-left:4px solid #111">
            <strong>Message :</strong><br/><br/>
            ${message.replace(/\n/g, "<br/>")}
          </div>
          <p style="margin-top:24px;color:#999;font-size:12px">
            Envoyé depuis le formulaire de contact de supaco.digital
          </p>
        </div>
      `,
    });
    mailSent = true;
  } catch (err) {
    console.error("Email error:", err.message);
  }

  if (mailSent)
    return res.json({ success: true, message: "Message envoyé avec succès." });
  return res.status(500).json({ error: "Erreur lors de l'envoi de l'email." });
});

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((_, res) => res.status(404).json({ error: "Route introuvable." }));

// ─── Error handler global ────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  if (err.status === 413 || err.type === "entity.too.large") {
    return res
      .status(413)
      .json({ error: "Payload trop volumineux (max 20kb)." });
  }
  if (!isTest) console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Erreur serveur interne." });
});

export default app;
