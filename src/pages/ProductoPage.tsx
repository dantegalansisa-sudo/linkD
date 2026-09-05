import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Foto from '../components/ui/Foto';
import Icon from '../components/ui/Icon';
import MagneticButton from '../components/ui/MagneticButton';
import RevealText, { Reveal } from '../components/ui/RevealText';
import { OTROS_ECOSISTEMAS, PRODUCTOS_FICHA } from '../data/productos';
import { CONTACT } from '../data/site';
import { cardVariants, containerVariants, EASINGS, VIEWPORT } from '../utils/easings';

const FAMILIA_MIGA: Record<string, string> = {
  ecosistema: 'Nuestro Ecosistema',
  salud: 'Productos de Salud',
  empresarial: 'Productos Empresariales',
};

/** Ficha de producto. Sirve de plantilla para las demas del ecosistema. */
export default function ProductoPage() {
  const { slug } = useParams();
  const producto = PRODUCTOS_FICHA.find((p) => p.slug === slug);
  const [tab, setTab] = useState(0);

  if (!producto) return <Navigate to="/" replace />;

  const activa = producto.pestanas[tab];
  const otros = OTROS_ECOSISTEMAS.filter((o) => o.slug !== producto.slug);
  const tieneFicha = (slug: string) => PRODUCTOS_FICHA.some((p) => p.slug === slug);

  return (
    <main className="ficha" id="contenido">
      {/* ---------- Cabecera ---------- */}
      <section className="ficha-hero">
        <div className="ficha-hero__media">
          <Foto src={producto.heroImagen} alt={producto.heroImagenAlt} />
          <span className="ficha-hero__veil" />
        </div>

        <div className="container container--wide ficha-hero__inner">
          <div className="ficha-hero__main">
            <motion.span
              className="hero__kicker"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASINGS.premium }}
            >
              {producto.heroEyebrow}
            </motion.span>
            <RevealText tag="h1" className="ficha-hero__titulo" delay={0.12} stagger={0.045}>
              {producto.heroTitulo}
            </RevealText>
            <motion.p
              className="ficha-hero__texto"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: EASINGS.premium }}
            >
              {producto.heroTexto}
            </motion.p>
          </div>

          {producto.heroLema && (
            <motion.p
              className="ficha-hero__lema"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: EASINGS.premium }}
            >
              {producto.heroLema}
            </motion.p>
          )}
        </div>
      </section>

      {/* ---------- Migas ---------- */}
      <nav className="container container--wide migas" aria-label="Ruta de navegación">
        <Link to="/">
          <Icon name="home" size={14} strokeWidth={1.9} />
          Inicio
        </Link>
        <Icon name="chevron-right" size={13} strokeWidth={2} />
        <Link to="/">{FAMILIA_MIGA[producto.familia]}</Link>
        <Icon name="chevron-right" size={13} strokeWidth={2} />
        <span aria-current="page">{producto.nombre}</span>
      </nav>

      <div className="container container--wide ficha__grid">
        {/* ================= Columna principal ================= */}
        <div className="ficha__main">
          {/* --- Panel de presentacion --- */}
          <Reveal className="ficha-panel" y={34}>
            <div className="ficha-panel__cuerpo">
              {producto.logo ? (
                <span className="ficha-panel__logo">
                  <img src={producto.logo} alt={producto.nombre} loading="lazy" />
                  <small>Powered by LINKDICOM S.R.L.</small>
                </span>
              ) : (
                <span className="ficha-panel__marca" style={{ '--c': producto.color } as React.CSSProperties}>
                  {producto.nombre}
                  <small>Powered by LINKDICOM S.R.L.</small>
                </span>
              )}

              <h2 className="ficha-panel__titulo">{producto.titulo}</h2>
              <p className="ficha-panel__intro">{producto.intro}</p>

              <motion.ul
                className="ficha-caracteristicas"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT}
              >
                {producto.caracteristicas.map((c) => (
                  <motion.li key={c.label} variants={cardVariants}>
                    <span className="ficha-caracteristicas__icono">
                      <Icon name={c.icon} size={19} strokeWidth={1.7} />
                    </span>
                    {c.label}
                  </motion.li>
                ))}
              </motion.ul>

              <div className="ficha-panel__acciones">
                <MagneticButton href="#contacto" className="btn btn--primary btn--square">
                  Solicitar Demo
                  <span className="btn__arrow">
                    <Icon name="arrow-right" size={16} strokeWidth={2.2} />
                  </span>
                </MagneticButton>
                <a className="btn btn--square ficha-panel__secundario" href="#caracteristicas">
                  <span className="btn__label">Ver características</span>
                </a>
              </div>
            </div>

            <div className="ficha-panel__media">
              <Foto src={producto.imagenPrincipal} alt={producto.imagenPrincipalAlt} />
            </div>
          </Reveal>

          {/* --- Datos --- */}
          <motion.div
            className="ficha-datos"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            {producto.datos.map((d) => (
              <motion.div className="ficha-dato" key={d.label} variants={cardVariants}>
                <span className="ficha-dato__icono">
                  <Icon name={d.icon} size={22} strokeWidth={1.6} />
                </span>
                <span>
                  <b>{d.valor}</b>
                  <small>{d.label}</small>
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* --- Pestanas --- */}
          <Reveal className="ficha-tabs" y={30} id="caracteristicas">
            <div className="ficha-tabs__barra" role="tablist">
              {producto.pestanas.map((p, i) => (
                <button
                  key={p.key}
                  role="tab"
                  type="button"
                  aria-selected={i === tab}
                  className={`ficha-tabs__boton${i === tab ? ' is-active' : ''}`}
                  onClick={() => setTab(i)}
                >
                  {p.label}
                  {i === tab && (
                    <motion.span className="ficha-tabs__linea" layoutId="ficha-tab" transition={{ type: 'spring', stiffness: 340, damping: 30 }} />
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                className="ficha-tabs__panel"
                key={activa.key}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: EASINGS.premium }}
              >
                <div>
                  <h3 className="ficha-tabs__titulo">{activa.titulo}</h3>
                  <p className="ficha-tabs__texto">{activa.texto}</p>
                  <ul className="ficha-tabs__lista">
                    {activa.puntos.map((punto) => (
                      <li key={punto}>
                        <Icon name="check" size={15} strokeWidth={2.6} />
                        {punto}
                      </li>
                    ))}
                  </ul>
                </div>
                <Foto src={activa.imagen} alt={activa.imagenAlt} className="ficha-tabs__media" ratio="4 / 3" />
              </motion.div>
            </AnimatePresence>
          </Reveal>
        </div>

        {/* ================= Barra lateral ================= */}
        <aside className="ficha__lateral" aria-label="Otros ecosistemas">
          <h2 className="ficha__lateral-titulo">Otros ecosistemas</h2>
          <motion.div
            className="ficha__lateral-lista"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            {otros.map((o) => {
              const listo = tieneFicha(o.slug);
              const cuerpo = (
                <>
                  <span className="eco-link__icono">
                    <Icon name={o.icon} size={20} strokeWidth={1.7} />
                  </span>
                  <span className="eco-link__cuerpo">
                    <span className="eco-link__nombre">{o.nombre}</span>
                    <span className="eco-link__categoria">{o.categoria}</span>
                    <span className="eco-link__desc">{o.desc}</span>
                  </span>
                  {listo ? (
                    <Icon name="chevron-right" size={16} className="eco-link__go" />
                  ) : (
                    <span className="eco-link__pronto">Pronto</span>
                  )}
                </>
              );

              return (
                <motion.div key={o.slug} variants={cardVariants}>
                  {/*
                    Las fichas que aun no existen no se enlazan: llevarian al
                    inicio sin explicacion. Se marcan como pendientes.
                  */}
                  {listo ? (
                    <Link
                      className="eco-link"
                      to={`/producto/${o.slug}`}
                      style={{ '--c': o.color } as React.CSSProperties}
                    >
                      {cuerpo}
                    </Link>
                  ) : (
                    <div
                      className="eco-link eco-link--pendiente"
                      style={{ '--c': o.color } as React.CSSProperties}
                    >
                      {cuerpo}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </aside>
      </div>

      {/* ---------- Cierre ---------- */}
      <section className="container container--wide" id="contacto">
        <Reveal className="ficha-cta" y={30}>
          <span className="ficha-cta__icono">
            <Icon name="calendar" size={26} strokeWidth={1.6} />
          </span>
          <div className="ficha-cta__texto">
            <h2>{producto.ctaTitulo}</h2>
            <p>{producto.ctaTexto}</p>
          </div>
          <div className="ficha-cta__acciones">
            <MagneticButton href={CONTACT.whatsapp} target="_blank" className="btn btn--primary btn--square btn--lg">
              Solicitar Demo Gratuita
              <span className="btn__arrow">
                <Icon name="arrow-right" size={16} strokeWidth={2.2} />
              </span>
            </MagneticButton>
            <MagneticButton
              href={CONTACT.whatsapp}
              target="_blank"
              className="btn btn--outline btn--square btn--lg"
              strength={0.24}
            >
              Hablar por WhatsApp
              <Icon name="whatsapp" size={18} />
            </MagneticButton>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
