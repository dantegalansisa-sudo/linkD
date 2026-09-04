import type { IconName } from '../components/ui/Icon';

/*
  Ficha de producto empresarial. Se parece a la de salud pero no es la misma:
  no lleva cabecera de seccion, trae seis pestanas en vez de cinco y anade dos
  bloques laterales, "Te podrian interesar" y "Por que elegir".
*/

export interface VentajaEmpresarial {
  icon: IconName;
  titulo: string;
  texto: string;
}

export interface PestanaEmpresarial {
  key: string;
  label: string;
  titulo: string;
  texto: string;
  puntos: string[];
  imagen?: string;
  imagenAlt: string;
}

export interface Relacionado {
  slug: string;
  nombre: string;
  texto: string;
  icon: IconName;
  color: string;
}

export interface Empresarial {
  slug: string;
  categoria: string;
  nombre: string;
  /** Segunda palabra del logotipo, en otro color. */
  nombreAccent?: string;
  color: string;
  titulo: string;
  intro: string;
  ctaPrincipal: string;
  ctaSecundario: string;

  imagenPrincipal?: string;
  imagenPrincipalAlt: string;

  sellos: { icon: IconName; titulo: string; texto: string }[];
  pestanas: PestanaEmpresarial[];
  porQueTitulo: string;
  porQue: VentajaEmpresarial[];
  relacionados: Relacionado[];

  cierreTitulo: string;
  cierreTexto: string;
  cierreIcono: IconName;
}

const REL: Record<string, Relacionado> = {
  crm: {
    slug: 'siegix-crm',
    nombre: 'SIEGIX CRM',
    texto: 'Para la administración de clientes de su negocio.',
    icon: 'user-round',
    color: '#e0489a',
  },
  provider: {
    slug: 'siegix-provider',
    nombre: 'SIEGIX Provider',
    texto: 'Sistema de facturación para empresas de servicios.',
    icon: 'chart',
    color: '#f97316',
  },
  core: {
    slug: 'siegix-core',
    nombre: 'SIEGIX Core',
    texto: 'Interfaz con la facturación electrónica de la DGII.',
    icon: 'cloud',
    color: '#2fa8e0',
  },
  xpace: {
    slug: 'linkxpace',
    nombre: 'LinkXpace',
    texto: 'Sitios web, hosting y dominios.',
    icon: 'globe',
    color: '#f59e0b',
  },
};

export const EMPRESARIALES: Empresarial[] = [
  {
    slug: 'linkxpace',
    categoria: 'Servicios digitales y cloud',
    nombre: 'Link',
    nombreAccent: 'Xpace',
    color: '#2fa8e0',
    titulo: 'Tu presencia digital comienza aquí',
    intro:
      'LinkXpace es la plataforma de servicios digitales de LINKDICOM para que tu negocio construya, proteja y escale su presencia en internet. Ofrecemos dominios, hospedaje web, servidores VPS, certificados SSL, diseño web y más, con la seguridad, soporte y confiabilidad que tu proyecto necesita.',
    ctaPrincipal: '¡Quiero este producto!',
    ctaSecundario: 'Ver planes y precios',
    imagenPrincipalAlt: 'Sitio web de LinkXpace en ordenador y móvil',

    sellos: [
      { icon: 'zap', titulo: 'Rápido y Seguro', texto: 'Infraestructura de alto rendimiento' },
      { icon: 'headset', titulo: 'Soporte 24/7', texto: 'Asistencia técnica especializada' },
      { icon: 'chart', titulo: 'Escalable', texto: 'Crece sin límites' },
      { icon: 'shield', titulo: 'Confianza', texto: 'Una marca de LINKDICOM' },
    ],

    pestanas: [
      {
        key: 'descripcion',
        label: 'Descripción',
        titulo: 'Todo lo que necesitas para llevar tu negocio al siguiente nivel',
        texto:
          'En LinkXpace te ofrecemos un ecosistema completo de servicios digitales, con la calidad, seguridad y respaldo de LINKDICOM. Desde el registro de tu dominio hasta el diseño de tu sitio web y la infraestructura en la nube, te acompañamos en cada paso.',
        puntos: [
          'Registro y gestión de dominios (nuevos y transferencias).',
          'Hosting web de alto rendimiento y seguridad.',
          'Servidores VPS escalables.',
          'Certificados SSL para una navegación segura.',
          'Diseño y desarrollo de sitios web profesionales.',
          'Correo profesional con tu propio dominio.',
          'Copias de seguridad automáticas.',
          'Soporte técnico especializado 24/7.',
        ],
        imagenAlt: 'Centro de datos con infraestructura en la nube',
      },
      {
        key: 'caracteristicas',
        label: 'Características',
        titulo: 'Infraestructura pensada para no darte trabajo',
        texto:
          'Todo el servicio se administra desde un mismo panel, sin saltar entre proveedores ni facturas sueltas.',
        puntos: [
          'Panel único para dominios, hosting y correo.',
          'Certificados SSL emitidos y renovados automáticamente.',
          'Copias de seguridad diarias con restauración a un clic.',
          'Monitoreo permanente de disponibilidad.',
        ],
        imagenAlt: 'Panel de administración de servicios de LinkXpace',
      },
      {
        key: 'planes',
        label: 'Planes',
        titulo: 'Un plan para cada etapa de tu negocio',
        texto:
          'Desde el emprendedor que registra su primer dominio hasta la institución que necesita servidores dedicados.',
        puntos: [
          'Inicio: dominio, correo y hosting compartido.',
          'Profesional: más recursos, SSL y copias diarias.',
          'Empresa: VPS dedicado con recursos garantizados.',
          'A medida: infraestructura diseñada para tu proyecto.',
        ],
        imagenAlt: 'Comparativa de planes de LinkXpace',
      },
      {
        key: 'casos',
        label: 'Casos de Éxito',
        titulo: 'Proyectos que ya viven en LinkXpace',
        texto: 'Instituciones de salud, comercios y profesionales tienen aquí su presencia digital.',
        puntos: [
          'Instituciones de salud con portal de pacientes.',
          'Comercios con tienda en línea y correo corporativo.',
          'Profesionales independientes con sitio y dominio propio.',
        ],
        imagenAlt: 'Sitios web alojados en LinkXpace',
      },
      {
        key: 'faq',
        label: 'Preguntas Frecuentes',
        titulo: 'Dudas habituales antes de contratar',
        texto: 'Lo que más nos preguntan quienes están evaluando mover su presencia digital.',
        puntos: [
          '¿Puedo traer mi dominio desde otro proveedor? Sí, gestionamos la transferencia completa.',
          '¿Migran mi sitio actual? Sí, sin costo adicional en los planes profesionales.',
          '¿El SSL tiene costo aparte? No, va incluido y se renueva solo.',
          '¿Qué pasa si mi proyecto crece? Se escala de plan sin cambiar de servidor.',
        ],
        imagenAlt: 'Asesor de LinkXpace atendiendo una consulta',
      },
    ],

    porQueTitulo: '¿Por qué elegir LinkXpace?',
    porQue: [
      { icon: 'star', titulo: 'Experiencia y respaldo', texto: 'Parte del grupo LINKDICOM.' },
      { icon: 'shield', titulo: 'Infraestructura confiable', texto: 'Servidores de última generación.' },
      { icon: 'cpu', titulo: 'Gestión fácil y centralizada', texto: 'Todo en un solo lugar.' },
      { icon: 'users', titulo: 'Soporte real', texto: 'Personas que te entienden.' },
      { icon: 'building', titulo: 'Planes para cada necesidad', texto: 'Desde emprendedores hasta grandes empresas.' },
    ],

    relacionados: [REL.crm, REL.provider, REL.core],

    cierreTitulo: '¿Listo para llevar tu negocio al mundo digital?',
    cierreTexto: 'Registra tu dominio, elige tu plan y comienza hoy mismo con LinkXpace.',
    cierreIcono: 'globe',
  },

  {
    slug: 'siegix-crm',
    categoria: 'Gestión comercial y relación con clientes',
    nombre: 'SIEGIX',
    nombreAccent: 'CRM',
    color: '#e0489a',
    titulo: 'Convierte oportunidades en crecimiento',
    intro:
      'SIEGIX CRM es una plataforma completa para la gestión de clientes, ventas, proyectos y soporte. Diseñada para empresas de cualquier industria, te ayuda a organizar tus procesos, automatizar tareas y mejorar la relación con tus clientes, todo en un solo lugar.',
    ctaPrincipal: '¡Quiero este producto!',
    ctaSecundario: 'Ver planes y precios',
    imagenPrincipalAlt: 'Panel de SIEGIX CRM con oportunidades y ventas del mes',

    sellos: [
      { icon: 'users', titulo: 'Gestión de clientes', texto: '360°' },
      { icon: 'cpu', titulo: 'Automatización', texto: 'de procesos' },
      { icon: 'chart', titulo: 'Aumento', texto: 'en ventas' },
      { icon: 'headset', titulo: 'Mejor servicio', texto: 'al cliente' },
      { icon: 'activity', titulo: 'Decisiones', texto: 'basadas en datos' },
    ],

    pestanas: [
      {
        key: 'descripcion',
        label: 'Descripción',
        titulo: 'Todo tu negocio conectado con tus clientes',
        texto:
          'SIEGIX CRM te permite centralizar la información de tus clientes, leads, oportunidades y proyectos, automatizar tus procesos comerciales y de servicio, y trabajar en equipo de manera más eficiente. Diseñado para adaptarse a las necesidades de empresas de distintos sectores, es la herramienta ideal para hacer crecer tu negocio.',
        puntos: [
          'Gestión de leads, clientes y oportunidades.',
          'Pipeline de ventas personalizable.',
          'Automatización de tareas y recordatorios.',
          'Calendario y agenda integrada.',
          'Gestión de proyectos y actividades.',
          'Módulo de soporte y servicio al cliente (tickets).',
          'Campañas de marketing y correo masivo.',
          'Reportes y paneles de estadísticas.',
          'Integraciones con aplicaciones de terceros.',
          'Acceso seguro desde cualquier dispositivo.',
        ],
        imagenAlt: 'Equipo comercial trabajando con SIEGIX CRM',
      },
      {
        key: 'funcionalidades',
        label: 'Funcionalidades',
        titulo: 'Del primer contacto al cliente fiel',
        texto: 'Cada etapa del ciclo comercial tiene su herramienta dentro de la misma plataforma.',
        puntos: [
          'Captura de leads desde formularios y campañas.',
          'Embudo de ventas con etapas configurables.',
          'Cotizaciones y contratos desde la ficha del cliente.',
          'Tickets de soporte con acuerdos de nivel de servicio.',
        ],
        imagenAlt: 'Embudo de ventas en SIEGIX CRM',
      },
      {
        key: 'beneficios',
        label: 'Beneficios',
        titulo: 'Nada se pierde entre correos y hojas de cálculo',
        texto:
          'Cuando toda la relación con el cliente vive en un sitio, deja de depender de quién se acuerde de qué.',
        puntos: [
          'Ninguna oportunidad se enfría por olvido.',
          'El historial del cliente no se va con quien lo atendía.',
          'La dirección ve el estado real del negocio en cualquier momento.',
        ],
        imagenAlt: 'Panel de indicadores comerciales',
      },
      {
        key: 'integraciones',
        label: 'Integraciones',
        titulo: 'Conectado con el resto de tus herramientas',
        texto: 'SIEGIX CRM no vive aislado: se enlaza con lo que ya usa tu empresa.',
        puntos: [
          'Integración con SIEGIX Provider y SIEGIX Core.',
          'Correo electrónico y calendario.',
          'API abierta para desarrollos propios.',
        ],
        imagenAlt: 'Esquema de integraciones de SIEGIX CRM',
      },
      {
        key: 'casos',
        label: 'Casos de Éxito',
        titulo: 'Empresas que ya ordenaron su área comercial',
        texto: 'Compañías de distintos sectores gestionan hoy sus clientes con SIEGIX CRM.',
        puntos: [
          'Empresas de servicios con equipos comerciales distribuidos.',
          'Distribuidoras con cartera amplia de clientes.',
          'Instituciones que centralizaron su atención al cliente.',
        ],
        imagenAlt: 'Equipo comercial de una empresa cliente',
      },
      {
        key: 'faq',
        label: 'Preguntas Frecuentes',
        titulo: 'Lo que más nos preguntan',
        texto: 'Dudas habituales antes de implantar el CRM.',
        puntos: [
          '¿Puedo importar mi cartera actual? Sí, desde Excel o desde otro CRM.',
          '¿Sirve para mi sector? Los flujos son configurables por industria.',
          '¿Cuánto tarda la puesta en marcha? Depende del volumen, normalmente semanas.',
        ],
        imagenAlt: 'Asesor de SIEGIX resolviendo dudas',
      },
    ],

    porQueTitulo: '¿Por qué elegir SIEGIX CRM?',
    porQue: [
      { icon: 'star', titulo: 'Incrementa tus ventas', texto: 'Convierte más oportunidades en clientes.' },
      { icon: 'users', titulo: 'Mejora la experiencia del cliente', texto: 'Brinda un servicio más rápido y personalizado.' },
      { icon: 'cpu', titulo: 'Automatiza tu negocio', texto: 'Ahorrarás tiempo y reducirás tareas manuales.' },
      { icon: 'chart', titulo: 'Información en tiempo real', texto: 'Toma decisiones con datos confiables.' },
      { icon: 'shield', titulo: 'Flexible y adaptable', texto: 'Funciona para cualquier industria y tamaño de empresa.' },
      { icon: 'cloud', titulo: 'Siempre disponible', texto: 'Accede desde cualquier lugar, en la nube y con máxima seguridad.' },
    ],

    relacionados: [REL.provider, REL.xpace, REL.core],

    cierreTitulo: '¿Listo para hacer crecer tu negocio?',
    cierreTexto:
      'SIEGIX CRM te da las herramientas para conquistar más clientes y llevar tu empresa al siguiente nivel.',
    cierreIcono: 'chart',
  },

  {
    slug: 'siegix-provider',
    categoria: 'Gestión empresarial',
    nombre: 'SIEGIX',
    nombreAccent: 'Provider',
    color: '#f97316',
    titulo: 'La plataforma completa para empresas de servicios',
    intro:
      'SIEGIX Provider te permite administrar, facturar y controlar todos los procesos de tu empresa en una sola plataforma. Diseñado para empresas de servicios de diversas industrias, con trazabilidad completa, herramientas modernas y automatización de tareas, para que te enfoques en hacer crecer tu negocio.',
    ctaPrincipal: '¡Quiero este producto!',
    ctaSecundario: 'Ver planes y precios',
    imagenPrincipalAlt: 'Panel de SIEGIX Provider con servicios y facturación',

    sellos: [
      { icon: 'layers', titulo: 'Todo en una', texto: 'sola plataforma' },
      { icon: 'cpu', titulo: 'Automatiza', texto: 'tus procesos' },
      { icon: 'chart', titulo: 'Aumenta la', texto: 'productividad' },
      { icon: 'shield', titulo: 'Trazabilidad', texto: 'completa' },
      { icon: 'users', titulo: 'Escalable para', texto: 'cualquier industria' },
    ],

    pestanas: [
      {
        key: 'descripcion',
        label: 'Descripción',
        titulo: 'Gestiona hoy una empresa más eficiente',
        texto:
          'SIEGIX Provider centraliza la gestión de tus clientes, servicios, proyectos, facturación y recursos, brindando control total de tus operaciones con una interfaz moderna, intuitiva y segura.',
        puntos: [
          'Gestión de clientes y contactos.',
          'Control de servicios, proyectos y órdenes de trabajo.',
          'Facturación completa con comprobantes fiscales.',
          'Calendario con recordatorios automáticos.',
          'Editor de textos avanzado (contratos, informes, cotizaciones).',
          'Asignación y control de flotas y técnicos en campo.',
          'Reportes y estadísticas de producción.',
          'Integraciones con aplicaciones de terceros (ERP, contabilidad, etc.).',
          'Asistente de Inteligencia Artificial para optimizar tareas.',
          'Trazabilidad completa de todos los procesos.',
          'Sistema de tickets y servicio al cliente.',
        ],
        imagenAlt: 'SIEGIX Provider en ordenador y móvil sobre un escritorio',
      },
      {
        key: 'funcionalidades',
        label: 'Funcionalidades',
        titulo: 'De la orden de trabajo a la factura',
        texto: 'El recorrido completo del servicio queda registrado, asignado y facturado en el mismo sitio.',
        puntos: [
          'Órdenes de trabajo con asignación de técnico y flota.',
          'Seguimiento del servicio en campo.',
          'Facturación directa desde la orden cerrada.',
          'Editor de contratos y cotizaciones con plantillas.',
        ],
        imagenAlt: 'Órdenes de trabajo en SIEGIX Provider',
      },
      {
        key: 'beneficios',
        label: 'Beneficios',
        titulo: 'Control real de lo que pasa en la calle',
        texto:
          'Saber qué técnico está dónde y en qué estado va cada servicio cambia por completo la operación diaria.',
        puntos: [
          'Reduce servicios sin facturar por falta de registro.',
          'Acorta el tiempo entre ejecución y cobro.',
          'Da visibilidad de la productividad por técnico y por ruta.',
        ],
        imagenAlt: 'Supervisor revisando servicios en curso',
      },
      {
        key: 'industrias',
        label: 'Industrias',
        titulo: 'Pensado para empresas de servicios de cualquier sector',
        texto: 'Los flujos se configuran según el tipo de servicio que presta tu empresa.',
        puntos: [
          'Mantenimiento e instalaciones técnicas.',
          'Seguridad, limpieza y servicios generales.',
          'Logística y transporte.',
          'Consultoría y servicios profesionales.',
        ],
        imagenAlt: 'Técnicos de distintas industrias en campo',
      },
      {
        key: 'casos',
        label: 'Casos de Éxito',
        titulo: 'Empresas que ya operan con SIEGIX Provider',
        texto: 'Compañías de servicios gestionan hoy toda su operación sobre esta plataforma.',
        puntos: [
          'Empresas de mantenimiento con equipos en campo.',
          'Compañías con flotas y rutas diarias.',
          'Proveedores de servicios con facturación recurrente.',
        ],
        imagenAlt: 'Equipo técnico de una empresa cliente',
      },
      {
        key: 'faq',
        label: 'Preguntas Frecuentes',
        titulo: 'Lo que más nos preguntan',
        texto: 'Dudas habituales antes de implantar la plataforma.',
        puntos: [
          '¿Funciona sin conexión en campo? Sí, sincroniza al recuperar señal.',
          '¿Se integra con mi contabilidad? Sí, mediante API o exportación.',
          '¿Emite comprobantes fiscales? Sí, y se enlaza con SIEGIX Core para la DGII.',
        ],
        imagenAlt: 'Asesor de SIEGIX explicando la plataforma',
      },
    ],

    porQueTitulo: '¿Por qué elegir SIEGIX Provider?',
    porQue: [
      { icon: 'building', titulo: 'Diseñado para empresas de servicios', texto: 'Adaptable a diferentes industrias.' },
      { icon: 'monitor', titulo: 'Interfaz moderna y fácil de usar', texto: 'Sin complicaciones, listo para trabajar.' },
      { icon: 'sparkles', titulo: 'Automatización e Inteligencia Artificial', texto: 'Menos tareas manuales, más resultados.' },
      { icon: 'chart', titulo: 'Información en tiempo real', texto: 'Toma mejores decisiones.' },
      { icon: 'shield', titulo: 'Seguridad y respaldo de tu información', texto: 'Tu negocio siempre protegido.' },
      { icon: 'headset', titulo: 'Soporte especializado', texto: 'Te acompañamos en cada etapa.' },
    ],

    relacionados: [REL.crm, REL.xpace, REL.core],

    cierreTitulo: '¿Listo para llevar tu empresa al siguiente nivel?',
    cierreTexto:
      'SIEGIX Provider te da las herramientas para crecer con control, eficiencia y confianza.',
    cierreIcono: 'chart',
  },

  {
    slug: 'siegix-core',
    categoria: 'Facturación electrónica',
    nombre: 'Siegix',
    nombreAccent: 'Core',
    color: '#2fa84f',
    titulo: 'El puente entre tu sistema y la Facturación Electrónica',
    intro:
      'SIEGIX Core permite integrar tu sistema de facturación actual con la Facturación Electrónica de la DGII, de forma segura, confiable y sin necesidad de reemplazar tu software. Conecta, valida, transmite y da seguimiento a tus comprobantes electrónicos desde una sola plataforma.',
    ctaPrincipal: '¡Quiero este producto!',
    ctaSecundario: 'Ver más información',
    imagenPrincipalAlt: 'Panel de SIEGIX Core con el estado de los comprobantes en la DGII',

    sellos: [
      { icon: 'cpu', titulo: 'Integración', texto: 'con tu sistema actual' },
      { icon: 'shield', titulo: 'Transmisión segura', texto: 'a la DGII' },
      { icon: 'file-text', titulo: 'Trazabilidad', texto: 'completa' },
      { icon: 'clock', titulo: 'Monitoreo en', texto: 'tiempo real' },
      { icon: 'headset', titulo: 'Soporte especializado', texto: '24/7' },
    ],

    pestanas: [
      {
        key: 'descripcion',
        label: 'Descripción',
        titulo: 'Conecta tu negocio con la DGII, sin complicaciones',
        texto:
          'SIEGIX Core actúa como un intermediario inteligente entre tu sistema de facturación y la plataforma de Facturación Electrónica de la DGII. Nos encargamos de todo el proceso técnico para que tu empresa cumpla con la normativa vigente, manteniendo tu sistema actual y optimizando tu operación.',
        puntos: [
          'Compatible con sistemas propios o de terceros.',
          'Generación y envío de e-CF (NCF electrónicos).',
          'Validación de comprobantes con la DGII.',
          'Consulta de estado y respuestas en tiempo real.',
          'Manejo automático de errores y reintentos.',
          'Trazabilidad y auditoría completa.',
          'Panel de control con reportes y estadísticas.',
          'Integración vía API, base de datos o archivos.',
          'Soporte técnico especializado.',
        ],
        imagenAlt: 'Esquema: tu sistema de facturación, SIEGIX Core y la DGII',
      },
      {
        key: 'funcionalidades',
        label: 'Funcionalidades',
        titulo: 'El proceso técnico, resuelto de principio a fin',
        texto: 'Tú emites la factura como siempre; el resto del camino lo hace SIEGIX Core.',
        puntos: [
          'Firma digital y armado del e-CF.',
          'Envío, acuse y consulta de estado ante la DGII.',
          'Reintento automático ante caídas del servicio.',
          'Panel con el estado de cada comprobante.',
        ],
        imagenAlt: 'Panel de control de comprobantes electrónicos',
      },
      {
        key: 'beneficios',
        label: 'Beneficios',
        titulo: 'Cumples con la norma sin cambiar de software',
        texto:
          'La mayor barrera para adoptar la facturación electrónica es tener que reemplazar el sistema. Aquí no hace falta.',
        puntos: [
          'Evita el costo y el riesgo de migrar de sistema.',
          'Reduce el trabajo manual de corrección y reenvío.',
          'Deja auditoría completa para cualquier revisión.',
        ],
        imagenAlt: 'Responsable fiscal revisando comprobantes',
      },
      {
        key: 'integraciones',
        label: 'Integraciones',
        titulo: 'Se conecta como mejor le venga a tu sistema',
        texto: 'No obliga a una única forma de integración: se adapta a la que tu equipo pueda sostener.',
        puntos: [
          'API REST para sistemas modernos.',
          'Lectura directa de base de datos.',
          'Intercambio por archivos para sistemas heredados.',
          'Integración nativa con SIEGIX Health y SIEGIX Provider.',
        ],
        imagenAlt: 'Diagrama de las formas de integración de SIEGIX Core',
      },
      {
        key: 'casos',
        label: 'Casos de Éxito',
        titulo: 'Empresas que ya emiten e-CF con SIEGIX Core',
        texto:
          'Instituciones de salud y empresas de servicios cumplen hoy con la DGII manteniendo su sistema de siempre.',
        puntos: [
          'Instituciones de salud con sistema de facturación propio.',
          'Empresas de servicios con alto volumen de comprobantes.',
          'Comercios que necesitaban cumplir sin cambiar de software.',
        ],
        imagenAlt: 'Equipo administrativo de una empresa cliente',
      },
      {
        key: 'faq',
        label: 'Preguntas Frecuentes',
        titulo: 'Lo que más nos preguntan',
        texto: 'Dudas habituales sobre la facturación electrónica.',
        puntos: [
          '¿Tengo que cambiar mi sistema? No, SIEGIX Core se conecta al que ya tienes.',
          '¿Qué pasa si la DGII rechaza un comprobante? El panel lo marca y permite corregir y reenviar.',
          '¿Cuánto tarda la integración? Depende del sistema; con API suele ser cuestión de días.',
        ],
        imagenAlt: 'Asesor explicando la facturación electrónica',
      },
    ],

    porQueTitulo: '¿Por qué elegir SIEGIX Core?',
    porQue: [
      { icon: 'check-circle', titulo: 'Mantén tu sistema actual', texto: 'No necesitas cambiar de software.' },
      { icon: 'shield', titulo: 'Cumplimiento garantizado', texto: 'Conforme a las normativas de la DGII.' },
      { icon: 'zap', titulo: 'Implementación ágil', texto: 'Integración rápida y sin interrupciones.' },
      { icon: 'monitor', titulo: 'Monitoreo y control', texto: 'Visualiza el estado de tus comprobantes.' },
      { icon: 'lock', titulo: 'Seguridad y confiabilidad', texto: 'Tus datos siempre protegidos.' },
      { icon: 'headset', titulo: 'Soporte experto', texto: 'Te acompañamos en todo el proceso.' },
      { icon: 'building', titulo: 'Escalable', texto: 'Funciona para empresas de cualquier tamaño y sector.' },
    ],

    relacionados: [REL.crm, REL.provider, REL.xpace],

    cierreTitulo: '¿Listo para integrar tu sistema con la Facturación Electrónica?',
    cierreTexto:
      'SIEGIX Core te ofrece la solución más confiable y profesional para cumplir con la DGII.',
    cierreIcono: 'file-text',
  },
];
