import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ProveedorEstado, useEstado } from './estado';
import { ProveedorConfirmar } from './ui/Modal';
import Marco from './Marco';
import Entrar from './paginas/Entrar';
import Inicio from './paginas/Inicio';
import Noticias from './paginas/Noticias';
import NoticiaEditor from './paginas/NoticiaEditor';
import Recursos from './paginas/Recursos';
import RecursoEditor from './paginas/RecursoEditor';
import ObraSocial from './paginas/ObraSocial';
import JornadaEditor from './paginas/JornadaEditor';
import Imagenes from './paginas/Imagenes';
import Medios from './paginas/Medios';
import Solicitudes from './paginas/Solicitudes';
import Usuarios from './paginas/Usuarios';
import Ajustes from './paginas/Ajustes';

/*
  Panel de administracion de LINKDICOM (/ldwam; sin 'admin' en la ruta a
  proposito, que es lo primero que prueban los robots).

  Aplicacion aparte de la web publica, con su propio index.html. Mientras no
  hay sesion se ve la pantalla de entrada; con sesion, el marco con las
  secciones.
*/

function ArribaAlNavegar() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Puerta() {
  const { cargando, usuario, maestro } = useEstado();

  if (cargando) {
    return (
      <div className="adm-cargando">
        <span className="adm-girando adm-girando--grande" />
        <p>Abriendo el panel…</p>
      </div>
    );
  }
  if (!usuario) return <Entrar />;
  if (!maestro) {
    return (
      <div className="adm-cargando">
        <span className="adm-girando adm-girando--grande" />
        <p>Cargando el contenido…</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<Marco />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/noticias/:slug" element={<NoticiaEditor />} />
        <Route path="/recursos" element={<Recursos />} />
        <Route path="/recursos/:tipo" element={<Recursos />} />
        <Route path="/recursos/:tipo/:slug" element={<RecursoEditor />} />
        <Route path="/obra-social" element={<ObraSocial />} />
        <Route path="/obra-social/jornadas/:slug" element={<JornadaEditor />} />
        <Route path="/imagenes" element={<Imagenes />} />
        <Route path="/medios" element={<Medios />} />
        <Route path="/solicitudes" element={<Solicitudes />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/ajustes" element={<Ajustes />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/ldwam">
      <ProveedorEstado>
        <ProveedorConfirmar>
          <ArribaAlNavegar />
          <Puerta />
        </ProveedorConfirmar>
      </ProveedorEstado>
    </BrowserRouter>
  );
}
