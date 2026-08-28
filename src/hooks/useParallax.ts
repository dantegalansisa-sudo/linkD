import { useRef } from 'react';
import { useScroll, useTransform, useSpring, type MotionValue } from 'framer-motion';

/**
 * Parallax vertical suave atado al recorrido del elemento por el viewport.
 * `distance` es el desplazamiento total en px (se reparte -d/2 .. +d/2).
 */
export function useParallax(distance = 80) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const raw = useTransform(scrollYProgress, [0, 1], [-distance / 2, distance / 2]);
  const y = useSpring(raw, { stiffness: 90, damping: 26, mass: 0.35 });
  return { ref, y, progress: scrollYProgress } as {
    ref: React.RefObject<HTMLDivElement>;
    y: MotionValue<number>;
    progress: MotionValue<number>;
  };
}
