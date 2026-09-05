import { useRef, useState, type ReactNode, type MouseEvent } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  strength?: number;
  ariaLabel?: string;
  target?: string;
  block?: boolean;
  /** 'submit' para los botones que envian un formulario. */
  type?: 'button' | 'submit';
}

export default function MagneticButton({
  children,
  href,
  onClick,
  className = 'btn btn--primary',
  strength = 0.3,
  ariaLabel,
  target,
  block = false,
  type = 'button',
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({
      x: (e.clientX - (r.left + r.width / 2)) * strength,
      y: (e.clientY - (r.top + r.height / 2)) * strength,
    });
  };

  const reset = () => setPos({ x: 0, y: 0 });

  const inner = (
    <motion.span
      className={className}
      style={{ display: block ? 'flex' : 'inline-flex' }}
      whileHover={{ scale: 1.035 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
    >
      <span className="btn__label">{children}</span>
    </motion.span>
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 190, damping: 17, mass: 0.5 }}
      style={{ display: block ? 'block' : 'inline-block' }}
    >
      {href ? (
        <a
          href={href}
          onClick={onClick}
          aria-label={ariaLabel}
          target={target}
          rel={target === '_blank' ? 'noreferrer noopener' : undefined}
          style={{ display: block ? 'block' : 'inline-block' }}
        >
          {inner}
        </a>
      ) : (
        <button type={type} onClick={onClick} aria-label={ariaLabel} style={{ display: block ? 'block' : 'inline-block', width: block ? '100%' : undefined }}>
          {inner}
        </button>
      )}
    </motion.div>
  );
}
