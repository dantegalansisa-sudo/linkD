import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon, { type IconName } from '../ui/Icon';
import Logo from '../ui/Logo';
import { Reveal } from '../ui/RevealText';
import { CONTACT, FOOTER_COLUMNS } from '../../data/site';

/*
  TODO: faltan las URL reales de las redes. Mientras tanto apuntan al inicio
  para no dejar enlaces muertos.
*/
const SOCIAL: { name: IconName; label: string }[] = [
  { name: 'facebook', label: 'Facebook' },
  { name: 'instagram', label: 'Instagram' },
  { name: 'linkedin', label: 'LinkedIn' },
  { name: 'youtube', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="aurora aurora--blue" style={{ width: 620, height: 380, left: '30%', bottom: '-55%', opacity: 0.5 }} />

      <div className="container container--wide">
        <div className="footer__grid">
          <Reveal className="footer__brandcol">
            <Logo variant="onDark" />
            <p className="footer__tagline">
              Conectando salud, optimizando resultados. Tecnología 100% dominicana para instituciones
              que quieren dar el próximo paso.
            </p>
            <div className="footer__social">
              {SOCIAL.map((s) => (
                <motion.a
                  key={s.name}
                  href="/"
                  aria-label={s.label}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.94 }}
                >
                  <Icon name={s.name} size={17} />
                </motion.a>
              ))}
            </div>
          </Reveal>

          {FOOTER_COLUMNS.map((col, i) => (
            <Reveal key={col.title} delay={0.06 * (i + 1)}>
              <h3 className="footer__title">{col.title}</h3>
              <ul className="footer__list">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <Link to={link.href}>{link.label}</Link>
                    ) : (
                      <span className="footer__pendiente">{link.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div style={{ marginTop: 'clamp(2rem, 4vw, 3rem)' }}>
            <h3 className="footer__title">Contacto</h3>
            <ul className="footer__contact" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', display: 'grid' }}>
              <li>
                <Icon name="map-pin" size={16} />
                <span>
                  {CONTACT.address}
                  <br />
                  {CONTACT.city}
                </span>
              </li>
              <li>
                <Icon name="phone" size={16} />
                <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
              </li>
              <li>
                <Icon name="mail" size={16} />
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              </li>
              <li>
                <Icon name="whatsapp" size={16} />
                <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer">
                  Escríbenos por WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </Reveal>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} LINKDICOM, S.R.L. Todos los derechos reservados.</span>
          <div className="footer__bottom-links">
            <Link to="/">Políticas de privacidad</Link>
            <Link to="/">Términos y condiciones</Link>
            <Link to="/">Mapa del sitio</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
