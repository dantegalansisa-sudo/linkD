import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../ui/Icon';
import { Reveal } from '../ui/RevealText';
import { imagen } from '../../contenido/store';
import { enlaceIncrustable, esFutura, fechaCorta, fechaLarga, miniaturaVideo } from '../../contenido/formato';
import type { ItemRecurso, TipoRecurso, VideoRecurso } from '../../contenido/tipos';
import type { Recurso } from '../../data/recursos';
import { cardVariants, containerVariants, VIEWPORT } from '../../utils/easings';

/** Texto del enlace de cada tarjeta segun el tipo de recurso. */
const VER: Record<TipoRecurso, string> = {
  conferencias: 'Ver conferencia',
  webinars: 'Ver webinar',
  entrevistas: 'Ver entrevista',
  'materiales-de-apoyo': 'Ver material',
};

const MODALIDAD = { presencial: 'Presencial', virtual: 'En línea', hibrido: 'Híbrido' };

/** Portada de un item: la suya, o la miniatura de YouTube si no subio ninguna. */
export function portadaDe(item: ItemRecurso): string | undefined {
  if (item.portada) return imagen(item.portada);
  if (item.video?.poster) return imagen(item.video.poster);
  if (item.video && item.video.origen !== 'archivo') return miniaturaVideo(item.video.src);
  return undefined;
}

/** Reproductor: archivo propio o incrustado de YouTube / Vimeo. */
export function ReproductorRecurso({ video, titulo }: { video: VideoRecurso; titulo: string }) {
  if (video.origen === 'archivo') {
    return (
      <div className="rec-item__video">
        <video src={imagen(video.src)} poster={imagen(video.poster)} controls playsInline preload="metadata" />
      </div>
    );
  }
  const e = enlaceIncrustable(video.src);
  if (!e) return null;
  return (
    <div className="rec-item__video rec-item__video--marco">
      <iframe
        src={e.embed}
        title={titulo}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

/** Linea de datos: fecha, hora, lugar, modalidad y duracion, los que haya. */
export function MetaRecurso({ item, larga = false }: { item: ItemRecurso; larga?: boolean }) {
  const piezas: { icon: 'calendar' | 'clock' | 'map-pin' | 'monitor' | 'play'; texto: string }[] = [];
  if (item.fechaISO) piezas.push({ icon: 'calendar', texto: larga ? fechaLarga(item.fechaISO) : fechaCorta(item.fechaISO) });
  if (item.hora) piezas.push({ icon: 'clock', texto: item.hora });
  if (item.lugar) piezas.push({ icon: 'map-pin', texto: item.lugar });
  if (item.modalidad) piezas.push({ icon: 'monitor', texto: MODALIDAD[item.modalidad] });
  if (item.duracion) piezas.push({ icon: 'play', texto: item.duracion });
  if (!piezas.length) return null;
  return (
    <p className="rec-meta">
      {piezas.map((p) => (
        <span key={p.icon + p.texto}>
          <Icon name={p.icon} size={13} strokeWidth={2} />
          {p.texto}
        </span>
      ))}
    </p>
  );
}

/** Tarjeta de una conferencia, un webinar, una entrevista o un material. */
export function TarjetaRecurso({ item }: { item: ItemRecurso }) {
  const ruta = `/recursos/${item.tipo}/${item.slug}`;
  const portada = portadaDe(item);
  const proximo = esFutura(item.fechaISO) && (item.tipo === 'conferencias' || item.tipo === 'webinars') && !/^pr[oó]xim/i.test(item.categoria);
  const descargas = item.tipo === 'materiales-de-apoyo' ? (item.archivos?.length ?? 0) : 0;

  return (
    <motion.article className="rec-item-tarjeta" variants={cardVariants}>
      <Link to={ruta} className="rec-item-tarjeta__media">
        {portada ? (
          <img src={portada} alt={item.portadaAlt || item.titulo} loading="lazy" />
        ) : (
          <span className="rec-item-tarjeta__sin-foto">
            <Icon name="file-text" size={28} strokeWidth={1.5} />
          </span>
        )}
        {item.video && (
          <span className="rec-item-tarjeta__play" aria-hidden="true">
            <Icon name="play" size={16} />
          </span>
        )}
        {proximo && <span className="rec-item-tarjeta__proximo">Próximo</span>}
      </Link>
      <div className="rec-item-tarjeta__cuerpo">
        <span className="rec-chip">{item.categoria}</span>
        <h3>
          <Link to={ruta}>{item.titulo}</Link>
        </h3>
        <p>{item.resumen}</p>
        <MetaRecurso item={item} />
        <span className="link-arrow link-arrow--tech">
          {descargas ? `${descargas} ${descargas === 1 ? 'archivo' : 'archivos'} para descargar` : VER[item.tipo]}
          <Icon name="arrow-right" size={14} strokeWidth={2.2} />
        </span>
      </div>
    </motion.article>
  );
}

/**
 * Lo publicado en un recurso. Conferencias y webinars separan lo que esta
 * por venir de lo ya realizado; todos permiten filtrar por categoria.
 */
export function ListaRecursos({ recurso, items }: { recurso: Recurso; items: ItemRecurso[] }) {
  const [categoria, setCategoria] = useState<string>('');
  const categorias = [...new Set(items.map((i) => i.categoria).filter(Boolean))];
  const filtrados = categoria ? items.filter((i) => i.categoria === categoria) : items;

  const conAgenda = recurso.slug === 'conferencias' || recurso.slug === 'webinars';
  const proximos = conAgenda ? filtrados.filter((i) => esFutura(i.fechaISO)).sort((a, b) => (a.fechaISO ?? '').localeCompare(b.fechaISO ?? '')) : [];
  const anteriores = conAgenda ? filtrados.filter((i) => !esFutura(i.fechaISO)) : filtrados;

  const tituloAnteriores =
    recurso.slug === 'webinars' ? 'Grabaciones' : recurso.slug === 'conferencias' ? 'Conferencias realizadas' : recurso.titulo;

  return (
    <section className="rec-lista">
      <div className="container container--wide">
        {categorias.length > 1 && (
          <Reveal className="rec-filtros" y={16}>
            <button type="button" className={`rec-filtro${categoria === '' ? ' is-activo' : ''}`} onClick={() => setCategoria('')}>
              Todo <b>{items.length}</b>
            </button>
            {categorias.map((c) => (
              <button
                key={c}
                type="button"
                className={`rec-filtro${categoria === c ? ' is-activo' : ''}`}
                onClick={() => setCategoria(c)}
              >
                {c} <b>{items.filter((i) => i.categoria === c).length}</b>
              </button>
            ))}
          </Reveal>
        )}

        {proximos.length > 0 && (
          <Bloque titulo={recurso.slug === 'webinars' ? 'Próximos webinars' : 'Próximas conferencias'} items={proximos} acento />
        )}
        {anteriores.length > 0 && <Bloque titulo={proximos.length ? tituloAnteriores : ''} items={anteriores} />}
        {filtrados.length === 0 && <p className="rec-lista__vacio">No hay nada en esta categoría todavía.</p>}
      </div>
    </section>
  );
}

function Bloque({ titulo, items, acento }: { titulo: string; items: ItemRecurso[]; acento?: boolean }) {
  return (
    <div className={`rec-bloque${acento ? ' rec-bloque--proximos' : ''}`}>
      {titulo && (
        <Reveal className="rec-bloque__cabeza" y={18}>
          <h2>{titulo}</h2>
        </Reveal>
      )}
      <motion.div className="rec-item-rejilla" variants={containerVariants} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
        {items.map((i) => (
          <TarjetaRecurso item={i} key={i.slug} />
        ))}
      </motion.div>
    </div>
  );
}
