export const EASINGS = {
  premium: [0.76, 0, 0.24, 1],
  smooth: [0.25, 0.8, 0.25, 1],
  bounce: [0.34, 1.56, 0.64, 1],
  snappy: [0.4, 0, 0.2, 1],
  cinematic: [0.86, 0, 0.07, 1],
} as const;

/** Variants de contenedor para grids escalonados. */
export const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.075, delayChildren: 0.08 },
  },
};

/** Variants de item para cards dentro de un grid escalonado. */
export const cardVariants = {
  hidden: { opacity: 0, y: 42, scale: 0.965 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease: EASINGS.premium },
  },
};

/** Entrada simple hacia arriba. */
export const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASINGS.premium },
  },
};

export const VIEWPORT = { once: true, amount: 0.2 } as const;
