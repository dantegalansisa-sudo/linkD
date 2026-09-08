import { motion } from 'framer-motion';
import Foto from '../../components/ui/Foto';
import Icon from '../../components/ui/Icon';
import { Reveal } from '../../components/ui/RevealText';
import { TituloEmpresa } from '../../components/empresa/Marco';
import { HISTORIA as H, type CapituloHistoria } from '../../data/historia';
import { cardVariants, containerVariants, VIEWPORT } from '../../utils/easings';

/**
 * Un capitulo del relato: año, titular, texto y, si la tiene, su foto.
 *
 * La foto alterna de lado capitulo a capitulo para que la lectura no se
 * convierta en una columna interminable.
 */
function Capitulo({
  c,
  invertido = false,
  gris = false,
}: {
  c: CapituloHistoria;
  invertido?: boolean;
  gris?: boolean;
}) {
  const texto = (
    <Reveal className="hist-cap__texto" y={24}>
      {c.anio && <span className="hist-cap__anio">{c.anio}</span>}
      <h2>
        {c.titulo}
        {c.subtitulo && <em>{c.subtitulo}</em>}
      </h2>

      {c.pregunta && <p className="hist-cap__pregunta">{c.pregunta}</p>}

      {c.parrafos.map((p) => (
        <p key={p.slice(0, 40)}>{p}</p>
      ))}

      {c.lista && (
        <ul className="hist-cap__lista">
          {c.lista.map((l) => (
            <li key={l}>
              <Icon name="check" size={15} strokeWidth={2.6} />
              {l}
            </li>
          ))}
        </ul>
      )}

      {c.nota && (
        <p className="hist-nota">
          <Icon name="lightbulb" size={18} strokeWidth={1.9} />
          <span>
            <b>{c.nota.titulo}</b>
            {c.nota.texto}
          </span>
        </p>
      )}

      {c.cadena && (
        <ol className="hist-cadena">
          {c.cadena.map((paso) => (
            <li key={paso}>{paso}</li>
          ))}
        </ol>
      )}
    </Reveal>
  );

  const lado = (c.imagen || c.dato) && (
    <Reveal className="hist-cap__lado" y={28} delay={0.1}>
      {c.imagen && (
        <div className="hist-cap__media">
          <Foto src={c.imagen} alt={c.imagenAlt ?? ''} ratio="16 / 10" />
        </div>
      )}
      {c.dato && (
        <div className="hist-dato">
          <b>{c.dato.valor}</b>
          <small>{c.dato.label}</small>
        </div>
      )}
    </Reveal>
  );

  return (
    <section
      className={`hist-cap${lado ? '' : ' hist-cap--solo'}${invertido ? ' hist-cap--invertido' : ''}${
        gris ? ' hist-cap--gris' : ''
      }`}
    >
      <div className="container container--wide hist-cap__grid">
        {texto}
        {lado}
      </div>
    </section>
  );
}

/**
 * Nuestra historia: el relato largo, desde el año 2000 hasta el Core propio.
 *
 * Es la pagina a la que lleva el boton de la ficha de Quienes somos. Se lee de
 * arriba abajo, en orden cronologico, y cierra con la linea de tiempo completa.
 */
export default function Historia() {
  return (
    <>
      <Capitulo c={H.origen} />
      <Capitulo c={H.isl1} invertido gris />

      {/* ---------- Como funcionaba ISL/1 ---------- */}
      <section className="hist-flujo">
        <div className="container container--wide">
          <Reveal className="hist-flujo__cabeza" y={22}>
            <h2>{H.flujo.titulo}</h2>
            <p>{H.flujo.texto}</p>
          </Reveal>

          <motion.ol
            className="hist-flujo__pasos"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            {H.flujo.pasos.map((p, i) => (
              <motion.li key={p.label} variants={cardVariants}>
                <span className="hist-flujo__icono">
                  <Icon name={p.icon} size={24} strokeWidth={1.7} />
                </span>
                <b>{p.label}</b>
                {i < H.flujo.pasos.length - 1 && (
                  <Icon name="chevron-right" size={18} strokeWidth={2.4} className="hist-flujo__flecha" />
                )}
              </motion.li>
            ))}
          </motion.ol>

          <Reveal className="hist-flujo__pie" y={20} delay={0.1}>
            {H.flujo.pie.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </Reveal>
        </div>
      </section>

      <Capitulo c={H.transferencia} />

      {/* ---------- Primeras implementaciones ---------- */}
      <section className="ei-seccion ei-seccion--clara">
        <div className="container container--wide">
          <TituloEmpresa titulo={H.implementacionesTitulo} texto={H.implementacionesTexto} />

          <motion.div
            className="hist-centros"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            {H.implementaciones.map((c) => (
              <motion.article className="hist-centro" key={c.nombre} variants={cardVariants}>
                <span className="hist-centro__orden">{c.orden}</span>
                <h3>{c.nombre}</h3>
                <span className="hist-centro__lugar">{c.lugar}</span>
                <p>{c.texto}</p>

                {'items' in c && c.items && (
                  <ul className="hist-centro__items">
                    {c.items.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                )}

                {'nota' in c && c.nota && <p className="hist-centro__nota">{c.nota}</p>}
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <Capitulo c={H.peliculas} gris />
      <Capitulo c={H.robots} invertido />
      <Capitulo c={H.enLinea} gris />
      <Capitulo c={H.nedical} />
      <Capitulo c={H.internacional} invertido gris />

      {/* ---------- Ecosistema y aportes ---------- */}
      <section className="hist-ecosistema">
        <div className="container container--wide">
          <Reveal className="hist-cap__texto" y={22}>
            <span className="hist-cap__anio">{H.ecosistema.anio}</span>
            <h2>{H.ecosistema.titulo}</h2>
            <p>{H.ecosistema.texto}</p>
          </Reveal>

          <motion.ul
            className="hist-paises"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            {H.ecosistema.paises.map((p) => (
              <motion.li key={p} variants={cardVariants}>
                <Icon name="map-pin" size={16} strokeWidth={2} />
                {p}
              </motion.li>
            ))}
          </motion.ul>

          <Reveal className="hist-ecosistema__nota" y={20}>
            <p>{H.ecosistema.textoAportes}</p>
          </Reveal>

          <motion.div
            className="hist-aportes"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            {H.ecosistema.aportes.map((a) => (
              <motion.article className="hist-aporte" key={`${a.nombre}-${a.anio}`} variants={cardVariants}>
                <div className="hist-aporte__logo">
                  <img src={a.logo} alt={a.logoAlt} loading="lazy" />
                </div>
                <h3>{a.nombre}</h3>
                {'por' in a && a.por && <span className="hist-aporte__por">{a.por}</span>}
                <span className="hist-aporte__anio">{a.anio}</span>
                <p>{a.texto}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---------- Core propio ---------- */}
      <section className="hist-core">
        <div className="container container--wide hist-core__grid">
          <Reveal className="hist-core__texto" y={24}>
            <span className="hist-cap__anio">{H.core.anio}</span>
            <h2>{H.core.titulo}</h2>
            {H.core.parrafos.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
            <p className="hist-core__destacado">{H.core.destacado}</p>
            <p className="hist-core__nota">{H.core.nota}</p>
          </Reveal>

          <Reveal className="hist-core__media" y={28} delay={0.1}>
            <Foto src={H.core.imagen} alt={H.core.imagenAlt} ratio="4 / 3" />
          </Reveal>
        </div>
      </section>

      {/* ---------- Agradecimientos ---------- */}
      <section className="ei-seccion ei-seccion--clara">
        <div className="container container--wide">
          <TituloEmpresa titulo={H.gracias.titulo} />
          <Reveal className="hist-gracias__intro" y={20}>
            {H.gracias.parrafos.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </Reveal>

          <motion.div
            className="hist-citas"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            {H.gracias.citas.map((c) => (
              <motion.figure className="hist-cita" key={c.nombre} variants={cardVariants}>
                <div className="hist-cita__logo">
                  <img src={c.logo} alt={c.logoAlt} loading="lazy" />
                </div>
                <blockquote>{c.cita}</blockquote>
                <figcaption>
                  <b>{c.nombre}</b>
                  <small>{c.rol}</small>
                </figcaption>
                {'nota' in c && c.nota && <p className="hist-cita__nota">{c.nota}</p>}
              </motion.figure>
            ))}
          </motion.div>

          <Reveal className="hist-gracias__pie" y={20} delay={0.1}>
            <p>{H.gracias.pie}</p>
          </Reveal>
        </div>
      </section>

      {/* ---------- Linea de tiempo ---------- */}
      <section className="hist-cronologia">
        <div className="container container--wide">
          <Reveal className="hist-cronologia__cabeza" y={22}>
            <h2>{H.cronologiaTitulo}</h2>
            <p>{H.cronologiaTexto}</p>
          </Reveal>

          <motion.ol
            className="hist-linea"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            {H.cronologia.map((h) => (
              <motion.li
                key={`${h.anio}-${h.titulo}`}
                variants={cardVariants}
                style={{ '--c': h.color } as React.CSSProperties}
              >
                <span className="hist-linea__anio">{h.anio}</span>
                <div className="hist-linea__cuerpo">
                  <b>{h.titulo}</b>
                  <p>{h.texto}</p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </section>
    </>
  );
}
