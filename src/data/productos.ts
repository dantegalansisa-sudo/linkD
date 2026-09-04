import type { IconName } from '../components/ui/Icon';

/*
  Ficha de producto. Un unico modelo para las tres familias del sitio:
  ecosistemas, productos de salud y productos empresariales.

  Las imagenes todavia no estan: mientras el campo venga vacio la pagina pinta
  un marcador con el nombre del archivo que espera, en vez de un hueco roto.
*/

export interface Caracteristica {
  icon: IconName;
  label: string;
}

export interface DatoProducto {
  icon: IconName;
  valor: string;
  label: string;
}

export interface PestanaProducto {
  key: string;
  label: string;
  titulo: string;
  texto: string;
  puntos: string[];
  /** Ruta de la imagen del panel. Vacio -> marcador. */
  imagen?: string;
  imagenAlt: string;
}

export interface Producto {
  slug: string;
  /** Familia a la que pertenece; decide las migas de pan. */
  familia: 'ecosistema' | 'salud' | 'empresarial';
  categoria: string;
  nombre: string;
  /** Color de marca del producto. */
  color: string;
  titulo: string;
  intro: string;

  /** Cabecera de la pagina. */
  heroEyebrow: string;
  heroTitulo: string;
  heroTexto: string;
  heroLema: string;
  heroImagen?: string;
  heroImagenAlt: string;

  /** Imagen del panel principal. */
  imagenPrincipal?: string;
  imagenPrincipalAlt: string;

  caracteristicas: Caracteristica[];
  datos: DatoProducto[];
  pestanas: PestanaProducto[];

  ctaTitulo: string;
  ctaTexto: string;
}

export const PRODUCTOS_FICHA: Producto[] = [
  {
    slug: 'radiologox',
    familia: 'salud',
    categoria: 'PACS / RIS',
    nombre: 'RadiologoX',
    color: '#c9962f',
    titulo: 'Plataforma completa de imágenes diagnósticas y teleradiología',
    intro:
      'RadiologoX centraliza la gestión de imágenes médicas, optimiza el flujo de trabajo radiológico y facilita la colaboración entre profesionales, dentro y fuera de tu institución.',

    heroEyebrow: 'Nuestro ecosistema',
    heroTitulo: 'Soluciones que transforman cada parte de tu institución',
    heroTexto:
      'Un ecosistema integrado de tecnología y servicios que conecta personas, procesos e información para una atención de salud más eficiente, segura y centrada en el paciente.',
    heroLema: 'Imágenes que conectan vidas',
    heroImagenAlt: 'Radiólogo revisando estudios en varias pantallas',

    imagenPrincipalAlt: 'Estación de trabajo de RadiologoX mostrando estudios de imagen',

    caracteristicas: [
      { icon: 'search', label: 'Visor diagnóstico avanzado' },
      { icon: 'layers', label: 'Worklist inteligente' },
      { icon: 'file-text', label: 'Informes estructurados' },
      { icon: 'monitor', label: 'Teleradiología segura' },
      { icon: 'scan', label: 'Dicom 3.0 compatibilidad' },
      { icon: 'network', label: 'Integración con RIS/HIS' },
      { icon: 'cloud', label: 'Acceso web en la nube' },
      { icon: 'building', label: 'Multi-sede y multi-institución' },
    ],

    datos: [
      { icon: 'building', valor: '+200', label: 'Instituciones confían en nosotros' },
      { icon: 'users', valor: '1M+', label: 'Estudios procesados' },
      { icon: 'clock', valor: '+10 Años', label: 'de experiencia en el sector salud' },
      { icon: 'headset', valor: 'Soporte 24/7', label: 'Acompañamiento especializado' },
    ],

    pestanas: [
      {
        key: 'descripcion',
        label: 'Descripción',
        titulo: 'Todo tu flujo radiológico en una sola plataforma',
        texto:
          'RadiologoX es un sistema PACS-RIS completo que combina almacenamiento, visualización, gestión de estudios e información clínica en una plataforma web, segura y escalable.',
        puntos: [
          'Centraliza estudios de todas tus modalidades.',
          'Agiliza la interpretación y generación de informes.',
          'Comparte estudios de forma segura y eficiente.',
          'Mejora la productividad de radiólogos y técnicos.',
          'Integra tu institución con otras soluciones del ecosistema LINKDICOM.',
        ],
        imagenAlt: 'Especialista interpretando un estudio en RadiologoX',
      },
      {
        key: 'beneficios',
        label: 'Beneficios',
        titulo: 'Menos tiempo de espera, más capacidad de diagnóstico',
        texto:
          'Al eliminar el traslado físico de estudios y automatizar el flujo de trabajo, tu equipo dedica el tiempo a lo que importa: interpretar y decidir.',
        puntos: [
          'Reduce el tiempo de entrega de resultados al paciente.',
          'Elimina el costo de placas, sobres y mensajería.',
          'Permite lectura remota sin mover al radiólogo de sede.',
          'Evita la pérdida y duplicación de estudios.',
          'Da trazabilidad completa de quién vio cada estudio y cuándo.',
        ],
        imagenAlt: 'Equipo médico revisando indicadores de productividad',
      },
      {
        key: 'funcionalidades',
        label: 'Funcionalidades',
        titulo: 'Herramientas pensadas para el trabajo diario',
        texto:
          'Desde la recepción del estudio hasta la firma del informe, cada paso tiene la herramienta que le corresponde.',
        puntos: [
          'Visor multiplanar con mediciones, ventanas y comparación de estudios.',
          'Worklist con filtros por modalidad, sede, urgencia y estado.',
          'Plantillas de informe por modalidad y firma digital.',
          'Distribución automática de resultados a médicos y pacientes.',
          'Anonimización de estudios para docencia e investigación.',
        ],
        imagenAlt: 'Visor diagnóstico de RadiologoX con herramientas de medición',
      },
      {
        key: 'integraciones',
        label: 'Integraciones',
        titulo: 'Conecta con lo que ya tienes',
        texto:
          'RadiologoX habla los estándares del sector, así que entra en tu operación sin obligarte a cambiar el resto.',
        puntos: [
          'DICOM 3.0 con cualquier modalidad del mercado.',
          'HL7 para intercambio con tu HIS o sistema de historia clínica.',
          'Integración nativa con ECOTurnox, SIEGIX Health y LINKRix.',
          'Portal de resultados para pacientes y médicos referidores.',
          'API para conectar desarrollos propios de tu institución.',
        ],
        imagenAlt: 'Diagrama de integración entre sistemas hospitalarios',
      },
      {
        key: 'casos',
        label: 'Casos de Éxito',
        titulo: 'Instituciones que ya trabajan con RadiologoX',
        texto:
          'Centros de diagnóstico, hospitales y redes médicas en República Dominicana y la región operan hoy su servicio de imágenes sobre esta plataforma.',
        puntos: [
          'Hospital Dr. Nelson Astacio: ecosistema completo en operación.',
          'Hospital Padre Carollo (Ecuador): PACS-RIS junto a HORUSTECH.',
          'Red de centros de diagnóstico con lectura centralizada multi-sede.',
        ],
        imagenAlt: 'Fachada de una institución de salud cliente de LINKDICOM',
      },
    ],

    ctaTitulo: '¿Listo para optimizar tu servicio de imágenes?',
    ctaTexto:
      'Descubre cómo RadiologoX puede mejorar la productividad de tu equipo y la atención de tus pacientes.',
  },
];

/** Barra lateral: el resto del ecosistema, para saltar de una ficha a otra. */
export interface OtroEcosistema {
  nombre: string;
  categoria: string;
  desc: string;
  icon: IconName;
  color: string;
  slug: string;
}

export const OTROS_ECOSISTEMAS: OtroEcosistema[] = [
  {
    nombre: 'RadiologoX',
    categoria: 'PACS · RIS',
    desc: 'Imágenes diagnósticas y teleradiología.',
    icon: 'scan',
    color: '#c9962f',
    slug: 'radiologox',
  },
  {
    nombre: 'ECOTurnox',
    categoria: 'Turnos y Filas',
    desc: 'Sistema inteligente de gestión de turnos y filas.',
    icon: 'users',
    color: '#f97316',
    slug: 'ecoturnox',
  },
  {
    nombre: 'SIEGIX Health',
    categoria: 'Facturación Clínica',
    desc: 'Plataforma de facturación y gestión financiera.',
    icon: 'credit-card',
    color: '#22c55e',
    slug: 'siegix-health',
  },
  {
    nombre: 'SIEGIX CRM',
    categoria: 'Gestión de Clientes',
    desc: 'Administración de clientes en una sola plataforma.',
    icon: 'user-round',
    color: '#a855f7',
    slug: 'siegix-crm',
  },
  {
    nombre: 'LINKRrix',
    categoria: 'Resultados en Línea',
    desc: 'Entrega de resultados en línea para pacientes y médicos.',
    icon: 'monitor',
    color: '#2563eb',
    slug: 'linkrix',
  },
  {
    nombre: 'CONSULTORIOX',
    categoria: 'Consultorios',
    desc: 'Gestión integral de consultorios y pacientes.',
    icon: 'stethoscope',
    color: '#ef4444',
    slug: 'consultoriox',
  },
  {
    nombre: 'LaboratoriuX',
    categoria: 'Sistema de Laboratorio',
    desc: 'Gestión completa de laboratorios clínicos y especializados.',
    icon: 'microscope',
    color: '#14b8a6',
    slug: 'laboratoriux',
  },
  {
    nombre: 'LinkBurnPrint',
    categoria: 'Entrega de Resultados',
    desc: 'Impresión y grabación de estudios en CD/DVD.',
    icon: 'printer',
    color: '#eab308',
    slug: 'linkburnprint',
  },
  {
    nombre: 'SIEGIX PROVIDER',
    categoria: 'ERP para diversas industrias',
    desc: 'Sistema ERP completo para empresas e instituciones.',
    icon: 'database',
    color: '#8b5cf6',
    slug: 'siegix-provider',
  },
  {
    nombre: 'LinkXpace',
    categoria: 'Sitios Web, Hosting y Dominios',
    desc: 'Diseño web profesional y servicios de hosting para tu institución.',
    icon: 'globe',
    color: '#2fa8e0',
    slug: 'linkxpace',
  },
];
