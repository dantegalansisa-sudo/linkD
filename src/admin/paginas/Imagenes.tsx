import { useMemo, useState } from 'react';
import Icon from '../../components/ui/Icon';
import { CATALOGO_IMAGENES, type ImagenCatalogo } from '../../contenido/catalogo-imagenes';
import { mensajeDe, useEstado, useMaestro } from '../estado';
import { Boton, Buscador, Cabecera, Chip, Pestanas, Vacio } from '../ui/Basicos';
import { SelectorMedio } from '../ui/Medios';
import { useConfirmar } from '../ui/Modal';

/**
 * Imagenes del sitio: cada foto o video fijo de la web (portadas, productos,
 * equipo, logotipos...) con su foto actual y la opcion de sustituirla por
 * otra. La web sigue usando la ruta original como clave; solo cambia lo que
 * se muestra.
 */
export default function Imagenes() {
  const maestro = useMaestro();
  const { guardar, avisar } = useEstado();
  const confirmar = useConfirmar();
  const [grupo, setGrupo] = useState<string>('todos');
  const [q, setQ] = useState('');
  const [eligiendo, setEligiendo] = useState<ImagenCatalogo | null>(null);
  const [ocupado, setOcupado] = useState('');

  const grupos = useMemo(() => [...new Set(CATALOGO_IMAGENES.map((i) => i.grupo))], []);
  const sustituidas = Object.keys(maestro.imagenes).length;

  const lista = CATALOGO_IMAGENES.filter((i) => {
    if (grupo === 'cambiadas' && !maestro.imagenes[i.ruta]) return false;
    if (grupo !== 'todos' && grupo !== 'cambiadas' && i.grupo !== grupo) return false;
    if (q && !`${i.descripcion} ${i.contexto} ${i.ruta}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const sustituir = async (ruta: string, nueva: string) => {
    setOcupado(ruta);
    try {
      await guardar('imagenes', { ...maestro.imagenes, [ruta]: nueva }, `Sustituyó ${ruta}`);
      avisar('ok', 'Imagen sustituida. Ya se ve en la web.');
    } catch (e) {
      avisar('error', mensajeDe(e));
    } finally {
      setOcupado('');
      setEligiendo(null);
    }
  };

  const restablecer = async (i: ImagenCatalogo) => {
    const ok = await confirmar({ titulo: 'Volver a la imagen original', texto: `«${i.descripcion}» volverá a mostrar la foto original de la web.`, confirmar: 'Restablecer' });
    if (!ok) return;
    const copia = { ...maestro.imagenes };
    delete copia[i.ruta];
    setOcupado(i.ruta);
    try {
      await guardar('imagenes', copia, `Restableció ${i.ruta}`);
      avisar('ok', 'Imagen original restablecida.');
    } catch (e) {
      avisar('error', mensajeDe(e));
    } finally {
      setOcupado('');
    }
  };

  return (
    <>
      <Cabecera
        titulo="Imágenes del sitio"
        subtitulo={`Las ${CATALOGO_IMAGENES.length} fotos y videos fijos de la web, por sección. Sustituye cualquiera y la web la muestra al instante; siempre puedes volver a la original.`}
      />

      <div className="adm-barra">
        <Pestanas
          valor={grupo}
          onChange={setGrupo}
          opciones={[
            { clave: 'todos', label: 'Todas', total: CATALOGO_IMAGENES.length },
            { clave: 'cambiadas', label: 'Sustituidas', total: sustituidas },
            ...grupos.map((g) => ({ clave: g, label: g, total: CATALOGO_IMAGENES.filter((i) => i.grupo === g).length })),
          ]}
        />
        <Buscador valor={q} onChange={setQ} placeholder="Buscar por descripción o sección…" />
      </div>

      {lista.length === 0 ? (
        <Vacio icono="image" titulo={grupo === 'cambiadas' ? 'Todavía no has sustituido ninguna' : 'Nada coincide'} texto={grupo === 'cambiadas' ? 'Elige una sección y pulsa «Sustituir» en la foto que quieras cambiar.' : undefined} />
      ) : (
        <ul className="adm-rejilla-imagenes">
          {lista.map((i) => {
            const actual = maestro.imagenes[i.ruta];
            return (
              <li className={`adm-imagen-sitio${actual ? ' is-sustituida' : ''}`} key={i.ruta}>
                <div className="adm-imagen-sitio__vista">
                  {i.esVideo ? (
                    <video src={actual ?? i.ruta} muted playsInline preload="metadata" />
                  ) : (
                    <img src={actual ?? i.ruta} alt={i.descripcion} loading="lazy" />
                  )}
                  {actual && (
                    <span className="adm-imagen-sitio__original" title="Original">
                      {i.esVideo ? <Icon name="video" size={16} /> : <img src={i.ruta} alt="" loading="lazy" />}
                    </span>
                  )}
                </div>
                <div className="adm-imagen-sitio__texto">
                  <small>
                    {i.grupo}
                    {i.contexto && i.contexto !== i.descripcion ? ` · ${i.contexto}` : ''}
                  </small>
                  <b>{i.descripcion}</b>
                  {actual ? <Chip tono="azul">Sustituida</Chip> : <Chip tono="gris">Original</Chip>}
                </div>
                <div className="adm-imagen-sitio__acciones">
                  <Boton pequeno variante="primario" icono="refresh" cargando={ocupado === i.ruta} onClick={() => setEligiendo(i)}>
                    Sustituir
                  </Boton>
                  {actual && (
                    <Boton pequeno variante="fantasma" icono="history" cargando={ocupado === i.ruta} onClick={() => restablecer(i)}>
                      Original
                    </Boton>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {eligiendo && (
        <SelectorMedio
          tipo={eligiendo.esVideo ? 'video' : 'imagen'}
          onClose={() => setEligiendo(null)}
          onElegir={(m) => sustituir(eligiendo.ruta, m[0].url)}
        />
      )}
    </>
  );
}
