import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Icon from '../../components/ui/Icon';
import { fechaCorta, hoyISO, slugificar } from '../../contenido/formato';
import type { Cifra, ProximaJornada } from '../../contenido/tipos';
import { mensajeDe, useEstado, useMaestro } from '../estado';
import { Area, AvisoEnLinea, Boton, Cabecera, Campo, Chip, EnlaceBoton, Entrada, Interruptor, Pestanas, Tarjeta, Vacio } from '../ui/Basicos';
import { EditorCifras, Fila } from '../ui/Editores';
import { CampoImagen } from '../ui/Medios';
import { Modal, useConfirmar } from '../ui/Modal';

type Pestana = 'proximas' | 'jornadas' | 'cifras';

function proximaNueva(): ProximaJornada {
  return {
    slug: '',
    fechaISO: hoyISO(),
    titulo: '',
    lugar: '',
    texto: '',
    imagen: '',
    imagenAlt: '',
    cta: 'Quiero aportar a este evento',
    publicado: true,
  };
}

/** Obra social: proximas jornadas, jornadas realizadas y cifras del programa. */
export default function ObraSocial() {
  const maestro = useMaestro();
  const { guardar, avisar } = useEstado();
  const confirmar = useConfirmar();
  const [params, setParams] = useSearchParams();
  const pestana = (params.get('pestana') as Pestana) || 'proximas';
  const os = maestro.obraSocial;

  const [editando, setEditando] = useState<ProximaJornada | null>(null);
  const [esNueva, setEsNueva] = useState(false);
  const [error, setError] = useState('');
  const [ocupado, setOcupado] = useState('');
  const [cifras, setCifras] = useState<Cifra[]>(os.cifras);
  const [guardandoCifras, setGuardandoCifras] = useState(false);

  const guardarOS = (parte: Partial<typeof os>, detalle: string) => guardar('obraSocial', { ...os, ...parte }, detalle);

  /* ---------- proximas ---------- */
  const guardarProxima = async () => {
    if (!editando) return;
    if (!editando.titulo.trim()) return setError('Escribe el título de la jornada.');
    if (!editando.fechaISO) return setError('Elige la fecha.');
    if (!editando.lugar.trim()) return setError('Indica el lugar.');
    if (!editando.imagen) return setError('Añade una foto.');
    const slug = editando.slug || slugificar(`${editando.titulo}-${editando.fechaISO}`);
    if (os.proximas.some((p) => p.slug === slug && (esNueva || p.slug !== editando.slug))) return setError('Ya hay una jornada con ese mismo título y fecha.');
    const lista = esNueva ? [...os.proximas, { ...editando, slug }] : os.proximas.map((p) => (p.slug === editando.slug ? { ...editando, slug } : p));
    setOcupado('proxima');
    try {
      await guardarOS({ proximas: lista }, `${esNueva ? 'Anunció' : 'Editó'} la jornada «${editando.titulo}»`);
      avisar('ok', 'Jornada guardada.');
      setEditando(null);
      setError('');
    } catch (e) {
      setError(mensajeDe(e));
    } finally {
      setOcupado('');
    }
  };

  const eliminarProxima = async (p: ProximaJornada) => {
    const ok = await confirmar({ titulo: 'Quitar la jornada', texto: `«${p.titulo}» dejará de anunciarse en la web.`, confirmar: 'Quitar', peligro: true });
    if (!ok) return;
    try {
      await guardarOS({ proximas: os.proximas.filter((x) => x.slug !== p.slug) }, `Quitó la jornada próxima «${p.titulo}»`);
      avisar('ok', 'Jornada quitada.');
    } catch (e) {
      avisar('error', mensajeDe(e));
    }
  };

  /* ---------- jornadas realizadas ---------- */
  const eliminarJornada = async (slug: string, titulo: string) => {
    const ok = await confirmar({ titulo: 'Eliminar la jornada', texto: `«${titulo}» y su galería desaparecerán de la web.`, confirmar: 'Eliminar', peligro: true });
    if (!ok) return;
    setOcupado(slug);
    try {
      await guardarOS({ jornadas: os.jornadas.filter((j) => j.slug !== slug) }, `Eliminó la jornada «${titulo}»`);
      avisar('ok', 'Jornada eliminada.');
    } catch (e) {
      avisar('error', mensajeDe(e));
    } finally {
      setOcupado('');
    }
  };

  const alternarJornada = async (slug: string) => {
    const j = os.jornadas.find((x) => x.slug === slug);
    if (!j) return;
    setOcupado(slug);
    try {
      const nuevo = j.publicado === false;
      await guardarOS({ jornadas: os.jornadas.map((x) => (x.slug === slug ? { ...x, publicado: nuevo } : x)) }, `${nuevo ? 'Publicó' : 'Ocultó'} la jornada «${j.titulo}»`);
      avisar('ok', nuevo ? 'Jornada publicada.' : 'Jornada pasada a borrador.');
    } catch (e) {
      avisar('error', mensajeDe(e));
    } finally {
      setOcupado('');
    }
  };

  /* ---------- cifras ---------- */
  const guardarCifras = async () => {
    setGuardandoCifras(true);
    try {
      await guardarOS({ cifras: cifras.filter((c) => c.valor.trim() && c.label.trim()) }, 'Actualizó las cifras del programa');
      avisar('ok', 'Cifras guardadas.');
    } catch (e) {
      avisar('error', mensajeDe(e));
    } finally {
      setGuardandoCifras(false);
    }
  };

  const jornadas = [...os.jornadas].sort((a, b) => b.fechaISO.localeCompare(a.fechaISO));
  const proximas = [...os.proximas].sort((a, b) => a.fechaISO.localeCompare(b.fechaISO));

  return (
    <>
      <Cabecera
        titulo="Obra social"
        subtitulo="Programa Virginia Toca: la próxima jornada que se anuncia, las jornadas ya realizadas con sus fotos y videos, y las cifras del programa."
        acciones={
          <>
            <EnlaceBoton to="/empresa/obra-social" externo icono="external-link">
              Ver en la web
            </EnlaceBoton>
            {pestana === 'proximas' && (
              <Boton
                variante="primario"
                icono="plus"
                onClick={() => {
                  setEditando(proximaNueva());
                  setEsNueva(true);
                  setError('');
                }}
              >
                Anunciar jornada
              </Boton>
            )}
            {pestana === 'jornadas' && (
              <EnlaceBoton to="/obra-social/jornadas/nueva" variante="primario" icono="plus">
                Nueva jornada realizada
              </EnlaceBoton>
            )}
          </>
        }
      />

      <div className="adm-barra">
        <Pestanas
          valor={pestana}
          onChange={(p) => setParams({ pestana: p })}
          opciones={[
            { clave: 'proximas', label: 'Próximas jornadas', total: os.proximas.length },
            { clave: 'jornadas', label: 'Jornadas realizadas', total: os.jornadas.length },
            { clave: 'cifras', label: 'Cifras del programa' },
          ]}
        />
      </div>

      {/* ---------- proximas ---------- */}
      {pestana === 'proximas' &&
        (proximas.length === 0 ? (
          <Vacio icono="calendar" titulo="No hay ninguna jornada anunciada" texto="Cuando anuncies una, aparece en «Próximas actividades» con el botón para aportar." />
        ) : (
          <ul className="adm-lista">
            {proximas.map((p) => (
              <li className="adm-fila-lista" key={p.slug}>
                <span className="adm-fila-lista__media">{p.imagen ? <img src={p.imagen} alt="" /> : <Icon name="image" size={22} strokeWidth={1.5} />}</span>
                <div className="adm-fila-lista__texto">
                  <button
                    type="button"
                    className="adm-fila-lista__titulo"
                    onClick={() => {
                      setEditando(p);
                      setEsNueva(false);
                      setError('');
                    }}
                  >
                    {p.titulo}
                  </button>
                  <span className="adm-fila-lista__meta">
                    <Icon name="calendar" size={12} strokeWidth={2} /> {fechaCorta(p.fechaISO)}
                    <i>·</i>
                    <Icon name="map-pin" size={12} strokeWidth={2} /> {p.lugar}
                  </span>
                </div>
                <Chip tono={p.publicado === false ? 'naranja' : 'verde'}>{p.publicado === false ? 'Oculta' : 'Anunciada'}</Chip>
                <div className="adm-fila-lista__acciones">
                  <Boton
                    pequeno
                    icono="edit"
                    onClick={() => {
                      setEditando(p);
                      setEsNueva(false);
                      setError('');
                    }}
                  >
                    Editar
                  </Boton>
                  <Boton pequeno variante="fantasma" icono="trash" onClick={() => eliminarProxima(p)} aria-label="Quitar" />
                </div>
              </li>
            ))}
          </ul>
        ))}

      {/* ---------- jornadas realizadas ---------- */}
      {pestana === 'jornadas' &&
        (jornadas.length === 0 ? (
          <Vacio icono="heart" titulo="Todavía no hay jornadas realizadas" texto="Cada jornada tiene su propia página con el video resumen, la galería y los agradecimientos." />
        ) : (
          <ul className="adm-lista">
            {jornadas.map((j) => (
              <li className="adm-fila-lista" key={j.slug}>
                <Link to={`/obra-social/jornadas/${j.slug}`} className="adm-fila-lista__media">
                  {j.portada ? <img src={j.portada} alt="" loading="lazy" /> : <Icon name="image" size={22} strokeWidth={1.5} />}
                </Link>
                <div className="adm-fila-lista__texto">
                  <Link to={`/obra-social/jornadas/${j.slug}`} className="adm-fila-lista__titulo">
                    {j.titulo}
                  </Link>
                  <span className="adm-fila-lista__meta">
                    <Icon name="calendar" size={12} strokeWidth={2} /> {fechaCorta(j.fechaISO)}
                    <i>·</i>
                    <Icon name="image" size={12} strokeWidth={2} /> {j.galeria.filter((g) => g.tipo === 'foto').length} fotos
                    <i>·</i>
                    <Icon name="video" size={12} strokeWidth={2} /> {j.galeria.filter((g) => g.tipo === 'video').length + (j.video ? 1 : 0)} videos
                  </span>
                </div>
                <Chip tono={j.publicado === false ? 'naranja' : 'verde'}>{j.publicado === false ? 'Borrador' : 'Publicada'}</Chip>
                <div className="adm-fila-lista__acciones">
                  <Boton pequeno variante="fantasma" icono={j.publicado === false ? 'eye' : 'eye-off'} cargando={ocupado === j.slug} onClick={() => alternarJornada(j.slug)}>
                    {j.publicado === false ? 'Publicar' : 'Ocultar'}
                  </Boton>
                  <EnlaceBoton to={`/obra-social/jornadas/${j.slug}`} pequeno icono="edit">
                    Editar
                  </EnlaceBoton>
                  <Boton pequeno variante="fantasma" icono="trash" onClick={() => eliminarJornada(j.slug, j.titulo)} aria-label="Eliminar" />
                </div>
              </li>
            ))}
          </ul>
        ))}

      {/* ---------- cifras ---------- */}
      {pestana === 'cifras' && (
        <Tarjeta
          titulo="Cifras del programa"
          acciones={
            <Boton variante="primario" icono="save" cargando={guardandoCifras} onClick={guardarCifras} disabled={JSON.stringify(cifras) === JSON.stringify(os.cifras)}>
              Guardar cifras
            </Boton>
          }
        >
          <p className="adm-texto-suave">Los cuatro datos de la banda azul de la página de Obra social. Cada jornada realizada tiene además sus propias cifras.</p>
          <EditorCifras cifras={cifras} onChange={setCifras} />
        </Tarjeta>
      )}

      {/* ---------- editor de una proxima ---------- */}
      {editando && (
        <Modal
          titulo={esNueva ? 'Anunciar una jornada' : 'Editar la jornada'}
          onClose={() => setEditando(null)}
          ancho="720px"
          pie={
            <>
              <Boton variante="fantasma" onClick={() => setEditando(null)}>
                Cancelar
              </Boton>
              <Boton variante="primario" icono="save" cargando={ocupado === 'proxima'} onClick={guardarProxima}>
                Guardar
              </Boton>
            </>
          }
        >
          {error && <AvisoEnLinea tipo="error">{error}</AvisoEnLinea>}
          <Campo etiqueta="Título" obligatorio>
            <Entrada value={editando.titulo} onChange={(e) => setEditando({ ...editando, titulo: e.target.value })} placeholder="Entrega de cenas navideñas" autoFocus />
          </Campo>
          <Fila>
            <Campo etiqueta="Fecha" obligatorio>
              <Entrada type="date" value={editando.fechaISO} onChange={(e) => setEditando({ ...editando, fechaISO: e.target.value })} />
            </Campo>
            <Campo etiqueta="Lugar" obligatorio>
              <Entrada value={editando.lugar} onChange={(e) => setEditando({ ...editando, lugar: e.target.value })} placeholder="Sectores vulnerables, San Juan de la Maguana" />
            </Campo>
          </Fila>
          <Campo etiqueta="Descripción">
            <Area rows={3} value={editando.texto} onChange={(e) => setEditando({ ...editando, texto: e.target.value })} placeholder="Qué se va a entregar y a quién." />
          </Campo>
          <CampoImagen etiqueta="Foto" valor={editando.imagen} alt={editando.imagenAlt} onChange={(u, a) => setEditando({ ...editando, imagen: u, imagenAlt: a ?? editando.imagenAlt })} proporcion="4 / 3" obligatorio />
          <Campo etiqueta="Texto del botón de aporte">
            <Entrada value={editando.cta} onChange={(e) => setEditando({ ...editando, cta: e.target.value })} />
          </Campo>
          <Interruptor activo={editando.publicado !== false} onChange={(v) => setEditando({ ...editando, publicado: v })} etiqueta="Anunciada en la web" descripcion="Si la ocultas, deja de verse sin borrarla." />
        </Modal>
      )}
    </>
  );
}
