import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { hoyISO, slugificar } from '../../contenido/formato';
import { TIPOS_RECURSO, type ItemRecurso, type TipoRecurso } from '../../contenido/tipos';
import { RECURSOS_PAGINAS } from '../../data/recursos';
import { mensajeDe, useEstado, useMaestro } from '../estado';
import { Area, AvisoEnLinea, Boton, Cabecera, Campo, Chip, EnlaceBoton, Entrada, Interruptor, Selector, Tarjeta } from '../ui/Basicos';
import { EditorArchivos, EditorBloques, EditorGaleria, EditorParticipantes, Fila } from '../ui/Editores';
import { CampoImagen, CampoVideo } from '../ui/Medios';
import { useConfirmar } from '../ui/Modal';
import { useCambios } from '../ui/useCambios';
import { NOMBRE_ITEM } from './Recursos';

function nuevo(tipo: TipoRecurso, categoria: string): ItemRecurso {
  return {
    slug: '',
    tipo,
    titulo: '',
    subtitulo: '',
    resumen: '',
    categoria,
    fechaISO: tipo === 'materiales-de-apoyo' ? '' : hoyISO(),
    hora: '',
    lugar: '',
    modalidad: tipo === 'webinars' ? 'virtual' : undefined,
    duracion: '',
    participantes: [],
    portada: '',
    portadaAlt: '',
    galeria: [],
    archivos: [],
    cuerpo: [{ tipo: 'p', texto: '' }],
    enlace: { texto: '', url: '' },
    publicado: false,
  };
}

/** Editor de una conferencia, un webinar, una entrevista o un material. */
export default function RecursoEditor() {
  const { tipo: tipoRuta, slug } = useParams();
  const navegar = useNavigate();
  const maestro = useMaestro();
  const { guardar, avisar } = useEstado();
  const confirmar = useConfirmar();

  const tipo = tipoRuta as TipoRecurso;
  const pagina = RECURSOS_PAGINAS.find((r) => r.slug === tipo);
  const items = maestro.recursos[tipo] ?? [];
  const esNuevo = slug === 'nuevo';
  const existente = esNuevo ? undefined : items.find((i) => i.slug === slug);

  const { valor: it, setValor, cambiar, sucio, marcarGuardado } = useCambios<ItemRecurso>(existente ?? nuevo(tipo, pagina?.categorias[0]?.label ?? ''));
  const [slugManual, setSlugManual] = useState(!esNuevo);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  if (!pagina || !TIPOS_RECURSO.includes(tipo)) return <Navigate to="/recursos" replace />;
  if (!esNuevo && !existente) return <Navigate to={`/recursos/${tipo}`} replace />;

  const esAgenda = tipo === 'conferencias' || tipo === 'webinars';
  const esMaterial = tipo === 'materiales-de-apoyo';
  const nombre = NOMBRE_ITEM[tipo];

  const cambiarTitulo = (t: string) => setValor((x) => ({ ...x, titulo: t, slug: slugManual ? x.slug : slugificar(t) }));

  const validar = (): string => {
    if (!it.titulo.trim()) return `Escribe el título de ${tipo === 'entrevistas' ? 'la' : 'el'} ${nombre}.`;
    if (!it.slug.trim()) return 'Falta la dirección (se genera sola a partir del título).';
    if (items.some((x) => x.slug === it.slug && x.slug !== existente?.slug)) return 'Ya hay otro elemento con esa misma dirección.';
    if (!it.resumen.trim()) return 'Escribe el resumen: es lo que se ve en la tarjeta.';
    if (!it.portada && !it.video && !it.archivos?.length) return 'Añade al menos una portada, un video o un archivo.';
    if (it.enlace?.url && !/^https?:\/\//i.test(it.enlace.url)) return 'El enlace tiene que empezar por http:// o https://';
    return '';
  };

  const guardarItem = async (publicar?: boolean) => {
    const e = validar();
    if (e) {
      setError(e);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setError('');
    setGuardando(true);
    const limpio: ItemRecurso = {
      ...it,
      titulo: it.titulo.trim(),
      publicado: publicar ?? it.publicado,
      participantes: (it.participantes ?? []).filter((p) => p.nombre.trim()),
      archivos: (it.archivos ?? []).filter((a) => a.url),
      enlace: it.enlace?.url ? { texto: it.enlace.texto || 'Más información', url: it.enlace.url } : undefined,
      cuerpo: it.cuerpo.filter((b) => !('texto' in b && !b.texto.trim())),
    };
    const nuevos = existente ? items.map((x) => (x.slug === existente.slug ? limpio : x)) : [limpio, ...items];
    try {
      await guardar('recursos', { ...maestro.recursos, [tipo]: nuevos }, `${existente ? 'Editó' : 'Creó'} «${limpio.titulo}» en ${pagina.titulo}`);
      marcarGuardado(limpio);
      avisar('ok', limpio.publicado ? 'Guardado y publicado.' : 'Borrador guardado.');
      if (esNuevo) navegar(`/recursos/${tipo}/${limpio.slug}`, { replace: true });
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
    navegar(`/recursos/${tipo}`);
  };

  return (
    <>
      <Cabecera
        titulo={`${esNuevo ? (tipo === 'entrevistas' ? 'Nueva' : 'Nuevo') : 'Editar'} ${nombre}`}
        chip={<Chip tono={it.publicado === false ? 'naranja' : 'verde'}>{it.publicado === false ? 'Borrador' : 'Publicado'}</Chip>}
        subtitulo={`${pagina.titulo} · ${sucio ? 'Hay cambios sin guardar.' : existente ? 'Todo guardado.' : 'Se guarda como borrador hasta que lo publiques.'}`}
        acciones={
          <>
            <Boton variante="fantasma" icono="arrow-left" onClick={volver}>
              Volver
            </Boton>
            {!esNuevo && (
              <EnlaceBoton to={`/recursos/${tipo}/${it.slug}?borrador=1`} externo icono="eye">
                Vista previa
              </EnlaceBoton>
            )}
            <Boton icono="save" cargando={guardando} onClick={() => guardarItem()}>
              Guardar
            </Boton>
            {it.publicado === false ? (
              <Boton variante="primario" icono="check" cargando={guardando} onClick={() => guardarItem(true)}>
                Guardar y publicar
              </Boton>
            ) : (
              <Boton variante="suave" icono="eye-off" cargando={guardando} onClick={() => guardarItem(false)}>
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
              <Entrada value={it.titulo} onChange={(e) => cambiarTitulo(e.target.value)} className="adm-entrada--grande" autoFocus={esNuevo} />
            </Campo>
            <Campo etiqueta="Subtítulo">
              <Entrada value={it.subtitulo ?? ''} onChange={(e) => cambiar('subtitulo', e.target.value)} placeholder="Una frase que amplía el título (opcional)" />
            </Campo>
            <Campo etiqueta="Resumen" obligatorio ayuda="Dos o tres líneas para la tarjeta de la lista.">
              <Area rows={3} value={it.resumen} onChange={(e) => cambiar('resumen', e.target.value)} />
            </Campo>
          </Tarjeta>

          {!esMaterial && (
            <Tarjeta titulo="Video">
              <CampoVideo etiqueta="Video" valor={it.video} onChange={(v) => cambiar('video', v)} ayuda="Sube el archivo o pega el enlace de YouTube / Vimeo. Para grabaciones largas, YouTube carga más rápido." />
            </Tarjeta>
          )}

          <Tarjeta titulo="Portada">
            <CampoImagen etiqueta="Foto de portada" valor={it.portada} alt={it.portadaAlt} onChange={(u, a) => setValor((x) => ({ ...x, portada: u, portadaAlt: a ?? x.portadaAlt }))} ayuda={it.video ? 'Si no pones portada se usa la del video.' : 'Horizontal, de al menos 1200 px.'} />
          </Tarjeta>

          {esMaterial && (
            <Tarjeta titulo="Archivos para descargar">
              <EditorArchivos lista={it.archivos ?? []} onChange={(a) => cambiar('archivos', a)} />
            </Tarjeta>
          )}

          <Tarjeta titulo={esMaterial ? 'Descripción' : 'Descripción y contenido'}>
            <EditorBloques bloques={it.cuerpo} onChange={(c) => cambiar('cuerpo', c)} />
          </Tarjeta>

          {!esMaterial && (
            <Tarjeta titulo={tipo === 'entrevistas' ? 'Participantes' : 'Ponentes'}>
              <EditorParticipantes lista={it.participantes ?? []} onChange={(p) => cambiar('participantes', p)} />
            </Tarjeta>
          )}

          {!esMaterial && (
            <Tarjeta titulo="Galería de fotos">
              <EditorGaleria piezas={it.galeria ?? []} onChange={(g) => cambiar('galeria', g)} uso={tipo} />
            </Tarjeta>
          )}

          {!esMaterial && (
            <Tarjeta titulo={esAgenda ? 'Archivos y materiales' : 'Archivos adjuntos'}>
              <EditorArchivos lista={it.archivos ?? []} onChange={(a) => cambiar('archivos', a)} />
            </Tarjeta>
          )}
        </div>

        <aside className="adm-editor__lateral">
          <Tarjeta titulo="Publicación">
            <Interruptor activo={it.publicado !== false} onChange={(v) => cambiar('publicado', v)} etiqueta="Visible en la web" descripcion={it.publicado === false ? 'Solo se ve en vista previa.' : `Aparece en Recursos › ${pagina.titulo}.`} />
            <Campo etiqueta="Categoría" ayuda="Las secciones que muestra la página de este recurso.">
              <Selector value={it.categoria} onChange={(e) => cambiar('categoria', e.target.value)}>
                {pagina.categorias.map((c) => (
                  <option key={c.label} value={c.label}>
                    {c.label}
                  </option>
                ))}
                {!pagina.categorias.some((c) => c.label === it.categoria) && it.categoria && <option value={it.categoria}>{it.categoria}</option>}
              </Selector>
            </Campo>
            <Campo etiqueta="Dirección (URL)" ayuda={`link-dicom.com/recursos/${tipo}/${it.slug || '…'}`}>
              <Entrada
                value={it.slug}
                onChange={(e) => {
                  setSlugManual(true);
                  cambiar('slug', slugificar(e.target.value));
                }}
              />
            </Campo>
          </Tarjeta>

          <Tarjeta titulo={esAgenda ? 'Cuándo y dónde' : 'Datos'}>
            <Campo etiqueta="Fecha" ayuda={esAgenda ? 'Con fecha futura aparece como «Próximo».' : undefined}>
              <Entrada type="date" value={it.fechaISO ?? ''} onChange={(e) => cambiar('fechaISO', e.target.value)} />
            </Campo>
            {esAgenda && (
              <Fila>
                <Campo etiqueta="Hora">
                  <Entrada value={it.hora ?? ''} onChange={(e) => cambiar('hora', e.target.value)} placeholder="10:00 a. m." />
                </Campo>
                <Campo etiqueta="Modalidad">
                  <Selector value={it.modalidad ?? ''} onChange={(e) => cambiar('modalidad', (e.target.value || undefined) as ItemRecurso['modalidad'])}>
                    <option value="">Sin indicar</option>
                    <option value="presencial">Presencial</option>
                    <option value="virtual">En línea</option>
                    <option value="hibrido">Híbrido</option>
                  </Selector>
                </Campo>
              </Fila>
            )}
            {(esAgenda || tipo === 'entrevistas') && (
              <Campo etiqueta="Lugar">
                <Entrada value={it.lugar ?? ''} onChange={(e) => cambiar('lugar', e.target.value)} placeholder={tipo === 'entrevistas' ? 'Medio o programa (opcional)' : 'Ciudad, sede o plataforma'} />
              </Campo>
            )}
            {!esMaterial && (
              <Campo etiqueta="Duración">
                <Entrada value={it.duracion ?? ''} onChange={(e) => cambiar('duracion', e.target.value)} placeholder="45 min" />
              </Campo>
            )}
          </Tarjeta>

          <Tarjeta titulo="Botón de enlace">
            <Campo etiqueta="Texto del botón">
              <Entrada value={it.enlace?.texto ?? ''} onChange={(e) => cambiar('enlace', { texto: e.target.value, url: it.enlace?.url ?? '' })} placeholder={esAgenda ? 'Inscribirme' : 'Más información'} />
            </Campo>
            <Campo etiqueta="Enlace" ayuda="Formulario de inscripción, página del evento, publicación… (opcional)">
              <Entrada value={it.enlace?.url ?? ''} onChange={(e) => cambiar('enlace', { texto: it.enlace?.texto ?? '', url: e.target.value })} placeholder="https://" />
            </Campo>
          </Tarjeta>
        </aside>
      </div>
    </>
  );
}
