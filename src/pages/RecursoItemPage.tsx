import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../components/ui/Icon';
import { Reveal } from '../components/ui/RevealText';
import { Cuerpo } from '../components/contenido/Bloques';
import Galeria from '../components/obra-social/Galeria';
import { MetaRecurso, ReproductorRecurso, TarjetaRecurso, portadaDe } from '../components/recursos/Piezas';
import { getRecursos, imagen } from '../contenido/store';
import { esFutura } from '../contenido/formato';
import type { TipoRecurso } from '../contenido/tipos';
import { RECURSOS_PAGINAS } from '../data/recursos';
import { containerVariants, EASINGS, VIEWPORT } from '../utils/easings';

/**
 * Una conferencia, un webinar, una entrevista o un material de apoyo, con su
 * video, su texto, sus participantes, su galeria y sus archivos.
 */
export default function RecursoItemPage() {
  const { slug, item: itemSlug } = useParams();
  const recurso = RECURSOS_PAGINAS.find((r) => r.slug === slug);
  const items = recurso ? getRecursos(recurso.slug as TipoRecurso) : [];
  const item = items.find((i) => i.slug === itemSlug);

  if (!recurso) return <Navigate to="/" replace />;
  if (!item) return <Navigate to={`/recursos/${recurso.slug}`} replace />;

  const otros = items.filter((i) => i.slug !== item.slug).slice(0, 3);
  const portada = portadaDe(item);
  const acento = { '--acento': recurso.color, '--c': recurso.color } as React.CSSProperties;
  const proximo = esFutura(item.fechaISO) && (item.tipo === 'conferencias' || item.tipo === 'webinars') && !/^pr[oó]xim/i.test(item.categoria);

  return (
    <main className="rec rec-item" id="contenido" style={acento}>
      <div className="container container--wide">
        <nav className="migas" aria-label="Ruta de navegación">
          <Link to="/">
            <Icon name="home" size={14} strokeWidth={1.9} />
            Inicio
          </Link>
          <Icon name="chevron-right" size={13} strokeWidth={2} />
          <Link to={`/recursos/${recurso.slug}`}>{recurso.titulo}</Link>
          <Icon name="chevron-right" size={13} strokeWidth={2} />
          <span aria-current="page">{item.titulo}</span>
        </nav>

        <div className="rec-item__cuerpo">
          <motion.article
            className="rec-item__articulo"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASINGS.premium }}
          >
            <header className="rec-item__cabeza">
              <span className="rec-chip">{item.categoria}</span>
              {proximo && <span className="rec-chip rec-chip--proximo">Próximo</span>}
              <h1>{item.titulo}</h1>
              {item.subtitulo && <p className="rec-item__sub">{item.subtitulo}</p>}
              <MetaRecurso item={item} larga />
            </header>

            {item.video ? (
              <ReproductorRecurso video={item.video} titulo={item.titulo} />
            ) : (
              portada && (
                <figure className="rec-item__portada">
                  <img src={portada} alt={item.portadaAlt || item.titulo} />
                </figure>
              )
            )}

            {item.enlace?.url && (
              <a className="btn btn--primary btn--square rec-item__enlace" href={item.enlace.url} target="_blank" rel="noreferrer">
                {item.enlace.texto || 'Más información'}
                <Icon name="external-link" size={16} strokeWidth={2.1} />
              </a>
            )}

            {item.cuerpo.length > 0 && (
              <div className="not-articulo__texto rec-item__texto">
                <Cuerpo bloques={item.cuerpo} />
              </div>
            )}

            {(item.archivos?.length ?? 0) > 0 && (
              <Reveal className="rec-archivos" y={18}>
                <h2>
                  <Icon name="download" size={20} strokeWidth={1.9} />
                  Archivos para descargar
                </h2>
                <ul>
                  {item.archivos!.map((a) => (
                    <li key={a.url}>
                      <a href={a.url} download target="_blank" rel="noreferrer">
                        <span className="rec-archivos__formato">{a.formato || 'ARCHIVO'}</span>
                        <span className="rec-archivos__nombre">
                          <b>{a.nombre}</b>
                          {a.tamano && <small>{a.tamano}</small>}
                        </span>
                        <Icon name="download" size={18} strokeWidth={2} />
                      </a>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {(item.galeria?.length ?? 0) > 0 && (
              <div className="rec-item__galeria">
                <Reveal y={18}>
                  <h2>Galería</h2>
                </Reveal>
                <Galeria piezas={item.galeria!} />
              </div>
            )}
          </motion.article>

          <aside className="rec-item__lateral">
            {(item.participantes?.length ?? 0) > 0 && (
              <Reveal className="rec-caja" y={20}>
                <h3>{item.tipo === 'entrevistas' ? 'Participan' : 'Ponentes'}</h3>
                <ul className="rec-participantes">
                  {item.participantes!.map((p) => (
                    <li key={p.nombre}>
                      {p.foto ? (
                        <img src={imagen(p.foto)} alt={p.nombre} loading="lazy" />
                      ) : (
                        <span className="rec-participantes__inicial">{p.nombre.trim().charAt(0)}</span>
                      )}
                      <span>
                        <b>{p.nombre}</b>
                        {p.cargo && <small>{p.cargo}</small>}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            <Reveal className="rec-caja rec-caja--recurso" y={20} delay={0.05}>
              <span className="rec-caja__icono">
                <Icon name={recurso.icon} size={22} strokeWidth={1.7} />
              </span>
              <h3>{recurso.titulo}</h3>
              <p>{recurso.resumen}</p>
              <Link className="link-arrow link-arrow--tech" to={`/recursos/${recurso.slug}`}>
                Ver todo
                <Icon name="arrow-right" size={14} strokeWidth={2.2} />
              </Link>
            </Reveal>

            <Reveal className="rec-caja rec-caja--contacto" y={20} delay={0.1}>
              <h3>¿Quieres saber más?</h3>
              <p>Escríbenos y te ampliamos la información de este {recurso.titulo.toLowerCase().replace(/s$/, '')}.</p>
              <Link className="btn btn--primary btn--square" to="/empresa/contacto">
                Contactar
                <Icon name="arrow-right" size={15} strokeWidth={2.2} />
              </Link>
            </Reveal>
          </aside>
        </div>
      </div>

      {otros.length > 0 && (
        <section className="rec-lista rec-lista--mas">
          <div className="container container--wide">
            <Reveal className="rec-bloque__cabeza" y={18}>
              <h2>Más {recurso.titulo.toLowerCase()}</h2>
              <Link className="link-arrow link-arrow--tech" to={`/recursos/${recurso.slug}`}>
                Ver todo
                <Icon name="arrow-right" size={14} strokeWidth={2.2} />
              </Link>
            </Reveal>
            <motion.div className="rec-item-rejilla" variants={containerVariants} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              {otros.map((o) => (
                <TarjetaRecurso item={o} key={o.slug} />
              ))}
            </motion.div>
          </div>
        </section>
      )}
    </main>
  );
}
