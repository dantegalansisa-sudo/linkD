import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import Icon, { type IconName } from '../components/ui/Icon';
import { get } from './api';
import { useEstado } from './estado';

/*
  Marco del panel: barra lateral con las secciones, barra superior con el
  usuario y el enlace a la web, y los avisos flotantes.
*/

interface Entrada {
  to: string;
  label: string;
  icon: IconName;
  soloAdmin?: boolean;
  contador?: number;
}

export default function Marco() {
  const { usuario, salir, avisos, quitarAviso } = useEstado();
  const [abierto, setAbierto] = useState(false);
  const [nuevas, setNuevas] = useState(0);
  const { pathname } = useLocation();

  // el movil cierra el menu al navegar
  useEffect(() => {
    setAbierto(false);
  }, [pathname]);

  // solicitudes sin atender, para el globo del menu
  useEffect(() => {
    let vivo = true;
    const leer = () =>
      get<{ nuevas: number }>('solicitudes', { estado: 'nueva' })
        .then((r) => vivo && setNuevas(r.nuevas))
        .catch(() => undefined);
    leer();
    const t = window.setInterval(leer, 120000);
    return () => {
      vivo = false;
      window.clearInterval(t);
    };
  }, [pathname]);

  const grupos: { titulo: string; entradas: Entrada[] }[] = [
    { titulo: '', entradas: [{ to: '/', label: 'Inicio', icon: 'dashboard' }] },
    {
      titulo: 'Contenido',
      entradas: [
        { to: '/noticias', label: 'Noticias', icon: 'newspaper' },
        { to: '/recursos', label: 'Recursos', icon: 'play' },
        { to: '/obra-social', label: 'Obra social', icon: 'heart' },
      ],
    },
    {
      titulo: 'Medios',
      entradas: [
        { to: '/imagenes', label: 'Imágenes del sitio', icon: 'image' },
        { to: '/medios', label: 'Biblioteca', icon: 'folder' },
      ],
    },
    {
      titulo: 'Bandeja',
      entradas: [{ to: '/solicitudes', label: 'Solicitudes', icon: 'inbox', contador: nuevas }],
    },
    {
      titulo: 'Sistema',
      entradas: [
        { to: '/usuarios', label: 'Usuarios', icon: 'users', soloAdmin: true },
        { to: '/ajustes', label: 'Ajustes', icon: 'settings' },
      ],
    },
  ];

  return (
    <div className={`adm${abierto ? ' is-menu-abierto' : ''}`}>
      <aside className="adm-lateral">
        <div className="adm-marca">
          <span className="adm-marca__logo">
            <b>LINK</b>DICOM
          </span>
          <small>Panel de administración</small>
        </div>

        <nav className="adm-nav" aria-label="Secciones">
          {grupos.map((g) => (
            <div className="adm-nav__grupo" key={g.titulo || 'inicio'}>
              {g.titulo && <span className="adm-nav__titulo">{g.titulo}</span>}
              {g.entradas
                .filter((e) => !e.soloAdmin || usuario?.rol === 'administrador')
                .map((e) => (
                  <NavLink key={e.to} to={e.to} end={e.to === '/'} className={({ isActive }) => `adm-nav__enlace${isActive ? ' is-activo' : ''}`}>
                    <Icon name={e.icon} size={18} strokeWidth={1.9} />
                    {e.label}
                    {!!e.contador && <span className="adm-nav__globo">{e.contador}</span>}
                  </NavLink>
                ))}
            </div>
          ))}
        </nav>

        <div className="adm-lateral__pie">
          <a className="adm-nav__enlace" href="/" target="_blank" rel="noreferrer">
            <Icon name="external-link" size={17} strokeWidth={1.9} />
            Ver la web
          </a>
        </div>
      </aside>

      <div className="adm-principal">
        <header className="adm-superior">
          <button type="button" className="adm-superior__menu" onClick={() => setAbierto((a) => !a)} aria-label="Menú">
            <Icon name={abierto ? 'close' : 'menu'} size={20} strokeWidth={2} />
          </button>
          <span className="adm-superior__hueco" />
          <div className="adm-usuario">
            <span className="adm-usuario__avatar">{(usuario?.nombre ?? '?').trim().charAt(0).toUpperCase()}</span>
            <span className="adm-usuario__texto">
              <b>{usuario?.nombre}</b>
              <small>{usuario?.rol === 'administrador' ? 'Administrador' : 'Editor'}</small>
            </span>
            <button type="button" className="adm-usuario__salir" onClick={() => void salir()} title="Cerrar sesión">
              <Icon name="logout" size={18} strokeWidth={2} />
            </button>
          </div>
        </header>

        <main className="adm-contenido">
          <Outlet />
        </main>
      </div>

      {abierto && <button type="button" className="adm-velo" aria-label="Cerrar menú" onClick={() => setAbierto(false)} />}

      <div className="adm-avisos" aria-live="polite">
        {avisos.map((a) => (
          <div key={a.id} className={`adm-aviso-flotante adm-aviso-flotante--${a.tipo}`}>
            <Icon name={a.tipo === 'ok' ? 'check-circle' : a.tipo === 'error' ? 'alert' : 'info'} size={18} strokeWidth={2} />
            <span>{a.texto}</span>
            <button type="button" onClick={() => quitarAviso(a.id)} aria-label="Cerrar">
              <Icon name="close" size={14} strokeWidth={2.4} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
