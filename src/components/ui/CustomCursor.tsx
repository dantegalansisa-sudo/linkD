import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const INTERACTIVE = 'a, button, [data-cursor="hover"], input, select, textarea';

export default function CustomCursor() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const ringRef = useRef<HTMLDivElement>(null);

  const ringX = useSpring(x, { damping: 24, stiffness: 260, mass: 0.4 });
  const ringY = useSpring(y, { damping: 24, stiffness: 260, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    document.body.classList.add('has-custom-cursor');

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = (e.target as HTMLElement | null)?.closest?.(INTERACTIVE);
      ringRef.current?.classList.toggle('is-hover', Boolean(el));
    };
    const down = () => ringRef.current?.classList.add('is-down');
    const up = () => ringRef.current?.classList.remove('is-down');
    const leave = () => {
      x.set(-200);
      y.set(-200);
    };

    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    document.addEventListener('mouseleave', leave);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
      document.removeEventListener('mouseleave', leave);
    };
  }, [x, y]);

  return (
    <>
      <motion.div className="cursor-dot" style={{ x, y, translateX: '-50%', translateY: '-50%' }} />
      <motion.div
        ref={ringRef}
        className="cursor-ring"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
      />
    </>
  );
}
