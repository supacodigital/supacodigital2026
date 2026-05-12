import { useState, useRef, lazy, Suspense } from "react";
import "./App.css";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import CodeEditor from "./components/CodeEditor";
import Process from "./components/Process";
import Services from "./components/Services";
import Projects from "./components/Projects";
import Testimonials from "./components/Testimonials";
import Zone from "./components/Zone";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import StickyBar from "./components/StickyBar";

const Chatbot = lazy(() => import("./components/Chatbot"));
const CalendlyModal = lazy(() => import("./components/CalendlyModal"));

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [calendlyOpen, setCalendlyOpen] = useState(false);
  const navLogoRef = useRef(null);

  return (
    <Suspense fallback={null}>
      {!loaded && (
        <Loader onDone={() => setLoaded(true)} navLogoRef={navLogoRef} />
      )}
      {calendlyOpen && <CalendlyModal onClose={() => setCalendlyOpen(false)} />}
      <Navbar
        navLogoRef={navLogoRef}
        onOpenCalendly={() => setCalendlyOpen(true)}
      />
      <main>
        <Hero onOpenCalendly={() => setCalendlyOpen(true)} />
        <div className="divider divider--dark" />
        <About />
        <div className="divider divider--dark" />
        <CodeEditor />
        <div className="divider divider--light" />
        <Services onOpenCalendly={() => setCalendlyOpen(true)} />
        <div className="divider" />
        <Projects />
        <div className="divider" />
        <Testimonials />
        <div className="divider" />
        <Zone />
        <div className="divider" />
        <FAQ />
        <div className="divider" />
        <Contact onOpenCalendly={() => setCalendlyOpen(true)} />
      </main>
      <Footer />
      <Chatbot />
      <ScrollToTop />
      <StickyBar onOpenCalendly={() => setCalendlyOpen(true)} />
    </Suspense>
  );
}
