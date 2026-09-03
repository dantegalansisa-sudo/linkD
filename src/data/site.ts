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

/* ---------------- Industrias (brief seccion 8) ---------------- */

export interface Industry {
  name: string;
  icon: IconName;
  color: string;
}

export const INDUSTRIES: Industry[] = [
  { name: 'Centros de Imágenes', icon: 'scan', color: '#14b8a6' },
  { name: 'Hospitales y Clínicas', icon: 'hospital', color: '#f97316' },
  { name: 'Laboratorios', icon: 'microscope', color: '#a855f7' },
  { name: 'Teleradiología', icon: 'monitor', color: '#2563eb' },
  { name: 'Redes y Grupos Médicos', icon: 'network', color: '#22c55e' },
  { name: 'Instituciones Públicas y Privadas', icon: 'building', color: '#1d4ed8' },
];

/* ---------------- Resultados (brief seccion 9) ---------------- */

export interface Result {
  label: string;
  value: number;
  note: string;
  icon: IconName;
  /** Sentido del indicador: baja, sube o sin flecha. */
  trend: 'down' | 'up' | 'none';
}

export const RESULTS: Result[] = [
  {
    label: 'Reducción de tiempos de entrega de resultados',
    value: 40,
    note: 'en promedio',
    icon: 'clock',
    trend: 'down',
  },
  {
    label: 'Digitalización del flujo operativo',
    value: 100,
    note: 'de tus procesos',
    icon: 'cpu',
    trend: 'none',
  },
  {
    label: 'Reducción en costos operativos',
    value: 35,
    note: 'en promedio',
    icon: 'credit-card',
    trend: 'down',
  },
  {
    label: 'Mejora en productividad del personal',
    value: 60,
    note: 'en promedio',
    icon: 'users',
    trend: 'up',
  },
];

/* ---------------- Recursos (brief seccion 10) ---------------- */

export interface Resource {
  title: string;
  text: string;
  cta: string;
  image: string;
  alt: string;
  href: string;
}

export const RESOURCES: Resource[] = [
  {
    title: 'Blog',
    text: 'Tendencias, casos y mejores prácticas.',
    cta: 'Leer más',
    image: '/img/blog.jpg',
    alt: 'Portátil abierto sobre un escritorio',
    href: '#recursos',
  },
  {
    title: 'Webinars',
    text: 'Aprende de expertos y transforma tu gestión.',
    cta: 'Ver ahora',
    image: '/img/webinar.jpg',
    alt: 'Videoconferencia con varios participantes en un portátil',
    href: '#recursos',
  },
  {
    title: 'Casos de Éxito',
    text: 'Historias reales de transformación.',
    cta: 'Leer más',
    image: '/img/caso-exito.jpg',
    alt: 'Dos profesionales estrechándose la mano',
    href: '#recursos',
  },
  {
    title: 'Guías',
    text: 'Descarga guías y materiales para tu institución.',
    cta: 'Descargar',
    image: '/img/guia.jpg',
    alt: 'Portada de la guía PACS de LINKDICOM',
    href: '#recursos',
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
