import type { IconName } from '../components/ui/Icon';

/*
  Ficha de ecosistema. Es una plantilla distinta a la de producto: aqui manda
  el sector (hospital, laboratorio, consultorio...) y no una herramienta suelta.

  Las imagenes todavia no estan: mientras el campo venga vacio la pagina pinta
  un marcador que describe la foto que falta.
*/

export interface PilarEcosistema {
  icon: IconName;
  color: string;
  titulo: string;
  texto: string;
}

export interface EnlaceEcosistema {
  slug: string;
  titulo: string;
  texto: string;
  icon: IconName;
  color: string;
  imagen?: string;
  imagenAlt: string;
}

export interface Ecosistema {
  slug: string;
  /** Color de acento de toda la ficha. */
  acento: string;
  /** Nombre corto para las migas. */
  miga: string;
  titulo: string;
  /** Segunda linea del titular, en el color de acento. Opcional. */
  tituloAccent?: string;
  intro: string;
  bullets: { icon: IconName; label: string }[];

  heroImagen?: string;
  heroImagenAlt: string;
  /** Palabras sueltas sobre la foto del hero. */
  heroLema?: string[];

  datos: { icon: IconName; valor: string; label: string }[];

  bandaTitulo: string;
  bandaTituloAccent: string;
  bandaTexto: string;

  pilaresEyebrow: string;
  pilaresTitulo: string;
  pilares: PilarEcosistema[];

  otrosTitulo: string;
  otros: EnlaceEcosistema[];

  ctaTitulo: string;
  ctaTexto: string;
}

export const ECOSISTEMAS: Ecosistema[] = [
  {
    slug: 'centros-de-diagnostico',
    acento: '#f97316',
    miga: 'Centros de Diagnóstico',
    titulo: 'Centros de Diagnóstico',
    intro:
      'Un ecosistema completo e integrado que optimiza cada proceso de tu centro de diagnóstico, mejora la experiencia del paciente y potencia la productividad de tu equipo.',
    bullets: [
      { icon: 'cpu', label: 'Más eficiencia operativa' },
      { icon: 'user-round', label: 'Mejor experiencia del paciente' },
      { icon: 'lock', label: 'Información centralizada y segura' },
      { icon: 'chart', label: 'Decisiones basadas en datos' },
    ],
    heroImagen: '/img/ecosistemas/centros-de-diagnostico.webp',
    heroImagenAlt: 'Sala de un centro de diagnóstico con equipos y personal técnico',

    datos: [
      { icon: 'building', valor: '+200', label: 'Centros de diagnóstico confían en nosotros' },
      { icon: 'users', valor: '+2,300', label: 'Usuarios activos diariamente' },
      { icon: 'image', valor: '+1M', label: 'Pacientes atendidos en nuestra plataforma' },
      { icon: 'clock', valor: '99.9%', label: 'Disponibilidad de nuestros sistemas' },
    ],

    bandaTitulo: 'Lo tenemos',
    bandaTituloAccent: 'todo para tu centro diagnóstico',
    bandaTexto:
      'Integramos tecnología, procesos y datos en un solo ecosistema para que tu centro de diagnóstico opere con máxima eficiencia. Desde la facturación electrónica, gestión de imágenes (PACS) y flujos de trabajo (RIS), hasta la gestión de turnos, sistema de laboratorio con portal de entrega de resultados, encuestas de satisfacción y mucho más. Todo diseñado para simplificar tu operación, reducir tiempos de espera y ofrecer una experiencia superior a tus pacientes.',

    pilaresEyebrow: 'Características clave',
    pilaresTitulo: 'Todo lo que tu centro de diagnóstico necesita',
    pilares: [
      {
        icon: 'user-round',
        color: '#2563eb',
        titulo: 'Gestión Integral de Pacientes',
        texto: 'Registro centralizado, historial clínico y seguimiento completo del paciente en cada etapa.',
      },
      {
        icon: 'image',
        color: '#8b5cf6',
        titulo: 'Imágenes Médicas Inteligentes',
        texto: 'PACS para almacenamiento, visualización y compartición segura de imágenes diagnósticas.',
      },
      {
        icon: 'cpu',
        color: '#22c55e',
        titulo: 'Flujo de Trabajo Optimizado',
        texto: 'RIS que automatiza procesos, asigna tareas y mejora la productividad del personal.',
      },
      {
        icon: 'file-text',
        color: '#f97316',
        titulo: 'Facturación Electrónica',
        texto: 'Emite comprobantes fiscales, controla pagos y cumple con las normativas de forma sencilla.',
      },
      {
        icon: 'microscope',
        color: '#ec4899',
        titulo: 'Sistema de Laboratorio',
        texto: 'Gestión completa de laboratorios con portal de entrega de resultados a tus pacientes.',
      },
      {
        icon: 'calendar',
        color: '#14b8a6',
        titulo: 'Gestión de Turnos',
        texto: 'Organiza citas y turnos de forma inteligente, reduciendo tiempos de espera y ausencias.',
      },
      {
        icon: 'heart',
        color: '#eab308',
        titulo: 'Encuestas y Satisfacción',
        texto: 'Mide la experiencia del paciente y mejora continuamente la calidad de tu servicio.',
      },
      {
        icon: 'send',
        color: '#2563eb',
        titulo: 'Entrega de Resultados',
        texto:
          'Comparte resultados en línea de forma segura y rápida. Nuestro portal entrega imágenes y laboratorios en un solo lugar.',
      },
      {
        icon: 'chart',
        color: '#8b5cf6',
        titulo: 'Reportes y Analítica',
        texto: 'Paneles en tiempo real para tomar decisiones estratégicas basadas en datos confiables.',
      },
    ],

    otrosTitulo: 'También impulsamos otras áreas de la salud',
    otros: [
      {
        slug: 'hospitalario',
        titulo: 'Ecosistema Hospitalario',
        texto: 'Soluciones integrales para hospitales y clínicas de todos los tamaños.',
        icon: 'hospital',
        color: '#2563eb',
        imagen: '/img/ecosistemas/hospitalario-tarjeta.webp',
        imagenAlt: 'Entrada de un hospital moderno con su sala de espera',
      },
      {
        slug: 'laboratorios',
        titulo: 'Laboratorios',
        texto: 'Gestión completa para laboratorios clínicos y especializados.',
        icon: 'microscope',
        color: '#22c55e',
        imagen: '/img/ecosistemas/laboratorios-tarjeta.webp',
        imagenAlt: 'Técnica de laboratorio procesando muestras junto a la pantalla de LaboratoriuX',
      },
      {
        slug: 'consultorios',
        titulo: 'Consultorios',
        texto: 'Herramientas diseñadas para consultorios y profesionales de la salud.',
        icon: 'user-round',
        color: '#f97316',
        imagen: '/img/ecosistemas/consultorios-tarjeta.webp',
        imagenAlt: 'Médico revisando el historial de una paciente en la tableta',
      },
    ],

    ctaTitulo: '¿Listo para transformar tu centro de diagnóstico?',
    ctaTexto:
      'Descubre cómo nuestro ecosistema puede ayudarte a ser más eficiente, ofrecer una mejor experiencia y hacer crecer tu institución.',
  },

  {
    slug: 'hospitalario',
    acento: '#2563eb',
    miga: 'Ecosistema Hospitalario',
    titulo: 'Hospitalario',
    intro:
      'Un ecosistema integral que unifica personas, procesos y tecnología en todo tu hospital, desde la admisión del paciente hasta la entrega de resultados, optimizando recursos, mejorando la continuidad de la atención y garantizando una experiencia más segura, eficiente y humana.',
    bullets: [
      { icon: 'building', label: 'Hospitales más conectados' },
      { icon: 'cpu', label: 'Procesos más eficientes' },
      { icon: 'lock', label: 'Información centralizada y segura' },
      { icon: 'user-round', label: 'Mejor experiencia del paciente' },
    ],
    heroImagen: '/img/ecosistemas/hospitalario.webp',
    heroImagenAlt: 'Entrada de un hospital moderno con la sala de espera y el panel de turnos',
    heroLema: ['Salud', 'Tecnología', 'Personas', 'Resultados'],

    datos: [
      { icon: 'building', valor: '+50', label: 'Hospitales confían en nosotros' },
      { icon: 'users', valor: '+12,000', label: 'Usuarios activos diariamente' },
      { icon: 'file-text', valor: '+5M', label: 'Estudios e informes gestionados' },
      { icon: 'clock', valor: '99.9%', label: 'Disponibilidad de nuestros sistemas' },
    ],

    bandaTitulo: 'Lo tenemos',
    bandaTituloAccent: 'todo para tu hospital',
    bandaTexto:
      'Integramos tecnología, procesos y datos en un solo ecosistema para que tu hospital opere con máxima eficiencia. Desde la facturación electrónica, gestión de imágenes (PACS) y flujos de trabajo (RIS), hasta la gestión de turnos, sistema de laboratorio con portal de entrega de resultados, encuestas de satisfacción, control de hospitalización y mucho más. Todo diseñado para mejorar la atención, optimizar recursos y ofrecer una experiencia superior a tus pacientes.',

    pilaresEyebrow: 'Características clave',
    pilaresTitulo: 'Todo lo que tu hospital necesita',
    pilares: [
      {
        icon: 'user-round',
        color: '#2563eb',
        titulo: 'Gestión Integral de Pacientes',
        texto:
          'Registro centralizado, historial clínico y seguimiento completo del paciente en todas las áreas del hospital.',
      },
      {
        icon: 'image',
        color: '#8b5cf6',
        titulo: 'Imágenes Médicas Inteligentes',
        texto:
          'PACS para almacenamiento, visualización y compartición segura de imágenes diagnósticas en todos los servicios.',
      },
      {
        icon: 'cpu',
        color: '#22c55e',
        titulo: 'Flujo de Trabajo Optimizado',
        texto: 'RIS que automatiza procesos, asigna tareas y mejora la productividad del personal.',
      },
      {
        icon: 'file-text',
        color: '#f97316',
        titulo: 'Facturación Electrónica',
        texto: 'Emite comprobantes fiscales, controla pagos y cumple con las normativas de forma sencilla.',
      },
      {
        icon: 'microscope',
        color: '#ec4899',
        titulo: 'Sistema de Laboratorio',
        texto: 'Gestión completa de laboratorios con portal de entrega de resultados a pacientes.',
      },
      {
        icon: 'calendar',
        color: '#14b8a6',
        titulo: 'Gestión de Turnos',
        texto:
          'Organiza citas y turnos en todas las áreas del hospital, reduciendo tiempos de espera y mejorando el flujo de pacientes.',
      },
      {
        icon: 'heart',
        color: '#eab308',
        titulo: 'Hospitalización y Camas',
        texto: 'Control de ingresos, traslados, altas médicas y disponibilidad de camas en tiempo real.',
      },
      {
        icon: 'star',
        color: '#38bdf8',
        titulo: 'Encuestas y Satisfacción',
        texto: 'Mide la experiencia del paciente y mejora continuamente la calidad de tu servicio.',
      },
      {
        icon: 'send',
        color: '#8b5cf6',
        titulo: 'Entrega de Resultados',
        texto: 'Comparte resultados de imágenes y laboratorio en línea de forma segura y rápida.',
      },
      {
        icon: 'chart',
        color: '#2563eb',
        titulo: 'Reportes y Analítica',
        texto: 'Paneles en tiempo real para tomar decisiones estratégicas basadas en datos confiables.',
      },
    ],

    otrosTitulo: 'También impulsamos otras áreas de la salud',
    otros: [
      {
        slug: 'centros-de-diagnostico',
        titulo: 'Centros de Diagnóstico',
        texto: 'Soluciones completas para centros de diagnóstico de todos los tamaños.',
        icon: 'hospital',
        color: '#2563eb',
        imagen: '/img/ecosistemas/centros-de-diagnostico-tarjeta.webp',
        imagenAlt: 'Recepción de un centro de diagnóstico con la sala de imagen al fondo',
      },
      {
        slug: 'laboratorios',
        titulo: 'Laboratorios',
        texto: 'Gestión completa para laboratorios clínicos y especializados.',
        icon: 'microscope',
        color: '#22c55e',
        imagen: '/img/ecosistemas/laboratorios-tarjeta.webp',
        imagenAlt: 'Técnica de laboratorio procesando muestras junto a la pantalla de LaboratoriuX',
      },
      {
        slug: 'consultorios',
        titulo: 'Consultorios',
        texto: 'Herramientas diseñadas para consultorios y profesionales de la salud.',
        icon: 'user-round',
        color: '#f97316',
        imagen: '/img/ecosistemas/consultorios-tarjeta.webp',
        imagenAlt: 'Médico revisando el historial de una paciente en la tableta',
      },
    ],

    ctaTitulo: '¿Listo para transformar tu hospital?',
    ctaTexto:
      'Descubre cómo nuestro ecosistema puede ayudarte a ser más eficiente, ofrecer una mejor experiencia y hacer crecer tu institución.',
  },

  {
    slug: 'laboratorios',
    acento: '#1aa37a',
    miga: 'LaboratoriuX',
    titulo: 'Laboratorios más ágiles.',
    tituloAccent: 'Resultados que conectan.',
    intro:
      'Una plataforma moderna que digitaliza y unifica toda la operación de tu laboratorio clínico, desde la recepción de muestras hasta la entrega de resultados, con un portal seguro para pacientes y médicos.',
    bullets: [
      { icon: 'zap', label: 'Procesos automatizados y sin papel' },
      { icon: 'users', label: 'Conectividad con médicos y centros de salud' },
      { icon: 'shield', label: 'Cumplimiento normativo y control de calidad' },
      { icon: 'chart', label: 'Información en tiempo real para mejores decisiones' },
    ],
    heroImagen: '/img/ecosistemas/laboratorios.webp',
    heroImagenAlt: 'Técnica de laboratorio revisando una muestra junto a la pantalla de resultados',

    datos: [
      { icon: 'microscope', valor: '+300', label: 'Laboratorios confían en nosotros' },
      { icon: 'users', valor: '+5M', label: 'Resultados entregados a pacientes' },
      { icon: 'clock', valor: '99.8%', label: 'Disponibilidad de la plataforma' },
      { icon: 'file-text', valor: '100%', label: 'Cumplimiento con normativas (CLSI, CAP)' },
    ],

    bandaTitulo: 'Todo tu laboratorio',
    bandaTituloAccent: 'en una sola plataforma',
    bandaTexto:
      'LaboratoriuX integra tecnología, precisión y conectividad para que tu laboratorio opere de forma más inteligente. Automatiza tareas, reduce errores, mejora los tiempos de entrega y ofrece una experiencia digital superior a tus pacientes y médicos.',

    pilaresEyebrow: 'Pilares de tu laboratorio digital',
    pilaresTitulo: 'Todo lo que tu laboratorio necesita',
    pilares: [
      {
        icon: 'microscope',
        color: '#8b5cf6',
        titulo: 'Gestión de Muestras',
        texto: 'Registro con código de barras, trazabilidad completa y seguimiento en tiempo real.',
      },
      {
        icon: 'cpu',
        color: '#22c55e',
        titulo: 'Integración con Equipos',
        texto: 'Conecta analizadores automatizados y recibe resultados de forma directa y segura.',
      },
      {
        icon: 'check-circle',
        color: '#2563eb',
        titulo: 'Validación y Control de Calidad',
        texto: 'Reglas automáticas, revisión técnica y cumplimiento de estándares internacionales.',
      },
      {
        icon: 'users',
        color: '#f97316',
        titulo: 'Portal de Resultados',
        texto: 'Entrega de resultados en línea para pacientes y médicos. Un solo portal, imágenes y laboratorios.',
      },
      {
        icon: 'user-round',
        color: '#ec4899',
        titulo: 'Gestión de Pacientes y Médicos',
        texto: 'Historial completo, perfiles, solicitudes y comunicación centralizada.',
      },
      {
        icon: 'chart',
        color: '#38bdf8',
        titulo: 'Reportes y Estadísticas',
        texto: 'Indicadores clave, productividad, tiempos de entrega y análisis para la toma de decisiones.',
      },
      {
        icon: 'shield',
        color: '#eab308',
        titulo: 'Seguridad y Cumplimiento',
        texto: 'Control de accesos, auditoría y cumplimiento con normativas locales e internacionales.',
      },
      {
        icon: 'cloud',
        color: '#14b8a6',
        titulo: 'Acceso en la Nube o Local',
        texto: 'Infraestructura flexible que se adapta a las necesidades de tu laboratorio.',
      },
    ],

    otrosTitulo: 'Una atención en salud más completa y conectada',
    otros: [
      {
        slug: 'hospitalario',
        titulo: 'Ecosistema Hospitalario',
        texto: 'Conecta departamentos, optimiza recursos y mejora la atención en todas las áreas del hospital.',
        icon: 'hospital',
        color: '#2563eb',
        imagen: '/img/ecosistemas/hospitalario-tarjeta.webp',
        imagenAlt: 'Entrada de un hospital moderno con su sala de espera',
      },
      {
        slug: 'centros-de-diagnostico',
        titulo: 'Centros de Diagnóstico',
        texto: 'Gestión de imágenes, turnos y facturación en un solo ecosistema.',
        icon: 'monitor',
        color: '#8b5cf6',
        imagen: '/img/ecosistemas/centros-de-diagnostico-tarjeta.webp',
        imagenAlt: 'Recepción de un centro de diagnóstico con la sala de imagen al fondo',
      },
      {
        slug: 'consultorios',
        titulo: 'Consultorios',
        texto: 'Soluciones prácticas para consultorios y profesionales de la salud.',
        icon: 'user-round',
        color: '#f97316',
        imagen: '/img/ecosistemas/consultorios-tarjeta.webp',
        imagenAlt: 'Médico revisando el historial de una paciente en la tableta',
      },
    ],

    ctaTitulo: '¿Listo para llevar tu laboratorio al siguiente nivel?',
    ctaTexto:
      'Descubre cómo LaboratoriuX puede ayudarte a mejorar la eficiencia, la calidad y la experiencia de tus pacientes.',
  },

  {
    slug: 'consultorios',
    acento: '#38bdf8',
    miga: 'ConsultorioX',
    titulo: 'La gestión de tu consultorio,',
    tituloAccent: 'más simple, más inteligente.',
    intro:
      'Una plataforma completa para consultorios médicos individuales o en grupo, diseñada para optimizar tu tiempo, mejorar la atención a tus pacientes y hacer crecer tu práctica profesional.',
    bullets: [
      { icon: 'calendar', label: 'Atención más organizada y eficiente' },
      { icon: 'heart', label: 'Mejor experiencia para tus pacientes' },
      { icon: 'cloud', label: 'Acceso desde cualquier lugar' },
      { icon: 'shield', label: 'Segura, confiable y en constante evolución' },
    ],
    heroImagen: '/img/ecosistemas/consultorios.webp',
    heroImagenAlt: 'Médico atendiendo a una paciente con ConsultorioX en pantalla',

    datos: [
      { icon: 'users', valor: '+5,000', label: 'Profesionales de la salud confían en nosotros' },
      { icon: 'user-round', valor: '+200,000', label: 'Pacientes gestionados en la plataforma' },
      { icon: 'clock', valor: '99.9%', label: 'Disponibilidad del servicio' },
      { icon: 'cloud', valor: 'Local o en la nube', label: 'Tú eliges cómo trabajar' },
    ],

    bandaTitulo: 'Tu consultorio,',
    bandaTituloAccent: 'sin límites',
    bandaTexto:
      'ConsultorioX te brinda todas las herramientas que necesitas para administrar tu consultorio o red de consultorios en un solo lugar. Desde la gestión de pacientes y citas, hasta la facturación electrónica y la integración con sistemas externos, todo diseñado para que te enfoques en lo más importante: tus pacientes.',

    pilaresEyebrow: 'Características principales',
    pilaresTitulo: 'Todo lo que necesitas para una práctica médica eficiente',
    pilares: [
      {
        icon: 'calendar',
        color: '#2563eb',
        titulo: 'Agendamiento y Citas',
        texto:
          'Gestiona tu agenda, agenda citas en línea y envía recordatorios automáticos por WhatsApp, SMS y correo.',
      },
      {
        icon: 'user-round',
        color: '#8b5cf6',
        titulo: 'Gestión de Pacientes',
        texto: 'Historial clínico completo, antecedentes, evoluciones y documentos en un solo lugar.',
      },
      {
        icon: 'file-text',
        color: '#22c55e',
        titulo: 'Facturación Electrónica',
        texto: 'Emite comprobantes fiscales, controla pagos y gestiona seguros médicos de forma sencilla.',
      },
      {
        icon: 'layers',
        color: '#f97316',
        titulo: 'Historia Clínica Digital',
        texto: 'Registra consultas, diagnósticos, tratamientos y adjunta estudios e imágenes.',
      },
      {
        icon: 'network',
        color: '#ec4899',
        titulo: 'Integración con Terceros',
        texto: 'Conecta con laboratorios, centros de imágenes, aseguradoras y otros sistemas.',
      },
      {
        icon: 'users',
        color: '#14b8a6',
        titulo: 'Multi-Consultorio',
        texto:
          'Ideal para profesionales independientes o grupos de consultorios, con control de usuarios y sedes.',
      },
      {
        icon: 'chart',
        color: '#8b5cf6',
        titulo: 'Reportes y Estadísticas',
        texto: 'Conoce el rendimiento de tu práctica con reportes en tiempo real y toma mejores decisiones.',
      },
      {
        icon: 'cloud',
        color: '#eab308',
        titulo: 'Acceso Flexible',
        texto:
          'Disponible en la nube o en tu servidor local. Tú eliges la modalidad que mejor se adapte a tu práctica.',
      },
    ],

    otrosTitulo: 'Conectamos toda la cadena de la salud',
    otros: [
      {
        slug: 'hospitalario',
        titulo: 'Ecosistema Hospitalario',
        texto: 'Soluciones integrales para hospitales y clínicas de todos los tamaños.',
        icon: 'hospital',
        color: '#2563eb',
        imagen: '/img/ecosistemas/hospitalario-tarjeta.webp',
        imagenAlt: 'Entrada de un hospital moderno con su sala de espera',
      },
      {
        slug: 'centros-de-diagnostico',
        titulo: 'Centros de Diagnóstico',
        texto: 'PACS, RIS y gestión completa para centros de diagnóstico.',
        icon: 'monitor',
        color: '#8b5cf6',
        imagen: '/img/ecosistemas/centros-de-diagnostico-tarjeta.webp',
        imagenAlt: 'Recepción de un centro de diagnóstico con la sala de imagen al fondo',
      },
      {
        slug: 'laboratorios',
        titulo: 'LaboratoriuX',
        texto: 'Gestión completa para laboratorios clínicos y especializados.',
        icon: 'microscope',
        color: '#22c55e',
        imagen: '/img/ecosistemas/laboratorios-tarjeta.webp',
        imagenAlt: 'Técnica de laboratorio procesando muestras junto a la pantalla de LaboratoriuX',
      },
    ],

    ctaTitulo: '¿Listo para llevar tu consultorio al siguiente nivel?',
    ctaTexto:
      'Descubre cómo ConsultorioX puede ayudarte a optimizar tu práctica, mejorar la atención a tus pacientes y hacer crecer tu consulta.',
  },
];
