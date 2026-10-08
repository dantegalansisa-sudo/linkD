import { useState } from 'react';
import Icon from '../../components/ui/Icon';
import { mensajeDe, useEstado, useMaestro } from '../estado';
import { Boton, Cabecera, Campo, Entrada, Selector, Vacio } from '../ui/Basicos';
import { Modal } from '../ui/Modal';

/*
  Categorias de las noticias: nombre y color de la etiqueta. Renombrar o
  borrar una categoria cambia tambien las noticias que la usan, en el mismo
  guardado (guardarVarias), para que nunca quede una noticia con una
  categoria que ya no existe.
*/

export const COLORES_CATEGORIA = ['#0f8a5f', '#2563eb', '#6d5bd0', '#ff6a13', '#dc2626', '#0891b2', '#7c3aed', '#ca8a04', '#db2777', '#475569'];

type Edicion = { original: string | null; nombre: string; color: string };

export default function NoticiasCategorias() {
  const maestro = useMaestro();
  const { guardarVarias, avisar } = useEstado();
  const [edicion, setEdicion] = useState<Edicion | null>(null);
  const [borrando, setBorrando] = useState<{ nombre: string; destino: string } | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const categorias = Object.entries(maestro.categoriasNoticias);
  const usos = (c: string) => maestro.noticias.filter((n) => n.categoria === c).length;

  const guardarEdicion = async () => {
    if (!edicion) return;
    const nombre = edicion.nombre.trim();
    if (!nombre) {
      setError('Escribe el nombre de la categoría.');
      return;
    }
    if (nombre !== edicion.original && maestro.categoriasNoticias[nombre]) {
      setError('Ya hay una categoría con ese nombre.');
      return;
    }
    setGuardando(true);
    setError('');
    // se conserva el orden: la renombrada queda en su sitio
    const nuevas: Record<string, string> = {};
    if (edicion.original === null) {
      Object.assign(nuevas, maestro.categoriasNoticias, { [nombre]: edicion.color });
    } else {
      for (const [c, color] of categorias) {
        if (c === edicion.original) nuevas[nombre] = edicion.color;
        else nuevas[c] = color;
      }
    }
    const noticias = maestro.noticias.map((n) => (edicion.original !== null && n.categoria === edicion.original ? { ...n, categoria: nombre, color: edicion.color } : n));
    try {
      await guardarVarias(
        edicion.original === null ? { categoriasNoticias: nuevas } : { categoriasNoticias: nuevas, noticias },
        edicion.original === null ? `Creó la categoría «${nombre}»` : `Editó la categoría «${edicion.original}»${nombre !== edicion.original ? ` (ahora «${nombre}»)` : ''}`,
      );
      avisar('ok', edicion.original === null ? 'Categoría creada.' : 'Categoría actualizada.');
      setEdicion(null);
    } catch (e) {
      setError(mensajeDe(e));
    } finally {
      setGuardando(false);
    }
  };

  const confirmarBorrado = async () => {
    if (!borrando) return;
    const { nombre, destino } = borrando;
    const n = usos(nombre);
    if (n > 0 && !destino) {
      setError('Elige a qué categoría pasan sus noticias.');
      return;
    }
    setGuardando(true);
    setError('');
    const nuevas = Object.fromEntries(categorias.filter(([c]) => c !== nombre));
    const noticias = maestro.noticias.map((x) => (x.categoria === nombre ? { ...x, categoria: destino, color: maestro.categoriasNoticias[destino] ?? x.color } : x));
    try {
      await guardarVarias(n > 0 ? { categoriasNoticias: nuevas, noticias } : { categoriasNoticias: nuevas }, `Eliminó la categoría «${nombre}»${n ? ` (sus noticias pasan a «${destino}»)` : ''}`);
      avisar('ok', 'Categoría eliminada.');
      setBorrando(null);
    } catch (e) {
      setError(mensajeDe(e));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <>
      <Cabecera
        titulo="Categorías de noticias"
        subtitulo="El nombre y el color de cada etiqueta. Al renombrar una categoría se actualizan también sus noticias."
        acciones={
          <Boton
            variante="primario"
            icono="plus"
            onClick={() => {
              setError('');
              setEdicion({ original: null, nombre: '', color: COLORES_CATEGORIA[categorias.length % COLORES_CATEGORIA.length] });
            }}
          >
            Nueva categoría
          </Boton>
        }
      />

      {categorias.length === 0 ? (
        <Vacio icono="layers" titulo="Todavía no hay categorías" texto="Crea la primera para clasificar las noticias." />
      ) : (
        <section className="adm-tarjeta">
          <table className="adm-tabla adm-tabla--categorias">
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Así se ve</th>
                <th>Noticias</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map(([c, color]) => {
                const n = usos(c);
                return (
                  <tr key={c}>
                    <td>
                      <span className="adm-categoria-fila">
                        <span className="adm-punto adm-punto--grande" style={{ background: color }} />
                        <b>{c}</b>
                      </span>
                    </td>
                    <td>
                      <span className="adm-categoria" style={{ '--c': color } as React.CSSProperties}>
                        {c}
                      </span>
                    </td>
                    <td>
                      {n} noticia{n === 1 ? '' : 's'}
                    </td>
                    <td className="adm-tabla__acciones">
                      <Boton
                        pequeno
                        icono="edit"
                        onClick={() => {
                          setError('');
                          setEdicion({ original: c, nombre: c, color });
                        }}
                      >
                        Editar
                      </Boton>
                      <Boton
                        pequeno
                        variante="fantasma"
                        icono="trash"
                        onClick={() => {
                          setError('');
                          setBorrando({ nombre: c, destino: categorias.find(([x]) => x !== c)?.[0] ?? '' });
                        }}
                        disabled={categorias.length === 1 && n > 0}
                        title={categorias.length === 1 && n > 0 ? 'Es la única categoría y tiene noticias' : 'Eliminar'}
                      >
                        Eliminar
                      </Boton>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}

      {edicion && (
        <Modal
          titulo={edicion.original === null ? 'Nueva categoría' : 'Editar categoría'}
          onClose={() => setEdicion(null)}
          ancho="480px"
          pie={
            <>
              <Boton variante="fantasma" onClick={() => setEdicion(null)}>
                Cancelar
              </Boton>
              <Boton variante="primario" icono="check" cargando={guardando} onClick={guardarEdicion} disabled={!edicion.nombre.trim()}>
                {edicion.original === null ? 'Crear' : 'Guardar'}
              </Boton>
            </>
          }
        >
          {error && <p className="adm-aviso-suave adm-aviso-suave--error">{error}</p>}
          <Campo etiqueta="Nombre">
            <Entrada value={edicion.nombre} onChange={(e) => setEdicion({ ...edicion, nombre: e.target.value })} placeholder="Salud Digital" autoFocus />
          </Campo>
          <Campo etiqueta="Color de la etiqueta">
            <span className="adm-colores">
              {COLORES_CATEGORIA.map((c) => (
                <button key={c} type="button" className={`adm-color${edicion.color === c ? ' is-activo' : ''}`} style={{ background: c }} onClick={() => setEdicion({ ...edicion, color: c })} aria-label={c} />
              ))}
            </span>
          </Campo>
          <p className="adm-muestra-categoria">
            Así se ve:{' '}
            <span className="adm-categoria" style={{ '--c': edicion.color } as React.CSSProperties}>
              {edicion.nombre || 'Categoría'}
            </span>
          </p>
          {edicion.original !== null && usos(edicion.original) > 0 && edicion.nombre.trim() !== edicion.original && (
            <p className="adm-texto-suave">
              <Icon name="info" size={14} strokeWidth={2} /> Sus {usos(edicion.original)} noticias pasarán a llamarse «{edicion.nombre.trim()}».
            </p>
          )}
        </Modal>
      )}

      {borrando && (
        <Modal
          titulo="Eliminar categoría"
          onClose={() => setBorrando(null)}
          ancho="480px"
          pie={
            <>
              <Boton variante="fantasma" onClick={() => setBorrando(null)}>
                Cancelar
              </Boton>
              <Boton variante="peligro" icono="trash" cargando={guardando} onClick={confirmarBorrado}>
                Eliminar
              </Boton>
            </>
          }
        >
          {error && <p className="adm-aviso-suave adm-aviso-suave--error">{error}</p>}
          {usos(borrando.nombre) > 0 ? (
            <>
              <p className="adm-texto-suave">
                «{borrando.nombre}» tiene {usos(borrando.nombre)} noticia{usos(borrando.nombre) === 1 ? '' : 's'}. ¿A qué categoría pasan?
              </p>
              <Campo etiqueta="Pasan a">
                <Selector value={borrando.destino} onChange={(e) => setBorrando({ ...borrando, destino: e.target.value })}>
                  {categorias
                    .filter(([c]) => c !== borrando.nombre)
                    .map(([c]) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                </Selector>
              </Campo>
            </>
          ) : (
            <p className="adm-texto-suave">«{borrando.nombre}» no tiene noticias. Se eliminará sin más.</p>
          )}
        </Modal>
      )}
    </>
  );
}
