import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/ui/Icon';
import { get, post, type Comentario, type EstadoComentario } from '../api';
import { mensajeDe, useEstado, useMaestro } from '../estado';
import { Boton, Buscador, Cabecera, Chip, Pestanas, Vacio, fechaHora } from '../ui/Basicos';
import { useConfirmar } from '../ui/Modal';

/*
  Comentarios de las noticias. Llegan sin registro y entran como pendientes:
  no se ven en la web hasta que alguien del equipo los aprueba aqui. Cada
  comentario nuevo avisa tambien por correo.
*/

type Filtro = EstadoComentario | 'todos';

const TONOS: Record<EstadoComentario, 'naranja' | 'verde' | 'rojo'> = { pendiente: 'naranja', aprobado: 'verde', rechazado: 'rojo' };
const NOMBRES: Record<EstadoComentario, string> = { pendiente: 'Pendiente', aprobado: 'Aprobado', rechazado: 'Rechazado' };

export default function NoticiasComentarios() {
  const maestro = useMaestro();
  const { avisar } = useEstado();
  const confirmar = useConfirmar();
  const [filtro, setFiltro] = useState<Filtro>('pendiente');
  const [lista, setLista] = useState<Comentario[] | null>(null);
  const [cuenta, setCuenta] = useState<Record<EstadoComentario, number>>({ pendiente: 0, aprobado: 0, rechazado: 0 });
  const [q, setQ] = useState('');
  const [ocupado, setOcupado] = useState('');
  const [error, setError] = useState('');

  const leer = useCallback(() => {
    get<{ comentarios: Comentario[]; cuenta: Record<EstadoComentario, number> }>('noticias', { accion: 'comentarios', estado: filtro })
      .then((r) => {
        setLista(r.comentarios);
        setCuenta(r.cuenta);
        setError('');
      })
      .catch((e) => setError(mensajeDe(e)));
  }, [filtro]);
  useEffect(leer, [leer]);

  const titulo = (slug: string) => maestro.noticias.find((n) => n.slug === slug)?.titulo ?? 'Noticia eliminada';

  const moderar = async (c: Comentario, estado: EstadoComentario) => {
    setOcupado(c.id);
    try {
      await post('noticias', { accion: 'moderar', id: c.id, estado });
      avisar('ok', estado === 'aprobado' ? 'Comentario aprobado: ya se ve en la noticia.' : estado === 'rechazado' ? 'Comentario rechazado.' : 'Comentario devuelto a pendientes.');
      leer();
    } catch (e) {
      avisar('error', mensajeDe(e));
    } finally {
      setOcupado('');
    }
  };

  const borrar = async (c: Comentario) => {
    const ok = await confirmar({ titulo: 'Borrar el comentario', texto: 'Se elimina del todo. Esta acción no se puede deshacer.', confirmar: 'Borrar', peligro: true });
    if (!ok) return;
    setOcupado(c.id);
    try {
      await post('noticias', { accion: 'borrar-comentario', id: c.id });
      avisar('ok', 'Comentario borrado.');
      leer();
    } catch (e) {
      avisar('error', mensajeDe(e));
    } finally {
      setOcupado('');
    }
  };

  const t = q.trim().toLowerCase();
  const visibles = (lista ?? []).filter((c) => !t || `${c.nombre} ${c.texto} ${titulo(c.slug)}`.toLowerCase().includes(t));

  return (
    <>
      <Cabecera
        titulo="Comentarios en noticias"
        subtitulo={`${cuenta.pendiente} pendiente${cuenta.pendiente === 1 ? '' : 's'} de aprobación · ${cuenta.aprobado} publicado${cuenta.aprobado === 1 ? '' : 's'}. Los comentarios no se ven en la web hasta que los apruebas.`}
      />

      <div className="adm-barra">
        <Pestanas
          valor={filtro}
          onChange={setFiltro}
          opciones={[
            { clave: 'pendiente', label: 'Pendientes', total: cuenta.pendiente },
            { clave: 'aprobado', label: 'Aprobados', total: cuenta.aprobado },
            { clave: 'rechazado', label: 'Rechazados', total: cuenta.rechazado },
            { clave: 'todos', label: 'Todos', total: cuenta.pendiente + cuenta.aprobado + cuenta.rechazado },
          ]}
        />
        <Buscador valor={q} onChange={setQ} placeholder="Buscar en los comentarios…" />
      </div>

      {error && <p className="adm-aviso-suave">{error}</p>}

      {lista === null ? (
        <div className="adm-cargando adm-cargando--bloque">
          <span className="adm-girando" />
        </div>
      ) : visibles.length === 0 ? (
        <Vacio
          icono="mail"
          titulo={filtro === 'pendiente' ? 'No hay comentarios pendientes' : 'No hay comentarios aquí'}
          texto={filtro === 'pendiente' ? 'Cuando alguien comente una noticia aparecerá aquí para que lo revises.' : undefined}
        />
      ) : (
        <ul className="adm-comentarios">
          {visibles.map((c) => (
            <li key={c.id} className={`adm-comentario${ocupado === c.id ? ' is-ocupado' : ''}`}>
              <span className="adm-comentario__avatar">{(c.nombre || 'A').trim().charAt(0).toUpperCase()}</span>
              <div className="adm-comentario__cuerpo">
                <p className="adm-comentario__cabeza">
                  <b>{c.nombre || 'Anónimo'}</b>
                  <span>{fechaHora(c.fecha)}</span>
                  <Chip tono={TONOS[c.estado]}>{NOMBRES[c.estado]}</Chip>
                </p>
                <p className="adm-comentario__texto">{c.texto}</p>
                <p className="adm-comentario__noticia">
                  <Icon name="newspaper" size={14} strokeWidth={2} />
                  En{' '}
                  <a href={`/noticias/${c.slug}`} target="_blank" rel="noreferrer">
                    {titulo(c.slug)}
                  </a>
                  {c.moderadoPor && (
                    <small>
                      · {c.estado === 'aprobado' ? 'Aprobado' : c.estado === 'rechazado' ? 'Rechazado' : 'Revisado'} por {c.moderadoPor}
                    </small>
                  )}
                </p>
              </div>
              <div className="adm-comentario__acciones">
                {c.estado !== 'aprobado' && (
                  <Boton pequeno variante="primario" icono="check" cargando={ocupado === c.id} onClick={() => moderar(c, 'aprobado')}>
                    Aprobar
                  </Boton>
                )}
                {c.estado !== 'rechazado' && (
                  <Boton pequeno variante="suave" icono="close" onClick={() => moderar(c, 'rechazado')} disabled={ocupado === c.id}>
                    Rechazar
                  </Boton>
                )}
                {c.estado !== 'pendiente' && (
                  <Boton pequeno variante="fantasma" icono="refresh" onClick={() => moderar(c, 'pendiente')} disabled={ocupado === c.id}>
                    A pendientes
                  </Boton>
                )}
                <Boton pequeno variante="fantasma" icono="trash" onClick={() => borrar(c)} aria-label="Borrar" disabled={ocupado === c.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="adm-texto-suave adm-pie-nota">
        <Icon name="info" size={14} strokeWidth={2} /> Cada comentario nuevo llega también al correo de notificaciones de LINKDICOM. Puedes ver la noticia completa desde <Link to="/noticias">el listado</Link>.
      </p>
    </>
  );
}
