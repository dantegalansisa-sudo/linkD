import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '../ui/Icon';
import MagneticButton from '../ui/MagneticButton';
import { NAV } from '../../data/site';
import { EASINGS } from '../../utils/easings';

export default function Header() {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobile ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobile]);

  return (
    <>
      <header className={`header${stuck ? ' is-stuck' : ''}`}>
        <div className="container container--wide header__inner">
          <a className="brand" href="#top" aria-label="LINKDICOM — inicio">
            <motion.img
              className="brand__img"
              src="/brand/linkdicom-logo-dark.png"
              alt="LINKDICOM"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: EASINGS.premium, delay: 0.1 }}
            />
          </a>

          <nav className="nav" onMouseLeave={() => setOpen(null)}>
            {NAV.map((group) => (
              <div key={group.label} className="nav__item" onMouseEnter={() => setOpen(group.label)}>
                <button className="nav__link" type="button" aria-expanded={open === group.label}>
                  {group.label}
                  <Icon name="chevron-down" size={14} strokeWidth={2} />
                </button>

                <AnimatePresence>
                  {open === group.label && (
                    <motion.div
                      className="nav__panel"
                      initial={{ opacity: 0, y: 10, x: '-50%', scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
                      exit={{ opacity: 0, y: 6, x: '-50%', scale: 0.98 }}
                      transition={{ duration: 0.28, ease: EASINGS.snappy }}
                    >
                      {group.children.map((child) => (
                        <a key={child.label} className="nav__panel-link" href="#soluciones">
                          <span className="nav__panel-icon">
                            <Icon name={child.icon} size={17} />
                          </span>
                          <span>
                            <span className="nav__panel-title">{child.label}</span>
                            <span className="nav__panel-desc">{child.desc}</span>
                          </span>
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <a className="nav__link" href="#contacto">
              Soporte
            </a>
            <a className="nav__link" href="#portales">
              Portales
            </a>
          </nav>

          <div className="header__actions">
            <button className="icon-btn" type="button" aria-label="Buscar en el sitio">
              <Icon name="search" size={18} />
            </button>

            <span className="header__cta">
              <MagneticButton href="#contacto" className="btn btn--primary btn--sm" strength={0.22}>
                <Icon name="graduation" size={15} />
                LINKDICOM University
                <span className="btn__arrow">
                  <Icon name="arrow-right" size={14} strokeWidth={2.2} />
                </span>
              </MagneticButton>
            </span>

            <button
              className="icon-btn burger"
              type="button"
              onClick={() => setMobile(true)}
              aria-label="Abrir menú"
            >
              <Icon name="menu" size={20} />
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
              <img className="brand__img" src="/brand/linkdicom-logo-dark.png" alt="LINKDICOM" />
              <button className="icon-btn" type="button" onClick={() => setMobile(false)} aria-label="Cerrar menú">
                <Icon name="close" size={22} />
              </button>
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
                      {group.children.map((child) => (
                        <a key={child.label} href="#soluciones" onClick={() => setMobile(false)}>
                          {child.label}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <div className="mobile-menu__actions">
              <a className="btn btn--primary btn--block" href="#contacto" onClick={() => setMobile(false)}>
                <span className="btn__label">Solicitar demo</span>
              </a>
              <a className="btn btn--ghost btn--block" href="#portales" onClick={() => setMobile(false)}>
                <span className="btn__label">Ir a mis portales</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
