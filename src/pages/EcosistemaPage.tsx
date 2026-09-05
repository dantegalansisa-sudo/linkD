import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Foto from '../components/ui/Foto';
import Icon from '../components/ui/Icon';
import MagneticButton from '../components/ui/MagneticButton';
import RevealText, { Reveal } from '../components/ui/RevealText';
import { ECOSISTEMAS } from '../data/ecosistemas';
import { CONTACT } from '../data/site';
import { cardVariants, containerVariants, EASINGS, VIEWPORT } from '../utils/easings';
import { useModales } from '../components/modales/Modales';

/**
 * Ficha de ecosistema (Centros de Diagnostico, Hospitalario, Laboratorios,
 * Consultorios). Es otra plantilla: aqui manda el sector, no la herramienta.
 */
export default function EcosistemaPage() {
  const { abrirDemo } = useModales();
  const { slug } = useParams();
  const eco = ECOSISTEMAS.find((e) => e.slug === slug);

  if (!eco) return <Navigate to="/" replace />;

  const acento = { '--acento': eco.acento } as React.CSSProperties;

  return (
    <main className="eco" id="contenido" style={acento}>
      {/* ---------- Cabecera ---------- */}
      <section className="eco-hero">
        <div className="eco-hero__media">
          <Foto src={eco.heroImagen} alt={eco.heroImagenAlt} />
          <span className="eco-hero__veil" />
        </div>

        <div className="container container--wide eco-hero__inner">
          <nav className="migas migas--oscuras" aria-label="Ruta de navegación">
            <Link to="/">Inicio</Link>
            <Icon name="chevron-right" size={13} strokeWidth={2} />
            <Link to="/">Ecosistemas</Link>
            <Icon name="chevron-right" size={13} strokeWidth={2} />
            <span aria-current="page">{eco.miga}</span>
          </nav>

          <motion.span
            className="eco-hero__eyebrow"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASINGS.premium }}
          >
            Ecosistema
          </motion.span>

          <RevealText tag="h1" className="eco-hero__titulo" delay={0.1} stagger={0.05}>
            {eco.titulo}
          </RevealText>
          {eco.tituloAccent && (
            <RevealText tag="p" className="eco-hero__titulo eco-hero__titulo--accent" delay={0.3} stagger={0.05}>
              {eco.tituloAccent}
            </RevealText>
          )}

          <motion.p
            className="eco-hero__intro"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: EASINGS.premium }}
          >
            {eco.intro}
          </motion.p>

          <motion.ul
            className="eco-hero__bullets"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {eco.bullets.map((b) => (
              <motion.li key={b.label} variants={cardVariants}>
                <span className="eco-hero__bullet-icono">
                  <Icon name={b.icon} size={18} strokeWidth={1.7} />
                </span>
                {b.label}
              </motion.li>
            ))}
          </motion.ul>

          {eco.heroLema && (
            <motion.ul
              className="eco-hero__lema"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: EASINGS.premium }}
            >
              {eco.heroLema.map((palabra) => (
                <li key={palabra}>{palabra}</li>
              ))}
            </motion.ul>
          )}
        </div>

        {/* panel de datos, montado sobre la foto */}
        <div className="container container--wide eco-hero__datos-wrap">
          <motion.div
            className="eco-datos"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {eco.datos.map((d) => (
              <motion.div className="eco-dato" key={d.label} variants={cardVariants}>
                <span className="eco-dato__icono">
                  <Icon name={d.icon} size={24} strokeWidth={1.6} />
                </span>
                <span>
                  <b>{d.valor}</b>
                  <small>{d.label}</small>
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---------- Banda de presentacion ---------- */}
      <section className="eco-banda">
        <Reveal className="container container--wide eco-banda__inner" y={28}>
          <h2 className="eco-banda__titulo">
            {eco.bandaTitulo} <em>{eco.bandaTituloAccent}</em>
          </h2>
          <p className="eco-banda__texto">{eco.bandaTexto}</p>
        </Reveal>
      </section>

      {/* ---------- Pilares ---------- */}
      <section className="eco-pilares">
        <div className="container container--wide">
          <Reveal className="eco-pilares__head" y={24}>
            <span className="eco-pilares__eyebrow">{eco.pilaresEyebrow}</span>
            <h2 className="eco-pilares__titulo">{eco.pilaresTitulo}</h2>
          </Reveal>

          <motion.div
            className="eco-pilares__grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            {eco.pilares.map((p) => (
              <motion.article
                className="eco-pilar"
                key={p.titulo}
                variants={cardVariants}
                style={{ '--c': p.color } as React.CSSProperties}
              >
                <span className="eco-pilar__icono">
                  <Icon name={p.icon} size={22} strokeWidth={1.7} />
                </span>
                <h3 className="eco-pilar__titulo">{p.titulo}</h3>
                <p className="eco-pilar__texto">{p.texto}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---------- Otros ecosistemas ---------- */}
      <section className="eco-otros">
        <div className="container container--wide">
          <Reveal className="eco-pilares__head" y={24}>
            <span className="eco-pilares__eyebrow">Otros ecosistemas</span>
            <h2 className="eco-pilares__titulo">{eco.otrosTitulo}</h2>
          </Reveal>

          <motion.div
            className="eco-otros__grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            {eco.otros.map((o) => (
              <motion.div key={o.slug} variants={cardVariants}>
                <Link
                  className="eco-tarjeta"
                  to={`/ecosistema/${o.slug}`}
                  style={{ '--c': o.color } as React.CSSProperties}
                >
                  <div className="eco-tarjeta__media">
                    <Foto src={o.imagen} alt={o.imagenAlt} />
                  </div>
                  <div className="eco-tarjeta__cuerpo">
                    <span className="eco-tarjeta__icono">
                      <Icon name={o.icon} size={22} strokeWidth={1.8} />
                    </span>
                    <h3>{o.titulo}</h3>
                    <p>{o.texto}</p>
                    <span className="link-arrow link-arrow--tech">
                      Conocer más
                      <Icon name="arrow-right" size={14} strokeWidth={2.2} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---------- Cierre ---------- */}
      <section className="container container--wide" id="contacto">
        <Reveal className="ficha-cta" y={28}>
          <span className="ficha-cta__icono eco-cta__icono">
            <Icon name="calendar" size={26} strokeWidth={1.6} />
          </span>
          <div className="ficha-cta__texto">
            <h2>{eco.ctaTitulo}</h2>
            <p>{eco.ctaTexto}</p>
          </div>
          <div className="ficha-cta__acciones">
            <a className="btn btn--outline btn--square btn--lg" href="#contacto">
              <span className="btn__label">Conocer más</span>
            </a>
            <MagneticButton onClick={() => abrirDemo(eco.miga)} className="btn btn--primary btn--square btn--lg">
              Solicitar Demo
              <span className="btn__arrow">
                <Icon name="arrow-right" size={16} strokeWidth={2.2} />
              </span>
            </MagneticButton>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
