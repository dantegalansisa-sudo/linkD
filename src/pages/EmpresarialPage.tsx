import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Foto from '../components/ui/Foto';
import Icon from '../components/ui/Icon';
import MagneticButton from '../components/ui/MagneticButton';
import { Reveal } from '../components/ui/RevealText';
import type { Empresarial } from '../data/empresariales';
import { EMPRESARIALES } from '../data/empresariales';
import { CONTACT } from '../data/site';
import { useModales } from '../components/modales/Modales';
import { cardVariants, containerVariants, EASINGS, VIEWPORT } from '../utils/easings';

/** Ficha de producto empresarial (LinkXpace, SIEGIX CRM, Provider y Core). */
export default function EmpresarialPage({ producto }: { producto: Empresarial }) {
  const { abrirDemo } = useModales();
  const [tab, setTab] = useState(0);
  const activa = producto.pestanas[tab];
  const acento = { '--acento': producto.color } as React.CSSProperties;
  const disponible = (slug: string) => EMPRESARIALES.some((e) => e.slug === slug);

  return (
    <main className="emp" id="contenido" style={acento}>
      <nav className="container container--wide migas" aria-label="Ruta de navegación">
        <Link to="/">
          <Icon name="home" size={14} strokeWidth={1.9} />
          Inicio
        </Link>
        <Icon name="chevron-right" size={13} strokeWidth={2} />
        <Link to="/">Productos</Link>
        <Icon name="chevron-right" size={13} strokeWidth={2} />
        <span aria-current="page">
          {producto.nombre} {producto.nombreAccent}
        </span>
      </nav>

      <div className="container container--wide emp__grid">
        {/* ================= Columna principal ================= */}
        <div className="emp__main">
          {/* --- Panel de presentacion --- */}
          <Reveal className="emp-panel" y={30}>
            <div className="emp-panel__cuerpo">
              <span className="emp-panel__categoria">
                <Icon name="layers" size={16} strokeWidth={1.8} />
                {producto.categoria}
              </span>

              {producto.logo ? (
                <span className="emp-panel__logo">
                  <img src={producto.logo} alt={`${producto.nombre}${producto.nombreAccent ?? ''}`} loading="lazy" />
                </span>
              ) : (
                <span className="emp-panel__marca">
                  {producto.nombre}
                  {producto.nombreAccent && <em>{producto.nombreAccent}</em>}
                </span>
              )}

              <h1 className="emp-panel__titulo">{producto.titulo}</h1>
              <p className="emp-panel__intro">{producto.intro}</p>

              <div className="emp-panel__acciones">
                <MagneticButton
                  onClick={() => abrirDemo(producto.nombreCompleto)}
                  className="btn btn--primary btn--square"
                >
                  {producto.ctaPrincipal}
                </MagneticButton>
                <a className="btn btn--square emp-panel__secundario" href="#detalle">
                  <span className="btn__label">{producto.ctaSecundario}</span>
                </a>
              </div>
            </div>

            <div className="emp-panel__media">
              <Foto src={producto.imagenPrincipal} alt={producto.imagenPrincipalAlt} />
            </div>
          </Reveal>

          {/* --- Sellos --- */}
          <motion.div
            className="emp-sellos"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            {producto.sellos.map((s) => (
              <motion.div className="emp-sello" key={s.titulo + s.texto} variants={cardVariants}>
                <span className="emp-sello__icono">
                  <Icon name={s.icon} size={24} strokeWidth={1.6} />
                </span>
                <b>{s.titulo}</b>
                <small>{s.texto}</small>
              </motion.div>
            ))}
          </motion.div>

          {/* --- Pestanas --- */}
          <Reveal className="ficha-tabs" y={28} id="detalle">
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
                    <motion.span
                      className="ficha-tabs__linea"
                      layoutId="emp-tab"
                      transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                    />
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
                  <h2 className="ficha-tabs__titulo">{activa.titulo}</h2>
                  <p className="ficha-tabs__texto">{activa.texto}</p>
                  <ul className="ficha-tabs__lista emp-lista">
                    {activa.puntos.map((punto) => (
                      <li key={punto}>
                        <Icon name="check" size={15} strokeWidth={2.6} />
                        {punto}
                      </li>
                    ))}
                  </ul>
                </div>
                <Foto src={activa.imagen} alt={activa.imagenAlt} className="ficha-tabs__media" ratio="4 / 3.4" />
              </motion.div>
            </AnimatePresence>
          </Reveal>
        </div>

        {/* ================= Barra lateral ================= */}
        <aside className="emp__lateral">
          <section className="emp-relacionados" aria-label="Productos relacionados">
            <h2 className="emp-lateral__titulo">Te podrían interesar también estos productos</h2>
            <motion.div
              className="emp-relacionados__lista"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
            >
              {producto.relacionados.map((r) => {
                const listo = disponible(r.slug);
                const cuerpo = (
                  <>
                    <span className="emp-rel__icono">
                      <Icon name={r.icon} size={22} strokeWidth={1.7} />
                    </span>
                    <span className="emp-rel__cuerpo">
                      <span className="emp-rel__nombre">{r.nombre}</span>
                      <span className="emp-rel__texto">{r.texto}</span>
                      <span className="link-arrow link-arrow--tech">
                        Conocer más
                        <Icon name="arrow-right" size={14} strokeWidth={2.2} />
                      </span>
                    </span>
                  </>
                );
                return (
                  <motion.div key={r.slug} variants={cardVariants}>
                    {listo ? (
                      <Link
                        className="emp-rel"
                        to={`/producto/${r.slug}`}
                        style={{ '--c': r.color } as React.CSSProperties}
                      >
                        {cuerpo}
                      </Link>
                    ) : (
                      <div className="emp-rel" style={{ '--c': r.color } as React.CSSProperties}>
                        {cuerpo}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </section>

          <Reveal className="emp-ayuda" y={22}>
            <span className="emp-ayuda__icono">
              <Icon name="headset" size={26} strokeWidth={1.6} />
            </span>
            <p>
              <b>¿Tienes dudas?</b>
              Estamos para ayudarte.
            </p>
            <a className="btn btn--square emp-ayuda__btn" href={CONTACT.whatsapp} target="_blank" rel="noreferrer">
              <span className="btn__label">Contactar un asesor</span>
            </a>
          </Reveal>

          <Reveal className="emp-porque" y={26}>
            <h2 className="emp-lateral__titulo">{producto.porQueTitulo}</h2>
            <ul>
              {producto.porQue.map((v) => (
                <li key={v.titulo}>
                  <span className="emp-porque__icono">
                    <Icon name={v.icon} size={22} strokeWidth={1.7} />
                  </span>
                  <span>
                    <b>{v.titulo}</b>
                    <small>{v.texto}</small>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </aside>
      </div>

      {/* ---------- Cierre ---------- */}
      <section className="container container--wide" id="contacto">
        <Reveal className="ficha-cta emp-cta" y={28}>
          <span className="ficha-cta__icono emp-cta__icono">
            <Icon name={producto.cierreIcono} size={26} strokeWidth={1.6} />
          </span>
          <div className="ficha-cta__texto">
            <h2>{producto.cierreTitulo}</h2>
            <p>{producto.cierreTexto}</p>
          </div>
          <div className="ficha-cta__acciones">
            <MagneticButton
              onClick={() => abrirDemo(producto.nombreCompleto)}
              className="btn btn--primary btn--square btn--lg"
            >
              {producto.ctaPrincipal}
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
