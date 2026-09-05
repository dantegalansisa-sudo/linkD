import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import ModalDemo from './ModalDemo';
import ModalVideo from './ModalVideo';

type Abierto = 'demo' | 'video' | null;

interface Contexto {
  abrirDemo: (origen?: string) => void;
  abrirVideo: () => void;
  cerrar: () => void;
}

const ModalesContexto = createContext<Contexto | null>(null);

/**
 * Los dos modales del sitio viven aqui, montados una sola vez sobre todas las
 * paginas, para que cualquier boton de "Solicitar Demo" pueda abrirlos.
 */
export function ProveedorModales({ children }: { children: ReactNode }) {
  const [abierto, setAbierto] = useState<Abierto>(null);
  // de donde salio la peticion: viaja en el mensaje para saber que le interesa
  const [origen, setOrigen] = useState<string | undefined>(undefined);

  const cerrar = useCallback(() => setAbierto(null), []);

  const valor = useMemo<Contexto>(
    () => ({
      abrirDemo: (de?: string) => {
        setOrigen(de);
        setAbierto('demo');
      },
      abrirVideo: () => setAbierto('video'),
      cerrar,
    }),
    [cerrar],
  );

  return (
    <ModalesContexto.Provider value={valor}>
      {children}
      <AnimatePresence>
        {abierto === 'demo' && <ModalDemo key="demo" origen={origen} onClose={cerrar} />}
        {abierto === 'video' && <ModalVideo key="video" onClose={cerrar} />}
      </AnimatePresence>
    </ModalesContexto.Provider>
  );
}

export function useModales() {
  const ctx = useContext(ModalesContexto);
  if (!ctx) throw new Error('useModales necesita estar dentro de <ProveedorModales>');
  return ctx;
}
