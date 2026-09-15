import { useCallback, useEffect, useState } from 'react';
import Icon, { type IconName } from '../../components/ui/Icon';
import { get, post, type Solicitud } from '../api';
import { mensajeDe, useEstado } from '../estado';
import { Boton, Buscador, Cabecera, Chip, Pestanas, Vacio, fechaHora, haceCuanto } from '../ui/Basicos';
import { useConfirmar } from '../ui/Modal';

const TIPOS: Record<string, { label: string; icon: IconName }> = {
  demo: { label: 'Solicitud de demo', icon: 'monitor' },
  contacto: { label: 'Mensaje de contacto', icon: 'mail' },
  empleo: { label: 'Postulación', icon: 'briefcase' },
  donacion: { label: 'Aporte a la obra social', icon: 'heart' },
  boletin: { label: 'Suscripción al boletín', icon: 'newspaper' },
};

const ETIQUETAS: Record<string, string> = {
  nombre: 'Nombre',
  correo: 'Correo',
  telefono: 'Teléfono',
  institucion: 'Institución',
  empresa: 'Empresa',
  cargo: 'Cargo',
  solucion: 'Solución de interés',
  motivo: 'Tipo de consulta',
  mensaje: 'Mensaje',
  ubicacion: 'Ciudad / Provincia',
  vacante: 'Vacante',
  evento: 'Evento',
  tipos: 'Cómo quiere ayudar',
  detalle: 'Detalle',
};

/** Bandeja de lo que llega por los formularios de la web. */
export default function Solicitudes() {
  const { avisar } = useEstado();
  const confirmar = useConfirmar();
  const [lista, setLista] = useState<Solicitud[] | null>(null);
  const [filtro, setFiltro] = useState<'nueva' | 'atendida' | 'todas'>('nueva');
  const [q, setQ] = useState('');
  const [abierta, setAbierta] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState('');

  const cargar = useCallback(() => {
    get<{ solicitudes: Solicitud[] }>('solicitudes')
      .then((r) => setLista(r.solicitudes))
      .catch((e) => avisar('error', mensajeDe(e)));
  }, [avisar]);

  useEffect(cargar, [cargar]);

  const cambiarEstado = async (s: Solicitud, estado: 'nueva' | 'atendida') => {
    setOcupado(s.id);
    try {
      const r = await post<{ solicitud: Solicitud }>('solicitudes', { accion: 'estado', id: s.id, estado });
      setLista((l) => (l ? l.map((x) => (x.id === s.id ? r.solicitud : x)) : l));
    } catch (e) {
      avisar('error', mensajeDe(e));
    } finally {
      setOcupado('');
    }
  };

  const eliminar = async (s: Solicitud) => {
    const ok = await confirmar({ titulo: 'Eliminar la solicitud', texto: 'Se borrará de la bandeja (el correo que se envió no se ve afectado).', confirmar: 'Eliminar', peligro: true });
    if (!ok) return;
    try {
      await post('solicitudes', { accion: 'eliminar', id: s.id });
      setLista((l) => (l ? l.filter((x) => x.id !== s.id) : l));
      if (abierta === s.id) setAbierta(null);
    } catch (e) {
      avisar('error', mensajeDe(e));
    }
  };

  const filtradas = (lista ?? []).filter((s) => {
    if (filtro !== 'todas' && (s.estado ?? 'nueva') !== filtro) return false;
    if (q) {
      const texto = `${s.tipo} ${Object.values(s.datos).join(' ')}`.toLowerCase();
      if (!texto.includes(q.toLowerCase())) return false;
    }
    return true;
  });
  const nuevas = (lista ?? []).filter((s) => (s.estado ?? 'nueva') === 'nueva').length;

  return (
    <>
      <Cabecera
        titulo="Solicitudes"
        subtitulo="Todo lo que llega por los formularios de la web. Cada una se envió también por correo a info@link-dicom.com; aquí queda el registro para no perder ninguna."
        acciones={
          <Boton icono="refresh" onClick={cargar}>
            Actualizar
          </Boton>
        }
      />

      <div className="adm-barra">
        <Pestanas
          valor={filtro}
          onChange={setFiltro}
          opciones={[
            { clave: 'nueva', label: 'Sin atender', total: nuevas },
            { clave: 'atendida', label: 'Atendidas', total: (lista ?? []).length - nuevas },
            { clave: 'todas', label: 'Todas', total: (lista ?? []).length },
          ]}
        />
        <Buscador valor={q} onChange={setQ} placeholder="Buscar por nombre, correo, texto…" />
      </div>

      {lista === null ? (
        <p className="adm-cargando-texto">Cargando…</p>
      ) : filtradas.length === 0 ? (
        <Vacio icono="inbox" titulo={filtro === 'nueva' ? 'No hay solicitudes pendientes' : 'Nada por aquí'} texto={filtro === 'nueva' ? 'Cuando alguien rellene un formulario de la web, aparecerá aquí.' : undefined} />
      ) : (
        <ul className="adm-solicitudes">
          {filtradas.map((s) => {
            const t = TIPOS[s.tipo] ?? { label: s.tipo, icon: 'mail' as IconName };
            const quien = s.datos.nombre || s.datos.correo || '—';
            const abiertaEsta = abierta === s.id;
            return (
              <li key={s.id} className={`adm-solicitud${s.estado === 'atendida' ? ' is-atendida' : ''}${abiertaEsta ? ' is-abierta' : ''}`}>
                <button type="button" className="adm-solicitud__cabeza" onClick={() => setAbierta(abiertaEsta ? null : s.id)}>
                  <span className="adm-solicitud__icono">
                    <Icon name={t.icon} size={18} strokeWidth={1.8} />
                  </span>
                  <span className="adm-solicitud__texto">
                    <b>{quien}</b>
                    <small>
                      {t.label}
                      {s.origen ? ` · ${s.origen}` : ''}
                    </small>
                  </span>
                  <span className="adm-solicitud__estado">
                    {!s.correoEnviado && <Chip tono="rojo">Correo no enviado</Chip>}
                    <Chip tono={s.estado === 'atendida' ? 'verde' : 'naranja'}>{s.estado === 'atendida' ? 'Atendida' : 'Nueva'}</Chip>
                    <time title={fechaHora(s.fecha)}>{haceCuanto(s.fecha)}</time>
                    <Icon name="chevron-down" size={16} strokeWidth={2} />
                  </span>
                </button>
                {abiertaEsta && (
                  <div className="adm-solicitud__detalle">
                    <dl className="adm-datos">
                      {Object.entries(s.datos)
                        .filter(([, v]) => v)
                        .map(([k, v]) => (
                          <div key={k}>
                            <dt>{ETIQUETAS[k] ?? k}</dt>
                            <dd>
                              {k === 'correo' ? <a href={`mailto:${v}`}>{v}</a> : k === 'telefono' ? <a href={`tel:${v}`}>{v}</a> : v}
                            </dd>
                          </div>
                        ))}
                      <div>
                        <dt>Recibida</dt>
                        <dd>{fechaHora(s.fecha)}</dd>
                      </div>
                      {s.estado === 'atendida' && s.atendidaPor && (
                        <div>
                          <dt>Atendida</dt>
                          <dd>
                            por {s.atendidaPor}, {fechaHora(s.atendidaEl ?? '')}
                          </dd>
                        </div>
                      )}
                    </dl>
                    <div className="adm-solicitud__acciones">
                      {s.datos.correo && (
                        <a className="adm-boton adm-boton--secundario adm-boton--pequeno" href={`mailto:${s.datos.correo}?subject=${encodeURIComponent('Re: ' + t.label + ' · LINKDICOM')}`}>
                          <Icon name="mail" size={15} strokeWidth={2} />
                          Responder por correo
                        </a>
                      )}
                      {s.datos.telefono && (
                        <a className="adm-boton adm-boton--secundario adm-boton--pequeno" href={`https://wa.me/${s.datos.telefono.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">
                          <Icon name="whatsapp" size={15} />
                          WhatsApp
                        </a>
                      )}
                      <span className="adm-modal__hueco" />
                      {s.estado === 'atendida' ? (
                        <Boton pequeno variante="fantasma" icono="refresh" cargando={ocupado === s.id} onClick={() => cambiarEstado(s, 'nueva')}>
                          Marcar como nueva
                        </Boton>
                      ) : (
                        <Boton pequeno variante="primario" icono="check" cargando={ocupado === s.id} onClick={() => cambiarEstado(s, 'atendida')}>
                          Marcar como atendida
                        </Boton>
                      )}
                      <Boton pequeno variante="fantasma" icono="trash" onClick={() => eliminar(s)} aria-label="Eliminar" />
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
