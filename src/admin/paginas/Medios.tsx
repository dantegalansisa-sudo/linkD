import { useCallback, useEffect, useState } from 'react';
import Icon from '../../components/ui/Icon';
import { get, post, type Medio } from '../api';
import { tamanoLegible } from '../../contenido/formato';
import { mensajeDe, useEstado } from '../estado';
import { Boton, Buscador, Cabecera, Campo, Entrada, Pestanas, Vacio, fechaHora } from '../ui/Basicos';
import { ListaSubidas, Miniatura, ZonaSubida, eliminarMedio, useSubida, type TipoMedio } from '../ui/Medios';
import { Modal, useConfirmar } from '../ui/Modal';

type Filtro = 'todos' | TipoMedio;

/** Biblioteca: todo lo subido, con subida directa, vista, renombrado y borrado. */
export default function Medios() {
  const { avisar } = useEstado();
  const confirmar = useConfirmar();
  const [lista, setLista] = useState<Medio[] | null>(null);
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [q, setQ] = useState('');
  const [abierto, setAbierto] = useState<Medio | null>(null);
  const [nombre, setNombre] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const { subidas, subir, quitar } = useSubida();

  const cargar = useCallback(() => {
    get<{ medios: Medio[] }>('medios')
      .then((r) => setLista(r.medios))
      .catch((e) => avisar('error', mensajeDe(e)));
  }, [avisar]);

  useEffect(cargar, [cargar]);

  const alSoltar = async (archivos: File[]) => {
    let alguno = false;
    for (const a of archivos) {
      const m = await subir(a);
      if (m) alguno = true;
    }
    if (alguno) {
      cargar();
      avisar('ok', archivos.length === 1 ? 'Archivo subido.' : 'Archivos subidos.');
    }
  };

  const eliminar = async (m: Medio) => {
    const ok = await confirmar({ titulo: 'Eliminar el archivo', texto: `«${m.nombre}» se borrará del servidor. Si se usa en alguna página, no se podrá eliminar.`, confirmar: 'Eliminar', peligro: true });
    if (!ok) return;
    setOcupado(true);
    try {
      await eliminarMedio(m.id);
      setLista((l) => (l ? l.filter((x) => x.id !== m.id) : l));
      setAbierto(null);
      avisar('ok', 'Archivo eliminado.');
    } catch (e) {
      avisar('error', mensajeDe(e));
    } finally {
      setOcupado(false);
    }
  };

  const renombrar = async () => {
    if (!abierto || !nombre.trim()) return;
    setOcupado(true);
    try {
      const r = await post<{ medio: Medio }>('medios', { id: abierto.id, nombre: nombre.trim() }, { accion: 'renombrar' });
      setLista((l) => (l ? l.map((x) => (x.id === r.medio.id ? r.medio : x)) : l));
      setAbierto(r.medio);
      avisar('ok', 'Nombre guardado.');
    } catch (e) {
      avisar('error', mensajeDe(e));
    } finally {
      setOcupado(false);
    }
  };

  const copiar = async (url: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${url}`);
      avisar('ok', 'Enlace copiado.');
    } catch {
      avisar('error', 'No se pudo copiar. Selecciona el enlace y cópialo a mano.');
    }
  };

  const filtrados = (lista ?? []).filter((m) => (filtro === 'todos' || m.tipo === filtro) && (!q || m.nombre.toLowerCase().includes(q.toLowerCase())));
  const cuenta = (t: TipoMedio) => (lista ?? []).filter((m) => m.tipo === t).length;

  return (
    <>
      <Cabecera titulo="Biblioteca de medios" subtitulo="Todas las fotos, videos y documentos subidos desde el panel. Desde aquí puedes subir varios de golpe para usarlos después." />

      <ZonaSubida tipo="imagen" multiple onArchivos={alSoltar} texto="Arrastra fotos, videos o documentos aquí, o haz clic para elegirlos" />
      <ListaSubidas subidas={subidas} onQuitar={quitar} />

      <div className="adm-barra">
        <Pestanas
          valor={filtro}
          onChange={setFiltro}
          opciones={[
            { clave: 'todos', label: 'Todo', total: lista?.length ?? 0 },
            { clave: 'imagen', label: 'Fotos', total: cuenta('imagen') },
            { clave: 'video', label: 'Videos', total: cuenta('video') },
            { clave: 'documento', label: 'Documentos', total: cuenta('documento') },
          ]}
        />
        <Buscador valor={q} onChange={setQ} placeholder="Buscar por nombre…" />
      </div>

      {lista === null ? (
        <p className="adm-cargando-texto">Cargando…</p>
      ) : filtrados.length === 0 ? (
        <Vacio icono="folder" titulo={q ? 'Nada coincide' : 'La biblioteca está vacía'} texto={q ? undefined : 'Sube el primer archivo con la zona de arriba.'} />
      ) : (
        <ul className="adm-rejilla-medios">
          {filtrados.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                className="adm-medio"
                onClick={() => {
                  setAbierto(m);
                  setNombre(m.nombre);
                }}
                title={m.nombre}
              >
                <Miniatura medio={m} />
                <span className="adm-medio__nombre">{m.nombre}</span>
                <small>
                  {tamanoLegible(m.tamano)}
                  {m.ancho ? ` · ${m.ancho}×${m.alto}` : ''}
                </small>
              </button>
            </li>
          ))}
        </ul>
      )}

      {abierto && (
        <Modal
          titulo={abierto.nombre}
          onClose={() => setAbierto(null)}
          ancho="760px"
          pie={
            <>
              <Boton variante="peligro" icono="trash" cargando={ocupado} onClick={() => eliminar(abierto)}>
                Eliminar
              </Boton>
              <span className="adm-modal__hueco" />
              <Boton icono="copy" onClick={() => copiar(abierto.url)}>
                Copiar enlace
              </Boton>
              <a className="adm-boton adm-boton--secundario" href={abierto.url} target="_blank" rel="noreferrer">
                <Icon name="external-link" size={17} strokeWidth={2} />
                Abrir
              </a>
            </>
          }
        >
          <div className="adm-medio-detalle">
            <div className="adm-medio-detalle__vista">
              {abierto.tipo === 'imagen' && <img src={abierto.url} alt={abierto.nombre} />}
              {abierto.tipo === 'video' && <video src={abierto.url} controls playsInline preload="metadata" />}
              {abierto.tipo === 'documento' && (
                <span className="adm-medio-detalle__doc">
                  <Icon name="file-text" size={40} strokeWidth={1.4} />
                  {abierto.extension.toUpperCase()}
                </span>
              )}
            </div>
            <div className="adm-medio-detalle__datos">
              <Campo etiqueta="Nombre">
                <span className="adm-campo-con-boton">
                  <Entrada value={nombre} onChange={(e) => setNombre(e.target.value)} />
                  <Boton pequeno icono="save" cargando={ocupado} onClick={renombrar} disabled={nombre.trim() === abierto.nombre}>
                    Guardar
                  </Boton>
                </span>
              </Campo>
              <dl className="adm-datos">
                <dt>Tipo</dt>
                <dd>
                  {abierto.tipo === 'imagen' ? 'Foto' : abierto.tipo === 'video' ? 'Video' : 'Documento'} {abierto.extension.toUpperCase()}
                </dd>
                <dt>Tamaño</dt>
                <dd>{tamanoLegible(abierto.tamano)}</dd>
                {abierto.ancho && (
                  <>
                    <dt>Medidas</dt>
                    <dd>
                      {abierto.ancho} × {abierto.alto} px
                    </dd>
                  </>
                )}
                <dt>Subido</dt>
                <dd>
                  {fechaHora(abierto.fecha)}
                  {abierto.usuario ? ` por ${abierto.usuario}` : ''}
                </dd>
                <dt>Enlace</dt>
                <dd className="adm-datos__url">{abierto.url}</dd>
              </dl>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
