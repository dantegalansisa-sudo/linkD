import { useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { get, post, type Usuario } from '../api';
import { mensajeDe, useEstado } from '../estado';
import { AvisoEnLinea, Boton, Cabecera, Campo, Chip, Entrada, Interruptor, Selector, Vacio, haceCuanto } from '../ui/Basicos';
import { Modal, useConfirmar } from '../ui/Modal';

interface Formulario {
  id?: string;
  nombre: string;
  correo: string;
  rol: 'administrador' | 'editor';
  activo: boolean;
  clave: string;
}

/** Cuentas del panel (solo administradores). */
export default function Usuarios() {
  const { usuario: yo, avisar } = useEstado();
  const confirmar = useConfirmar();
  const [lista, setLista] = useState<Usuario[] | null>(null);
  const [form, setForm] = useState<Formulario | null>(null);
  const [clave, setClave] = useState<{ id: string; nombre: string; nueva: string } | null>(null);
  const [error, setError] = useState('');
  const [ocupado, setOcupado] = useState(false);

  const cargar = useCallback(() => {
    get<{ usuarios: Usuario[] }>('usuarios')
      .then((r) => setLista(r.usuarios))
      .catch((e) => avisar('error', mensajeDe(e)));
  }, [avisar]);

  useEffect(cargar, [cargar]);

  if (yo?.rol !== 'administrador') return <Navigate to="/" replace />;

  const guardarForm = async () => {
    if (!form) return;
    setError('');
    setOcupado(true);
    try {
      const r = form.id
        ? await post<{ usuarios: Usuario[] }>('usuarios', { accion: 'editar', ...form })
        : await post<{ usuarios: Usuario[] }>('usuarios', { accion: 'crear', ...form });
      setLista(r.usuarios);
      setForm(null);
      avisar('ok', form.id ? 'Usuario guardado.' : 'Usuario creado.');
    } catch (e) {
      setError(mensajeDe(e));
    } finally {
      setOcupado(false);
    }
  };

  const guardarClave = async () => {
    if (!clave) return;
    setError('');
    setOcupado(true);
    try {
      await post('usuarios', { accion: 'clave', id: clave.id, clave: clave.nueva });
      setClave(null);
      avisar('ok', 'Contraseña restablecida.');
    } catch (e) {
      setError(mensajeDe(e));
    } finally {
      setOcupado(false);
    }
  };

  const eliminar = async (u: Usuario) => {
    const ok = await confirmar({ titulo: 'Eliminar la cuenta', texto: `${u.nombre} dejará de poder entrar al panel.`, confirmar: 'Eliminar', peligro: true });
    if (!ok) return;
    try {
      const r = await post<{ usuarios: Usuario[] }>('usuarios', { accion: 'eliminar', id: u.id });
      setLista(r.usuarios);
      avisar('ok', 'Cuenta eliminada.');
    } catch (e) {
      avisar('error', mensajeDe(e));
    }
  };

  return (
    <>
      <Cabecera
        titulo="Usuarios"
        subtitulo="Quién puede entrar al panel. Los administradores gestionan usuarios y copias de seguridad; los editores publican contenido."
        acciones={
          <Boton
            variante="primario"
            icono="plus"
            onClick={() => {
              setForm({ nombre: '', correo: '', rol: 'editor', activo: true, clave: '' });
              setError('');
            }}
          >
            Nuevo usuario
          </Boton>
        }
      />

      {lista === null ? (
        <p className="adm-cargando-texto">Cargando…</p>
      ) : lista.length === 0 ? (
        <Vacio icono="users" titulo="No hay usuarios" />
      ) : (
        <ul className="adm-lista">
          {lista.map((u) => (
            <li className="adm-fila-lista" key={u.id}>
              <span className="adm-usuario__avatar adm-usuario__avatar--grande">{u.nombre.trim().charAt(0).toUpperCase()}</span>
              <div className="adm-fila-lista__texto">
                <span className="adm-fila-lista__titulo">
                  {u.nombre}
                  {u.id === yo.id && <small className="adm-tu"> (tú)</small>}
                </span>
                <span className="adm-fila-lista__meta">
                  {u.correo}
                  <i>·</i>
                  {u.ultimoAcceso ? `Último acceso ${haceCuanto(u.ultimoAcceso)}` : 'Nunca ha entrado'}
                </span>
              </div>
              <Chip tono={u.rol === 'administrador' ? 'azul' : 'gris'}>{u.rol === 'administrador' ? 'Administrador' : 'Editor'}</Chip>
              {!u.activo && <Chip tono="rojo">Desactivado</Chip>}
              <div className="adm-fila-lista__acciones">
                <Boton
                  pequeno
                  icono="key"
                  variante="fantasma"
                  onClick={() => {
                    setClave({ id: u.id, nombre: u.nombre, nueva: '' });
                    setError('');
                  }}
                >
                  Contraseña
                </Boton>
                <Boton
                  pequeno
                  icono="edit"
                  onClick={() => {
                    setForm({ id: u.id, nombre: u.nombre, correo: u.correo, rol: u.rol, activo: u.activo, clave: '' });
                    setError('');
                  }}
                >
                  Editar
                </Boton>
                {u.id !== yo.id && <Boton pequeno variante="fantasma" icono="trash" onClick={() => eliminar(u)} aria-label="Eliminar" />}
              </div>
            </li>
          ))}
        </ul>
      )}

      {form && (
        <Modal
          titulo={form.id ? 'Editar usuario' : 'Nuevo usuario'}
          onClose={() => setForm(null)}
          ancho="520px"
          pie={
            <>
              <Boton variante="fantasma" onClick={() => setForm(null)}>
                Cancelar
              </Boton>
              <Boton variante="primario" icono="save" cargando={ocupado} onClick={guardarForm}>
                Guardar
              </Boton>
            </>
          }
        >
          {error && <AvisoEnLinea tipo="error">{error}</AvisoEnLinea>}
          <Campo etiqueta="Nombre" obligatorio>
            <Entrada value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} autoFocus />
          </Campo>
          <Campo etiqueta="Correo electrónico" obligatorio ayuda="Es con lo que entra al panel.">
            <Entrada type="email" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} />
          </Campo>
          <Campo etiqueta="Rol">
            <Selector value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value as Formulario['rol'] })}>
              <option value="editor">Editor · publica contenido y sube medios</option>
              <option value="administrador">Administrador · además gestiona usuarios y copias</option>
            </Selector>
          </Campo>
          {!form.id && (
            <Campo etiqueta="Contraseña" obligatorio ayuda="Mínimo 8 caracteres. Podrá cambiarla desde Ajustes.">
              <Entrada type="text" value={form.clave} onChange={(e) => setForm({ ...form, clave: e.target.value })} autoComplete="off" />
            </Campo>
          )}
          {form.id && form.id !== yo.id && (
            <Interruptor activo={form.activo} onChange={(v) => setForm({ ...form, activo: v })} etiqueta="Cuenta activa" descripcion="Desactivada, no puede entrar pero conserva su historial." />
          )}
        </Modal>
      )}

      {clave && (
        <Modal
          titulo={`Nueva contraseña para ${clave.nombre}`}
          onClose={() => setClave(null)}
          ancho="460px"
          pie={
            <>
              <Boton variante="fantasma" onClick={() => setClave(null)}>
                Cancelar
              </Boton>
              <Boton variante="primario" icono="key" cargando={ocupado} onClick={guardarClave} disabled={clave.nueva.length < 8}>
                Restablecer
              </Boton>
            </>
          }
        >
          {error && <AvisoEnLinea tipo="error">{error}</AvisoEnLinea>}
          <Campo etiqueta="Contraseña nueva" ayuda="Mínimo 8 caracteres. Comunícasela en persona.">
            <Entrada type="text" value={clave.nueva} onChange={(e) => setClave({ ...clave, nueva: e.target.value })} autoComplete="off" autoFocus />
          </Campo>
        </Modal>
      )}
    </>
  );
}
