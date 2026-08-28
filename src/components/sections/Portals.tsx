import { motion } from 'framer-motion';
import Icon from '../ui/Icon';
import MagneticButton from '../ui/MagneticButton';
import RevealText from '../ui/RevealText';
import Scene from '../ui/Scene';
import { useSpotlight } from '../../hooks/useSpotlight';
import { INDUSTRIES, PORTALS } from '../../data/site';
import { cardVariants, containerVariants, VIEWPORT } from '../../utils/easings';

export default function Portals() {
  const spot = useSpotlight();

  return (
    <section className="section theme-light" style={{ paddingTop: 0 }}>
      <div className="container container--wide">
        <div className="section-head">
          <div className="section-head__main">
            <span className="eyebrow">Proyectos exitosos en todos los sectores</span>
            <RevealText tag="h2" className="section-title" highlight={['portal']}>
              Un portal para cada persona del proceso
            </RevealText>
          </div>
          <p className="section-lead" style={{ flex: '0 1 380px' }}>
            Pacientes, médicos referidores, proveedores y tu propio equipo: cada uno con su acceso,
            su información y sus permisos.
          </p>
        </div>

        <motion.div
          className="portal-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {PORTALS.map((item) => (
            <motion.article className="sol-card card" key={item.title} variants={cardVariants} onMouseMove={spot}>
              <span className="card__spot" />
              <div className="sol-card__top">
                <span className="card__icon">
                  <Icon name={item.icon} size={20} />
                </span>
                <h3 className="sol-card__title">{item.title}</h3>
              </div>
              <p className="sol-card__text">{item.text}</p>
              <a className="link-arrow" href="#portales">
                Ver más
                <Icon name="arrow-right" size={14} strokeWidth={2.2} />
              </a>
              <div className="sol-card__media">
                <Scene variant={item.scene} />
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          className="industries"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {INDUSTRIES.map((ind) => (
            <motion.a className="module" href="#soluciones" key={ind.name} variants={cardVariants}>
              <span className="module__icon">
                <Icon name={ind.icon} size={21} />
              </span>
              <span className="module__name">{ind.name}</span>
            </motion.a>
          ))}
        </motion.div>

        <div className="section__foot">
          <MagneticButton href="#soluciones" className="btn btn--ghost" strength={0.24}>
            Ver todas las industrias
            <span className="btn__arrow">
              <Icon name="arrow-right" size={16} strokeWidth={2.2} />
            </span>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
