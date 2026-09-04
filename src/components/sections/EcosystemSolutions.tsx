import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../ui/Icon';
import RevealText, { Reveal } from '../ui/RevealText';
import { SOLUTIONS } from '../../data/site';
import { cardVariants, containerVariants, mediaVariants, VIEWPORT } from '../../utils/easings';

/** Nuestro ecosistema (brief seccion 6). */
export default function EcosystemSolutions() {
  return (
    <section className="section theme-light eco-sol" id="ecosistema">
      <div className="container container--wide">
        <div className="section-head eco-sol__head">
          <div className="section-head__main">
            <Reveal y={22}>
              <span className="eyebrow">Nuestro ecosistema</span>
            </Reveal>
            <RevealText tag="h2" className="section-title">
              Soluciones para cada necesidad del ecosistema de salud
            </RevealText>
          </div>

          <Reveal className="eco-sol__intro" delay={0.12} y={30}>
            <p>
              Nuestras soluciones se adaptan a cada tipo de institución, integrando procesos y
              mejorando la experiencia del paciente.
            </p>
            <a className="link-arrow link-arrow--tech" href="#ecosistema">
              Ver todas las soluciones
              <Icon name="arrow-right" size={15} strokeWidth={2.2} />
            </a>
          </Reveal>
        </div>

        <motion.div
          className="eco-sol__grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {SOLUTIONS.map((item) => (
            <motion.article className="solution-card" key={item.title} variants={cardVariants}>
              <div className="solution-card__head">
                <span className="solution-card__badge" style={{ '--badge': item.color } as React.CSSProperties}>
                  <Icon name={item.icon} size={19} strokeWidth={1.7} />
                </span>
                <h3 className="solution-card__title">{item.title}</h3>
              </div>

              <p className="solution-card__text">{item.text}</p>

              <a className="link-arrow link-arrow--tech solution-card__cta" href={item.href}>
                {item.cta}
                <Icon name="arrow-right" size={14} strokeWidth={2.2} />
              </a>

              <div className="solution-card__media">
                <motion.img src={item.image} alt={item.alt} loading="lazy" variants={mediaVariants} />
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
