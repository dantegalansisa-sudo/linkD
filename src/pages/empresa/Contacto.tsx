import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../components/ui/Icon';
import MagneticButton from '../../components/ui/MagneticButton';
import { Reveal } from '../../components/ui/RevealText';
import { TituloEmpresa } from '../../components/empresa/Marco';
import { CONTACTO_PAGINA } from '../../data/empresa';
import { CONTACT } from '../../data/site';
import { cardVariants, containerVariants, VIEWPORT } from '../../utils/easings';

/**
 * Contactanos.
 *
 * Igual que el modal de demo: como no hay servidor detras, al enviar se abre
 * WhatsApp con el mensaje ya redactado. Cuando exista un punto de recepcion,
 * solo cambia `enviar`.
 */
export default function Contacto() {
  const [motivo, setMotivo] = useState(CONTACTO_PAGINA.motivos[0].titulo);
  const [enviado, setEnviado] = useState(false);

  const enviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const linea = (etiqueta: string, campo: string) => {
      const v = String(d.get(campo) ?? '').trim();
      return v ? `${etiqueta}: ${v}\n` : '';
    };
    const mensaje =
      'Hola LINKDICOM, les escribo desde la web.\n\n' +
      linea('Nombre', 'nombre') +
      linea('Correo', 'correo') +
      linea('Teléfono', 'telefono') +
      linea('Empresa', 'empresa') +
      `Motivo: ${motivo}\n` +
      linea('Mensaje', 'mensaje');

    window.open(`${CONTACT.whatsapp}?text=${encodeURIComponent(mensaje)}`, '_blank', 'noopener');
    setEnviado(true);
  };

  return (
    <>
      <section className="ei-seccion">
        <div className="container container--wide ei-contacto">
          {/* --- Formulario --- */}
          <Reveal className="ei-caja" y={24}>
            <TituloEmpresa titulo="Envíanos un" accent="mensaje" />
            <p className="ei-caja__nota">
              Completa el siguiente formulario y cuéntanos cómo podemos ayudarte. Todos los campos
              marcados con <b>*</b> son obligatorios.
            </p>

            {enviado ? (
              <div className="ei-gracias">
                <span>
                  <Icon name="check-circle" size={30} strokeWidth={1.7} />
                </span>
                <h3>Tu mensaje está listo</h3>
                <p>
                  Se abrió WhatsApp con tus datos. Solo tienes que enviarlo y te responderemos en
                  menos de 24 horas.
                </p>
              </div>
            ) : (
              <form className="ei-form" onSubmit={enviar}>
                <label className="campo">
                  <span className="campo__etiqueta">
                    Nombre completo <b aria-hidden="true">*</b>
                  </span>
                  <span className="campo__caja">
                    <input name="nombre" type="text" required placeholder="Tu nombre y apellidos" />
                  </span>
                </label>

                <label className="campo">
                  <span className="campo__etiqueta">
                    Correo electrónico <b aria-hidden="true">*</b>
                  </span>
                  <span className="campo__caja">
                    <input name="correo" type="email" required placeholder="tu@email.com" />
                  </span>
                </label>

                <label className="campo">
                  <span className="campo__etiqueta">
                    Teléfono <b aria-hidden="true">*</b>
                  </span>
                  <span className="campo__caja">
                    <input name="telefono" type="tel" required placeholder="(809) 000-0000" />
                  </span>
                </label>

                <label className="campo">
                  <span className="campo__etiqueta">Empresa (opcional)</span>
                  <span className="campo__caja">
                    <input name="empresa" type="text" placeholder="Nombre de tu empresa" />
                  </span>
                </label>

                <label className="campo campo--ancho">
                  <span className="campo__etiqueta">
                    Tipo de consulta <b aria-hidden="true">*</b>
                  </span>
                  <span className="campo__caja campo__caja--select">
                    <select value={motivo} onChange={(e) => setMotivo(e.target.value)} required>
                      {CONTACTO_PAGINA.motivos.map((m) => (
                        <option key={m.titulo} value={m.titulo}>
                          {m.titulo}
                        </option>
                      ))}
                    </select>
                    <Icon name="chevron-down" size={16} strokeWidth={2} />
                  </span>
                </label>

                <label className="campo campo--ancho">
                  <span className="campo__etiqueta">
                    Mensaje <b aria-hidden="true">*</b>
                  </span>
                  <span className="campo__caja campo__caja--area">
                    <textarea name="mensaje" rows={4} required placeholder="Escribe aquí tu mensaje..." />
                  </span>
                </label>

                <label className="campo campo--ancho ei-form__acepto">
                  <input type="checkbox" required />
                  <span>
                    Acepto la <a href="/empresa/politicas-y-terminos">Política de Privacidad</a> y el
                    uso de mis datos para fines de contacto. <b aria-hidden="true">*</b>
                  </span>
                </label>

                <div className="campo campo--ancho">
                  <MagneticButton
                    className="btn btn--primary btn--square btn--lg"
                    type="submit"
                    block
                    strength={0.16}
                  >
                    <span className="ei-form__icono">
                      <Icon name="send" size={17} strokeWidth={1.9} />
                    </span>
                    Enviar mensaje
                  </MagneticButton>
                </div>
              </form>
            )}
          </Reveal>

          {/* --- Motivos --- */}
          <Reveal className="ei-caja" y={24} delay={0.08}>
            <TituloEmpresa titulo="¿Sobre qué deseas" accent="contactarnos?" />
            <p className="ei-caja__nota">Selecciona el motivo de tu contacto para brindarte una mejor atención.</p>

            <motion.div
              className="ei-motivos"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
            >
              {CONTACTO_PAGINA.motivos.map((m) => (
                <motion.button
                  type="button"
                  className={`ei-motivo${motivo === m.titulo ? ' is-active' : ''}`}
                  key={m.titulo}
                  variants={cardVariants}
                  onClick={() => setMotivo(m.titulo)}
                  aria-pressed={motivo === m.titulo}
                >
                  <span className="ei-motivo__icono">
                    <Icon name={m.icon} size={24} strokeWidth={1.7} />
                  </span>
                  <Icon name="arrow-right" size={15} strokeWidth={2.2} className="ei-motivo__go" />
                  <span className="ei-motivo__cuerpo">
                    <b>{m.titulo}</b>
                    <small>{m.texto}</small>
                  </span>
                </motion.button>
              ))}
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* --- Datos y ubicacion --- */}
      <section className="ei-seccion ei-seccion--clara">
        <div className="container container--wide ei-contacto">
          <Reveal className="ei-caja" y={24}>
            <TituloEmpresa titulo="Información de" accent="contacto" />
            <p className="ei-caja__nota">También puedes comunicarte con nosotros a través de nuestros canales directos.</p>

            <ul className="ei-datos">
              <li>
                <span className="ei-datos__icono">
                  <Icon name="phone" size={20} strokeWidth={1.8} />
                </span>
                <span>
                  <small>Teléfono</small>
                  <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
                </span>
              </li>
              <li>
                <span className="ei-datos__icono">
                  <Icon name="mail" size={20} strokeWidth={1.8} />
                </span>
                <span>
                  <small>Correo electrónico</small>
                  <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                </span>
              </li>
              <li>
                <span className="ei-datos__icono">
                  <Icon name="map-pin" size={20} strokeWidth={1.8} />
                </span>
                <span>
                  <small>Dirección</small>
                  <b>
                    {CONTACT.address}, {CONTACT.city}
                  </b>
                </span>
              </li>
              <li>
                <span className="ei-datos__icono">
                  <Icon name="clock" size={20} strokeWidth={1.8} />
                </span>
                <span>
                  <small>Horario de atención</small>
                  {CONTACTO_PAGINA.horario.map((h) => (
                    <b key={h}>{h}</b>
                  ))}
                </span>
              </li>
            </ul>
          </Reveal>

          <Reveal className="ei-caja" y={24} delay={0.08}>
            <TituloEmpresa titulo="Nuestra" accent="ubicación" />
            <p className="ei-caja__nota">Visítanos en nuestras oficinas. ¡Será un placer recibirte!</p>

            <a className="ei-mapa" href={CONTACTO_PAGINA.mapa} target="_blank" rel="noreferrer">
              <span className="ei-mapa__aguja">
                <Icon name="map-pin" size={26} strokeWidth={1.8} />
              </span>
              <span className="ei-mapa__texto">
                <b>LINKDICOM, SRL</b>
                <small>{CONTACT.address}</small>
              </span>
              <span className="ei-mapa__boton">
                Cómo llegar
                <Icon name="external-link" size={14} strokeWidth={2} />
              </span>
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
