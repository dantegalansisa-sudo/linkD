import { motion } from 'framer-motion';
import Icon from '../ui/Icon';
import RevealText from '../ui/RevealText';
import { PRODUCTS } from '../../data/site';
import { cardVariants, containerVariants, VIEWPORT } from '../../utils/easings';

/** Nuestros productos y plataformas (brief seccion 7). */
export default function Products() {
  return (
    <section className="section theme-light products" id="productos">
      <div className="container container--wide">
        <motion.div
          className="products__panel"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="products__head">
            <span className="eyebrow eyebrow--center">Nuestros productos y plataformas</span>
            <RevealText tag="h2" className="products__title">
              Tecnología que impulsa mejores decisiones y mejores resultados
            </RevealText>
          </div>

          <motion.div
            className="products__grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            {PRODUCTS.map((item) => (
              <motion.a
                className="product-card"
                key={item.name}
                href={item.href}
                variants={cardVariants}
                style={{ '--glow': item.color } as React.CSSProperties}
              >
                <span className="product-card__icon">
                  <Icon name={item.icon} size={24} strokeWidth={1.6} />
                </span>
                <span className="product-card__category">{item.category}</span>
                <h3 className="product-card__name">{item.name}</h3>
                <p className="product-card__text">{item.text}</p>
                <span className="product-card__cta">
                  Ver más
                  <Icon name="arrow-right" size={14} strokeWidth={2.2} />
                </span>
              </motion.a>
            ))}
          </motion.div>

          <div className="products__foot">
            <a className="link-arrow products__all" href="#productos">
              Ver todos los productos
              <Icon name="arrow-right" size={15} strokeWidth={2.2} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
