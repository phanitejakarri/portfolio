import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { TransitionProvider } from "@/components/Transition";
import Home from "@/pages/Home";
import Work from "@/pages/Work";
import Deck from "@/pages/Deck";
import Project from "@/pages/Project";
import Experience from "@/pages/Experience";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";
import { startSmoothScroll } from "@/lib/smooth";

export default function App() {
  useEffect(() => startSmoothScroll(), []);

  return (
    <TransitionProvider>
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/deck" element={<Deck />} />
          <Route path="/work/:slug" element={<Project />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/lab" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </TransitionProvider>
  );
}
