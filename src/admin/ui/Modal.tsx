import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../../components/ui/Icon';
import { Boton } from './Basicos';

/* ============================================================
   Modal del panel y dialogo de confirmacion
   ============================================================ */

export function Modal({
  titulo,
  onClose,
  ancho = '720px',
  children,
  pie,
}: {
  titulo: ReactNode;
  onClose: () => void;
  ancho?: string;
  children: ReactNode;
  pie?: ReactNode;
}) {
  const caja = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previo = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const teclas = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', teclas);
    caja.current?.focus();
    return () => {
      window.removeEventListener('keydown', teclas);
      document.body.style.overflow = previo;
    };
  }, [onClose]);

  return createPortal(
    <div
      className="adm-modal"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="adm-modal__caja" style={{ maxWidth: ancho }} role="dialog" aria-modal="true" ref={caja} tabIndex={-1}>
        <header className="adm-modal__cabeza">
          <h2>{titulo}</h2>
          <button type="button" className="adm-modal__cerrar" onClick={onClose} aria-label="Cerrar">
            <Icon name="close" size={18} strokeWidth={2.2} />
          </button>
        </header>
        <div className="adm-modal__cuerpo">{children}</div>
        {pie && <footer className="adm-modal__pie">{pie}</footer>}
      </div>
    </div>,
    document.body,
  );
}

/* ---------- confirmar ---------- */

interface Peticion {
  titulo: string;
  texto?: ReactNode;
  confirmar?: string;
  peligro?: boolean;
  resolver: (ok: boolean) => void;
}

const ContextoConfirmar = createContext<((p: Omit<Peticion, 'resolver'>) => Promise<boolean>) | null>(null);

export function ProveedorConfirmar({ children }: { children: ReactNode }) {
  const [peticion, setPeticion] = useState<Peticion | null>(null);

  const confirmar = useCallback(
    (p: Omit<Peticion, 'resolver'>) =>
      new Promise<boolean>((resolver) => {
        setPeticion({ ...p, resolver });
      }),
    [],
  );

  const cerrar = (ok: boolean) => {
    peticion?.resolver(ok);
    setPeticion(null);
  };

  return (
    <ContextoConfirmar.Provider value={confirmar}>
      {children}
      {peticion && (
        <Modal titulo={peticion.titulo} onClose={() => cerrar(false)} ancho="460px"
          pie={
            <>
              <Boton variante="fantasma" onClick={() => cerrar(false)}>
                Cancelar
              </Boton>
              <Boton variante={peticion.peligro ? 'peligro' : 'primario'} onClick={() => cerrar(true)} autoFocus>
                {peticion.confirmar ?? 'Confirmar'}
              </Boton>
            </>
          }
        >
          {peticion.texto && <p className="adm-modal__texto">{peticion.texto}</p>}
        </Modal>
      )}
    </ContextoConfirmar.Provider>
  );
}

export function useConfirmar() {
  const c = useContext(ContextoConfirmar);
  if (!c) throw new Error('useConfirmar fuera del proveedor');
  return c;
}
