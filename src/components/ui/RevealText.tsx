import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { EASINGS } from '../../utils/easings';

type Tag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';

interface RevealTextProps {
  children: string;
  className?: string;
  delay?: number;
  tag?: Tag;
  /** Palabras que se pintan con el gradiente naranja de marca. */
  highlight?: string[];
  /** Palabras que se pintan con el gradiente azul tecnologico. */
  highlightTech?: string[];
  stagger?: number;
  id?: string;
}

const clean = (w: string) => w.replace(/[.,;:!?¿¡]/g, '').toLowerCase();

const wordVariants = {
  hidden: { y: '112%', rotate: 2.5 },
  visible: {
    y: 0,
    rotate: 0,
    transition: { duration: 0.85, ease: EASINGS.premium },
  },
};

/**
 * Titular que se revela palabra por palabra desde debajo de una mascara.
 *
 * Importante: el disparador `whileInView` vive en el contenedor, nunca en la
 * palabra. La palabra arranca desplazada 112% fuera de su mascara
 * `overflow:hidden`, asi que el IntersectionObserver la veria siempre con
 * ratio 0 y la animacion no se dispararia jamas.
 */
export default function RevealText({
  children,
  className = '',
  delay = 0,
  tag: Tag = 'h2',
  highlight = [],
  highlightTech = [],
  stagger = 0.06,
  id,
}: RevealTextProps) {
  const words = children.split(' ');
  const hi = highlight.map(clean);
  const tech = highlightTech.map(clean);
  const MotionTag = motion[Tag];

  return (
    <MotionTag
      className={className}
      id={id}
      style={{ display: 'flex', flexWrap: 'wrap', columnGap: '0.28em' }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {words.map((word, i) => {
        const key = clean(word);
        const cls = hi.includes(key) ? 'text-gradient' : tech.includes(key) ? 'text-gradient-tech' : undefined;
        return (
          <span
            key={`${word}-${i}`}
            style={{ overflow: 'hidden', display: 'inline-block', paddingBottom: '0.1em' }}
          >
            <motion.span
              className={cls}
              style={{ display: 'inline-block', willChange: 'transform' }}
              variants={wordVariants}
            >
              {word}
            </motion.span>
          </span>
        );
      })}
    </MotionTag>
  );
}

/** Envoltorio simple para bloques que solo necesitan fade + subida. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  amount = 0.2,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.75, delay, ease: EASINGS.premium }}
    >
      {children}
    </motion.div>
  );
}
