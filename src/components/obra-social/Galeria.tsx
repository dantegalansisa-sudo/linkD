import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '../ui/Icon';
import type { PiezaGaleria } from '../../data/eventos-obra-social';
import { cardVariants, containerVariants, VIEWPORT } from '../../utils/easings';

type Filtro = 'todas' | 'foto' | 'video';

/**
 * Galeria de una jornada: pestanas Todas / Fotos / Videos, rejilla de
 * miniaturas y un visor a pantalla completa con flechas.
 *
 * Las fotos son verticales (de telefono): en la rejilla se recortan a
 * cuadrado y en el visor se ven enteras.
 */
export default function Galeria({ piezas }: { piezas: PiezaGaleria[] }) {
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const [abierta, setAbierta] = useState<number | null>(null);

  const visibles = filtro === 'todas' ? piezas : piezas.filter((p) => p.tipo === filtro);
  const fotos = piezas.filter((p) => p.tipo === 'foto').length;
  const videos = piezas.length - fotos;

  const mover = useCallback(
    (paso: number) => setAbierta((i) => (i === null ? null : (i + paso + visibles.length) % visibles.length)),
    [visibles.length],
  );

  useEffect(() => {
    if (abierta === null) return;
    const previo = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const teclas = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierta(null);
      if (e.key === 'ArrowRight') mover(1);
      if (e.key === 'ArrowLeft') mover(-1);
    };
    window.addEventListener('keydown', teclas);
    return () => {
      window.removeEventListener('keydown', teclas);
      document.body.style.overflow = previo;
    };
  }, [abierta, mover]);

  const actual = abierta === null ? null : visibles[abierta];

  return (
    <>
      <div className="galeria__pestanas" role="tablist" aria-label="Filtrar la galería">
        {(
          [
            ['todas', 'Todas', piezas.length, 'layers'],
            ['foto', 'Fotos', fotos, 'image'],
            ['video', 'Videos', videos, 'play'],
          ] as const
        ).map(([clave, label, total, icon]) => (
          <button
            key={clave}
            type="button"
            role="tab"
            aria-selected={filtro === clave}
            className={`galeria__pestana${filtro === clave ? ' is-activa' : ''}`}
            onClick={() => setFiltro(clave)}
          >
            <Icon name={icon} size={15} strokeWidth={2} />
            {label} ({total})
          </button>
        ))}
      </div>

      <motion.ul
        className="galeria__rejilla"
        key={filtro}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      >
        {visibles.map((p, i) => (
          <motion.li key={p.src} variants={cardVariants}>
            <button type="button" className="galeria__pieza" onClick={() => setAbierta(i)} aria-label={`Ver ${p.alt}`}>
              <img src={p.tipo === 'video' ? p.poster : p.src} alt={p.alt} loading="lazy" />
              {p.tipo === 'video' && (
                <span className="galeria__play" aria-hidden="true">
                  <Icon name="play" size={16} />
                </span>
              )}
            </button>
          </motion.li>
        ))}
      </motion.ul>

      <AnimatePresence>
        {actual && (
          <motion.div
            className="visor"
            role="dialog"
            aria-modal="true"
            aria-label={actual.alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setAbierta(null);
            }}
          >
            <button className="visor__cerrar" type="button" onClick={() => setAbierta(null)} aria-label="Cerrar">
              <Icon name="close" size={20} strokeWidth={2.2} />
            </button>
            {visibles.length > 1 && (
              <>
                <button className="visor__flecha visor__flecha--izq" type="button" onClick={() => mover(-1)} aria-label="Anterior">
                  <Icon name="chevron-right" size={26} strokeWidth={2.2} />
                </button>
                <button className="visor__flecha visor__flecha--der" type="button" onClick={() => mover(1)} aria-label="Siguiente">
                  <Icon name="chevron-right" size={26} strokeWidth={2.2} />
                </button>
              </>
            )}
            <motion.figure
              key={actual.src}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.28 }}
            >
              {actual.tipo === 'video' ? (
                <video src={actual.src} poster={actual.poster} controls autoPlay playsInline />
              ) : (
                <img src={actual.src} alt={actual.alt} />
              )}
              <figcaption>
                {abierta! + 1} / {visibles.length}
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
