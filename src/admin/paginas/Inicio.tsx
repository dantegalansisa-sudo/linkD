import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon, { type IconName } from '../../components/ui/Icon';
import { get, type Estado } from '../api';
import { mensajeDe, useEstado, useMaestro } from '../estado';
import { AvisoEnLinea, Cabecera, EnlaceBoton, Tarjeta, fechaHora, haceCuanto } from '../ui/Basicos';
import { fechaCorta } from '../../contenido/formato';

/** Panel de inicio: cifras del contenido, accesos directos y actividad. */
export default function Inicio() {
  const { usuario, avisar } = useEstado();
  const maestro = useMaestro();
  const [estado, setEstado] = useState<Estado | null>(null);

  useEffect(() => {
    get<Estado>('estado')
      .then(setEstado)
      .catch((e) => avisar('error', mensajeDe(e)));
  }, [avisar, maestro.version]);

  const r = estado?.resumen;
  const recursosTotal = r ? Object.values(r.recursos).reduce((a, x) => a + x.publicados, 0) : 0;
  const borradores = r
    ? r.noticias.total - r.noticias.publicados + Object.values(r.recursos).reduce((a, x) => a + (x.total - x.publicados), 0) + (r.jornadas.total - r.jornadas.publicados) + (r.proximas.total - r.proximas.publicados)
    : 0;

  const tarjetas: { to: string; icon: IconName; valor: number | string; label: string; nota?: string }[] = [
    { to: '/noticias', icon: 'newspaper', valor: r?.noticias.publicados ?? '…', label: 'Noticias publicadas', nota: r && r.noticias.total > r.noticias.publicados ? `${r.noticias.total - r.noticias.publicados} en borrador` : undefined },
    { to: '/recursos', icon: 'play', valor: r ? recursosTotal : '…', label: 'Recursos publicados', nota: 'Conferencias, webinars, entrevistas y materiales' },
    { to: '/obra-social', icon: 'heart', valor: r?.jornadas.publicados ?? '…', label: 'Jornadas de obra social', nota: r ? `${r.proximas.publicados} próxima${r.proximas.publicados === 1 ? '' : 's'} anunciada${r.proximas.publicados === 1 ? '' : 's'}` : undefined },
    { to: '/solicitudes', icon: 'inbox', valor: r?.solicitudesNuevas ?? '…', label: 'Solicitudes sin atender', nota: r ? `${r.solicitudesTotal} recibidas en total` : undefined },
  ];

  const proximaJornada = maestro.obraSocial.proximas.filter((p) => p.publicado !== false).sort((a, b) => a.fechaISO.localeCompare(b.fechaISO))[0];
  const ultimaNoticia = [...maestro.noticias].sort((a, b) => b.fechaISO.localeCompare(a.fechaISO))[0];

  return (
    <>
      <Cabecera
        titulo={`Hola, ${usuario?.nombre.split(' ')[0] ?? ''}`}
        subtitulo={
          r?.actualizado ? (
            <>
              Último cambio {haceCuanto(r.actualizado)}
              {r.actualizadoPor ? ` por ${r.actualizadoPor}` : ''} · versión {r.version}
            </>
          ) : (
            'Todo lo que publiques aquí se ve en la web al instante.'
          )
        }
        acciones={
          <>
            <EnlaceBoton to="/noticias/nueva" variante="primario" icono="plus">
              Nueva noticia
            </EnlaceBoton>
            <EnlaceBoton to="/?borrador=1" externo icono="eye">
              Vista previa
            </EnlaceBoton>
          </>
        }
      />

      {estado && !estado.servidor.privadoEscribible && (
        <AvisoEnLinea tipo="error">
          El servidor no deja escribir en la carpeta de datos del panel ({estado.servidor.privado}). Nada se guardará hasta que se corrijan los permisos. Revisa Ajustes.
        </AvisoEnLinea>
      )}
      {borradores > 0 && (
        <AvisoEnLinea tipo="info">
          Hay {borradores} elemento{borradores === 1 ? '' : 's'} en borrador que todavía no se ve{borradores === 1 ? '' : 'n'} en la web.
        </AvisoEnLinea>
      )}

      <div className="adm-cifras-inicio">
        {tarjetas.map((t) => (
          <Link className="adm-cifra-inicio" to={t.to} key={t.to}>
            <span className="adm-cifra-inicio__icono">
              <Icon name={t.icon} size={22} strokeWidth={1.7} />
            </span>
            <b>{t.valor}</b>
            <span>{t.label}</span>
            {t.nota && <small>{t.nota}</small>}
          </Link>
        ))}
      </div>

      <div className="adm-dos-columnas">
        <div className="adm-columna">
          <Tarjeta titulo="Accesos rápidos">
            <div className="adm-accesos">
              <Link to="/noticias/nueva" className="adm-acceso">
                <Icon name="newspaper" size={20} strokeWidth={1.7} />
                <span>
                  <b>Publicar una noticia</b>
                  <small>Con texto, fotos y video</small>
                </span>
              </Link>
              <Link to="/recursos/webinars/nuevo" className="adm-acceso">
                <Icon name="play" size={20} strokeWidth={1.7} />
                <span>
                  <b>Añadir un webinar</b>
                  <small>Próximo o grabación</small>
                </span>
              </Link>
              <Link to="/obra-social?pestana=jornadas" className="adm-acceso">
                <Icon name="heart" size={20} strokeWidth={1.7} />
                <span>
                  <b>Nueva jornada realizada</b>
                  <small>Galería, video y agradecimientos</small>
                </span>
              </Link>
              <Link to="/imagenes" className="adm-acceso">
                <Icon name="image" size={20} strokeWidth={1.7} />
                <span>
                  <b>Cambiar una foto del sitio</b>
                  <small>Portadas, productos, equipo…</small>
                </span>
              </Link>
            </div>
          </Tarjeta>

          <Tarjeta titulo="Ahora mismo en la web">
            <ul className="adm-ahora">
              {ultimaNoticia && (
                <li>
                  <Icon name="newspaper" size={17} strokeWidth={1.8} />
                  <span>
                    <small>Última noticia · {fechaCorta(ultimaNoticia.fechaISO)}</small>
                    <Link to={`/noticias/${ultimaNoticia.slug}`}>{ultimaNoticia.titulo}</Link>
                  </span>
                </li>
              )}
              {proximaJornada ? (
                <li>
                  <Icon name="calendar" size={17} strokeWidth={1.8} />
                  <span>
                    <small>Próxima jornada · {fechaCorta(proximaJornada.fechaISO)}</small>
                    <Link to="/obra-social">{proximaJornada.titulo}</Link>
                  </span>
                </li>
              ) : (
                <li>
                  <Icon name="calendar" size={17} strokeWidth={1.8} />
                  <span>
                    <small>Obra social</small>
                    <Link to="/obra-social">No hay ninguna jornada próxima anunciada</Link>
                  </span>
                </li>
              )}
              <li>
                <Icon name="image" size={17} strokeWidth={1.8} />
                <span>
                  <small>Fotos del sitio</small>
                  <Link to="/imagenes">{r ? `${r.imagenesSustituidas} sustituida${r.imagenesSustituidas === 1 ? '' : 's'} desde el panel` : '…'}</Link>
                </span>
              </li>
            </ul>
          </Tarjeta>
        </div>

        <div className="adm-columna">
          <Tarjeta titulo="Actividad reciente">
            {estado?.actividad.length ? (
              <ul className="adm-actividad">
                {estado.actividad.map((a, i) => (
                  <li key={i}>
                    <span className="adm-actividad__punto" />
                    <span>
                      <span>
                        <b>{a.usuario}</b> · {a.accion}
                      </span>
                      {a.detalle && <small>{a.detalle}</small>}
                      <time title={fechaHora(a.fecha)}>{haceCuanto(a.fecha)}</time>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="adm-texto-suave">Aquí verás quién cambió qué.</p>
            )}
          </Tarjeta>
        </div>
      </div>
    </>
  );
}
