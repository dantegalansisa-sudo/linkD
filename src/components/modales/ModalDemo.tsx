import { useState, type FormEvent } from 'react';
import Modal from '../ui/Modal';
import Logo from '../ui/Logo';
import Icon from '../ui/Icon';
import MagneticButton from '../ui/MagneticButton';
import { CONTACT } from '../../data/site';
import { ECOSISTEMAS } from '../../data/ecosistemas';
import { PRODUCTOS_FICHA } from '../../data/productos';
import { EMPRESARIALES } from '../../data/empresariales';

const VENTAJAS = [
  {
    icon: 'monitor' as const,
    color: '#f97316',
    titulo: 'Conocer nuestras soluciones en acción',
    texto: 'Explora las funcionalidades clave con un especialista.',
  },
  {
    icon: 'users' as const,
    color: '#6d5bd0',
    titulo: 'Resolver tus dudas en tiempo real',
    texto: 'Recibe asesoría personalizada según las necesidades de tu institución.',
  },
  {
    icon: 'shield' as const,
    color: '#0f8a5f',
    titulo: 'Ver resultados reales',
    texto: 'Conoce casos de éxito y cómo otras instituciones ya están avanzando.',
  },
];

/**
 * Formulario de solicitud de demo.
 *
 * No hay servidor detras: al enviar se abre WhatsApp con el mensaje ya
 * redactado, que es el canal que la empresa usa hoy. Si mas adelante quieren
 * que los datos entren en un CRM o en un correo, solo cambia `enviar`.
 */
export default function ModalDemo({ origen, onClose }: { origen?: string; onClose: () => void }) {
  const [enviado, setEnviado] = useState(false);

  const enviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const linea = (etiqueta: string, campo: string) => {
      const v = String(d.get(campo) ?? '').trim();
      return v ? `${etiqueta}: ${v}\n` : '';
    };

    const mensaje =
      'Hola LINKDICOM, quiero solicitar una demo.\n\n' +
      linea('Nombre', 'nombre') +
      linea('Correo', 'correo') +
      linea('Teléfono', 'telefono') +
      linea('Institución', 'institucion') +
      linea('Cargo', 'cargo') +
      linea('Solución de interés', 'solucion') +
      linea('Mensaje', 'mensaje') +
      (origen ? `\n(Solicitado desde: ${origen})` : '');

    window.open(`${CONTACT.whatsapp}?text=${encodeURIComponent(mensaje)}`, '_blank', 'noopener');
    setEnviado(true);
  };

  return (
    <Modal titulo="Solicitar una demo" onClose={onClose} className="modal--demo" ancho="1060px">
      <div className="demo">
        {/* ---------- Columna de argumentos ---------- */}
        <aside className="demo__lado">
          <span className="demo__logo">
            <Logo variant="onLight" />
          </span>

          <p className="demo__titulo">
            Solicitar una <em>demo</em>
          </p>
          <p className="demo__intro">
            Descubre cómo <b>LINKDICOM</b> puede transformar tu institución con tecnología
            inteligente para la salud.
          </p>

          <span className="demo__regla" aria-hidden="true" />

          <p className="demo__rotulo">Con una demo personalizada podrás:</p>
          <ul className="demo__ventajas">
            {VENTAJAS.map((v) => (
              <li key={v.titulo} style={{ '--c': v.color } as React.CSSProperties}>
                <span className="demo__ventaja-icono">
                  <Icon name={v.icon} size={20} strokeWidth={1.7} />
                </span>
                <span>
                  <b>{v.titulo}</b>
                  <small>{v.texto}</small>
                </span>
              </li>
            ))}
          </ul>

          <img
            className="demo__captura"
            src="/img/productos/radiologox/panel.webp"
            alt="Estación de trabajo con una solución de LINKDICOM en pantalla"
            loading="lazy"
          />

          <p className="demo__sello">
            <Icon name="building" size={20} strokeWidth={1.7} />
            <span>
              <b>+200</b> instituciones confían en nosotros
            </span>
          </p>
        </aside>

        {/* ---------- Formulario ---------- */}
        <div className="demo__form">
          {enviado ? (
            <div className="demo__gracias">
              <span className="demo__gracias-icono">
                <Icon name="check-circle" size={30} strokeWidth={1.7} />
              </span>
              <h3>Ya tienes tu mensaje listo</h3>
              <p>
                Se abrió WhatsApp con tus datos. Solo tienes que enviarlo y un especialista se
                pondrá en contacto contigo para agendar la demo.
              </p>
              <button className="btn btn--square demo__volver" type="button" onClick={onClose}>
                <span className="btn__label">Cerrar</span>
              </button>
            </div>
          ) : (
            <>
              <div className="demo__form-cabeza">
                <span className="demo__form-icono">
                  <Icon name="calendar" size={22} strokeWidth={1.7} />
                </span>
                <div>
                  <p className="demo__form-titulo">Completa el formulario</p>
                  <p className="demo__form-nota">
                    Un especialista se pondrá en contacto contigo para agendar tu demo.
                  </p>
                </div>
              </div>

              <form className="demo__campos" onSubmit={enviar}>
                <label className="campo">
                  <span className="campo__etiqueta">
                    Nombre completo <b aria-hidden="true">*</b>
                  </span>
                  <span className="campo__caja">
                    <Icon name="user-round" size={17} strokeWidth={1.8} />
                    <input name="nombre" type="text" required placeholder="Ingresa tu nombre completo" />
                  </span>
                </label>

                <label className="campo">
                  <span className="campo__etiqueta">
                    Correo electrónico <b aria-hidden="true">*</b>
                  </span>
                  <span className="campo__caja">
                    <Icon name="mail" size={17} strokeWidth={1.8} />
                    <input name="correo" type="email" required placeholder="ejemplo@institucion.com" />
                  </span>
                </label>

                <label className="campo">
                  <span className="campo__etiqueta">
                    Teléfono / WhatsApp <b aria-hidden="true">*</b>
                  </span>
                  <span className="campo__caja">
                    <span className="campo__prefijo" aria-hidden="true">
                      🇩🇴 +1
                    </span>
                    <input name="telefono" type="tel" required placeholder="(809) 123-4567" />
                  </span>
                </label>

                <label className="campo">
                  <span className="campo__etiqueta">
                    Institución / Empresa <b aria-hidden="true">*</b>
                  </span>
                  <span className="campo__caja">
                    <Icon name="building" size={17} strokeWidth={1.8} />
                    <input
                      name="institucion"
                      type="text"
                      required
                      placeholder="Nombre de tu institución o empresa"
                    />
                  </span>
                </label>

                <label className="campo">
                  <span className="campo__etiqueta">Cargo / Posición</span>
                  <span className="campo__caja">
                    <Icon name="layers" size={17} strokeWidth={1.8} />
                    <input name="cargo" type="text" placeholder="Tu cargo o posición actual" />
                  </span>
                </label>

                <label className="campo">
                  <span className="campo__etiqueta">
                    ¿Qué solución te interesa? <b aria-hidden="true">*</b>
                  </span>
                  <span className="campo__caja campo__caja--select">
                    <select name="solucion" required defaultValue={origen ?? ''}>
                      <option value="" disabled>
                        Selecciona una opción
                      </option>
                      <optgroup label="Ecosistemas de salud">
                        {ECOSISTEMAS.map((e) => (
                          <option key={e.slug} value={e.miga}>
                            {e.miga}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Productos de salud">
                        {PRODUCTOS_FICHA.map((p) => (
                          <option key={p.slug} value={p.nombre}>
                            {p.nombre}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Soluciones empresariales">
                        {EMPRESARIALES.map((p) => (
                          <option key={p.slug} value={`${p.nombre}${p.nombreAccent ?? ''}`}>
                            {p.nombre}
                            {p.nombreAccent}
                          </option>
                        ))}
                      </optgroup>
                      <option value="Todavía no lo sé">Todavía no lo sé</option>
                    </select>
                    <Icon name="chevron-down" size={16} strokeWidth={2} />
                  </span>
                </label>

                <label className="campo campo--ancho">
                  <span className="campo__etiqueta">Mensaje adicional (opcional)</span>
                  <span className="campo__caja campo__caja--area">
                    <textarea
                      name="mensaje"
                      rows={3}
                      placeholder="Cuéntanos brevemente sobre tu institución o necesidades específicas..."
                    />
                  </span>
                </label>

                <div className="campo campo--ancho">
                  <MagneticButton
                    className="btn btn--primary btn--square btn--lg demo__enviar"
                    type="submit"
                    block
                    strength={0.16}
                  >
                    Solicitar Demo
                    <span className="btn__arrow">
                      <Icon name="arrow-right" size={17} strokeWidth={2.2} />
                    </span>
                  </MagneticButton>
                </div>
              </form>

              <p className="demo__aviso">
                <Icon name="lock" size={14} strokeWidth={1.9} />
                Tu información está protegida. No compartimos tus datos.
              </p>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
