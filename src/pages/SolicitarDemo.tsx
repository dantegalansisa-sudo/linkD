import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import FormularioDemo from '../components/formularios/FormularioDemo';
import Icon from '../components/ui/Icon';
import Logo from '../components/ui/Logo';
import { Reveal } from '../components/ui/RevealText';
import { CONTACT } from '../data/site';
import { cardVariants, containerVariants, EASINGS } from '../utils/easings';

const VENTAJAS = [
  {
    icon: 'monitor' as const,
    color: '#f97316',
    titulo: 'Conocer nuestras soluciones en acción',
    texto: 'Explora las funcionalidades clave con un especialista.',
  },
  {
    icon: 'users' as const,
    color: '#6d5bd0',
    titulo: 'Resolver tus dudas en tiempo real',
    texto: 'Recibe asesoría personalizada según las necesidades de tu institución.',
  },
  {
    icon: 'shield' as const,
    color: '#0f8a5f',
    titulo: 'Ver resultados reales',
    texto: 'Conoce casos de éxito y cómo otras instituciones ya están avanzando.',
  },
];

/**
 * Pagina de solicitud de demo.
 *
 * Tiene direccion propia para poder enlazarla desde campanas, correos o el
 * propio WhatsApp. El parametro `?interes=` preselecciona la solucion cuando
 * se llega desde la ficha de un producto.
 */
export default function SolicitarDemo() {
  const [params] = useSearchParams();
  const interes = params.get('interes') ?? undefined;

  return (
    <main className="pdemo" id="contenido">
      <div className="container container--wide">
        <nav className="migas" aria-label="Ruta de navegación">
          <Link to="/">
            <Icon name="home" size={14} strokeWidth={1.9} />
            Inicio
          </Link>
          <Icon name="chevron-right" size={13} strokeWidth={2} />
          <span aria-current="page">Solicitar una demo</span>
        </nav>

        <motion.div
          className="demo pdemo__panel"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASINGS.premium }}
        >
          {/* ---------- Columna de argumentos ---------- */}
          <aside className="demo__lado">
            <span className="demo__logo">
              <Logo variant="onLight" />
            </span>

            <p className="demo__titulo">
              Solicitar una <em>demo</em>
            </p>
            <p className="demo__intro">
              Descubre cómo <b>LINKDICOM</b> puede transformar tu institución con tecnología
              inteligente para la salud.
            </p>

            <span className="demo__regla" aria-hidden="true" />

            <p className="demo__rotulo">Con una demo personalizada podrás:</p>
            <motion.ul
              className="demo__ventajas"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {VENTAJAS.map((v) => (
                <motion.li key={v.titulo} variants={cardVariants} style={{ '--c': v.color } as React.CSSProperties}>
                  <span className="demo__ventaja-icono">
                    <Icon name={v.icon} size={20} strokeWidth={1.7} />
                  </span>
                  <span>
                    <b>{v.titulo}</b>
                    <small>{v.texto}</small>
                  </span>
                </motion.li>
              ))}
            </motion.ul>

            <img
              className="demo__captura"
              src="/img/productos/radiologox/panel.webp"
              alt="Estación de trabajo con una solución de LINKDICOM en pantalla"
              loading="lazy"
            />

            <p className="demo__sello">
              <Icon name="building" size={20} strokeWidth={1.7} />
              <span>
                <b>+200</b> instituciones confían en nosotros
              </span>
            </p>
          </aside>

          {/* ---------- Formulario ---------- */}
          <div className="demo__form">
            <FormularioDemo interes={interes} />
          </div>
        </motion.div>

        {/* ---------- Otras vias de contacto ---------- */}
        <Reveal className="pdemo__otras" y={22}>
          <p>¿Prefieres hablar antes de dejar tus datos?</p>
          <div>
            <a className="btn btn--square pdemo__otra" href={CONTACT.whatsapp} target="_blank" rel="noreferrer">
              <span className="btn__label">
                <Icon name="whatsapp" size={17} />
                Escríbenos por WhatsApp
              </span>
            </a>
            <a className="btn btn--square pdemo__otra" href={CONTACT.phoneHref}>
              <span className="btn__label">
                <Icon name="phone" size={16} strokeWidth={1.9} />
                {CONTACT.phone}
              </span>
            </a>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
