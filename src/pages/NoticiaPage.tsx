import { useEffect, useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../components/ui/Icon';
import MagneticButton from '../components/ui/MagneticButton';
import { Reveal } from '../components/ui/RevealText';
import { useModales } from '../components/modales/Modales';
import { Boletin, Etiqueta, Meta, Publicidad, Relacionadas, Tarjeta, TituloSeccion, relacionadasDe } from '../components/noticias/Piezas';
import { Cuerpo } from '../components/contenido/Bloques';
import { esBorrador, getNoticias, getSitio, imagen } from '../contenido/store';
import type { Noticia } from '../contenido/tipos';
import { comentar, guardarVoto, leerInteracciones, registrarVista, votar, votoGuardado, type ComentarioPublico, type Votos } from '../utils/noticiasApi';
import { containerVariants, EASINGS, VIEWPORT } from '../utils/easings';

/* ---------- Compartir ---------- */

function Compartir({ n }: { n: Noticia }) {
  const [copiado, setCopiado] = useState(false);
  const url = `${window.location.origin}/noticias/${n.slug}`;
  const texto = encodeURIComponent(n.titulo);
  const enlace = encodeURIComponent(url);
  const redes = [
    { nombre: 'Facebook', icon: 'facebook' as const, href: `https://www.facebook.com/sharer/sharer.php?u=${enlace}`, clase: 'fb' },
    { nombre: 'X', icon: 'x-logo' as const, href: `https://twitter.com/intent/tweet?url=${enlace}&text=${texto}`, clase: 'x' },
    { nombre: 'LinkedIn', icon: 'linkedin' as const, href: `https://www.linkedin.com/sharing/share-offsite/?url=${enlace}`, clase: 'in' },
    { nombre: 'WhatsApp', icon: 'whatsapp' as const, href: `https://wa.me/?text=${texto}%20${enlace}`, clase: 'wa' },
  ];
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2200);
    } catch {
      window.prompt('Copia el enlace de la noticia:', url);
    }
  };
  return (
    <div className="nx-compartir">
      <span>Compartir:</span>
      {redes.map((r) => (
        <a key={r.nombre} className={`nx-compartir__red nx-compartir__red--${r.clase}`} href={r.href} target="_blank" rel="noopener noreferrer" aria-label={`Compartir en ${r.nombre}`}>
          <Icon name={r.icon} size={16} strokeWidth={r.icon === 'x-logo' ? 2.2 : 1.9} />
        </a>
      ))}
      <button type="button" className="nx-compartir__red nx-compartir__red--copiar" onClick={copiar} aria-label="Copiar enlace">
        <Icon name={copiado ? 'check' : 'link'} size={16} strokeWidth={2.2} />
      </button>
      {copiado && (
        <span className="nx-compartir__aviso" role="status">
          Enlace copiado
        </span>
      )}
    </div>
  );
}

/* ---------- Me gusta / No me gusta ---------- */

function Valoracion({ slug, votos, onVotos }: { slug: string; votos: Votos; onVotos: (v: Votos) => void }) {
  const [mio, setMio] = useState(() => votoGuardado(slug));
  const [enviando, setEnviando] = useState(false);
  useEffect(() => setMio(votoGuardado(slug)), [slug]);

  const pulsar = async (v: 'si' | 'no') => {
    if (enviando) return;
    const nuevo = mio === v ? '' : v;
    setEnviando(true);
    try {
      const r = await votar(slug, nuevo);
      if (r) onVotos(r);
      setMio(nuevo);
      guardarVoto(slug, nuevo);
    } catch {
      /* sin conexion: el voto no se cuenta, el boton no cambia */
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="nx-valoracion" aria-label="Valora esta noticia">
      <div>
        <b>¿Qué te pareció esta noticia?</b>
        <small>Tu opinión nos ayuda a seguir compartiendo contenido relevante.</small>
      </div>
      <div className="nx-valoracion__botones">
        <button type="button" className={`nx-voto nx-voto--si${mio === 'si' ? ' is-elegido' : ''}`} aria-pressed={mio === 'si'} onClick={() => pulsar('si')} disabled={enviando}>
          <Icon name="thumbs-up" size={19} strokeWidth={2} />
          Me gusta
          {votos.si > 0 && <em>{votos.si}</em>}
        </button>
        <button type="button" className={`nx-voto nx-voto--no${mio === 'no' ? ' is-elegido' : ''}`} aria-pressed={mio === 'no'} onClick={() => pulsar('no')} disabled={enviando}>
          <Icon name="thumbs-down" size={19} strokeWidth={2} />
          No me gusta
          {votos.no > 0 && <em>{votos.no}</em>}
        </button>
      </div>
    </section>
  );
}

/* ---------- Comentarios ---------- */

const FECHA_COMENTARIO = new Intl.DateTimeFormat('es-DO', { day: 'numeric', month: 'long', year: 'numeric' });

function Comentarios({ slug, lista }: { slug: string; lista: ComentarioPublico[] }) {
  const [nombre, setNombre] = useState('');
  const [texto, setTexto] = useState('');
  const [estado, setEstado] = useState<'listo' | 'enviando' | 'enviado' | 'error'>('listo');
  const [error, setError] = useState('');

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (texto.trim().length < 3) {
      setError('Escribe tu comentario.');
      setEstado('error');
      return;
    }
    const web = (new FormData(e.currentTarget).get('web') as string | null) ?? '';
    setEstado('enviando');
    setError('');
    try {
      await comentar(slug, nombre.trim(), texto.trim(), web);
      setEstado('enviado');
      setTexto('');
    } catch (err) {
      setEstado('error');
      setError(err instanceof Error ? err.message : 'No se pudo enviar el comentario.');
    }
  };

  return (
    <section className="nx-comentarios" aria-labelledby="titulo-comentarios">
      <h2 id="titulo-comentarios">
        <Icon name="message" size={22} strokeWidth={1.9} />
        Comentarios
        {lista.length > 0 && <span>{lista.length}</span>}
      </h2>

      {lista.length > 0 && (
        <ul className="nx-comentarios__lista">
          {lista.map((c) => (
            <li key={c.id}>
              <span className="nx-comentarios__avatar" aria-hidden="true">
                {(c.nombre || 'A').trim().charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="nx-comentarios__quien">
                  <b>{c.nombre || 'Anónimo'}</b>
                  <time dateTime={c.fecha}>{FECHA_COMENTARIO.format(new Date(c.fecha))}</time>
                </p>
                <p className="nx-comentarios__texto">{c.texto}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {estado === 'enviado' ? (
        <p className="nx-comentarios__gracias" role="status">
          <Icon name="check-circle" size={19} strokeWidth={2} />
          ¡Gracias por comentar! Tu comentario se publicará cuando nuestro equipo lo revise.
          <button type="button" onClick={() => setEstado('listo')}>
            Escribir otro
          </button>
        </p>
      ) : (
        <form className="nx-comentarios__form" onSubmit={enviar}>
          <span className="nx-comentarios__avatar nx-comentarios__avatar--vacio" aria-hidden="true">
            <Icon name="user-round" size={20} strokeWidth={1.8} />
          </span>
          <div className="nx-comentarios__campos">
            <div className="nx-comentarios__fila">
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={60} placeholder="Ingresa tu nombre o alias (opcional)" aria-label="Nombre o alias (opcional)" />
              <button type="submit" className="nx-boton nx-boton--naranja" disabled={estado === 'enviando'}>
                {estado === 'enviando' ? 'Enviando…' : 'Comentar'}
              </button>
            </div>
            <textarea value={texto} onChange={(e) => setTexto(e.target.value)} maxLength={1500} rows={3} placeholder="Escribe un comentario..." aria-label="Comentario" required />
            <input className="trampa" type="text" name="web" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            {estado === 'error' && (
              <span className="nx-comentarios__error" role="alert">
                {error}
              </span>
            )}
          </div>
        </form>
      )}
      <p className="nx-comentarios__nota">
        <Icon name="info" size={18} strokeWidth={1.9} />
        Los comentarios son revisados por nuestro equipo antes de ser publicados.
      </p>
    </section>
  );
}

/* ---------- Pagina ---------- */

/** Una noticia de NoticiaX completa, con su columna de publicidad y relacionadas. */
export default function NoticiaPage() {
  const { slug } = useParams();
  const { key } = useLocation();
  const { abrirDemo } = useModales();
  const noticias = getNoticias();
  const noticia = noticias.find((n) => n.slug === slug);
  const [votos, setVotos] = useState<Votos>({ si: 0, no: 0 });
  const [comentarios, setComentarios] = useState<ComentarioPublico[]>([]);

  useEffect(() => {
    if (!noticia) return;
    let vivo = true;
    setVotos({ si: 0, no: 0 });
    setComentarios([]);
    leerInteracciones(noticia.slug).then((r) => {
      if (!vivo || !r) return;
      setVotos(r.votos);
      setComentarios(r.comentarios);
    });
    // la vista previa del panel no cuenta como visita
    if (!esBorrador()) {
      const params = new URLSearchParams(window.location.search);
      // navegando dentro de la web el referrer del navegador no cambia: se marca como "sitio"
      const ref = key !== 'default' ? window.location.origin : document.referrer;
      registrarVista(noticia.slug, ref, params.get('utm_source') ?? params.get('fuente') ?? '');
    }
    return () => {
      vivo = false;
    };
  }, [noticia?.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (noticia) document.title = `${noticia.titulo} | NoticiaX by LINKDICOM`;
    return () => {
      document.title = 'LINKDICOM | Conecta y Avanza';
    };
  }, [noticia]);

  if (!noticia) return <Navigate to="/noticias" replace />;

  const enLateral = relacionadasDe(noticia, 4);
  const otras = noticias.filter((n) => n.slug !== noticia.slug && !enLateral.includes(n)).slice(0, 4);
  const otrasFinal = otras.length ? otras : enLateral.slice(0, 4);
  const color = getSitio().categoriasNoticias[noticia.categoria] ?? noticia.color;
  const mostrarCta = noticia.cta && noticia.cta.mostrar !== false && noticia.cta.titulo;

  return (
    <main className="nx nx--articulo" id="contenido">
      <div className="container container--wide">
        <nav className="migas nx-migas" aria-label="Ruta de navegación">
          <Link to="/">Inicio</Link>
          <Icon name="chevron-right" size={13} strokeWidth={2} />
          <Link to="/noticias">NoticiaX</Link>
          <Icon name="chevron-right" size={13} strokeWidth={2} />
          <Link to={`/noticias?categoria=${encodeURIComponent(noticia.categoria)}`}>{noticia.categoria}</Link>
          <Icon name="chevron-right" size={13} strokeWidth={2} />
          <span aria-current="page">{noticia.titulo}</span>
        </nav>

        <div className="nx-cuerpo">
          <motion.article className="nx-articulo" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASINGS.premium }}>
            <header className="nx-articulo__cabeza">
              <Etiqueta n={{ ...noticia, color }} />
              <h1>{noticia.titulo}</h1>
              {noticia.subtitulo && <p className="nx-articulo__sub">{noticia.subtitulo}</p>}
              <div className="nx-articulo__meta">
                <Meta n={noticia} />
                <Compartir n={noticia} />
              </div>
            </header>

            <figure className="nx-articulo__portada">
              <img src={imagen(noticia.imagen)} alt={noticia.imagenAlt} />
              {noticia.pie && <figcaption>{noticia.pie}</figcaption>}
            </figure>

            <div className="not-articulo__texto nx-articulo__texto">
              <Cuerpo bloques={noticia.cuerpo} />
            </div>

            {(noticia.etiquetas?.length ?? 0) > 0 && (
              <div className="nx-etiquetas">
                <span>
                  <Icon name="tag" size={16} strokeWidth={1.9} />
                  Etiquetas:
                </span>
                {noticia.etiquetas!.map((t) => (
                  <Link key={t} to={`/noticias?q=${encodeURIComponent(t)}`}>
                    {t}
                  </Link>
                ))}
              </div>
            )}

            <Valoracion slug={noticia.slug} votos={votos} onVotos={setVotos} />

            {mostrarCta && (
              <Reveal className="not-cta" y={20}>
                <span className="not-cta__icono" aria-hidden="true">
                  <Icon name="send" size={22} strokeWidth={1.7} />
                </span>
                <div>
                  <b>{noticia.cta.titulo}</b>
                  {noticia.cta.texto && <p>{noticia.cta.texto}</p>}
                </div>
                <MagneticButton className="btn btn--primary btn--square" onClick={() => abrirDemo(noticia.cta.interes)}>
                  {noticia.cta.boton || 'Solicitar Demo'}
                  <span className="btn__arrow">
                    <Icon name="arrow-right" size={16} strokeWidth={2.2} />
                  </span>
                </MagneticButton>
              </Reveal>
            )}

            <Comentarios slug={noticia.slug} lista={comentarios} />
          </motion.article>

          <aside className="nx-lateral">
            <Publicidad espacio="noticia-superior" medida="300 x 250 px" />
            <Boletin />
            <Relacionadas n={noticia} />
            <Publicidad espacio="noticia-inferior" medida="300 x 250 px" />
          </aside>
        </div>

        {otrasFinal.length > 0 && (
          <section className="nx-seccion nx-otras">
            <TituloSeccion titulo="Otras noticias relacionadas" sub="Te puede interesar más contenido sobre este tema" enlace={{ texto: 'Ver todas', to: '/noticias?ver=todas' }} />
            <motion.div className="nx-rejilla nx-rejilla--cuatro" variants={containerVariants} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              {otrasFinal.map((n) => (
                <Tarjeta n={n} key={n.slug} compacta />
              ))}
            </motion.div>
          </section>
        )}
      </div>
    </main>
  );
}
