import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TopBar from './components/sections/TopBar';
import Header from './components/sections/Header';
import Hero from './components/sections/Hero';
import TrustBand from './components/sections/TrustBand';
import News from './components/sections/News';
import Products from './components/sections/Products';
import EcosystemSolutions from './components/sections/EcosystemSolutions';
import Industries from './components/sections/Industries';
import Results from './components/sections/Results';
import Resources from './components/sections/Resources';
import Band from './components/sections/Band';
import CTASection from './components/sections/CTASection';
import Footer from './components/sections/Footer';
import ScrollProgress from './components/ui/ScrollProgress';
import BackToTop from './components/ui/BackToTop';
import Intro, { debeVerseIntro } from './components/ui/Intro';
import Icon from './components/ui/Icon';
import { CONTACT } from './data/site';

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
    <>
      <a className="skip-link" href="#soluciones">
        Saltar al contenido
      </a>

      <ScrollProgress />
      <div className="noise-overlay" aria-hidden="true" />

      <AnimatePresence>{intro && <Intro onDone={() => setIntro(false)} />}</AnimatePresence>

      <TopBar />
      <Header />

      <main>
        <Hero />
        <TrustBand />
        <News />
        <EcosystemSolutions />
        <Products />
        <Industries />
        <Results />
        <Resources />
        <CTASection />
        {/* Pendientes del brief: el texto del ticker (12) y el footer nuevo (13) */}
        <Band />
      </main>

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
    </>
  );
}
