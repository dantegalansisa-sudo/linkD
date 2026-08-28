import { useCallback } from 'react';

/**
 * Halo radial que sigue al cursor dentro de una card.
 * Escribe --mx / --my en el elemento; el CSS los consume en .card__spot.
 */
export function useSpotlight() {
  return useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  }, []);
}
