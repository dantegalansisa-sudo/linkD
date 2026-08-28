import { motion } from 'framer-motion';
import AnimatedCounter from '../ui/AnimatedCounter';
import Icon from '../ui/Icon';
import { STATS } from '../../data/site';
import { EASINGS } from '../../utils/easings';

export default function Stats() {
  return (
    <div className="stats">
      <div className="container container--wide">
        <motion.div
          className="stats__panel"
          initial={{ opacity: 0, y: 44 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.85, ease: EASINGS.premium }}
        >
          <p className="stats__intro">
            <b>Más de 65%</b>
            de los envíos de LINKDICOM llegan a clientes en el exterior.
          </p>

          {STATS.map((stat, i) => (
            <motion.div
              className="stat"
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.55, delay: 0.12 + i * 0.07, ease: EASINGS.premium }}
            >
              <span className="stat__icon">
                <Icon name={stat.icon} size={18} />
              </span>
              <span>
                <span className="stat__value">
                  <AnimatedCounter
                    target={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                  />
                </span>
                <span className="stat__label">{stat.label}</span>
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
