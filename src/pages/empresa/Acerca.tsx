import { motion } from 'framer-motion';
import Foto from '../../components/ui/Foto';
import Icon from '../../components/ui/Icon';
import { Reveal } from '../../components/ui/RevealText';
import { CifrasEmpresa, TituloEmpresa } from '../../components/empresa/Marco';
import { ACERCA } from '../../data/empresa';
import { cardVariants, containerVariants, VIEWPORT } from '../../utils/easings';

/** Acerca de nosotros: historia, hitos, cifras, esencia y mensaje del fundador. */
export default function Acerca() {
  return (
    <>
      {/* ---------- Historia e hitos ---------- */}
      <section className="ei-seccion">
        <div className="container container--wide ei-dos">
          <Reveal className="ei-historia" y={24}>
            <TituloEmpresa titulo={ACERCA.historiaTitulo} accent={ACERCA.historiaTituloAccent} />
            {ACERCA.historia.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </Reveal>

          <div className="ei-hitos">
            <TituloEmpresa titulo={ACERCA.hitosTitulo} accent={ACERCA.hitosTituloAccent} texto={ACERCA.hitosTexto} />
            <motion.ol
              className="ei-linea"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
            >
              {ACERCA.hitos.map((h) => (
                <motion.li key={h.anio} variants={cardVariants}>
                  <span className="ei-linea__anio">
                    {h.anio}
                    {'nota' in h && h.nota && <small>{h.nota}</small>}
                  </span>
                  <p>{h.texto}</p>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </div>
      </section>

      {/* ---------- Cifras ---------- */}
      <section className="ei-banda-cifras">
        <div className="container container--wide">
          <CifrasEmpresa cifras={ACERCA.cifras} />
        </div>
      </section>

      {/* ---------- Esencia ---------- */}
      <section className="ei-esencia">
        <div className="container container--wide ei-esencia__grid">
          <Reveal y={22}>
            <h2 className="ei-esencia__titulo">
              {ACERCA.esenciaTitulo} <em>{ACERCA.esenciaTituloAccent}</em>
            </h2>
            <p className="ei-esencia__intro">{ACERCA.esenciaTexto}</p>
          </Reveal>

          <Reveal className="ei-esencia__col" y={22} delay={0.08}>
            <Icon name="star" size={32} strokeWidth={1.5} />
            <h3>Misión</h3>
            <p>{ACERCA.mision}</p>
          </Reveal>

          <Reveal className="ei-esencia__col" y={22} delay={0.14}>
            <Icon name="search" size={32} strokeWidth={1.5} />
            <h3>Visión</h3>
            <p>{ACERCA.vision}</p>
          </Reveal>

          <Reveal className="ei-esencia__col" y={22} delay={0.2}>
            <Icon name="users" size={32} strokeWidth={1.5} />
            <h3>Valores</h3>
            <ul>
              {ACERCA.valores.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ---------- Mensaje del fundador ---------- */}
      <section className="ei-seccion">
        <div className="container container--wide ei-fundador">
          <Reveal y={24}>
            <TituloEmpresa titulo={ACERCA.fundadorTitulo} accent={ACERCA.fundadorTituloAccent} />
            <blockquote className="ei-fundador__cita">{ACERCA.fundadorCita}</blockquote>
            <p className="ei-fundador__nombre">{ACERCA.fundadorNombre}</p>
            <p className="ei-fundador__cargo">{ACERCA.fundadorCargo}</p>
          </Reveal>

          <Reveal className="ei-fundador__media" y={28} delay={0.1}>
            <Foto src={undefined} alt={ACERCA.fundadorImagenAlt} ratio="4 / 3" />
            <div className="ei-fundador__lugar">
              <Icon name="map-pin" size={20} strokeWidth={1.8} />
              <span>
                <b>{ACERCA.fundadorLugar}</b>
                <small>{ACERCA.fundadorLugarNota}</small>
              </span>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
