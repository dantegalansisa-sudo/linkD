import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { EASINGS } from '../../utils/easings';

const TOTAL = 3500;
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
 * Secuencia: aparece el logotipo, se dibuja el lema, dos cables de red entran
 * por los lados, se acoplan en el centro con un destello, un pulso de datos
 * sube por el cable hasta el logo y este se abalanza sobre el espectador.
 *
 * Se ve una sola vez por sesion y se puede saltar con un clic: una intro de
 * 3,5 segundos en cada carga castiga a quien entra varias veces al dia.
 */
export default function Intro({ onDone }: { onDone: () => void }) {
  const [saliendo, setSaliendo] = useState(false);

  const terminar = () => {
    if (saliendo) return;
    setSaliendo(true);
    marcarVista();
    onDone();
  };

  useEffect(() => {
    const t = window.setTimeout(terminar, TOTAL);
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

      <motion.div
        className="intro__stage"
        /*
          Acercamiento final. Antes de lanzarse hacia el espectador se encoge
          un pelin: sin esa anticipacion el zoom se lee como un corte.
        */
        animate={{ scale: [1, 1, 0.94, 11], opacity: [1, 1, 0] }}
        transition={{
          scale: {
            duration: TOTAL / 1000,
            times: [0, 0.62, 0.72, 1],
            ease: ['linear', 'easeOut', EASINGS.cinematic],
          },
          opacity: { duration: TOTAL / 1000, times: [0, 0.9, 1], ease: 'linear' },
        }}
      >
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
        </div>

        <Cables />
      </motion.div>

      <button className="intro__skip" type="button" onClick={terminar}>
        Saltar
      </button>
    </motion.div>
  );
}

/** Un conector RJ45 con su cable, apuntando a la derecha. Mide 172 x 96. */
function Conector() {
  return (
    <g>
      {/* cable */}
      <rect x="-60" y="46" width="164" height="26" rx="13" fill="#1e2c48" />
      <rect x="-60" y="52" width="164" height="6" rx="3" fill="#33486f" />
      {/* cuerpo del conector */}
      <rect x="96" y="30" width="70" height="58" rx="7" fill="#eef2f9" />
      <rect x="104" y="36" width="54" height="20" rx="4" fill="#cfd9ec" />
      {/* pestaña de anclaje */}
      <path d="M112 30 L116 14 L142 14 L146 30 Z" fill="#dbe3f1" />
      {/* pines */}
      <g fill="#e8a33d">
        <rect x="166" y="38" width="7" height="13" rx="2" />
        <rect x="166" y="55" width="7" height="13" rx="2" />
        <rect x="166" y="72" width="7" height="10" rx="2" />
      </g>
    </g>
  );
}

/** Dos conectores de red que entran por los lados y se acoplan en el centro. */
function Cables() {
  const conecta = 2.0;
  const entrada = { duration: 1.5, delay: 0.85, times: [0, 0.82, 1], ease: EASINGS.premium };

  return (
    <svg className="intro__cables" viewBox="0 0 360 100" aria-hidden="true">
      <motion.g initial={{ x: -320 }} animate={{ x: [-320, -10, 0] }} transition={entrada}>
        <g transform="translate(7,0)">
          <Conector />
        </g>
      </motion.g>

      <motion.g initial={{ x: 320 }} animate={{ x: [320, 10, 0] }} transition={entrada}>
        <g transform="translate(353,0) scale(-1,1)">
          <Conector />
        </g>
      </motion.g>

      {/* destello del acople */}
      <motion.circle
        cx="180"
        cy="59"
        r="12"
        fill="#ffdcb0"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1, 7], opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, delay: conecta, ease: 'easeOut' }}
        style={{ transformOrigin: '180px 59px' }}
      />

      {/* pulsos de datos que salen del acople por ambos cables */}
      {[0, 1, 2, 3].map((i) => (
        <motion.circle
          key={i}
          cy="59"
          r="5"
          fill="#ffb166"
          initial={{ cx: 180, opacity: 0 }}
          animate={{ cx: [180, i % 2 === 0 ? -20 : 380], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.9, delay: conecta + 0.1 + i * 0.1, ease: 'easeOut' }}
        />
      ))}
    </svg>
  );
}
