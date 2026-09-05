import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Bandera from '../components/ui/Bandera';
import Foto from '../components/ui/Foto';
import Icon from '../components/ui/Icon';
import MagneticButton from '../components/ui/MagneticButton';
import RevealText, { Reveal } from '../components/ui/RevealText';
import { useModales } from '../components/modales/Modales';
import { SECTORES, type Bloque } from '../data/sectores';
import { CONTACT } from '../data/site';
import { cardVariants, containerVariants, EASINGS, VIEWPORT } from '../utils/easings';

/** Cabecera comun de cada bloque: rotulo, titular y entradilla. */
function Cabeza({ eyebrow, titulo, texto }: { eyebrow?: string; titulo: string; texto?: string }) {
  return (
    <Reveal className="sec-cabeza" y={22}>
      {eyebrow && <span className="sec-cabeza__eyebrow">{eyebrow}</span>}
      <h2 className="sec-cabeza__titulo">{titulo}</h2>
      {texto && <p className="sec-cabeza__texto">{texto}</p>}
    </Reveal>
  );
}

/** Rejilla animada reutilizable: las tarjetas entran escalonadas. */
function Rejilla({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {children}
    </motion.div>
  );
}

function PintarBloque({ b }: { b: Bloque }) {
  switch (b.tipo) {
    /* ---------- Hitos: tres tarjetas grandes y cuatro menores ---------- */
    case 'hitos':
      return (
        <section className="sec-seccion">
          <div className="container container--wide">
            <Cabeza eyebrow={b.eyebrow} titulo={b.titulo} texto={b.texto} />

            <Rejilla className="sec-hitos sec-hitos--grandes">
              {b.destacados.map((h) => (
                <motion.article
                  className="sec-hito"
                  key={h.titulo}
                  variants={cardVariants}
                  style={{ '--c': h.color } as React.CSSProperties}
                >
                  <div className="sec-hito__media">
                    <Foto src={h.imagen} alt={h.imagenAlt} ratio="16 / 10" />
                  </div>
                  <span className="sec-hito__icono">
                    <Icon name={h.icon} size={20} strokeWidth={1.8} />
                  </span>
                  <h3>{h.titulo}</h3>
                  <p>{h.texto}</p>
                </motion.article>
              ))}
            </Rejilla>

            <Rejilla className="sec-hitos sec-hitos--resto">
              {b.resto.map((h) => (
                <motion.article
                  className="sec-hito"
                  key={h.titulo}
                  variants={cardVariants}
                  style={{ '--c': h.color } as React.CSSProperties}
                >
                  <div className="sec-hito__media">
                    <Foto src={h.imagen} alt={h.imagenAlt} ratio="16 / 10" />
                  </div>
                  <span className="sec-hito__icono">
                    <Icon name={h.icon} size={18} strokeWidth={1.8} />
                  </span>
                  <h3>{h.titulo}</h3>
                  <p>{h.texto}</p>
                </motion.article>
              ))}
            </Rejilla>
          </div>
        </section>
      );

    /* ---------- Linea de tiempo ---------- */
    case 'linea':
      return (
        <section className="sec-seccion">
          <div className="container container--wide">
            <Cabeza eyebrow={b.eyebrow} titulo={b.titulo} texto={b.texto} />
            <Rejilla className="sec-linea">
              {b.etapas.map((e) => (
                <motion.article className="sec-etapa" key={e.periodo} variants={cardVariants}>
                  <div className="sec-etapa__media">
                    <Foto src={e.imagen} alt={e.imagenAlt} ratio="16 / 9" />
                  </div>
                  <span className="sec-etapa__periodo">{e.periodo}</span>
                  <h3>{e.titulo}</h3>
                  <p>{e.texto}</p>
                </motion.article>
              ))}
            </Rejilla>
          </div>
        </section>
      );

    /* ---------- Tarjetas con lista de puntos ---------- */
    case 'listas':
      return (
        <section className="sec-seccion">
          <div className="container container--wide">
            <Cabeza eyebrow={b.eyebrow} titulo={b.titulo} texto={b.texto} />
            <Rejilla className={`sec-listas sec-listas--${b.tarjetas.length}`}>
              {b.tarjetas.map((t) => (
                <motion.article
                  className="sec-lista"
                  key={t.titulo}
                  variants={cardVariants}
                  style={{ '--c': t.color } as React.CSSProperties}
                >
                  <div className="sec-lista__media">
                    <Foto src={t.imagen} alt={t.imagenAlt} ratio="16 / 10" />
                  </div>
                  <span className="sec-lista__icono">
                    <Icon name={t.icon} size={19} strokeWidth={1.8} />
                  </span>
                  <h3>{t.titulo}</h3>
                  <ul>
                    {t.puntos.map((p) => (
                      <li key={p}>
                        <Icon name="check-circle" size={16} strokeWidth={1.9} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </motion.article>
              ))}
            </Rejilla>
          </div>
        </section>
      );

    /* ---------- Países ---------- */
    case 'paises':
      return (
        <section className="sec-seccion">
          <div className="container container--wide">
            <Cabeza eyebrow={b.eyebrow} titulo={b.titulo} texto={b.texto} />
            <Rejilla className="sec-paises">
              {b.paises.map((p) => (
                <motion.article className="sec-pais" key={p.nombre} variants={cardVariants}>
                  <span className="sec-pais__bandera">
                    <Bandera codigo={p.bandera} alt={`Bandera de ${p.nombre}`} />
                  </span>
                  <h3>{p.nombre}</h3>
                  <p>{p.texto}</p>
                </motion.article>
              ))}
            </Rejilla>
          </div>
        </section>
      );

    /* ---------- Bloque destacado con panel lateral ---------- */
    case 'destacado':
      return (
        <section className="sec-seccion">
          <div className="container container--wide sec-destacado">
            <Reveal className="sec-destacado__texto" y={26}>
              <span className="sec-cabeza__eyebrow">{b.eyebrow}</span>
              <h2 className="sec-destacado__titulo">{b.titulo}</h2>
              <p>{b.texto}</p>
              <ul className="sec-destacado__puntos">
                {b.puntos.map((p) => (
                  <li key={p}>
                    <Icon name="check-circle" size={17} strokeWidth={1.9} />
                    {p}
                  </li>
                ))}
              </ul>
              <p className="sec-destacado__nota">{b.nota}</p>
            </Reveal>

            <Reveal className="sec-destacado__media" y={30} delay={0.1}>
              <Foto src={b.imagen} alt={b.imagenAlt} ratio="4 / 3" />
              <div className="sec-panel">
                <p className="sec-panel__titulo">{b.panel.titulo}</p>
                <p className="sec-panel__texto">{b.panel.texto}</p>
                <ul>
                  {b.panel.items.map((i) => (
                    <li key={i.label}>
                      <span className="sec-panel__icono">
                        <Icon name={i.icon} size={18} strokeWidth={1.8} />
                      </span>
                      {i.label}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>
      );

    /* ---------- Alianzas: texto y rejilla de iconos ---------- */
    case 'alianzas':
      return (
        <section className="sec-seccion">
          <div className="container container--wide sec-alianzas">
            <Reveal y={24}>
              <span className="sec-cabeza__eyebrow">{b.eyebrow}</span>
              <h2 className="sec-destacado__titulo">{b.titulo}</h2>
              <p className="sec-alianzas__texto">{b.texto}</p>
            </Reveal>
            <Rejilla className="sec-alianzas__grid">
              {b.iconos.map((i) => (
                <motion.div className="sec-alianza" key={i.label} variants={cardVariants}>
                  <Icon name={i.icon} size={30} strokeWidth={1.5} />
                  <span>{i.label}</span>
                </motion.div>
              ))}
            </Rejilla>
          </div>
        </section>
      );

    /* ---------- Cifras con cita ---------- */
    case 'cifras':
      return (
        <section className="sec-seccion">
          <div className="container container--wide sec-cifras">
            <div>
              <Reveal y={22}>
                <span className="sec-cabeza__eyebrow">{b.eyebrow}</span>
                <h2 className="sec-destacado__titulo">{b.titulo}</h2>
              </Reveal>
              <Rejilla className="sec-cifras__grid">
                {b.datos.map((d) => (
                  <motion.div className="sec-cifra" key={d.label} variants={cardVariants}>
                    <Icon name={d.icon} size={26} strokeWidth={1.6} />
                    <b>{d.valor}</b>
                    <small>{d.label}</small>
                  </motion.div>
                ))}
              </Rejilla>
            </div>
            <Reveal className="sec-cita" y={26} delay={0.1}>
              <span className="sec-cita__comillas" aria-hidden="true">
                &ldquo;
              </span>
              <blockquote>{b.cita}</blockquote>
            </Reveal>
          </div>
        </section>
      );

    /* ---------- Mapa de sedes ---------- */
    case 'mapa':
      return (
        <section className="sec-seccion">
          <div className="container container--wide sec-mapa">
            <Reveal className="sec-mapa__texto" y={26}>
              <span className="sec-cabeza__eyebrow">{b.eyebrow}</span>
              <h2 className="sec-destacado__titulo">{b.titulo}</h2>
              <p>{b.texto}</p>
              <div className="sec-mapa__datos">
                {b.datos.map((d) => (
                  <div key={d.label}>
                    <Icon name={d.icon} size={24} strokeWidth={1.6} />
                    <b>{d.valor}</b>
                    <small>{d.label}</small>
                  </div>
                ))}
              </div>
              <a className="btn btn--primary btn--square sec-mapa__cta" href="#contacto">
                <span className="btn__label">
                  {b.cta}
                  <Icon name="arrow-right" size={15} strokeWidth={2.2} />
                </span>
              </a>
            </Reveal>

            <Reveal className="sec-mapa__media" y={30} delay={0.1}>
              <Foto src={b.imagen} alt={b.imagenAlt} ratio="4 / 3.2" />
              <ul className="sec-sedes">
                {b.sedes.map((s) => (
                  <li key={s.nombre}>
                    <Icon name="map-pin" size={15} strokeWidth={1.9} />
                    <span>
                      <b>{s.nombre}</b>
                      <small>{s.ciudad}</small>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>
      );

    /* ---------- Banda oscura ---------- */
    case 'banda':
      return (
        <section className="container container--wide">
          <Reveal className="sec-banda" y={26}>
            <span className="sec-banda__icono">
              <Icon name={b.icon} size={40} strokeWidth={1.4} />
            </span>
            <h2>{b.titulo}</h2>
            <p>{b.texto}</p>
          </Reveal>
        </section>
      );
  }
}

/** Pagina de sector: publico, privado o internacional. */
export default function SectorPage() {
  const { abrirDemo } = useModales();
  const { slug } = useParams();
  const sector = SECTORES.find((s) => s.slug === slug);

  if (!sector) return <Navigate to="/" replace />;

  const acento = { '--acento': sector.acento } as React.CSSProperties;

  return (
    <main className="sec" id="contenido" style={acento}>
      {/* ---------- Cabecera ---------- */}
      <section className="sec-hero">
        <div className="sec-hero__media">
          <Foto src={sector.heroImagen} alt={sector.heroImagenAlt} />
          <span className="sec-hero__veil" />
          <span className="sec-hero__chip">{sector.heroChip}</span>
        </div>

        <div className="container container--wide sec-hero__inner">
          <nav className="migas" aria-label="Ruta de navegación">
            <Link to="/">
              <Icon name="home" size={14} strokeWidth={1.9} />
              Inicio
            </Link>
            <Icon name="chevron-right" size={13} strokeWidth={2} />
            <Link to="/">Sectores</Link>
            <Icon name="chevron-right" size={13} strokeWidth={2} />
            <span aria-current="page">{sector.miga}</span>
          </nav>

          <motion.span
            className="sec-hero__eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASINGS.premium }}
          >
            {sector.heroEyebrow}
          </motion.span>

          <RevealText tag="h1" className="sec-hero__titulo" delay={0.08} stagger={0.05}>
            {sector.heroTitulo}
          </RevealText>
          <RevealText tag="p" className="sec-hero__titulo sec-hero__titulo--accent" delay={0.26} stagger={0.05}>
            {sector.heroTituloAccent}
          </RevealText>

          {sector.heroLead && (
            <motion.p
              className="sec-hero__lead"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.44, ease: EASINGS.premium }}
            >
              {sector.heroLead}
            </motion.p>
          )}

          <motion.p
            className="sec-hero__texto"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.52, ease: EASINGS.premium }}
          >
            {sector.heroTexto}
          </motion.p>

          <motion.ul
            className="sec-hero__bullets"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {sector.heroBullets.map((b) => (
              <motion.li key={b.label} variants={cardVariants}>
                <Icon name={b.icon} size={26} strokeWidth={1.6} />
                {b.label}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {sector.bloques.map((b, i) => (
        <PintarBloque b={b} key={`${b.tipo}-${i}`} />
      ))}

      {/* ---------- Cierre ---------- */}
      <section className="sec-cierre" id="contacto">
        <div className="sec-cierre__media">
          <Foto src={sector.cierreImagen} alt={sector.cierreImagenAlt} />
          <span className="sec-cierre__veil" />
        </div>

        <Reveal className="container container--wide sec-cierre__inner" y={26}>
          <div className="sec-cierre__texto">
            <span className="sec-cabeza__eyebrow sec-cabeza__eyebrow--naranja">{sector.cierreEyebrow}</span>
            <h2>{sector.cierreTitulo}</h2>
            <p>{sector.cierreTexto}</p>
          </div>

          <div className="sec-cierre__lado">
            {sector.cierreLema && (
              <p className="sec-cierre__lema">
                {sector.cierreLema[0]}
                <b>{sector.cierreLema[1]}</b>
              </p>
            )}

            <MagneticButton
              onClick={() => abrirDemo(sector.miga)}
              className="btn btn--primary btn--square btn--lg"
            >
              {sector.cierreCta}
              <span className="btn__arrow">
                <Icon name="arrow-right" size={17} strokeWidth={2.2} />
              </span>
            </MagneticButton>

            {sector.cierreContacto && (
              <ul className="sec-cierre__contacto">
                <li>
                  <Icon name="headset" size={17} strokeWidth={1.8} />
                  <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
                </li>
                <li>
                  <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                </li>
              </ul>
            )}
          </div>
        </Reveal>
      </section>
    </main>
  );
}
