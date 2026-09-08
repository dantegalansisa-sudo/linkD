import type { IconName } from '../components/ui/Icon';

/*
  Seccion Empresa: seis paginas.

  Las seis comparten la cabecera oscura y la banda de cierre, asi que esas dos
  piezas viven en `Marco`. El cuerpo de cada una es distinto y tiene su propio
  componente, porque el diseno de cada pagina cuenta otra cosa.

  Las fotos de esta seccion no venian en la entrega: donde falta `imagen` la
  pagina pinta un marcador que describe la foto que corresponde.
*/

/** Boton de la cabecera. Sin `to` abre el video de presentacion. */
export interface AccionCabecera {
  label: string;
  to?: string;
}

export interface CabeceraEmpresa {
  slug: string;
  miga: string;
  /** Primera parte del titular, en blanco. */
  titulo: string;
  /** Segunda parte, en naranja. */
  tituloAccent: string;
  subtitulo: string;
  intro: string;
  /** El acento continua la misma palabra, sin espacio (Contáct + anos). */
  pegado?: boolean;
  /** Frase corta a la derecha de la foto. */
  lema: string;
  /** Segunda linea del lema, en letra menuda. */
  lemaNota?: string;
  /** Datos sueltos bajo la entradilla. Solo algunas paginas los llevan. */
  bullets?: { icon: IconName; label: string }[];
  acciones?: AccionCabecera[];
  imagen?: string;
  imagenAlt: string;
}

export interface CierreEmpresa {
  eyebrow?: string;
  titulo: string;
  tituloAccent?: string;
  texto: string;
  cta: string;
  /** Adonde lleva el boton: modal de demo, otra pagina o WhatsApp. */
  ctaDestino: 'demo' | 'contacto' | 'trabaja';
  items?: { icon: IconName; label: string }[];
  /** Frase suelta a la derecha, cuando la banda no lleva lista de items. */
  lema?: string[];
  imagen?: string;
  imagenAlt: string;
}

export interface PaginaEmpresa {
  cabecera: CabeceraEmpresa;
  cierre: CierreEmpresa;
}

/* ---------------- Acerca de nosotros ---------------- */

export const ACERCA = {
  cabecera: {
    slug: 'acerca-de-nosotros',
    miga: 'Acerca de nosotros',
    titulo: 'Acerca de',
    tituloAccent: 'nosotros',
    subtitulo: 'Tecnología dominicana que conecta la salud',
    intro:
      'En LINKDICOM desarrollamos soluciones tecnológicas que ayudan a instituciones de salud a trabajar de forma más eficiente, segura y humana, mejorando la experiencia de pacientes, profesionales y administradores.',
    acciones: [
      { label: 'Conoce nuestra historia', to: '/empresa/nuestra-historia' },
      { label: 'Mira nuestro video' },
    ],
    bullets: [
      { icon: 'chart' as IconName, label: 'Innovación desde RD' },
      { icon: 'globe' as IconName, label: 'Conectamos la región' },
      { icon: 'users' as IconName, label: 'Tecnología con propósito' },
      { icon: 'heart' as IconName, label: 'Salud más humana' },
    ],
    lema: 'Tecnología con identidad, para un mejor futuro en salud',
    lemaNota: 'Desde República Dominicana para Latinoamérica y para el mundo.',
    imagen: '/img/empresa/hero-acerca.webp',
    imagenAlt: 'Especialista revisando estudios de imagen junto a la bandera dominicana',
  },

  historiaTitulo: 'Nuestra',
  historiaTituloAccent: 'historia',
  historiaTexto: 'De un proyecto personal a una empresa con impacto internacional',
  historia: [
    'La historia de LINKDICOM comienza antes de su constitución formal como empresa. A finales del año 2009, se desarrolló el primer sistema PACS dominicano, llamado ISL/1 (Interfaz Server Lineal), un hito que marcó el inicio de nuestra pasión por la tecnología aplicada a la salud en la República Dominicana.',
    'Con la experiencia adquirida, la confianza de nuestros primeros clientes y una visión clara de futuro, constituimos legalmente LINKDICOM, SRL el 11 de noviembre del 2016, con el propósito de continuar desarrollando soluciones innovadoras, ahora con una estructura empresarial sólida.',
    'Desde entonces, hemos evolucionado constantemente, ampliando nuestro portafolio de soluciones y acompañando a hospitales, centros de diagnóstico, laboratorios y clínicas en todo el país y la región.',
  ],
  historiaCta: 'Conoce más sobre nuestra historia',
  historiaCtaDestino: '/empresa/nuestra-historia',

  hitosTitulo: 'Hitos',
  hitosTituloAccent: 'importantes',
  hitosTexto: 'Momentos que nos han definido y nos impulsan a seguir.',
  hitos: [
    {
      anio: '2000',
      texto: 'Inicio de la trayectoria profesional de nuestro fundador Eduardo Batista Alcántara como técnico de imágenes médicas.',
    },
    { anio: '2008 – 2010', texto: 'Desarrollo del ISL/1 (Interfaz Server Lineal).' },
    { anio: '2011', texto: 'Nace LINKDICOM y comienzan las primeras alianzas internacionales.' },
    { anio: '2013', texto: 'Oviyam se incorpora como visor del ISL/1.' },
    { anio: '2014', texto: 'Integración con Orthanc y nuevas capacidades DICOM.' },
    {
      anio: '2019 – 2021',
      texto: 'Integración de funcionalidades como firma digital, portal de pacientes y resultados en línea.',
    },
    { anio: '2020 – 2021', texto: 'Mayores aportes a Oviyam, liberados a la comunidad.' },
    { anio: '2022 – Hoy', texto: 'Nuestro propio Core tecnológico. RadiologoX PACS/RIS.' },
  ],

  cifras: [
    { icon: 'building' as IconName, color: '#2563eb', valor: '+200', label: 'Instituciones en nuestras soluciones' },
    { icon: 'users' as IconName, color: '#f97316', valor: '+2,300', label: 'Usuarios activos' },
    { icon: 'calendar' as IconName, color: '#0f8a5f', valor: '+10 Años', label: 'de experiencia' },
    { icon: 'chart' as IconName, color: '#6d5bd0', valor: '+1 Millón', label: 'de pacientes procesados' },
    // sin cifra: es presencia, no un numero que podamos afirmar
    { icon: 'globe' as IconName, color: '#0ea5e9', label: 'Presencia en varios países de la región y el mundo' },
  ],

  esenciaTitulo: 'Nuestra',
  esenciaTituloAccent: 'esencia',
  esenciaTexto: 'Los principios que nos guían cada día y que nos inspiran a seguir creando un mejor futuro para la salud.',
  mision:
    'Desarrollar e implementar soluciones tecnológicas innovadoras que mejoren la eficiencia, la calidad y la accesibilidad de los servicios de salud.',
  vision:
    'Ser la empresa líder en soluciones tecnológicas para la salud en Latinoamérica, reconocida por nuestra innovación, compromiso y talento humano.',
  valores: ['Innovación', 'Compromiso', 'Calidad', 'Integridad', 'Trabajo en equipo', 'Orientación al cliente', 'Impacto social'],

  fundadorTitulo: 'Mensaje de',
  fundadorTituloAccent: 'nuestro fundador',
  fundadorCita:
    'Creemos en el poder de la tecnología para transformar realmente la salud. En República Dominicana y en toda Latinoamérica, podemos desarrollar soluciones con calidad mundial que generen un impacto positivo en la vida de las personas, fortaleciendo sistemas de salud más eficientes, accesibles y humanos.',
  fundadorNombre: 'Eduardo Batista Alcántara',
  fundadorCargo: 'Fundador, LINKDICOM',
  fundadorImagen: '/img/empresa/fundador-banderas.webp',
  fundadorImagenAlt: 'Banderas de países de Latinoamérica ondeando frente a una ciudad al amanecer',
  fundadorLema: ['Conectando', 'Latinoamérica', 'por una salud', 'sin fronteras'],
  fundadorLemaNota: ['Más tecnología.', 'Más oportunidades.', 'Más salud para nuestra gente.'],

  cierre: {
    titulo: 'Seguimos construyendo un futuro',
    tituloAccent: 'más saludable',
    texto:
      'Innovación, talento y compromiso desde República Dominicana para Latinoamérica y el mundo.',
    cta: 'Conversemos sobre nuestro proyecto',
    ctaDestino: 'contacto' as const,
    lema: ['Latinoamérica', 'conectada', 'por una salud', 'mejor'],
    imagen: '/img/empresa/cierre-acerca.webp',
    imagenAlt: 'Ciudad al atardecer con el mapa de América conectado por una red de luz',
  },
};

/* ---------------- Nuestros valores ---------------- */

export const VALORES = {
  cabecera: {
    slug: 'nuestros-valores',
    miga: 'Nuestros valores',
    titulo: 'Nuestros',
    tituloAccent: 'valores',
    subtitulo: 'Principios que nos mueven cada día',
    intro:
      'En LINKDICOM, nuestros valores son la base de todo lo que hacemos. Guían nuestras decisiones, fortalecen nuestra cultura y nos inspiran a seguir conectando la salud con un mejor futuro.',
    lema: 'Más que tecnología, personas',
    // la carpeta de Valores no trae portada propia: su maqueta usa el edificio
    imagen: '/img/empresa/hero-valores.webp',
    imagenAlt: 'Edificio de LINKDICOM iluminado al anochecer',
  },

  tarjetas: [
    {
      titulo: 'Innovación',
      texto:
        'Buscamos constantemente nuevas formas de mejorar la salud a través de la tecnología, creando soluciones que generen un impacto real.',
      icon: 'lightbulb' as IconName,
      color: '#f97316',
      imagen: '/img/productos/radiologox/panel.webp',
      imagenAlt: 'Especialista revisando estudios de imagen en varias pantallas',
    },
    {
      titulo: 'Compromiso',
      texto:
        'Nos dedicamos con pasión a brindar soluciones confiables y un servicio excepcional, cumpliendo con nuestros clientes, colaboradores y la sociedad.',
      icon: 'users' as IconName,
      color: '#2563eb',
      imagen: '/img/empresa/valor-compromiso.webp',
      imagenAlt: 'Manos de un equipo unidas en señal de compromiso',
    },
    {
      titulo: 'Calidad',
      texto: 'Trabajamos con altos estándares de calidad, asegurando soluciones seguras, eficientes y confiables para el sector salud.',
      icon: 'shield' as IconName,
      color: '#0f8a5f',
      imagen: '/img/empresa/valor-calidad.webp',
      imagenAlt: 'Comprobación de calidad sobre una interfaz digital',
    },
    {
      titulo: 'Responsabilidad social',
      texto:
        'Creemos en el poder de la tecnología para generar un impacto positivo en las comunidades, apoyando iniciativas que mejoren la calidad de vida.',
      icon: 'heart' as IconName,
      color: '#ef4444',
      imagen: '/img/empresa/valor-social.webp',
      imagenAlt: 'Entrega de ayuda a una familia de la comunidad',
    },
    {
      titulo: 'Trabajo en equipo',
      texto: 'Valoramos la colaboración, el respeto y la diversidad de ideas, porque sabemos que juntos alcanzamos grandes resultados.',
      icon: 'handshake' as IconName,
      color: '#6d5bd0',
      imagen: '/img/empresa/valor-equipo.webp',
      imagenAlt: 'Equipo de LINKDICOM trabajando junto a un portátil',
    },
    {
      titulo: 'Orientación al cliente',
      texto:
        'Ponemos a nuestros clientes en el centro de nuestras decisiones, escuchando sus necesidades y acompañándolos en cada paso.',
      icon: 'headset' as IconName,
      color: '#2563eb',
      imagen: '/img/empresa/valor-cliente.webp',
      imagenAlt: 'Especialista de soporte atendiendo con auriculares',
    },
  ],

  definenTitulo: 'Estos valores',
  definenTituloAccent: 'nos definen',
  definenTexto:
    'Más que palabras, son principios que vivimos cada día y que nos impulsan a seguir construyendo soluciones tecnológicas al servicio de la salud en República Dominicana y la región.',
  definenCta: 'Conoce más sobre LINKDICOM',
  cifras: [
    { icon: 'users' as IconName, color: '#2563eb', valor: '+10 Años', label: 'de experiencia' },
    { icon: 'globe' as IconName, color: '#2563eb', valor: '+200', label: 'Instituciones confían en nosotros' },
    { icon: 'handshake' as IconName, color: '#2563eb', valor: '+2,300', label: 'Usuarios activos' },
    { icon: 'chart' as IconName, color: '#6d5bd0', valor: 'Un mejor futuro', label: 'para la salud' },
  ],

  cierre: {
    eyebrow: 'Juntos podemos lograr más',
    titulo: 'Únete a este',
    tituloAccent: 'propósito',
    texto: 'Nuestros valores nos inspiran a seguir conectando la salud con un mejor futuro. Sé parte de esta visión.',
    cta: 'Trabaja con nosotros',
    ctaDestino: 'trabaja' as const,
    imagen: '/img/empresa/cierre-valores.webp',
    imagenAlt: 'Colaborador de LINKDICOM frente a su puesto de trabajo',
  },
};

/* ---------------- Contáctanos ---------------- */

export const CONTACTO_PAGINA = {
  cabecera: {
    slug: 'contacto',
    miga: 'Contacto',
    titulo: 'Contáct',
    tituloAccent: 'anos',
    pegado: true,
    subtitulo: 'Hablemos, estamos para ayudarte',
    intro:
      'En LINKDICOM creemos en la cercanía, la escucha activa y en construir relaciones duraderas. Completa el formulario y uno de nuestros especialistas se pondrá en contacto contigo a la brevedad.',
    lema: 'Tecnología para un mundo más saludable',
    bullets: [
      { icon: 'clock' as IconName, label: 'Respuesta en menos de 24h' },
      { icon: 'users' as IconName, label: 'Atención personalizada' },
      { icon: 'shield' as IconName, label: 'Comprometidos con soluciones reales' },
    ],
    imagen: '/img/empresa/hero-contacto.webp',
    imagenAlt: 'Sede de LINKDICOM iluminada al anochecer',
  },

  motivos: [
    { icon: 'handshake' as IconName, titulo: 'Quiero ser representante de LINKDICOM', texto: 'Me interesa representar la marca en mi región.' },
    { icon: 'building' as IconName, titulo: 'Quiero ser revendedor de LINKDICOM', texto: 'Me interesa comercializar nuestros productos y soluciones.' },
    { icon: 'monitor' as IconName, titulo: 'Solicitar una demostración', texto: 'Quiero conocer más sobre nuestras soluciones.' },
    { icon: 'settings' as IconName, titulo: 'Soporte técnico', texto: 'Necesito ayuda con un producto o servicio.' },
    { icon: 'headset' as IconName, titulo: 'Hacer una pregunta', texto: 'Tengo algunas dudas y me gustaría conversar.' },
    { icon: 'lightbulb' as IconName, titulo: 'Sugerencia', texto: 'Quiero compartir una idea o sugerencia.' },
    { icon: 'file-text' as IconName, titulo: 'Otro', texto: 'Mi consulta no está en la lista.' },
  ],

  horario: ['Lunes - Viernes: 8:00 a.m. - 6:00 p.m.', 'Sábados: 8:00 a.m. - 1:00 p.m.'],
  mapa: 'https://www.google.com/maps/search/?api=1&query=LINKDICOM+Santo+Domingo+Este',
  mapaAlt: 'Mapa con la ubicación de las oficinas de LINKDICOM en Alma Rosa I',

  cierre: {
    titulo: 'Más que tecnología,',
    tituloAccent: 'personas',
    texto:
      'En LINKDICOM cada conversación cuenta. Estamos aquí para escucharte, asesorarte y construir juntos el próximo paso.',
    cta: 'Solicitar una demo',
    ctaDestino: 'demo' as const,
    items: [
      { icon: 'settings' as IconName, label: 'Soluciones a tu medida' },
      { icon: 'users' as IconName, label: 'Equipo especializado' },
      { icon: 'zap' as IconName, label: 'Respuesta ágil' },
      { icon: 'heart' as IconName, label: 'Relación a largo plazo' },
    ],
    imagen: '/img/empresa/cierre-contacto.webp',
    imagenAlt: 'Colaborador de LINKDICOM atendiendo desde la oficina',
  },
};
