import { motion } from 'framer-motion';
import Icon from '../ui/Icon';
import MagneticButton from '../ui/MagneticButton';
import RevealText from '../ui/RevealText';
import { AI_PRODUCTS } from '../../data/site';
import { cardVariants, containerVariants, EASINGS, VIEWPORT } from '../../utils/easings';

export default function AISection() {
  return (
    <section className="section theme-dark" id="ia">
      <div className="container container--wide">
        <div className="ai">
          <div className="tech-grid" />
          <motion.div
            className="aurora aurora--teal"
            style={{ width: 420, height: 420, left: '10%', bottom: '-30%' }}
            animate={{ x: [0, 60, 0], y: [0, -30, 0] }}
            transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="ai__inner">
            <div>
              <span className="eyebrow">Inteligencia artificial aplicada a la salud</span>
              <RevealText tag="h2" className="section-title" highlight={['IA']} highlightTech={['decisiones']}>
                IA que impulsa mejores decisiones en cada proceso
              </RevealText>
              <p className="section-lead">
                Integramos inteligencia artificial en nuestros servicios para optimizar la atención,
                automatizar tareas repetitivas y generar información valiosa para quien decide.
              </p>

              <div style={{ marginTop: '2.1rem' }}>
                <MagneticButton href="#contacto" className="btn btn--primary">
                  Conocer más sobre IA
                  <span className="btn__arrow">
                    <Icon name="arrow-right" size={16} strokeWidth={2.2} />
                  </span>
                </MagneticButton>
              </div>
            </div>

            <motion.div
              className="ai__cards"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
            >
              {AI_PRODUCTS.map((item) => (
                <motion.article
                  className="ai-card"
                  key={item.name}
                  variants={cardVariants}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3, ease: EASINGS.smooth }}
                  style={{ '--ai-color': item.color } as React.CSSProperties}
                >
                  <span className="ai-card__orb">
                    <Icon name={item.icon} size={22} strokeWidth={1.7} />
                  </span>
                  <h3 className="ai-card__name">{item.name}</h3>
                  <p className="ai-card__desc">{item.desc}</p>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
