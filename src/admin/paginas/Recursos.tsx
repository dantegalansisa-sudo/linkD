import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Icon from '../../components/ui/Icon';
import { esFutura, fechaCorta, miniaturaVideo } from '../../contenido/formato';
import { TIPOS_RECURSO, type TipoRecurso } from '../../contenido/tipos';
import { RECURSOS_PAGINAS } from '../../data/recursos';
import { mensajeDe, useEstado, useMaestro } from '../estado';
import { Boton, Buscador, Cabecera, Chip, EnlaceBoton, Pestanas, Vacio } from '../ui/Basicos';
import { useConfirmar } from '../ui/Modal';

export const NOMBRE_ITEM: Record<TipoRecurso, string> = {
  conferencias: 'conferencia',
  webinars: 'webinar',
  entrevistas: 'entrevista',
  'materiales-de-apoyo': 'material',
};

/** Recursos: una pestana por tipo, con su lista. */
export default function Recursos() {
  const { tipo: tipoRuta } = useParams();
  const navegar = useNavigate();
  const maestro = useMaestro();
  const { guardar, avisar } = useEstado();
  const confirmar = useConfirmar();
  const [q, setQ] = useState('');
  const [ocupado, setOcupado] = useState('');

  const tipo: TipoRecurso = TIPOS_RECURSO.includes(tipoRuta as TipoRecurso) ? (tipoRuta as TipoRecurso) : 'conferencias';
  const pagina = RECURSOS_PAGINAS.find((r) => r.slug === tipo)!;
  const items = maestro.recursos[tipo] ?? [];

  const lista = useMemo(
    () =>
      [...items]
        .sort((a, b) => (b.fechaISO ?? '').localeCompare(a.fechaISO ?? ''))
        .filter((i) => !q || `${i.titulo} ${i.categoria} ${i.resumen}`.toLowerCase().includes(q.toLowerCase())),
    [items, q],
  );

  const guardarTipo = async (nuevos: typeof items, detalle: string) => {
    await guardar('recursos', { ...maestro.recursos, [tipo]: nuevos }, detalle);
  };

  const eliminar = async (slug: string, titulo: string) => {
    const ok = await confirmar({ titulo: `Eliminar ${NOMBRE_ITEM[tipo]}`, texto: `«${titulo}» desaparecerá de la web.`, confirmar: 'Eliminar', peligro: true });
    if (!ok) return;
    setOcupado(slug);
    try {
      await guardarTipo(items.filter((i) => i.slug !== slug), `Eliminó «${titulo}» de ${pagina.titulo}`);
      avisar('ok', 'Eliminado.');
    } catch (e) {
      avisar('error', mensajeDe(e));
    } finally {
      setOcupado('');
    }
  };

  const alternar = async (slug: string) => {
    const i = items.find((x) => x.slug === slug);
    if (!i) return;
    setOcupado(slug);
    try {
      const nuevo = i.publicado === false;
      await guardarTipo(
        items.map((x) => (x.slug === slug ? { ...x, publicado: nuevo } : x)),
        `${nuevo ? 'Publicó' : 'Ocultó'} «${i.titulo}» en ${pagina.titulo}`,
      );
      avisar('ok', nuevo ? 'Publicado.' : 'Pasado a borrador.');
    } catch (e) {
      avisar('error', mensajeDe(e));
    } finally {
      setOcupado('');
    }
  };

  const publicados = items.filter((i) => i.publicado !== false).length;

  return (
    <>
      <Cabecera
        titulo="Recursos"
        subtitulo="Lo que se publica en el menú Recursos de la web. Mientras un apartado esté vacío, la web muestra el panel «En desarrollo»."
        acciones={
          <>
            <EnlaceBoton to={`/recursos/${tipo}`} externo icono="external-link">
              Ver en la web
            </EnlaceBoton>
            <EnlaceBoton to={`/recursos/${tipo}/nuevo`} variante="primario" icono="plus">
              {tipo === 'entrevistas' ? 'Nueva' : 'Nuevo'} {NOMBRE_ITEM[tipo]}
            </EnlaceBoton>
          </>
        }
      />

      <div className="adm-barra">
        <Pestanas
          valor={tipo}
          onChange={(t) => navegar(`/recursos/${t}`)}
          opciones={RECURSOS_PAGINAS.map((r) => ({ clave: r.slug as TipoRecurso, label: r.titulo, total: (maestro.recursos[r.slug as TipoRecurso] ?? []).length }))}
        />
        <Buscador valor={q} onChange={setQ} placeholder={`Buscar ${NOMBRE_ITEM[tipo]}…`} />
      </div>

      <p className="adm-texto-suave adm-nota-tipo">
        <Icon name={pagina.icon} size={16} strokeWidth={2} />
        {pagina.subtitulo} · {publicados} publicad{publicados === 1 ? 'o' : 'os'}.
      </p>

      {lista.length === 0 ? (
        <Vacio
          icono={pagina.icon}
          titulo={q ? 'Nada coincide' : `Todavía no hay ${pagina.titulo.toLowerCase()}`}
          texto={q ? 'Prueba con otras palabras.' : `Cuando publiques ${tipo === 'entrevistas' ? 'la primera' : 'el primero'}, la página dejará de mostrar «En desarrollo».`}
          accion={
            !q && (
              <EnlaceBoton to={`/recursos/${tipo}/nuevo`} variante="primario" icono="plus">
                Añadir {NOMBRE_ITEM[tipo]}
              </EnlaceBoton>
            )
          }
        />
      ) : (
        <ul className="adm-lista">
          {lista.map((i) => {
            const portada = i.portada || i.video?.poster || (i.video && i.video.origen !== 'archivo' ? miniaturaVideo(i.video.src) : '');
            const proximo = esFutura(i.fechaISO) && (tipo === 'conferencias' || tipo === 'webinars');
            return (
              <li className="adm-fila-lista" key={i.slug}>
                <Link to={`/recursos/${tipo}/${i.slug}`} className="adm-fila-lista__media">
                  {portada ? <img src={portada} alt="" loading="lazy" /> : <Icon name={pagina.icon} size={22} strokeWidth={1.5} />}
                </Link>
                <div className="adm-fila-lista__texto">
                  <Link to={`/recursos/${tipo}/${i.slug}`} className="adm-fila-lista__titulo">
                    {i.titulo || 'Sin título'}
                  </Link>
                  <span className="adm-fila-lista__meta">
                    {i.categoria}
                    {i.fechaISO && (
                      <>
                        <i>·</i>
                        {fechaCorta(i.fechaISO)}
                      </>
                    )}
                    {i.video && (
                      <>
                        <i>·</i>
                        <Icon name="play" size={12} /> Video
                      </>
                    )}
                    {!!i.archivos?.length && (
                      <>
                        <i>·</i>
                        <Icon name="download" size={12} strokeWidth={2} /> {i.archivos.length} archivo{i.archivos.length === 1 ? '' : 's'}
                      </>
                    )}
                  </span>
                </div>
                {proximo && <Chip tono="azul">Próximo</Chip>}
                <Chip tono={i.publicado === false ? 'naranja' : 'verde'}>{i.publicado === false ? 'Borrador' : 'Publicado'}</Chip>
                <div className="adm-fila-lista__acciones">
                  <Boton pequeno variante="fantasma" icono={i.publicado === false ? 'eye' : 'eye-off'} cargando={ocupado === i.slug} onClick={() => alternar(i.slug)}>
                    {i.publicado === false ? 'Publicar' : 'Ocultar'}
                  </Boton>
                  <EnlaceBoton to={`/recursos/${tipo}/${i.slug}`} pequeno icono="edit">
                    Editar
                  </EnlaceBoton>
                  <Boton pequeno variante="fantasma" icono="trash" onClick={() => eliminar(i.slug, i.titulo)} aria-label="Eliminar" />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
