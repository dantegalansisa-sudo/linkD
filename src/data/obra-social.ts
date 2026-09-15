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
    imagen: '/img/empresa/hero-obra-social.webp',
    imagenAlt: 'Sede de LINKDICOM iluminada al anochecer',
  },

  origenTitulo: 'El origen de',
  origenTituloAccent: 'esta iniciativa',
  origen: [
    'El Programa de Asistencia Social Virginia Toca nace en honor a la Sra. Virginia Alcántara Rivera, madre de los hermanos fundadores de LINKDICOM, Eduardo Batista Alcántara y Esmirna Batista Alcántara.',
    'La Sra. Virginia fue una persona muy reconocida entre su familia y vecinos por ser siempre dada a ayudar a los más necesitados, aun cuando sus orígenes eran humildes y muchas veces enfrentaban serias precariedades. Ella siempre buscaba la forma de compartir lo poco que tenía con quienes más lo necesitaban.',
    'Hoy, sus hijos en LINKDICOM establecen este programa en su nombre, en memoria de una mujer que dio lo mejor de sí misma, aun cuando su situación personal era adversa.',
  ],
  retrato: '/img/empresa/virginia.webp',
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
      slug: 'cena-navidena-san-juan-2026',
      fechaISO: '2026-12-24',
      titulo: 'Entrega de cenas navideñas',
      lugar: 'Sectores vulnerables, San Juan de la Maguana',
      texto: 'Apoyo a familias de escasos recursos mediante la entrega de cenas navideñas durante Nochebuena.',
      imagen: '/img/obra-social/proximo-san-juan.webp',
      imagenAlt: 'Caja de alimentos del Plan de Asistencia Social Virginia Toca frente al arco de San Juan de la Maguana',
      cta: 'Quiero aportar a este evento',
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
    imagen: '/img/empresa/cierre-obra-social.webp',
    imagenAlt: 'Manos entregando una caja de donación de LINKDICOM',
  },
};
