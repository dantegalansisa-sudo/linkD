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

export interface NavItem {
  /** Categoria en versales encima del nombre. Solo la usa Productos. */
  kicker?: string;
  label: string;
  desc: string;
  icon: IconName;
  /** Color de marca del producto empresarial. */
  color?: string;
  /** Logotipo del producto. Sustituye al nombre escrito en el menu. */
  logo?: string;
  href: string;
}

/** Una de las dos columnas del megamenu: salud (oscura) o empresa (clara). */
export interface NavColumn {
  tone: 'salud' | 'empresa';
  title: string;
  titleAccent: string;
  intro: string;
  icon: IconName;
  items: NavItem[];
  cta: string;
}

export interface NavChild {
  label: string;
  desc: string;
  icon: IconName;
  /** Color de marca del sector. */
  color?: string;
  /** Destino, cuando la entrada ya tiene pagina propia. */
  href?: string;
}

export interface NavGroup {
  label: string;
  /** Megamenu de dos columnas. */
  columns?: NavColumn[];
  /** Desplegable simple de una rejilla. */
  children?: NavChild[];
}

/*
  Los cuatro productos empresariales aparecen en los dos megamenus, pero con
  descripcion distinta en cada uno, asi que cada menu lleva la suya.
*/

export const NAV: NavGroup[] = [
  {
    label: 'Soluciones',
    columns: [
      {
        tone: 'salud',
        title: 'Soluciones',
        titleAccent: 'de salud',
        intro: 'Tecnología para una atención más humana, eficiente y conectada.',
        icon: 'activity',
        cta: 'Ver todas las soluciones de salud',
        items: [
          {
            label: 'Centros de Diagnóstico',
            desc: 'Imágenes, turnos, facturación y resultados',
            icon: 'hospital',
            href: '/ecosistema/centros-de-diagnostico',
          },
          {
            label: 'Soluciones Hospitalarias',
            desc: 'Digitalización completa de flujos clínicos',
            icon: 'hospital',
            href: '/ecosistema/hospitalario',
          },
          {
            label: 'Laboratorios',
            desc: 'Control de muestras y trazabilidad total',
            icon: 'microscope',
            href: '/ecosistema/laboratorios',
          },
          {
            label: 'Gestión de Consultorios',
            desc: 'Historia clínica, agenda y facturación',
            icon: 'stethoscope',
            href: '/ecosistema/consultorios',
          },
        ],
      },
      {
        tone: 'empresa',
        title: 'Soluciones',
        titleAccent: 'empresariales',
        intro: 'Herramientas digitales para impulsar el crecimiento de tu negocio.',
        icon: 'box',
        cta: 'Ver todas las soluciones empresariales',
        items: [
          {
            label: 'LinkXpace',
            desc: 'Dominios, hosting, VPS y servicios digitales',
            icon: 'globe',
            color: '#f59e0b',
            logo: '/img/logos/linkxpace.png',
            href: '/producto/linkxpace',
          },
          {
            label: 'SIEGIX CRM',
            desc: 'Administración de clientes y crecimiento empresarial',
            icon: 'user-round',
            color: '#e0489a',
            logo: '/img/logos/siegix-crm.png',
            href: '/producto/siegix-crm',
          },
          {
            label: 'SIEGIX Provider',
            desc: 'Facturación y gestión para empresas de servicios',
            icon: 'chart',
            color: '#f97316',
            logo: '/img/logos/siegix-provider.png',
            href: '/producto/siegix-provider',
          },
          {
            label: 'Siegix Core',
            desc: 'Interfaz entre la facturación electrónica y tu sistema actual',
            icon: 'cloud',
            color: '#2fa8e0',
            href: '/producto/siegix-core',
          },
        ],
      },
    ],
  },
  {
    label: 'Productos',
    columns: [
      {
        tone: 'salud',
        title: 'Productos',
        titleAccent: 'de salud',
        intro: 'Soluciones especializadas para el ecosistema de salud en todas sus áreas.',
        icon: 'activity',
        cta: 'Ver todos los productos de salud',
        items: [
          {
            kicker: 'PACS / RIS',
            label: 'RadiologoX',
            desc: 'Imágenes diagnósticas y teleradiología',
            icon: 'scan',
            logo: '/img/logos/radiologox.png',
            href: '/producto/radiologox',
          },
          {
            kicker: 'Sistema de turnos',
            label: 'ECOTurnox',
            desc: 'Gestión inteligente de filas y turnos',
            icon: 'users',
            logo: '/img/logos/ecoturnox.png',
            href: '/producto/ecoturnox',
          },
          {
            kicker: 'Sistema de facturación',
            label: 'SIEGIX Health',
            desc: 'Facturación y control financiero en salud',
            icon: 'credit-card',
            logo: '/img/logos/siegix-health.png',
            href: '/producto/siegix-health',
          },
          {
            kicker: 'Portal médicos y pacientes',
            label: 'LINKRix',
            desc: 'Manejo de pacientes y agendas, resultados en línea',
            icon: 'monitor',
            logo: '/img/logos/linkrix.png',
            href: '/producto/linkrix',
          },
          {
            kicker: 'Impresión y grabación CD',
            label: 'LinkBurnPrint',
            desc: 'Entrega de resultados al paciente',
            icon: 'printer',
            logo: '/img/logos/linkburnprint.png',
            href: '/producto/linkburnprint',
          },
          {
            kicker: 'Consultorios',
            label: 'ConsultorioX',
            desc: 'Gestión de consultorios y atención al paciente',
            icon: 'stethoscope',
            logo: '/img/logos/consultoriox.png',
            href: '/producto/consultoriox',
          },
        ],
      },
      {
        tone: 'empresa',
        title: 'Productos',
        titleAccent: 'empresariales',
        intro: 'Herramientas digitales para impulsar la eficiencia y el crecimiento de tu negocio.',
        icon: 'box',
        cta: 'Ver todos los productos empresariales',
        items: [
          {
            label: 'LinkXpace',
            desc: 'Sitios web, hosting y dominios',
            icon: 'globe',
            color: '#f59e0b',
            logo: '/img/logos/linkxpace.png',
            href: '/producto/linkxpace',
          },
          {
            label: 'SIEGIX CRM',
            desc: 'Administración de clientes y crecimiento empresarial',
            icon: 'user-round',
            color: '#e0489a',
            logo: '/img/logos/siegix-crm.png',
            href: '/producto/siegix-crm',
          },
          {
            label: 'SIEGIX Provider',
            desc: 'Facturación y gestión para empresas de servicios',
            icon: 'chart',
            color: '#f97316',
            logo: '/img/logos/siegix-provider.png',
            href: '/producto/siegix-provider',
          },
          {
            label: 'Siegix Core',
            desc: 'Interfaz entre la facturación electrónica y tu sistema actual',
            icon: 'cloud',
            color: '#2fa8e0',
            href: '/producto/siegix-core',
          },
        ],
      },
    ],
  },
  {
    // El cliente reagrupo las seis industrias en tres sectores y renombro el menu.
    label: 'Sectores',
    children: [
      {
        label: 'Sector Público',
        href: '/sector/sector-publico',
        desc: 'Hospitales, centros de salud e instituciones gubernamentales',
        icon: 'landmark',
        color: '#2563eb',
      },
      {
        label: 'Sector Privado',
        href: '/sector/sector-privado',
        desc: 'Hospitales, clínicas, centros diagnósticos, laboratorios y empresas',
        icon: 'building',
        color: '#0f8a5f',
      },
      {
        label: 'Internacional',
        href: '/sector/internacional',
        desc: 'Soluciones de salud y tecnología más allá de República Dominicana',
        icon: 'globe',
        color: '#6d5bd0',
      },
    ],
  },
  {
    label: 'Recursos',
    children: [
      { label: 'Blog', desc: 'Tendencias, casos y mejores prácticas', icon: 'file-text' },
      { label: 'Webinars', desc: 'Aprende de expertos y transforma tu gestión', icon: 'youtube' },
      { label: 'Casos de éxito', desc: 'Historias reales de transformación', icon: 'star' },
      { label: 'Guías', desc: 'Descarga guías y materiales para tu institución', icon: 'layers' },
    ],
  },
  {
    label: 'Empresa',
    children: [
      { label: 'Quiénes somos', desc: 'Más de 10 años construyendo salud digital', icon: 'building', href: '/empresa/acerca-de-nosotros' },
      { label: 'Obra social', desc: 'Programa de asistencia social Virginia Toca', icon: 'heart', href: '/empresa/obra-social' },
      { label: 'Nuestros valores', desc: 'Los principios que nos mueven cada día', icon: 'star', href: '/empresa/nuestros-valores' },
      { label: 'Trabaja con nosotros', desc: 'Tu talento también conecta vidas', icon: 'users', href: '/empresa/trabaja-con-nosotros' },
      { label: 'Políticas y términos', desc: 'Transparencia, confianza y cumplimiento', icon: 'shield', href: '/empresa/politicas-y-terminos' },
      { label: 'Contáctanos', desc: 'Hablemos, estamos para ayudarte', icon: 'headset', href: '/empresa/contacto' },
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
    href: '/producto/radiologox',
  },
  {
    category: 'Turnos y filas',
    name: 'ECOTurnox',
    text: 'Para gestión inteligente de filas.',
    icon: 'users',
    color: '#22c55e',
    href: '/producto/ecoturnox',
  },
  {
    category: 'Facturación clínica',
    name: 'SIEGIX Health',
    text: 'Para facturación y control financiero.',
    icon: 'credit-card',
    color: '#f59e0b',
    href: '/producto/siegix-health',
  },
  {
    category: 'CRM',
    name: 'SIEGIX CRM',
    text: 'Administración de clientes en una sola plataforma.',
    icon: 'user-round',
    color: '#d946ef',
    href: '/producto/siegix-crm',
  },
  {
    category: 'Estación local',
    name: 'LINKrix',
    text: 'Para resultados en línea de pacientes y médicos.',
    icon: 'monitor',
    color: '#22d3ee',
    href: '/producto/linkrix',
  },
  {
    category: 'Consultorios',
    name: 'CONSULTORIOX',
    text: 'Administra tus consultorios y pacientes desde una plataforma.',
    icon: 'stethoscope',
    color: '#ef4444',
    href: '/producto/consultoriox',
  },
  {
    category: 'Impresión y CD/DVD',
    name: 'LinkBurnPrint',
    text: 'Para entrega de resultados al paciente.',
    icon: 'printer',
    color: '#eab308',
    href: '/producto/linkburnprint',
  },
  {
    category: 'ERP para diversas industrias',
    name: 'SIEGIX PROVIDER',
    text: 'Sistema ERP para diversas industrias y empresas.',
    icon: 'database',
    color: '#8b5cf6',
    href: '/producto/siegix-provider',
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
    image: '/img/ecosistemas/centros-de-diagnostico-tarjeta.webp',
    alt: 'Recepción de un centro de diagnóstico con el equipo de imagen al fondo',
    cta: 'Ver solución',
    href: '/ecosistema/centros-de-diagnostico',
  },
  {
    title: 'Hospitales',
    text: 'Integra todas las áreas de tu hospital y toma decisiones más rápidas con datos en tiempo real.',
    icon: 'hospital',
    color: '#2563eb',
    image: '/img/ecosistemas/hospitalario-tarjeta.webp',
    alt: 'Entrada de un hospital con la pantalla de turnos en la sala de espera',
    cta: 'Ver solución',
    href: '/ecosistema/hospitalario',
  },
  {
    title: 'Laboratorios',
    text: 'Gestiona muestras, resultados y procesos con trazabilidad y cumplimiento.',
    icon: 'microscope',
    color: '#1ea75c',
    image: '/img/ecosistemas/laboratorios-tarjeta.webp',
    alt: 'Técnica de laboratorio procesando muestras junto a la pantalla de LaboratoriuX',
    cta: 'Ver solución',
    href: '/ecosistema/laboratorios',
  },
  {
    title: 'Consultorios y Redes Médicas',
    text: 'Conecta múltiples sedes y profesionales en una plataforma segura y escalable.',
    icon: 'network',
    color: '#f97316',
    image: '/img/ecosistemas/consultorios-tarjeta.webp',
    alt: 'Médico revisando el historial de una paciente en la tableta',
    cta: 'Ver solución',
    href: '/ecosistema/consultorios',
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
    image: '/img/recursos/webinars.webp',
    alt: 'Webinar de LINKDICOM en la pantalla de un portátil',
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
    image: '/img/recursos/materiales.webp',
    alt: 'Manual de usuario PACS-RIS de LINKDICOM con sus formatos descargables',
    href: '#recursos',
  },
];

/* ---------------- Footer ---------------- */

/*
  Enlaces del pie. Los que todavia no tienen pagina propia se quedan sin `href`
  y el pie los pinta como texto, para no llevar al visitante al inicio sin
  explicacion.
*/
export interface FooterLink {
  label: string;
  href?: string;
}

export const FOOTER_COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Soluciones',
    links: [
      { label: 'Centros de diagnóstico', href: '/ecosistema/centros-de-diagnostico' },
      { label: 'Hospitales', href: '/ecosistema/hospitalario' },
      { label: 'Laboratorios', href: '/ecosistema/laboratorios' },
      { label: 'Clínicas y consultorios', href: '/ecosistema/consultorios' },
      { label: 'Sector público', href: '/sector/sector-publico' },
      { label: 'Sector privado', href: '/sector/sector-privado' },
      { label: 'Internacional', href: '/sector/internacional' },
    ],
  },
  {
    title: 'Productos',
    links: [
      { label: 'RadiologoX', href: '/producto/radiologox' },
      { label: 'ECOTurnox', href: '/producto/ecoturnox' },
      { label: 'SIEGIX Health', href: '/producto/siegix-health' },
      { label: 'SIEGIX CRM', href: '/producto/siegix-crm' },
      { label: 'LINKrix', href: '/producto/linkrix' },
      { label: 'CONSULTORIOX', href: '/producto/consultoriox' },
      { label: 'LaboratoriuX', href: '/producto/laboratoriux' },
      { label: 'LinkBurnPrint', href: '/producto/linkburnprint' },
      { label: 'SIEGIX PROVIDER', href: '/producto/siegix-provider' },
      { label: 'LinkXpace', href: '/producto/linkxpace' },
      { label: 'SIEGIX Core', href: '/producto/siegix-core' },
    ],
  },
  {
    title: 'Recursos',
    links: [
      { label: 'Conferencias' },
      { label: 'Webinars' },
      { label: 'Entrevistas' },
      { label: 'Materiales de apoyo' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Quiénes somos', href: '/empresa/acerca-de-nosotros' },
      { label: 'Obra social', href: '/empresa/obra-social' },
      { label: 'Nuestros valores', href: '/empresa/nuestros-valores' },
      { label: 'Trabaja con nosotros', href: '/empresa/trabaja-con-nosotros' },
      { label: 'Políticas y términos', href: '/empresa/politicas-y-terminos' },
      { label: 'Contáctanos', href: '/empresa/contacto' },
    ],
  },
];
