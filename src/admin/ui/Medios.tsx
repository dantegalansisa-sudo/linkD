import { useCallback, useEffect, useRef, useState, type DragEvent } from 'react';
import Icon, { type IconName } from '../../components/ui/Icon';
import { get, post, subirArchivo, type Medio } from '../api';
import { mensajeDe, useEstado } from '../estado';
import { enlaceIncrustable, miniaturaVideo, tamanoLegible } from '../../contenido/formato';
import type { VideoRecurso } from '../../contenido/tipos';
import { Boton, Campo, Entrada, Buscador, Vacio, Pestanas, haceCuanto } from './Basicos';
import { Modal } from './Modal';

/* ============================================================
   Medios: subir, elegir de la biblioteca y los campos de foto,
   video y archivo que usan los editores
   ============================================================ */

export type TipoMedio = 'imagen' | 'video' | 'documento';

const ACEPTA: Record<TipoMedio, string> = {
  imagen: 'image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif',
  video: 'video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov,.m4v',
  documento: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.txt,.csv',
};

const NOMBRE_TIPO: Record<TipoMedio, string> = { imagen: 'foto', video: 'video', documento: 'archivo' };

const ICONO_TIPO: Record<TipoMedio, IconName> = { imagen: 'image', video: 'video', documento: 'file-text' };

/** Miniatura de un medio, sea foto, video o documento. */
export function Miniatura({ medio, className = '' }: { medio: Pick<Medio, 'tipo' | 'url' | 'mini' | 'extension' | 'nombre'>; className?: string }) {
  if (medio.tipo === 'imagen') {
    return <img src={medio.mini || medio.url} alt={medio.nombre} loading="lazy" className={`adm-mini ${className}`.trim()} />;
  }
  return (
    <span className={`adm-mini adm-mini--${medio.tipo} ${className}`.trim()}>
      <Icon name={ICONO_TIPO[medio.tipo]} size={24} strokeWidth={1.6} />
      <b>{(medio.extension || '').toUpperCase()}</b>
    </span>
  );
}

/* ---------- subida con progreso ---------- */

export interface Subida {
  id: number;
  nombre: string;
  fraccion: number;
  error?: string;
  medio?: Medio;
}

export function useSubida(uso = '') {
  const [subidas, setSubidas] = useState<Subida[]>([]);
  const contador = useRef(0);

  const subir = useCallback(
    async (archivo: File): Promise<Medio | null> => {
      const id = ++contador.current;
      setSubidas((s) => [...s, { id, nombre: archivo.name, fraccion: 0 }]);
      try {
        const medio = await subirArchivo(archivo, (f) => setSubidas((s) => s.map((x) => (x.id === id ? { ...x, fraccion: f } : x))), uso);
        setSubidas((s) => s.map((x) => (x.id === id ? { ...x, fraccion: 1, medio } : x)));
        window.setTimeout(() => setSubidas((s) => s.filter((x) => x.id !== id)), 1500);
        return medio;
      } catch (e) {
        setSubidas((s) => s.map((x) => (x.id === id ? { ...x, error: mensajeDe(e) } : x)));
        return null;
      }
    },
    [uso],
  );

  const quitar = useCallback((id: number) => setSubidas((s) => s.filter((x) => x.id !== id)), []);

  return { subidas, subir, quitar };
}

export function ListaSubidas({ subidas, onQuitar }: { subidas: Subida[]; onQuitar: (id: number) => void }) {
  if (!subidas.length) return null;
  return (
    <ul className="adm-subidas">
      {subidas.map((s) => (
        <li key={s.id} className={s.error ? 'is-error' : s.medio ? 'is-ok' : ''}>
          <span className="adm-subidas__nombre">{s.nombre}</span>
          {s.error ? (
            <>
              <span className="adm-subidas__error">{s.error}</span>
              <button type="button" onClick={() => onQuitar(s.id)} aria-label="Quitar">
                <Icon name="close" size={14} strokeWidth={2.2} />
              </button>
            </>
          ) : (
            <span className="adm-subidas__barra">
              <i style={{ transform: `scaleX(${s.fraccion})` }} />
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

/** Zona para soltar o elegir archivos. */
export function ZonaSubida({
  tipo,
  onArchivos,
  multiple,
  texto,
  compacta,
}: {
  tipo: TipoMedio;
  onArchivos: (archivos: File[]) => void;
  multiple?: boolean;
  texto?: string;
  compacta?: boolean;
}) {
  const [sobre, setSobre] = useState(false);
  const entrada = useRef<HTMLInputElement>(null);

  const soltar = (e: DragEvent) => {
    e.preventDefault();
    setSobre(false);
    const archivos = Array.from(e.dataTransfer.files);
    if (archivos.length) onArchivos(multiple ? archivos : archivos.slice(0, 1));
  };

  return (
    <div
      className={`adm-zona${sobre ? ' is-sobre' : ''}${compacta ? ' adm-zona--compacta' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setSobre(true);
      }}
      onDragLeave={() => setSobre(false)}
      onDrop={soltar}
      onClick={() => entrada.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') entrada.current?.click();
      }}
    >
      <input
        ref={entrada}
        type="file"
        accept={ACEPTA[tipo]}
        multiple={multiple}
        hidden
        onChange={(e) => {
          const archivos = Array.from(e.target.files ?? []);
          if (archivos.length) onArchivos(archivos);
          e.target.value = '';
        }}
      />
      <Icon name="upload" size={compacta ? 18 : 26} strokeWidth={1.8} />
      <b>{texto ?? `Arrastra ${multiple ? 'tus archivos' : `tu ${NOMBRE_TIPO[tipo]}`} aquí o haz clic para elegir`}</b>
      {!compacta && (
        <small>
          {tipo === 'imagen' && 'JPG, PNG o WebP. Se optimizan al subir.'}
          {tipo === 'video' && 'MP4 recomendado (también WebM y MOV). Hasta 1,5 GB, se sube por partes.'}
          {tipo === 'documento' && 'PDF, Word, Excel, PowerPoint o ZIP.'}
        </small>
      )}
    </div>
  );
}

/* ---------- selector: biblioteca + subir ---------- */

export function SelectorMedio({
  tipo,
  onElegir,
  onClose,
  multiple,
}: {
  tipo: TipoMedio;
  onElegir: (medios: Medio[]) => void;
  onClose: () => void;
  multiple?: boolean;
}) {
  const [pestana, setPestana] = useState<'subir' | 'biblioteca'>('subir');
  const [lista, setLista] = useState<Medio[] | null>(null);
  const [q, setQ] = useState('');
  const [seleccion, setSeleccion] = useState<Medio[]>([]);
  const { subidas, subir, quitar } = useSubida();
  const { avisar } = useEstado();
  const pendientes = useRef(0);
  const elegidos = useRef<Medio[]>([]);

  useEffect(() => {
    if (pestana !== 'biblioteca' || lista) return;
    get<{ medios: Medio[] }>('medios', { tipo })
      .then((r) => setLista(r.medios))
      .catch((e) => avisar('error', mensajeDe(e)));
  }, [pestana, lista, tipo, avisar]);

  const alSubir = async (archivos: File[]) => {
    pendientes.current += archivos.length;
    for (const a of archivos) {
      const m = await subir(a);
      if (m) elegidos.current.push(m);
      pendientes.current -= 1;
    }
    if (pendientes.current === 0 && elegidos.current.length) {
      onElegir(elegidos.current);
      elegidos.current = [];
    }
  };

  const filtrados = (lista ?? []).filter((m) => !q || m.nombre.toLowerCase().includes(q.toLowerCase()));

  const alternar = (m: Medio) => {
    if (!multiple) {
      onElegir([m]);
      return;
    }
    setSeleccion((s) => (s.some((x) => x.id === m.id) ? s.filter((x) => x.id !== m.id) : [...s, m]));
  };

  return (
    <Modal
      titulo={`Elegir ${NOMBRE_TIPO[tipo]}${multiple ? 's' : ''}`}
      onClose={onClose}
      ancho="860px"
      pie={
        multiple && pestana === 'biblioteca' ? (
          <>
            <span className="adm-modal__nota">{seleccion.length} seleccionad{seleccion.length === 1 ? 'o' : 'os'}</span>
            <Boton variante="primario" disabled={!seleccion.length} onClick={() => onElegir(seleccion)}>
              Añadir
            </Boton>
          </>
        ) : undefined
      }
    >
      <Pestanas
        valor={pestana}
        onChange={setPestana}
        opciones={[
          { clave: 'subir', label: 'Subir' },
          { clave: 'biblioteca', label: 'Biblioteca' },
        ]}
      />
      {pestana === 'subir' ? (
        <div className="adm-selector-subir">
          <ZonaSubida tipo={tipo} onArchivos={alSubir} multiple={multiple} />
          <ListaSubidas subidas={subidas} onQuitar={quitar} />
        </div>
      ) : (
        <div className="adm-selector-biblioteca">
          <Buscador valor={q} onChange={setQ} placeholder="Buscar por nombre…" />
          {lista === null ? (
            <p className="adm-cargando-texto">Cargando…</p>
          ) : filtrados.length === 0 ? (
            <Vacio icono={ICONO_TIPO[tipo]} titulo="Todavía no hay nada aquí" texto="Sube el primero desde la pestaña Subir." />
          ) : (
            <ul className="adm-rejilla-medios adm-rejilla-medios--elegir">
              {filtrados.map((m) => {
                const sel = seleccion.some((x) => x.id === m.id);
                return (
                  <li key={m.id}>
                    <button type="button" className={`adm-medio${sel ? ' is-seleccionado' : ''}`} onClick={() => alternar(m)} title={m.nombre}>
                      <Miniatura medio={m} />
                      <span className="adm-medio__nombre">{m.nombre}</span>
                      <small>
                        {tamanoLegible(m.tamano)}
                        {m.ancho ? ` · ${m.ancho}×${m.alto}` : ''}
                      </small>
                      {sel && (
                        <span className="adm-medio__check">
                          <Icon name="check" size={13} strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </Modal>
  );
}

/* ---------- campo de foto ---------- */

export function CampoImagen({
  etiqueta,
  valor,
  alt,
  onChange,
  ayuda,
  proporcion = '16 / 9',
  obligatorio,
  conAlt = true,
  compacto,
}: {
  etiqueta: string;
  valor: string;
  alt?: string;
  onChange: (url: string, alt?: string) => void;
  ayuda?: string;
  proporcion?: string;
  obligatorio?: boolean;
  conAlt?: boolean;
  compacto?: boolean;
}) {
  const [abierto, setAbierto] = useState(false);
  const { subidas, subir, quitar } = useSubida();

  const alSoltar = async (archivos: File[]) => {
    const m = await subir(archivos[0]);
    if (m) onChange(m.url, alt);
  };

  return (
    <div className={`adm-campo-imagen${compacto ? ' adm-campo-imagen--compacto' : ''}`}>
      <span className="adm-campo__etiqueta">
        {etiqueta}
        {obligatorio && <em aria-hidden="true">*</em>}
      </span>
      {valor ? (
        <div className="adm-campo-imagen__vista" style={{ aspectRatio: proporcion }}>
          <img src={valor} alt={alt ?? ''} />
          <div className="adm-campo-imagen__acciones">
            <Boton pequeno icono="refresh" onClick={() => setAbierto(true)}>
              Cambiar
            </Boton>
            <Boton pequeno variante="peligro" icono="trash" onClick={() => onChange('', alt)}>
              Quitar
            </Boton>
          </div>
        </div>
      ) : (
        <div className="adm-campo-imagen__vacio">
          <ZonaSubida tipo="imagen" onArchivos={alSoltar} compacta texto="Arrastra una foto o haz clic para subirla" />
          <Boton pequeno variante="suave" icono="folder" onClick={() => setAbierto(true)}>
            Elegir de la biblioteca
          </Boton>
        </div>
      )}
      <ListaSubidas subidas={subidas} onQuitar={quitar} />
      {conAlt && (
        <Entrada
          value={alt ?? ''}
          onChange={(e) => onChange(valor, e.target.value)}
          placeholder="Descripción de la foto (para accesibilidad y buscadores)"
          aria-label="Descripción de la foto"
        />
      )}
      {ayuda && <span className="adm-campo__ayuda">{ayuda}</span>}
      {abierto && (
        <SelectorMedio
          tipo="imagen"
          onClose={() => setAbierto(false)}
          onElegir={(m) => {
            onChange(m[0].url, alt);
            setAbierto(false);
          }}
        />
      )}
    </div>
  );
}

/* ---------- captura de fotograma para la portada de un video ---------- */

export function CapturaFotograma({ src, onPoster }: { src: string; onPoster: (url: string) => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const [listo, setListo] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [falla, setFalla] = useState(false);
  const { avisar } = useEstado();

  const capturar = async () => {
    const v = video.current;
    if (!v) return;
    setOcupado(true);
    try {
      const lienzo = document.createElement('canvas');
      lienzo.width = v.videoWidth;
      lienzo.height = v.videoHeight;
      lienzo.getContext('2d')?.drawImage(v, 0, 0);
      const blob = await new Promise<Blob | null>((res) => lienzo.toBlob(res, 'image/jpeg', 0.88));
      if (!blob) throw new Error('No se pudo capturar el fotograma.');
      const archivo = new File([blob], 'portada-video.jpg', { type: 'image/jpeg' });
      const m = await subirArchivo(archivo, undefined, 'poster');
      onPoster(m.url);
      avisar('ok', 'Portada capturada del video.');
    } catch (e) {
      avisar('error', mensajeDe(e));
    } finally {
      setOcupado(false);
    }
  };

  return (
    <div className="adm-captura">
      <video
        ref={video}
        src={src}
        controls
        muted
        playsInline
        preload="metadata"
        crossOrigin="anonymous"
        onLoadedData={() => setListo(true)}
        onError={() => setFalla(true)}
      />
      {falla ? (
        <small>Este navegador no puede reproducir el archivo aquí; sube la portada como foto.</small>
      ) : (
        <div className="adm-captura__acciones">
          <small>Mueve el video hasta el momento que quieras usar de portada.</small>
          <Boton pequeno variante="primario" icono="image" disabled={!listo} cargando={ocupado} onClick={capturar}>
            Usar este fotograma como portada
          </Boton>
        </div>
      )}
    </div>
  );
}

/* ---------- campo de video (archivo o enlace) ---------- */

export function CampoVideo({
  etiqueta,
  valor,
  onChange,
  soloArchivo,
  ayuda,
}: {
  etiqueta: string;
  valor?: VideoRecurso;
  onChange: (v?: VideoRecurso) => void;
  soloArchivo?: boolean;
  ayuda?: string;
}) {
  const [abierto, setAbierto] = useState(false);
  const [enlace, setEnlace] = useState(valor && valor.origen !== 'archivo' ? valor.src : '');
  const { subidas, subir, quitar } = useSubida();
  const hayVideo = !!valor?.src;

  const alSoltar = async (archivos: File[]) => {
    const m = await subir(archivos[0]);
    if (m) onChange({ origen: 'archivo', src: m.url, poster: valor?.poster });
  };

  const aplicarEnlace = () => {
    const e = enlaceIncrustable(enlace);
    if (!e) return;
    onChange({ origen: e.origen, src: enlace.trim(), poster: valor?.poster });
  };

  return (
    <div className="adm-campo-video">
      <span className="adm-campo__etiqueta">{etiqueta}</span>

      {hayVideo ? (
        <div className="adm-campo-video__actual">
          {valor!.origen === 'archivo' ? (
            <CapturaFotograma src={valor!.src} onPoster={(p) => onChange({ ...valor!, poster: p })} />
          ) : (
            <div className="adm-campo-video__enlace">
              <img src={valor!.poster || miniaturaVideo(valor!.src) || ''} alt="" />
              <span>
                <b>{valor!.origen === 'youtube' ? 'YouTube' : 'Vimeo'}</b>
                <small>{valor!.src}</small>
              </span>
            </div>
          )}
          <div className="adm-campo-video__acciones">
            <Boton pequeno variante="peligro" icono="trash" onClick={() => onChange(undefined)}>
              Quitar video
            </Boton>
          </div>
        </div>
      ) : (
        <div className="adm-campo-video__vacio">
          <ZonaSubida tipo="video" onArchivos={alSoltar} compacta texto="Arrastra un video o haz clic para subirlo" />
          <div className="adm-campo-video__o">
            <Boton pequeno variante="suave" icono="folder" onClick={() => setAbierto(true)}>
              Elegir de la biblioteca
            </Boton>
            {!soloArchivo && (
              <div className="adm-campo-video__url">
                <Entrada value={enlace} onChange={(e) => setEnlace(e.target.value)} placeholder="o pega un enlace de YouTube / Vimeo" aria-label="Enlace de YouTube o Vimeo" />
                <Boton pequeno icono="link" disabled={!enlaceIncrustable(enlace)} onClick={aplicarEnlace}>
                  Usar enlace
                </Boton>
              </div>
            )}
          </div>
        </div>
      )}
      <ListaSubidas subidas={subidas} onQuitar={quitar} />

      {hayVideo && (
        <CampoImagen
          etiqueta="Portada del video"
          valor={valor!.poster ?? ''}
          onChange={(u) => onChange({ ...valor!, poster: u })}
          conAlt={false}
          compacto
          ayuda={valor!.origen === 'archivo' ? 'Se muestra antes de reproducir. Puedes capturarla del propio video.' : 'Opcional: si no subes ninguna se usa la miniatura del enlace.'}
        />
      )}
      {ayuda && <span className="adm-campo__ayuda">{ayuda}</span>}

      {abierto && (
        <SelectorMedio
          tipo="video"
          onClose={() => setAbierto(false)}
          onElegir={(m) => {
            onChange({ origen: 'archivo', src: m[0].url, poster: valor?.poster });
            setAbierto(false);
          }}
        />
      )}
    </div>
  );
}

/* ---------- campo de un archivo descargable ---------- */

export function BotonElegirMedio({ tipo, onElegir, multiple, children, variante = 'suave', icono = 'folder' }: { tipo: TipoMedio; onElegir: (m: Medio[]) => void; multiple?: boolean; children: React.ReactNode; variante?: 'suave' | 'secundario' | 'primario'; icono?: IconName }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <>
      <Boton pequeno variante={variante} icono={icono} onClick={() => setAbierto(true)}>
        {children}
      </Boton>
      {abierto && (
        <SelectorMedio
          tipo={tipo}
          multiple={multiple}
          onClose={() => setAbierto(false)}
          onElegir={(m) => {
            onElegir(m);
            setAbierto(false);
          }}
        />
      )}
    </>
  );
}

/** Nombre legible de un medio para las listas del panel. */
export function etiquetaMedio(m: Medio): string {
  return `${m.nombre} · ${tamanoLegible(m.tamano)} · ${haceCuanto(m.fecha)}`;
}

/** Elimina un medio de la biblioteca (si no esta en uso). */
export async function eliminarMedio(id: string): Promise<void> {
  await post('medios', { id }, { accion: 'eliminar' });
}

export function usaCampo(etiqueta: string, valor: string, onChange: (v: string) => void, placeholder?: string) {
  return (
    <Campo etiqueta={etiqueta}>
      <Entrada value={valor} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </Campo>
  );
}
