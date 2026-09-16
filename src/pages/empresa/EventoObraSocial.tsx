import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Foto from '../../components/ui/Foto';
import Icon from '../../components/ui/Icon';
import { Reveal } from '../../components/ui/RevealText';
import { CabeceraEmpresaBloque, CierreEmpresaBloque, CifrasEmpresa } from '../../components/empresa/Marco';
import Galeria from '../../components/obra-social/Galeria';
import ModalDonacion from '../../components/obra-social/ModalDonacion';
import { OBRA_SOCIAL as O } from '../../data/obra-social';
import { getJornadas, getProximasJornadas, imagen } from '../../contenido/store';
import { piezasFecha } from '../../contenido/formato';
import { cardVariants, containerVariants, VIEWPORT } from '../../utils/easings';

/**
 * Pagina de una jornada ya realizada del Programa Virginia Toca.
 *
 * Comparte la cabecera y el cierre con la pagina de Obra social; el cuerpo
 * es el video resumen, la galeria, los agradecimientos y la invitacion a la
 * siguiente jornada.
 */
export default function EventoObraSocial() {
  const { evento: slug } = useParams();
  const [donando, setDonando] = useState(false);
  const jornadas = getJornadas();
  const evento = jornadas.find((e) => e.slug === slug);

  if (!evento) return <Navigate to="/empresa/obra-social" replace />;

  const proximo = getProximasJornadas()[0];
  const fechaProximo = proximo ? piezasFecha(proximo.fechaISO) : null;
  const otros = jornadas.filter((e) => e.slug !== evento.slug);

  return (
    <main className="ei" id="contenido">
      <CabeceraEmpresaBloque c={{ ...O.cabecera, miga: evento.miga }} />

      <section className="ei-seccion">
        <div className="container container--wide evento">
          {/* ---------- Columna principal ---------- */}
          <div className="evento__principal">
            <Reveal className="evento__cabeza" y={22}>
              <span className="evento__rotulo">{evento.video ? 'Video resumen de la ayuda' : 'Resumen de la ayuda'}</span>
              <h2>{evento.titulo}</h2>
              <p>{evento.resumen}</p>
            </Reveal>

            {evento.video ? (
              <Reveal className="evento__video" y={24} delay={0.06}>
                <video src={imagen(evento.video.src)} poster={imagen(evento.video.poster)} controls playsInline preload="none" />
              </Reveal>
            ) : (
              <Reveal className="evento__portada" y={24} delay={0.06}>
                <img src={imagen(evento.portada)} alt={evento.portadaAlt} />
              </Reveal>
            )}

            {evento.nota && (
              <Reveal className="evento__nota" y={18}>
                <span className="evento__nota-icono">
                  <Icon name={evento.nota.icon} size={26} strokeWidth={1.6} />
                </span>
                <span>
                  <b>{evento.nota.titulo}</b>
                  {evento.nota.texto}
                </span>
              </Reveal>
            )}

            <Reveal className="evento__cabeza evento__cabeza--galeria" y={22}>
              <span className="evento__rotulo">Galería de fotos</span>
              <h2>{evento.titulo}</h2>
              <p>{evento.galeriaTexto}</p>
            </Reveal>

            <Galeria piezas={evento.galeria} />

            {evento.iniciativa && (
              <Reveal className="evento__iniciativa" y={20}>
                <Icon name="users" size={40} strokeWidth={1.4} />
                <div>
                  <b>{evento.iniciativa.titulo}</b>
                  {evento.iniciativa.parrafos.map((p) => (
                    <p key={p.slice(0, 40)}>{p}</p>
                  ))}
                </div>
              </Reveal>
            )}
          </div>

          {/* ---------- Lateral ---------- */}
          <aside className="evento__lateral">
            <Reveal className="evento__caja" y={20}>
              <h3>
                Agradecimientos <em>especiales</em>
              </h3>
              <p className="evento__caja-nota">Personas y empresas que hicieron posible esta jornada</p>

              {evento.agradecimiento ? (
                <div className="evento__gracias">
                  <span className="evento__logo">
                    <img src={imagen(evento.agradecimiento.logo)} alt={evento.agradecimiento.logoAlt} loading="lazy" />
                  </span>
                  {evento.agradecimiento.parrafos.map((p) => (
                    <p key={p.slice(0, 40)}>{p}</p>
                  ))}
                  <div className="evento__gracias-fotos">
                    {evento.agradecimiento.fotos.map((f) => (
                      <img src={imagen(f)} alt={evento.agradecimiento?.nombre ?? ''} loading="lazy" key={f} />
                    ))}
                  </div>
                  <p className="evento__gracias-cierre">
                    <Icon name="handshake" size={20} strokeWidth={1.7} />
                    <span>{evento.agradecimiento.cierre}</span>
                  </p>
                </div>
              ) : (
                <div className="evento__invita">
                  <Icon name="heart" size={40} strokeWidth={1.4} />
                  <b>¿Te gustaría aportar para la siguiente asistencia social?</b>
                  <p>Mira las siguientes ayudas programadas y colabora con lo que puedas con alguna de ellas.</p>
                  <div className="evento__invita-cta">
                    <b>¡Ayúdanos a Ayudar a quienes lo necesitan!</b>
                    <button className="btn btn--square" type="button" onClick={() => setDonando(true)}>
                      Quiero colaborar
                      <Icon name="arrow-right" size={15} strokeWidth={2.2} />
                    </button>
                  </div>
                </div>
              )}
            </Reveal>
          </aside>
        </div>
      </section>

      {/* ---------- Otras ayudas y proxima asistencia ---------- */}
      <section className="ei-seccion ei-seccion--clara">
        <div className="container container--wide evento__dos">
          <Reveal className="evento__otras" y={22}>
            <div className="evento__otras-cabeza">
              <Icon name="calendar" size={40} strokeWidth={1.4} />
              <div>
                <b>
                  Otras ayudas que <em>ya hemos otorgado</em>
                </b>
                <p>Conoce más sobre las iniciativas que hemos realizado en comunidades de todo el país.</p>
              </div>
            </div>
            <motion.ul
              className="evento__otras-lista"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
            >
              {otros.map((e) => {
                const f = piezasFecha(e.fechaISO);
                return (
                  <motion.li key={e.slug} variants={cardVariants}>
                    <Link to={`/empresa/obra-social/${e.slug}`}>
                      <Foto src={e.portada} alt={e.portadaAlt} ratio="4 / 3" />
                      <span>
                        <b>{e.tituloCorto || e.titulo}</b>
                        <small>
                          {f.numero} {f.mesCorto} {f.anio}
                        </small>
                      </span>
                    </Link>
                  </motion.li>
                );
              })}
              {otros.length === 0 && <li className="evento__otras-vacio">Esta es, por ahora, la única jornada realizada.</li>}
            </motion.ul>
            <Link className="btn btn--square evento__ver-todos" to="/empresa/obra-social">
              Ver todos los eventos de ayuda
              <Icon name="arrow-right" size={15} strokeWidth={2.2} />
            </Link>
          </Reveal>

          {proximo && fechaProximo && (
          <Reveal className="evento__proxima" y={22} delay={0.06}>
            <div className="evento__otras-cabeza">
              <Icon name="calendar" size={40} strokeWidth={1.4} />
              <div>
                <small>Próxima asistencia</small>
                <b>¡Ayúdanos a ayudar!</b>
                <p>Sé parte del próximo evento y llevemos esperanza a más familias.</p>
              </div>
            </div>
            <div className="evento__proxima-cuerpo">
              <div className="evento__proxima-media">
                <Foto src={proximo.imagen} alt={proximo.imagenAlt} ratio="4 / 3" />
              </div>
              <span className="ei-actividad__fecha">
                <small>{fechaProximo.dia}</small>
                <b>{fechaProximo.numero}</b>
                <small>{fechaProximo.mes}</small>
              </span>
              <div>
                <b className="evento__proxima-titulo">{proximo.titulo}</b>
                <p className="ei-actividad__lugar">
                  <Icon name="map-pin" size={14} strokeWidth={1.9} />
                  {proximo.lugar}
                </p>
              </div>
            </div>
            <button className="btn btn--primary btn--square evento__aportar" type="button" onClick={() => setDonando(true)}>
              {proximo.cta}
              <span className="btn__arrow">
                <Icon name="arrow-right" size={16} strokeWidth={2.2} />
              </span>
            </button>
          </Reveal>
          )}
        </div>
      </section>

      <section className="ei-banda-cifras">
        <div className="container container--wide">
          <CifrasEmpresa cifras={evento.cifras.map((c) => ({ ...c, color: '#2563eb' }))} />
        </div>
      </section>

      <CierreEmpresaBloque c={O.cierre} />

      <AnimatePresence>
        {donando && (
          <ModalDonacion
            evento={proximo && fechaProximo ? `${proximo.titulo} · ${fechaProximo.numero} ${fechaProximo.mes}` : 'Programa Virginia Toca'}
            onClose={() => setDonando(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
