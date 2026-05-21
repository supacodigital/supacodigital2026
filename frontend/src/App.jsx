import { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";

const Chatbot = lazy(() => import("./components/Chatbot"));

export default function App() {
  // Séquence d'intro :
  //  'logo'    : gros logo seul au centre (flou → net)
  //  'forming' : le logo rétrécit, la pill se forme autour
  //  'rising'  : la pill monte se replacer en haut (+ s'élargit)
  //  'done'    : navbar complète, liens déployés
  const [intro, setIntro] = useState("logo");

  const loaded = intro === "done";

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      const t = setTimeout(() => setIntro("done"), 200);
      return () => clearTimeout(t);
    }
    const t1 = setTimeout(() => setIntro("forming"), 700);
    const t2 = setTimeout(() => setIntro("rising"), 1280);
    const t3 = setTimeout(() => setIntro("done"), 2080);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  return (
    <Suspense fallback={null}>
      {intro !== "done" && <Loader phase={intro} />}

      <Navbar intro={intro} />

      <Routes>
        <Route
          path="/"
          element={<Home introDone={loaded} />}
        />
        <Route path="/a-propos" element={<AboutPage />} />
      </Routes>

      <Footer />
      <Chatbot />
      <ScrollToTop />
    </Suspense>
  );
}
