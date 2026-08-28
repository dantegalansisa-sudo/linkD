import { motion } from 'framer-motion';
import Icon from '../ui/Icon';
import MagneticButton from '../ui/MagneticButton';
import RevealText from '../ui/RevealText';
import Scene from '../ui/Scene';
import { useSpotlight } from '../../hooks/useSpotlight';
import { MODULES, SOLUTIONS } from '../../data/site';
import { cardVariants, containerVariants, VIEWPORT } from '../../utils/easings';

export default function Solutions() {
  const spot = useSpotlight();

  return (
    <section className="section theme-light" id="soluciones" style={{ paddingTop: 0 }}>
      <div className="container container--wide">
        <div className="section-head">
          <div className="section-head__main">
            <span className="eyebrow">Soluciones inteligentes para cada necesidad</span>
            <RevealText tag="h2" className="section-title" highlight={['ecosistema']}>
              Del ecosistema de salud a resultados reales
            </RevealText>
          </div>
          <a className="link-arrow" href="#soluciones">
            Ver todas las soluciones
            <Icon name="arrow-right" size={15} strokeWidth={2.2} />
          </a>
        </div>

        <motion.div
          className="sol__grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {SOLUTIONS.map((item) => (
            <motion.article className="sol-card card" key={item.title} variants={cardVariants} onMouseMove={spot}>
              <span className="card__spot" />
              <div className="sol-card__top">
                <span className="card__icon">
                  <Icon name={item.icon} size={20} />
                </span>
                <h3 className="sol-card__title">{item.title}</h3>
              </div>
              <p className="sol-card__text">{item.text}</p>
              <a className="link-arrow" href="#soluciones">
                Ver soluciones
                <Icon name="arrow-right" size={14} strokeWidth={2.2} />
              </a>
              <div className="sol-card__media">
                <Scene variant={item.scene} />
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          className="modules"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {MODULES.map((mod) => (
            <motion.a className="module" href="#ecosistema" key={mod.name} variants={cardVariants}>
              <span className="module__icon">
                <Icon name={mod.icon} size={21} />
              </span>
              <span className="module__name">{mod.name}</span>
              <span className="module__desc">{mod.desc}</span>
            </motion.a>
          ))}
        </motion.div>

        <div className="section__foot">
          <MagneticButton href="#ecosistema" className="btn btn--ghost" strength={0.24}>
            Ver todos los módulos
            <span className="btn__arrow">
              <Icon name="arrow-right" size={16} strokeWidth={2.2} />
            </span>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
