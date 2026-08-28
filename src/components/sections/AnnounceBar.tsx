import { motion } from 'framer-motion';
import Icon from '../ui/Icon';
import { EASINGS } from '../../utils/easings';

export default function AnnounceBar() {
  return (
    <motion.div
      className="announce"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASINGS.premium }}
    >
      <div className="container container--wide announce__inner">
        <div className="announce__badge">
          <span className="announce__heart">
            <Icon name="heart" size={14} strokeWidth={2} />
          </span>
          <span>
            <small>Plan de asistencia social</small>
            Virginia Toca
          </span>
        </div>

        <div className="announce__items">
          <span className="announce__item">
            <b>50 familias</b> al año con artículos escolares, alimentos y medicinas
          </span>
          <span className="announce__item">Tu compra ayuda a transformar vidas</span>
        </div>

        <a className="announce__cta" href="#contacto">
          Haz de cada compra una obra
          <Icon name="arrow-right" size={13} strokeWidth={2.2} />
        </a>
      </div>
    </motion.div>
  );
}
