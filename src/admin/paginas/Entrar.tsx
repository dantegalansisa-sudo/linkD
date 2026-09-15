import { useState, type FormEvent } from 'react';
import Icon from '../../components/ui/Icon';
import { mensajeDe, useEstado } from '../estado';
import { AvisoEnLinea, Boton, Campo, Entrada } from '../ui/Basicos';

/**
 * Pantalla de entrada. La primera vez (sin ninguna cuenta creada) pide los
 * datos del administrador en lugar de las credenciales.
 */
export default function Entrar() {
  const { instalado, entrar, instalar, errorCarga, servidor } = useEstado();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [clave2, setClave2] = useState('');
  const [ver, setVer] = useState(false);
  const [error, setError] = useState('');
  const [ocupado, setOcupado] = useState(false);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!instalado && clave !== clave2) {
      setError('Las dos contraseñas no coinciden.');
      return;
    }
    setOcupado(true);
    try {
      if (instalado) await entrar(correo.trim(), clave);
      else await instalar(nombre.trim(), correo.trim(), clave);
    } catch (err) {
      setError(mensajeDe(err));
    } finally {
      setOcupado(false);
    }
  };

  return (
    <div className="adm-entrar">
      <div className="adm-entrar__lado">
        <div className="adm-entrar__marca">
          <span>
            <b>LINK</b>DICOM
          </span>
          <small>CONECTA Y AVANZA</small>
        </div>
        <h1>Panel de administración</h1>
        <p>Noticias, recursos, obra social y las fotos de la web, desde un solo lugar.</p>
        <ul className="adm-entrar__lista">
          <li>
            <Icon name="newspaper" size={18} strokeWidth={1.8} />
            Publica noticias con fotos y videos
          </li>
          <li>
            <Icon name="play" size={18} strokeWidth={1.8} />
            Conferencias, webinars, entrevistas y materiales
          </li>
          <li>
            <Icon name="heart" size={18} strokeWidth={1.8} />
            Jornadas del Programa Virginia Toca
          </li>
          <li>
            <Icon name="image" size={18} strokeWidth={1.8} />
            Cambia cualquier foto del sitio
          </li>
        </ul>
      </div>

      <form className="adm-entrar__caja" onSubmit={enviar}>
        <h2>{instalado ? 'Entrar' : 'Crea la cuenta de administrador'}</h2>
        <p className="adm-entrar__nota">
          {instalado ? 'Usa el correo y la contraseña de tu cuenta del panel.' : 'Es la primera vez que se abre el panel. Esta cuenta podrá crear las demás.'}
        </p>

        {errorCarga && <AvisoEnLinea tipo="error">{errorCarga}</AvisoEnLinea>}
        {servidor && !servidor.escribible && (
          <AvisoEnLinea tipo="alerta">
            El servidor no permite escribir en las carpetas del panel. Se puede entrar, pero no se guardará nada hasta que se corrijan los permisos (Ajustes explica cuáles).
          </AvisoEnLinea>
        )}

        {!instalado && (
          <Campo etiqueta="Tu nombre" obligatorio>
            <Entrada value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" required autoFocus />
          </Campo>
        )}
        <Campo etiqueta="Correo electrónico" obligatorio>
          <Entrada type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} autoComplete="username" required autoFocus={instalado} />
        </Campo>
        <Campo etiqueta="Contraseña" obligatorio ayuda={instalado ? undefined : 'Mínimo 8 caracteres.'}>
          <span className="adm-clave">
            <Entrada type={ver ? 'text' : 'password'} value={clave} onChange={(e) => setClave(e.target.value)} autoComplete={instalado ? 'current-password' : 'new-password'} required minLength={8} />
            <button type="button" onClick={() => setVer((v) => !v)} aria-label={ver ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
              <Icon name={ver ? 'eye-off' : 'eye'} size={17} strokeWidth={2} />
            </button>
          </span>
        </Campo>
        {!instalado && (
          <Campo etiqueta="Repite la contraseña" obligatorio>
            <Entrada type={ver ? 'text' : 'password'} value={clave2} onChange={(e) => setClave2(e.target.value)} autoComplete="new-password" required minLength={8} />
          </Campo>
        )}

        {error && <AvisoEnLinea tipo="error">{error}</AvisoEnLinea>}

        <Boton type="submit" variante="primario" cargando={ocupado} icono={instalado ? 'arrow-right' : 'check'} className="adm-entrar__boton">
          {instalado ? 'Entrar al panel' : 'Crear cuenta y entrar'}
        </Boton>

        <a className="adm-entrar__volver" href="/">
          <Icon name="arrow-left" size={14} strokeWidth={2.2} />
          Volver a la web
        </a>
      </form>
    </div>
  );
}
