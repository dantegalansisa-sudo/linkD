import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import Icon, { type IconName } from '../../components/ui/Icon';
import { ahoraRD, fechaCorta, fechaHoraRD } from '../../contenido/formato';
import type { Noticia } from '../../contenido/tipos';
import { get, post, type CifrasNoticia, type FuenteTrafico, type ResumenNoticias } from '../api';
import { mensajeDe, useEstado, useMaestro } from '../estado';
import { Boton, Buscador, Cabecera, Campo, EnlaceBoton, Entrada, Pestanas, Selector, Vacio } from '../ui/Basicos';
import { GraficaLinea, serieDiaria } from '../ui/Grafica';
import { Modal, useConfirmar } from '../ui/Modal';

/*
  Dashboard de noticias (NoticiaX): cifras, visitas, fuentes de trafico y la
  tabla de noticias con sus acciones. Las visitas, los votos y los
  comentarios los cuenta el servidor (api/noticias.php) y los resume
  api/ldwam/noticias.php.
*/

type EstadoNoticia = 'publicada' | 'programada' | 'borrador';
type Filtro = 'todas' | EstadoNoticia;
type Orden = 'recientes' | 'antiguas' | 'vistas' | 'gustan' | 'comentadas' | 'titulo';
type Rango = '7' | '30' | '90' | 'todo';

export function estadoDe(n: Noticia): EstadoNoticia {
  if (n.publicado === false) return 'borrador';
  if (n.publicarEl && n.publicarEl > ahoraRD()) return 'programada';
  return 'publicada';
}

const FUENTES: { clave: FuenteTrafico; label: string; color: string }[] = [
  { clave: 'google', label: 'Google', color: '#2e7dff' },
  { clave: 'directo', label: 'Acceso directo', color: '#14b8a6' },
  { clave: 'redes', label: 'Redes sociales', color: '#f43f5e' },
  { clave: 'sitio', label: 'Sitio LINKDICOM', color: '#ff6a13' },
  { clave: 'externos', label: 'Enlaces externos', color: '#8b5cf6' },
  { clave: 'otros', label: 'Otros', color: '#94a3b8' },
];

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

const VACIAS: CifrasNoticia = { vistas: 0, ultimos30: 0, previos30: 0, fuentes: {}, dias: {}, si: 0, no: 0, comentarios: 0, pendientes: 0 };

const n0 = (v: number) => v.toLocaleString('es-DO');

/** "+12%", "-4%" o null si no hay con que comparar. */
function variacion(ahora: number, antes: number): number | null {
  if (antes <= 0) return ahora > 0 ? null : 0;
  return Math.round(((ahora - antes) / antes) * 100);
}

function Variacion({ ahora, antes, texto }: { ahora: number; antes: number; texto?: string }) {
  const v = variacion(ahora, antes);
  if (v === null) return <span className="adm-delta adm-delta--nuevo">Nuevo{texto ? ` · ${texto}` : ''}</span>;
  return (
    <span className={`adm-delta${v > 0 ? ' adm-delta--sube' : v < 0 ? ' adm-delta--baja' : ''}`}>
      <b>
        <Icon name={v < 0 ? 'arrow-up' : 'arrow-up'} size={12} strokeWidth={2.6} style={v < 0 ? { transform: 'rotate(180deg)' } : undefined} />
        {v > 0 ? '+' : ''}
        {v}%
      </b>
      {texto && <small>{texto}</small>}
    </span>
  );
}

/** Avatar con las iniciales y un color fijo por nombre. */
function Persona({ nombre, rol }: { nombre?: string; rol: string }) {
  if (!nombre) return <span className="adm-persona adm-persona--nadie">—</span>;
  const colores = ['#2e7dff', '#0f8a5f', '#7c3aed', '#ff6a13', '#0891b2', '#db2777'];
  let h = 0;
  for (const c of nombre) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const iniciales = nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
  return (
    <span className="adm-persona">
      <i style={{ background: colores[h % colores.length] }}>{iniciales}</i>
      <span>
        <b>{nombre}</b>
        <small>{rol}</small>
      </span>
    </span>
  );
}

function ChipEstado({ n }: { n: Noticia }) {
  const e = estadoDe(n);
  if (e === 'programada') {
    return (
      <span className="adm-estado adm-estado--programada" title={`Sale el ${fechaHoraRD(n.publicarEl!)}`}>
        Programada
        <small>{fechaHoraRD(n.publicarEl!)}</small>
      </span>
    );
  }
  return <span className={`adm-estado adm-estado--${e}`}>{e === 'publicada' ? 'Publicada' : 'Borrador'}</span>;
}

/* ---------- Menu de acciones (los tres puntos) ---------- */

interface OpcionMenu {
  label: string;
  icon: IconName;
  onClick?: () => void;
  peligro?: boolean;
  desactivada?: boolean;
  separador?: boolean;
  /** Submenu (Cambiar estado, Cambiar categoria). */
  hijos?: { label: string; icon?: IconName; color?: string; onClick: () => void; desactivada?: boolean; marcada?: boolean }[];
}

/*
  Se pinta en <body> con posicion fija: dentro de la tabla (que se desplaza
  en horizontal en pantallas estrechas) quedaria recortado.
*/
function MenuAcciones({ opciones }: { opciones: OpcionMenu[] }) {
  const [abierto, setAbierto] = useState(false);
  const [sub, setSub] = useState<number | null>(null);
  const [pos, setPos] = useState({ top: 0, right: 0, arriba: false });
  const boton = useRef<HTMLButtonElement>(null);
  const caja = useRef<HTMLDivElement>(null);

  const abrir = () => {
    const r = boton.current?.getBoundingClientRect();
    if (!r) return;
    const arriba = r.bottom + 330 > window.innerHeight && r.top > 330;
    setPos({ top: arriba ? r.top - 6 : r.bottom + 6, right: window.innerWidth - r.right, arriba });
    setSub(null);
    setAbierto(true);
  };

  useEffect(() => {
    if (!abierto) return;
    const inicio = boton.current?.getBoundingClientRect().top ?? 0;
    const cerrar = (e: Event) => {
      if (e.type === 'mousedown' && (caja.current?.contains(e.target as Node) || boton.current?.contains(e.target as Node))) return;
      // un desplazamiento solo cierra si el boton se movio de verdad (el menu va fijo)
      if (e.type === 'scroll' && Math.abs((boton.current?.getBoundingClientRect().top ?? 0) - inicio) < 4) return;
      setAbierto(false);
    };
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && setAbierto(false);
    document.addEventListener('mousedown', cerrar);
    window.addEventListener('scroll', cerrar, true);
    window.addEventListener('resize', cerrar);
    document.addEventListener('keydown', tecla);
    return () => {
      document.removeEventListener('mousedown', cerrar);
      window.removeEventListener('scroll', cerrar, true);
      window.removeEventListener('resize', cerrar);
      document.removeEventListener('keydown', tecla);
    };
  }, [abierto]);

  const elegir = (f?: () => void) => {
    setAbierto(false);
    f?.();
  };

  return (
    <>
      <button ref={boton} type="button" className={`adm-tres-puntos${abierto ? ' is-abierto' : ''}`} onClick={() => (abierto ? setAbierto(false) : abrir())} aria-label="Acciones" aria-expanded={abierto}>
        <Icon name="more" size={20} strokeWidth={3} style={{ transform: 'rotate(90deg)' }} />
      </button>
      {abierto &&
        createPortal(
          <div
            ref={caja}
            className={`adm-menu${pos.arriba ? ' adm-menu--arriba' : ''}`}
            style={pos.arriba ? { bottom: window.innerHeight - pos.top, right: pos.right } : { top: pos.top, right: pos.right }}
            role="menu"
          >
            {opciones.map((o, i) => (
              <div key={o.label} className="adm-menu__fila" onMouseEnter={() => setSub(o.hijos ? i : null)}>
                {o.separador && <hr />}
                <button
                  type="button"
                  role="menuitem"
                  className={`adm-menu__opcion${o.peligro ? ' adm-menu__opcion--peligro' : ''}${sub === i ? ' is-activa' : ''}`}
                  disabled={o.desactivada}
                  onClick={() => (o.hijos ? setSub(sub === i ? null : i) : elegir(o.onClick))}
                >
                  <Icon name={o.icon} size={17} strokeWidth={1.9} />
                  {o.label}
                  {o.hijos && <Icon name="chevron-right" size={15} strokeWidth={2.2} className="adm-menu__flecha" />}
                </button>
                {o.hijos && sub === i && (
                  <div className="adm-menu adm-menu--sub" role="menu">
                    {o.hijos.map((h) => (
                      <button key={h.label} type="button" role="menuitem" className={`adm-menu__opcion${h.marcada ? ' is-marcada' : ''}`} disabled={h.desactivada} onClick={() => elegir(h.onClick)}>
                        {h.color ? <span className="adm-punto" style={{ background: h.color }} /> : h.icon && <Icon name={h.icon} size={16} strokeWidth={2} />}
                        {h.label}
                        {h.marcada && <Icon name="check" size={14} strokeWidth={2.6} className="adm-menu__flecha" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}

/* ---------- Pagina ---------- */

export default function Noticias() {
  const maestro = useMaestro();
  const { guardar, avisar } = useEstado();
  const confirmar = useConfirmar();
  const navegar = useNavigate();

  const [resumen, setResumen] = useState<ResumenNoticias | null>(null);
  const [errorResumen, setErrorResumen] = useState('');
  const [q, setQ] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const [categoria, setCategoria] = useState('');
  const [orden, setOrden] = useState<Orden>('recientes');
  const [vista, setVista] = useState<'lista' | 'rejilla'>('lista');
  const [rango, setRango] = useState<Rango>('30');
  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState(10);
  const [ocupado, setOcupado] = useState('');
  const [programando, setProgramando] = useState<{ n: Noticia; cuando: string } | null>(null);
  const [viendo, setViendo] = useState<Noticia | null>(null);

  const leerResumen = useCallback(() => {
    get<ResumenNoticias>('noticias', { accion: 'resumen' })
      .then((r) => {
        setResumen(r);
        setErrorResumen('');
      })
      .catch((e) => setErrorResumen(mensajeDe(e)));
  }, []);
  useEffect(leerResumen, [leerResumen]);

  const cifras = useCallback((slug: string): CifrasNoticia => resumen?.porNoticia[slug] ?? VACIAS, [resumen]);
  const noticias = maestro.noticias;
  const cuenta = useMemo(() => {
    const c = { publicada: 0, programada: 0, borrador: 0 };
    noticias.forEach((n) => c[estadoDe(n)]++);
    return c;
  }, [noticias]);

  const lista = useMemo(() => {
    const t = q.trim().toLowerCase();
    const filtradas = noticias.filter((n) => {
      if (filtro !== 'todas' && estadoDe(n) !== filtro) return false;
      if (categoria && n.categoria !== categoria) return false;
      if (t && !`${n.titulo} ${n.categoria} ${n.resumen}`.toLowerCase().includes(t)) return false;
      return true;
    });
    const c = (n: Noticia) => cifras(n.slug);
    const por: Record<Orden, (a: Noticia, b: Noticia) => number> = {
      recientes: (a, b) => b.fechaISO.localeCompare(a.fechaISO),
      antiguas: (a, b) => a.fechaISO.localeCompare(b.fechaISO),
      vistas: (a, b) => c(b).vistas - c(a).vistas,
      gustan: (a, b) => c(b).si - c(a).si,
      comentadas: (a, b) => c(b).comentarios - c(a).comentarios,
      titulo: (a, b) => a.titulo.localeCompare(b.titulo, 'es'),
    };
    return [...filtradas].sort(por[orden]);
  }, [noticias, filtro, categoria, q, orden, cifras]);

  useEffect(() => setPagina(1), [filtro, categoria, q, orden, porPagina]);
  const paginas = Math.max(1, Math.ceil(lista.length / porPagina));
  const visibles = lista.slice((pagina - 1) * porPagina, pagina * porPagina);

  /* ---------- cifras de arriba ---------- */
  const hoy = resumen?.hoy ?? ahoraRD().slice(0, 10);
  const mesActual = hoy.slice(0, 7);
  const publicadasMes = noticias.filter((n) => estadoDe(n) === 'publicada' && n.fechaISO.startsWith(mesActual)).length;
  const totales = useMemo(() => {
    let ult = 0;
    let prev = 0;
    Object.values(resumen?.porNoticia ?? {}).forEach((c) => {
      ult += c.ultimos30;
      prev += c.previos30;
    });
    return { ult, prev };
  }, [resumen]);
  const masVista = useMemo(() => {
    let mejor: { n: Noticia; v: number } | null = null;
    for (const n of noticias) {
      const v = cifras(n.slug).vistas;
      if (v > 0 && (!mejor || v > mejor.v)) mejor = { n, v };
    }
    return mejor;
  }, [noticias, cifras]);
  const ultima = useMemo(
    () => [...noticias].filter((n) => estadoDe(n) === 'publicada').sort((a, b) => b.fechaISO.localeCompare(a.fechaISO))[0],
    [noticias],
  );

  const puntos = useMemo(() => {
    const serie = resumen?.global.serie ?? {};
    const desdeDias = (d: number) => {
      const f = new Date(`${hoy}T12:00:00Z`);
      f.setUTCDate(f.getUTCDate() - (d - 1));
      return f.toISOString().slice(0, 10);
    };
    const primera = Object.keys(serie).sort()[0];
    const desde = rango === 'todo' ? (primera && primera < desdeDias(30) ? primera : desdeDias(30)) : desdeDias(Number(rango));
    return serieDiaria(serie, desde, hoy);
  }, [resumen, rango, hoy]);

  const fuentes = resumen?.global.fuentes30;
  const maxFuente = Math.max(1, ...FUENTES.map((f) => fuentes?.[f.clave] ?? 0));

  /* ---------- acciones ---------- */
  const actualizar = async (n: Noticia, cambio: Partial<Noticia>, detalle: string, aviso: string) => {
    setOcupado(n.slug);
    try {
      await guardar(
        'noticias',
        noticias.map((x) => {
          if (x.slug !== n.slug) return x;
          const nueva = { ...x, ...cambio };
          if (cambio.publicarEl === undefined && 'publicarEl' in cambio) delete nueva.publicarEl;
          return nueva;
        }),
        detalle,
      );
      avisar('ok', aviso);
    } catch (e) {
      avisar('error', mensajeDe(e));
    } finally {
      setOcupado('');
    }
  };

  const duplicar = async (n: Noticia) => {
    let slug = `${n.slug}-copia`;
    for (let i = 2; noticias.some((x) => x.slug === slug); i++) slug = `${n.slug}-copia-${i}`;
    const copia: Noticia = { ...n, slug, titulo: `${n.titulo} (copia)`, publicado: false, destacada: false };
    delete copia.publicarEl;
    delete copia.creadoPor;
    delete copia.publicadoPor;
    delete copia.publicadoEl;
    try {
      await guardar('noticias', [copia, ...noticias], `Duplicó la noticia «${n.titulo}»`);
      avisar('ok', 'Copia creada como borrador.');
      navegar(`/noticias/${slug}`);
    } catch (e) {
      avisar('error', mensajeDe(e));
    }
  };

  const eliminar = async (n: Noticia) => {
    const ok = await confirmar({ titulo: 'Eliminar la noticia', texto: `«${n.titulo}» desaparecerá de la web junto con sus visitas, votos y comentarios. Esta acción no se puede deshacer.`, confirmar: 'Eliminar', peligro: true });
    if (!ok) return;
    setOcupado(n.slug);
    try {
      await guardar('noticias', noticias.filter((x) => x.slug !== n.slug), `Eliminó la noticia «${n.titulo}»`);
      await post('noticias', { accion: 'olvidar', slug: n.slug }).catch(() => undefined);
      avisar('ok', 'Noticia eliminada.');
      leerResumen();
    } catch (e) {
      avisar('error', mensajeDe(e));
    } finally {
      setOcupado('');
    }
  };

  const programar = async () => {
    if (!programando) return;
    const { n, cuando } = programando;
    if (!cuando || cuando <= ahoraRD()) {
      avisar('error', 'Elige una fecha y hora futuras.');
      return;
    }
    setProgramando(null);
    await actualizar(n, { publicado: true, publicarEl: cuando, fechaISO: cuando.slice(0, 10) }, `Programó la noticia «${n.titulo}»`, `Programada para el ${fechaHoraRD(cuando)}.`);
  };

  const opcionesDe = (n: Noticia): OpcionMenu[] => {
    const e = estadoDe(n);
    return [
      { label: 'Ver noticia', icon: 'eye', onClick: () => window.open(e === 'publicada' ? `/noticias/${n.slug}` : `/noticias/${n.slug}?borrador=1`, '_blank') },
      { label: 'Editar noticia', icon: 'edit', onClick: () => navegar(`/noticias/${n.slug}`) },
      { label: 'Ver estadísticas', icon: 'chart', onClick: () => setViendo(n) },
      { label: 'Duplicar noticia', icon: 'copy', onClick: () => duplicar(n) },
      {
        label: 'Cambiar estado',
        icon: 'refresh',
        separador: true,
        hijos: [
          { label: 'Marcar como publicada', icon: 'check-circle', marcada: e === 'publicada', onClick: () => actualizar(n, { publicado: true, publicarEl: undefined }, `Publicó la noticia «${n.titulo}»`, 'Noticia publicada.') },
          { label: 'Programar publicación', icon: 'clock', onClick: () => setProgramando({ n, cuando: n.publicarEl ?? '' }) },
          { label: 'Pasar a borrador', icon: 'file-text', marcada: e === 'borrador', onClick: () => actualizar(n, { publicado: false, publicarEl: undefined }, `Pasó a borrador «${n.titulo}»`, 'Noticia pasada a borrador.') },
          { label: 'Cancelar publicación', icon: 'close', desactivada: e !== 'programada', onClick: () => actualizar(n, { publicado: false, publicarEl: undefined }, `Canceló la publicación programada de «${n.titulo}»`, 'Publicación programada cancelada.') },
        ],
      },
      {
        label: 'Cambiar categoría',
        icon: 'folder',
        hijos: Object.entries(maestro.categoriasNoticias).map(([c, color]) => ({
          label: c,
          color,
          marcada: c === n.categoria,
          onClick: () => actualizar(n, { categoria: c, color }, `Cambió la categoría de «${n.titulo}» a ${c}`, `Categoría cambiada a ${c}.`),
        })),
      },
      { label: 'Eliminar noticia', icon: 'trash', peligro: true, separador: true, onClick: () => eliminar(n) },
    ];
  };

  const estrella = (n: Noticia) => (
    <button
      type="button"
      className={`adm-estrella${n.destacada !== false ? ' is-activa' : ''}`}
      onClick={() => actualizar(n, { destacada: n.destacada === false }, `${n.destacada === false ? 'Llevó al inicio' : 'Quitó del inicio'} «${n.titulo}»`, n.destacada === false ? 'Ahora rota en el inicio.' : 'Ya no rota en el inicio.')}
      disabled={ocupado === n.slug}
      title={n.destacada !== false ? 'Rota en el inicio (pulsa para quitarla)' : 'No sale en el inicio (pulsa para añadirla)'}
    >
      <Icon name="star" size={19} strokeWidth={1.8} />
    </button>
  );

  return (
    <>
      <Cabecera
        titulo="Noticias"
        subtitulo={`${cuenta.publicada} publicada${cuenta.publicada === 1 ? '' : 's'} · ${cuenta.programada ? `${cuenta.programada} programada${cuenta.programada === 1 ? '' : 's'} · ` : ''}${cuenta.borrador} en borrador`}
        acciones={
          <>
            <EnlaceBoton to="/noticias" externo icono="external-link">
              Ver en la web
            </EnlaceBoton>
            <EnlaceBoton to="/noticias/nueva" variante="primario" icono="plus">
              Nueva noticia
            </EnlaceBoton>
          </>
        }
      />

      {errorResumen && <p className="adm-aviso-suave">No se pudieron leer las estadísticas: {errorResumen}</p>}

      {/* ---------- cifras ---------- */}
      <div className="adm-kpis">
        <Kpi icono="file-text" tono="azul" titulo="Noticias publicadas" valor={n0(cuenta.publicada)} texto="Total de noticias activas">
          <span className={`adm-delta${publicadasMes ? ' adm-delta--sube' : ''}`}>
            <b>+{publicadasMes}</b>
            <small>este mes</small>
          </span>
        </Kpi>
        <Kpi icono="eye" tono="azul" titulo="Visualizaciones totales" valor={n0(resumen?.global.vistasTotales ?? 0)} texto="Vistas en todas las noticias">
          <Variacion ahora={totales.ult} antes={totales.prev} texto="últimos 30 días" />
        </Kpi>
        <Kpi icono="chart" tono="azul" titulo="Visualizaciones este mes" valor={n0(resumen?.global.vistasMes ?? 0)} texto={`Vistas en ${MESES[Number(mesActual.slice(5, 7)) - 1]} ${mesActual.slice(0, 4)}`}>
          <Variacion ahora={resumen?.global.vistasMes ?? 0} antes={resumen?.global.vistasMesAnterior ?? 0} texto="vs. mes anterior" />
        </Kpi>
        <div className="adm-kpi adm-kpi--noticia">
          <span className="adm-kpi__icono adm-kpi__icono--naranja">
            <Icon name="flame" size={22} strokeWidth={1.9} />
          </span>
          <div>
            <p className="adm-kpi__titulo">Noticia más vista</p>
            {masVista ? (
              <Link to={`/noticias/${masVista.n.slug}`} className="adm-kpi__noticia">
                {masVista.n.imagen && <img src={masVista.n.imagen} alt="" />}
                <span>
                  <small>{masVista.n.titulo}</small>
                  <b>
                    {n0(masVista.v)} <em>vistas</em>
                  </b>
                </span>
              </Link>
            ) : (
              <p className="adm-kpi__texto">Todavía sin visitas registradas.</p>
            )}
          </div>
        </div>
        <Kpi icono="calendar" tono="azul" titulo="Última publicada" valor={ultima ? fechaCorta(ultima.fechaISO) : '—'} texto={ultima?.titulo ?? 'Ninguna todavía'} />
      </div>

      {/* ---------- grafica y fuentes ---------- */}
      <div className="adm-dos-graficas">
        <section className="adm-tarjeta adm-grafica-tarjeta">
          <div className="adm-tarjeta__cabeza">
            <h2>
              <Icon name="chart" size={18} strokeWidth={2} /> Visualizaciones de noticias
            </h2>
            <div className="adm-rango" role="tablist">
              {(['7', '30', '90', 'todo'] as Rango[]).map((r) => (
                <button key={r} type="button" className={rango === r ? 'is-activo' : ''} onClick={() => setRango(r)}>
                  {r === 'todo' ? 'Todo' : `${r} días`}
                </button>
              ))}
            </div>
          </div>
          <div className="adm-tarjeta__cuerpo">
            <GraficaLinea puntos={puntos} />
          </div>
        </section>

        <section className="adm-tarjeta adm-fuentes">
          <div className="adm-tarjeta__cabeza">
            <h2>
              Fuentes de tráfico <small>(últimos 30 días)</small>
            </h2>
          </div>
          <ul className="adm-tarjeta__cuerpo">
            {FUENTES.map((f) => (
              <li key={f.clave}>
                <span className="adm-punto" style={{ background: f.color }} />
                <span>{f.label}</span>
                <span className="adm-fuentes__barra">
                  <i style={{ width: `${((fuentes?.[f.clave] ?? 0) / maxFuente) * 100}%`, background: f.color }} />
                </span>
                <b>{n0(fuentes?.[f.clave] ?? 0)}</b>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* ---------- tabla ---------- */}
      <section className="adm-tarjeta adm-tabla-noticias">
        <div className="adm-barra adm-barra--tabla">
          <Pestanas
            valor={filtro}
            onChange={setFiltro}
            opciones={[
              { clave: 'todas', label: 'Todas', total: noticias.length },
              { clave: 'publicada', label: 'Publicadas', total: cuenta.publicada },
              ...(cuenta.programada ? [{ clave: 'programada' as Filtro, label: 'Programadas', total: cuenta.programada }] : []),
              { clave: 'borrador', label: 'Borradores', total: cuenta.borrador },
            ]}
          />
          <div className="adm-barra__filtros">
            <Buscador valor={q} onChange={setQ} placeholder="Buscar noticia…" />
            <Selector value={categoria} onChange={(e) => setCategoria(e.target.value)} aria-label="Categoría">
              <option value="">Categoría: todas</option>
              {Object.keys(maestro.categoriasNoticias).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Selector>
            <Selector value={filtro} onChange={(e) => setFiltro(e.target.value as Filtro)} aria-label="Estado">
              <option value="todas">Estado: todos</option>
              <option value="publicada">Publicadas</option>
              <option value="programada">Programadas</option>
              <option value="borrador">Borradores</option>
            </Selector>
            <Selector value={orden} onChange={(e) => setOrden(e.target.value as Orden)} aria-label="Ordenar por">
              <option value="recientes">Más recientes</option>
              <option value="antiguas">Más antiguas</option>
              <option value="vistas">Más vistas</option>
              <option value="gustan">Más «me gusta»</option>
              <option value="comentadas">Más comentadas</option>
              <option value="titulo">Título (A-Z)</option>
            </Selector>
            <span className="adm-vistas">
              <button type="button" className={vista === 'lista' ? 'is-activo' : ''} onClick={() => setVista('lista')} aria-label="Ver como lista">
                <Icon name="list" size={18} strokeWidth={2} />
              </button>
              <button type="button" className={vista === 'rejilla' ? 'is-activo' : ''} onClick={() => setVista('rejilla')} aria-label="Ver como rejilla">
                <Icon name="grid" size={18} strokeWidth={2} />
              </button>
            </span>
          </div>
        </div>

        {lista.length === 0 ? (
          <Vacio
            icono="newspaper"
            titulo={noticias.length ? 'Ninguna noticia coincide' : 'Todavía no hay noticias'}
            texto={noticias.length ? 'Prueba con otros filtros o palabras.' : 'Publica la primera y aparecerá en NoticiaX y en el inicio de la web.'}
            accion={
              !noticias.length && (
                <EnlaceBoton to="/noticias/nueva" variante="primario" icono="plus">
                  Nueva noticia
                </EnlaceBoton>
              )
            }
          />
        ) : vista === 'lista' ? (
          <div className="adm-tabla-scroll">
            <table className="adm-tabla">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Noticia</th>
                  <th>Categoría</th>
                  <th>Fecha de publicación</th>
                  <th>Vistas</th>
                  <th>Me gusta</th>
                  <th>No me gusta</th>
                  <th>Comentarios</th>
                  <th>Creada por</th>
                  <th>Publicada por</th>
                  <th>En el inicio</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {visibles.map((n, i) => {
                  const c = cifras(n.slug);
                  return (
                    <tr key={n.slug} className={ocupado === n.slug ? 'is-ocupada' : ''}>
                      <td className="adm-tabla__num">{(pagina - 1) * porPagina + i + 1}</td>
                      <td>
                        <Link to={`/noticias/${n.slug}`} className="adm-tabla__noticia">
                          {n.imagen ? <img src={n.imagen} alt="" loading="lazy" /> : <span className="adm-tabla__sin-foto"><Icon name="image" size={18} /></span>}
                          <b>{n.titulo || 'Sin título'}</b>
                        </Link>
                      </td>
                      <td>
                        <span className="adm-categoria" style={{ '--c': maestro.categoriasNoticias[n.categoria] ?? n.color } as React.CSSProperties}>
                          {n.categoria}
                        </span>
                      </td>
                      <td className="adm-tabla__fecha">
                        {fechaCorta(n.fechaISO)}
                        <small>{n.destacada !== false ? 'En el inicio' : 'Solo en NoticiaX'}</small>
                      </td>
                      <td>
                        <span className="adm-tabla__cifra">
                          <Icon name="eye" size={15} strokeWidth={2} />
                          {n0(c.vistas)}
                        </span>
                        <Variacion ahora={c.ultimos30} antes={c.previos30} />
                      </td>
                      <td>
                        <span className="adm-tabla__cifra adm-tabla__cifra--si">
                          <Icon name="thumbs-up" size={16} strokeWidth={2} />
                          {n0(c.si)}
                        </span>
                      </td>
                      <td>
                        <span className="adm-tabla__cifra adm-tabla__cifra--no">
                          <Icon name="thumbs-down" size={16} strokeWidth={2} />
                          {n0(c.no)}
                        </span>
                      </td>
                      <td>
                        <Link to="/noticias/comentarios" className="adm-tabla__cifra">
                          <Icon name="message" size={15} strokeWidth={2} />
                          {n0(c.comentarios)}
                        </Link>
                        <small className={`adm-tabla__pend${c.pendientes ? ' is-hay' : ''}`}>{c.pendientes} pend.</small>
                      </td>
                      <td>
                        <Persona nombre={n.creadoPor} rol="Editor" />
                      </td>
                      <td>
                        <Persona nombre={n.publicadoPor} rol="Publicista" />
                      </td>
                      <td className="adm-tabla__centro">{estrella(n)}</td>
                      <td>
                        <ChipEstado n={n} />
                      </td>
                      <td className="adm-tabla__centro">
                        <MenuAcciones opciones={opcionesDe(n)} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="adm-rejilla-noticias">
            {visibles.map((n) => {
              const c = cifras(n.slug);
              return (
                <article key={n.slug} className={`adm-ficha-noticia${ocupado === n.slug ? ' is-ocupada' : ''}`}>
                  <Link to={`/noticias/${n.slug}`} className="adm-ficha-noticia__media">
                    {n.imagen && <img src={n.imagen} alt="" loading="lazy" />}
                    <ChipEstado n={n} />
                  </Link>
                  <div className="adm-ficha-noticia__cuerpo">
                    <span className="adm-categoria" style={{ '--c': maestro.categoriasNoticias[n.categoria] ?? n.color } as React.CSSProperties}>
                      {n.categoria}
                    </span>
                    <Link to={`/noticias/${n.slug}`}>
                      <b>{n.titulo}</b>
                    </Link>
                    <small>{fechaCorta(n.fechaISO)}</small>
                    <p className="adm-ficha-noticia__cifras">
                      <span>
                        <Icon name="eye" size={14} /> {n0(c.vistas)}
                      </span>
                      <span>
                        <Icon name="thumbs-up" size={14} /> {n0(c.si)}
                      </span>
                      <span>
                        <Icon name="thumbs-down" size={14} /> {n0(c.no)}
                      </span>
                      <span>
                        <Icon name="message" size={14} /> {n0(c.comentarios)}
                      </span>
                    </p>
                  </div>
                  <div className="adm-ficha-noticia__pie">
                    {estrella(n)}
                    <MenuAcciones opciones={opcionesDe(n)} />
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {lista.length > 0 && (
          <div className="adm-paginacion">
            <span>
              Mostrando {(pagina - 1) * porPagina + 1} a {Math.min(pagina * porPagina, lista.length)} de {lista.length} noticia{lista.length === 1 ? '' : 's'}
            </span>
            <div className="adm-paginacion__paginas">
              <button type="button" disabled={pagina === 1} onClick={() => setPagina(pagina - 1)} aria-label="Anterior">
                <Icon name="chevron-left" size={16} strokeWidth={2.2} />
              </button>
              {Array.from({ length: paginas }, (_, i) => i + 1).map((p) => (
                <button key={p} type="button" className={p === pagina ? 'is-activa' : ''} onClick={() => setPagina(p)}>
                  {p}
                </button>
              ))}
              <button type="button" disabled={pagina === paginas} onClick={() => setPagina(pagina + 1)} aria-label="Siguiente">
                <Icon name="chevron-right" size={16} strokeWidth={2.2} />
              </button>
            </div>
            <Selector value={String(porPagina)} onChange={(e) => setPorPagina(Number(e.target.value))} aria-label="Noticias por página">
              {[10, 20, 50].map((v) => (
                <option key={v} value={v}>
                  {v} por página
                </option>
              ))}
            </Selector>
          </div>
        )}
      </section>

      {programando && (
        <Modal
          titulo="Programar publicación"
          onClose={() => setProgramando(null)}
          ancho="460px"
          pie={
            <>
              <Boton variante="fantasma" onClick={() => setProgramando(null)}>
                Cancelar
              </Boton>
              <Boton variante="primario" icono="clock" onClick={programar}>
                Programar
              </Boton>
            </>
          }
        >
          <p className="adm-texto-suave">
            «{programando.n.titulo}» se publicará sola en la fecha y hora que elijas (hora de República Dominicana). Hasta entonces no aparece en la web.
          </p>
          <Campo etiqueta="Publicar el">
            <Entrada type="datetime-local" value={programando.cuando} min={ahoraRD()} onChange={(e) => setProgramando({ ...programando, cuando: e.target.value })} autoFocus />
          </Campo>
        </Modal>
      )}

      {viendo && <EstadisticasNoticia n={viendo} c={cifras(viendo.slug)} hoy={hoy} onClose={() => setViendo(null)} />}
    </>
  );
}

function Kpi({ icono, tono, titulo, valor, texto, children }: { icono: IconName; tono: 'azul' | 'naranja'; titulo: string; valor: string; texto: string; children?: ReactNode }) {
  return (
    <div className="adm-kpi">
      <span className={`adm-kpi__icono adm-kpi__icono--${tono}`}>
        <Icon name={icono} size={22} strokeWidth={1.9} />
      </span>
      <div>
        <p className="adm-kpi__titulo">{titulo}</p>
        <p className="adm-kpi__valor">{valor}</p>
        <p className="adm-kpi__texto">{texto}</p>
        {children && <div className="adm-kpi__pie">{children}</div>}
      </div>
    </div>
  );
}

/** Ventana con las cifras de una noticia: visitas de 30 dias, votos, comentarios y fuentes. */
function EstadisticasNoticia({ n, c, hoy, onClose }: { n: Noticia; c: CifrasNoticia; hoy: string; onClose: () => void }) {
  const desde = new Date(`${hoy}T12:00:00Z`);
  desde.setUTCDate(desde.getUTCDate() - 29);
  const puntos = serieDiaria(c.dias, desde.toISOString().slice(0, 10), hoy);
  const max = Math.max(1, ...FUENTES.map((f) => c.fuentes[f.clave] ?? 0));
  return (
    <Modal titulo="Estadísticas de la noticia" onClose={onClose} ancho="760px">
      <p className="adm-estadisticas__titulo">{n.titulo}</p>
      <div className="adm-estadisticas__cifras">
        <span>
          <b>{n0(c.vistas)}</b>Vistas totales
        </span>
        <span>
          <b>{n0(c.ultimos30)}</b>Últimos 30 días
        </span>
        <span>
          <b>{n0(c.si)}</b>Me gusta
        </span>
        <span>
          <b>{n0(c.no)}</b>No me gusta
        </span>
        <span>
          <b>{n0(c.comentarios)}</b>Comentarios
        </span>
        <span>
          <b>{n0(c.pendientes)}</b>Pendientes
        </span>
      </div>
      <GraficaLinea puntos={puntos} alto={190} />
      <ul className="adm-fuentes adm-fuentes--modal">
        {FUENTES.map((f) => (
          <li key={f.clave}>
            <span className="adm-punto" style={{ background: f.color }} />
            <span>{f.label}</span>
            <span className="adm-fuentes__barra">
              <i style={{ width: `${((c.fuentes[f.clave] ?? 0) / max) * 100}%`, background: f.color }} />
            </span>
            <b>{n0(c.fuentes[f.clave] ?? 0)}</b>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
