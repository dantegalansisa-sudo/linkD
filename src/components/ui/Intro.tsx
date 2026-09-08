import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { EASINGS } from '../../utils/easings';

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
 * Secuencia: aparece el logotipo y debajo dos conectores se acercan hasta
 * acoplarse. Justo cuando se unen y salta la chispa aparece el lema "CONECTA
 * Y AVANZA", de modo que la frase sea la consecuencia de lo que se ve: los
 * cables conectan y la marca lo dice.
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
          <span className="intro__word">
            {'LINK'.split('').map((c, i) => (
              <motion.span
                key={i}
                className="intro__char intro__char--link"
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.06, ease: EASINGS.premium }}
              >
                {c}
              </motion.span>
            ))}
            {'DICOM'.split('').map((c, i) => (
              <motion.span
                key={i}
                className="intro__char intro__char--dicom"
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.39 + i * 0.06, ease: EASINGS.premium }}
              >
                {c}
              </motion.span>
            ))}
          </span>

          {/*
            El lema espera al acople. Ocupa su sitio desde el principio, aunque
            este invisible, para que el logotipo no se mueva al aparecer.
          */}
          <motion.span
            className="intro__tag"
            initial={{ opacity: 0, letterSpacing: '0.62em' }}
            animate={acoplado ? { opacity: 1, letterSpacing: '0.3em' } : undefined}
            transition={{ duration: 0.8, ease: EASINGS.premium }}
          >
            CONECTA Y AVANZA
          </motion.span>
        </div>

        <motion.video
          ref={video}
          className="intro__video"
          src="/video/intro-cables.mp4"
          poster="/video/intro-poster.jpg"
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
