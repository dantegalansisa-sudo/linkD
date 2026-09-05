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
  /** Lema lateral del hero. No todas las fichas lo llevan. */
  heroLema?: string;
  heroImagen?: string;
  heroImagenAlt: string;

  /** Imagen del panel principal. */
  imagenPrincipal?: string;
  imagenPrincipalAlt: string;
  /** Logotipo del producto. Si falta, el panel escribe el nombre. */
  logo?: string;

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
    heroImagen: '/img/productos/radiologox/hero.webp',
    heroImagenAlt: 'Radiólogo revisando estudios en varias pantallas',

    imagenPrincipal: '/img/productos/radiologox/panel.webp',
    logo: '/img/logos/radiologox.png',
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
        imagen: '/img/productos/radiologox/descripcion.webp',
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
        imagen: '/img/productos/radiologox/beneficios.webp',
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
        imagen: '/img/productos/radiologox/funcionalidades.webp',
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
        imagen: '/img/productos/radiologox/integraciones.webp',
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
        imagen: '/img/productos/radiologox/hero.webp',
        imagenAlt: 'Radiólogo trabajando con RadiologoX junto a la sala de tomografía',
      },
    ],

    ctaTitulo: '¿Listo para optimizar tu servicio de imágenes?',
    ctaTexto:
      'Descubre cómo RadiologoX puede mejorar la productividad de tu equipo y la atención de tus pacientes.',
  },

  {
    slug: 'ecoturnox',
    familia: 'salud',
    categoria: 'Turnos y filas',
    nombre: 'ECOTurnox',
    color: '#2fa84f',
    titulo: 'Sistema inteligente de gestión de turnos y filas',
    intro:
      'ECOTurnox optimiza el flujo de pacientes, reduce los tiempos de espera y mejora la experiencia en tu institución con una solución moderna, flexible y fácil de usar.',

    heroEyebrow: 'Nuestro ecosistema',
    heroTitulo: 'Soluciones que transforman cada parte de tu institución',
    heroTexto:
      'Un ecosistema integrado de tecnología y servicios que conecta personas, procesos e información para una atención de salud más eficiente, segura y centrada en el paciente.',
    heroImagen: '/img/productos/ecoturnox/hero.webp',
    heroImagenAlt: 'Sala de espera con pantallas de llamado y kiosco de turnos ECOTurnox',

    imagenPrincipal: '/img/productos/ecoturnox/panel.webp',
    logo: '/img/logos/ecoturnox.png',
    imagenPrincipalAlt: 'Kiosco de autoservicio de ECOTurnox junto a la pantalla de llamado',

    caracteristicas: [
      { icon: 'user-round', label: 'Turnos presenciales y virtuales' },
      { icon: 'monitor', label: 'Pantallas de llamado en tiempo real' },
      { icon: 'file-text', label: 'Integración con Historia Clínica' },
      { icon: 'calendar', label: 'Módulo de citas y agendamiento' },
      { icon: 'chart', label: 'Reportes y estadísticas' },
      { icon: 'whatsapp', label: 'Notificaciones por SMS/WhatsApp' },
      { icon: 'layers', label: 'Personalización de flujos' },
      { icon: 'cloud', label: 'Funcionamiento local o en la nube' },
    ],

    datos: [
      { icon: 'building', valor: '+300', label: 'Instituciones confían en nosotros' },
      { icon: 'users', valor: '5M+', label: 'Turnos gestionados cada año' },
      { icon: 'clock', valor: '99.8%', label: 'Disponibilidad del servicio' },
      { icon: 'headset', valor: 'Soporte 24/7', label: 'Acompañamiento especializado' },
    ],

    pestanas: [
      {
        key: 'descripcion',
        label: 'Descripción',
        titulo: 'Una experiencia de espera más organizada y eficiente',
        texto:
          'ECOTurnox es una solución integral para la gestión de turnos y filas, diseñada para hospitales, clínicas y centros de salud. Combina kioscos de autoservicio, pantallas de llamado, integración con sistemas clínicos y herramientas de análisis para transformar la experiencia de tus pacientes.',
        puntos: [
          'Reduce los tiempos de espera y la congestión.',
          'Mejora la satisfacción de los pacientes.',
          'Optimiza la operación del personal.',
          'Se adapta a la realidad de tu institución.',
          'Funciona en ambiente local o en la nube.',
        ],
        imagen: '/img/productos/ecoturnox/descripcion.webp',
        imagenAlt: 'Pantalla de llamado de turnos en una sala de espera',
      },
      {
        key: 'beneficios',
        label: 'Beneficios',
        titulo: 'Una sala de espera que deja de ser un problema',
        texto:
          'Cuando el paciente sabe cuánto falta y a dónde ir, la percepción de la espera cambia por completo, y el personal deja de gestionar filas para dedicarse a atender.',
        puntos: [
          'Ordena la llegada de pacientes sin aglomeraciones en recepción.',
          'Reduce las quejas por tiempos de espera y turnos perdidos.',
          'Libera al personal de administrar la fila manualmente.',
          'Da datos reales de demanda por franja horaria y servicio.',
        ],
        imagen: '/img/productos/ecoturnox/beneficios.webp',
        imagenAlt: 'Personal de recepción atendiendo con el sistema de turnos',
      },
      {
        key: 'funcionalidades',
        label: 'Funcionalidades',
        titulo: 'Del turno a la cita, todo en un mismo flujo',
        texto:
          'ECOTurnox cubre el recorrido completo del paciente: pide su turno, se le llama, se le atiende y queda registrado.',
        puntos: [
          'Kiosco de autoservicio con impresión de ticket.',
          'Turno virtual desde el móvil, sin pasar por recepción.',
          'Pantallas de llamado configurables por área y sede.',
          'Priorización de casos urgentes y atención preferente.',
          'Panel de supervisión con la fila en vivo.',
        ],
        imagen: '/img/productos/ecoturnox/funcionalidades.webp',
        imagenAlt: 'Paciente sacando su turno en el kiosco de autoservicio',
      },
      {
        key: 'integraciones',
        label: 'Integraciones',
        titulo: 'Conectado con el resto de tu operación',
        texto:
          'El turno no vive aislado: se enlaza con la historia clínica, la facturación y el resto del ecosistema.',
        puntos: [
          'Integración con Historia Clínica y sistemas HIS.',
          'Enlace con SIEGIX Health para facturar sin repetir datos.',
          'Notificaciones por SMS y WhatsApp al paciente.',
          'API para conectar la agenda de tu institución.',
        ],
        imagen: '/img/productos/ecoturnox/integraciones.webp',
        imagenAlt: 'Esquema de integración entre turnos, historia clínica y facturación',
      },
      {
        key: 'casos',
        label: 'Casos de Éxito',
        titulo: 'Instituciones que ya ordenaron su flujo de pacientes',
        texto:
          'Hospitales, clínicas y centros de diagnóstico de la región gestionan hoy sus filas con ECOTurnox.',
        puntos: [
          'Centros de diagnóstico con varias áreas de atención simultáneas.',
          'Hospitales con consulta externa de alto volumen.',
          'Redes con varias sedes y una única configuración central.',
        ],
        imagen: '/img/productos/ecoturnox/hero.webp',
        imagenAlt: 'Sala de espera ordenada en una institución cliente',
      },
    ],

    ctaTitulo: '¿Listo para transformar la experiencia de tus pacientes?',
    ctaTexto: 'Descubre cómo ECOTurnox puede optimizar la atención en tu institución.',
  },

  {
    slug: 'siegix-health',
    familia: 'salud',
    categoria: 'Facturación y gestión hospitalaria',
    nombre: 'SIEGIX Health',
    color: '#1f7ae0',
    titulo: 'Control total para una gestión hospitalaria más eficiente',
    intro:
      'SIEGIX Health es una plataforma integral de facturación electrónica, contabilidad y gestión administrativa, diseñada para hospitales, clínicas y centros de salud. Centraliza tus procesos financieros, operativos y administrativos en un solo sistema, con total cumplimiento de las normativas locales.',

    heroEyebrow: 'Nuestro ecosistema',
    heroTitulo: 'Soluciones que transforman cada parte de tu institución',
    heroTexto:
      'Un ecosistema integrado de tecnología y servicios que conecta personas, procesos e información para una atención de salud más eficiente, segura y centrada en el paciente.',
    heroLema: 'Gestión eficiente para una salud más sostenible',
    heroImagen: '/img/productos/siegix-health/hero.webp',
    heroImagenAlt: 'Panel financiero de SIEGIX Health en dos monitores',

    imagenPrincipal: '/img/productos/siegix-health/panel.webp',
    logo: '/img/logos/siegix-health.png',
    imagenPrincipalAlt: 'Cuadro de mando de SIEGIX Health con indicadores de facturación',

    caracteristicas: [
      { icon: 'file-text', label: 'Facturación electrónica (e-CF)' },
      { icon: 'chart', label: 'Contabilidad integrada' },
      { icon: 'users', label: 'Gestión de nóminas' },
      { icon: 'user-round', label: 'Administración de accionistas' },
      { icon: 'box', label: 'Control de inventario' },
      { icon: 'network', label: 'Integración con terceros' },
      { icon: 'activity', label: 'Reportes avanzados y BI' },
      { icon: 'building', label: 'Multi-sede y multi-institución' },
    ],

    datos: [
      { icon: 'building', valor: '+150', label: 'Instituciones confían en nosotros' },
      { icon: 'chart', valor: '+8M', label: 'Comprobantes fiscales emitidos al año' },
      { icon: 'clock', valor: '99.9%', label: 'Disponibilidad del servicio' },
      { icon: 'headset', valor: 'Soporte 24/7', label: 'Acompañamiento especializado' },
    ],

    pestanas: [
      {
        key: 'descripcion',
        label: 'Descripción',
        titulo: 'Una plataforma completa para la gestión financiera y administrativa',
        texto:
          'SIEGIX Health simplifica la operación de tu institución al integrar la facturación electrónica con la contabilidad, nóminas, inventario, control de activos y más, en un entorno seguro, escalable y fácil de usar.',
        puntos: [
          'Emite comprobantes fiscales electrónicos (e-CF) de forma sencilla.',
          'Gestiona la contabilidad general y centros de costos.',
          'Administra nóminas, empleados y deducciones.',
          'Controla accionistas, dividendos y estados financieros.',
          'Conéctate con sistemas de terceros (PACS, LIS, HIS, aseguradoras, bancos, etc.).',
          'Obtén reportes en tiempo real para una mejor toma de decisiones.',
        ],
        imagen: '/img/productos/siegix-health/descripcion.webp',
        imagenAlt: 'Contabilidad y facturación electrónica en SIEGIX Health',
      },
      {
        key: 'beneficios',
        label: 'Beneficios',
        titulo: 'Cierra el mes sin pelearte con los números',
        texto:
          'Al vivir la facturación y la contabilidad en el mismo sistema, desaparece la doble digitación y con ella la mayor fuente de errores.',
        puntos: [
          'Cumple con la normativa fiscal sin procesos paralelos.',
          'Elimina la doble digitación entre facturación y contabilidad.',
          'Reduce el tiempo de cierre contable mensual.',
          'Da visibilidad financiera por sede, servicio y centro de costo.',
        ],
        imagen: '/img/productos/siegix-health/beneficios.webp',
        imagenAlt: 'Responsable financiero revisando el cierre del mes',
      },
      {
        key: 'funcionalidades',
        label: 'Funcionalidades',
        titulo: 'Todo el back office de tu institución',
        texto:
          'Más allá de facturar, SIEGIX Health cubre las áreas administrativas que sostienen la operación diaria.',
        puntos: [
          'Facturación a pacientes, ARS y aseguradoras.',
          'Contabilidad general con centros de costo.',
          'Nómina, empleados, deducciones y prestaciones.',
          'Inventario y control de activos fijos.',
          'Paneles de indicadores y reportes exportables.',
        ],
        imagen: '/img/productos/siegix-health/funcionalidades.webp',
        imagenAlt: 'Módulos administrativos de SIEGIX Health',
      },
      {
        key: 'integraciones',
        label: 'Integraciones',
        titulo: 'Habla con el resto de tus sistemas',
        texto:
          'La información llega desde donde se genera, sin que nadie la vuelva a teclear.',
        puntos: [
          'Integración nativa con RadiologoX, LINKRix y ECOTurnox.',
          'Conexión con HIS, LIS y PACS de terceros.',
          'Enlace con aseguradoras y entidades bancarias.',
          'Cumplimiento del estándar de facturación electrónica de la DGII.',
        ],
        imagen: '/img/productos/siegix-health/integraciones.webp',
        imagenAlt: 'Diagrama de integración de la facturación con otros sistemas',
      },
      {
        key: 'casos',
        label: 'Casos de Éxito',
        titulo: 'Instituciones que ya centralizaron su administración',
        texto:
          'Hospitales y centros de diagnóstico operan hoy su facturación y contabilidad sobre SIEGIX Health.',
        puntos: [
          'Centros de diagnóstico con facturación electrónica a ARS.',
          'Hospitales con contabilidad multi-centro de costo.',
          'Grupos médicos con varias razones sociales en una sola plataforma.',
        ],
        imagen: '/img/productos/siegix-health/hero.webp',
        imagenAlt: 'Responsable financiero trabajando con los paneles de SIEGIX Health',
      },
    ],

    ctaTitulo: '¿Listo para llevar la gestión de tu institución a otro nivel?',
    ctaTexto:
      'Descubre cómo SIEGIX Health puede optimizar tus procesos financieros y administrativos.',
  },

  {
    slug: 'linkrix',
    familia: 'salud',
    categoria: 'RIS y worklist',
    nombre: 'LINKRix',
    color: '#e8621f',
    titulo: 'El puente entre tus equipos y tu información radiológica',
    intro:
      'LINKRix, operado a través de LINKConnect, es la solución RIS que gestiona el flujo de trabajo radiológico en tu institución. Integra equipos, centraliza la información, optimiza la lista de trabajo (Worklist) y ofrece reportes en tiempo real para una operación más eficiente y segura.',

    heroEyebrow: 'Nuestro ecosistema',
    heroTitulo: 'Soluciones que transforman cada parte de tu institución',
    heroTexto:
      'Un ecosistema integrado de tecnología y servicios que conecta personas, procesos e información para una atención de salud más eficiente, segura y centrada en el paciente.',
    heroLema: 'Conecta equipos, información y personas',
    heroImagen: '/img/productos/linkrix/hero.webp',
    heroImagenAlt: 'Estación de radiología con la worklist de LINKRix en pantalla',

    imagenPrincipal: '/img/productos/linkrix/panel.webp',
    logo: '/img/logos/linkrix.png',
    imagenPrincipalAlt: 'Lista de trabajo de LINKRix junto al equipo LINKConnect',

    caracteristicas: [
      { icon: 'layers', label: 'Worklist DICOM' },
      { icon: 'file-text', label: 'Gestión de estudios' },
      { icon: 'chart', label: 'Reportes y estadísticas' },
      { icon: 'network', label: 'Integración con terceros' },
      { icon: 'scan', label: 'Gestión de equipos y salas' },
      { icon: 'users', label: 'Trazabilidad de pacientes' },
      { icon: 'lock', label: 'Control de usuarios y permisos' },
      { icon: 'cpu', label: 'Operación con LINKConnect' },
    ],

    datos: [
      { icon: 'cpu', valor: '+100', label: 'Equipos integrados' },
      { icon: 'chart', valor: '1M+', label: 'Estudios gestionados' },
      { icon: 'clock', valor: '99.9%', label: 'Disponibilidad del servicio' },
      { icon: 'headset', valor: 'Soporte 24/7', label: 'Acompañamiento especializado' },
    ],

    pestanas: [
      {
        key: 'descripcion',
        label: 'Descripción',
        titulo: 'Optimiza el flujo radiológico de tu institución',
        texto:
          'LINKRix, junto a LINKConnect, permite la integración y gestión completa de los equipos de imágenes médicas en el entorno hospitalario. Centraliza la información de estudios, optimiza el flujo de trabajo, facilita la comunicación con sistemas de terceros y asegura la trazabilidad de cada paciente desde la solicitud hasta el informe final.',
        puntos: [
          'Lista de trabajo DICOM inteligente (Worklist).',
          'Gestión de estudios, pacientes y salas.',
          'Integración con PACS, HIS, LIS y otros sistemas.',
          'Reportes avanzados y métricas de productividad.',
          'Monitoreo y gestión de equipos radiológicos.',
          'Funciona en tu servidor local, con LINKConnect o en entornos virtualizados.',
        ],
        imagen: '/img/productos/linkrix/descripcion.webp',
        imagenAlt: 'Técnico gestionando la lista de trabajo radiológica',
      },
      {
        key: 'beneficios',
        label: 'Beneficios',
        titulo: 'El equipo deja de esperar y el paciente también',
        texto:
          'Con la worklist enviada al equipo, el técnico no vuelve a teclear los datos del paciente ni arriesga un estudio mal identificado.',
        puntos: [
          'Elimina errores de identificación de estudios.',
          'Reduce el tiempo entre la orden y la adquisición.',
          'Da visibilidad del estado de cada estudio en tiempo real.',
          'Mide la productividad por equipo, sala y turno.',
        ],
        imagen: '/img/productos/linkrix/beneficios.webp',
        imagenAlt: 'Sala de adquisición con el estudio ya identificado',
      },
      {
        key: 'funcionalidades',
        label: 'Funcionalidades',
        titulo: 'Control de la sala, no solo de la imagen',
        texto:
          'LINKRix administra el recurso completo: quién, con qué equipo, en qué sala y en qué estado.',
        puntos: [
          'Worklist filtrable por modalidad, sala, urgencia y estado.',
          'Agenda de equipos y salas con control de disponibilidad.',
          'Perfiles de usuario con permisos por área.',
          'Reportes de productividad y tiempos de ciclo.',
        ],
        imagen: '/img/productos/linkrix/funcionalidades.webp',
        imagenAlt: 'Panel de gestión de equipos y salas de LINKRix',
      },
      {
        key: 'integraciones',
        label: 'Integraciones',
        titulo: 'El nexo entre modalidades y sistemas',
        texto:
          'LINKRix es precisamente la capa que hace hablar a los equipos con el resto de la institución.',
        puntos: [
          'DICOM Modality Worklist con cualquier equipo del mercado.',
          'HL7 hacia el HIS o la historia clínica.',
          'Integración nativa con RadiologoX y LinkBurnPrint.',
          'Operación mediante el dispositivo LINKConnect.',
        ],
        imagen: '/img/productos/linkrix/integraciones.webp',
        imagenAlt: 'Dispositivo LINKConnect conectando equipos de imagen',
      },
      {
        key: 'casos',
        label: 'Casos de Éxito',
        titulo: 'Instituciones que integraron todo su parque de equipos',
        texto:
          'Centros con varias modalidades y fabricantes distintos operan hoy bajo una sola lista de trabajo.',
        puntos: [
          'Centros con equipos de varios fabricantes bajo una worklist única.',
          'Hospitales con salas distribuidas en varios pisos y edificios.',
          'Redes con adquisición local y lectura centralizada.',
        ],
        imagen: '/img/productos/linkrix/hero.webp',
        imagenAlt: 'Técnico gestionando la lista de trabajo de LINKRix en el servicio de imágenes',
      },
    ],

    ctaTitulo: '¿Listo para optimizar tu flujo radiológico?',
    ctaTexto: 'Descubre cómo LINKRix puede mejorar la productividad de tu institución.',
  },

  {
    slug: 'laboratoriux',
    familia: 'salud',
    categoria: 'Sistema de laboratorio',
    nombre: 'LaboratoriuX',
    color: '#1aa37a',
    titulo: 'Gestión de laboratorio clínico',
    intro:
      'LaboratoriuX es un sistema completo para la gestión de laboratorios clínicos, diseñado para optimizar el flujo de trabajo, garantizar la trazabilidad de las muestras y ofrecer resultados confiables e integrados con el ecosistema LINKDICOM.',

    heroEyebrow: 'Nuestro ecosistema',
    heroTitulo: 'Soluciones que transforman cada parte de tu institución',
    heroTexto:
      'Un ecosistema integrado de tecnología y servicios que conecta personas, procesos e información para una atención de salud más eficiente, segura y centrada en el paciente.',
    heroLema: 'Resultados más rápidos, mejores decisiones',
    heroImagen: '/img/ecosistemas/laboratorios.webp',
    heroImagenAlt: 'Panel de muestras de LaboratoriuX sobre un laboratorio clínico',

    imagenPrincipal: '/img/ecosistemas/laboratorios.webp',
    imagenPrincipalAlt: 'Pantalla de LaboratoriuX con el seguimiento de muestras del día',

    caracteristicas: [
      { icon: 'user-round', label: 'Registro de pacientes' },
      { icon: 'microscope', label: 'Gestión de muestras' },
      { icon: 'cpu', label: 'Procesamiento de resultados' },
      { icon: 'check-circle', label: 'Validación técnica' },
      { icon: 'file-text', label: 'Informes automatizados' },
      { icon: 'scan', label: 'Códigos de barras y QR' },
      { icon: 'network', label: 'Integración con equipos (LIS)' },
      { icon: 'shield', label: 'Control de calidad (QC)' },
      { icon: 'monitor', label: 'Resultados en línea a pacientes' },
      { icon: 'chart', label: 'Reportes y estadísticas' },
    ],

    datos: [
      { icon: 'building', valor: '+300', label: 'Laboratorios confían en nuestras soluciones' },
      { icon: 'chart', valor: '1M+', label: 'Resultados procesados mensualmente' },
      { icon: 'clock', valor: '99.8%', label: 'Disponibilidad del servicio' },
      { icon: 'network', valor: 'Integración total', label: 'con HIS, RIS y equipos de laboratorio' },
    ],

    pestanas: [
      {
        key: 'descripcion',
        label: 'Descripción',
        titulo: 'Más eficiencia, más control, mejores resultados',
        texto:
          'LaboratoriuX te permite gestionar todo el ciclo del laboratorio clínico, desde la recepción de muestras hasta la entrega de resultados, con trazabilidad completa, integración con dispositivos y control de calidad. Diseñado para laboratorios independientes, hospitales y centros de diagnóstico.',
        puntos: [
          'Gestión completa de pacientes, muestras y resultados.',
          'Integración con analizadores y equipos de laboratorio.',
          'Impulsado por estándares HL7 para interoperabilidad.',
          'Control de calidad interno y externo.',
          'Entrega de resultados en línea a pacientes y médicos.',
          'Reportes estadísticos y paneles de gestión.',
          'Seguro, escalable y 100% web.',
        ],
        imagenAlt: 'Tubo de muestra etiquetado con código de barras',
      },
      {
        key: 'beneficios',
        label: 'Beneficios',
        titulo: 'Cada muestra, localizada en todo momento',
        texto:
          'La trazabilidad por código de barras cierra el hueco donde se pierden las muestras y donde se cuelan los errores de identificación.',
        puntos: [
          'Elimina confusiones de identificación de muestras.',
          'Reduce el tiempo entre la toma y la entrega del resultado.',
          'Evita la transcripción manual desde los analizadores.',
          'Da soporte documental para auditorías y acreditación.',
        ],
        imagenAlt: 'Personal técnico validando resultados en el laboratorio',
      },
      {
        key: 'funcionalidades',
        label: 'Funcionalidades',
        titulo: 'De la recepción a la validación firmada',
        texto:
          'El sistema acompaña la muestra en cada etapa y deja registro de quién hizo qué y cuándo.',
        puntos: [
          'Recepción, etiquetado y distribución por área.',
          'Interfaz bidireccional con analizadores.',
          'Validación técnica y facultativa con firma.',
          'Control de calidad interno con reglas de Westgard.',
          'Portal de resultados para el paciente y el médico.',
        ],
        imagenAlt: 'Analizador de laboratorio conectado al sistema',
      },
      {
        key: 'integraciones',
        label: 'Integraciones',
        titulo: 'Conectado con los equipos y con el resto del ecosistema',
        texto:
          'LaboratoriuX se comunica con los analizadores y con los sistemas clínicos que ya usa tu institución.',
        puntos: [
          'Interfaz con analizadores por HL7 y ASTM.',
          'Enlace con HIS y con la historia clínica del paciente.',
          'Integración con SIEGIX Health para facturar el estudio.',
          'Entrega de resultados a través del portal en línea.',
        ],
        imagenAlt: 'Esquema de integración entre analizadores y sistemas clínicos',
      },
      {
        key: 'casos',
        label: 'Casos de Éxito',
        titulo: 'Laboratorios que ya trabajan con trazabilidad completa',
        texto:
          'Laboratorios independientes y servicios hospitalarios gestionan su operación diaria con LaboratoriuX.',
        puntos: [
          'Laboratorios clínicos independientes con varias sucursales.',
          'Servicios de laboratorio dentro de hospitales.',
          'Centros de diagnóstico que combinan imagen y laboratorio.',
        ],
        imagenAlt: 'Laboratorio clínico de una institución cliente',
      },
    ],

    ctaTitulo: '¿Listo para llevar tu laboratorio al siguiente nivel?',
    ctaTexto:
      'Descubre cómo LaboratoriuX puede ayudarte a mejorar la eficiencia, la calidad y la experiencia de tus pacientes.',
  },

  {
    slug: 'linkburnprint',
    familia: 'salud',
    categoria: 'Entrega de resultados',
    nombre: 'LinkBurnPrint',
    color: '#f08a1e',
    titulo: 'Resultados físicos y digitales de forma simple y profesional',
    intro:
      'LinkBurnPrint es la solución completa para la creación de etiquetas inteligentes con código QR, grabación de CD/DVD y generación de impresiones en láminas. Diseñado para integrarse con RadiologoX y todo el ecosistema LINKDICOM, facilita la entrega de estudios de forma segura, rápida y personalizada.',

    heroEyebrow: 'Nuestro ecosistema',
    heroTitulo: 'Soluciones que transforman cada parte de tu institución',
    heroTexto:
      'Un ecosistema integrado de tecnología y servicios que conecta personas, procesos e información para una atención de salud más eficiente, segura y centrada en el paciente.',
    heroLema: 'Resultados en tus manos, siempre conectados',
    heroImagen: '/img/productos/linkburnprint/hero.webp',
    heroImagenAlt: 'Disco con etiqueta impresa y código QR junto a la grabadora',

    imagenPrincipal: '/img/productos/linkburnprint/panel.webp',
    logo: '/img/logos/linkburnprint.png',
    imagenPrincipalAlt: 'Grabadora e impresora de LinkBurnPrint con estudios en lámina',

    caracteristicas: [
      { icon: 'scan', label: 'Etiquetas inteligentes con QR' },
      { icon: 'box', label: 'Grabación de CD/DVD' },
      { icon: 'printer', label: 'Impresión en láminas' },
      { icon: 'layers', label: 'Plantillas personalizadas' },
      { icon: 'network', label: 'Integración con PACS y RIS' },
      { icon: 'file-text', label: 'Registro y trazabilidad' },
      { icon: 'credit-card', label: 'Impresión de códigos de barra' },
      { icon: 'image', label: 'Soporte para múltiples formatos' },
    ],

    datos: [
      { icon: 'building', valor: '+200', label: 'Instituciones confían en nosotros' },
      { icon: 'printer', valor: '1M+', label: 'Estudios entregados en medios físicos' },
      { icon: 'clock', valor: '99.9%', label: 'Disponibilidad del servicio' },
      { icon: 'headset', valor: 'Soporte 24/7', label: 'Acompañamiento especializado' },
    ],

    pestanas: [
      {
        key: 'descripcion',
        label: 'Descripción',
        titulo: 'Una solución completa para la entrega de estudios',
        texto:
          'LinkBurnPrint simplifica la entrega de resultados médicos con una solución profesional, segura y personalizable. Permite crear etiquetas con código QR, grabar CD/DVD, imprimir láminas de alta calidad y mantener un registro completo de cada entrega, todo integrado con los demás módulos de LINKDICOM.',
        puntos: [
          'Etiquetas personalizadas con código QR y datos del paciente.',
          'Grabación automática de CD/DVD con visor de imágenes.',
          'Impresión en láminas DICOM y reportes.',
          'Integración con RadiologoX, LINKRix y otros sistemas.',
          'Trazabilidad y control de todas las entregas.',
          'Diseñado para hospitales, centros de diagnóstico y consultorios.',
        ],
        imagen: '/img/productos/linkburnprint/descripcion.webp',
        imagenAlt: 'Etiqueta con código QR impresa sobre el disco del estudio',
      },
      {
        key: 'beneficios',
        label: 'Beneficios',
        titulo: 'Una entrega que se ve profesional y queda registrada',
        texto:
          'El paciente se lleva su estudio con la marca de la institución, y la institución sabe exactamente qué entregó y a quién.',
        puntos: [
          'Refuerza la imagen de la institución en cada entrega.',
          'Evita entregas equivocadas gracias al código QR.',
          'Deja constancia de cada estudio entregado.',
          'Automatiza una tarea que antes ocupaba a una persona.',
        ],
        imagen: '/img/productos/linkburnprint/beneficios.webp',
        imagenAlt: 'Paciente recibiendo su estudio en recepción',
      },
      {
        key: 'funcionalidades',
        label: 'Funcionalidades',
        titulo: 'Etiqueta, graba, imprime y registra',
        texto:
          'Un solo puesto resuelve todos los formatos de entrega que puede necesitar tu servicio.',
        puntos: [
          'Diseñador de plantillas con la identidad de tu institución.',
          'Grabación de CD/DVD con visor DICOM incluido.',
          'Impresión en lámina y en papel de informes.',
          'Cola de trabajos con reintento automático.',
          'Historial de entregas consultable por paciente.',
        ],
        imagen: '/img/productos/linkburnprint/funcionalidades.webp',
        imagenAlt: 'Puesto de trabajo de entrega de resultados',
      },
      {
        key: 'integraciones',
        label: 'Integraciones',
        titulo: 'Toma los estudios directamente del PACS',
        texto:
          'No hay exportaciones manuales: LinkBurnPrint lee el estudio de donde ya está guardado.',
        puntos: [
          'Integración nativa con RadiologoX y LINKRix.',
          'Consulta DICOM Query/Retrieve a PACS de terceros.',
          'Enlace del QR con el portal de resultados en línea.',
          'Compatible con grabadoras e impresoras del mercado.',
        ],
        imagen: '/img/productos/linkburnprint/integraciones.webp',
        imagenAlt: 'Esquema de integración con el PACS de la institución',
      },
      {
        key: 'casos',
        label: 'Casos de Éxito',
        titulo: 'Instituciones que profesionalizaron su entrega',
        texto:
          'Centros de diagnóstico y hospitales entregan hoy sus estudios con identidad propia y trazabilidad.',
        puntos: [
          'Centros de diagnóstico con alto volumen de entrega diaria.',
          'Hospitales que combinan entrega física y portal en línea.',
          'Consultorios que entregan estudios al paciente en el momento.',
        ],
        imagen: '/img/productos/linkburnprint/hero.webp',
        imagenAlt: 'Estudios impresos y grabados con LinkBurnPrint listos para el paciente',
      },
    ],

    ctaTitulo: '¿Listo para optimizar la entrega de tus resultados?',
    ctaTexto: 'Descubre cómo LinkBurnPrint puede mejorar la experiencia de tus pacientes.',
  },

  {
    slug: 'consultoriox',
    familia: 'salud',
    categoria: 'Gestión de Consultorios',
    nombre: 'ConsultorioX',
    color: '#2b6cb8',
    titulo: 'La plataforma inteligente para gestionar tu consultorio y tus pacientes',
    intro:
      'Centraliza citas, pacientes, consultas, historia clínica y procesos administrativos en una sola plataforma.',

    heroEyebrow: 'Gestión de consultorios',
    heroTitulo: 'Organiza hoy el flujo completo de tu consultorio médico',
    heroTexto:
      'Una plataforma integral que conecta médicos, pacientes y procesos administrativos para una atención más eficiente, humana y centrada en el paciente.',
    heroLema: 'Tecnología para una salud más cercana',
    heroImagen: '/img/productos/consultoriox/hero.webp',
    heroImagenAlt: 'Médico atendiendo a una paciente en su consultorio con la tableta en la mano',

    imagenPrincipal: '/img/productos/consultoriox/panel.webp',
    logo: '/img/logos/consultoriox.png',
    imagenPrincipalAlt: 'Panel de ConsultorioX con la agenda del día y el paciente en consulta',

    caracteristicas: [
      { icon: 'calendar', label: 'Agenda inteligente' },
      { icon: 'file-text', label: 'Historia clínica' },
      { icon: 'users', label: 'Gestión de pacientes' },
      { icon: 'clock', label: 'Control de citas' },
      { icon: 'credit-card', label: 'Facturación integrada' },
      { icon: 'user-round', label: 'Portal del paciente' },
    ],

    datos: [
      { icon: 'building', valor: '+200', label: 'Instituciones confían en nosotros' },
      { icon: 'users', valor: '1M+', label: 'Pacientes procesados' },
      { icon: 'shield', valor: '+10 Años', label: 'de experiencia en el sector salud' },
      { icon: 'headset', valor: 'Soporte 24/7', label: 'Acompañamiento especializado' },
    ],

    pestanas: [
      {
        key: 'descripcion',
        label: 'Descripción',
        titulo: 'Todo tu consultorio en una sola plataforma',
        texto:
          'ConsultorioX centraliza la gestión de citas, pacientes, consultas, historia clínica y procesos administrativos, facilitando el trabajo del personal médico y mejorando la experiencia de tus pacientes. Una solución completa, segura y escalable para consultorios y centros de atención primaria o especializada.',
        puntos: [
          'Centraliza la información de tus pacientes.',
          'Organiza citas y agendas médicas.',
          'Registra consultas e historia clínica.',
          'Agiliza el trabajo del personal.',
          'Integra facturación y otros servicios.',
          'Mejora la experiencia del paciente.',
        ],
        imagen: '/img/productos/consultoriox/descripcion.webp',
        imagenAlt: 'Panel de ConsultorioX abierto en la consulta del médico',
      },
      {
        key: 'beneficios',
        label: 'Beneficios',
        titulo: 'Menos ausencias y pacientes mejor informados',
        texto:
          'El paciente recibe la confirmación de su cita en el móvil, con recordatorio automático. Tu agenda se llena de verdad y la recepción deja de perseguir confirmaciones por teléfono.',
        puntos: [
          'Confirmación y recordatorio automáticos de cada cita.',
          'Menos ausencias y huecos en la agenda del día.',
          'La recepción dedica menos tiempo a llamadas.',
          'El paciente consulta sus datos cuando quiere.',
          'Historial completo disponible en cada consulta.',
        ],
        imagen: '/img/productos/consultoriox/beneficios.webp',
        imagenAlt: 'Paciente consultando en el móvil la confirmación de su cita',
      },
      {
        key: 'funcionalidades',
        label: 'Funcionalidades',
        titulo: 'Del calendario a la receta, sin cambiar de programa',
        texto:
          'Cada parte del día del consultorio tiene su lugar en la plataforma: la agenda, la consulta, la receta, el documento y el cobro.',
        puntos: [
          'Calendario de citas con estado de cada paciente.',
          'Historial clínico con antecedentes, notas y documentos.',
          'Recetas digitales listas para enviar al paciente.',
          'Recordatorios de citas, tratamientos y resultados.',
          'Gestión de pacientes con etiquetas y filtros.',
          'Reportes de actividad del consultorio.',
        ],
        imagen: '/img/productos/consultoriox/funcionalidades.webp',
        imagenAlt: 'Calendario, historial clínico y recetas digitales de ConsultorioX',
      },
      {
        key: 'integraciones',
        label: 'Integraciones',
        titulo: 'Conectado con lo que ya usas',
        texto:
          'ConsultorioX no obliga a cambiar el resto de tu operación: se enlaza con tu facturación, tu administración y tus estudios de imagen.',
        puntos: [
          'Facturación: enlace con tu sistema de facturación actual.',
          'ERP: sincroniza inventario, compras y contabilidad.',
          'CRM: gestión de pacientes y relaciones.',
          'RIS: integración con sistemas de imágenes radiológicas.',
          'Integración nativa con el resto del ecosistema LINKDICOM.',
        ],
        imagen: '/img/productos/consultoriox/integraciones.webp',
        imagenAlt: 'Esquema de integración de ConsultorioX con facturación, ERP, CRM y RIS',
      },
      {
        key: 'casos',
        label: 'Casos de Éxito',
        titulo: 'Consultorios que ya trabajan sin papel',
        texto:
          'Consultorios individuales y centros con varios especialistas gestionan su día completo desde ConsultorioX.',
        puntos: [
          'Consultorios de medicina general y familiar.',
          'Centros con varios especialistas y agendas simultáneas.',
          'Redes médicas que comparten historia clínica entre sedes.',
        ],
        imagen: '/img/productos/consultoriox/hero.webp',
        imagenAlt: 'Médico atendiendo a una paciente con ConsultorioX en la tableta',
      },
    ],

    ctaTitulo: '¿Listo para transformar la gestión de tu consultorio?',
    ctaTexto:
      'Descubre cómo ConsultorioX puede ayudarte a organizar tus citas, pacientes y procesos.',
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
