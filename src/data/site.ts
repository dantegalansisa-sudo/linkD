import type { IconName } from '../components/ui/Icon';

export const CONTACT = {
  phone: '+1 (809) 792 9763',
  phoneHref: 'tel:+18097929763',
  email: 'info@linkdicom.com',
  whatsapp: 'https://wa.me/18097929763',
  address: 'C/ Puerto Rico casi esq. San Vicente de Paúl (Alma Rosa I)',
  city: 'Santo Domingo Este, República Dominicana',
};

/* ---------------- Navegacion ---------------- */

export interface NavChild {
  label: string;
  desc: string;
  icon: IconName;
}
export interface NavGroup {
  label: string;
  children: NavChild[];
}

export const NAV: NavGroup[] = [
  {
    label: 'Soluciones',
    children: [
      { label: 'Centros de Diagnóstico', desc: 'Imágenes, turnos, facturación y resultados', icon: 'activity' },
      { label: 'Hospitales', desc: 'Digitalización completa de flujos clínicos', icon: 'hospital' },
      { label: 'Laboratorios', desc: 'Control de muestras y trazabilidad total', icon: 'microscope' },
      { label: 'Clínicas y Consultorios', desc: 'Historia clínica y agenda inteligente', icon: 'stethoscope' },
      { label: 'Teleradiología', desc: 'Lectura remota con worklist distribuida', icon: 'globe' },
      { label: 'Redes y Órganos de Salud', desc: 'Interoperabilidad entre instituciones', icon: 'network' },
    ],
  },
  {
    label: 'Productos',
    children: [
      { label: 'RadiologoX', desc: 'Imágenes diagnósticas y teleradiología', icon: 'scan' },
      { label: 'ECOTurnox', desc: 'Gestión inteligente de filas', icon: 'users' },
      { label: 'SIEGIX Health', desc: 'Facturación y control financiero', icon: 'credit-card' },
      { label: 'SIEGIX CRM', desc: 'Administración de clientes', icon: 'user-round' },
      { label: 'LINKrix', desc: 'Resultados en línea para pacientes y médicos', icon: 'monitor' },
      { label: 'CONSULTORIOX', desc: 'Consultorios y pacientes en una plataforma', icon: 'stethoscope' },
      { label: 'LinkBurnPrint', desc: 'Entrega de resultados al paciente', icon: 'printer' },
      { label: 'SIEGIX PROVIDER', desc: 'ERP para diversas industrias', icon: 'database' },
    ],
  },
  {
    label: 'Industrias',
    children: [
      { label: 'Sector público', desc: 'Hospitales y redes del Estado', icon: 'building' },
      { label: 'Sector privado', desc: 'Clínicas, ARS y grupos médicos', icon: 'users' },
      { label: 'Laboratorios clínicos', desc: 'Procesamiento y resultados', icon: 'microscope' },
      { label: 'Teleradiología', desc: 'Lectura distribuida 24/7', icon: 'globe' },
    ],
  },
  {
    label: 'Recursos',
    children: [
      { label: 'Blog', desc: 'Tendencias en salud digital', icon: 'file-text' },
      { label: 'Casos de éxito', desc: 'Instituciones que ya transformamos', icon: 'star' },
      { label: 'Manuales y documentos', desc: 'Guías técnicas y de usuario', icon: 'layers' },
      { label: 'Videos y tutoriales', desc: 'Aprende a usar cada módulo', icon: 'youtube' },
    ],
  },
  {
    label: 'Empresa',
    children: [
      { label: 'Nuestra historia', desc: 'Más de 10 años construyendo salud digital', icon: 'clock' },
      { label: 'Nuestros valores', desc: 'Lo que nos mueve cada día', icon: 'heart' },
      { label: 'Trabaja con nosotros', desc: 'Únete al equipo', icon: 'users' },
      { label: 'Políticas y términos', desc: 'Privacidad y cumplimiento', icon: 'shield' },
    ],
  },
];

/* ---------------- Stats ---------------- */

/** Indicadores del bloque de confianza pegado al hero (brief seccion 4). */
export interface TrustStat {
  icon: IconName;
  value: number;
  suffix?: string;
  label: string;
  color: string;
}

export const TRUST_STATS: TrustStat[] = [
  { icon: 'building', value: 200, label: 'Instituciones', color: '#ff7a2f' },
  { icon: 'users', value: 2300, label: 'Usuarios activos', color: '#f2554a' },
  { icon: 'calendar', value: 10, suffix: ' Años', label: 'De experiencia', color: '#2fbf6b' },
  { icon: 'network', value: 1, suffix: ' Millón', label: 'Pacientes procesados', color: '#8b5cf6' },
];

/* ---------------- Actualidad LINKDICOM (brief seccion 5) ---------------- */

export interface NewsItem {
  id: string;
  category: string;
  /** Color de la etiqueta de categoria. */
  color: string;
  title: string;
  /** Bajada larga; solo la usa la pieza destacada. */
  excerpt?: string;
  image: string;
  alt: string;
  date?: string;
  cta: string;
  href: string;
  /**
   * Puede ocupar el destacado grande. Requiere una imagen de 700px de ancho
   * como minimo: por debajo de eso se ve borrosa al ampliarla.
   */
  featured?: boolean;
}

export const NEWS: NewsItem[] = [
  {
    id: 'astacio',
    category: 'Noticia destacada',
    color: '#1ea75c',
    title: 'LINKDICOM implementa con éxito su ecosistema en el Hospital Dr. Nelson Astacio',
    excerpt:
      'Un avance significativo que optimiza procesos, mejora la atención y fortalece la gestión de la información en la institución.',
    image: '/img/astacio.png',
    alt: 'Edificio de consultas externas del Hospital Dr. Nelson Astacio',
    cta: 'Leer noticia completa',
    href: '#actualidad',
    featured: true,
  },
  {
    id: 'radiologox',
    category: 'Innovación',
    color: '#2563eb',
    title:
      'LINKDICOM lanza la nueva versión de RadiologoX, el primer sistema PACS dominicano, con mejoras de última generación',
    excerpt:
      'La nueva versión del primer sistema PACS desarrollado en el país llega con mejoras de última generación para el diagnóstico por imagen.',
    image: '/img/radiologox.jpg',
    alt: 'Especialista revisando estudios de imagen en RadiologoX',
    date: '26 de mayo, 2025',
    cta: 'Leer más',
    href: '#actualidad',
    featured: true,
  },
  {
    id: 'padre-carollo',
    category: 'Salud digital',
    color: '#0e9fb8',
    title:
      'LINKDICOM, junto a HORUSTECH Ecuador, pone en funcionamiento la plataforma digital PACS-RIS en el Hospital Padre Carollo',
    excerpt:
      'La alianza con HORUSTECH Ecuador lleva la plataforma digital PACS-RIS al Hospital Padre Carollo, un paso más en la expansión regional.',
    image: '/img/padre.png',
    alt: 'Fachada del Hospital Padre Carollo, Ecuador',
    cta: 'Leer más',
    href: '#actualidad',
    // sin `featured`: la foto entregada mide 348px y se veria borrosa ampliada
  },
  {
    id: 'infraestructura',
    category: 'Tecnología',
    color: '#6a52d6',
    title:
      'LINKDICOM implementa mejoras en su infraestructura privada con miras a la integración de nuevas tecnologías en 2027',
    excerpt:
      'Las mejoras en la infraestructura privada preparan el terreno para integrar nuevas tecnologías a partir de 2027.',
    image: '/img/infraestructura.jpg',
    alt: 'Sala de servidores de la infraestructura privada de LINKDICOM',
    cta: 'Leer más',
    href: '#actualidad',
    featured: true,
  },
];

/* ---------------- Historia / Vision / Mision ---------------- */

export const ABOUT_TABS = [
  {
    key: 'historia',
    tab: 'Nuestra historia',
    title: 'Innovación con propósito, desde nuestros inicios',
    text: 'LINKDICOM es una empresa 100% dominicana, fundada legalmente en el año 2016 y con operaciones desde el 2020 en oficina propia. Comenzamos pequeños, soñando en grande, y hoy conectamos instituciones de salud en todo el país.',
    points: [
      'Primer sistema PACS desarrollado en República Dominicana',
      'Oficina propia y equipo técnico local desde 2020',
      'Más de 450 instalaciones activas en el territorio nacional',
    ],
    scene: 'history' as const,
  },
  {
    key: 'vision',
    tab: 'Nuestra visión',
    title: 'Ser líderes en soluciones de imagen e información',
    text: 'Proyectamos ser referentes en el sector salud por nuestra innovación y compromiso con el país. Creemos en la ética, la calidad y el trabajo en equipo para generar un impacto positivo y sostenible.',
    points: [
      'Referentes regionales en salud digital',
      'Tecnología que conecta personas y datos',
      'Crecimiento sostenible con impacto social',
    ],
    scene: 'vision' as const,
  },
  {
    key: 'mision',
    tab: 'Nuestra misión',
    title: 'Conectamos hoy para cuidar el mañana',
    text: 'Nuestra misión es transformar la salud con soluciones tecnológicas inteligentes, que optimicen procesos, reduzcan tiempos de espera y mejoren la experiencia del paciente en cada institución.',
    points: [
      'Optimizar cada proceso clínico y administrativo',
      'Reducir tiempos de espera y errores humanos',
      'Poner al paciente en el centro de la operación',
    ],
    scene: 'mission' as const,
  },
];

/* ---------------- Productos y plataformas (brief seccion 7) ---------------- */

/*
  Regla del brief: los nombres van SIN "AI".
  RadiologoX AI -> RadiologoX, ECOTurnox AI -> ECOTurnox,
  SIEGIX Health AI -> SIEGIX Health, LINKConnect -> LINKrix.
  LINKROX AI no se usa.
*/

export interface Product {
  category: string;
  name: string;
  text: string;
  icon: IconName;
  color: string;
  href: string;
}

export const PRODUCTS: Product[] = [
  {
    category: 'PACS · RIS',
    name: 'RadiologoX',
    text: 'Para imágenes diagnósticas y teleradiología.',
    icon: 'scan',
    color: '#a855f7',
    href: '#productos',
  },
  {
    category: 'Turnos y filas',
    name: 'ECOTurnox',
    text: 'Para gestión inteligente de filas.',
    icon: 'users',
    color: '#22c55e',
    href: '#productos',
  },
  {
    category: 'Facturación clínica',
    name: 'SIEGIX Health',
    text: 'Para facturación y control financiero.',
    icon: 'credit-card',
    color: '#f59e0b',
    href: '#productos',
  },
  {
    category: 'CRM',
    name: 'SIEGIX CRM',
    text: 'Administración de clientes en una sola plataforma.',
    icon: 'user-round',
    color: '#d946ef',
    href: '#productos',
  },
  {
    category: 'Estación local',
    name: 'LINKrix',
    text: 'Para resultados en línea de pacientes y médicos.',
    icon: 'monitor',
    color: '#22d3ee',
    href: '#productos',
  },
  {
    category: 'Consultorios',
    name: 'CONSULTORIOX',
    text: 'Administra tus consultorios y pacientes desde una plataforma.',
    icon: 'stethoscope',
    color: '#ef4444',
    href: '#productos',
  },
  {
    category: 'Impresión y CD/DVD',
    name: 'LinkBurnPrint',
    text: 'Para entrega de resultados al paciente.',
    icon: 'printer',
    color: '#eab308',
    href: '#productos',
  },
  {
    category: 'ERP para diversas industrias',
    name: 'SIEGIX PROVIDER',
    text: 'Sistema ERP para diversas industrias y empresas.',
    icon: 'database',
    color: '#8b5cf6',
    href: '#productos',
  },
];

/* ---------------- Nuestro ecosistema (brief seccion 6) ---------------- */

export interface SolutionCard {
  title: string;
  text: string;
  icon: IconName;
  /** Color del distintivo de la tarjeta. */
  color: string;
  image: string;
  alt: string;
  cta: string;
  href: string;
}

export const SOLUTIONS: SolutionCard[] = [
  {
    title: 'Centros de Diagnóstico',
    text: 'Optimiza el flujo de estudios, reduce tiempos y mejora la experiencia del paciente.',
    icon: 'scan',
    color: '#6d5bd0',
    image: '/img/diagnostico.jpg',
    alt: 'Sala de diagnóstico por imagen con equipo de resonancia',
    cta: 'Ver solución',
    href: '#ecosistema',
  },
  {
    title: 'Hospitales',
    text: 'Integra todas las áreas de tu hospital y toma decisiones más rápidas con datos en tiempo real.',
    icon: 'hospital',
    color: '#2563eb',
    image: '/img/hospitales.jpg',
    alt: 'Pasillo de hospital con personal y pacientes',
    cta: 'Ver solución',
    href: '#ecosistema',
  },
  {
    title: 'Laboratorios',
    text: 'Gestiona muestras, resultados y procesos con trazabilidad y cumplimiento.',
    icon: 'microscope',
    color: '#1ea75c',
    image: '/img/laboratorio.jpg',
    alt: 'Personal de laboratorio registrando muestras de sangre',
    cta: 'Ver solución',
    href: '#ecosistema',
  },
  {
    title: 'Consultorios y Redes Médicas',
    text: 'Conecta múltiples sedes y profesionales en una plataforma segura y escalable.',
    icon: 'network',
    color: '#f97316',
    image: '/img/consultorios.jpg',
    alt: 'Médico revisando el historial de un paciente en una tableta',
    cta: 'Ver solución',
    href: '#ecosistema',
  },
];

/* ---------------- Portales ---------------- */

export const PORTALS = [
  {
    title: 'Portal Pacientes',
    text: 'Acceso seguro a resultados, estudios e imágenes. Experiencia digital real para tus pacientes.',
    icon: 'user-round' as IconName,
    scene: 'patients' as const,
  },
  {
    title: 'Portal Referidores',
    text: 'Consulta y seguimiento del paciente referido en tiempo real, sin llamadas ni complicaciones.',
    icon: 'send' as IconName,
    scene: 'referrers' as const,
  },
  {
    title: 'Portal Proveedores',
    text: 'Recibe órdenes de compra, entregas y pagos de forma ordenada y totalmente trazable.',
    icon: 'box' as IconName,
    scene: 'providers' as const,
  },
  {
    title: 'Mi Portal de Servicios',
    text: 'Tu centro de servicios CRM: solicitudes, soporte, documentos y mucho más en un solo lugar.',
    icon: 'headset' as IconName,
    scene: 'services' as const,
  },
];

export const INDUSTRIES = [
  { name: 'Centros de diagnóstico', icon: 'activity' as IconName },
  { name: 'Hospitales y clínicas', icon: 'hospital' as IconName },
  { name: 'Laboratorios', icon: 'microscope' as IconName },
  { name: 'Teleradiología', icon: 'globe' as IconName },
  { name: 'Redes y órganos de salud', icon: 'network' as IconName },
  { name: 'Instituciones públicas y privadas', icon: 'building' as IconName },
];

/* ---------------- Inteligencia artificial ---------------- */

export const AI_PRODUCTS = [
  {
    name: 'RadiologoX',
    desc: 'Asistencia diagnóstica y generación de informes automáticos.',
    icon: 'image' as IconName,
    color: '#7b5cff',
  },
  {
    name: 'ECOTurnox',
    desc: 'Predicción de demanda y optimización de agendas en tiempo real.',
    icon: 'calendar' as IconName,
    color: '#ff8a3d',
  },
  {
    name: 'SIEGIX Health',
    desc: 'Detección de inconsistencias y validación automática de cobros.',
    icon: 'credit-card' as IconName,
    color: '#21d4c6',
  },
  {
    name: 'LINKrix',
    desc: 'Análisis predictivo de indicadores y riesgos operativos.',
    icon: 'chart' as IconName,
    color: '#f2557d',
  },
];

/* ---------------- Footer ---------------- */

export const FOOTER_COLUMNS = [
  {
    title: 'Soluciones',
    links: ['Centros de diagnóstico', 'Hospitales', 'Laboratorios', 'Clínicas y consultorios', 'Todos los sectores'],
  },
  {
    title: 'Productos',
    links: [
      'RadiologoX',
      'ECOTurnox',
      'SIEGIX Health',
      'SIEGIX CRM',
      'LINKrix',
      'CONSULTORIOX',
      'LinkBurnPrint',
      'SIEGIX PROVIDER',
    ],
  },
  {
    title: 'Recursos',
    links: ['Blog', 'Casos de éxito', 'Manuales y documentos', 'Novedades', 'Videos', 'Guías'],
  },
  {
    title: 'Empresa',
    links: ['Nuestra historia', 'Nuestros valores', 'Trabaja con nosotros', 'Políticas y términos'],
  },
];
