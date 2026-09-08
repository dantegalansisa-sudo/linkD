import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { EASINGS } from '../../utils/easings';

/*
  La intro termina cuando acaba el video. Este plazo es solo la red de
  seguridad por si el video no llega a cargar.
*/
const TOPE = 5200;
/* Momento en que los dos conectores se acoplan y salta la chispa. */
const ACOPLE = 2.4;
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
 * Secuencia: aparece el logotipo, se dibuja el lema y debajo dos conectores se
 * acercan hasta acoplarse con un destello, del que sale la energia que recorre
 * el cable. En ese destello el logotipo se enciende, para que la animacion y
 * la marca cuenten lo mismo.
 *
 * Se ve una sola vez por sesion y se puede saltar con un clic: una intro en
 * cada carga castiga a quien entra varias veces al dia.
 *
 * El video va en silencio: los navegadores no dejan arrancar con sonido sin
 * que la persona haya interactuado antes con la pagina.
 */
export default function Intro({ onDone }: { onDone: () => void }) {
  const [saliendo, setSaliendo] = useState(false);
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

          <motion.span
            className="intro__tag"
            initial={{ opacity: 0, letterSpacing: '0.62em' }}
            animate={{ opacity: 1, letterSpacing: '0.3em' }}
            transition={{ duration: 0.9, delay: 0.72, ease: EASINGS.premium }}
          >
            CONECTA Y AVANZA
          </motion.span>

          {/*
            El logotipo se enciende justo cuando los conectores se acoplan: es
            lo que une la animacion con la marca.
          */}
          <motion.span
            className="intro__destello"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.85, 0] }}
            transition={{ duration: 1.1, delay: ACOPLE - 0.15, ease: 'easeOut' }}
          />
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
