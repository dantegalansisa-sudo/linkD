import { motion } from 'framer-motion';
import AnimatedCounter from '../ui/AnimatedCounter';
import Icon from '../ui/Icon';
import { Reveal } from '../ui/RevealText';
import { RESULTS } from '../../data/site';
import { EASINGS } from '../../utils/easings';

/**
 * Resultados que hablan por si solos (brief seccion 9).
 * Va en su propia seccion, separada de Industrias, como pide el brief.
 */
export default function Results() {
  return (
    <section className="section theme-light results" id="resultados">
      <div className="container container--wide">
        <Reveal y={22}>
          <span className="eyebrow eyebrow--tech">Resultados que hablan por sí solos</span>
        </Reveal>

        <motion.div
          className="results__panel"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75, ease: EASINGS.premium }}
        >
          {RESULTS.map((item, i) => (
            <motion.div
              className="result"
              key={item.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, delay: 0.12 + i * 0.1, ease: EASINGS.premium }}
            >
              <span className="result__icon">
                <Icon name={item.icon} size={26} strokeWidth={1.5} />
              </span>
              <p className="result__label">{item.label}</p>

              <span className="result__trend" data-trend={item.trend} aria-hidden="true">
                {item.trend === 'down' && '↓'}
                {item.trend === 'up' && '↑'}
              </span>
              <span className="result__value">
                <AnimatedCounter target={item.value} suffix="%" />
              </span>

              <span className="result__note">{item.note}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
