import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ErrorApi, get, post, type Maestro, type Usuario } from './api';
import { SITIO_BASE } from '../contenido/base';
import type { Sitio } from '../contenido/tipos';

/*
  Estado global del panel: la sesion, el contenido maestro (con borradores)
  y los avisos flotantes.

  El maestro se carga entero al entrar (es pequeno) y cada pantalla guarda
  la coleccion que toca. El servidor comprueba la version: si otra persona
  guardo entre medias, devuelve el maestro nuevo y se avisa.
*/

export type Coleccion = 'noticias' | 'categoriasNoticias' | 'recursos' | 'obraSocial' | 'imagenes';

export interface Aviso {
  id: number;
  tipo: 'ok' | 'error' | 'info';
  texto: string;
}

interface Estado {
  cargando: boolean;
  instalado: boolean;
  usuario: Usuario | null;
  maestro: Maestro | null;
  errorCarga: string;
  servidor: { php: string; escribible: boolean; gd: boolean } | null;
  avisos: Aviso[];
  avisar: (tipo: Aviso['tipo'], texto: string) => void;
  quitarAviso: (id: number) => void;
  entrar: (correo: string, clave: string) => Promise<void>;
  instalar: (nombre: string, correo: string, clave: string) => Promise<void>;
  salir: () => Promise<void>;
  recargarMaestro: () => Promise<void>;
  guardar: <K extends Coleccion>(coleccion: K, datos: Sitio[K], detalle?: string) => Promise<void>;
}

const Contexto = createContext<Estado | null>(null);

export function ProveedorEstado({ children }: { children: ReactNode }) {
  const [cargando, setCargando] = useState(true);
  const [instalado, setInstalado] = useState(true);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [maestro, setMaestro] = useState<Maestro | null>(null);
  const [errorCarga, setErrorCarga] = useState('');
  const [servidor, setServidor] = useState<{ php: string; escribible: boolean; gd: boolean } | null>(null);
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const contador = useRef(0);

  const avisar = useCallback((tipo: Aviso['tipo'], texto: string) => {
    const id = ++contador.current;
    setAvisos((a) => [...a, { id, tipo, texto }]);
    window.setTimeout(() => setAvisos((a) => a.filter((x) => x.id !== id)), tipo === 'error' ? 7000 : 3800);
  }, []);
  const quitarAviso = useCallback((id: number) => setAvisos((a) => a.filter((x) => x.id !== id)), []);

  const recargarMaestro = useCallback(async () => {
    const r = await get<{ maestro: Maestro }>('contenido', { accion: 'maestro' });
    let m = r.maestro;
    // primera vez: el contenido de partida es el que viene en la web
    if (!m.inicializado) {
      try {
        await post('contenido', { accion: 'inicializar', sitio: SITIO_BASE });
        m = (await get<{ maestro: Maestro }>('contenido', { accion: 'maestro' })).maestro;
      } catch (e) {
        if (!(e instanceof ErrorApi && e.codigo === 409)) throw e;
      }
    }
    setMaestro(m);
  }, []);

  // al abrir el panel: ¿hay sesion?
  useEffect(() => {
    (async () => {
      try {
        const s = await get<{ instalado: boolean; usuario: Usuario | null; servidor?: { php: string; escribible: boolean; gd: boolean } }>('sesion');
        setInstalado(s.instalado);
        setServidor(s.servidor ?? null);
        setUsuario(s.usuario);
        if (s.usuario) await recargarMaestro();
      } catch (e) {
        setErrorCarga(e instanceof Error ? e.message : 'No se pudo conectar con el servidor.');
      } finally {
        setCargando(false);
      }
    })();
  }, [recargarMaestro]);

  const entrar = useCallback(
    async (correo: string, clave: string) => {
      const r = await post<{ usuario: Usuario }>('sesion', { accion: 'entrar', correo, clave });
      setUsuario(r.usuario);
      await recargarMaestro();
    },
    [recargarMaestro],
  );

  const instalar = useCallback(
    async (nombre: string, correo: string, clave: string) => {
      const r = await post<{ usuario: Usuario }>('sesion', { accion: 'instalar', nombre, correo, clave });
      setInstalado(true);
      setUsuario(r.usuario);
      await recargarMaestro();
    },
    [recargarMaestro],
  );

  const salir = useCallback(async () => {
    try {
      await post('sesion', { accion: 'salir' });
    } finally {
      setUsuario(null);
      setMaestro(null);
    }
  }, []);

  const guardar = useCallback(
    async <K extends Coleccion>(coleccion: K, datos: Sitio[K], detalle = '') => {
      if (!maestro) throw new Error('El contenido no está cargado.');
      try {
        const r = await post<{ version: number; actualizado: string }>('contenido', {
          accion: 'guardar',
          coleccion,
          datos,
          version: maestro.version,
          detalle,
        });
        setMaestro({ ...maestro, [coleccion]: datos, version: r.version, actualizado: r.actualizado });
      } catch (e) {
        if (e instanceof ErrorApi && e.codigo === 409 && e.extra.maestro) {
          setMaestro(e.extra.maestro as Maestro);
        }
        if (e instanceof ErrorApi && e.codigo === 401) {
          setUsuario(null);
        }
        throw e;
      }
    },
    [maestro],
  );

  const valor = useMemo<Estado>(
    () => ({ cargando, instalado, usuario, maestro, errorCarga, servidor, avisos, avisar, quitarAviso, entrar, instalar, salir, recargarMaestro, guardar }),
    [cargando, instalado, usuario, maestro, errorCarga, servidor, avisos, avisar, quitarAviso, entrar, instalar, salir, recargarMaestro, guardar],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useEstado(): Estado {
  const e = useContext(Contexto);
  if (!e) throw new Error('useEstado fuera del proveedor');
  return e;
}

/** El maestro ya cargado (las pantallas internas solo se montan con sesion). */
export function useMaestro(): Maestro {
  const { maestro } = useEstado();
  if (!maestro) throw new Error('Contenido no cargado');
  return maestro;
}

/** Mensaje legible de cualquier error. */
export function mensajeDe(e: unknown): string {
  if (e instanceof ErrorApi) return e.message;
  if (e instanceof Error) return e.message;
  return 'Algo salió mal.';
}
