import type { IconName } from '../components/ui/Icon';

/*
  Paginas de Sectores (antes "Industrias"): Publico, Privado e Internacional.

  Cada una se arma con bloques, porque las tres comparten la cabecera, la banda
  oscura y el cierre, pero por dentro cuentan cosas distintas. La plantilla
  recorre `bloques` y pinta el que toca.

  Las fotos que el cliente todavia no ha entregado van sin `imagen`: la pagina
  pinta un marcador que describe la foto que falta.
*/

export interface TarjetaLista {
  titulo: string;
  puntos: string[];
  icon: IconName;
  color: string;
  imagen?: string;
  imagenAlt: string;
}

export type Bloque =
  | {
      tipo: 'hitos';
      eyebrow: string;
      titulo: string;
      texto: string;
      destacados: { titulo: string; texto: string; icon: IconName; color: string; imagen?: string; imagenAlt: string }[];
      resto: { titulo: string; texto: string; icon: IconName; color: string; imagen?: string; imagenAlt: string }[];
    }
  | {
      tipo: 'linea';
      eyebrow: string;
      titulo: string;
      texto: string;
      etapas: { periodo: string; titulo: string; texto: string; imagen?: string; imagenAlt: string }[];
    }
  | { tipo: 'listas'; eyebrow?: string; titulo: string; texto?: string; tarjetas: TarjetaLista[] }
  | {
      tipo: 'destacado';
      eyebrow: string;
      titulo: string;
      texto: string;
      puntos: string[];
      nota: string;
      imagen?: string;
      imagenAlt: string;
      panel: { titulo: string; texto: string; items: { icon: IconName; label: string }[] };
    }
  | {
      tipo: 'alianzas';
      eyebrow: string;
      titulo: string;
      texto: string;
      iconos: { icon: IconName; label: string }[];
    }
  | {
      tipo: 'cifras';
      eyebrow: string;
      titulo: string;
      datos: { icon: IconName; valor: string; label: string }[];
      cita: string;
    }
  | {
      tipo: 'mapa';
      eyebrow: string;
      titulo: string;
      texto: string;
      datos: { icon: IconName; valor: string; label: string }[];
      cta: string;
      imagen?: string;
      imagenAlt: string;
      sedes: { nombre: string; ciudad: string }[];
    }
  | {
      tipo: 'aviso';
      titulo: string;
      parrafos: string[];
    }
  | {
      tipo: 'cronologia';
      eyebrow: string;
      titulo: string;
      tituloAccent: string;
      texto: string;
      etapas: { periodo: string; logo: string; logoAlt: string; titulo: string; color: string }[];
    }
  | {
      tipo: 'proyectos';
      eyebrow: string;
      titulo: string;
      tituloAccent: string;
      texto: string;
      proyectos: {
        nombre: string;
        logo: string;
        logoAlt: string;
        /** Periodo y estado del sello, como en el diseno: "2011 | Historico". */
        periodo: string;
        estado: string;
        subtitulo: string;
        texto: string;
        aportes: string[];
        /** Sello al pie. Solo lo lleva la tarjeta del ISL/1. */
        sello?: string;
        /** Enlace al sitio del proyecto. Sin url no se pinta. */
        enlace?: string;
        url?: string;
        color: string;
        imagen?: string;
        imagenAlt: string;
      }[];
    }
  | {
      tipo: 'aportes';
      eyebrow: string;
      titulo: string;
      texto: string;
      logo: string;
      logoAlt: string;
      items: { icon: IconName; titulo: string; texto: string }[];
      nota: { titulo: string; texto: string; cta: string; url: string };
    }
  | {
      tipo: 'core';
      eyebrow: string;
      titulo: string;
      texto: string;
      logo: string;
      logoAlt: string;
      puntos: string[];
      cita: string[];
    }
  | {
      tipo: 'gracias';
      eyebrow: string;
      titulo: string;
      texto: string;
      tarjetas: { logo: string; logoAlt: string; nombre: string; cita: string[]; firma: string; firmaNota: string }[];
    }
  | { tipo: 'banda'; icon: IconName; titulo: string; texto: string };

export interface Sector {
  slug: string;
  miga: string;
  acento: string;
  heroEyebrow: string;
  heroTitulo: string;
  heroTituloAccent: string;
  /** Frase corta sobre el parrafo largo. No todas la llevan. */
  heroLead?: string;
  heroTexto: string;
  heroBullets: { icon: IconName; label: string }[];
  heroImagen?: string;
  heroImagenAlt: string;
  /** Rotulo flotante sobre la foto de cabecera. */
  heroChip: string;

  bloques: Bloque[];

  cierreEyebrow: string;
  cierreTitulo: string;
  cierreTexto: string;
  cierreCta: string;
  /** Lema a la derecha del cierre, en dos lineas. */
  cierreLema?: [string, string];
  cierreImagen?: string;
  cierreImagenAlt: string;
  /** El sector publico muestra el telefono y el correo junto al boton. */
  cierreContacto?: boolean;
}

export const SECTORES: Sector[] = [
  /* ==================== SECTOR PUBLICO ==================== */
  {
    slug: 'sector-publico',
    miga: 'Sector Público',
    acento: '#2563eb',
    heroEyebrow: 'Sector público',
    heroTitulo: 'Tecnología dominicana',
    heroTituloAccent: 'para una salud pública más conectada',
    heroTexto:
      'En LINKDICOM contribuimos al fortalecimiento del sistema de salud pública de la República Dominicana, desarrollando e implementando soluciones tecnológicas que mejoran la eficiencia, la calidad de atención y el acceso oportuno a la salud para todos los ciudadanos.',
    heroBullets: [
      { icon: 'users', label: 'Más acceso para los ciudadanos' },
      { icon: 'settings', label: 'Procesos más eficientes' },
      { icon: 'chart', label: 'Instituciones más conectadas' },
    ],
    heroImagen: '/img/sectores/hero-publico.webp',
    heroImagenAlt: 'Instalaciones de salud pública de la República Dominicana',
    heroChip: 'Tecnología al servicio de la gente',

    bloques: [
      {
        tipo: 'hitos',
        eyebrow: 'Nuestros aportes',
        titulo: 'Hitos que han marcado la salud pública dominicana',
        texto:
          'Somos pioneros en el desarrollo e implementación de soluciones tecnológicas que hoy son referencia en el sistema de salud del país.',
        destacados: [
          {
            titulo: 'Primer Sistema PACS Dominicano (ISL/1)',
            texto:
              'Desarrollamos el primer sistema PACS del país: ISL/1, un hito en la gestión de imágenes médicas en República Dominicana. Actualmente evolucionado a SGMM.',
            icon: 'monitor',
            color: '#2563eb',
            imagen: '/img/sectores/pacs-isl1.webp',
            imagenAlt: 'Portátil mostrando el panel de ISL/1, evolucionado a SGMM',
          },
          {
            titulo: 'RD-Hospital',
            texto:
              'Sometimos el primer proyecto de interconexión hospitalaria de la República Dominicana, con un piloto real en 5 hospitales públicos en el año 2020, conectando instituciones y facilitando el acceso a estudios médicos en todo el territorio nacional.',
            icon: 'network',
            color: '#0f8a5f',
            imagen: '/img/sectores/rd-hospital.webp',
            imagenAlt: 'Mapa de la República Dominicana con los hospitales de RD-Hospital conectados',
          },
          {
            titulo: 'Primer portal de soporte técnico del sector biomédico',
            texto:
              'Primera empresa del sector biomédico con portal para el soporte técnico y seguimiento de solicitudes, servicios e instalaciones, con códigos y tarjetas con CHIP asignados a clientes.',
            icon: 'headset',
            color: '#6d5bd0',
            imagen: '/img/sectores/portal-soporte.webp',
            imagenAlt: 'Portal de soporte técnico de LINKDICOM abierto en un portátil',
          },
        ],
        resto: [
          {
            titulo: 'Entrega de imágenes y reportes en línea',
            texto:
              'Primera empresa dominicana del sector de imágenes en desarrollar y fomentar la entrega de imágenes y reportes adjuntos en línea tanto a pacientes como a médicos referidores.',
            icon: 'file-text',
            color: '#f59e0b',
            imagen: '/img/sectores/entrega-en-linea.webp',
            imagenAlt: 'Paciente consultando su radiografía desde el móvil',
          },
          {
            titulo: 'Primeros en Robots CD',
            texto:
              'Pioneros en la instalación de ROBOTS CD con planes de comodato, facilitando la entrega de estudios en formato físico de manera automatizada y eficiente.',
            icon: 'printer',
            color: '#2563eb',
            imagen: '/img/sectores/robots-cd.webp',
            imagenAlt: 'Impresora robot grabando un CD con la etiqueta de la institución',
          },
          {
            titulo: 'Administración de Consultorios',
            texto:
              'Primeros en liberar una solución de administración de consultorios para el país y el Caribe, optimizando la gestión de citas, pacientes y procesos clínicos.',
            icon: 'stethoscope',
            color: '#0f8a5f',
            imagen: '/img/sectores/administracion-consultorios.webp',
            imagenAlt: 'Pantalla de ConsultorioX con la agenda del día',
          },
          {
            titulo: 'Soluciones DICOM en Dominicana',
            texto:
              'Primeros en el desarrollo de Soluciones DICOM en la República Dominicana y primera empresa del Caribe en ofrecer un sistema PACS totalmente personalizable para la reventa y sin intervención.',
            icon: 'scan',
            color: '#6d5bd0',
            imagen: '/img/sectores/soluciones-dicom.webp',
            imagenAlt: 'Desarrollo de soluciones DICOM sobre estudios de resonancia',
          },
        ],
      },
      {
        tipo: 'banda',
        icon: 'trophy',
        titulo: 'Somos los primeros en innovar',
        texto:
          'Nuestro compromiso con la innovación ha marcado la diferencia en el sector público, impulsando soluciones que transforman la forma en que se gestionan los servicios de salud en el país.',
      },
      {
        tipo: 'mapa',
        eyebrow: 'RD-Hospital',
        titulo: 'Un modelo de interconexión para todo el país',
        texto:
          'Con RD-Hospital demostramos que la interconexión entre hospitales es posible, creando un modelo escalable para mejorar el acceso a estudios médicos en el territorio nacional.',
        datos: [
          { icon: 'hospital', valor: '5', label: 'Hospitales en el piloto' },
          { icon: 'calendar', valor: '2020', label: 'Año de implementación' },
          { icon: 'network', valor: 'Mismo', label: 'estándar tecnológico en todas las sedes' },
        ],
        cta: 'Conocer más sobre RD-Hospital',
        imagen: '/img/sectores/rd-hospital.webp',
        imagenAlt: 'Mapa de la República Dominicana con los cinco hospitales del piloto conectados',
        sedes: [
          { nombre: 'Hospital Regional José María Cabral y Báez', ciudad: 'Santiago' },
          { nombre: 'Hospital Dr. Antonio Musa', ciudad: 'San Pedro de Macorís' },
          { nombre: 'Hospital Dr. Luis Morillo King', ciudad: 'La Vega' },
          { nombre: 'Hospital Regional Taiwán 19 de Marzo', ciudad: 'Azua' },
          { nombre: 'Hospital Traumatológico Prof. Juan Bosch', ciudad: 'La Vega' },
        ],
      },
    ],

    cierreEyebrow: 'Sector público',
    cierreTitulo: 'Seguimos construyendo el futuro de la salud pública',
    cierreTexto:
      'En LINKDICOM creemos en una República Dominicana más saludable, con instituciones públicas más eficientes y ciudadanos con mayor acceso a servicios de salud de calidad.',
    cierreCta: 'Hablemos de tu proyecto',
    cierreImagen: '/img/sectores/hero-publico.webp',
    cierreImagenAlt: 'Instalaciones de salud pública de la República Dominicana',
    cierreContacto: true,
  },

  /* ==================== SECTOR PRIVADO ==================== */
  {
    slug: 'sector-privado',
    miga: 'Sector Privado',
    acento: '#0f8a5f',
    heroEyebrow: 'Sector privado',
    heroTitulo: 'Tu institución,',
    heroTituloAccent: 'nuestro compromiso',
    heroLead:
      'Tecnología y soporte para el crecimiento de clínicas, centros diagnósticos y empresas del sector privado.',
    heroTexto:
      'En LINKDICOM llevamos años acompañando a instituciones privadas de salud, ofreciendo soluciones confiables, accesibles y adaptadas a sus necesidades. Desde la comercialización de equipos de imágenes hasta el desarrollo de sistemas integrados, somos un socio local que entiende la realidad del sector y trabaja para impulsar su crecimiento.',
    heroBullets: [
      { icon: 'handshake', label: 'Soluciones que se adaptan a tu presupuesto' },
      { icon: 'settings', label: 'Soporte local y especializado' },
      { icon: 'chart', label: 'Tecnología para un crecimiento sostenible' },
    ],
    heroImagen: '/img/sectores/hero-privado.webp',
    heroImagenAlt: 'Equipo de una clínica privada atendiendo en recepción',
    heroChip: 'Tecnología para una mejor atención',

    bloques: [
      {
        tipo: 'linea',
        eyebrow: 'Nuestra historia en el sector privado',
        titulo: 'Creciendo juntos desde el inicio',
        texto:
          'Desde nuestros inicios, LINKDICOM ha trabajado de la mano con clínicas, centros diagnósticos y profesionales de la salud privada, ofreciendo equipos, soporte y desarrollos tecnológicos que se adaptan a sus necesidades y presupuestos.',
        etapas: [
          {
            periodo: '2008 – 2015',
            titulo: 'Equipos e infraestructura',
            texto:
              'Comercialización e instalación de equipos de Rayos X, CR (Computed Radiography), impresoras y soluciones de digitalización para centros de salud privados, con asesoría técnica y acompañamiento completo.',
            imagen: '/img/sectores/venta-equipos.webp',
            imagenAlt: 'Equipo de rayos X instalado en un centro privado',
          },
          {
            periodo: '2016 – 2020',
            titulo: 'Soluciones integradas',
            texto:
              'Desarrollo de sistemas PACS/RIS, soluciones de turnos, facturación y herramientas de gestión para clínicas y centros diagnósticos, optimizando procesos y mejorando la experiencia del paciente.',
            imagen: '/img/productos/radiologox/panel.webp',
            imagenAlt: 'Radiólogo revisando estudios en varias pantallas',
          },
          {
            periodo: '2021 – Actualidad',
            titulo: 'Innovación continua',
            texto:
              'Seguimos ampliando nuestro portafolio con soluciones más completas, integraciones y soporte continuo, siempre con la mejor relación valor-costo y un enfoque en el crecimiento de nuestros clientes.',
            imagen: '/img/sectores/innovacion-continua.webp',
            imagenAlt: 'Especialista trabajando con las soluciones más recientes',
          },
        ],
      },
      {
        tipo: 'listas',
        eyebrow: 'Soluciones para el sector salud privado',
        titulo: 'Tecnología para cada necesidad',
        tarjetas: [
          {
            titulo: 'Clínicas y Centros Diagnósticos',
            icon: 'hospital',
            color: '#2563eb',
            imagen: '/img/ecosistemas/centros-de-diagnostico-tarjeta.webp',
            imagenAlt: 'Fachada de un centro diagnóstico',
            puntos: [
              'PACS/RIS (RadiologoX)',
              'Turnos (ECOTurnox)',
              'Facturación (SIEGIX Health)',
              'Entrega de resultados en línea',
              'Soporte técnico especializado',
              'Integraciones con equipos y LIS',
            ],
          },
          {
            titulo: 'Laboratorios Clínicos',
            icon: 'microscope',
            color: '#0f8a5f',
            imagen: '/img/ecosistemas/laboratorios-tarjeta.webp',
            imagenAlt: 'Técnica de laboratorio procesando muestras',
            puntos: [
              'Gestión de muestras',
              'Resultados en línea',
              'Integración con HIS/LIS',
              'Reportes automáticos',
              'Control de calidad',
              'Soporte y mantenimiento',
            ],
          },
          {
            titulo: 'Consultorios Médicos',
            icon: 'stethoscope',
            color: '#f97316',
            imagen: '/img/ecosistemas/consultorios-tarjeta.webp',
            imagenAlt: 'Médico atendiendo a un paciente en consulta',
            puntos: [
              'Gestión de pacientes',
              'Historia clínica',
              'Facturación',
              'Agenda y turnos',
              'Integración con imágenes',
              'Soporte continuo',
            ],
          },
          {
            titulo: 'Centros de Imágenes',
            icon: 'scan',
            color: '#6d5bd0',
            imagen: '/img/productos/linkrix/panel.webp',
            imagenAlt: 'Sala con equipo de resonancia magnética',
            puntos: [
              'PACS de alto rendimiento',
              'Compatibilidad DICOM',
              'Teleradiología',
              'Entrega de informes en línea',
              'Soluciones personalizables',
              'Asesoría en infraestructura',
            ],
          },
        ],
      },
      {
        tipo: 'listas',
        titulo: 'Nuestra tecnología también impulsa otros sectores',
        texto:
          'La experiencia y confiabilidad de LINKDICOM se extiende a diferentes industrias, ofreciendo soluciones de gestión, facturación y procesos adaptados a cada necesidad.',
        tarjetas: [
          {
            titulo: 'Farmacias',
            icon: 'pill',
            color: '#0f8a5f',
            imagen: '/img/sectores/farmacias.webp',
            imagenAlt: 'Farmacéutica atendiendo en el mostrador',
            puntos: ['Gestión de inventario', 'Facturación', 'Control de recetas', 'Reportes y estadísticas'],
          },
          {
            titulo: 'Funerarias',
            icon: 'heart',
            color: '#6d5bd0',
            imagen: '/img/sectores/funerarias.webp',
            imagenAlt: 'Sala de velatorio preparada',
            puntos: ['Gestión de servicios', 'Control de casos', 'Facturación', 'Atención a familiares'],
          },
          {
            titulo: 'Buffetes de Abogados',
            icon: 'scale',
            color: '#f59e0b',
            imagen: '/img/sectores/abogados.webp',
            imagenAlt: 'Despacho de abogados durante una consulta',
            puntos: ['Gestión de casos', 'Control de clientes', 'Facturación', 'Documentos y expedientes'],
          },
          {
            titulo: 'Bienes Raíces',
            icon: 'home',
            color: '#2563eb',
            imagen: '/img/sectores/bienes-raices.webp',
            imagenAlt: 'Agente inmobiliario mostrando una propiedad',
            puntos: ['Gestión de propiedades', 'Control de clientes', 'Seguimiento de ventas', 'Reportes y comisiones'],
          },
          {
            titulo: 'Otros Sectores',
            icon: 'briefcase',
            color: '#64748b',
            imagen: '/img/sectores/otros-sectores.webp',
            imagenAlt: 'Reunión de trabajo en una sala de juntas',
            puntos: ['Soluciones a la medida', 'Adaptación a tu industria', 'Implementación rápida', 'Soporte continuo'],
          },
        ],
      },
      {
        tipo: 'banda',
        icon: 'users',
        titulo: 'Un socio local que entiende tu realidad',
        texto:
          'En LINKDICOM creemos en el desarrollo del sector privado dominicano. Por eso ofrecemos soluciones confiables, flexibles y accesibles, con el respaldo de un equipo que te acompaña en cada paso.',
      },
    ],

    cierreEyebrow: 'Hablemos de tu proyecto',
    cierreTitulo: 'Hablemos de tu proyecto',
    cierreTexto:
      'Cuéntanos tus necesidades y descubre cómo nuestras soluciones pueden ayudarte a optimizar tus procesos y hacer crecer tu institución.',
    cierreCta: 'Hablemos de tu proyecto',
    cierreLema: ['Tecnología hoy,', 'mejores resultados mañana.'],
    cierreImagen: '/img/sectores/cierre-privado.webp',
    cierreImagenAlt: 'Reunión de trabajo sobre un proyecto tecnológico',
  },

  /* ==================== INTERNACIONAL ==================== */
  {
    slug: 'internacional',
    miga: 'Internacional',
    acento: '#2563eb',
    heroEyebrow: 'Aportes internacionales',
    heroTitulo: 'De aprender con el código abierto a construir',
    heroTituloAccent: 'nuestra propia tecnología',
    heroTexto:
      'En LINKDICOM creemos en el poder de la colaboración. A lo largo de nuestra historia hemos integrado, aprendido y aportado a proyectos de código abierto del ecosistema DICOM, contribuyendo con mejoras, extensiones y traducciones que hoy forman parte de la comunidad internacional.',
    heroBullets: [
      { icon: 'globe', label: 'Aprendizaje sin fronteras' },
      { icon: 'users', label: 'Colaboración con la comunidad' },
      { icon: 'code', label: 'Aportes al código abierto' },
      { icon: 'chart', label: 'Impulso para mejores soluciones' },
    ],
    heroImagen: '/img/sectores/hero-internacional.webp',
    heroImagenAlt: 'Red de conexiones sobre el globo terráqueo',
    heroChip: 'Desde República Dominicana para un mundo más saludable.',

    bloques: [
      {
        tipo: 'aviso',
        titulo: 'Una etapa de nuestra historia tecnológica',
        parrafos: [
          'Las tecnologías presentadas en esta sección corresponden a colaboraciones y desarrollos realizados durante diferentes etapas de nuestra historia.',
          'Actualmente, las soluciones de LINKDICOM operan sobre un Core y un entorno tecnológico propio, desarrollado y mantenido enteramente por nuestro equipo.',
          'Aunque hoy ya no utilizamos estas aplicaciones, mantenemos comunicación con sus comunidades y desarrolladores, en pos de seguir colaborando mutuamente en beneficio de la sociedad.',
        ],
      },
      {
        tipo: 'cronologia',
        eyebrow: 'Nuestra línea de tiempo',
        titulo: 'Evolución, colaboración y aporte al',
        tituloAccent: 'ecosistema DICOM internacional',
        texto:
          'Más de una década de aprendizaje, desarrollo y contribuciones que nos han llevado a construir nuestro propio ecosistema de soluciones.',
        etapas: [
          {
            periodo: '2009 – 2010',
            logo: '/img/internacional/isl1.png',
            logoAlt: 'Logotipo del sistema ISL/1',
            titulo: 'Primer sistema PACS dominicano',
            color: '#f97316',
          },
          {
            periodo: '2011',
            logo: '/img/internacional/dcm4che.png',
            logoAlt: 'Logotipo de dcm4che',
            titulo: 'Integración y traducción',
            color: '#2563eb',
          },
          {
            periodo: '2013',
            logo: '/img/internacional/oviyam.png',
            logoAlt: 'Logotipo de Oviyam',
            titulo: 'Primer acercamiento (visor oficial del ISL/1)',
            color: '#7c3aed',
          },
          {
            periodo: '2014',
            logo: '/img/internacional/orthanc.png',
            logoAlt: 'Logotipo de Orthanc',
            titulo: 'Integración y adaptaciones',
            color: '#0f8a5f',
          },
          {
            periodo: '2019 – 2021',
            logo: '/img/internacional/oviyam.png',
            logoAlt: 'Logotipo de Oviyam',
            titulo: 'Mayores contribuciones',
            color: '#ef4444',
          },
          {
            periodo: '2022 – Hoy',
            logo: '/img/internacional/radiologox.png',
            logoAlt: 'Logotipo de RadiologoX PACS/RIS',
            titulo: 'Nuestro propio ecosistema',
            color: '#0b1120',
          },
        ],
      },
      {
        tipo: 'proyectos',
        eyebrow: 'Tecnologías que formaron parte de nuestro camino',
        titulo: 'Grandes proyectos,',
        tituloAccent: 'una historia de colaboración',
        texto:
          'Estas plataformas de código abierto fueron fundamentales en nuestra trayectoria, permitiéndonos aprender, innovar y aportar al ecosistema de imágenes médicas. A continuación, presentamos los aportes de LINKDICOM a cada proyecto, en orden cronológico.',
        proyectos: [
          {
            nombre: 'ISL/1',
            logo: '/img/internacional/isl1.png',
            logoAlt: 'Logotipo del sistema ISL/1',
            periodo: '2009 – 2010',
            estado: '2009 – 2013',
            subtitulo: 'El origen del PACS dominicano',
            texto:
              'Desarrollo del ISL/1, primer sistema desarrollado en República Dominicana para la transferencia y gestión de imágenes médicas bajo DICOM. Permaneció operativo hasta 2013, utilizando Oviyam como visor oficial en su etapa final.',
            aportes: ['Sistema PACS propio', 'Transferencia de imágenes', 'Gestión DICOM', 'Vigente hasta 2013'],
            sello: 'Primer sistema PACS de desarrollo dominicano.',
            color: '#1d4ed8',
            imagen: '/img/internacional/isl1-codigo.webp',
            imagenAlt: 'Código fuente del ISL/1',
          },
          {
            nombre: 'dcm4che',
            logo: '/img/internacional/dcm4che.png',
            logoAlt: 'Logotipo de dcm4che',
            periodo: '2011',
            estado: 'Histórico',
            subtitulo: 'Integración y aprendizaje del ecosistema DICOM',
            texto:
              'Incorporamos tecnologías del ecosistema DCM4CHEE a nuestros primeros desarrollos y trabajamos con esta plataforma durante nuestro proceso de evolución tecnológica.',
            aportes: [
              'Integración de tecnologías',
              'Traducción al español (v2.16.0 y v2.17.0)',
              'Puesta a disposición de la comunidad',
              'Experiencia en interoperabilidad',
            ],
            enlace: 'Más sobre nuestros aportes',
            url: 'https://web.dcm4che.org',
            color: '#dc2626',
            imagen: '/img/internacional/dcm4che-archivo.webp',
            imagenAlt: 'Consola de archivo DICOM de DCM4CHEE',
          },
          {
            nombre: 'Oviyam',
            logo: '/img/internacional/oviyam.png',
            logoAlt: 'Logotipo de Oviyam',
            periodo: '2013',
            estado: 'Histórico',
            subtitulo: 'Visor médico de código abierto',
            texto:
              'En 2013 incorporamos Oviyam como visor dentro del entorno del ISL/1, donde permaneció como visor oficial.',
            aportes: [
              'Integración con el entorno ISL/1',
              'Adaptaciones funcionales',
              'Mejoras en usabilidad',
              'Soporte y retroalimentación para la comunidad',
            ],
            enlace: 'Más sobre nuestros aportes',
            url: 'http://oviyam.raster.in',
            color: '#7c3aed',
            imagen: '/img/internacional/oviyam-visor.webp',
            imagenAlt: 'Visor Oviyam mostrando un estudio de tomografía',
          },
          {
            nombre: 'Orthanc',
            logo: '/img/internacional/orthanc.png',
            logoAlt: 'Logotipo de Orthanc',
            periodo: '2014',
            estado: 'Histórico',
            subtitulo: 'Servidor DICOM de código abierto',
            texto:
              'En 2014 integramos Orthanc con Oviyam y realizamos adaptaciones puntuales orientadas a nuestras necesidades de operación.',
            aportes: [
              'Integración con Oviyam',
              'Herramienta de Transfer Syntax',
              'Adaptaciones al núcleo',
              'Más flexibilidad en la gestión DICOM',
              'Aporte a la comunidad',
            ],
            enlace: 'Más sobre nuestros aportes',
            url: 'https://www.orthanc-server.com',
            color: '#2563eb',
            imagen: '/img/internacional/orthanc-servidor.webp',
            imagenAlt: 'Panel de Orthanc con las etiquetas DICOM de un estudio',
          },
        ],
      },
      {
        tipo: 'aportes',
        eyebrow: '2019 – 2021: Oviyam',
        titulo: '2019 – 2021: Mayores aportes a Oviyam',
        texto:
          'Durante 2019 y 2021, LINKDICOM retomó el desarrollo sobre Oviyam, incorporando funcionalidades adicionales para adaptarlo a escenarios reales de operación PACS-RIS. Estos desarrollos fueron puestos a disposición de la comunidad bajo un enfoque de colaboración y sin fines de lucro.',
        logo: '/img/internacional/oviyam.png',
        logoAlt: 'Logotipo de Oviyam',
        items: [
          { icon: 'globe', titulo: 'Traducción', texto: 'Interfaz en español' },
          { icon: 'file-text', titulo: 'Reportes', texto: 'Informes radiológicos' },
          { icon: 'users', titulo: 'Usuarios', texto: 'Gestión y administración' },
          { icon: 'search', titulo: 'Pacientes', texto: 'Búsqueda y navegación' },
          { icon: 'shield', titulo: 'Firma digital', texto: 'De informes' },
          { icon: 'chart', titulo: 'Dashboard', texto: 'Visualización y gestión' },
        ],
        nota: {
          titulo: 'Compartir también es parte de innovar',
          texto:
            'Estos desarrollos fueron liberados por LINKDICOM para la comunidad como una forma de devolver conocimiento y herramientas al ecosistema de tecnología médica abierta.',
          cta: 'Ver aportes a Oviyam',
          url: 'http://oviyam.raster.in',
        },
      },
      {
        tipo: 'core',
        eyebrow: '2022 – Hoy: RadiologoX',
        titulo: '2022 – Hoy: RadiologoX PACS/RIS',
        texto:
          'La experiencia adquirida durante más de una década trabajando con tecnologías DICOM, proyectos open source e integraciones internacionales fue parte del camino que llevó a LINKDICOM a desarrollar su propio Core y entorno de soluciones.',
        logo: '/img/internacional/radiologox.png',
        logoAlt: 'Logotipo de RadiologoX PACS/RIS',
        puntos: [
          'Core propio, desarrollado por LINKDICOM',
          'Entorno de operación y gestión propio',
          'Adaptado a las necesidades del sector salud',
          'En constante evolución',
        ],
        cita: [
          'Hoy no utilizamos estas plataformas como base de RadiologoX. Son parte de nuestra historia y de las tecnologías que ayudaron a impulsar nuestro aprendizaje.',
          'Mantenemos comunicación con sus comunidades, en pos de seguir colaborando mutuamente en beneficio de la sociedad.',
        ],
      },
      {
        tipo: 'gracias',
        eyebrow: 'Palabras de la comunidad',
        titulo: 'Gracias por ser parte del camino',
        texto:
          'Valoramos profundamente el apoyo, la apertura y el espíritu de colaboración de las comunidades detrás de estas tecnologías. Sus palabras nos motivan a seguir aportando al ecosistema de código abierto y al avance de la salud en todo el mundo.',
        tarjetas: [
          {
            logo: '/img/internacional/raster.png',
            logoAlt: 'Logotipo de Raster Images',
            nombre: 'Raster Images (Oviyam)',
            cita: [
              'Nos complace saber que LINKDICOM celebra su décimo aniversario en 2026. Enhorabuena a todo el equipo de LINKDICOM por este logro tan significativo.',
              'Estamos encantados de proporcionar nuestro permiso para que LINKDICOM mencione a Oviyam y Raster Images como sus desarrolladores como parte de su historial corporativo.',
            ],
            firma: 'Gowthaman R',
            firmaNota: 'Raster Images Pvt. Ltd.',
          },
          {
            logo: '/img/internacional/orthanc.png',
            logoAlt: 'Logotipo de Orthanc',
            nombre: 'Orthanc',
            cita: [
              'Hola equipo de LINKDICOM,',
              'Les deseamos un feliz aniversario y mucho éxito en su negocio.',
              'Saludos cordiales,',
            ],
            firma: 'Alain Mazy',
            firmaNota: 'Orthanc',
          },
        ],
      },
    ],

    cierreEyebrow: 'Un futuro sin límites',
    cierreTitulo: 'Seguimos conectando salud en todo el mundo',
    cierreTexto:
      'Desde República Dominicana, continuamos abriendo oportunidades, construyendo alianzas y llevando tecnología a más personas, porque creemos en un sistema de salud más conectado, eficiente y humano.',
    cierreCta: 'Conversemos sobre tu proyecto',
    cierreLema: ['República Dominicana,', 'talento que conecta al mundo.'],
    cierreImagen: '/img/sectores/cierre-internacional.webp',
    cierreImagenAlt: 'Ala de un avión sobre una ciudad costera al amanecer',
  },
];
