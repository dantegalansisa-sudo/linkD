import type { CodigoBandera } from '../components/ui/Bandera';
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
      tipo: 'paises';
      eyebrow: string;
      titulo: string;
      texto: string;
      paises: { bandera: CodigoBandera; nombre: string; texto: string }[];
    }
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
      tipo: 'proyectos';
      eyebrow: string;
      titulo: string;
      tituloAccent: string;
      texto: string;
      proyectos: {
        nombre: string;
        /** Logotipo del proyecto. Si falta, se escribe el nombre. */
        logo?: string;
        credito: string;
        creditoLogo?: string;
        subtitulo: string;
        texto: string;
        aportes: string[];
        enlace: string;
        color: string;
        imagen?: string;
        imagenAlt: string;
      }[];
    }
  | {
      tipo: 'cronologia';
      eyebrow: string;
      titulo: string;
      tituloAccent: string;
      texto: string;
      etapas: { periodo: string; marca: string; titulo: string; texto: string; color: string }[];
    }
  | {
      tipo: 'valores';
      eyebrow: string;
      titulo: string;
      texto: string;
      tarjetas: { icon: IconName; titulo: string; texto: string }[];
    }
  | {
      tipo: 'gracias';
      eyebrow: string;
      titulo: string;
      texto: string;
      tarjetas: { logo: string; logoAlt: string; nombre: string; sello: string; texto: string }[];
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
    acento: '#6d5bd0',
    heroEyebrow: 'Aportes internacionales',
    heroTitulo: 'Tecnología dominicana',
    heroTituloAccent: 'con impacto global',
    heroTexto:
      'En LINKDICOM llevamos el talento y la innovación de República Dominicana más allá de nuestras fronteras, colaborando con instituciones, empresas y comunidades en diferentes países. Representamos una marca país que demuestra que desde el Caribe también se desarrolla tecnología de clase mundial para el sector salud.',
    heroBullets: [
      { icon: 'globe', label: 'Presencia en diversos países' },
      { icon: 'users', label: 'Alianzas estratégicas' },
      { icon: 'code', label: 'Contribución al código abierto' },
      { icon: 'chart', label: 'Transferencia de conocimiento' },
    ],
    heroImagen: '/img/sectores/hero-internacional.webp',
    heroImagenAlt: 'Conexiones de LINKDICOM con instituciones de otros países',
    heroChip: 'Desde República Dominicana para un mundo más saludable',

    bloques: [
      {
        tipo: 'paises',
        eyebrow: 'Presencia internacional',
        titulo: 'Llevando soluciones a más países',
        texto:
          'Nuestros sistemas y colaboraciones llegan a instituciones y profesionales de la salud en diferentes regiones, adaptándose a las necesidades de cada mercado.',
        paises: [
          { bandera: 'cr', nombre: 'Costa Rica', texto: 'Implementaciones y soporte en centros diagnósticos.' },
          { bandera: 'cl', nombre: 'Chile', texto: 'Colaboraciones en proyectos de teleradiología y gestión de imágenes.' },
          { bandera: 'ec', nombre: 'Ecuador', texto: 'Soluciones PACS/RIS en instituciones privadas.' },
          { bandera: 'in', nombre: 'India', texto: 'Colaboraciones técnicas y desarrollo conjunto de herramientas.' },
          { bandera: 'mundo', nombre: 'Otros países', texto: 'Representaciones parciales y proyectos en Latinoamérica, Centroamérica y otras regiones.' },
        ],
      },
      {
        tipo: 'proyectos',
        eyebrow: 'Tecnologías que nos inspiraron',
        titulo: 'Grandes proyectos,',
        tituloAccent: 'un mismo propósito',
        texto:
          'Estas plataformas de código abierto han sido fundamentales en nuestra trayectoria, permitiéndonos aprender, innovar y aportar al ecosistema de imágenes médicas.',
        proyectos: [
          {
            nombre: 'Oviyam',
            credito: 'Raster Images (India)',
            creditoLogo: '/img/internacional/raster.png',
            subtitulo: 'Visor médico de código abierto',
            texto:
              'En 2013 incorporamos Oviyam como visor dentro de nuestro entorno tecnológico. Posteriormente, en 2020–2021 realizamos la traducción al español y desarrollamos módulos de reportes, gestión de usuarios, mejoras en pacientes, firma digital y otras extensiones, que fueron liberadas a la comunidad.',
            aportes: [
              'Traducción al español',
              'Módulo de reportes',
              'Gestión de usuarios',
              'Mejoras en pacientes',
              'Firma digital',
              'Extensiones liberadas a la comunidad',
            ],
            enlace: 'Ver nuestros aportes a Oviyam',
            color: '#6d5bd0',
            imagen: '/img/internacional/oviyam-visor.webp',
            imagenAlt: 'Visor Oviyam mostrando un estudio de tomografía',
          },
          {
            nombre: 'Orthanc',
            logo: '/img/internacional/orthanc.png',
            credito: 'Proyecto de código abierto (Francia)',
            subtitulo: 'Servidor DICOM de código abierto',
            texto:
              'En 2014 integramos Orthanc con Oviyam y realizamos adaptaciones puntuales en su núcleo, además de desarrollar una herramienta desde Oviyam para la gestión de Transfer Syntax, permitiendo seleccionar diferentes esquemas de compresión y representación DICOM.',
            aportes: [
              'Integración con Oviyam',
              'Herramienta de Transfer Syntax',
              'Adaptaciones al núcleo',
              'Más flexibilidad en la gestión DICOM',
              'Aporte a la comunidad',
            ],
            enlace: 'Ver nuestros aportes a Orthanc',
            color: '#2563eb',
            imagen: '/img/internacional/orthanc-servidor.webp',
            imagenAlt: 'Panel de administración de Orthanc con las etiquetas DICOM de un estudio',
          },
          {
            nombre: 'dcm4che',
            logo: '/img/internacional/dcm4che.png',
            credito: 'Comunidad DCM4CHEE',
            subtitulo: 'Plataforma DICOM empresarial',
            texto:
              'En 2011 integramos tecnologías del ecosistema DCM4CHEE y realizamos la traducción al español de DCM4CHEE 2.17.x, poniéndola a disposición de la comunidad. Estas contribuciones facilitaron su adopción en instituciones de la región.',
            aportes: [
              'Integración de tecnologías',
              'Traducción al español (v2.17.x)',
              'Facilitó su adopción en la región',
              'Uso en implementaciones reales',
              'Aporte a la comunidad',
            ],
            enlace: 'Ver nuestros aportes a DCM4CHEE',
            color: '#dc2626',
            imagenAlt: 'Logotipo de dcm4che.org',
          },
        ],
      },
      {
        tipo: 'cronologia',
        eyebrow: 'Nuestra línea de tiempo',
        titulo: 'Evolución, colaboración y aporte al',
        tituloAccent: 'ecosistema DICOM',
        texto:
          'Más de una década de aprendizaje, desarrollo y contribuciones que nos han llevado a construir nuestro propio ecosistema de soluciones.',
        etapas: [
          {
            periodo: '2009 – 2010',
            marca: 'ISL/1',
            titulo: 'Primer sistema PACS dominicano',
            texto:
              'Desarrollo del ISL/1, primer sistema en República Dominicana para la transferencia y gestión de imágenes médicas bajo DICOM.',
            color: '#1d4ed8',
          },
          {
            periodo: '2011',
            marca: 'DCM4CHEE',
            titulo: 'Integración y traducción',
            texto:
              'Integración de tecnologías del ecosistema DCM4CHEE en nuestros desarrollos y traducción al español de la versión 2.17.x, puesta a disposición de la comunidad.',
            color: '#0ea5e9',
          },
          {
            periodo: '2013',
            marca: 'Oviyam',
            titulo: 'Primer acercamiento',
            texto:
              'Incorporación de Oviyam como visor médico dentro de nuestro entorno tecnológico, ampliando capacidades y posibilidades de extensión.',
            color: '#7c3aed',
          },
          {
            periodo: '2014',
            marca: 'Orthanc + Oviyam',
            titulo: 'Integración y mejoras',
            texto:
              'Integración de Orthanc con Oviyam y desarrollo de una herramienta para la gestión de Transfer Syntax, permitiendo elegir esquemas de compresión y representación DICOM.',
            color: '#0f8a5f',
          },
          {
            periodo: '2020 – 2021',
            marca: 'Oviyam',
            titulo: 'Contribuciones de LINKDICOM',
            texto:
              'Traducción al español, módulo de reportes, gestión de usuarios, mejoras en pacientes, firma digital y más. Estos desarrollos fueron liberados para la comunidad open source.',
            color: '#f97316',
          },
          {
            periodo: '2022 – Hoy',
            marca: 'LINKDICOM',
            titulo: 'Nuestro propio ecosistema',
            texto:
              'La experiencia adquirida fue parte del camino que nos llevó a desarrollar plataformas y soluciones propias, manteniendo el compromiso de aportar al sector salud desde República Dominicana.',
            color: '#0b1120',
          },
        ],
      },
      {
        tipo: 'valores',
        eyebrow: 'Detalles de nuestras contribuciones',
        titulo: 'Aportes que generan valor real',
        texto:
          'Cada contribución representa aprendizaje, desarrollo y la convicción de que el conocimiento compartido impulsa un mejor sistema de salud para todos.',
        tarjetas: [
          {
            icon: 'graduation',
            titulo: 'Traducción y localización',
            texto: 'Traducción al español de interfaces y documentación técnica.',
          },
          {
            icon: 'settings',
            titulo: 'Desarrollo y extensiones',
            texto: 'Módulos, integraciones y mejoras funcionales adaptadas a necesidades reales de implementación.',
          },
          {
            icon: 'users',
            titulo: 'Liberación a la comunidad',
            texto: 'Disponibilidad de nuestras extensiones y traducciones sin fines de lucro.',
          },
        ],
      },
      {
        tipo: 'gracias',
        eyebrow: 'Reconocimiento internacional',
        titulo: 'Agradecemos a quienes forman parte de este camino',
        texto:
          'Reconocemos y valoramos el trabajo de las comunidades y desarrolladores de estas tecnologías, cuya visión y esfuerzo han impulsado el avance del software médico abierto en todo el mundo.',
        tarjetas: [
          {
            logo: '/img/internacional/raster.png',
            logoAlt: 'Logotipo de Raster Images',
            nombre: 'Raster Images (Oviyam)',
            sello: 'Autorización de reconocimiento',
            texto:
              'Raster Images nos ha autorizado a mencionar Oviyam y Raster Images como sus desarrolladores, como parte de nuestra historia corporativa.',
          },
          {
            logo: '/img/internacional/orthanc.png',
            logoAlt: 'Logotipo de Orthanc',
            nombre: 'Orthanc',
            sello: 'Autorización de reconocimiento',
            texto:
              'El equipo de Orthanc nos ha autorizado a mencionar Orthanc en nuestra presentación y nos ha enviado sus felicitaciones por nuestro 10.º aniversario.',
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
    cierreImagenAlt: 'Vista aérea de una ciudad al amanecer',
  },
];
