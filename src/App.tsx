import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import TopBar from './components/sections/TopBar';
import Header from './components/sections/Header';
import Footer from './components/sections/Footer';
import ScrollProgress from './components/ui/ScrollProgress';
import BackToTop from './components/ui/BackToTop';
import Intro, { debeVerseIntro } from './components/ui/Intro';
import { ProveedorModales } from './components/modales/Modales';
import Icon from './components/ui/Icon';
import Home from './pages/Home';
import ProductoRouter from './pages/ProductoRouter';
import EcosistemaPage from './pages/EcosistemaPage';
import SectorPage from './pages/SectorPage';
import EmpresaPage from './pages/EmpresaPage';
import { CONTACT } from './data/site';

/*
  Al cambiar de ruta la vista vuelve arriba. Si la ruta trae ancla (por ejemplo
  /#productos, que es como el menu vuelve al home y salta a una seccion), se
  desplaza hasta ella en cuanto la seccion existe en el DOM.
*/
function AlCambiarDeRuta() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    /*
      El navegador restaura por su cuenta la posicion de scroll al cambiar de
      historial, y eso pisaba el salto al inicio. Se gestiona a mano.
    */
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    // la seccion puede no estar montada todavia justo tras el cambio de ruta
    const id = hash.slice(1);
    let intentos = 0;
    const buscar = () => {
      const destino = document.getElementById(id);
      if (destino) {
        destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (intentos++ < 10) {
        window.setTimeout(buscar, 60);
      }
    };
    buscar();
  }, [pathname, hash]);

  return null;
}

/*
  Al navegar de una ficha a otra del mismo tipo (ecosistema -> ecosistema,
  producto -> producto) solo cambia el parametro de la ruta, asi que React
  reutiliza la misma instancia de la pagina: los contenedores con whileInView ya
  se dispararon y las tarjetas nuevas se quedaban en su estado inicial, es decir
  invisibles. Con la clave por ruta la pagina se vuelve a montar y todas las
  animaciones de entrada arrancan limpias.
*/
function Rutas() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/producto/:slug" element={<ProductoRouter />} />
      <Route path="/ecosistema/:slug" element={<EcosistemaPage />} />
      <Route path="/sector/:slug" element={<SectorPage />} />
      <Route path="/empresa/:slug" element={<EmpresaPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
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
      <ProveedorModales>
        <AlCambiarDeRuta />

        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>

        <ScrollProgress />
        <div className="noise-overlay" aria-hidden="true" />

        <AnimatePresence>{intro && <Intro onDone={() => setIntro(false)} />}</AnimatePresence>

        <TopBar />
        <Header />

        <Rutas />

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
      </ProveedorModales>
    </BrowserRouter>
  );
}
