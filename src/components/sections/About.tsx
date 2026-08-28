import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '../ui/Icon';
import MagneticButton from '../ui/MagneticButton';
import RevealText, { Reveal } from '../ui/RevealText';
import Scene from '../ui/Scene';
import { useParallax } from '../../hooks/useParallax';
import { ABOUT_TABS } from '../../data/site';
import { EASINGS } from '../../utils/easings';

export default function About() {
  const [active, setActive] = useState(0);
  const tab = ABOUT_TABS[active];
  const { ref, y } = useParallax(46);

  return (
    <section className="section theme-light" id="empresa">
      <div className="tech-grid tech-grid--light" />
      <div className="container container--wide">
        <div className="about__grid">
          <div>
            <div className="about__tabs" role="tablist">
              {ABOUT_TABS.map((item, i) => (
                <button
                  key={item.key}
                  role="tab"
                  type="button"
                  aria-selected={active === i}
                  className={`about__tab${active === i ? ' is-active' : ''}`}
                  onClick={() => setActive(i)}
                >
                  {item.tab}
                  {active === i && (
                    <motion.span
                      className="about__tab-underline"
                      layoutId="about-underline"
                      transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                className="about__panel"
                key={tab.key}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.45, ease: EASINGS.premium }}
              >
                <motion.div className="about__media" ref={ref} style={{ y }}>
                  <Scene variant={tab.scene} />
                </motion.div>

                <div>
                  <RevealText tag="h2" className="about__h" highlight={['propósito,', 'líderes', 'mañana']}>
                    {tab.title}
                  </RevealText>
                  <p className="about__p">{tab.text}</p>

                  <div className="about__points">
                    {tab.points.map((point, i) => (
                      <motion.div
                        className="about__point"
                        key={point}
                        initial={{ opacity: 0, x: -14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 + i * 0.09, ease: EASINGS.premium }}
                      >
                        <Icon name="check-circle" size={17} strokeWidth={1.8} />
                        {point}
                      </motion.div>
                    ))}
                  </div>

                  <div style={{ marginTop: '1.9rem' }}>
                    <a className="link-arrow" href="#empresa">
                      Conoce más sobre nuestra historia
                      <Icon name="arrow-right" size={15} strokeWidth={2.2} />
                    </a>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <Reveal delay={0.15}>
            <Promo />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Promo() {
  return (
    <div className="promo">
      <div className="promo__glow" />
      <span className="promo__kicker">Nueva versión disponible</span>
      <h3 className="promo__title">
        ¿Ya viste la <em>nueva versión</em> de SIEGIX CRM?
      </h3>
      <p className="promo__p">Más moderna, más rápida y más poderosa. Rediseñada de cero junto a nuestros clientes.</p>

      <div className="promo__mock">
        <motion.div
          animate={{ y: [0, -9, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Scene variant="referrers" className="promo__scene" />
        </motion.div>
      </div>

      <MagneticButton href="#ecosistema" className="btn btn--primary btn--block" block strength={0.2}>
        Conócela ahora
        <span className="btn__arrow">
          <Icon name="arrow-right" size={16} strokeWidth={2.2} />
        </span>
      </MagneticButton>
    </div>
  );
}
