import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ModalVideo from './ModalVideo';

interface Contexto {
  /** Lleva a la pagina de solicitud, con la solucion ya preseleccionada. */
  abrirDemo: (interes?: string) => void;
  abrirVideo: () => void;
  cerrar: () => void;
}

const ModalesContexto = createContext<Contexto | null>(null);

/**
 * El video vive aqui, montado una sola vez sobre todas las paginas.
 *
 * La solicitud de demo ya no es un modal: tiene pagina propia en
 * /solicitar-demo, para poder enlazarla desde campanas y correos y para que
 * los datos lleguen al servidor en lugar de a un chat.
 */
export function ProveedorModales({ children }: { children: ReactNode }) {
  const [video, setVideo] = useState(false);
  const navegar = useNavigate();

  const cerrar = useCallback(() => setVideo(false), []);

  const valor = useMemo<Contexto>(
    () => ({
      abrirDemo: (interes?: string) =>
        navegar(interes ? `/solicitar-demo?interes=${encodeURIComponent(interes)}` : '/solicitar-demo'),
      abrirVideo: () => setVideo(true),
      cerrar,
    }),
    [cerrar, navegar],
  );

  return (
    <ModalesContexto.Provider value={valor}>
      {children}
      <AnimatePresence>{video && <ModalVideo key="video" onClose={cerrar} />}</AnimatePresence>
    </ModalesContexto.Provider>
  );
}

export function useModales() {
  const ctx = useContext(ModalesContexto);
  if (!ctx) throw new Error('useModales necesita estar dentro de <ProveedorModales>');
  return ctx;
}
