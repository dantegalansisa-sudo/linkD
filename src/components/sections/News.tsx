import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue } from 'framer-motion';
import Icon from '../ui/Icon';
import RevealText from '../ui/RevealText';
import { NEWS } from '../../data/site';
import { EASINGS } from '../../utils/easings';

/** Solo rotan en el destacado las noticias con imagen grande suficiente. */
const FEATURED = NEWS.filter((n) => n.featured);

/** Lo que tarda una noticia en ceder el destacado. */
const DURATION = 8000;

/**
 * Actualidad LINKDICOM (brief seccion 5).
 *
 * Izquierda: pieza destacada con barra de avance; al completarse cede el sitio
 * a la siguiente. Derecha: el resto de noticias. La lista muestra siempre las
 * OTRAS, asi que nunca se repite una noticia en pantalla.
 *
 * La barra existe para que el relevo no sorprenda: sin ella la lista se
 * reordenaba sola y el usuario perdia el hilo de lo que estaba leyendo.
 * Al pasar el raton por el panel se detiene, y se reanuda al salir.
 */
export default function News() {
  const [index, setIndex] = useState(0);
  const progress = useMotionValue(0);
  const paused = useRef(false);

  const active = FEATURED[index];
  const rest = NEWS.filter((n) => n.id !== active.id);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let elapsed = 0;
    let last = performance.now();
    progress.set(0);

    const step = (now: number) => {
      const dt = now - last;
      last = now;
      if (!paused.current) elapsed += dt;

      const p = Math.min(elapsed / DURATION, 1);
      progress.set(p);

      if (p >= 1) {
        setIndex((i) => (i + 1) % FEATURED.length);
        return;
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [index, progress]);

  return (
    <section className="section theme-dark news" id="actualidad">
      <div className="container container--wide">
        <div className="section-head news__head">
          <div className="section-head__main">
            <span className="eyebrow">Actualidad LINKDICOM</span>
            <RevealText tag="h2" className="section-title section-title--wide" highlight={['Innovación,']}>
              Innovación, proyectos y novedades que están transformando la salud digital
            </RevealText>
          </div>
          <a className="link-arrow" href="#actualidad">
            Ver todas las noticias
            <Icon name="arrow-right" size={15} strokeWidth={2.2} />
          </a>
        </div>

        <motion.div
          className="news__panel"
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.8, ease: EASINGS.premium }}
          onMouseEnter={() => { paused.current = true; }}
          onMouseLeave={() => { paused.current = false; }}
        >
          {/* ---------- Pieza destacada ---------- */}
          <article className="news__featured" aria-live="polite">
            <div className="news__featured-media">
              <AnimatePresence>
                <motion.img
                  key={active.id}
                  src={active.image}
                  alt={active.alt}
                  initial={{ opacity: 0, scale: 1.07 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ opacity: { duration: 0.65 }, scale: { duration: 9, ease: 'linear' } }}
                />
              </AnimatePresence>
            </div>

            {/* el velo cubre la tarjeta entera, no solo la caja de la foto:
                si vive dentro del media deja una costura en su borde izquierdo */}
            <span className="news__featured-veil" />

            <div className="news__featured-body">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.42, ease: EASINGS.premium }}
                >
                  <span className="news-tag" style={{ '--tag': active.color } as React.CSSProperties}>
                    {active.category}
                  </span>
                  <h3 className="news__featured-title">{active.title}</h3>
                  <p className="news__featured-text">{active.excerpt}</p>
                  <a className="link-arrow news__featured-cta" href={active.href}>
                    {active.cta}
                    <Icon name="arrow-right" size={15} strokeWidth={2.2} />
                  </a>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="news__dots" role="tablist" aria-label="Noticias destacadas">
              {FEATURED.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={item.title}
                  className={`news__dot${i === index ? ' is-active' : ''}`}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>

            {/* avance hasta el relevo */}
            <div className="news__progress" aria-hidden="true">
              <motion.span className="news__progress-bar" style={{ scaleX: progress }} />
            </div>
          </article>

          {/* ---------- Resto de noticias ---------- */}
          <div className="news__list">
            <AnimatePresence initial={false} mode="popLayout">
              {rest.map((item, i) => (
                <motion.a
                  key={item.id}
                  href={item.href}
                  className="news-row"
                  layout
                  initial={{ opacity: 0, x: 26 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -26 }}
                  transition={{ duration: 0.45, delay: i * 0.06, ease: EASINGS.premium }}
                >
                  <div className="news-row__body">
                    <div className="news-row__meta">
                      <span className="news-tag" style={{ '--tag': item.color } as React.CSSProperties}>
                        {item.category}
                      </span>
                      {item.date && <time className="news-row__date">{item.date}</time>}
                    </div>
                    <h3 className="news-row__title">{item.title}</h3>
                    <span className="link-arrow news-row__cta">
                      {item.cta}
                      <Icon name="arrow-right" size={14} strokeWidth={2.2} />
                    </span>
                  </div>

                  <div className="news-row__thumb">
                    <img src={item.image} alt={item.alt} loading="lazy" />
                  </div>
                </motion.a>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
