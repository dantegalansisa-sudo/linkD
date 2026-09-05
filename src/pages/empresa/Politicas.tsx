import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '../../components/ui/Icon';
import { Reveal } from '../../components/ui/RevealText';
import { POLITICAS as P } from '../../data/politicas';
import { EASINGS } from '../../utils/easings';

/** Politicas y terminos: cinco documentos en pestanas, cada uno con acordeon. */
export default function Politicas() {
  const [tab, setTab] = useState(0);
  const [abierto, setAbierto] = useState<number | null>(null);
  const activa = P.pestanas[tab];

  return (
    <>
      {/* ---------- Selector de documento ---------- */}
      <section className="ei-seccion">
        <div className="container container--wide">
          <Reveal className="ei-tabs" y={20}>
            <div className="ei-tabs__barra" role="tablist">
              {P.pestanas.map((p, i) => (
                <button
                  key={p.key}
                  role="tab"
                  type="button"
                  aria-selected={i === tab}
                  className={`ei-tab${i === tab ? ' is-active' : ''}`}
                  onClick={() => {
                    setTab(i);
                    setAbierto(null);
                  }}
                >
                  <Icon name={p.icon} size={19} strokeWidth={1.8} />
                  {p.label}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="ei-politicas">
            {/* --- Documento --- */}
            <AnimatePresence mode="wait">
              <motion.div
                className="ei-caja"
                key={activa.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: EASINGS.premium }}
              >
                <div className="ei-politica__cabeza">
                  <span className="ei-politica__icono">
                    <Icon name={activa.icon} size={24} strokeWidth={1.8} />
                  </span>
                  <h2>{activa.titulo}</h2>
                  <small>Última actualización: {activa.actualizado}</small>
                </div>

                <p className="ei-politica__intro">{activa.intro}</p>

                <ul className="ei-acordeon">
                  {activa.apartados.map((a, i) => (
                    <li key={a.titulo}>
                      <button
                        type="button"
                        className={`ei-acordeon__cabeza${abierto === i ? ' is-abierto' : ''}`}
                        onClick={() => setAbierto(abierto === i ? null : i)}
                        aria-expanded={abierto === i}
                      >
                        <span className="ei-acordeon__num">{i + 1}</span>
                        <span>
                          <b>{a.titulo}</b>
                          <small>{a.resumen}</small>
                        </span>
                        <Icon name="chevron-down" size={18} strokeWidth={2} className="ei-acordeon__flecha" />
                      </button>

                      <AnimatePresence initial={false}>
                        {abierto === i && (
                          <motion.div
                            className="ei-acordeon__cuerpo"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: EASINGS.premium }}
                          >
                            {/*
                              El texto legal completo lo redacta el cliente. Hasta
                              que llegue se muestra a quien escribir para pedirlo.
                            */}
                            <p>
                              El texto completo de este apartado está pendiente de redacción por parte
                              del equipo legal de LINKDICOM. Para consultas puntuales, escríbenos a{' '}
                              <a href="mailto:info@linkdicom.com">info@linkdicom.com</a>.
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>

            {/* --- Lateral --- */}
            <div className="ei-politicas__lado">
              <Reveal className="ei-caja ei-compromiso" y={22}>
                <div className="ei-politica__cabeza">
                  <span className="ei-politica__icono ei-politica__icono--suave">
                    <Icon name="lock" size={22} strokeWidth={1.8} />
                  </span>
                  <h2>{P.compromisoTitulo}</h2>
                </div>
                <p>{P.compromisoTexto}</p>
                <blockquote>{P.compromisoCita}</blockquote>
              </Reveal>

              <Reveal className="ei-caja ei-documentos" y={22} delay={0.08}>
                <div className="ei-politica__cabeza">
                  <span className="ei-politica__icono ei-politica__icono--suave">
                    <Icon name="file-text" size={22} strokeWidth={1.8} />
                  </span>
                  <h2>{P.documentosTitulo}</h2>
                </div>

                <ul>
                  {P.documentos.map((d) => (
                    <li key={d.titulo}>
                      <Icon name="file-text" size={20} strokeWidth={1.7} />
                      <span>
                        <b>{d.titulo}</b>
                        <small>Actualizado: {d.fecha}</small>
                      </span>
                      {/*
                        Los PDF todavia no estan: en cuanto el cliente los entregue
                        se sustituye este aviso por el enlace de descarga.
                      */}
                      <em>Pronto</em>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
