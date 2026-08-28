import { motion } from 'framer-motion';
import Icon from '../ui/Icon';
import RevealText from '../ui/RevealText';
import { ECOSYSTEM } from '../../data/site';
import { cardVariants, containerVariants, VIEWPORT } from '../../utils/easings';

export default function Ecosystem() {
  return (
    <section className="section theme-light" id="ecosistema" style={{ paddingTop: 0 }}>
      <div className="container container--wide">
        <div className="section-head">
          <div className="section-head__main">
            <span className="eyebrow">Un ecosistema digital para la salud</span>
            <RevealText tag="h2" className="section-title section-title--wide" highlight={['integración']}>
              Diez productos que trabajan en perfecta integración
            </RevealText>
          </div>
          <p className="section-lead" style={{ flex: '0 1 400px' }}>
            Cada módulo funciona por sí solo, pero juntos comparten datos, usuarios y procesos.
            Una sola plataforma, cero islas de información.
          </p>
        </div>

        <motion.div
          className="eco__grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {ECOSYSTEM.map((item) => (
            <motion.a
              key={item.name}
              href="#soluciones"
              className="eco-card"
              variants={cardVariants}
              style={{ '--eco-color': item.color } as React.CSSProperties}
            >
              <span className="eco-card__icon">
                <Icon name={item.icon} size={19} />
              </span>
              <span>
                <span className="eco-card__name">{item.name}</span>
                <span className="eco-card__desc">{item.desc}</span>
              </span>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
