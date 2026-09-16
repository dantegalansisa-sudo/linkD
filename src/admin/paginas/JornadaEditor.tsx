import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { hoyISO, slugificar } from '../../contenido/formato';
import { ICONOS_CIFRAS, type Jornada } from '../../contenido/tipos';
import type { IconName } from '../../components/ui/Icon';
import { mensajeDe, useEstado, useMaestro } from '../estado';
import { Area, AvisoEnLinea, Boton, Cabecera, Campo, Chip, EnlaceBoton, Entrada, Interruptor, Selector, Tarjeta } from '../ui/Basicos';
import { EditorCifras, EditorGaleria, Fila, ListaTexto } from '../ui/Editores';
import { CampoImagen, CampoVideo } from '../ui/Medios';
import { useConfirmar } from '../ui/Modal';
import { useCambios } from '../ui/useCambios';

function nueva(): Jornada {
  return {
    slug: '',
    miga: '',
    titulo: '',
    tituloCorto: '',
    fechaISO: hoyISO(),
    lugar: '',
    resumen: '',
    descripcion: '',
    portada: '',
    portadaAlt: '',
    video: undefined,
    galeriaTexto: '',
    galeria: [],
    nota: undefined,
    iniciativa: undefined,
    agradecimiento: undefined,
    cifras: [
      { icon: 'users', valor: '', label: 'Familias beneficiadas' },
      { icon: 'handshake', valor: '', label: 'Colaboradores voluntarios' },
    ],
    publicado: false,
  };
}

/** Editor de una jornada realizada del Programa Virginia Toca. */
export default function JornadaEditor() {
  const { slug } = useParams();
  const navegar = useNavigate();
  const maestro = useMaestro();
  const { guardar, avisar } = useEstado();
  const confirmar = useConfirmar();

  const os = maestro.obraSocial;
  const esNueva = slug === 'nueva';
  const existente = esNueva ? undefined : os.jornadas.find((j) => j.slug === slug);

  const { valor: j, setValor, cambiar, sucio, marcarGuardado } = useCambios<Jornada>(existente ?? nueva());
  const [slugManual, setSlugManual] = useState(!esNueva);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  if (!esNueva && !existente) return <Navigate to="/obra-social?pestana=jornadas" replace />;

  const cambiarTitulo = (t: string) => setValor((x) => ({ ...x, titulo: t, slug: slugManual ? x.slug : slugificar(t), miga: x.miga || t.slice(0, 40) }));

  const validar = (): string => {
    if (!j.titulo.trim()) return 'Escribe el título de la jornada.';
    if (!j.slug.trim()) return 'Falta la dirección (se genera sola a partir del título).';
    if (os.jornadas.some((x) => x.slug === j.slug && x.slug !== existente?.slug)) return 'Ya hay otra jornada con esa misma dirección.';
    if (!j.fechaISO) return 'Elige la fecha.';
    if (!j.resumen.trim()) return 'Escribe el resumen de la jornada.';
    if (!j.portada) return 'Añade una foto de portada.';
    return '';
  };

  const guardarJornada = async (publicar?: boolean) => {
    const e = validar();
    if (e) {
      setError(e);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setError('');
    setGuardando(true);
    const limpia: Jornada = {
      ...j,
      titulo: j.titulo.trim(),
      tituloCorto: j.tituloCorto?.trim() || undefined,
      descripcion: j.descripcion?.trim() || undefined,
      miga: j.miga.trim() || j.titulo.trim().slice(0, 40),
      publicado: publicar ?? j.publicado,
      video: j.video?.src ? j.video : undefined,
      nota: j.nota?.titulo?.trim() ? j.nota : undefined,
      iniciativa: j.iniciativa?.titulo?.trim() ? { ...j.iniciativa, parrafos: j.iniciativa.parrafos.filter((p) => p.trim()) } : undefined,
      agradecimiento: j.agradecimiento?.nombre?.trim() ? { ...j.agradecimiento, parrafos: j.agradecimiento.parrafos.filter((p) => p.trim()) } : undefined,
      cifras: j.cifras.filter((c) => c.valor.trim() && c.label.trim()),
    };
    const lista = existente ? os.jornadas.map((x) => (x.slug === existente.slug ? limpia : x)) : [limpia, ...os.jornadas];
    try {
      await guardar('obraSocial', { ...os, jornadas: lista }, `${existente ? 'Editó' : 'Creó'} la jornada «${limpia.titulo}»`);
      marcarGuardado(limpia);
      avisar('ok', limpia.publicado ? 'Jornada guardada y publicada.' : 'Borrador guardado.');
      if (esNueva) navegar(`/obra-social/jornadas/${limpia.slug}`, { replace: true });
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
    navegar('/obra-social?pestana=jornadas');
  };

  const nota = j.nota ?? { icon: 'graduation' as IconName, titulo: '', texto: '' };
  const iniciativa = j.iniciativa ?? { titulo: 'Una iniciativa que nace desde LINKDICOM', parrafos: [''] };
  const gracias = j.agradecimiento ?? { logo: '', logoAlt: '', nombre: '', parrafos: [''], fotos: [], cierre: '' };

  return (
    <>
      <Cabecera
        titulo={esNueva ? 'Nueva jornada realizada' : 'Editar jornada'}
        chip={<Chip tono={j.publicado === false ? 'naranja' : 'verde'}>{j.publicado === false ? 'Borrador' : 'Publicada'}</Chip>}
        subtitulo={sucio ? 'Hay cambios sin guardar.' : existente ? 'Todo guardado.' : 'Se guarda como borrador hasta que la publiques.'}
        acciones={
          <>
            <Boton variante="fantasma" icono="arrow-left" onClick={volver}>
              Volver
            </Boton>
            {!esNueva && (
              <EnlaceBoton to={`/empresa/obra-social/${j.slug}?borrador=1`} externo icono="eye">
                Vista previa
              </EnlaceBoton>
            )}
            <Boton icono="save" cargando={guardando} onClick={() => guardarJornada()}>
              Guardar
            </Boton>
            {j.publicado === false ? (
              <Boton variante="primario" icono="check" cargando={guardando} onClick={() => guardarJornada(true)}>
                Guardar y publicar
              </Boton>
            ) : (
              <Boton variante="suave" icono="eye-off" cargando={guardando} onClick={() => guardarJornada(false)}>
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
            <Campo etiqueta="Título" obligatorio ayuda="Por ejemplo: «Ayuda Yaguate – Cena Navideña 24 Dic. 2025».">
              <Entrada value={j.titulo} onChange={(e) => cambiarTitulo(e.target.value)} className="adm-entrada--grande" autoFocus={esNueva} />
            </Campo>
            <Campo etiqueta="Resumen" obligatorio ayuda="Se lee bajo el título, junto al video.">
              <Area rows={3} value={j.resumen} onChange={(e) => cambiar('resumen', e.target.value)} />
            </Campo>
          </Tarjeta>

          <Tarjeta titulo="Tarjeta en «Últimos eventos de ayuda»">
            <p className="adm-texto-suave">Lo que se ve en la lista de la página de Obra social. Si lo dejas vacío, se usa el título y el resumen de arriba.</p>
            <Campo etiqueta="Título corto">
              <Entrada value={j.tituloCorto ?? ''} onChange={(e) => cambiar('tituloCorto', e.target.value)} placeholder="Entrega de cenas navideñas" />
            </Campo>
            <Campo etiqueta="Texto de la tarjeta">
              <Area rows={3} value={j.descripcion ?? ''} onChange={(e) => cambiar('descripcion', e.target.value)} placeholder="Qué se entregó, a quién y dónde, en dos o tres líneas." />
            </Campo>
          </Tarjeta>

          <Tarjeta titulo="Video resumen">
            <CampoVideo etiqueta="Video" soloArchivo valor={j.video ? { origen: 'archivo', ...j.video } : undefined} onChange={(v) => cambiar('video', v ? { src: v.src, poster: v.poster ?? '' } : undefined)} ayuda="Si no hay video, se muestra la portada en su lugar." />
          </Tarjeta>

          <Tarjeta titulo="Dato destacado" acciones={j.nota && <Boton pequeno variante="fantasma" icono="trash" onClick={() => cambiar('nota', undefined)}>Quitar</Boton>}>
            <p className="adm-texto-suave">Una cifra o un hecho que se resalta bajo el video, como «50 mochilas entregadas».</p>
            <div className="adm-nota-editor">
              <Selector value={nota.icon} onChange={(e) => cambiar('nota', { ...nota, icon: e.target.value as IconName })} aria-label="Icono">
                {ICONOS_CIFRAS.map((o) => (
                  <option key={o.icon} value={o.icon}>
                    {o.label}
                  </option>
                ))}
              </Selector>
              <Entrada value={nota.titulo} onChange={(e) => cambiar('nota', { ...nota, titulo: e.target.value })} placeholder="50 mochilas entregadas" />
            </div>
            <Area rows={2} value={nota.texto} onChange={(e) => cambiar('nota', { ...nota, texto: e.target.value })} placeholder="Cada mochila incluyó cuadernos, lápices…" />
          </Tarjeta>

          <Tarjeta titulo="Galería de fotos y videos">
            <Campo etiqueta="Texto de la galería">
              <Area rows={2} value={j.galeriaTexto} onChange={(e) => cambiar('galeriaTexto', e.target.value)} placeholder="Las imágenes de la jornada…" />
            </Campo>
            <EditorGaleria piezas={j.galeria} onChange={(g) => cambiar('galeria', g)} uso="obra-social" />
          </Tarjeta>

          <Tarjeta titulo="Quién impulsó la jornada" acciones={j.iniciativa && <Boton pequeno variante="fantasma" icono="trash" onClick={() => cambiar('iniciativa', undefined)}>Quitar</Boton>}>
            <Campo etiqueta="Título">
              <Entrada value={iniciativa.titulo} onChange={(e) => cambiar('iniciativa', { ...iniciativa, titulo: e.target.value })} />
            </Campo>
            <Campo etiqueta="Párrafos">
              <ListaTexto items={iniciativa.parrafos} onChange={(p) => cambiar('iniciativa', { ...iniciativa, parrafos: p })} multilinea placeholder="Quién tuvo la iniciativa y quién ayudó" anadir="Añadir párrafo" />
            </Campo>
          </Tarjeta>

          <Tarjeta titulo="Agradecimiento especial" acciones={j.agradecimiento && <Boton pequeno variante="fantasma" icono="trash" onClick={() => cambiar('agradecimiento', undefined)}>Quitar</Boton>}>
            <p className="adm-texto-suave">Empresa o persona que hizo posible la jornada. Si lo dejas vacío, en su lugar se invita a colaborar en la siguiente.</p>
            <Fila>
              <Campo etiqueta="Nombre">
                <Entrada value={gracias.nombre} onChange={(e) => cambiar('agradecimiento', { ...gracias, nombre: e.target.value, logoAlt: gracias.logoAlt || `Logotipo de ${e.target.value}` })} placeholder="Supermercados Aprezio" />
              </Campo>
              <CampoImagen etiqueta="Logotipo" valor={gracias.logo} onChange={(u) => cambiar('agradecimiento', { ...gracias, logo: u })} conAlt={false} compacto proporcion="3 / 1" />
            </Fila>
            <Campo etiqueta="Párrafos">
              <ListaTexto items={gracias.parrafos} onChange={(p) => cambiar('agradecimiento', { ...gracias, parrafos: p })} multilinea placeholder="Nuestro especial agradecimiento a…" anadir="Añadir párrafo" />
            </Campo>
            <Campo etiqueta="Frase de cierre">
              <Area rows={2} value={gracias.cierre} onChange={(e) => cambiar('agradecimiento', { ...gracias, cierre: e.target.value })} placeholder="¡Gracias por ser parte de esta causa!" />
            </Campo>
            <Campo etiqueta="Dos fotos del agradecimiento" ayuda="Se muestran pequeñas bajo el texto.">
              <div className="adm-fotos-dos">
                {[0, 1].map((k) => (
                  <CampoImagen
                    key={k}
                    etiqueta={`Foto ${k + 1}`}
                    valor={gracias.fotos[k] ?? ''}
                    onChange={(u) => {
                      const fotos = [...gracias.fotos];
                      fotos[k] = u;
                      cambiar('agradecimiento', { ...gracias, fotos: fotos.filter(Boolean) });
                    }}
                    conAlt={false}
                    compacto
                    proporcion="4 / 3"
                  />
                ))}
              </div>
            </Campo>
          </Tarjeta>

          <Tarjeta titulo="Cifras de esta jornada">
            <EditorCifras cifras={j.cifras} onChange={(c) => cambiar('cifras', c)} />
          </Tarjeta>
        </div>

        <aside className="adm-editor__lateral">
          <Tarjeta titulo="Publicación">
            <Interruptor activo={j.publicado !== false} onChange={(v) => cambiar('publicado', v)} etiqueta="Visible en la web" descripcion={j.publicado === false ? 'Solo se ve en vista previa.' : 'Aparece en «Últimos eventos de ayuda».'} />
            <Campo etiqueta="Fecha de la jornada" obligatorio>
              <Entrada type="date" value={j.fechaISO} onChange={(e) => cambiar('fechaISO', e.target.value)} />
            </Campo>
            <Campo etiqueta="Lugar">
              <Entrada value={j.lugar} onChange={(e) => cambiar('lugar', e.target.value)} placeholder="Yaguate, San Cristóbal" />
            </Campo>
            <Campo etiqueta="Nombre corto" ayuda="Para la ruta de navegación de la página («Cena Navideña 2025»).">
              <Entrada value={j.miga} onChange={(e) => cambiar('miga', e.target.value)} />
            </Campo>
            <Campo etiqueta="Dirección (URL)" ayuda={`link-dicom.com/empresa/obra-social/${j.slug || '…'}`}>
              <Entrada
                value={j.slug}
                onChange={(e) => {
                  setSlugManual(true);
                  cambiar('slug', slugificar(e.target.value));
                }}
              />
            </Campo>
          </Tarjeta>

          <Tarjeta titulo="Portada">
            <CampoImagen etiqueta="Foto de portada" valor={j.portada} alt={j.portadaAlt} onChange={(u, a) => setValor((x) => ({ ...x, portada: u, portadaAlt: a ?? x.portadaAlt }))} proporcion="4 / 3" obligatorio ayuda="Se usa en la lista de jornadas y, si no hay video, en la página." />
          </Tarjeta>
        </aside>
      </div>
    </>
  );
}
