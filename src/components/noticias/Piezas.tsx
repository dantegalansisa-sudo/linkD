import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../ui/Icon';
import { Reveal } from '../ui/RevealText';
import { contarCategorias, NOTICIAS, type Noticia } from '../../data/noticias';
import { enviarSolicitud, type EstadoEnvio } from '../../utils/solicitudes';
import { cardVariants, containerVariants, VIEWPORT } from '../../utils/easings';

/** Etiqueta de categoria con su color. */
export function Etiqueta({ n }: { n: Pick<Noticia, 'categoria' | 'color'> }) {
  return (
    <span className="not-etiqueta" style={{ '--c': n.color } as React.CSSProperties}>
      {n.categoria}
    </span>
  );
}

/** Fecha, categoria y tiempo de lectura, en una linea. */
export function Meta({ n, conCategoria = true }: { n: Noticia; conCategoria?: boolean }) {
  return (
    <p className="not-meta">
      <span>
        <Icon name="calendar" size={14} strokeWidth={1.9} />
        <time dateTime={n.fechaISO}>{n.fecha}</time>
      </span>
      {conCategoria && (
        <span>
          <Icon name="layers" size={14} strokeWidth={1.9} />
          {n.categoria}
        </span>
      )}
      <span>
        <Icon name="clock" size={14} strokeWidth={1.9} />
        {n.lectura}
      </span>
    </p>
  );
}

/** Tarjeta de la rejilla "Mas noticias". */
export function Tarjeta({ n }: { n: Noticia }) {
  return (
    <motion.article className="not-tarjeta" variants={cardVariants}>
      <Link to={`/noticias/${n.slug}`} className="not-tarjeta__media">
        <img src={n.imagen} alt={n.imagenAlt} loading="lazy" />
        <Etiqueta n={n} />
      </Link>
      <div className="not-tarjeta__cuerpo">
        <h3>
          <Link to={`/noticias/${n.slug}`}>{n.titulo}</Link>
        </h3>
        <p>{n.resumen}</p>
        <span className="not-tarjeta__fecha">
          <Icon name="calendar" size={13} strokeWidth={1.9} />
          {n.fecha}
        </span>
      </div>
    </motion.article>
  );
}

/** Rejilla de tarjetas con entrada escalonada. */
export function Rejilla({ noticias, titulo = 'Más noticias' }: { noticias: Noticia[]; titulo?: string }) {
  if (!noticias.length) return null;
  return (
    <section className="not-mas">
      <div className="container container--wide">
        <Reveal className="not-mas__cabeza" y={20}>
          <h2>{titulo}</h2>
          <Link className="link-arrow link-arrow--tech" to="/noticias">
            Ver todas las noticias
            <Icon name="arrow-right" size={14} strokeWidth={2.2} />
          </Link>
        </Reveal>
        <motion.div
          className="not-rejilla"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {noticias.map((n) => (
            <Tarjeta n={n} key={n.slug} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/**
 * Alta en el boletin. Llega al mismo punto de recepcion que los formularios,
 * como una solicitud mas: LINKDICOM recibe un correo por cada suscripcion.
 */
function Boletin() {
  const [estado, setEstado] = useState<EstadoEnvio>('listo');
  const [error, setError] = useState('');

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const correo = (new FormData(form).get('correo') as string | null)?.trim() ?? '';
    const web = (new FormData(form).get('web') as string | null) ?? '';
    setEstado('enviando');
    setError('');
    const r = await enviarSolicitud('boletin', { correo, web }, 'Boletín de noticias');
    if (r.ok) {
      setEstado('enviado');
    } else {
      setEstado('error');
      setError(r.error ?? '');
    }
  };

  return (
    <div className="not-boletin">
      <span className="not-boletin__icono" aria-hidden="true">
        <Icon name="mail" size={22} strokeWidth={1.7} />
      </span>
      <h3>Recibe nuestras noticias</h3>
      <p>Suscríbete y recibe las últimas novedades y actualizaciones de LINKDICOM.</p>

      {estado === 'enviado' ? (
        <p className="not-boletin__ok">
          <Icon name="check-circle" size={17} strokeWidth={2} />
          ¡Listo! Te avisaremos de las próximas noticias.
        </p>
      ) : (
        <form onSubmit={enviar}>
          <input className="trampa" type="text" name="web" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <label className="not-boletin__campo">
            <Icon name="mail" size={16} strokeWidth={1.9} />
            <input name="correo" type="email" required placeholder="Tu correo electrónico" aria-label="Correo electrónico" />
          </label>
          <button className="btn btn--primary btn--square" type="submit" disabled={estado === 'enviando'}>
            {estado === 'enviando' ? 'Enviando…' : 'Suscribirme'}
          </button>
          {estado === 'error' && (
            <span className="not-boletin__error" role="alert">
              {error}
            </span>
          )}
        </form>
      )}
      <small>
        No compartimos tu información. Consulta nuestra{' '}
        <Link to="/empresa/politicas-y-terminos?doc=privacidad">política de privacidad</Link>.
      </small>
    </div>
  );
}

/** Columna lateral: ultimas noticias, categorias y boletin. */
export function Lateral({ excepto }: { excepto?: string }) {
  const ultimas = NOTICIAS.filter((n) => n.slug !== excepto).slice(0, 3);
  const categorias = contarCategorias();

  return (
    <aside className="not-lateral">
      <Reveal className="not-caja" y={20}>
        <h3 className="not-caja__titulo">Últimas noticias</h3>
        <ul className="not-ultimas">
          {ultimas.map((n) => (
            <li key={n.slug}>
              <Link to={`/noticias/${n.slug}`}>
                <img src={n.imagen} alt="" loading="lazy" />
                <span>
                  <Etiqueta n={n} />
                  <b>{n.titulo}</b>
                  <small>
                    <Icon name="calendar" size={12} strokeWidth={2} />
                    {n.fecha}
                  </small>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link className="link-arrow link-arrow--tech" to="/noticias">
          Ver todas las noticias
          <Icon name="arrow-right" size={14} strokeWidth={2.2} />
        </Link>
      </Reveal>

      <Reveal className="not-caja" y={20} delay={0.06}>
        <h3 className="not-caja__titulo">Categorías</h3>
        <ul className="not-categorias">
          <li>
            <Link to="/noticias">
              Todas las noticias <b>{NOTICIAS.length}</b>
            </Link>
          </li>
          {categorias.map((c) => (
            <li key={c.nombre}>
              <Link to={`/noticias?categoria=${encodeURIComponent(c.nombre)}`}>
                {c.nombre} <b>{c.total}</b>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal y={20} delay={0.1}>
        <Boletin />
      </Reveal>
    </aside>
  );
}
