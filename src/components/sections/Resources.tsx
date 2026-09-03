import { motion } from 'framer-motion';
import Icon from '../ui/Icon';
import { RESOURCES } from '../../data/site';
import { cardVariants, containerVariants, VIEWPORT } from '../../utils/easings';

/** Recursos para seguir innovando (brief seccion 10). */
export default function Resources() {
  return (
    <section className="section theme-light resources" id="recursos">
      <div className="container container--wide">
        <div className="resources__head">
          <span className="eyebrow eyebrow--tech">Recursos para seguir innovando</span>
          <a className="link-arrow link-arrow--tech" href="#recursos">
            Ver todos los recursos
            <Icon name="arrow-right" size={15} strokeWidth={2.2} />
          </a>
        </div>

        <motion.div
          className="resources__grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {RESOURCES.map((item) => (
            <motion.a className="resource" key={item.title} href={item.href} variants={cardVariants}>
              <div className="resource__body">
                <h3 className="resource__title">{item.title}</h3>
                <p className="resource__text">{item.text}</p>
                <span className="link-arrow link-arrow--tech resource__cta">
                  {item.cta}
                  <Icon name="arrow-right" size={14} strokeWidth={2.2} />
                </span>
              </div>

              <div className="resource__media">
                <img src={item.image} alt={item.alt} loading="lazy" />
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
