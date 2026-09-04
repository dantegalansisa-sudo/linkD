import { motion } from 'framer-motion';
import AnimatedCounter from '../ui/AnimatedCounter';
import Icon from '../ui/Icon';
import { TRUST_STATS } from '../../data/site';
import { EASINGS } from '../../utils/easings';

/** Indicadores de confianza: banda azul marino pegada al hero. */
export default function TrustBand() {
  return (
    <section className="trustband" aria-label="Indicadores de confianza">
      <div className="container container--wide trustband__inner">
        <motion.p
          className="trustband__intro"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: EASINGS.premium }}
        >
          <span className="trustband__intro-icon">
            <Icon name="building" size={30} strokeWidth={1.5} />
          </span>
          Más de 200 instituciones en Latinoamérica confían en nosotros
        </motion.p>

        <div className="trustband__stats">
          {TRUST_STATS.map((stat, i) => (
            <motion.div
              className="trustband__stat"
              key={stat.label}
              style={{ '--stat-color': stat.color } as React.CSSProperties}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.55, delay: 0.1 + i * 0.09, ease: EASINGS.premium }}
            >
              <span className="trustband__icon">
                <Icon name={stat.icon} size={31} strokeWidth={1.5} />
              </span>
              <span className="trustband__text">
                <span className="trustband__value">
                  <AnimatedCounter target={stat.value} prefix="+" suffix={stat.suffix} />
                </span>
                <span className="trustband__label">{stat.label}</span>
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
