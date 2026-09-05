import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Foto from '../components/ui/Foto';
import Icon from '../components/ui/Icon';
import { Reveal } from '../components/ui/RevealText';
import { LEMA_RECURSOS, RECURSOS_PAGINAS } from '../data/recursos';
import { cardVariants, containerVariants, EASINGS, VIEWPORT } from '../utils/easings';

/**
 * Pagina de un recurso: conferencias, webinars, entrevistas o materiales.
 *
 * Todavia no hay contenido publicado, asi que en lugar de una rejilla vacia
 * se muestra el panel de "En Desarrollo" con lo que habra aqui, tal como lo
 * diseno el cliente para Materiales de Apoyo.
 */
export default function RecursoPage() {
  const { slug } = useParams();
  const recurso = RECURSOS_PAGINAS.find((r) => r.slug === slug);

  if (!recurso) return <Navigate to="/" replace />;

  const otros = RECURSOS_PAGINAS.filter((r) => r.slug !== recurso.slug);
  const acento = { '--acento': recurso.color } as React.CSSProperties;

  return (
    <main className="rec" id="contenido" style={acento}>
      {/* ---------- Cabecera ---------- */}
      <section className="rec-hero">
        <div className="rec-hero__media">
          <Foto src={recurso.imagen} alt={recurso.imagenAlt} />
          <span className="rec-hero__veil" />
        </div>

        <div className="container container--wide rec-hero__inner">
          <nav className="migas migas--oscuras" aria-label="Ruta de navegación">
            <Link to="/">Inicio</Link>
            <Icon name="chevron-right" size={13} strokeWidth={2} />
            <Link to="/">Recursos</Link>
            <Icon name="chevron-right" size={13} strokeWidth={2} />
            <span aria-current="page">{recurso.titulo}</span>
          </nav>

          <motion.h1
            className="rec-hero__titulo"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08, ease: EASINGS.premium }}
          >
            {recurso.titulo}
          </motion.h1>

          <motion.p
            className="rec-hero__subtitulo"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASINGS.premium }}
          >
            {recurso.subtitulo}
          </motion.p>

          <motion.ul
            className="rec-hero__bullets"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {recurso.bullets.map((b) => (
              <motion.li key={b.label} variants={cardVariants}>
                <Icon name={b.icon} size={26} strokeWidth={1.5} />
                {b.label}
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <ul className="rec-hero__lema" aria-hidden="true">
          {LEMA_RECURSOS.map((palabra) => (
            <li key={palabra}>{palabra}</li>
          ))}
        </ul>
      </section>

      {/* ---------- En desarrollo ---------- */}
      <section className="rec-desarrollo">
        <div className="rec-desarrollo__media">
          <Foto src={recurso.imagenDesarrollo} alt={recurso.imagenDesarrolloAlt} />
        </div>

        <Reveal className="rec-desarrollo__cuerpo" y={26}>
          <span className="rec-desarrollo__icono">
            <Icon name={recurso.icon} size={34} strokeWidth={1.6} />
          </span>

          <h2>En Desarrollo</h2>

          {/* la barra indica que hay trabajo en marcha, no un porcentaje real */}
          <span className="rec-desarrollo__barra" aria-hidden="true">
            <i />
          </span>

          <p>{recurso.textoDesarrollo}</p>

          <motion.ul
            className="rec-categorias"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            {recurso.categorias.map((c) => (
              <motion.li key={c.label} variants={cardVariants}>
                <span>
                  <Icon name={c.icon} size={24} strokeWidth={1.6} />
                </span>
                {c.label}
              </motion.li>
            ))}
          </motion.ul>

          <p className="rec-desarrollo__aviso">
            <Icon name="mail" size={16} strokeWidth={1.9} />
            <span>
              ¿Necesitas algo de esto ahora? <Link to="/empresa/contacto">Escríbenos</Link> y te lo
              hacemos llegar.
            </span>
          </p>
        </Reveal>
      </section>

      {/* ---------- Otros recursos ---------- */}
      <section className="rec-otros">
        <div className="container container--wide">
          <Reveal className="rec-otros__cabeza" y={20}>
            <h2>Otros recursos</h2>
          </Reveal>

          <motion.div
            className="rec-otros__grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            {otros.map((o) => (
              <motion.div key={o.slug} variants={cardVariants}>
                <Link
                  className="rec-tarjeta"
                  to={`/recursos/${o.slug}`}
                  style={{ '--c': o.color } as React.CSSProperties}
                >
                  <div className="rec-tarjeta__media">
                    <Foto src={o.imagen} alt={o.imagenAlt} />
                  </div>
                  <span className="rec-tarjeta__icono">
                    <Icon name={o.icon} size={20} strokeWidth={1.8} />
                  </span>
                  <h3>{o.titulo}</h3>
                  <p>{o.resumen}</p>
                  <span className="link-arrow link-arrow--tech">
                    Ver más
                    <Icon name="arrow-right" size={14} strokeWidth={2.2} />
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
