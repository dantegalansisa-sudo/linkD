import type { IconName } from '../components/ui/Icon';

/** Programa de asistencia social Virginia Toca. */
export const OBRA_SOCIAL = {
  cabecera: {
    slug: 'obra-social',
    miga: 'Obra Social',
    eyebrow: 'Programa de asistencia social',
    titulo: 'Virginia',
    tituloAccent: 'Toca',
    subtitulo: 'Solidaridad que deja huella',
    intro:
      'Una iniciativa de LINKDICOM en honor a la Sra. Virginia Alcántara Rivera, ejemplo de generosidad, humanidad y servicio a los demás.',
    lema: '«Ayudar también es conectar»',
    imagenAlt: 'Sede de LINKDICOM iluminada al anochecer',
  },

  origenTitulo: 'El origen de',
  origenTituloAccent: 'esta iniciativa',
  origen: [
    'El Programa de Asistencia Social Virginia Toca nace en honor a la Sra. Virginia Alcántara Rivera, madre de los hermanos fundadores de LINKDICOM, Eduardo Batista Alcántara y Esmirna Batista Alcántara.',
    'La Sra. Virginia fue una persona muy reconocida entre su familia y vecinos por ser siempre dada a ayudar a los más necesitados, aun cuando sus orígenes eran humildes y muchas veces enfrentaban serias precariedades. Ella siempre buscaba la forma de compartir lo poco que tenía con quienes más lo necesitaban.',
    'Hoy, sus hijos en LINKDICOM establecen este programa en su nombre, en memoria de una mujer que dio lo mejor de sí misma, aun cuando su situación personal era adversa.',
  ],
  retratoAlt: 'Retrato de la Sra. Virginia Alcántara Rivera',

  compromisoTitulo: 'Nuestro',
  compromisoTituloAccent: 'compromiso',
  compromisoTexto:
    'En LINKDICOM creemos que la tecnología también puede ser un puente para un mundo más solidario. A través del Programa Virginia Toca, reafirmamos nuestro compromiso con las comunidades, apoyando causas sociales y llevando esperanza a quienes más lo necesitan.',
  compromisoItems: [
    { icon: 'heart' as IconName, label: 'Solidaridad en acción' },
    { icon: 'users' as IconName, label: 'Comunidades más fuertes' },
    { icon: 'sparkles' as IconName, label: 'Un futuro más humano' },
  ],

  actividadesTitulo: 'Próximas',
  actividadesTituloAccent: 'actividades',
  actividades: [
    {
      dia: 'SÁB',
      numero: '28',
      mes: 'SEP 2026',
      titulo: 'Entrega de útiles escolares',
      lugar: 'Escuela Básica La Esperanza, Santo Domingo Este',
      texto: 'Apoyo con mochilas, cuadernos y materiales escolares para niños de escasos recursos.',
      imagenAlt: 'Mochilas y útiles escolares preparados para la entrega',
    },
  ],

  apoyoTitulo: 'Cómo',
  apoyoTituloAccent: 'puedes apoyar',
  apoyoTexto:
    'Este programa está abierto a que nuestros clientes, aliados y colaboradores realicen aportes, siempre y cuando no sean monetarios. Solo aceptamos ayudas materiales como:',
  apoyoTipos: [
    { icon: 'heart' as IconName, label: 'Alimentos' },
    { icon: 'graduation' as IconName, label: 'Artículos escolares' },
    { icon: 'box' as IconName, label: 'Electrodomésticos' },
    { icon: 'home' as IconName, label: 'Madera' },
    { icon: 'layers' as IconName, label: 'Cemento' },
    { icon: 'gift' as IconName, label: 'Otros artículos' },
  ],
  apoyoAviso: 'No aceptamos dinero en efectivo.',
  apoyoAvisoNota: 'Esta medida garantiza la transparencia del programa.',

  eventosTitulo: 'Últimos',
  eventosTituloAccent: 'eventos de ayuda',
  eventos: [
    { fecha: '12 JUL', anio: '2026', titulo: 'Entrega de alimentos', lugar: 'Capotillo, Santo Domingo', imagenAlt: 'Entrega de una caja de alimentos a una familia' },
    { fecha: '03 MAY', anio: '2026', titulo: 'Útiles escolares 2026', lugar: 'San Juan de la Maguana', imagenAlt: 'Niños con sus mochilas nuevas' },
    { fecha: '18 ABR', anio: '2026', titulo: 'Donación de electrodomésticos', lugar: 'Bajos de Haina', imagenAlt: 'Entrega de una nevera a una familia' },
    { fecha: '22 FEB', anio: '2026', titulo: 'Apoyo con materiales de construcción', lugar: 'Monte Plata', imagenAlt: 'Equipo entregando bloques de construcción' },
    { fecha: '15 ENE', anio: '2026', titulo: 'Jornada de alimentos', lugar: 'Los Alcarrizos', imagenAlt: 'Voluntarios con sacos de alimentos' },
  ],

  cifras: [
    { icon: 'users' as IconName, color: '#2563eb', valor: '+50', label: 'Familias beneficiadas' },
    { icon: 'graduation' as IconName, color: '#2563eb', valor: '+1,200', label: 'Útiles escolares entregados' },
    { icon: 'heart' as IconName, color: '#2563eb', valor: '+3,500', label: 'Libras de alimentos donados' },
    { icon: 'home' as IconName, color: '#2563eb', valor: '+25', label: 'Comunidades impactadas' },
  ],

  citaFinal: 'Dar, aunque sea poco, siempre será mucho para alguien que lo necesita.',
  citaAutor: 'Sra. Virginia Alcántara Rivera',
  citaNota: 'En memoria de su legado',

  cierre: {
    eyebrow: 'Sé parte del cambio',
    titulo: 'Tu apoyo también',
    tituloAccent: 'transforma vidas',
    texto:
      'Si deseas colaborar con el Programa Virginia Toca, contáctanos y coordinaremos la recepción de tus aportes materiales.',
    cta: 'Quiero colaborar',
    ctaDestino: 'contacto' as const,
    imagenAlt: 'Manos entregando una caja de donación de LINKDICOM',
  },
};
