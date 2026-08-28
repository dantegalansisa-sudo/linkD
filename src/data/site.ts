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
      { label: 'RadiologoX', desc: 'PACS · RIS de nueva generación', icon: 'image' },
      { label: 'ECOTurnox', desc: 'Sistema de turnos y agendamiento', icon: 'calendar' },
      { label: 'LINKRix', desc: 'Worklist y vistalist unificada', icon: 'layers' },
      { label: 'SIEGIX Health', desc: 'Facturación médica y cobros', icon: 'credit-card' },
      { label: 'SIEGIX CRM', desc: 'Gestión comercial y servicios', icon: 'chart' },
      { label: 'LinkXpace', desc: 'Portal de resultados para pacientes', icon: 'monitor' },
    ],
  },
  {
    label: 'Industria',
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

/* ---------------- Hero ---------------- */

export const TRUST = [
  { icon: 'code' as IconName, label: 'Desarrollo 100% dominicano' },
  { icon: 'users' as IconName, label: 'Más de 100 clientes en todo el país' },
  { icon: 'shield' as IconName, label: 'Soporte y actualizaciones continuas' },
  { icon: 'lock' as IconName, label: 'Seguridad y garantía de tus datos' },
  { icon: 'sparkles' as IconName, label: 'Inteligencia artificial aplicada' },
  { icon: 'headset' as IconName, label: 'Acompañamiento 24/7 especializado' },
];

/* ---------------- Stats ---------------- */

export interface Stat {
  icon: IconName;
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export const STATS: Stat[] = [
  { icon: 'building' as IconName, value: 801016, label: 'Resultados enviados' },
  { icon: 'users' as IconName, value: 100, suffix: '+', label: 'Clientes activos' },
  { icon: 'heart' as IconName, value: 450, prefix: '+', label: 'Instalaciones' },
  { icon: 'cloud' as IconName, value: 10000, prefix: '+', label: 'Usuarios en la nube' },
  { icon: 'clock' as IconName, value: 10, prefix: '+', label: 'Años de experiencia' },
  { icon: 'activity' as IconName, value: 99.9, suffix: '%', decimals: 1, label: 'Disponibilidad' },
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

/* ---------------- Ecosistema de productos ---------------- */

export const ECOSYSTEM = [
  { name: 'RadiologoX', desc: 'PACS · RIS', icon: 'image' as IconName, color: '#4da3ff' },
  { name: 'ECOTurnox', desc: 'Sistema de turnos', icon: 'calendar' as IconName, color: '#21d4c6' },
  { name: 'LINKRix', desc: 'Worklist · Vistalist', icon: 'layers' as IconName, color: '#ff6a13' },
  { name: 'SIEGIX Health', desc: 'Facturación médica', icon: 'credit-card' as IconName, color: '#ff8a3d' },
  { name: 'LinkBurnPrint', desc: 'Grabación de estudios', icon: 'printer' as IconName, color: '#f2557d' },
  { name: 'SIEGIX CRM', desc: 'Gestión comercial', icon: 'chart' as IconName, color: '#7b5cff' },
  { name: 'LinkXpace', desc: 'Portal de resultados', icon: 'monitor' as IconName, color: '#31c46b' },
  { name: 'Connect IA', desc: 'Asistente clínico y admin', icon: 'sparkles' as IconName, color: '#ff6a13' },
  { name: 'LinkIA', desc: 'Motor de inteligencia', icon: 'brain' as IconName, color: '#4da3ff' },
  { name: 'SIEGIX Provider', desc: 'Portal proveedores', icon: 'box' as IconName, color: '#ffb020' },
];

/* ---------------- Soluciones ---------------- */

export const SOLUTIONS = [
  {
    title: 'Centros de Diagnóstico',
    text: 'Gestión integral de imágenes, turnos, facturación y resultados. Más control, mejor servicio.',
    icon: 'activity' as IconName,
    scene: 'diagnostic' as const,
  },
  {
    title: 'Hospitales',
    text: 'Digitalización de flujos clínicos e imágenes. Integración completa para una atención más eficiente.',
    icon: 'hospital' as IconName,
    scene: 'hospital' as const,
  },
  {
    title: 'Laboratorios',
    text: 'Control de muestras, resultados y protocolos con trazabilidad y seguridad de punta a punta.',
    icon: 'microscope' as IconName,
    scene: 'lab' as const,
  },
  {
    title: 'Clínicas y Consultorios',
    text: 'Organización de turnos, historias clínicas y comunicación directa con tus pacientes.',
    icon: 'stethoscope' as IconName,
    scene: 'clinic' as const,
  },
];

export const MODULES = [
  { name: 'Gestión de pacientes', desc: 'Historia clínica completa e integrada', icon: 'user-round' as IconName },
  { name: 'Imágenes diagnósticas', desc: 'Visualización avanzada multiplataforma', icon: 'image' as IconName },
  { name: 'Facturación electrónica', desc: 'Cobros inteligentes y reportes en tiempo real', icon: 'credit-card' as IconName },
  { name: 'Reportes e indicadores', desc: 'Toma decisiones con datos, no con intuición', icon: 'chart' as IconName },
  { name: 'Inteligencia artificial', desc: 'IA aplicada a radiología y gestión clínica', icon: 'sparkles' as IconName },
  { name: 'Soporte especializado', desc: 'Acompañamiento humano y técnico constante', icon: 'headset' as IconName },
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
    name: 'RadiologoX AI',
    desc: 'Asistencia diagnóstica y generación de informes automáticos.',
    icon: 'image' as IconName,
    color: '#7b5cff',
  },
  {
    name: 'ECOTurnox AI',
    desc: 'Predicción de demanda y optimización de agendas en tiempo real.',
    icon: 'calendar' as IconName,
    color: '#ff8a3d',
  },
  {
    name: 'SIEGIX Health AI',
    desc: 'Detección de inconsistencias y validación automática de cobros.',
    icon: 'credit-card' as IconName,
    color: '#21d4c6',
  },
  {
    name: 'LINKRIX AI',
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
    links: ['RadiologoX AI', 'ECOTurnox AI', 'SIEGIX Health', 'SIEGIX CRM', 'LinkXpace Connect', 'LinkBurnPrint'],
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
