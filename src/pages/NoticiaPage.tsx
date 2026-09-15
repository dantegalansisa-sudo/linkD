import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../components/ui/Icon';
import MagneticButton from '../components/ui/MagneticButton';
import { Reveal } from '../components/ui/RevealText';
import { useModales } from '../components/modales/Modales';
import { Etiqueta, Lateral, Meta, Rejilla } from '../components/noticias/Piezas';
import { Cuerpo } from '../components/contenido/Bloques';
import { getNoticias, imagen } from '../contenido/store';
import { EASINGS } from '../utils/easings';

/** Una noticia completa, con su barra lateral y el resto de noticias debajo. */
export default function NoticiaPage() {
  const { slug } = useParams();
  const { abrirDemo } = useModales();
  const NOTICIAS = getNoticias();
  const noticia = NOTICIAS.find((n) => n.slug === slug);

  if (!noticia) return <Navigate to="/noticias" replace />;

  const otras = NOTICIAS.filter((n) => n.slug !== noticia.slug).slice(0, 3);

  return (
    <main className="not" id="contenido">
      <div className="container container--wide">
        <nav className="migas" aria-label="Ruta de navegación">
          <Link to="/">
            <Icon name="home" size={14} strokeWidth={1.9} />
            Inicio
          </Link>
          <Icon name="chevron-right" size={13} strokeWidth={2} />
          <Link to="/noticias">Noticias</Link>
          <Icon name="chevron-right" size={13} strokeWidth={2} />
          <span aria-current="page">{noticia.titulo}</span>
        </nav>

        <div className="not-cuerpo">
          <motion.article
            className="not-articulo"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASINGS.premium }}
          >
            <header className="not-articulo__cabeza">
              <Etiqueta n={noticia} />
              <h1>{noticia.titulo}</h1>
              <p className="not-articulo__sub">{noticia.subtitulo}</p>
              <Meta n={noticia} />
            </header>

            <figure className="not-articulo__portada">
              <img src={imagen(noticia.imagen)} alt={noticia.imagenAlt} />
              {noticia.pie && <figcaption>{noticia.pie}</figcaption>}
            </figure>

            <div className="not-articulo__texto">
              <Cuerpo bloques={noticia.cuerpo} />
            </div>

            {/* ---------- Llamada ---------- */}
            <Reveal className="not-cta" y={20}>
              <span className="not-cta__icono" aria-hidden="true">
                <Icon name="send" size={22} strokeWidth={1.7} />
              </span>
              <div>
                <b>{noticia.cta.titulo}</b>
                <p>{noticia.cta.texto}</p>
              </div>
              <MagneticButton className="btn btn--primary btn--square" onClick={() => abrirDemo(noticia.cta.interes)}>
                {noticia.cta.boton}
                <span className="btn__arrow">
                  <Icon name="arrow-right" size={16} strokeWidth={2.2} />
                </span>
              </MagneticButton>
            </Reveal>
          </motion.article>

          <Lateral excepto={noticia.slug} />
        </div>
      </div>

      <Rejilla noticias={otras} />
    </main>
  );
}
