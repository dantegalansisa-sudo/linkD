import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AnnounceBar from './components/sections/AnnounceBar';
import Header from './components/sections/Header';
import Hero from './components/sections/Hero';
import Stats from './components/sections/Stats';
import About from './components/sections/About';
import Ecosystem from './components/sections/Ecosystem';
import Solutions from './components/sections/Solutions';
import Portals from './components/sections/Portals';
import AISection from './components/sections/AISection';
import Band from './components/sections/Band';
import CTASection from './components/sections/CTASection';
import Footer from './components/sections/Footer';
import CustomCursor from './components/ui/CustomCursor';
import ScrollProgress from './components/ui/ScrollProgress';
import Icon from './components/ui/Icon';
import { CONTACT } from './data/site';
import { EASINGS } from './utils/easings';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = window.setTimeout(() => setLoading(false), reduced ? 0 : 1050);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <>
      <a className="skip-link" href="#soluciones">
        Saltar al contenido
      </a>

      <CustomCursor />
      <ScrollProgress />
      <div className="noise-overlay" aria-hidden="true" />

      <AnimatePresence>{loading && <Curtain />}</AnimatePresence>

      <AnnounceBar />
      <Header />

      <main>
        <Hero />
        <Stats />
        <About />
        <Ecosystem />
        <Solutions />
        <Portals />
        <AISection />
        <Band />
        <CTASection />
      </main>

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
    </>
  );
}

function Curtain() {
  return (
    <motion.div
      className="curtain"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.55, ease: EASINGS.premium } }}
    >
      <motion.img
        src="/brand/linkdicom-logo-dark.png"
        alt=""
        initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease: EASINGS.premium }}
      />
      <motion.span
        className="curtain__bar"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.95, ease: EASINGS.smooth }}
      />
    </motion.div>
  );
}
