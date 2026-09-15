import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../ui/Icon';
import { EASINGS } from '../../utils/easings';
import { imagen } from '../../contenido/store';

const PASOS = [
  'Preparando tu información…',
  'Enviando a LINKDICOM…',
  'Procesando tu solicitud…',
  '¡Listo! Te contactaremos pronto.',
];

/** Momento (ms desde que se abre el panel) en que se enciende cada paso. */
const TIEMPOS = [0, 700, 1500];

/**
 * Lo que ve el visitante mientras su formulario viaja al servidor.
 *
 * Los tres primeros pasos avanzan solos con un temporizador; el ultimo lo
 * enciende el formulario cuando el servidor confirma. Sin esto el envio dura
 * medio segundo y el visitante no llega a ver que ha pasado algo.
 */
export default function PanelEnviando({ listo = false }: { listo?: boolean }) {
  const [paso, setPaso] = useState(0);

  useEffect(() => {
    const temporizadores = TIEMPOS.slice(1).map((t, i) => window.setTimeout(() => setPaso(i + 1), t));
    return () => temporizadores.forEach((t) => window.clearTimeout(t));
  }, []);

  const actual = listo ? PASOS.length - 1 : paso;

  return (
    <motion.div
      className="enviando"
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASINGS.premium }}
    >
      <h3 className="enviando__titulo">Enviando tu solicitud…</h3>
      <p className="enviando__nota">
        Por favor no cierres esta página, espera un momento mientras enviamos tu información.
      </p>

      <img
        className="enviando__imagen"
        src={imagen('/img/demo-enviando.webp')}
        alt=""
        aria-hidden="true"
      />

      <ol className="enviando__pasos">
        {PASOS.map((texto, i) => {
          const estado = i < actual ? 'hecho' : i === actual ? 'activo' : 'pendiente';
          return (
            <li key={texto} className={`enviando__paso enviando__paso--${estado}`}>
              <span className="enviando__punto" aria-hidden="true">
                {estado === 'hecho' && <Icon name="check" size={12} strokeWidth={3} />}
              </span>
              {texto}
            </li>
          );
        })}
      </ol>

      <p className="enviando__aviso">
        <Icon name="lightbulb" size={16} strokeWidth={2} />
        <span>
          <b>Estamos transmitiendo tu información de forma segura a nuestros servidores.</b>
          Este proceso solo tomará unos segundos.
        </span>
      </p>
    </motion.div>
  );
}
