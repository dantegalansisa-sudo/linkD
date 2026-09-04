import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import TopBar from './components/sections/TopBar';
import Header from './components/sections/Header';
import Footer from './components/sections/Footer';
import ScrollProgress from './components/ui/ScrollProgress';
import BackToTop from './components/ui/BackToTop';
import Intro, { debeVerseIntro } from './components/ui/Intro';
import Icon from './components/ui/Icon';
import Home from './pages/Home';
import ProductoPage from './pages/ProductoPage';
import EcosistemaPage from './pages/EcosistemaPage';
import { CONTACT } from './data/site';

/** Al cambiar de ruta la vista vuelve arriba; si no, se entra a media pagina. */
function AlCambiarDeRuta() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [intro, setIntro] = useState(() => debeVerseIntro());

  // la intro bloquea el scroll mientras se ve
  useEffect(() => {
    document.body.style.overflow = intro ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [intro]);

  return (
    <BrowserRouter>
      <AlCambiarDeRuta />

      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>

      <ScrollProgress />
      <div className="noise-overlay" aria-hidden="true" />

      <AnimatePresence>{intro && <Intro onDone={() => setIntro(false)} />}</AnimatePresence>

      <TopBar />
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/producto/:slug" element={<ProductoPage />} />
        <Route path="/ecosistema/:slug" element={<EcosistemaPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <BackToTop />
      <Footer />

      <motion.a
        className="wa-float"
        href={CONTACT.whatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label="Escríbenos por WhatsApp"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.6, type: 'spring', stiffness: 260, damping: 18 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
      >
        <Icon name="whatsapp" size={26} />
      </motion.a>
    </BrowserRouter>
  );
}
