import { useEffect, useId, useRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import Icon from './Icon';
import { EASINGS } from '../../utils/easings';

/**
 * Carcasa de los modales del sitio.
 *
 * Se cierra con Escape, pulsando fuera o con la aspa. Mientras esta abierto
 * bloquea el scroll de la pagina y devuelve el foco al elemento que lo abrio.
 */
export default function Modal({
  titulo,
  onClose,
  ancho = '980px',
  className = '',
  children,
}: {
  /** Se anuncia como nombre del dialogo a los lectores de pantalla. */
  titulo: string;
  onClose: () => void;
  ancho?: string;
  className?: string;
  children: ReactNode;
}) {
  const caja = useRef<HTMLDivElement>(null);
  const idTitulo = useId();

  useEffect(() => {
    const antes = document.activeElement as HTMLElement | null;
    const previo = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // el foco entra en el dialogo para que el teclado no se quede detras
    caja.current?.focus();

    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !caja.current) return;

      const focos = caja.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focos.length) return;
      const primero = focos[0];
      const ultimo = focos[focos.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };

    window.addEventListener('keydown', alPulsar);
    return () => {
      window.removeEventListener('keydown', alPulsar);
      document.body.style.overflow = previo;
      antes?.focus?.();
    };
  }, [onClose]);

  return (
    <motion.div
      className="modal-fondo"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        className={`modal ${className}`.trim()}
        style={{ maxWidth: ancho }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        tabIndex={-1}
        ref={caja}
        initial={{ opacity: 0, y: 26, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 14, scale: 0.98 }}
        transition={{ duration: 0.38, ease: EASINGS.premium }}
      >
        <h2 className="sr-only" id={idTitulo}>
          {titulo}
        </h2>

        <button className="modal__cerrar" type="button" onClick={onClose} aria-label="Cerrar">
          <Icon name="close" size={18} strokeWidth={2.2} />
        </button>

        {children}
      </motion.div>
    </motion.div>
  );
}
