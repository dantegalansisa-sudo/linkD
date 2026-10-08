import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValue } from 'framer-motion';
import Icon from '../components/ui/Icon';
import { Reveal } from '../components/ui/RevealText';
import {
  Boletin,
  BuscadorNoticias,
  ChipsCategorias,
  Etiqueta,
  MasLeidas,
  Meta,
  Paginacion,
  ProximosEventos,
  Publicidad,
  Tarjeta,
  TituloSeccion,
} from '../components/noticias/Piezas';
import { getNoticias, getRecursos, imagen } from '../contenido/store';
import type { ItemRecurso, Noticia } from '../contenido/tipos';
import { normalizar } from '../utils/buscador';
import { containerVariants, EASINGS, VIEWPORT } from '../utils/easings';

/*
  Portada de NoticiaX (/noticias): cabecera con el logo y el buscador,
  categorias, destacado que rota, tarjetas, publicidad y "Ultimas noticias"
  con paginas. Con ?categoria= o ?q= muestra los resultados en rejilla.

  Todo sale de las noticias reales del panel: lo que no tiene datos (eventos,
  historias en video) no se muestra.
*/

const POR_PAGINA = 6;
const POR_PAGINA_RESULTADOS = 9;
const DURACION = 8000;

/** Destacado de la portada: rota entre las marcadas "en grande", con barra de avance. */
function Destacado({ lista }: { lista: Noticia[] }) {
  const [i, setI] = useState(0);
  const progreso = useMotionValue(0);
  const pausado = useRef(false);
  const n = lista[i % lista.length];

  useEffect(() => {
    if (lista.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let pasado = 0;
    let antes = performance.now();
    progreso.set(0);
    const paso = (ahora: number) => {
      const dt = ahora - antes;
      antes = ahora;
      if (!pausado.current && !document.hidden) pasado += dt;
      const p = Math.min(pasado / DURACION, 1);
      progreso.set(p);
      if (p >= 1) {
        setI((x) => (x + 1) % lista.length);
        return;
      }
      raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [i, lista.length, progreso]);

  if (!n) return null;
  return (
    <section
      className="nx-destacado"
      onMouseEnter={() => (pausado.current = true)}
      onMouseLeave={() => (pausado.current = false)}
      aria-roledescription="carrusel"
      aria-label="Noticias destacadas"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.article
          key={n.slug}
          className="nx-destacado__pieza"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: EASINGS.premium }}
        >
          <img src={imagen(n.imagen)} alt={n.imagenAlt} />
          <div className="nx-destacado__texto">
            <Etiqueta n={n} />
            <h2>
              <Link to={`/noticias/${n.slug}`}>{n.titulo}</Link>
            </h2>
            <p>{n.subtitulo || n.resumen}</p>
            <Meta n={n} />
          </div>
          <Link to={`/noticias/${n.slug}`} className="nx-boton nx-boton--naranja nx-destacado__leer">
            Leer noticia
            <Icon name="arrow-right" size={17} strokeWidth={2.2} />
          </Link>
        </motion.article>
      </AnimatePresence>
      {lista.length > 1 && (
        <div className="nx-destacado__puntos" role="tablist">
          {lista.map((x, k) => (
            <button key={x.slug} type="button" role="tab" aria-selected={k === i} aria-label={x.titulo} className={k === i ? 'is-activo' : ''} onClick={() => setI(k)}>
              {k === i && <motion.span style={{ scaleX: progreso }} />}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

/** Videos de Recursos (entrevistas, webinars, conferencias). Sin videos, no se muestra. */
function Historias() {
  const videos: ItemRecurso[] = [...getRecursos('entrevistas'), ...getRecursos('webinars'), ...getRecursos('conferencias')]
    .filter((r) => r.video?.src)
    .sort((a, b) => (b.fechaISO ?? '').localeCompare(a.fechaISO ?? ''))
    .slice(0, 3);
  if (!videos.length) return null;
  return (
    <section className="nx-seccion nx-historias">
      <TituloSeccion
        titulo="Historias que inspiran"
        sub="Conoce cómo nuestras soluciones están generando un impacto real en las instituciones y en las personas."
        enlace={{ texto: 'Ver todas', to: '/recursos/entrevistas' }}
      />
      <div className="nx-historias__lista">
        {videos.map((v) => (
          <Link key={`${v.tipo}-${v.slug}`} to={`/recursos/${v.tipo}/${v.slug}`} className="nx-historia">
            <span className="nx-historia__media">
              <img src={imagen(v.video?.poster || v.portada)} alt="" loading="lazy" />
              <span className="nx-historia__play" aria-hidden="true">
                <Icon name="play" size={20} />
              </span>
            </span>
            <span className="nx-historia__meta">
              <b>Video</b>
              {v.duracion && (
                <small>
                  <Icon name="clock" size={13} strokeWidth={2} />
                  {v.duracion}
                </small>
              )}
            </span>
            <strong>{v.titulo}</strong>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function NoticiasPage() {
  const [params] = useSearchParams();
  const categoria = params.get('categoria');
  const q = params.get('q') ?? '';
  const pagina = Math.max(1, Number(params.get('pagina')) || 1);
  const todas = getNoticias();

  // ?ver=todas: el listado completo, sin destacado
  const verTodas = params.get('ver') === 'todas';
  const filtrando = !!categoria || !!q.trim() || verTodas;
  const resultados = useMemo(() => {
    if (!filtrando) return [];
    const terminos = normalizar(q).split(/\s+/).filter(Boolean);
    return todas.filter((n) => {
      if (categoria && n.categoria !== categoria) return false;
      if (!terminos.length) return true;
      const texto = normalizar(`${n.titulo} ${n.subtitulo} ${n.resumen} ${n.categoria} ${(n.etiquetas ?? []).join(' ')}`);
      return terminos.every((t) => texto.includes(t));
    });
  }, [todas, categoria, q, filtrando]);

  // destacado, cuatro tarjetas y el resto en "Ultimas noticias", sin repetir
  const destacadas = useMemo(() => {
    const d = todas.filter((n) => n.destacada !== false);
    return (d.length ? d : todas).slice(0, 6);
  }, [todas]);
  const tarjetas = useMemo(() => todas.filter((n) => n.slug !== destacadas[0]?.slug).slice(0, 4), [todas, destacadas]);
  const ultimas = useMemo(() => todas.filter((n) => n.slug !== destacadas[0]?.slug && !tarjetas.includes(n)), [todas, destacadas, tarjetas]);

  const lista = filtrando ? resultados : ultimas;
  const porPagina = filtrando ? POR_PAGINA_RESULTADOS : POR_PAGINA;
  const paginas = Math.max(1, Math.ceil(lista.length / porPagina));
  const actual = Math.min(pagina, paginas);
  const visibles = lista.slice((actual - 1) * porPagina, actual * porPagina);

  const hrefPagina = (p: number) => {
    const s = new URLSearchParams(params);
    if (p <= 1) s.delete('pagina');
    else s.set('pagina', String(p));
    const t = s.toString();
    return `/noticias${t ? `?${t}` : ''}#ultimas`;
  };

  // al cambiar de pagina, la lista queda a la vista
  const primera = useRef(true);
  useEffect(() => {
    if (primera.current) {
      primera.current = false;
      return;
    }
    document.getElementById('ultimas')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [actual]);

  return (
    <main className="nx" id="contenido">
      {/* ---------- Cabecera de NoticiaX ---------- */}
      <section className="nx-cabecera">
        <div className="container container--wide">
          <div className="nx-cabecera__fila">
            <motion.div className="nx-cabecera__marca" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASINGS.premium }}>
              <h1>
                <img src={imagen('/brand/noticiax.webp')} alt="NoticiaX by LINKDICOM" width={900} height={238} />
              </h1>
              <p>Información relevante, tendencias y avances en salud digital, además de historias, innovación y temas que impactan el sector salud.</p>
            </motion.div>
            <BuscadorNoticias inicial={q} />
          </div>
          <ChipsCategorias activa={categoria} />
        </div>
      </section>

      <div className="container container--wide">
        <div className="nx-cuerpo">
          <div className="nx-principal">
            {filtrando ? (
              <section className="nx-seccion" id="ultimas">
                <TituloSeccion
                  titulo={categoria ? categoria : q.trim() ? `Resultados para «${q}»` : 'Todas las noticias'}
                  sub={`${resultados.length} noticia${resultados.length === 1 ? '' : 's'}${categoria && q ? ` que contienen «${q}»` : ''}`}
                  enlace={{ texto: 'Ver todas las noticias', to: '/noticias' }}
                />
                {visibles.length ? (
                  <motion.div className="nx-rejilla" variants={containerVariants} initial="hidden" whileInView="visible" viewport={VIEWPORT} key={`${categoria}-${q}-${actual}`}>
                    {visibles.map((n) => (
                      <Tarjeta n={n} key={n.slug} />
                    ))}
                  </motion.div>
                ) : (
                  <div className="nx-vacio">
                    <Icon name="search" size={30} strokeWidth={1.6} />
                    <p>No encontramos noticias{categoria ? ' en esta categoría' : ''}{q ? ` con «${q}»` : ''}.</p>
                    <Link className="nx-ver" to="/noticias">
                      Ver todas las noticias
                      <Icon name="arrow-right" size={15} strokeWidth={2.2} />
                    </Link>
                  </div>
                )}
                <Paginacion total={paginas} pagina={actual} hrefDe={hrefPagina} />
              </section>
            ) : (
              <>
                {destacadas.length > 0 ? (
                  <Destacado lista={destacadas} />
                ) : (
                  <div className="nx-vacio">
                    <Icon name="newspaper" size={30} strokeWidth={1.6} />
                    <p>Pronto publicaremos las primeras noticias.</p>
                  </div>
                )}

                {tarjetas.length > 0 && (
                  <motion.div className="nx-tarjetas" variants={containerVariants} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
                    {tarjetas.map((n) => (
                      <Tarjeta n={n} key={n.slug} compacta />
                    ))}
                  </motion.div>
                )}

                <Reveal y={18}>
                  <Publicidad espacio="portada-banner" variante="banner" />
                </Reveal>

                {ultimas.length > 0 && (
                  <section className="nx-seccion" id="ultimas">
                    <TituloSeccion titulo="Últimas noticias" enlace={{ texto: 'Ver todas', to: '/noticias?ver=todas' }} />
                    <motion.div className="nx-rejilla" variants={containerVariants} initial="hidden" whileInView="visible" viewport={VIEWPORT} key={actual}>
                      {visibles.map((n) => (
                        <Tarjeta n={n} key={n.slug} />
                      ))}
                    </motion.div>
                    <Paginacion total={paginas} pagina={actual} hrefDe={hrefPagina} />
                  </section>
                )}

                <Historias />
              </>
            )}
          </div>

          <aside className="nx-lateral">
            <Publicidad espacio="portada-lateral" medida={undefined} />
            <MasLeidas />
            <Boletin />
            <ProximosEventos />
            <Publicidad espacio="portada-columna" />
          </aside>
        </div>
      </div>
    </main>
  );
}
