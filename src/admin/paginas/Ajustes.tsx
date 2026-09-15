import { useCallback, useEffect, useState, type FormEvent } from 'react';
import Icon from '../../components/ui/Icon';
import { get, post, type Estado } from '../api';
import { tamanoLegible } from '../../contenido/formato';
import { mensajeDe, useEstado } from '../estado';
import { AvisoEnLinea, Boton, Cabecera, Campo, Entrada, Tarjeta, fechaHora, haceCuanto } from '../ui/Basicos';
import { useConfirmar } from '../ui/Modal';

interface Copia {
  archivo: string;
  fecha: string;
  tamano: number;
}

/** Ajustes: mi contrasena, estado del servidor, publicacion y copias. */
export default function Ajustes() {
  const { usuario, avisar, recargarMaestro, maestro } = useEstado();
  const confirmar = useConfirmar();
  const [estado, setEstado] = useState<Estado | null>(null);
  const [copias, setCopias] = useState<Copia[] | null>(null);
  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [nueva2, setNueva2] = useState('');
  const [ocupado, setOcupado] = useState('');
  const esAdmin = usuario?.rol === 'administrador';

  const cargar = useCallback(() => {
    get<Estado>('estado')
      .then(setEstado)
      .catch((e) => avisar('error', mensajeDe(e)));
    if (esAdmin) {
      get<{ historial: Copia[] }>('contenido', { accion: 'historial' })
        .then((r) => setCopias(r.historial))
        .catch(() => setCopias([]));
    }
  }, [avisar, esAdmin]);

  useEffect(cargar, [cargar, maestro?.version]);

  const cambiarClave = async (e: FormEvent) => {
    e.preventDefault();
    if (nueva !== nueva2) {
      avisar('error', 'Las dos contraseñas nuevas no coinciden.');
      return;
    }
    setOcupado('clave');
    try {
      await post('sesion', { accion: 'clave', actual, nueva });
      setActual('');
      setNueva('');
      setNueva2('');
      avisar('ok', 'Contraseña cambiada.');
    } catch (err) {
      avisar('error', mensajeDe(err));
    } finally {
      setOcupado('');
    }
  };

  const publicar = async () => {
    setOcupado('publicar');
    try {
      await post('contenido', { accion: 'publicar' });
      avisar('ok', 'Contenido publicado de nuevo.');
      cargar();
    } catch (e) {
      avisar('error', mensajeDe(e));
    } finally {
      setOcupado('');
    }
  };

  const restaurar = async (c: Copia) => {
    const ok = await confirmar({
      titulo: 'Restaurar esta copia',
      texto: `El contenido volverá a como estaba el ${fechaHora(c.fecha)}. Lo de ahora se guarda como una copia más, así que puedes deshacerlo.`,
      confirmar: 'Restaurar',
    });
    if (!ok) return;
    setOcupado(c.archivo);
    try {
      await post('contenido', { accion: 'restaurar', archivo: c.archivo });
      await recargarMaestro();
      avisar('ok', 'Copia restaurada y publicada.');
    } catch (e) {
      avisar('error', mensajeDe(e));
    } finally {
      setOcupado('');
    }
  };

  const s = estado?.servidor;
  const problemas: string[] = [];
  if (s) {
    if (!s.privadoEscribible) problemas.push('La carpeta de datos del panel no se puede escribir: nada se guardará.');
    if (!s.mediosEscribible) problemas.push('La carpeta /media no se puede escribir: no se podrán subir archivos.');
    if (!s.datosEscribible) problemas.push('La carpeta /datos no se puede escribir: los cambios no llegarán a la web.');
    if (!s.gd) problemas.push('PHP no tiene la librería GD: las fotos se guardarán sin reducir ni convertir.');
    if (s.privadoDentroDePublic) problemas.push('Los datos del panel están dentro de public_html (protegidos por .htaccess) porque no se pudo escribir fuera.');
  }

  return (
    <>
      <Cabecera titulo="Ajustes" subtitulo="Tu contraseña, el estado del servidor y las copias del contenido." />

      <div className="adm-dos-columnas">
        <div className="adm-columna">
          <Tarjeta titulo="Mi contraseña">
            <form onSubmit={cambiarClave} className="adm-form-clave">
              <Campo etiqueta="Contraseña actual">
                <Entrada type="password" value={actual} onChange={(e) => setActual(e.target.value)} autoComplete="current-password" required />
              </Campo>
              <Campo etiqueta="Nueva contraseña" ayuda="Mínimo 8 caracteres.">
                <Entrada type="password" value={nueva} onChange={(e) => setNueva(e.target.value)} autoComplete="new-password" required minLength={8} />
              </Campo>
              <Campo etiqueta="Repite la nueva contraseña">
                <Entrada type="password" value={nueva2} onChange={(e) => setNueva2(e.target.value)} autoComplete="new-password" required minLength={8} />
              </Campo>
              <Boton type="submit" variante="primario" icono="key" cargando={ocupado === 'clave'}>
                Cambiar contraseña
              </Boton>
            </form>
          </Tarjeta>

          <Tarjeta
            titulo="Publicación"
            acciones={
              <Boton icono="refresh" cargando={ocupado === 'publicar'} onClick={publicar}>
                Volver a publicar
              </Boton>
            }
          >
            <p className="adm-texto-suave">
              Cada vez que guardas, la web se actualiza sola. Este botón vuelve a generar el archivo publicado por si alguna vez hiciera falta.
            </p>
            {estado && (
              <dl className="adm-datos">
                <dt>Versión del contenido</dt>
                <dd>{estado.resumen.version}</dd>
                <dt>Último cambio</dt>
                <dd>
                  {estado.resumen.actualizado ? `${fechaHora(estado.resumen.actualizado)}${estado.resumen.actualizadoPor ? ` · ${estado.resumen.actualizadoPor}` : ''}` : '—'}
                </dd>
                <dt>Publicado en la web</dt>
                <dd>{estado.resumen.publicadoEl ? haceCuanto(estado.resumen.publicadoEl) : 'Todavía no'}</dd>
              </dl>
            )}
          </Tarjeta>

          {esAdmin && (
            <Tarjeta titulo="Copias del contenido">
              <p className="adm-texto-suave">Cada guardado deja una copia (se conservan las 40 últimas). Si algo se borró por error, restaura la copia anterior.</p>
              {copias === null ? (
                <p className="adm-cargando-texto">Cargando…</p>
              ) : copias.length === 0 ? (
                <p className="adm-texto-suave">Todavía no hay copias.</p>
              ) : (
                <ul className="adm-copias">
                  {copias.slice(0, 15).map((c, i) => (
                    <li key={c.archivo}>
                      <Icon name="history" size={16} strokeWidth={2} />
                      <span>
                        <b>{fechaHora(c.fecha)}</b>
                        <small>
                          {c.archivo.replace(/^contenido-\d+-\d+-/, '').replace('.json', '')} · {tamanoLegible(c.tamano)}
                          {i === 0 ? ' · actual' : ''}
                        </small>
                      </span>
                      {i > 0 && (
                        <Boton pequeno variante="fantasma" cargando={ocupado === c.archivo} onClick={() => restaurar(c)}>
                          Restaurar
                        </Boton>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </Tarjeta>
          )}
        </div>

        <div className="adm-columna">
          <Tarjeta titulo="Estado del servidor">
            {!estado ? (
              <p className="adm-cargando-texto">Cargando…</p>
            ) : (
              <>
                {problemas.length ? problemas.map((p) => <AvisoEnLinea key={p} tipo="alerta">{p}</AvisoEnLinea>) : <AvisoEnLinea tipo="ok">Todo en orden: el panel puede guardar, subir archivos y publicar.</AvisoEnLinea>}
                <dl className="adm-datos">
                  <dt>Panel</dt>
                  <dd>versión {s!.panel}</dd>
                  <dt>PHP</dt>
                  <dd>{s!.php}</dd>
                  <dt>Fotos</dt>
                  <dd>{s!.gd ? (s!.webp ? 'Se reducen y se convierten a WebP' : 'Se reducen (sin WebP)') : 'Sin procesar'}</dd>
                  <dt>Subida directa</dt>
                  <dd>{s!.uploadMax > 0 ? `hasta ${tamanoLegible(Math.min(s!.uploadMax, s!.postMax > 0 ? s!.postMax : s!.uploadMax))} por archivo; más grandes van por partes` : 'sin límite'}</dd>
                  <dt>Archivos subidos</dt>
                  <dd>
                    {s!.medios.archivos} · {tamanoLegible(s!.medios.bytes)}
                  </dd>
                  <dt>Datos del panel</dt>
                  <dd className="adm-datos__url">{s!.privado}</dd>
                  <dt>Conexión</dt>
                  <dd>{s!.https ? 'HTTPS' : 'Sin cifrar (HTTP)'}</dd>
                </dl>
              </>
            )}
          </Tarjeta>

          <Tarjeta titulo="Cómo funciona">
            <ul className="adm-ayuda">
              <li>
                <b>Guardar = publicar.</b> Lo marcado como visible aparece en la web en cuanto guardas. Lo que está en borrador solo lo ves tú con «Vista previa».
              </li>
              <li>
                <b>Fotos.</b> Sube la mejor calidad que tengas: el servidor las reduce y las convierte para que carguen rápido.
              </li>
              <li>
                <b>Videos.</b> Los archivos grandes se suben por partes. Para grabaciones largas, un enlace de YouTube carga más rápido para quien visita la web.
              </li>
              <li>
                <b>Nada se pierde.</b> Cada guardado deja una copia y las solicitudes de los formularios quedan en la bandeja además de llegar por correo.
              </li>
            </ul>
          </Tarjeta>
        </div>
      </div>
    </>
  );
}
