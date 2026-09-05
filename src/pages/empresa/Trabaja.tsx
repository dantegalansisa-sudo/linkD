import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../components/ui/Icon';
import MagneticButton from '../../components/ui/MagneticButton';
import { Reveal } from '../../components/ui/RevealText';
import { TituloEmpresa } from '../../components/empresa/Marco';
import { TRABAJA as T } from '../../data/trabaja';
import { CONTACT } from '../../data/site';
import { cardVariants, containerVariants, VIEWPORT } from '../../utils/easings';

/** Trabaja con nosotros: razones, vacantes, proceso y envio de solicitud. */
export default function Trabaja() {
  const [vacante, setVacante] = useState('');
  const [archivo, setArchivo] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);

  /*
    El CV no se puede adjuntar sin un servidor que lo reciba, asi que el
    formulario abre WhatsApp con los datos y le pide a la persona que adjunte
    el PDF en el chat. Cuando exista un buzon de Talento Humano, se cambia aqui.
  */
  const enviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const linea = (etiqueta: string, campo: string) => {
      const v = String(d.get(campo) ?? '').trim();
      return v ? `${etiqueta}: ${v}\n` : '';
    };
    const mensaje =
      'Hola LINKDICOM, quiero postularme a una vacante.\n\n' +
      linea('Nombre', 'nombre') +
      linea('Correo', 'correo') +
      linea('Teléfono', 'telefono') +
      linea('Ubicación', 'ubicacion') +
      (vacante ? `Vacante: ${vacante}\n` : '') +
      linea('Mensaje', 'mensaje') +
      (archivo ? `\nAdjunto mi CV: ${archivo}` : '\nAdjunto mi CV en este chat.');

    window.open(`${CONTACT.whatsapp}?text=${encodeURIComponent(mensaje)}`, '_blank', 'noopener');
    setEnviado(true);
  };

  return (
    <>
      {/* ---------- Razones ---------- */}
      <section className="ei-seccion">
        <div className="container container--wide">
          <motion.div
            className="ei-razones"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            {T.razones.map((r) => (
              <motion.div className="ei-razon" key={r.titulo} variants={cardVariants}>
                <Icon name={r.icon} size={30} strokeWidth={1.5} />
                <span>
                  <b>{r.titulo}</b>
                  <small>{r.texto}</small>
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---------- Vacantes y solicitud ---------- */}
      <section className="ei-seccion ei-seccion--clara">
        <div className="container container--wide ei-contacto">
          <Reveal className="ei-caja" y={24}>
            <TituloEmpresa titulo={T.vacantesTitulo} accent={T.vacantesTituloAccent} />
            <p className="ei-caja__nota">{T.vacantesTexto}</p>

            <motion.ul
              className="ei-vacantes"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
            >
              {T.vacantes.map((v) => (
                <motion.li key={v.puesto} variants={cardVariants}>
                  <button
                    type="button"
                    className={`ei-vacante${vacante === v.puesto ? ' is-active' : ''}`}
                    onClick={() => setVacante(v.puesto)}
                    aria-pressed={vacante === v.puesto}
                  >
                    <span className="ei-vacante__icono">
                      <Icon name={v.icon} size={22} strokeWidth={1.7} />
                    </span>
                    <span className="ei-vacante__cuerpo">
                      <b>{v.puesto}</b>
                      <small>
                        {v.area} &nbsp;|&nbsp; {v.lugar}
                      </small>
                    </span>
                    <span className="ei-vacante__jornada">{v.jornada}</span>
                    <Icon name="chevron-right" size={17} strokeWidth={2} className="ei-vacante__go" />
                  </button>
                </motion.li>
              ))}
            </motion.ul>

            <div className="ei-proceso">
              <TituloEmpresa titulo={T.procesoTitulo} accent={T.procesoTituloAccent} texto={T.procesoTexto} />
              <ol>
                {T.proceso.map((p, i) => (
                  <li key={p.label}>
                    <span className="ei-proceso__num">{i + 1}</span>
                    <Icon name={p.icon} size={26} strokeWidth={1.5} />
                    <small>{p.label}</small>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          <Reveal className="ei-caja" y={24} delay={0.08}>
            <TituloEmpresa titulo={T.formularioTitulo} accent={T.formularioTituloAccent} />
            <p className="ei-caja__nota">{T.formularioTexto}</p>

            {enviado ? (
              <div className="ei-gracias">
                <span>
                  <Icon name="check-circle" size={30} strokeWidth={1.7} />
                </span>
                <h3>Tu solicitud está lista</h3>
                <p>
                  Se abrió WhatsApp con tus datos. Envía el mensaje y adjunta ahí tu CV en PDF:
                  Talento Humano lo revisará y se pondrá en contacto contigo.
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
                  <span className="campo__etiqueta">
                    Ciudad / Provincia <b aria-hidden="true">*</b>
                  </span>
                  <span className="campo__caja campo__caja--select">
                    <select name="ubicacion" required defaultValue="">
                      <option value="" disabled>
                        Selecciona tu ubicación
                      </option>
                      {T.provincias.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    <Icon name="chevron-down" size={16} strokeWidth={2} />
                  </span>
                </label>

                <div className="campo campo--ancho">
                  <span className="campo__etiqueta">
                    Adjunta tu CV (PDF) <b aria-hidden="true">*</b>
                  </span>
                  <label className="ei-archivo">
                    <input
                      type="file"
                      accept="application/pdf"
                      required
                      onChange={(e) => setArchivo(e.target.files?.[0]?.name ?? null)}
                    />
                    <Icon name="arrow-up" size={22} strokeWidth={1.8} />
                    <span>
                      <b>{archivo ?? 'Selecciona tu archivo PDF'}</b>
                      <small>Tamaño máximo: 5 MB</small>
                    </span>
                  </label>
                </div>

                <label className="campo campo--ancho">
                  <span className="campo__etiqueta">Mensaje (opcional)</span>
                  <span className="campo__caja campo__caja--area">
                    <textarea
                      name="mensaje"
                      rows={4}
                      placeholder="Cuéntanos brevemente por qué te gustaría formar parte de LINKDICOM y qué puedes aportar a nuestro equipo."
                    />
                  </span>
                </label>

                <div className="campo campo--ancho">
                  <MagneticButton className="btn btn--primary btn--square btn--lg" type="submit" block strength={0.16}>
                    <span className="ei-form__icono">
                      <Icon name="send" size={17} strokeWidth={1.9} />
                    </span>
                    Enviar mi solicitud
                  </MagneticButton>
                </div>

                <p className="ei-form__nota">
                  <Icon name="lock" size={14} strokeWidth={1.9} />
                  El CV se adjunta en el chat de WhatsApp que se abre al enviar.
                </p>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </>
  );
}
