import { motion } from 'framer-motion';
import Icon from '../ui/Icon';
import { Reveal } from '../ui/RevealText';
import { INDUSTRIES } from '../../data/site';
import { cardVariants, containerVariants, VIEWPORT } from '../../utils/easings';

/**
 * Industrias a las que transformamos (brief seccion 8).
 * El brief pide que quede independiente de la seccion de resultados.
 */
export default function Industries() {
  return (
    <section className="section theme-light industries" id="industrias">
      <div className="container container--wide">
        <Reveal y={22}>
          <span className="eyebrow eyebrow--tech">Industrias a las que transformamos</span>
        </Reveal>

        <motion.div
          className="industries__strip"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {INDUSTRIES.map((item) => (
            <motion.a
              className="industry"
              key={item.name}
              href="#industrias"
              variants={cardVariants}
              style={{ '--ind': item.color } as React.CSSProperties}
            >
              <span className="industry__icon">
                <Icon name={item.icon} size={26} strokeWidth={1.5} />
              </span>
              <span className="industry__name">{item.name}</span>
            </motion.a>
          ))}
        </motion.div>

        <div className="industries__foot">
          <a className="link-arrow link-arrow--tech" href="#industrias">
            Ver todas las industrias
            <Icon name="arrow-right" size={15} strokeWidth={2.2} />
          </a>
        </div>
      </div>
    </section>
  );
}
