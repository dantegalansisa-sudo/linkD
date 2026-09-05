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
    heroImagen: '/img/ecosistemas/hospitalario.webp',
    heroImagenAlt: 'Hospital público de la República Dominicana',
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
    cierreImagenAlt: 'Personal sanitario caminando por el pasillo de un hospital',
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
    heroImagen: '/img/ecosistemas/centros-de-diagnostico.webp',
    heroImagenAlt: 'Fachada de un centro diagnóstico privado',
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
            imagenAlt: 'Sala de rayos X con el equipo instalado',
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
            imagenAlt: 'Recepción de una clínica moderna',
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
            imagenAlt: 'Farmacéutica atendiendo en el mostrador',
            puntos: ['Gestión de inventario', 'Facturación', 'Control de recetas', 'Reportes y estadísticas'],
          },
          {
            titulo: 'Funerarias',
            icon: 'heart',
            color: '#6d5bd0',
            imagenAlt: 'Sala de velatorio con flores',
            puntos: ['Gestión de servicios', 'Control de casos', 'Facturación', 'Atención a familiares'],
          },
          {
            titulo: 'Buffetes de Abogados',
            icon: 'scale',
            color: '#f59e0b',
            imagenAlt: 'Balanza de la justicia sobre un escritorio',
            puntos: ['Gestión de casos', 'Control de clientes', 'Facturación', 'Documentos y expedientes'],
          },
          {
            titulo: 'Bienes Raíces',
            icon: 'home',
            color: '#2563eb',
            imagenAlt: 'Vivienda residencial en venta',
            puntos: ['Gestión de propiedades', 'Control de clientes', 'Seguimiento de ventas', 'Reportes y comisiones'],
          },
          {
            titulo: 'Otros Sectores',
            icon: 'briefcase',
            color: '#64748b',
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
    cierreImagenAlt: 'Dos médicos conversando en el pasillo de una clínica',
  },

  /* ==================== INTERNACIONAL ==================== */
  {
    slug: 'internacional',
    miga: 'Internacional',
    acento: '#6d5bd0',
    heroEyebrow: 'Sector internacional',
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
    heroImagenAlt: 'Mapa del mundo con las conexiones desde República Dominicana',
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
        tipo: 'destacado',
        eyebrow: 'Código abierto',
        titulo: 'Contribuyendo a una comunidad de alcance global',
        texto:
          'En LINKDICOM creemos en el poder de la colaboración. Hemos aportado a proyectos de código abierto como el visor médico Oviyan, realizando la traducción al español y desarrollando mejoras que fueron puestas a disposición de la comunidad internacional sin fines de lucro.',
        puntos: [
          'Traducción completa al español del visor Oviyan',
          'Desarrollo y aporte de mejoras públicas',
          'Disponibilidad para la comunidad sin fines de lucro',
          'Fomento al acceso libre a herramientas de salud',
        ],
        nota: 'Innovación que se comparte, multiplica su impacto.',
        imagenAlt: 'Visor médico Oviyan abierto en un portátil con un estudio de resonancia',
        panel: {
          titulo: 'Oviyan',
          texto: 'Visor médico de código abierto para el mundo.',
          items: [
            { icon: 'globe', label: 'Más accesibilidad' },
            { icon: 'users', label: 'Más colaboración' },
            { icon: 'building', label: 'Más oportunidades para instituciones' },
          ],
        },
      },
      {
        tipo: 'alianzas',
        eyebrow: 'Alianzas y colaboraciones',
        titulo: 'Más fuertes trabajando juntos',
        texto:
          'Colaboramos constantemente con otras casas de software y desarrolladores en Latinoamérica, compartiendo conocimiento y experiencia para facilitar el acceso a la tecnología en instituciones de salud. Estas alianzas nos permiten ofrecer soluciones más completas, interoperables y adaptadas a las realidades de cada país.',
        iconos: [
          { icon: 'handshake', label: 'Alianzas tecnológicas' },
          { icon: 'network', label: 'Interoperabilidad entre sistemas' },
          { icon: 'lightbulb', label: 'Intercambio de conocimiento' },
          { icon: 'settings', label: 'Desarrollo de proyectos conjuntos' },
        ],
      },
      {
        tipo: 'cifras',
        eyebrow: 'Impacto internacional',
        titulo: 'Resultados que trascienden fronteras',
        datos: [
          { icon: 'building', valor: '+20', label: 'Instituciones fuera de RD' },
          { icon: 'globe', valor: '4', label: 'Países con implementaciones directas' },
          { icon: 'users', valor: 'Alianzas', label: 'en constante crecimiento' },
          { icon: 'chart', valor: 'Más acceso', label: 'a tecnología de salud en la región' },
        ],
        cita:
          'La tecnología no tiene fronteras, y en LINKDICOM trabajamos para que más instituciones en el mundo puedan acceder a soluciones confiables, flexibles y de alta calidad.',
      },
    ],

    cierreEyebrow: 'Un futuro sin límites',
    cierreTitulo: 'Seguimos conectando salud en todo el mundo',
    cierreTexto:
      'Desde República Dominicana, continuamos abriendo oportunidades, construyendo alianzas y llevando tecnología a más personas, porque creemos en un sistema de salud más conectado, eficiente y humano.',
    cierreCta: 'Conversemos sobre tu proyecto',
    cierreLema: ['República Dominicana,', 'talento que conecta al mundo.'],
    cierreImagenAlt: 'Ala de un avión sobrevolando una ciudad',
  },
];
