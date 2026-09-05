import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Foto from '../../components/ui/Foto';
import Icon from '../../components/ui/Icon';
import { Reveal } from '../../components/ui/RevealText';
import { CifrasEmpresa } from '../../components/empresa/Marco';
import { VALORES } from '../../data/empresa';
import { cardVariants, containerVariants, VIEWPORT } from '../../utils/easings';

/** Nuestros valores: seis tarjetas y una banda de cifras. */
export default function Valores() {
  return (
    <>
      <section className="ei-seccion">
        <div className="container container--wide">
          <motion.div
            className="ei-valores"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            {VALORES.tarjetas.map((t) => (
              <motion.article
                className="ei-valor"
                key={t.titulo}
                variants={cardVariants}
                style={{ '--c': t.color } as React.CSSProperties}
              >
                <span className="ei-valor__icono">
                  <Icon name={t.icon} size={24} strokeWidth={1.7} />
                </span>
                <div className="ei-valor__texto">
                  <h3>{t.titulo}</h3>
                  <p>{t.texto}</p>
                </div>
                <div className="ei-valor__media">
                  <Foto src={t.imagen} alt={t.imagenAlt} ratio="16 / 9" />
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="ei-definen">
        <div className="container container--wide ei-definen__grid">
          <Reveal y={24}>
            <span className="ei-regla" aria-hidden="true" />
            <h2 className="ei-definen__titulo">
              {VALORES.definenTitulo}
              <em>{VALORES.definenTituloAccent}</em>
            </h2>
            <p className="ei-definen__texto">{VALORES.definenTexto}</p>
            <Link className="btn btn--square ei-definen__cta" to="/empresa/acerca-de-nosotros">
              <span className="btn__label">
                {VALORES.definenCta}
                <Icon name="arrow-right" size={15} strokeWidth={2.2} />
              </span>
            </Link>
          </Reveal>

          <CifrasEmpresa cifras={VALORES.cifras} />
        </div>
      </section>
    </>
  );
}
