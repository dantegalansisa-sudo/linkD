import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/ui/Icon';
import { fechaCorta } from '../../contenido/formato';
import { mensajeDe, useEstado, useMaestro } from '../estado';
import { Boton, Buscador, Cabecera, Chip, EnlaceBoton, Pestanas, Vacio } from '../ui/Basicos';
import { useConfirmar } from '../ui/Modal';

type Filtro = 'todas' | 'publicadas' | 'borradores';

/** Lista de noticias con busqueda y filtro por estado. */
export default function Noticias() {
  const maestro = useMaestro();
  const { guardar, avisar } = useEstado();
  const confirmar = useConfirmar();
  const [q, setQ] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const [ocupado, setOcupado] = useState('');

  const lista = useMemo(() => {
    const orden = [...maestro.noticias].sort((a, b) => b.fechaISO.localeCompare(a.fechaISO));
    return orden.filter((n) => {
      if (filtro === 'publicadas' && n.publicado === false) return false;
      if (filtro === 'borradores' && n.publicado !== false) return false;
      if (q && !`${n.titulo} ${n.categoria} ${n.resumen}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [maestro.noticias, filtro, q]);

  const publicadas = maestro.noticias.filter((n) => n.publicado !== false).length;

  const eliminar = async (slug: string, titulo: string) => {
    const ok = await confirmar({ titulo: 'Eliminar la noticia', texto: `«${titulo}» desaparecerá de la web. Esta acción no se puede deshacer.`, confirmar: 'Eliminar', peligro: true });
    if (!ok) return;
    setOcupado(slug);
    try {
      await guardar('noticias', maestro.noticias.filter((n) => n.slug !== slug), `Eliminó la noticia «${titulo}»`);
      avisar('ok', 'Noticia eliminada.');
    } catch (e) {
      avisar('error', mensajeDe(e));
    } finally {
      setOcupado('');
    }
  };

  const alternar = async (slug: string) => {
    const n = maestro.noticias.find((x) => x.slug === slug);
    if (!n) return;
    setOcupado(slug);
    try {
      const nuevo = n.publicado === false;
      await guardar(
        'noticias',
        maestro.noticias.map((x) => (x.slug === slug ? { ...x, publicado: nuevo } : x)),
        `${nuevo ? 'Publicó' : 'Ocultó'} la noticia «${n.titulo}»`,
      );
      avisar('ok', nuevo ? 'Noticia publicada.' : 'Noticia pasada a borrador.');
    } catch (e) {
      avisar('error', mensajeDe(e));
    } finally {
      setOcupado('');
    }
  };

  return (
    <>
      <Cabecera
        titulo="Noticias"
        subtitulo={`${publicadas} publicada${publicadas === 1 ? '' : 's'} · ${maestro.noticias.length - publicadas} en borrador`}
        acciones={
          <>
            <EnlaceBoton to="/noticias" externo icono="external-link">
              Ver en la web
            </EnlaceBoton>
            <EnlaceBoton to="/noticias/nueva" variante="primario" icono="plus">
              Nueva noticia
            </EnlaceBoton>
          </>
        }
      />

      <div className="adm-barra">
        <Pestanas
          valor={filtro}
          onChange={setFiltro}
          opciones={[
            { clave: 'todas', label: 'Todas', total: maestro.noticias.length },
            { clave: 'publicadas', label: 'Publicadas', total: publicadas },
            { clave: 'borradores', label: 'Borradores', total: maestro.noticias.length - publicadas },
          ]}
        />
        <Buscador valor={q} onChange={setQ} placeholder="Buscar noticia…" />
      </div>

      {lista.length === 0 ? (
        <Vacio
          icono="newspaper"
          titulo={q ? 'Ninguna noticia coincide' : 'Todavía no hay noticias'}
          texto={q ? 'Prueba con otras palabras.' : 'Publica la primera y aparecerá en el inicio de la web.'}
          accion={
            !q && (
              <EnlaceBoton to="/noticias/nueva" variante="primario" icono="plus">
                Nueva noticia
              </EnlaceBoton>
            )
          }
        />
      ) : (
        <ul className="adm-lista">
          {lista.map((n) => (
            <li className="adm-fila-lista" key={n.slug}>
              <Link to={`/noticias/${n.slug}`} className="adm-fila-lista__media">
                {n.imagen ? <img src={n.imagen} alt="" loading="lazy" /> : <Icon name="image" size={22} strokeWidth={1.5} />}
              </Link>
              <div className="adm-fila-lista__texto">
                <Link to={`/noticias/${n.slug}`} className="adm-fila-lista__titulo">
                  {n.titulo || 'Sin título'}
                </Link>
                <span className="adm-fila-lista__meta">
                  <span className="adm-punto" style={{ background: n.color }} />
                  {n.categoria}
                  <i>·</i>
                  {fechaCorta(n.fechaISO)}
                  {n.destacada !== false && (
                    <>
                      <i>·</i>
                      <Icon name="star" size={12} strokeWidth={2} /> En el inicio
                    </>
                  )}
                </span>
              </div>
              <Chip tono={n.publicado === false ? 'naranja' : 'verde'}>{n.publicado === false ? 'Borrador' : 'Publicada'}</Chip>
              <div className="adm-fila-lista__acciones">
                <Boton pequeno variante="fantasma" icono={n.publicado === false ? 'eye' : 'eye-off'} cargando={ocupado === n.slug} onClick={() => alternar(n.slug)} title={n.publicado === false ? 'Publicar' : 'Pasar a borrador'}>
                  {n.publicado === false ? 'Publicar' : 'Ocultar'}
                </Boton>
                <EnlaceBoton to={`/noticias/${n.slug}`} pequeno icono="edit">
                  Editar
                </EnlaceBoton>
                <Boton pequeno variante="fantasma" icono="trash" onClick={() => eliminar(n.slug, n.titulo)} aria-label="Eliminar" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
