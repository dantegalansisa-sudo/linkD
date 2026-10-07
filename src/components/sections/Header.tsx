import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '../ui/Icon';
import Logo from '../ui/Logo';
import Buscador from './Buscador';
import { NAV, PORTAL, REGISTRO_PORTAL, type NavGroup } from '../../data/site';
import { EASINGS } from '../../utils/easings';
import { imagen } from '../../contenido/store';

/*
  Paneles flotantes del menu (desplegables, buscador y "Ir a mi LINK").

  Todos cuelgan de su boton, pero se colocan respecto a la barra entera: los
  megamenus de dos columnas arrancan donde empieza el menu (bajo "Inicio") y
  los demas se alinean con el borde derecho del boton "Ir a mi LINK", como en
  el diseno. La flechita de arriba apunta siempre al boton que los abrio.
*/
type Alineacion = 'menu' | 'derecha';

function colocar(el: HTMLElement, ancla: HTMLElement, alineacion: Alineacion) {
  const barra = el.closest('.nav-header__inner');
  const padre = el.offsetParent;
  if (!barra || !padre) return;
  const rb = barra.getBoundingClientRect();
  const ancho = el.offsetWidth;
  const margen = 12;
  let x: number;
  if (alineacion === 'menu') {
    const menu = barra.querySelector<HTMLElement>('.mainnav');
    x = menu ? menu.getBoundingClientRect().left + parseFloat(getComputedStyle(menu).paddingLeft) : rb.left + margen;
  } else {
    const acciones = barra.querySelector<HTMLElement>('.nav-header__actions');
    const borde = acciones
      ? acciones.getBoundingClientRect().right - parseFloat(getComputedStyle(acciones).paddingRight)
      : rb.right - margen;
    x = borde - ancho;
  }
  x = Math.max(rb.left + margen, Math.min(x, rb.right - margen - ancho));
  const ra = ancla.getBoundingClientRect();
  const rp = padre.getBoundingClientRect();
  el.style.left = `${x - rp.left}px`;
  el.style.setProperty('--flecha', `${ra.left + ra.width / 2 - x}px`);
  // alto disponible de verdad bajo la cabecera (con o sin la barra amarilla);
  // con offsetTop, porque al abrirse el panel aun esta desplazado por la animacion
  const arriba = rp.top + el.offsetTop;
  el.style.setProperty('--alto-max', `${Math.max(240, window.innerHeight - arriba - 10)}px`);
}

function Flotante({
  ancla,
  alineacion,
  className,
  children,
  ...resto
}: {
  ancla: RefObject<HTMLElement>;
  alineacion: Alineacion;
  className: string;
  children: ReactNode;
  role?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !ancla.current) return;
    const recolocar = () => ancla.current && colocar(el, ancla.current, alineacion);
    recolocar();
    window.addEventListener('resize', recolocar);
    return () => window.removeEventListener('resize', recolocar);
  }, [ancla, alineacion]);

  return (
    <motion.div
      ref={ref}
      className={`flotante ${className}`}
      initial={{ opacity: 0, y: 10, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.985 }}
      transition={{ duration: 0.24, ease: EASINGS.snappy }}
      {...resto}
    >
      <span className="flotante__flecha" aria-hidden="true" />
      {children}
    </motion.div>
  );
}

/** Dibujo del bloque "¿Aun no estas registrado?": documento y usuario con un +. */
function IlustracionRegistro() {
  const id = useId().replace(/:/g, '');
  return (
    <svg className="milink__dibujo" viewBox="0 0 170 124" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-doc`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe6d4" />
          <stop offset="1" stopColor="#ffc59c" />
        </linearGradient>
        <linearGradient id={`${id}-usr`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff9d52" />
          <stop offset="1" stopColor="#f25a0b" />
        </linearGradient>
      </defs>
      <g fill="#ffb47d" opacity="0.75">
        <circle cx="16" cy="22" r="2.4" />
        <circle cx="152" cy="18" r="2" />
        <circle cx="160" cy="70" r="2.6" />
        <circle cx="10" cy="92" r="1.8" />
      </g>
      <g transform="rotate(-7 58 62)">
        <rect x="26" y="16" width="66" height="90" rx="10" fill={`url(#${id}-doc)`} />
        <g stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.95">
          <path d="M38 36h30M38 50h42M38 64h36M38 78h40M38 92h24" />
        </g>
      </g>
      <circle cx="108" cy="58" r="38" fill={`url(#${id}-usr)`} />
      <circle cx="108" cy="47" r="12.5" fill="#fff" />
      <path d="M85.5 83c3.4-12.6 12-19.5 22.5-19.5s19.1 6.9 22.5 19.5a38 38 0 0 1-45 0z" fill="#fff" />
      <circle cx="140" cy="90" r="15" fill="#ff6a13" stroke="#fff" strokeWidth="4.5" />
      <path d="M140 82.5v15M132.5 90h15" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  );
}

/** Contenido del megamenu de dos columnas (Soluciones y Productos). */
function MenuDoble({ group }: { group: NavGroup }) {
  return (
    <div className="megamenu__caja">
      {group.columns!.map((col) => (
        <div className={`megacol megacol--${col.tone}`} key={col.titleAccent}>
          <div className="megacol__head">
            <img
              className="megacol__ilustracion"
              src={imagen(col.tone === 'salud' ? '/img/menu/radiografias.webp' : '/img/menu/portatil.webp')}
              alt=""
              aria-hidden="true"
            />
            <div>
              <h3 className="megacol__title">
                {col.title} <em>{col.titleAccent}</em>
              </h3>
              <p className="megacol__intro">{col.intro}</p>
            </div>
          </div>

          <ul className="megacol__list">
            {col.items.map((item) => (
              <li key={item.label + item.desc}>
                <Link
                  className="megaitem"
                  to={item.href}
                  style={item.color ? ({ '--c': item.color } as CSSProperties) : undefined}
                >
                  <span className="megaitem__icon">
                    <Icon name={item.icon} size={22} strokeWidth={1.8} />
                  </span>
                  <span className="megaitem__body">
                    {item.logo ? (
                      <span className="megaitem__name megaitem__name--logo">
                        <img src={imagen(item.logo)} alt={item.label} loading="lazy" />
                      </span>
                    ) : (
                      <span className="megaitem__name">{item.label}</span>
                    )}
                    <span className="megaitem__desc">{item.kicker ? `${item.kicker} · ${item.desc}` : item.desc}</span>
                  </span>
                  <span className="megaitem__go">
                    <Icon name="chevron-right" size={17} strokeWidth={2.2} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* vuelve al home y baja a la seccion que toca */}
          <Link
            className="megacol__cta"
            to={{ pathname: '/', hash: group.label === 'Soluciones' ? '#ecosistema' : '#productos' }}
          >
            <span>
              {col.cta}
              <Icon name="arrow-right" size={17} strokeWidth={2.2} />
            </span>
            <img
              src={imagen(col.tone === 'salud' ? '/img/menu/radiografias.webp' : '/img/menu/portatil.webp')}
              alt=""
              aria-hidden="true"
            />
          </Link>
        </div>
      ))}
    </div>
  );
}

/** Desplegable de tarjetas con foto (Sectores, Recursos y Empresa). */
function MenuTarjetas({ group }: { group: NavGroup }) {
  return (
    <div className="megamenu__caja">
      {group.children?.map((child) => (
        <Link
          key={child.label}
          className="megamenu__link"
          to={child.href ?? { pathname: '/', hash: '#ecosistema' }}
          style={child.color ? ({ '--c': child.color } as CSSProperties) : undefined}
        >
          <span className="megamenu__icon">
            <Icon name={child.icon} size={26} strokeWidth={1.8} />
          </span>
          <span className="megamenu__cuerpo">
            <span className="megamenu__title">{child.label}</span>
            <span className="megamenu__desc">{child.desc}</span>
          </span>
          {child.imagen && (
            <img className="megamenu__miniatura" src={imagen(child.imagen)} alt={child.imagenAlt ?? ''} loading="lazy" />
          )}
        </Link>
      ))}
    </div>
  );
}

/** Un grupo del menu principal: su boton y su desplegable. */
function GrupoMenu({
  group,
  abierto,
  onAbrir,
  onCerrar,
}: {
  group: NavGroup;
  abierto: boolean;
  onAbrir: () => void;
  onCerrar: () => void;
}) {
  const boton = useRef<HTMLButtonElement>(null);
  const clave = group.label.toLowerCase();
  return (
    <div className={`mainnav__item${abierto ? ' is-abierto' : ''}`} onMouseEnter={onAbrir} onMouseLeave={onCerrar}>
      <button
        ref={boton}
        className="mainnav__link"
        type="button"
        aria-expanded={abierto}
        onClick={() => (abierto ? onCerrar() : onAbrir())}
      >
        {group.label}
        <Icon name="chevron-down" size={14} strokeWidth={2.2} />
      </button>

      <AnimatePresence>
        {abierto && (
          <Flotante
            ancla={boton}
            alineacion={group.columns ? 'menu' : 'derecha'}
            className={`megamenu megamenu--${clave} ${group.columns ? 'megamenu--dual' : 'megamenu--tarjetas'}`}
            onClick={onCerrar}
          >
            {group.columns ? <MenuDoble group={group} /> : <MenuTarjetas group={group} />}
          </Flotante>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Menu principal: bloque blanco del logo con corte diagonal sobre una barra
 * azul marino. El CTA "IR A MI LINK" sustituye por completo a "Solicitar demo".
 */
export default function Header() {
  // "Inicio" solo se marca activo cuando de verdad estamos en el home
  const { pathname, hash } = useLocation();
  const enInicio = pathname === '/';
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [portal, setPortal] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const lupa = useRef<HTMLButtonElement>(null);
  const portalBtn = useRef<HTMLButtonElement>(null);
  const zonaBusqueda = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = mobile ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobile]);

  /*
    Al cambiar de pagina se cierra todo lo que estuviera abierto. Sin esto el
    panel del menu se quedaba encima de la pagina recien abierta, porque en una
    aplicacion de una sola pagina el navegador no recarga nada.
  */
  useEffect(() => {
    setOpen(null);
    setPortal(false);
    setBuscando(false);
    setMobile(false);
    setMobileGroup(null);
  }, [pathname, hash]);

  // el buscador se cierra con Escape o pulsando fuera de el
  useEffect(() => {
    if (!buscando) return;
    const fuera = (e: MouseEvent) => {
      if (zonaBusqueda.current && !zonaBusqueda.current.contains(e.target as Node)) setBuscando(false);
    };
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && setBuscando(false);
    document.addEventListener('mousedown', fuera);
    document.addEventListener('keydown', tecla);
    return () => {
      document.removeEventListener('mousedown', fuera);
      document.removeEventListener('keydown', tecla);
    };
  }, [buscando]);

  // un desplegable abierto con el teclado tambien se cierra con Escape
  useEffect(() => {
    if (!open && !portal) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(null);
        setPortal(false);
      }
    };
    document.addEventListener('keydown', tecla);
    return () => document.removeEventListener('keydown', tecla);
  }, [open, portal]);

  const abrirGrupo = (label: string) => {
    setOpen(label);
    setPortal(false);
    setBuscando(false);
  };

  return (
    <>
      <header className="nav-header">
        <div className="nav-header__inner">
          <Link className="nav-header__brand" to="/" aria-label="LINKDICOM — inicio">
            <Logo variant="onLight" />
          </Link>

          <nav className="mainnav" onMouseLeave={() => setOpen(null)}>
            <Link
              className={`mainnav__link mainnav__link--inicio${enInicio ? ' is-active' : ''}`}
              to="/"
              // ya en el inicio, el boton sube al principio de la pagina
              onClick={() => enInicio && window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <Icon name="home" size={16} strokeWidth={1.9} />
              Inicio
            </Link>

            {NAV.map((group) => (
              <GrupoMenu
                key={group.label}
                group={group}
                abierto={open === group.label}
                onAbrir={() => abrirGrupo(group.label)}
                onCerrar={() => setOpen((o) => (o === group.label ? null : o))}
              />
            ))}
          </nav>

          <div className="nav-header__actions">
            <div className="busqueda" ref={zonaBusqueda}>
              <button
                ref={lupa}
                className={`busqueda__btn${buscando ? ' is-abierto' : ''}`}
                type="button"
                aria-label="Buscar en el sitio"
                aria-expanded={buscando}
                onClick={() => {
                  setBuscando((v) => !v);
                  setOpen(null);
                  setPortal(false);
                }}
              >
                <Icon name="search" size={21} strokeWidth={2.4} />
                <span className="busqueda__texto">
                  ¿Necesitas buscar
                  <br />
                  algo específico?
                </span>
              </button>

              <AnimatePresence>
                {buscando && (
                  <Flotante ancla={lupa} alineacion="derecha" className="busqueda__panel">
                    <Buscador onCerrar={() => setBuscando(false)} />
                  </Flotante>
                )}
              </AnimatePresence>
            </div>

            <div
              className="portal"
              onMouseEnter={() => {
                setPortal(true);
                setBuscando(false);
              }}
              onMouseLeave={() => setPortal(false)}
            >
              <motion.button
                ref={portalBtn}
                className="portal-btn"
                type="button"
                aria-expanded={portal}
                aria-haspopup="menu"
                onClick={() => setPortal((v) => !v)}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>
                  <b>Ir a mi LINK</b>
                  <small>Portal de Servicios</small>
                </span>
                <Icon name="external-link" size={19} strokeWidth={1.9} />
              </motion.button>

              <AnimatePresence>
                {portal && (
                  <Flotante ancla={portalBtn} alineacion="derecha" className="milink" role="menu">
                    <div className="milink__caja">
                      <div className="milink__accesos">
                        <div className="milink__cabeza">
                          <b>Acceso a Mi LINK</b>
                          <span>Portal de SIEGIX CRM</span>
                        </div>
                        <ul>
                          {PORTAL.map((a) => {
                            const cuerpo = (
                              <>
                                <span className="milink__icono">
                                  <Icon name={a.icon} size={22} strokeWidth={1.9} />
                                </span>
                                <span className="milink__nombre">
                                  <b>{a.label}</b>
                                  {a.nota && <small>{a.nota}</small>}
                                </span>
                                {a.href ? (
                                  <Icon name="chevron-right" size={18} strokeWidth={2.2} className="milink__ir" />
                                ) : (
                                  <em className="milink__pronto">Pronto</em>
                                )}
                              </>
                            );
                            const estilo = { '--c': a.color } as CSSProperties;
                            /*
                              Los portales que aun no existen no se enlazan: llevarian
                              a ninguna parte. Se marcan como pendientes.
                            */
                            return (
                              <li key={a.label}>
                                {a.href ? (
                                  <a className="milink__item" href={a.href} target="_blank" rel="noreferrer" role="menuitem" style={estilo}>
                                    {cuerpo}
                                  </a>
                                ) : (
                                  <span className="milink__item milink__item--pendiente" style={estilo}>
                                    {cuerpo}
                                  </span>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      <div className="milink__registro">
                        <IlustracionRegistro />
                        <b>¿Aún no estás registrado?</b>
                        <p>Crea tu cuenta para acceder a nuestros servicios, recursos y beneficios exclusivos.</p>
                        {REGISTRO_PORTAL ? (
                          <a className="milink__crear" href={REGISTRO_PORTAL} target="_blank" rel="noreferrer" role="menuitem">
                            Crear Mi Cuenta
                            <Icon name="arrow-right" size={16} strokeWidth={2.2} />
                          </a>
                        ) : (
                          <>
                            <span className="milink__crear milink__crear--pendiente" aria-disabled="true">
                              Crear Mi Cuenta
                              <Icon name="arrow-right" size={16} strokeWidth={2.2} />
                            </span>
                            <small className="milink__aviso">Disponible muy pronto</small>
                          </>
                        )}
                      </div>
                    </div>
                  </Flotante>
                )}
              </AnimatePresence>
            </div>

            <button
              className="icon-btn burger"
              type="button"
              onClick={() => setMobile(true)}
              aria-label="Abrir menú"
            >
              <Icon name="menu" size={21} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobile && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.3, ease: EASINGS.snappy }}
          >
            <div className="mobile-menu__head">
              <Logo variant="onDark" />
              <button className="icon-btn" type="button" onClick={() => setMobile(false)} aria-label="Cerrar menú">
                <Icon name="close" size={22} />
              </button>
            </div>

            <div className="mobile-menu__buscar">
              <Buscador onCerrar={() => setMobile(false)} cabecera={false} />
            </div>

            <div className="mobile-menu__group">
              <Link className="mobile-menu__title" to="/" onClick={() => setMobile(false)}>
                Inicio
              </Link>
            </div>

            {NAV.map((group) => (
              <div className="mobile-menu__group" key={group.label}>
                <button
                  className="mobile-menu__title"
                  type="button"
                  onClick={() => setMobileGroup(mobileGroup === group.label ? null : group.label)}
                >
                  {group.label}
                  <motion.span animate={{ rotate: mobileGroup === group.label ? 180 : 0 }}>
                    <Icon name="chevron-down" size={18} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {mobileGroup === group.label && (
                    <motion.div
                      className="mobile-menu__sub"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASINGS.snappy }}
                      style={{ overflow: 'hidden' }}
                    >
                      {(group.columns
                        ? group.columns.flatMap((c) =>
                            c.items.map((i) => ({ etiqueta: i.label, destino: i.href })),
                          )
                        : (group.children ?? []).map((c) => ({ etiqueta: c.label, destino: c.href }))
                      ).map(({ etiqueta, destino }) =>
                        /*
                          Las entradas que todavia no tienen pagina se leen pero
                          no navegan: enlazarlas llevaria al inicio sin mas.
                        */
                        destino ? (
                          <Link key={etiqueta} to={destino} onClick={() => setMobile(false)}>
                            {etiqueta}
                          </Link>
                        ) : (
                          <span key={etiqueta} className="mobile-menu__pendiente">
                            {etiqueta}
                          </span>
                        ),
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <div className="mobile-menu__actions">
              <p className="mobile-menu__rotulo">Acceso a Mi LINK — Portal de SIEGIX CRM</p>
              {PORTAL.map((a) =>
                a.href ? (
                  <a
                    key={a.label}
                    className="mobile-menu__portal"
                    href={a.href}
                    target="_blank"
                    rel="noreferrer"
                    style={{ '--c': a.color } as CSSProperties}
                    onClick={() => setMobile(false)}
                  >
                    <span className="mobile-menu__portal-icono">
                      <Icon name={a.icon} size={20} strokeWidth={1.8} />
                    </span>
                    {a.label}
                    <Icon name="external-link" size={16} strokeWidth={1.9} />
                  </a>
                ) : (
                  <span
                    key={a.label}
                    className="mobile-menu__portal mobile-menu__portal--pendiente"
                    style={{ '--c': a.color } as CSSProperties}
                  >
                    <span className="mobile-menu__portal-icono">
                      <Icon name={a.icon} size={20} strokeWidth={1.8} />
                    </span>
                    {a.label}
                    <em>Pronto</em>
                  </span>
                ),
              )}

              <div className="mobile-menu__registro">
                <b>¿Aún no estás registrado?</b>
                <p>Crea tu cuenta para acceder a nuestros servicios, recursos y beneficios exclusivos.</p>
                {REGISTRO_PORTAL ? (
                  <a className="milink__crear" href={REGISTRO_PORTAL} target="_blank" rel="noreferrer" onClick={() => setMobile(false)}>
                    Crear Mi Cuenta
                    <Icon name="arrow-right" size={16} strokeWidth={2.2} />
                  </a>
                ) : (
                  <span className="milink__crear milink__crear--pendiente" aria-disabled="true">
                    Crear Mi Cuenta · Pronto
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
