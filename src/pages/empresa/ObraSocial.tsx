import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Foto from '../../components/ui/Foto';
import Icon from '../../components/ui/Icon';
import { Reveal } from '../../components/ui/RevealText';
import { CifrasEmpresa, TituloEmpresa } from '../../components/empresa/Marco';
import ModalDonacion from '../../components/obra-social/ModalDonacion';
import { OBRA_SOCIAL as O } from '../../data/obra-social';
import { getCifrasObraSocial, getJornadas, getProximasJornadas } from '../../contenido/store';
import { piezasFecha } from '../../contenido/formato';
import { cardVariants, containerVariants, VIEWPORT } from '../../utils/easings';

/** Programa de asistencia social Virginia Toca. */
export default function ObraSocial() {
  const [donando, setDonando] = useState<string | null>(null);
  const proximas = getProximasJornadas();
  const jornadas = getJornadas();
  const cifras = getCifrasObraSocial().map((c) => ({ ...c, color: '#2563eb' }));

  return (
    <>
      {/* ---------- Origen y compromiso ---------- */}
      <section className="ei-seccion">
        <div className="container container--wide ei-obra">
          <Reveal className="ei-obra__retrato" y={26}>
            <Foto src={O.retrato} alt={O.retratoAlt} ratio="3 / 4" />
          </Reveal>

          <Reveal className="ei-obra__texto" y={24} delay={0.06}>
            <TituloEmpresa titulo={O.origenTitulo} accent={O.origenTituloAccent} />
            {O.origen.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </Reveal>

          <Reveal className="ei-obra__compromiso" y={24} delay={0.12}>
            <h2>
              {O.compromisoTitulo} <em>{O.compromisoTituloAccent}</em>
            </h2>
            <p>{O.compromisoTexto}</p>
            <ul>
              {O.compromisoItems.map((i) => (
                <li key={i.label}>
                  <Icon name={i.icon} size={28} strokeWidth={1.5} />
                  {i.label}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ---------- Actividades y como apoyar ---------- */}
      <section className="ei-seccion ei-seccion--clara">
        <div className="container container--wide ei-obra-dos">
          <Reveal className="ei-caja" y={24}>
            <TituloEmpresa titulo={O.actividadesTitulo} accent={O.actividadesTituloAccent} />
            {proximas.length === 0 && (
              <p className="ei-caja__nota">Pronto anunciaremos la próxima jornada del programa.</p>
            )}
            {proximas.map((a) => {
              const f = piezasFecha(a.fechaISO);
              return (
              <article className="ei-actividad" key={a.slug}>
                <div className="ei-actividad__media">
                  <Foto src={a.imagen} alt={a.imagenAlt} ratio="4 / 3" />
                </div>
                <span className="ei-actividad__fecha">
                  <small>{f.dia}</small>
                  <b>{f.numero}</b>
                  <small>{f.mes}</small>
                </span>
                <div className="ei-actividad__cuerpo">
                  <h3>{a.titulo}</h3>
                  <p className="ei-actividad__lugar">
                    <Icon name="map-pin" size={15} strokeWidth={1.9} />
                    {a.lugar}
                  </p>
                  <p>{a.texto}</p>
                  <button
                    className="btn btn--square ei-actividad__aportar"
                    type="button"
                    onClick={() => setDonando(`${a.titulo} · ${f.numero} ${f.mes}`)}
                  >
                    <Icon name="heart" size={17} strokeWidth={1.9} />
                    {a.cta}
                    <Icon name="arrow-right" size={15} strokeWidth={2.2} />
                  </button>
                </div>
              </article>
              );
            })}
          </Reveal>

          <Reveal className="ei-caja" y={24} delay={0.08}>
            <TituloEmpresa titulo={O.apoyoTitulo} accent={O.apoyoTituloAccent} />
            <p className="ei-caja__nota">{O.apoyoTexto}</p>

            <motion.ul
              className="ei-apoyo"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
            >
              {O.apoyoTipos.map((t) => (
                <motion.li key={t.label} variants={cardVariants}>
                  <Icon name={t.icon} size={26} strokeWidth={1.5} />
                  {t.label}
                </motion.li>
              ))}
            </motion.ul>

            <p className="ei-aviso">
              <Icon name="close" size={18} strokeWidth={2.4} />
              <span>
                <b>{O.apoyoAviso}</b>
                {O.apoyoAvisoNota}
              </span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------- Eventos ---------- */}
      <section className="ei-seccion">
        <div className="container container--wide">
          <TituloEmpresa titulo={O.eventosTitulo} accent={O.eventosTituloAccent} />
          <motion.div
            className="ei-eventos"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            {jornadas.map((e) => {
              const f = piezasFecha(e.fechaISO);
              return (
              <motion.article className="ei-evento" key={e.slug} variants={cardVariants}>
                <Link to={`/empresa/obra-social/${e.slug}`} className="ei-evento__media">
                  <Foto src={e.portada} alt={e.portadaAlt} ratio="4 / 3" />
                </Link>
                <p className="ei-evento__fecha">
                  {f.numero} {f.mesCorto} <span>{f.anio}</span>
                </p>
                <h3>
                  <Link to={`/empresa/obra-social/${e.slug}`}>{e.titulo}</Link>
                </h3>
                <p className="ei-evento__lugar">
                  <Icon name="map-pin" size={14} strokeWidth={1.9} />
                  {e.lugar}
                </p>
                <Link className="link-arrow link-arrow--tech" to={`/empresa/obra-social/${e.slug}`}>
                  Ver fotos y video
                  <Icon name="arrow-right" size={14} strokeWidth={2.2} />
                </Link>
              </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ---------- Cifras y cita ---------- */}
      <section className="ei-banda-cifras">
        <div className="container container--wide">
          <CifrasEmpresa cifras={cifras} />
        </div>
      </section>

      <section className="ei-seccion">
        <Reveal className="container container--wide ei-memoria" y={24}>
          <span className="ei-memoria__comillas" aria-hidden="true">
            &ldquo;
          </span>
          <blockquote>{O.citaFinal}</blockquote>
          <p className="ei-memoria__autor">{O.citaAutor}</p>
          <p className="ei-memoria__nota">{O.citaNota}</p>
        </Reveal>
      </section>

      <AnimatePresence>
        {donando && <ModalDonacion evento={donando} onClose={() => setDonando(null)} />}
      </AnimatePresence>
    </>
  );
}
