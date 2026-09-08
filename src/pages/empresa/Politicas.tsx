import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '../../components/ui/Icon';
import { Reveal } from '../../components/ui/RevealText';
import type { BloqueLegal } from '../../data/legal';
import { POLITICAS as P } from '../../data/politicas';
import { EASINGS } from '../../utils/easings';

const CORREO = 'info@linkdicom.com';

/**
 * Convierte el correo en enlace dentro de un texto legal.
 *
 * En los documentos aparece suelto varias veces y dejarlo como texto plano
 * obliga a copiarlo a mano.
 */
function conCorreo(texto: string) {
  const partes = texto.split(CORREO);
  if (partes.length === 1) return texto;

  return partes.flatMap((parte, i) =>
    i === 0
      ? [parte]
      : [
          <a key={i} href={`mailto:${CORREO}`}>
            {CORREO}
          </a>,
          parte,
        ],
  );
}

/** Cuerpo de un apartado legal: parrafos, listas, subtitulos y datos de contacto. */
function CuerpoLegal({ bloques }: { bloques: BloqueLegal[] }) {
  return (
    <>
      {bloques.map((b, i) => {
        if (b.tipo === 'sub') return <h4 key={i}>{b.texto}</h4>;
        if (b.tipo === 'p') return <p key={i}>{conCorreo(b.texto ?? '')}</p>;

        return (
          <ul key={i} className={b.tipo === 'datos' ? 'ei-legal__datos' : 'ei-legal__lista'}>
            {b.items?.map((it) => (
              <li key={it}>{conCorreo(it)}</li>
            ))}
          </ul>
        );
      })}
    </>
  );
}

/**
 * Politicas y terminos: cinco documentos en pestanas, cada uno con acordeon.
 *
 * Privacidad y Terminos llevan ya el texto legal completo; los otros tres
 * anuncian el apartado y avisan de que la redaccion esta en camino.
 *
 * La pestana se puede fijar desde la URL (?doc=privacidad) para poder enlazar
 * cada documento desde el pie de pagina o desde un correo.
 */
export default function Politicas() {
  const [params, setParams] = useSearchParams();
  const pedida = P.pestanas.findIndex((p) => p.key === params.get('doc'));
  const [tab, setTab] = useState(pedida < 0 ? 0 : pedida);
  const [abierto, setAbierto] = useState<number | null>(null);
  const activa = P.pestanas[tab];
  const doc = activa.documento;

  const entradilla = doc ? doc.intro : [activa.intro ?? ''];
  const apartados = doc
    ? doc.secciones.map((s) => ({ titulo: s.titulo, resumen: undefined, cuerpo: s.cuerpo }))
    : (activa.apartados ?? []).map((a) => ({ titulo: a.titulo, resumen: a.resumen, cuerpo: undefined }));

  /*
    Si la URL cambia sin cambiar de pagina (los enlaces del pie apuntan a esta
    misma ruta) la pestana la sigue y sube hasta el documento: si no, el cambio
    ocurre fuera de la pantalla y parece que el enlace no hace nada.
  */
  useEffect(() => {
    const i = P.pestanas.findIndex((p) => p.key === params.get('doc'));
    if (i >= 0 && i !== tab) {
      setTab(i);
      setAbierto(null);
      document.querySelector('.ei-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const elegir = (i: number) => {
    setTab(i);
    setAbierto(null);
    setParams({ doc: P.pestanas[i].key }, { replace: true });
  };

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
                  onClick={() => elegir(i)}
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
                  <small>Última actualización: {doc?.actualizado ?? activa.actualizado}</small>
                </div>

                {entradilla.map((p) => (
                  <p className="ei-politica__intro" key={p.slice(0, 40)}>
                    {conCorreo(p)}
                  </p>
                ))}

                <ul className="ei-acordeon">
                  {apartados.map((a, i) => (
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
                          {a.resumen && <small>{a.resumen}</small>}
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
                            {a.cuerpo ? (
                              <CuerpoLegal bloques={a.cuerpo} />
                            ) : (
                              /*
                                Este documento todavia no lo ha redactado el
                                equipo legal; hasta que llegue se dice a quien
                                escribir para pedirlo.
                              */
                              <p>
                                El texto completo de este apartado está pendiente de redacción por parte
                                del equipo legal de LINKDICOM. Para consultas puntuales, escríbenos a{' '}
                                <a href={`mailto:${CORREO}`}>{CORREO}</a>.
                              </p>
                            )}
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
                  {P.documentos.map((d) => {
                    const indice = P.pestanas.findIndex((p) => p.key === d.pestana);

                    return (
                      <li key={d.titulo}>
                        <Icon name="file-text" size={20} strokeWidth={1.7} />
                        <span>
                          <b>{d.titulo}</b>
                          {d.fecha && <small>Actualizado: {d.fecha}</small>}
                        </span>
                        {/*
                          Los que ya tienen texto se abren en su pestana. De los
                          demas todavia no hay ni PDF ni redaccion.
                        */}
                        {indice >= 0 ? (
                          <button type="button" className="ei-documentos__ver" onClick={() => elegir(indice)}>
                            Leer
                            <Icon name="arrow-right" size={14} strokeWidth={2.2} />
                          </button>
                        ) : (
                          <em>Pronto</em>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
