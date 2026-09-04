import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '../ui/Icon';
import Logo from '../ui/Logo';
import { NAV } from '../../data/site';
import { EASINGS } from '../../utils/easings';

/**
 * Menu principal: bloque blanco del logo con corte diagonal sobre una barra
 * azul marino. El CTA "IR A MI LINK" sustituye por completo a "Solicitar demo".
 */
export default function Header() {
  // "Inicio" solo se marca activo cuando de verdad estamos en el home
  const { pathname } = useLocation();
  const enInicio = pathname === '/';
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = mobile ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobile]);

  return (
    <>
      <header className="nav-header">
        <div className="nav-header__inner">
          <Link className="nav-header__brand" to="/" aria-label="LINKDICOM — inicio">
            <Logo variant="onLight" />
          </Link>

          <nav className="mainnav" onMouseLeave={() => setOpen(null)}>
            <Link className={`mainnav__link${enInicio ? ' is-active' : ''}`} to="/">
              <Icon name="home" size={15} strokeWidth={1.9} />
              Inicio
            </Link>

            {NAV.map((group) => (
              <div key={group.label} className="mainnav__item" onMouseEnter={() => setOpen(group.label)}>
                <button className="mainnav__link" type="button" aria-expanded={open === group.label}>
                  {group.label}
                  <Icon name="chevron-down" size={14} strokeWidth={2} />
                </button>

                <AnimatePresence>
                  {open === group.label && (
                    <motion.div
                      className={`megamenu${group.columns ? ' megamenu--dual' : ''}`}
                      initial={{ opacity: 0, y: 10, scale: 0.985 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.985 }}
                      transition={{ duration: 0.26, ease: EASINGS.snappy }}
                    >
                      {group.columns
                        ? group.columns.map((col) => (
                            <div className={`megacol megacol--${col.tone}`} key={col.titleAccent}>
                              <div className="megacol__head">
                                <span className="megacol__badge">
                                  <Icon name={col.icon} size={22} strokeWidth={1.7} />
                                </span>
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
                                    <a
                                      className="megaitem"
                                      href={item.href}
                                      style={item.color ? ({ '--c': item.color } as React.CSSProperties) : undefined}
                                    >
                                      <span className="megaitem__icon">
                                        <Icon name={item.icon} size={20} strokeWidth={1.7} />
                                      </span>
                                      <span className="megaitem__body">
                                        <span className="megaitem__name">{item.kicker ?? item.label}</span>
                                        <span className="megaitem__desc">
                                          {item.kicker ? `${item.label}: ${item.desc}` : item.desc}
                                        </span>
                                      </span>
                                      <Icon name="chevron-right" size={16} className="megaitem__go" />
                                    </a>
                                  </li>
                                ))}
                              </ul>

                              {/* vuelve al home y baja a la seccion que toca */}
                              <Link
                                className="megacol__cta"
                                to={{
                                  pathname: '/',
                                  hash: group.label === 'Soluciones' ? '#ecosistema' : '#productos',
                                }}
                              >
                                {col.cta}
                                <Icon name="arrow-right" size={15} strokeWidth={2.2} />
                              </Link>
                            </div>
                          ))
                        : group.children?.map((child) => (
                            <Link key={child.label} className="megamenu__link" to={{ pathname: '/', hash: '#ecosistema' }}>
                              <span className="megamenu__icon">
                                <Icon name={child.icon} size={17} />
                              </span>
                              <span>
                                <span className="megamenu__title">{child.label}</span>
                                <span className="megamenu__desc">{child.desc}</span>
                              </span>
                            </Link>
                          ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          <div className="nav-header__actions">
            <button className="icon-btn" type="button" aria-label="Buscar en el sitio">
              <Icon name="search" size={19} />
            </button>

            <motion.a
              className="portal-btn"
              href="#portales"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>
                <b>Ir a mi LINK</b>
                <small>Portal de Servicios</small>
              </span>
              <Icon name="external-link" size={17} strokeWidth={1.9} />
            </motion.a>

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
                        ? group.columns.flatMap((c) => c.items.map((i) => i.kicker ?? i.label))
                        : (group.children ?? []).map((c) => c.label)
                      ).map((etiqueta) => (
                        <a key={etiqueta} href="#soluciones" onClick={() => setMobile(false)}>
                          {etiqueta}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <div className="mobile-menu__actions">
              <a className="btn btn--primary btn--square btn--block" href="#contacto" onClick={() => setMobile(false)}>
                <span className="btn__label">
                  Ir a mi LINK — Portal de Servicios
                  <Icon name="external-link" size={16} strokeWidth={1.9} />
                </span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
