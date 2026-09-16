import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { EASINGS } from '../../utils/easings';
import { imagen } from '../../contenido/store';

/*
  La intro termina cuando acaba el video. Este plazo es solo la red de
  seguridad por si el video no llega a cargar.
*/
const TOPE = 4400;
/*
  Segundo en que salta la chispa dentro del acoplador: es cuando los dos
  conectores quedan unidos y el cable se enciende. El lema entra ahi.
*/
const ACOPLE = 2.05;
const KEY = 'linkdicom-intro-vista';

/** ¿Toca mostrar la intro? Solo la primera vez de cada sesion. */
export function debeVerseIntro() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    return sessionStorage.getItem(KEY) !== '1';
  } catch {
    // navegacion privada o cookies bloqueadas: se muestra y no se recuerda
    return true;
  }
}

function marcarVista() {
  try {
    sessionStorage.setItem(KEY, '1');
  } catch {
    /* sin almacenamiento: se volvera a ver, no es grave */
  }
}

/**
 * Intro de carga.
 *
 * Secuencia: se revela el logotipo oficial (la palabra, en su version para
 * fondo oscuro) y debajo dos conectores se acercan hasta acoplarse. Justo
 * cuando se unen y salta la chispa aparece el lema "CONECTA Y AVANZA" del
 * propio logotipo, de modo que la frase sea la consecuencia de lo que se ve:
 * los cables conectan y la marca lo dice.
 *
 * Se ve una sola vez por sesion y se puede saltar con un clic: una intro en
 * cada carga castiga a quien entra varias veces al dia.
 *
 * El video va en silencio: los navegadores no dejan arrancar con sonido sin
 * que la persona haya interactuado antes con la pagina.
 */
export default function Intro({ onDone }: { onDone: () => void }) {
  const [saliendo, setSaliendo] = useState(false);
  const [acoplado, setAcoplado] = useState(false);
  const video = useRef<HTMLVideoElement>(null);

  const terminar = () => {
    if (saliendo) return;
    setSaliendo(true);
    marcarVista();
    onDone();
  };

  useEffect(() => {
    const t = window.setTimeout(terminar, TOPE);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
    El lema se engancha al propio video, no a un temporizador: si el video
    tarda en arrancar (conexion lenta, pestana en segundo plano) la frase
    esperaria igualmente a que los conectores se unan. El plazo de reserva
    cubre el caso de que el video no llegue a reproducirse.
  */
  useEffect(() => {
    let cuadro = 0;
    const mirar = () => {
      const v = video.current;
      if (v && v.currentTime >= ACOPLE) {
        setAcoplado(true);
        return;
      }
      cuadro = window.requestAnimationFrame(mirar);
    };
    cuadro = window.requestAnimationFrame(mirar);

    const reserva = window.setTimeout(() => setAcoplado(true), ACOPLE * 1000 + 750);
    return () => {
      window.cancelAnimationFrame(cuadro);
      window.clearTimeout(reserva);
    };
  }, []);

  return (
    <motion.div
      className="intro"
      role="presentation"
      onClick={terminar}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: EASINGS.premium } }}
    >
      <div className="intro__glow" />

      <div className="intro__stage">
        <div className="intro__logo">
          {/* la palabra se descubre de izquierda a derecha, como si se escribiera */}
          <motion.img
            className="intro__word"
            src={imagen('/brand/intro-logo.webp')}
            alt="LINKDICOM"
            width={1200}
            height={125}
            initial={{ opacity: 0, y: 14, clipPath: 'inset(0 100% 0 0)' }}
            animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0% 0 0)' }}
            transition={{ duration: 1.1, delay: 0.15, ease: EASINGS.premium }}
          />

          {/*
            El lema espera al acople. Ocupa su sitio desde el principio, aunque
            este invisible, para que el logotipo no se mueva al aparecer.
          */}
          <motion.img
            className="intro__tag"
            src={imagen('/brand/intro-lema.webp')}
            alt="Conecta y avanza"
            width={1200}
            height={37}
            initial={{ opacity: 0, scaleX: 1.18 }}
            animate={acoplado ? { opacity: 1, scaleX: 1 } : undefined}
            transition={{ duration: 0.8, ease: EASINGS.premium }}
          />
        </div>

        <motion.video
          ref={video}
          className="intro__video"
          src={imagen('/video/intro-cables.mp4')}
          poster={imagen('/video/intro-poster.jpg')}
          autoPlay
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          onEnded={terminar}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.25, ease: EASINGS.premium }}
        />
      </div>

      <button className="intro__skip" type="button" onClick={terminar}>
        Saltar
      </button>
    </motion.div>
  );
}
