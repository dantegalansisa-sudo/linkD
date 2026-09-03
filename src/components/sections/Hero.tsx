import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Icon from '../ui/Icon';
import MagneticButton from '../ui/MagneticButton';
import RevealText from '../ui/RevealText';
import { EASINGS } from '../../utils/easings';

/**
 * Hero con la fotografia real de la sede.
 *
 * La foto ocupa el 100% del ancho; el contraste del texto lo da `.hero__veil`
 * (velo horizontal + vertical), no una caja de fondo. El movimiento viene de
 * un Ken Burns lento, parallax al hacer scroll y el resplandor del rotulo.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const mediaY = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 56]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section className="hero" id="top" ref={ref}>
      <motion.div className="hero__media" style={{ y: mediaY }}>
        <motion.img
          src="/img/heros.png"
          alt="Sede corporativa de LINKDICOM en Santo Domingo Este al anochecer"
          initial={{ scale: 1.12, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: EASINGS.premium }}
        />

        {/* respiracion lenta del rotulo iluminado */}
        <motion.span
          className="hero__sign-glow"
          animate={{ opacity: [0.45, 0.85, 0.45], scale: [1, 1.07, 1] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/*
          Barrido de luz que recorre la fachada cada 9 segundos.
          Tarda 2,4s en cruzar y descansa el resto: si fuese continuo cansaria.
        */}
        <motion.span
          className="hero__sheen"
          animate={{ x: ['-180%', '400%'] }}
          transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 6.6, ease: 'easeInOut' }}
        />

        {/*
          El rotulo da un doble parpadeo de neon justo cuando el barrido pasa
          por encima (al 14% del ciclo), asi los dos efectos se leen como uno.
        */}
        <motion.span
          className="hero__sign-flash"
          animate={{
            opacity: [0, 0, 1, 0.25, 0.85, 0.1, 0],
            scale: [0.9, 0.9, 1.35, 1.08, 1.28, 0.98, 0.9],
          }}
          transition={{
            duration: 9,
            times: [0, 0.11, 0.15, 0.18, 0.21, 0.26, 0.34],
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />

        <div className="hero__veil" />
      </motion.div>

      <motion.div
        className="container container--wide hero__inner"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="hero__content">
          <motion.span
            className="hero__kicker"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: EASINGS.premium }}
          >
            Plataforma de salud inteligente
          </motion.span>

          <RevealText
            tag="h1"
            className="hero__title"
            delay={0.36}
            stagger={0.05}
            highlight={['tecnología', 'inteligente']}
          >
            Transformamos instituciones de salud con tecnología inteligente
          </RevealText>

          <motion.p
            className="hero__lead"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: EASINGS.premium }}
          >
            Un ecosistema completo que conecta pacientes, médicos, imágenes diagnósticas,
            procesos administrativos e inteligencia artificial en una sola plataforma.
          </motion.p>

          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.94, ease: EASINGS.premium }}
          >
            <MagneticButton href="#contacto" className="btn btn--primary btn--square btn--lg">
              Solicitar Demo
              <span className="btn__arrow">
                <Icon name="arrow-right" size={17} strokeWidth={2.2} />
              </span>
            </MagneticButton>

            <MagneticButton href="#ecosistema" className="btn btn--outline btn--square btn--lg" strength={0.24}>
              Conocer la Plataforma
              <span className="btn__play">
                <Icon name="play" size={11} />
              </span>
            </MagneticButton>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
