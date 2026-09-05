import { useState, type FormEvent } from 'react';
import Icon from '../ui/Icon';
import MagneticButton from '../ui/MagneticButton';
import { ECOSISTEMAS } from '../../data/ecosistemas';
import { EMPRESARIALES } from '../../data/empresariales';
import { PRODUCTOS_FICHA } from '../../data/productos';
import { enviarSolicitud, leerFormulario, type EstadoEnvio } from '../../utils/solicitudes';

/**
 * Formulario de solicitud de demo.
 *
 * La solicitud viaja a `/api/solicitud`, que la envia por correo a LINKDICOM.
 * `interes` preselecciona la solucion cuando se llega desde la ficha de un
 * producto o de un ecosistema.
 */
export default function FormularioDemo({ interes }: { interes?: string }) {
  const [estado, setEstado] = useState<EstadoEnvio>('listo');
  const [error, setError] = useState('');

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEstado('enviando');
    setError('');

    const resultado = await enviarSolicitud('demo', leerFormulario(e.currentTarget), interes);
    if (resultado.ok) {
      setEstado('enviado');
    } else {
      setEstado('error');
      setError(resultado.error ?? '');
    }
  };

  if (estado === 'enviado') {
    return (
      <div className="demo__gracias">
        <span className="demo__gracias-icono">
          <Icon name="check-circle" size={30} strokeWidth={1.7} />
        </span>
        <h3>Solicitud enviada</h3>
        <p>
          Gracias por escribirnos. Un especialista revisará tus datos y se pondrá en contacto
          contigo para agendar la demo.
        </p>
      </div>
    );
  }

  return (
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
        {/* trampa para robots: invisible y fuera del recorrido del teclado */}
        <input
          className="trampa"
          type="text"
          name="web"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

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
              +1
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
            <input name="institucion" type="text" required placeholder="Nombre de tu institución o empresa" />
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
            <select name="solucion" required defaultValue={interes ?? ''}>
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
                  <option key={p.slug} value={p.nombreCompleto}>
                    {p.nombreCompleto}
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

        {estado === 'error' && (
          <p className="campo campo--ancho aviso-error" role="alert">
            <Icon name="close" size={17} strokeWidth={2.4} />
            {error}
          </p>
        )}

        <div className="campo campo--ancho">
          <MagneticButton
            className="btn btn--primary btn--square btn--lg demo__enviar"
            type="submit"
            block
            strength={0.16}
          >
            {estado === 'enviando' ? 'Enviando…' : 'Solicitar Demo'}
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
  );
}
