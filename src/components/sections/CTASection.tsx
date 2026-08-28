import { motion } from 'framer-motion';
import Icon from '../ui/Icon';
import MagneticButton from '../ui/MagneticButton';
import RevealText from '../ui/RevealText';
import { CONTACT } from '../../data/site';

export default function CTASection() {
  return (
    <section className="section theme-dark" id="contacto">
      <div className="container container--wide">
        <div className="cta">
          <div className="tech-grid" />
          <motion.div
            className="aurora aurora--orange"
            style={{ width: 420, height: 420, right: '-6%', top: '-40%' }}
            animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="cta__inner">
            <div>
              <RevealText tag="h2" className="cta__title" highlight={['transformar']}>
                ¿Listo para transformar tu institución de salud?
              </RevealText>
              <p className="cta__p">
                Solicita una demostración personalizada y descubre cómo LINKDICOM puede ayudarte a
                optimizar procesos, mejorar la experiencia del paciente y tomar decisiones basadas en datos.
              </p>
            </div>

            <div className="cta__actions">
              <MagneticButton href={CONTACT.whatsapp} target="_blank" className="btn btn--primary btn--lg">
                Solicitar demo gratuita
                <span className="btn__arrow">
                  <Icon name="arrow-right" size={17} strokeWidth={2.2} />
                </span>
              </MagneticButton>

              <MagneticButton
                href={CONTACT.whatsapp}
                target="_blank"
                className="btn btn--ghost btn--lg"
                strength={0.24}
              >
                Hablar por WhatsApp
                <Icon name="whatsapp" size={18} />
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
