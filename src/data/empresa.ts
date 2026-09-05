import type { IconName } from '../components/ui/Icon';

/*
  Seccion Empresa: seis paginas.

  Las seis comparten la cabecera oscura y la banda de cierre, asi que esas dos
  piezas viven en `Marco`. El cuerpo de cada una es distinto y tiene su propio
  componente, porque el diseno de cada pagina cuenta otra cosa.

  Las fotos de esta seccion no venian en la entrega: donde falta `imagen` la
  pagina pinta un marcador que describe la foto que corresponde.
*/

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
  /** Frase vertical a la derecha de la foto. */
  lema: string;
  /** Datos sueltos bajo la entradilla. Solo algunas paginas los llevan. */
  bullets?: { icon: IconName; label: string }[];
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
    lema: 'Innovación desde República Dominicana',
    imagenAlt: 'Bandera de la República Dominicana ondeando al atardecer',
  },

  historiaTitulo: 'Nuestra',
  historiaTituloAccent: 'historia',
  historia: [
    'La historia de LINKDICOM comienza mucho antes de su constitución formal. A finales del año 2009 desarrollamos el primer sistema PACS dominicano, llamado ISL/1 (Interfaz Server Lineal), un hito que marcó el inicio de nuestra pasión por la tecnología aplicada a la salud en la República Dominicana.',
    'Con la experiencia adquirida, la confianza de nuestros primeros clientes y una visión clara de futuro, constituimos legalmente LINKDICOM, SRL el 11 de noviembre del 2016, con el propósito de continuar desarrollando soluciones innovadoras, ahora con una estructura empresarial sólida.',
    'Desde entonces, hemos evolucionado constantemente, ampliando nuestro portafolio de soluciones y acompañando a hospitales, centros de diagnóstico, laboratorios y clínicas en todo el país y la región.',
  ],

  hitosTitulo: 'Hitos',
  hitosTituloAccent: 'importantes',
  hitosTexto: 'Momentos que nos han definido y nos impulsan a seguir.',
  hitos: [
    { anio: '2009', texto: 'Desarrollo del primer sistema PACS dominicano ISL/1 (Interfaz Server Lineal).' },
    { anio: '2016', nota: '11 de noviembre', texto: 'Constitución de LINKDICOM, SRL en la República Dominicana.' },
    { anio: '2020', texto: 'Inicio de operaciones comerciales desde nuestra oficina en Santo Domingo.' },
    {
      anio: '2021 – 2023',
      texto: 'Expansión de nuestras soluciones a hospitales, centros de diagnóstico, laboratorios y clínicas en todo el país.',
    },
    {
      anio: '2024 – 2026',
      texto:
        'Consolidación de nuestros ecosistemas de salud y soluciones empresariales, con presencia en la región y una comunidad creciente de instituciones que confían en nosotros.',
    },
  ],

  cifras: [
    { icon: 'building' as IconName, color: '#2563eb', valor: '+200', label: 'Instituciones en Latinoamérica confían en nuestras soluciones' },
    { icon: 'users' as IconName, color: '#f97316', valor: '+2,300', label: 'Usuarios activos' },
    { icon: 'calendar' as IconName, color: '#0f8a5f', valor: '+10 Años', label: 'de experiencia' },
    { icon: 'chart' as IconName, color: '#6d5bd0', valor: '+1 Millón', label: 'de pacientes procesados' },
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
    'Creemos en el poder de la tecnología para transformar realmente la salud. LINKDICOM nació del sueño de aportar soluciones hechas en República Dominicana, con calidad mundial, que generen un impacto positivo en la vida de las personas.',
  fundadorNombre: 'Eduardo Batista Alcántara',
  fundadorCargo: 'Fundador, LINKDICOM',
  fundadorImagenAlt: 'Recepción de las oficinas de LINKDICOM en Santo Domingo',
  fundadorLugar: 'Santo Domingo, República Dominicana',
  fundadorLugarNota: 'Desde aquí seguimos conectando un mejor futuro para la salud',

  cierre: {
    titulo: 'Tecnología con identidad,',
    tituloAccent: 'para un mejor futuro en salud',
    texto:
      'Cada solución que desarrollamos nace de la misma convicción: que la tecnología hecha en casa puede mejorar la salud de miles de personas.',
    cta: 'Hablemos de tu proyecto',
    ctaDestino: 'demo' as const,
    items: [
      { icon: 'heart' as IconName, label: 'Personas primero' },
      { icon: 'shield' as IconName, label: 'Calidad mundial' },
      { icon: 'globe' as IconName, label: 'Hecho en República Dominicana' },
    ],
    imagenAlt: 'Equipo de LINKDICOM trabajando en la oficina',
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
    imagenAlt: 'Sede de LINKDICOM iluminada al anochecer',
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
      imagenAlt: 'Manos de un equipo unidas en señal de compromiso',
    },
    {
      titulo: 'Calidad',
      texto: 'Trabajamos con altos estándares de calidad, asegurando soluciones seguras, eficientes y confiables para el sector salud.',
      icon: 'shield' as IconName,
      color: '#0f8a5f',
      imagenAlt: 'Comprobación de calidad sobre una interfaz digital',
    },
    {
      titulo: 'Responsabilidad social',
      texto:
        'Creemos en el poder de la tecnología para generar un impacto positivo en las comunidades, apoyando iniciativas que mejoren la calidad de vida.',
      icon: 'heart' as IconName,
      color: '#ef4444',
      imagenAlt: 'Manos sosteniendo una planta que crece en la tierra',
    },
    {
      titulo: 'Trabajo en equipo',
      texto: 'Valoramos la colaboración, el respeto y la diversidad de ideas, porque sabemos que juntos alcanzamos grandes resultados.',
      icon: 'handshake' as IconName,
      color: '#6d5bd0',
      imagenAlt: 'Equipo de LINKDICOM trabajando junto a un portátil',
    },
    {
      titulo: 'Orientación al cliente',
      texto:
        'Ponemos a nuestros clientes en el centro de nuestras decisiones, escuchando sus necesidades y acompañándolos en cada paso.',
      icon: 'headset' as IconName,
      color: '#2563eb',
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
    imagenAlt: 'Colaborador de LINKDICOM de espaldas frente a su puesto de trabajo',
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
    imagenAlt: 'Colaborador de LINKDICOM atendiendo desde la oficina',
  },
};
