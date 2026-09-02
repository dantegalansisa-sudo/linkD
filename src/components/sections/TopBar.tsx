import { motion } from 'framer-motion';
import Icon from '../ui/Icon';
import { EASINGS } from '../../utils/easings';

/**
 * Barra de obra social. Identidad propia (amarilla) e independiente del
 * resto de la web, tal como pide el brief.
 */
export default function TopBar() {
  return (
    <motion.div
      className="topbar"
      initial={{ y: -44, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASINGS.premium }}
    >
      <div className="container container--wide topbar__inner">
        <div className="topbar__brand">
          <span className="topbar__mark">
            <Icon name="heart" size={15} strokeWidth={2} />
          </span>
          <span>
            <small>Plan de asistencia social</small>
            Virginia Toca
          </span>
        </div>

        <div className="topbar__items">
          <span className="topbar__item topbar__item--strong">50 familias</span>
          <span className="topbar__item">
            <Icon name="gift" size={15} strokeWidth={1.7} />
            al año con artículos escolares, alimentos y medicinas
          </span>
          <span className="topbar__item topbar__item--strong">Tu compra ayuda a transformar vidas</span>
        </div>

        <motion.a
          className="topbar__cta"
          href="#obra-social"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="topbar__cta-long">Conocer más sobre nuestra obra social</span>
          <span className="topbar__cta-short">Obra social</span>
          <Icon name="arrow-right" size={14} strokeWidth={2.2} />
        </motion.a>
      </div>
    </motion.div>
  );
}
