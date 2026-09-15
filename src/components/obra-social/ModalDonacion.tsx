import { useState, type FormEvent } from 'react';
import Modal from '../ui/Modal';
import Icon, { type IconName } from '../ui/Icon';
import { enviarSolicitud, leerFormulario, type EstadoEnvio } from '../../utils/solicitudes';
import { imagen } from '../../contenido/store';

const TIPOS: { clave: string; label: string; icon: IconName }[] = [
  { clave: 'Alimentos', label: 'Alimentos', icon: 'gift' },
  { clave: 'Utensilios', label: 'Utensilios', icon: 'box' },
  { clave: 'Créditos en su negocio', label: 'Créditos en su negocio', icon: 'building' },
  { clave: 'Electrodomésticos', label: 'Electrodomésticos', icon: 'home' },
];

const MAXIMO = 300;

/**
 * "Quiero aportar a este evento": el formulario de la obra social.
 *
 * No se pide dinero, solo articulos. Lo que llega es la intencion de aportar
 * con el contacto de quien lo ofrece; LINKDICOM coordina despues la entrega.
 * Viaja al mismo punto de recepcion que el resto de formularios.
 */
export default function ModalDonacion({ evento, onClose }: { evento: string; onClose: () => void }) {
  const [tipos, setTipos] = useState<string[]>([]);
  const [detalle, setDetalle] = useState('');
  const [estado, setEstado] = useState<EstadoEnvio>('listo');
  const [error, setError] = useState('');

  const alternar = (clave: string) =>
    setTipos((t) => (t.includes(clave) ? t.filter((x) => x !== clave) : [...t, clave]));

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!tipos.length) {
      setEstado('error');
      setError('Selecciona al menos una forma de ayudar.');
      return;
    }
    setEstado('enviando');
    setError('');

    const datos = leerFormulario(e.currentTarget);
    const r = await enviarSolicitud(
      'donacion',
      { ...datos, evento, tipos: tipos.join(', '), detalle },
      'Obra social · Quiero aportar',
    );
    if (r.ok) {
      setEstado('enviado');
    } else {
      setEstado('error');
      setError(r.error ?? '');
    }
  };

  return (
    <Modal titulo="Quiero aportar a este evento" onClose={onClose} className="modal--donacion" ancho="1040px">
      <div className="donar">
        {/* ---------- Lado con la foto ---------- */}
        <aside className="donar__lado">
          <img src={imagen('/img/obra-social/donacion-lado.webp')} alt="" aria-hidden="true" />
          <div className="donar__lado-texto">
            <p className="donar__lema">
              Ayúdanos <em>a Ayudar</em>
            </p>
            <ul>
              <li>
                <Icon name="gift" size={30} strokeWidth={1.5} />
                <span>
                  Alimentos
                  <br />
                  para compartir
                </span>
              </li>
              <li>
                <Icon name="users" size={30} strokeWidth={1.5} />
                <span>
                  Familias
                  <br />
                  más fuertes
                </span>
              </li>
              <li>
                <Icon name="heart" size={30} strokeWidth={1.5} />
                <span>
                  Comunidades
                  <br />
                  más unidas
                </span>
              </li>
            </ul>
          </div>
        </aside>

        {/* ---------- Formulario ---------- */}
        <div className="donar__cuerpo">
          {estado === 'enviado' ? (
            <div className="demo__gracias">
              <span className="demo__gracias-icono">
                <Icon name="check-circle" size={30} strokeWidth={1.7} />
              </span>
              <h3>¡Gracias por tu apoyo!</h3>
              <p>
                Recibimos tu información. Nos pondremos en contacto contigo para coordinar la entrega de tu
                aporte antes de la jornada.
              </p>
              <button className="btn btn--square demo__volver" type="button" onClick={onClose}>
                Volver a la página
              </button>
            </div>
          ) : (
            <form onSubmit={enviar}>
              <input className="trampa" type="text" name="web" tabIndex={-1} autoComplete="off" aria-hidden="true" />

              <span className="donar__eyebrow">Obra social</span>
              <p className="donar__titulo">Quiero aportar a este evento</p>
              <p className="donar__intro">
                Tu colaboración puede marcar la diferencia. Con una libra de arroz o el artículo que desees donar,
                estarás ayudando a familias que lo necesitan en San Juan de la Maguana.
              </p>

              <p className="donar__aviso donar__aviso--azul">
                <Icon name="gift" size={22} strokeWidth={1.7} />
                <span>
                  <b>No solicitamos dinero</b>
                  Las donaciones se realizan mediante productos o artículos, no mediante aportes monetarios.
                </span>
              </p>

              <p className="donar__rotulo">
                ¿Cómo quieres ayudar?
                <small>Selecciona una o más opciones:</small>
              </p>
              <div className="donar__tipos" role="group" aria-label="Formas de ayudar">
                {TIPOS.map((t) => {
                  const activo = tipos.includes(t.clave);
                  return (
                    <button
                      key={t.clave}
                      type="button"
                      className={`donar__tipo${activo ? ' is-activo' : ''}`}
                      aria-pressed={activo}
                      onClick={() => alternar(t.clave)}
                    >
                      {activo && (
                        <span className="donar__tipo-check" aria-hidden="true">
                          <Icon name="check" size={11} strokeWidth={3} />
                        </span>
                      )}
                      <Icon name={t.icon} size={26} strokeWidth={1.6} />
                      {t.label}
                    </button>
                  );
                })}
              </div>

              <label className="donar__campo donar__campo--area">
                <span className="donar__rotulo">Cuéntanos sobre tu ayuda</span>
                <textarea
                  name="detalle"
                  rows={3}
                  maxLength={MAXIMO}
                  placeholder="Ejemplo: 5 libras de arroz, 3 latas de habichuelas, etc."
                  value={detalle}
                  onChange={(e) => setDetalle(e.target.value)}
                />
                <small className="donar__contador">
                  {detalle.length}/{MAXIMO}
                </small>
              </label>

              <p className="donar__rotulo">Tu información de contacto</p>
              <div className="donar__contacto">
                <label className="donar__campo">
                  <Icon name="user-round" size={17} strokeWidth={1.8} />
                  <input name="nombre" type="text" required placeholder="Nombre o Empresa" />
                </label>
                <label className="donar__campo">
                  <Icon name="phone" size={17} strokeWidth={1.8} />
                  <input name="telefono" type="tel" required placeholder="Número de contacto" />
                </label>
                <label className="donar__campo donar__campo--ancho">
                  <Icon name="mail" size={17} strokeWidth={1.8} />
                  <input name="correo" type="email" placeholder="Correo electrónico (opcional)" />
                </label>
              </div>

              <p className="donar__aviso donar__aviso--verde">
                <Icon name="image" size={20} strokeWidth={1.7} />
                <span>
                  <b>Recibirás evidencia de tu donación</b>
                  Cada persona o empresa que colabore recibirá una foto o video de la entrega de su donación a una
                  familia, como parte de nuestro compromiso de transparencia.
                </span>
              </p>
              <p className="donar__aviso donar__aviso--azul">
                <Icon name="users" size={20} strokeWidth={1.7} />
                <span>
                  <b>Serás parte de nuestra lista de agradecimiento</b>
                  Publicaremos una lista de Empresas, Clientes y Allegados que hayan contribuido con esta acción
                  social.
                </span>
              </p>

              {estado === 'error' && (
                <p className="aviso-error" role="alert">
                  <Icon name="close" size={17} strokeWidth={2.4} />
                  {error}
                </p>
              )}

              <button className="btn btn--primary btn--square btn--lg donar__enviar" type="submit" disabled={estado === 'enviando'}>
                <Icon name="send" size={18} strokeWidth={1.9} />
                {estado === 'enviando' ? 'Enviando…' : 'Enviar mi información'}
              </button>
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
}
