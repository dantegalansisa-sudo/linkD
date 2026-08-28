import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Icon from '../ui/Icon';
import MagneticButton from '../ui/MagneticButton';
import NetworkCanvas from '../ui/NetworkCanvas';
import RevealText from '../ui/RevealText';
import Scene from '../ui/Scene';
import { CONTACT, TRUST } from '../../data/site';
import { EASINGS } from '../../utils/easings';

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const buildingY = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const buildingScale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section className="hero" id="top" ref={ref}>
      <div className="tech-grid" />
      <motion.div
        className="aurora aurora--orange"
        style={{ width: 460, height: 460, left: '-8%', top: '18%' }}
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="aurora aurora--blue"
        style={{ width: 520, height: 520, right: '4%', top: '-10%' }}
        animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="container container--wide hero__grid">
        <div className="hero__stage">
          <NetworkCanvas className="hero__canvas" cx={0.73} cy={0.5} />

          <motion.div className="hero__building" style={{ y: buildingY, scale: buildingScale }}>
            <img src="/img/hero-network.jpg" alt="" />
          </motion.div>

          <motion.div className="hero__content" style={{ y: contentY, opacity: contentOpacity }}>
            <motion.span
              className="hero__eyebrow"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: EASINGS.premium }}
            >
              <em>Nuevo</em>
              Plataforma integral de salud
            </motion.span>

            <RevealText
              tag="h1"
              className="hero__title"
              delay={0.28}
              stagger={0.055}
              highlight={['tecnología', 'inteligente']}
            >
              Transformamos instituciones de salud con tecnología inteligente
            </RevealText>

            <motion.p
              className="hero__lead"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.72, ease: EASINGS.premium }}
            >
              Un ecosistema digital que conecta personas, integra servicios y optimiza procesos
              para mejorar vidas cada día.
            </motion.p>

            <motion.div
              className="hero__actions"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.85, ease: EASINGS.premium }}
            >
              <MagneticButton href="#contacto" className="btn btn--primary btn--lg">
                Solicitar demo
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
                Hablar con WhatsApp
                <Icon name="whatsapp" size={18} />
              </MagneticButton>
            </motion.div>

            <motion.div
              className="hero__trust"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 1 } } }}
            >
              {TRUST.map((item) => (
                <motion.span
                  className="trust-item"
                  key={item.label}
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASINGS.premium } },
                  }}
                >
                  <Icon name={item.icon} size={15} strokeWidth={1.8} />
                  {item.label}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <PortalCard />
      </div>
    </section>
  );
}

function PortalCard() {
  return (
    <motion.aside
      className="portal-card"
      id="portales"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.95, delay: 0.35, ease: EASINGS.premium }}
    >
      <div className="portal-card__glow" />

      <div className="portal-card__head">
        <div>
          <h2 className="portal-card__title">
            Mi portal
            <br />
            de servicios
          </h2>
          <span className="portal-card__kicker">Portal de acceso</span>
        </div>
        <motion.span
          className="icon-btn"
          whileHover={{ rotate: 45, scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        >
          <Icon name="arrow-up-right" size={18} strokeWidth={2} />
        </motion.span>
      </div>

      <div className="portal-card__mock">
        <motion.div
          style={{ width: '100%' }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Scene variant="clinic" />
        </motion.div>
      </div>

      <div className="portal-card__body">
        <h3 className="portal-card__h">
          Tu plataforma <span className="text-gradient">CRM SIEGIX</span> en un solo lugar
        </h3>
        <p className="portal-card__p">
          Gestiona servicios, tickets y documentos, y comunícate con tu equipo de soporte sin salir
          de la plataforma.
        </p>

        <ul className="portal-card__list">
          {['Tickets y solicitudes en tiempo real', 'Documentos y contratos centralizados', 'Historial completo de servicios'].map(
            (item) => (
              <li key={item}>
                <Icon name="check-circle" size={15} strokeWidth={1.9} />
                {item}
              </li>
            ),
          )}
        </ul>

        <MagneticButton href="#contacto" className="btn btn--primary btn--block" block strength={0.2}>
          Iniciar sesión a mi portal
          <span className="btn__arrow">
            <Icon name="arrow-right" size={16} strokeWidth={2.2} />
          </span>
        </MagneticButton>
      </div>
    </motion.aside>
  );
}
