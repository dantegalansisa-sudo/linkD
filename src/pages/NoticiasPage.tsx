import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../components/ui/Icon';
import { Reveal } from '../components/ui/RevealText';
import { Lateral, Meta, Rejilla, Tarjeta } from '../components/noticias/Piezas';
import { NOTICIAS } from '../data/noticias';
import { containerVariants, EASINGS, VIEWPORT } from '../utils/easings';

/**
 * Portada de noticias: la mas reciente en grande, la barra lateral y el resto
 * en rejilla. Con ?categoria= se filtra la lista.
 */
export default function NoticiasPage() {
  const [params] = useSearchParams();
  const categoria = params.get('categoria');
  const lista = categoria ? NOTICIAS.filter((n) => n.categoria === categoria) : NOTICIAS;
  const [destacada, ...resto] = lista;

  return (
    <main className="not" id="contenido">
      {/* ---------- Cabecera ---------- */}
      <section className="not-hero">
        <div className="container container--wide">
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASINGS.premium }}
          >
            Noticias
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASINGS.premium }}
          >
            Innovación, proyectos y novedades que están transformando la salud digital.
          </motion.p>
        </div>
      </section>

      <div className="container container--wide">
        <nav className="migas" aria-label="Ruta de navegación">
          <Link to="/">
            <Icon name="home" size={14} strokeWidth={1.9} />
            Inicio
          </Link>
          <Icon name="chevron-right" size={13} strokeWidth={2} />
          {categoria ? (
            <>
              <Link to="/noticias">Noticias</Link>
              <Icon name="chevron-right" size={13} strokeWidth={2} />
              <span aria-current="page">{categoria}</span>
            </>
          ) : (
            <span aria-current="page">Noticias</span>
          )}
        </nav>

        <div className="not-cuerpo">
          {/* ---------- Destacada ---------- */}
          <div className="not-principal">
            {destacada ? (
              <Reveal className="not-destacada" y={24}>
                <span className="not-destacada__rotulo">
                  {categoria ? categoria : 'Noticia destacada'}
                </span>
                <h2>
                  <Link to={`/noticias/${destacada.slug}`}>{destacada.titulo}</Link>
                </h2>
                <Meta n={destacada} />
                <Link to={`/noticias/${destacada.slug}`} className="not-destacada__media">
                  <img src={destacada.imagen} alt={destacada.imagenAlt} />
                </Link>
                <p className="not-destacada__sub">{destacada.subtitulo}</p>
                <p>{destacada.resumen}</p>
                <Link className="btn btn--primary btn--square" to={`/noticias/${destacada.slug}`}>
                  <span className="btn__label">
                    Leer noticia completa
                    <span className="btn__arrow">
                      <Icon name="arrow-right" size={16} strokeWidth={2.2} />
                    </span>
                  </span>
                </Link>
              </Reveal>
            ) : (
              <Reveal className="not-destacada" y={24}>
                <h2>No hay noticias en esta categoría todavía.</h2>
                <Link className="link-arrow link-arrow--tech" to="/noticias">
                  Ver todas las noticias
                  <Icon name="arrow-right" size={14} strokeWidth={2.2} />
                </Link>
              </Reveal>
            )}

            {/* en escritorio la rejilla va debajo de la destacada, a todo el ancho de la columna */}
            {resto.length > 0 && (
              <div className="not-principal__resto">
                <Reveal className="not-mas__cabeza" y={20}>
                  <h2>Más noticias</h2>
                </Reveal>
                <motion.div
                  className="not-rejilla not-rejilla--dos"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={VIEWPORT}
                >
                  {resto.map((n) => (
                    <Tarjeta n={n} key={n.slug} />
                  ))}
                </motion.div>
              </div>
            )}
          </div>

          <Lateral />
        </div>
      </div>

      {/* la rejilla general solo aparece cuando la lista esta filtrada, para volver al total */}
      {categoria && <Rejilla noticias={NOTICIAS.filter((n) => n.categoria !== categoria)} titulo="Otras noticias" />}
    </main>
  );
}
