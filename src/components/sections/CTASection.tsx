import { motion } from 'framer-motion';
import Icon from '../ui/Icon';
import MagneticButton from '../ui/MagneticButton';
import RevealText from '../ui/RevealText';
import { CONTACT } from '../../data/site';

/** Cierre a sangre completa (brief seccion 11). */
export default function CTASection() {
  return (
    <section className="section theme-dark cta" id="contacto">
      <div className="tech-grid" />
      <motion.div
        className="aurora aurora--orange"
        style={{ width: 520, height: 520, right: '-4%', top: '-44%' }}
        animate={{ x: [0, -46, 0], y: [0, 34, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="container container--wide cta__inner">
        <div>
          <RevealText tag="h2" className="cta__title" highlight={['conectar', 'y', 'avanzar?']}>
            ¿Listo para conectar y avanzar?
          </RevealText>
          <p className="cta__p">
            Solicita una demostración personalizada y descubre cómo LINKDICOM puede ayudarte a
            optimizar procesos, mejorar la experiencia del paciente y tomar decisiones basadas en datos.
          </p>
        </div>

        <div className="cta__actions">
          <MagneticButton href={CONTACT.whatsapp} target="_blank" className="btn btn--primary btn--square btn--lg">
            Solicitar Demo Gratuita
            <span className="btn__arrow">
              <Icon name="arrow-right" size={17} strokeWidth={2.2} />
            </span>
          </MagneticButton>

          <MagneticButton
            href={CONTACT.whatsapp}
            target="_blank"
            className="btn btn--outline btn--square btn--lg"
            strength={0.24}
          >
            Hablar por WhatsApp
            <Icon name="whatsapp" size={18} />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
