import { useState } from 'react';
import Icon from '../../components/ui/Icon';
import { ESPACIOS_PUBLICIDAD, type Anuncio, type EspacioPublicidad, type Sitio } from '../../contenido/tipos';
import { mensajeDe, useEstado, useMaestro } from '../estado';
import { AvisoEnLinea, Boton, Cabecera, Campo, Entrada, Interruptor } from '../ui/Basicos';
import { CampoImagen } from '../ui/Medios';
import { useCambios } from '../ui/useCambios';

/*
  Gestion de publicidad de NoticiaX: un anuncio por espacio (imagen y
  enlace). Un espacio sin anuncio activo muestra "¿Te gustaria anunciarte
  aqui?", que lleva al formulario de contacto.
*/

const VACIO: Anuncio = { activo: false, imagen: '', enlace: '', alt: '', anunciante: '' };

export default function NoticiasPublicidad() {
  const maestro = useMaestro();
  const { guardar, avisar } = useEstado();
  const { valor, setValor, sucio, marcarGuardado } = useCambios<Sitio['publicidad']>(maestro.publicidad ?? {});
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const anuncio = (id: EspacioPublicidad): Anuncio => ({ ...VACIO, ...(valor[id] ?? {}) });
  const cambiar = (id: EspacioPublicidad, cambio: Partial<Anuncio>) => setValor((v) => ({ ...v, [id]: { ...VACIO, ...(v[id] ?? {}), ...cambio } }));

  const activos = ESPACIOS_PUBLICIDAD.filter((e) => anuncio(e.id).activo && anuncio(e.id).imagen).length;

  const guardarTodo = async () => {
    const sinImagen = ESPACIOS_PUBLICIDAD.find((e) => anuncio(e.id).activo && !anuncio(e.id).imagen);
    if (sinImagen) {
      setError(`«${sinImagen.nombre}» está activado pero no tiene imagen. Sube la imagen del anuncio o desactívalo.`);
      return;
    }
    setError('');
    setGuardando(true);
    try {
      await guardar('publicidad', valor, `Actualizó la publicidad (${activos} anuncio${activos === 1 ? '' : 's'} activo${activos === 1 ? '' : 's'})`);
      marcarGuardado(valor);
      avisar('ok', 'Publicidad guardada: ya se ve en NoticiaX.');
    } catch (e) {
      setError(mensajeDe(e));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <>
      <Cabecera
        titulo="Gestión de Publicidad"
        subtitulo={`${activos} de ${ESPACIOS_PUBLICIDAD.length} espacios con anuncio. Los espacios libres muestran «¿Te gustaría anunciarte aquí?» y llevan al formulario de contacto.`}
        acciones={
          <>
            <a className="adm-boton adm-boton--secundario" href="/noticias" target="_blank" rel="noreferrer">
              <Icon name="external-link" size={17} strokeWidth={2} />
              Ver NoticiaX
            </a>
            <Boton variante="primario" icono="save" cargando={guardando} onClick={guardarTodo} disabled={!sucio}>
              Guardar
            </Boton>
          </>
        }
      />

      {error && <AvisoEnLinea tipo="error">{error}</AvisoEnLinea>}

      <div className="adm-publicidad">
        {ESPACIOS_PUBLICIDAD.map((e) => {
          const a = anuncio(e.id);
          return (
            <section key={e.id} className={`adm-tarjeta adm-anuncio${a.activo && a.imagen ? ' is-activo' : ''}`}>
              <div className="adm-tarjeta__cabeza">
                <h2>{e.nombre}</h2>
                <span className="adm-anuncio__medida">{e.medida}</span>
              </div>
              <div className="adm-tarjeta__cuerpo">
                <p className="adm-texto-suave">{e.donde}</p>
                <Interruptor
                  activo={a.activo}
                  onChange={(v) => cambiar(e.id, { activo: v })}
                  etiqueta="Mostrar este anuncio"
                  descripcion={a.activo ? 'Se ve en la web.' : 'Se muestra «¿Te gustaría anunciarte aquí?».'}
                />
                <CampoImagen
                  etiqueta="Imagen del anuncio"
                  valor={a.imagen}
                  alt={a.alt}
                  onChange={(u, alt) => cambiar(e.id, { imagen: u, alt: alt ?? a.alt })}
                  proporcion={e.id === 'portada-banner' ? '1440 / 220' : '6 / 5'}
                  ayuda={`Medida recomendada: ${e.medida}.`}
                />
                <Campo etiqueta="Enlace" ayuda="La web del anunciante (https://…) o una página propia (/empresa/contacto). Vacío: el anuncio no lleva a ningún sitio.">
                  <Entrada value={a.enlace} onChange={(ev) => cambiar(e.id, { enlace: ev.target.value })} placeholder="https://www.anunciante.com" />
                </Campo>
                <Campo etiqueta="Anunciante">
                  <Entrada value={a.anunciante ?? ''} onChange={(ev) => cambiar(e.id, { anunciante: ev.target.value })} placeholder="Nombre de la empresa (solo para el equipo)" />
                </Campo>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
