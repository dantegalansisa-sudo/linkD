import { motion } from 'framer-motion';
import Icon from '../ui/Icon';
import { EASINGS } from '../../utils/easings';

/**
 * Barra de obra social. Identidad propia (amarilla) e independiente del
 * resto de la web, tal como pide el brief.
 *
 * El mensaje va en caja baja y no en versales: en mayusculas, a este tamano
 * y con esta longitud, la linea se vuelve dificil de leer de un vistazo.
 */
export default function TopBar() {
  return (
    <motion.div
      className="topbar"
      initial={{ y: -54, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASINGS.premium }}
    >
      <div className="container container--wide topbar__inner">
        <div className="topbar__brand">
          <span className="topbar__mark">
            <Icon name="heart" size={19} strokeWidth={2} />
          </span>
          <span>
            <small>Plan de asistencia social</small>
            Virginia Toca
          </span>
        </div>

        <p className="topbar__message">
          Ayudamos a <b>50 familias</b> todos los años con útiles escolares, alimentos y medicinas
        </p>

        <motion.a
          className="topbar__cta"
          href="#obra-social"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="topbar__cta-long">Conocer más sobre nuestra obra social</span>
          <span className="topbar__cta-short">Obra social</span>
          <Icon name="arrow-right" size={15} strokeWidth={2.2} />
        </motion.a>
      </div>
    </motion.div>
  );
}
