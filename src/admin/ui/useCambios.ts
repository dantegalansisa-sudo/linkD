import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * Estado de un formulario de edicion con control de cambios sin guardar:
 * avisa al cerrar la pestana y permite preguntar antes de salir.
 */
export function useCambios<T>(inicial: T) {
  const [valor, setValor] = useState<T>(inicial);
  const [guardado, setGuardado] = useState<string>(() => JSON.stringify(inicial));

  const sucio = useMemo(() => JSON.stringify(valor) !== guardado, [valor, guardado]);

  useEffect(() => {
    if (!sucio) return;
    const aviso = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', aviso);
    return () => window.removeEventListener('beforeunload', aviso);
  }, [sucio]);

  const cambiar = useCallback(<K extends keyof T>(clave: K, v: T[K]) => setValor((x) => ({ ...x, [clave]: v })), []);
  const marcarGuardado = useCallback((v?: T) => {
    setGuardado(JSON.stringify(v ?? valor));
    if (v) setValor(v);
  }, [valor]);

  return { valor, setValor, cambiar, sucio, marcarGuardado };
}
