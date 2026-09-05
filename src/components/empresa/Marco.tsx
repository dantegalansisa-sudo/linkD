import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Foto from '../ui/Foto';
import Icon from '../ui/Icon';
import MagneticButton from '../ui/MagneticButton';
import { Reveal } from '../ui/RevealText';
import { useModales } from '../modales/Modales';
import type { CabeceraEmpresa, CierreEmpresa } from '../../data/empresa';
import { cardVariants, containerVariants, EASINGS, VIEWPORT } from '../../utils/easings';

/**
 * Cabecera de las paginas de Empresa: bloque oscuro con la foto a la derecha,
 * titular en dos colores y una frase corta al margen.
 */
export function CabeceraEmpresaBloque({ c }: { c: CabeceraEmpresa & { eyebrow?: string } }) {
  return (
    <section className="ei-hero">
      <div className="ei-hero__media">
        <Foto src={c.imagen} alt={c.imagenAlt} />
        <span className="ei-hero__veil" />
      </div>

      <div className="container container--wide ei-hero__inner">
        <nav className="migas migas--oscuras" aria-label="Ruta de navegación">
          <Link to="/">Inicio</Link>
          <Icon name="chevron-right" size={13} strokeWidth={2} />
          <Link to="/">Empresa</Link>
          <Icon name="chevron-right" size={13} strokeWidth={2} />
          <span aria-current="page">{c.miga}</span>
        </nav>

        {c.eyebrow && (
          <motion.span
            className="ei-hero__eyebrow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASINGS.premium }}
          >
            {c.eyebrow}
          </motion.span>
        )}

        <motion.h1
          className="ei-hero__titulo"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.1, ease: EASINGS.premium }}
        >
          {c.titulo}
          {/* el acento va pegado cuando parte una misma palabra */}
          {c.pegado ? '' : ' '}
          <em>{c.tituloAccent}</em>
        </motion.h1>

        <motion.p
          className="ei-hero__subtitulo"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.42, ease: EASINGS.premium }}
        >
          {c.subtitulo}
        </motion.p>

        <motion.p
          className="ei-hero__intro"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.5, ease: EASINGS.premium }}
        >
          {c.intro}
        </motion.p>

        {c.bullets && (
          <motion.ul className="ei-hero__bullets" variants={containerVariants} initial="hidden" animate="visible">
            {c.bullets.map((b) => (
              <motion.li key={b.label} variants={cardVariants}>
                <Icon name={b.icon} size={24} strokeWidth={1.6} />
                {b.label}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>

      <span className="ei-hero__lema">{c.lema}</span>
    </section>
  );
}

/** Banda de cierre: foto a la izquierda, mensaje y boton, y lista opcional. */
export function CierreEmpresaBloque({ c }: { c: CierreEmpresa }) {
  const { abrirDemo } = useModales();

  const boton =
    c.ctaDestino === 'demo' ? (
      <MagneticButton onClick={() => abrirDemo()} className="btn btn--primary btn--square btn--lg">
        {c.cta}
        <span className="btn__arrow">
          <Icon name="arrow-right" size={17} strokeWidth={2.2} />
        </span>
      </MagneticButton>
    ) : (
      <Link
        className="btn btn--primary btn--square btn--lg"
        to={c.ctaDestino === 'trabaja' ? '/empresa/trabaja-con-nosotros' : '/empresa/contacto'}
      >
        <span className="btn__label">
          {c.cta}
          <span className="btn__arrow">
            <Icon name="arrow-right" size={17} strokeWidth={2.2} />
          </span>
        </span>
      </Link>
    );

  return (
    <section className="ei-cierre">
      <div className="ei-cierre__media">
        <Foto src={c.imagen} alt={c.imagenAlt} />
      </div>

      <Reveal className="ei-cierre__cuerpo" y={24}>
        {c.eyebrow && <span className="ei-cierre__eyebrow">{c.eyebrow}</span>}
        <h2>
          {c.titulo} {c.tituloAccent && <em>{c.tituloAccent}</em>}
        </h2>
        <p>{c.texto}</p>
        {boton}
      </Reveal>

      {c.items && (
        <motion.ul
          className="ei-cierre__items"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {c.items.map((i) => (
            <motion.li key={i.label} variants={cardVariants}>
              <Icon name={i.icon} size={22} strokeWidth={1.6} />
              {i.label}
            </motion.li>
          ))}
        </motion.ul>
      )}
    </section>
  );
}

/** Titular de seccion en dos colores, como en todos los disenos de Empresa. */
export function TituloEmpresa({
  titulo,
  accent,
  texto,
  centrado = false,
}: {
  titulo: string;
  accent?: string;
  texto?: string;
  centrado?: boolean;
}) {
  return (
    <Reveal className={`ei-titulo${centrado ? ' ei-titulo--centrado' : ''}`} y={20}>
      <h2>
        {titulo} {accent && <em>{accent}</em>}
      </h2>
      {texto && <p>{texto}</p>}
    </Reveal>
  );
}

/** Banda de cifras clara, comun a varias paginas de Empresa. */
export function CifrasEmpresa({
  cifras,
}: {
  cifras: { icon: React.ComponentProps<typeof Icon>['name']; color: string; valor: string; label: string }[];
}) {
  return (
    <motion.div
      className="ei-cifras"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {cifras.map((c) => (
        <motion.div className="ei-cifra" key={c.label} variants={cardVariants} style={{ '--c': c.color } as React.CSSProperties}>
          <Icon name={c.icon} size={34} strokeWidth={1.5} />
          <span>
            <b>{c.valor}</b>
            <small>{c.label}</small>
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}
