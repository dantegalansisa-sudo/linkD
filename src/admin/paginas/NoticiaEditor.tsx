import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { fechaLarga, hoyISO, slugificar, tiempoLectura } from '../../contenido/formato';
import type { Noticia } from '../../contenido/tipos';
import { mensajeDe, useEstado, useMaestro } from '../estado';
import { Area, AvisoEnLinea, Boton, Cabecera, Campo, Chip, EnlaceBoton, Entrada, Interruptor, Selector, Tarjeta } from '../ui/Basicos';
import { EditorBloques, Fila } from '../ui/Editores';
import { CampoImagen } from '../ui/Medios';
import { Modal, useConfirmar } from '../ui/Modal';
import { useCambios } from '../ui/useCambios';

/** Soluciones que se pueden ofrecer en el boton final. */
const INTERESES = ['', 'RadiologoX', 'SIEGIX Health', 'SIEGIX CRM', 'SIEGIX Provider', 'ECOTurnox', 'LINKRix', 'ConsultorioX', 'LinkXpace', 'LinkBurnPrint'];

const COLORES = ['#0f8a5f', '#2563eb', '#6d5bd0', '#ff6a13', '#dc2626', '#0891b2', '#7c3aed', '#ca8a04'];

function nueva(categoria: string, color: string): Noticia {
  return {
    slug: '',
    titulo: '',
    subtitulo: '',
    fecha: '',
    fechaISO: hoyISO(),
    categoria,
    color,
    lectura: '',
    imagen: '',
    imagenAlt: '',
    pie: '',
    resumen: '',
    cuerpo: [{ tipo: 'p', texto: '' }],
    cta: { titulo: '¿Quieres saber más?', texto: 'Escríbenos y te contamos cómo LINKDICOM puede ayudar a tu institución.', boton: 'Solicitar Demo', interes: '' },
    publicado: false,
    destacada: true,
  };
}

/** Editor de una noticia (nueva o existente). */
export default function NoticiaEditor() {
  const { slug } = useParams();
  const navegar = useNavigate();
  const maestro = useMaestro();
  const { guardar, avisar } = useEstado();
  const confirmar = useConfirmar();

  const esNueva = slug === 'nueva';
  const existente = esNueva ? undefined : maestro.noticias.find((n) => n.slug === slug);
  const categorias = Object.entries(maestro.categoriasNoticias);
  const primera = categorias[0] ?? ['General', '#2563eb'];

  const { valor: n, setValor, cambiar, sucio, marcarGuardado } = useCambios<Noticia>(existente ?? nueva(primera[0], primera[1]));
  const [slugManual, setSlugManual] = useState(!esNueva);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState<{ nombre: string; color: string } | null>(null);

  if (!esNueva && !existente) return <Navigate to="/noticias" replace />;

  const cambiarTitulo = (t: string) => {
    setValor((x) => ({ ...x, titulo: t, slug: slugManual ? x.slug : slugificar(t) }));
  };

  const validar = (): string => {
    if (!n.titulo.trim()) return 'La noticia necesita un título.';
    if (!n.slug.trim()) return 'La noticia necesita una dirección (se genera sola a partir del título).';
    if (maestro.noticias.some((x) => x.slug === n.slug && x.slug !== existente?.slug)) return 'Ya hay otra noticia con esa misma dirección. Cambia el título o la dirección.';
    if (!n.resumen.trim()) return 'Escribe el resumen: es lo que se ve en las tarjetas y en el inicio.';
    if (!n.imagen) return 'La noticia necesita una foto principal.';
    if (!n.fechaISO) return 'Elige la fecha de la noticia.';
    return '';
  };

  const guardarNoticia = async (publicar?: boolean) => {
    const e = validar();
    if (e) {
      setError(e);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setError('');
    setGuardando(true);
    const textos = n.cuerpo.flatMap((b) => ('texto' in b ? [b.texto] : 'items' in b ? b.items : []));
    const lista: Noticia = {
      ...n,
      titulo: n.titulo.trim(),
      fecha: fechaLarga(n.fechaISO),
      lectura: tiempoLectura([n.subtitulo, n.resumen, ...textos]),
      color: maestro.categoriasNoticias[n.categoria] ?? n.color,
      publicado: publicar ?? n.publicado,
      cuerpo: n.cuerpo.filter((b) => !('texto' in b && !b.texto.trim())),
    };
    const nuevas = existente ? maestro.noticias.map((x) => (x.slug === existente.slug ? lista : x)) : [lista, ...maestro.noticias];
    try {
      await guardar('noticias', nuevas, `${existente ? 'Editó' : 'Creó'} la noticia «${lista.titulo}»`);
      marcarGuardado(lista);
      avisar('ok', lista.publicado ? 'Noticia guardada y publicada.' : 'Borrador guardado.');
      if (esNueva) navegar(`/noticias/${lista.slug}`, { replace: true });
    } catch (err) {
      setError(mensajeDe(err));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setGuardando(false);
    }
  };

  const volver = async () => {
    if (sucio) {
      const ok = await confirmar({ titulo: 'Salir sin guardar', texto: 'Tienes cambios sin guardar. ¿Quieres salir y perderlos?', confirmar: 'Salir sin guardar', peligro: true });
      if (!ok) return;
    }
    navegar('/noticias');
  };

  const crearCategoria = async () => {
    if (!nuevaCategoria?.nombre.trim()) return;
    const nombre = nuevaCategoria.nombre.trim();
    try {
      await guardar('categoriasNoticias', { ...maestro.categoriasNoticias, [nombre]: nuevaCategoria.color }, `Creó la categoría «${nombre}»`);
      setValor((x) => ({ ...x, categoria: nombre, color: nuevaCategoria.color }));
      setNuevaCategoria(null);
      avisar('ok', 'Categoría creada.');
    } catch (e) {
      avisar('error', mensajeDe(e));
    }
  };

  return (
    <>
      <Cabecera
        titulo={esNueva ? 'Nueva noticia' : 'Editar noticia'}
        chip={<Chip tono={n.publicado === false ? 'naranja' : 'verde'}>{n.publicado === false ? 'Borrador' : 'Publicada'}</Chip>}
        subtitulo={sucio ? 'Hay cambios sin guardar.' : existente ? 'Todo guardado.' : 'Se guarda como borrador hasta que la publiques.'}
        acciones={
          <>
            <Boton variante="fantasma" icono="arrow-left" onClick={volver}>
              Volver
            </Boton>
            {!esNueva && (
              <EnlaceBoton to={`/noticias/${n.slug}?borrador=1`} externo icono="eye">
                Vista previa
              </EnlaceBoton>
            )}
            <Boton icono="save" cargando={guardando} onClick={() => guardarNoticia()}>
              Guardar
            </Boton>
            {n.publicado === false ? (
              <Boton variante="primario" icono="check" cargando={guardando} onClick={() => guardarNoticia(true)}>
                Guardar y publicar
              </Boton>
            ) : (
              <Boton variante="suave" icono="eye-off" cargando={guardando} onClick={() => guardarNoticia(false)}>
                Pasar a borrador
              </Boton>
            )}
          </>
        }
      />

      {error && <AvisoEnLinea tipo="error">{error}</AvisoEnLinea>}

      <div className="adm-editor">
        <div className="adm-editor__principal">
          <Tarjeta>
            <Campo etiqueta="Título" obligatorio>
              <Entrada value={n.titulo} onChange={(e) => cambiarTitulo(e.target.value)} placeholder="LINKDICOM presenta…" className="adm-entrada--grande" autoFocus={esNueva} />
            </Campo>
            <Campo etiqueta="Subtítulo" ayuda="Una o dos frases que amplían el título. Se ve bajo el titular.">
              <Area rows={2} value={n.subtitulo} onChange={(e) => cambiar('subtitulo', e.target.value)} />
            </Campo>
            <Campo etiqueta="Resumen" obligatorio ayuda="Lo que se lee en las tarjetas y en el inicio de la web. Dos o tres líneas.">
              <Area rows={3} value={n.resumen} onChange={(e) => cambiar('resumen', e.target.value)} />
            </Campo>
          </Tarjeta>

          <Tarjeta titulo="Foto principal">
            <CampoImagen etiqueta="Foto" valor={n.imagen} alt={n.imagenAlt} onChange={(u, a) => setValor((x) => ({ ...x, imagen: u, imagenAlt: a ?? x.imagenAlt }))} obligatorio ayuda="Horizontal, de al menos 1200 px de ancho. Se muestra grande en el inicio y en la noticia." />
            <Campo etiqueta="Pie de foto">
              <Entrada value={n.pie ?? ''} onChange={(e) => cambiar('pie', e.target.value)} placeholder="Quiénes aparecen o qué se ve (opcional)" />
            </Campo>
          </Tarjeta>

          <Tarjeta titulo="Texto de la noticia">
            <EditorBloques bloques={n.cuerpo} onChange={(c) => cambiar('cuerpo', c)} />
          </Tarjeta>

          <Tarjeta titulo="Llamada al final">
            <Fila>
              <Campo etiqueta="Título de la caja">
                <Entrada value={n.cta.titulo} onChange={(e) => cambiar('cta', { ...n.cta, titulo: e.target.value })} />
              </Campo>
              <Campo etiqueta="Texto del botón">
                <Entrada value={n.cta.boton} onChange={(e) => cambiar('cta', { ...n.cta, boton: e.target.value })} />
              </Campo>
            </Fila>
            <Campo etiqueta="Texto">
              <Area rows={2} value={n.cta.texto} onChange={(e) => cambiar('cta', { ...n.cta, texto: e.target.value })} />
            </Campo>
            <Campo etiqueta="Solución que se ofrece en el formulario de demo" ayuda="El botón abre el formulario de demo con esta solución ya marcada.">
              <Selector value={n.cta.interes ?? ''} onChange={(e) => cambiar('cta', { ...n.cta, interes: e.target.value })}>
                {INTERESES.map((i) => (
                  <option key={i} value={i}>
                    {i || 'Sin preferencia'}
                  </option>
                ))}
              </Selector>
            </Campo>
          </Tarjeta>
        </div>

        <aside className="adm-editor__lateral">
          <Tarjeta titulo="Publicación">
            <Interruptor activo={n.publicado !== false} onChange={(v) => cambiar('publicado', v)} etiqueta="Visible en la web" descripcion={n.publicado === false ? 'Solo tú la ves (vista previa).' : 'Aparece en /noticias y en el inicio.'} />
            <Interruptor activo={n.destacada !== false} onChange={(v) => cambiar('destacada', v)} etiqueta="Puede ir en grande en el inicio" descripcion="Rota en el panel de actualidad de la portada." />
            <Campo etiqueta="Fecha" obligatorio>
              <Entrada type="date" value={n.fechaISO} onChange={(e) => cambiar('fechaISO', e.target.value)} />
            </Campo>
            <Campo etiqueta="Dirección (URL)" ayuda={`link-dicom.com/noticias/${n.slug || '…'}`}>
              <Entrada
                value={n.slug}
                onChange={(e) => {
                  setSlugManual(true);
                  cambiar('slug', slugificar(e.target.value));
                }}
              />
            </Campo>
          </Tarjeta>

          <Tarjeta titulo="Categoría">
            <Selector
              value={n.categoria}
              onChange={(e) => {
                if (e.target.value === '__nueva') {
                  setNuevaCategoria({ nombre: '', color: COLORES[categorias.length % COLORES.length] });
                  return;
                }
                setValor((x) => ({ ...x, categoria: e.target.value, color: maestro.categoriasNoticias[e.target.value] ?? x.color }));
              }}
            >
              {categorias.map(([nombre]) => (
                <option key={nombre} value={nombre}>
                  {nombre}
                </option>
              ))}
              {!categorias.some(([c]) => c === n.categoria) && n.categoria && <option value={n.categoria}>{n.categoria}</option>}
              <option value="__nueva">+ Nueva categoría…</option>
            </Selector>
            <p className="adm-muestra-categoria">
              <span className="adm-punto" style={{ background: maestro.categoriasNoticias[n.categoria] ?? n.color }} />
              Así se ve la etiqueta: <b style={{ color: maestro.categoriasNoticias[n.categoria] ?? n.color }}>{n.categoria}</b>
            </p>
          </Tarjeta>
        </aside>
      </div>

      {nuevaCategoria && (
        <Modal
          titulo="Nueva categoría"
          onClose={() => setNuevaCategoria(null)}
          ancho="460px"
          pie={
            <>
              <Boton variante="fantasma" onClick={() => setNuevaCategoria(null)}>
                Cancelar
              </Boton>
              <Boton variante="primario" icono="check" onClick={crearCategoria} disabled={!nuevaCategoria.nombre.trim()}>
                Crear
              </Boton>
            </>
          }
        >
          <Campo etiqueta="Nombre">
            <Entrada value={nuevaCategoria.nombre} onChange={(e) => setNuevaCategoria({ ...nuevaCategoria, nombre: e.target.value })} placeholder="Eventos" autoFocus />
          </Campo>
          <Campo etiqueta="Color de la etiqueta">
            <span className="adm-colores">
              {COLORES.map((c) => (
                <button key={c} type="button" className={`adm-color${nuevaCategoria.color === c ? ' is-activo' : ''}`} style={{ background: c }} onClick={() => setNuevaCategoria({ ...nuevaCategoria, color: c })} aria-label={c} />
              ))}
            </span>
          </Campo>
        </Modal>
      )}
    </>
  );
}
