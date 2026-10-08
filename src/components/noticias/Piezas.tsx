import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon, { type IconName } from '../ui/Icon';
import type { EspacioPublicidad, Noticia } from '../../contenido/tipos';
import { getAnuncio, getNoticias, getRecursos, getSitio, imagen } from '../../contenido/store';
import { esFutura, piezasFecha } from '../../contenido/formato';
import { leerPopulares } from '../../utils/noticiasApi';
import { enviarSolicitud, type EstadoEnvio } from '../../utils/solicitudes';
import { cardVariants } from '../../utils/easings';

/* ============================================================
   Piezas de NoticiaX (portada y noticia abierta)
   ============================================================ */

/** Icono de cada categoria, por su nombre (las crea el cliente en el panel). */
export function iconoCategoria(nombre: string): IconName {
  const n = nombre
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
  if (n.includes('salud')) return 'activity';
  if (n.includes('tecnolog')) return 'cpu';
  if (n.includes('institu')) return 'landmark';
  if (n.includes('innova')) return 'lightbulb';
  if (n.includes('social') || n.includes('comunidad')) return 'users';
  if (n.includes('evento')) return 'calendar';
  if (n.includes('linkdicom')) return 'link';
  if (n.includes('internac') || n.includes('mundo')) return 'globe';
  if (n.includes('implementa')) return 'settings';
  if (n.includes('econom') || n.includes('negocio')) return 'chart';
  if (n.includes('actualidad')) return 'newspaper';
  return 'tag';
}

/** Etiqueta de categoria con su color. */
export function Etiqueta({ n }: { n: Pick<Noticia, 'categoria' | 'color'> }) {
  return (
    <span className="not-etiqueta" style={{ '--c': n.color } as React.CSSProperties}>
      {n.categoria}
    </span>
  );
}

/** Fecha, categoria y tiempo de lectura, en una linea. */
export function Meta({ n, conCategoria = true }: { n: Noticia; conCategoria?: boolean }) {
  return (
    <p className="not-meta">
      <span>
        <Icon name="calendar" size={15} strokeWidth={1.9} />
        <time dateTime={n.fechaISO}>{n.fecha}</time>
      </span>
      {conCategoria && (
        <span>
          <Icon name="layers" size={15} strokeWidth={1.9} />
          {n.categoria}
        </span>
      )}
      {n.lectura && (
        <span>
          <Icon name="clock" size={15} strokeWidth={1.9} />
          {n.lectura}
        </span>
      )}
    </p>
  );
}

/** Tarjeta de noticia: foto con la etiqueta, fecha, titulo, entradilla y lectura. */
export function Tarjeta({ n, compacta }: { n: Noticia; compacta?: boolean }) {
  return (
    <motion.article className={`not-tarjeta${compacta ? ' not-tarjeta--compacta' : ''}`} variants={cardVariants}>
      <Link to={`/noticias/${n.slug}`} className="not-tarjeta__media" tabIndex={-1} aria-hidden="true">
        <img src={imagen(n.imagen)} alt="" loading="lazy" />
        <Etiqueta n={n} />
      </Link>
      <div className="not-tarjeta__cuerpo">
        <span className="not-tarjeta__fecha">
          <Icon name="calendar" size={13} strokeWidth={1.9} />
          {n.fecha}
        </span>
        <h3>
          <Link to={`/noticias/${n.slug}`}>{n.titulo}</Link>
        </h3>
        <p>{n.resumen}</p>
        {!compacta && n.lectura && (
          <span className="not-tarjeta__lectura">
            <Icon name="clock" size={13} strokeWidth={1.9} />
            {n.lectura}
          </span>
        )}
      </div>
    </motion.article>
  );
}

/** Titulo de seccion con la regla naranja y el enlace "Ver todas". */
export function TituloSeccion({ titulo, sub, enlace }: { titulo: string; sub?: string; enlace?: { texto: string; to: string } }) {
  return (
    <div className="nx-seccion__cabeza">
      <div>
        <h2>{titulo}</h2>
        {sub && <p>{sub}</p>}
      </div>
      {enlace && (
        <Link className="nx-ver" to={enlace.to}>
          {enlace.texto}
          <Icon name="arrow-right" size={15} strokeWidth={2.2} />
        </Link>
      )}
    </div>
  );
}

/* ---------- Publicidad ---------- */

/**
 * Un espacio de publicidad. Con anuncio activo muestra su imagen (enlazada);
 * libre, el cartel "¿Te gustaria anunciarte aqui?" que lleva a contacto.
 */
export function Publicidad({ espacio, variante = 'cuadro', medida }: { espacio: EspacioPublicidad; variante?: 'cuadro' | 'banner'; medida?: string }) {
  const a = getAnuncio(espacio);
  if (a) {
    const img = <img src={imagen(a.imagen)} alt={a.alt || (a.anunciante ? `Publicidad de ${a.anunciante}` : 'Publicidad')} loading="lazy" />;
    const externo = /^https?:\/\//i.test(a.enlace);
    return (
      <aside className={`nx-anuncio nx-anuncio--${variante} nx-anuncio--activo`} aria-label="Publicidad">
        {a.enlace ? (
          externo ? (
            <a href={a.enlace} target="_blank" rel="noopener sponsored">
              {img}
            </a>
          ) : (
            <Link to={a.enlace}>{img}</Link>
          )
        ) : (
          img
        )}
        <small>Publicidad</small>
      </aside>
    );
  }
  return (
    <Link to="/empresa/contacto?motivo=publicidad" className={`nx-anuncio nx-anuncio--${variante}`} aria-label="Anúnciate en NoticiaX">
      <span className="nx-anuncio__rotulo">
        Publicidad{variante === 'banner' ? ' · Banner horizontal' : ''}
        {medida && <small>{medida}</small>}
      </span>
      <b>¿Te gustaría anunciarte aquí?</b>
      <span className="nx-anuncio__texto">Contáctanos para más información</span>
      <svg className="nx-anuncio__cursor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 3l14 7-6 2-2 6z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}

/* ---------- Columna derecha ---------- */

/** Noticias mas leidas (por visitas reales); mientras no hay datos, las mas recientes. */
export function MasLeidas({ excepto }: { excepto?: string }) {
  const todas = getNoticias();
  const [orden, setOrden] = useState<string[]>([]);
  useEffect(() => {
    let vivo = true;
    leerPopulares().then((p) => vivo && setOrden(p));
    return () => {
      vivo = false;
    };
  }, []);
  const porSlug = new Map(todas.map((n) => [n.slug, n]));
  const lista = [...orden.map((s) => porSlug.get(s)).filter((n): n is Noticia => !!n), ...todas]
    .filter((n, i, arr) => arr.findIndex((x) => x.slug === n.slug) === i && n.slug !== excepto)
    .slice(0, 3);
  if (!lista.length) return null;
  return (
    <section className="nx-caja nx-leidas">
      <div className="nx-caja__cabeza">
        <h3>
          <Icon name="flame" size={20} strokeWidth={2} />
          Noticias más leídas
        </h3>
        <Link className="nx-ver" to="/noticias?ver=todas">
          Ver todas
          <Icon name="arrow-right" size={14} strokeWidth={2.2} />
        </Link>
      </div>
      <ol>
        {lista.map((n, i) => (
          <li key={n.slug}>
            <span className="nx-leidas__puesto">{i + 1}</span>
            <Link to={`/noticias/${n.slug}`}>
              <img src={imagen(n.imagen)} alt="" loading="lazy" />
              <span>
                <Etiqueta n={n} />
                <b>{n.titulo}</b>
                <small>
                  <Icon name="calendar" size={12} strokeWidth={2} />
                  {n.fecha}
                </small>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Noticias relacionadas: primero las de la misma categoria. */
export function relacionadasDe(n: Noticia, cuantas: number): Noticia[] {
  const otras = getNoticias().filter((x) => x.slug !== n.slug);
  const etiquetas = new Set((n.etiquetas ?? []).map((e) => e.toLowerCase()));
  const puntos = (x: Noticia) =>
    (x.categoria === n.categoria ? 2 : 0) + (x.etiquetas ?? []).filter((e) => etiquetas.has(e.toLowerCase())).length;
  return [...otras].sort((a, b) => puntos(b) - puntos(a) || b.fechaISO.localeCompare(a.fechaISO)).slice(0, cuantas);
}

export function Relacionadas({ n }: { n: Noticia }) {
  const lista = relacionadasDe(n, 4);
  if (!lista.length) return null;
  return (
    <section className="nx-caja nx-relacionadas">
      <div className="nx-caja__cabeza">
        <h3>
          <Icon name="flame" size={20} strokeWidth={2} />
          Noticias relacionadas
        </h3>
        <Link className="nx-ver" to="/noticias?ver=todas">
          Ver todas
          <Icon name="arrow-right" size={14} strokeWidth={2.2} />
        </Link>
      </div>
      <ul>
        {lista.map((x) => (
          <li key={x.slug}>
            <Link to={`/noticias/${x.slug}`}>
              <img src={imagen(x.imagen)} alt="" loading="lazy" />
              <span>
                <Etiqueta n={x} />
                <b>{x.titulo}</b>
                <small>
                  <Icon name="calendar" size={12} strokeWidth={2} />
                  {x.fecha}
                </small>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Alta en el boletin. Llega al mismo punto de recepcion que los formularios,
 * como una solicitud mas: LINKDICOM recibe un correo por cada suscripcion.
 */
export function Boletin() {
  const [estado, setEstado] = useState<EstadoEnvio>('listo');
  const [error, setError] = useState('');

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    const correo = (datos.get('correo') as string | null)?.trim() ?? '';
    const web = (datos.get('web') as string | null) ?? '';
    setEstado('enviando');
    setError('');
    const r = await enviarSolicitud('boletin', { correo, web }, 'Boletín de NoticiaX');
    if (r.ok) {
      setEstado('enviado');
    } else {
      setEstado('error');
      setError(r.error ?? '');
    }
  };

  return (
    <section className="nx-boletin">
      <div className="nx-boletin__cabeza">
        <h3>Recibe nuestras noticias</h3>
        <span className="nx-boletin__icono" aria-hidden="true">
          <Icon name="mail" size={20} strokeWidth={1.8} />
        </span>
      </div>
      <p>Suscríbete y recibe las últimas novedades y actualizaciones de LINKDICOM.</p>
      {estado === 'enviado' ? (
        <p className="nx-boletin__ok">
          <Icon name="check-circle" size={17} strokeWidth={2} />
          ¡Listo! Te avisaremos de las próximas noticias.
        </p>
      ) : (
        <form onSubmit={enviar}>
          <input className="trampa" type="text" name="web" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <label className="nx-boletin__campo">
            <Icon name="mail" size={17} strokeWidth={1.9} />
            <input name="correo" type="email" required placeholder="Tu correo electrónico" aria-label="Correo electrónico" />
          </label>
          <button className="nx-boton nx-boton--naranja" type="submit" disabled={estado === 'enviando'}>
            {estado === 'enviando' ? 'Enviando…' : 'Suscribirme'}
          </button>
          {estado === 'error' && (
            <span className="nx-boletin__error" role="alert">
              {error}
            </span>
          )}
        </form>
      )}
      <small>
        No compartimos tu información. Consulta nuestra <Link to="/empresa/politicas-y-terminos?doc=privacidad">política de privacidad</Link>.
      </small>
    </section>
  );
}

/** Proximas conferencias y webinars (de Recursos). Sin ninguno, no se muestra. */
export function ProximosEventos() {
  const eventos = [...getRecursos('conferencias'), ...getRecursos('webinars')]
    .filter((e) => esFutura(e.fechaISO))
    .sort((a, b) => (a.fechaISO ?? '').localeCompare(b.fechaISO ?? ''))
    .slice(0, 3);
  if (!eventos.length) return null;
  return (
    <section className="nx-caja nx-eventos">
      <div className="nx-caja__cabeza">
        <h3>
          <Icon name="calendar" size={19} strokeWidth={2} />
          Próximos eventos
        </h3>
        <Link className="nx-ver" to="/recursos/conferencias">
          Ver todos
          <Icon name="arrow-right" size={14} strokeWidth={2.2} />
        </Link>
      </div>
      <ul>
        {eventos.map((e) => {
          const f = piezasFecha(e.fechaISO ?? '');
          return (
            <li key={`${e.tipo}-${e.slug}`}>
              <Link to={`/recursos/${e.tipo}/${e.slug}`}>
                <span className="nx-eventos__fecha">
                  <small>{f.mesCorto}</small>
                  <b>{f.numero}</b>
                </span>
                <span>
                  <b>{e.titulo}</b>
                  {e.hora && (
                    <small>
                      <Icon name="clock" size={12} strokeWidth={2} />
                      {e.hora}
                    </small>
                  )}
                  {(e.lugar || e.modalidad) && (
                    <small>
                      <Icon name="map-pin" size={12} strokeWidth={2} />
                      {e.lugar || (e.modalidad === 'virtual' ? 'Virtual' : '')}
                    </small>
                  )}
                </span>
                <Icon name="chevron-right" size={16} strokeWidth={2} className="nx-eventos__ir" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ---------- Cabecera de la portada ---------- */

/** Categorias con al menos una noticia publicada, en el orden del panel. */
export function categoriasConNoticias(): { nombre: string; color: string; total: number }[] {
  const noticias = getNoticias();
  const cats = getSitio().categoriasNoticias;
  const nombres = [...Object.keys(cats), ...noticias.map((n) => n.categoria)].filter((c, i, a) => a.indexOf(c) === i);
  return nombres
    .map((nombre) => ({ nombre, color: cats[nombre] ?? '#2563eb', total: noticias.filter((n) => n.categoria === nombre).length }))
    .filter((c) => c.total > 0);
}

export function ChipsCategorias({ activa }: { activa: string | null }) {
  const cats = categoriasConNoticias();
  return (
    <nav className="nx-chips" aria-label="Categorías de noticias">
      <Link to="/noticias" className={`nx-chip${!activa ? ' is-activa' : ''}`}>
        <Icon name="grid" size={17} strokeWidth={2} />
        Todas
      </Link>
      {cats.map((c) => (
        <Link
          key={c.nombre}
          to={`/noticias?categoria=${encodeURIComponent(c.nombre)}`}
          className={`nx-chip${activa === c.nombre ? ' is-activa' : ''}`}
          style={{ '--c': c.color } as React.CSSProperties}
        >
          <Icon name={iconoCategoria(c.nombre)} size={17} strokeWidth={1.9} />
          {c.nombre}
        </Link>
      ))}
    </nav>
  );
}

export function BuscadorNoticias({ inicial = '' }: { inicial?: string }) {
  const [q, setQ] = useState(inicial);
  const navegar = useNavigate();
  useEffect(() => setQ(inicial), [inicial]);
  return (
    <form
      className="nx-buscar"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const t = q.trim();
        navegar(t ? `/noticias?q=${encodeURIComponent(t)}` : '/noticias');
      }}
    >
      <Icon name="search" size={19} strokeWidth={2} />
      <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar noticias, temas o categorías..." aria-label="Buscar noticias" />
      <button type="submit" className="nx-boton nx-boton--naranja">
        Buscar
      </button>
    </form>
  );
}

/* ---------- Paginacion ---------- */

/** 1 2 3 … de una lista; cada pagina es un enlace (se puede compartir). */
export function Paginacion({ total, pagina, hrefDe }: { total: number; pagina: number; hrefDe: (p: number) => string }) {
  if (total <= 1) return null;
  const numeros: (number | '…')[] = [];
  for (let p = 1; p <= total; p++) {
    if (p === 1 || p === total || Math.abs(p - pagina) <= 1) numeros.push(p);
    else if (numeros[numeros.length - 1] !== '…') numeros.push('…');
  }
  return (
    <nav className="nx-paginas" aria-label="Páginas de noticias">
      {pagina > 1 ? (
        <Link to={hrefDe(pagina - 1)} aria-label="Página anterior">
          <Icon name="chevron-left" size={17} strokeWidth={2.2} />
        </Link>
      ) : (
        <span className="is-desactivada">
          <Icon name="chevron-left" size={17} strokeWidth={2.2} />
        </span>
      )}
      {numeros.map((p, i) =>
        p === '…' ? (
          <span key={`s${i}`} className="nx-paginas__salto">
            …
          </span>
        ) : (
          <Link key={p} to={hrefDe(p)} className={p === pagina ? 'is-actual' : ''} aria-current={p === pagina ? 'page' : undefined}>
            {p}
          </Link>
        ),
      )}
      {pagina < total ? (
        <Link to={hrefDe(pagina + 1)} aria-label="Página siguiente">
          <Icon name="chevron-right" size={17} strokeWidth={2.2} />
        </Link>
      ) : (
        <span className="is-desactivada">
          <Icon name="chevron-right" size={17} strokeWidth={2.2} />
        </span>
      )}
    </nav>
  );
}
