import type { IconName } from '../components/ui/Icon';

/** Trabaja con nosotros: vacantes, proceso de seleccion y envio de CV. */
export const TRABAJA = {
  cabecera: {
    slug: 'trabaja-con-nosotros',
    miga: 'Trabaja con nosotros',
    titulo: 'Trabaja con',
    tituloAccent: 'nosotros',
    subtitulo: 'Tu talento también conecta vidas',
    intro:
      'En LINKDICOM creemos en el poder de las personas para transformar la salud. Si compartes nuestra pasión por la tecnología, la innovación y el servicio, te invitamos a ser parte de nuestro equipo.',
    lema: 'Tecnología, gente y propósito',
    bullets: [
      { icon: 'users' as IconName, label: 'Un equipo apasionado' },
      { icon: 'lightbulb' as IconName, label: 'Oportunidades de crecimiento' },
      { icon: 'heart' as IconName, label: 'Impacto real en la sociedad' },
    ],
    imagenAlt: 'Equipo de LINKDICOM trabajando junto en la oficina',
  },

  razones: [
    { icon: 'chart' as IconName, titulo: 'Desarrolla tu potencial', texto: 'Formación continua y nuevos desafíos' },
    { icon: 'users' as IconName, titulo: 'Ambiente colaborativo', texto: 'Trabajamos en equipo y nos apoyamos' },
    { icon: 'star' as IconName, titulo: 'Sé parte del cambio', texto: 'Tu trabajo impacta en la salud de miles de personas' },
    { icon: 'shield' as IconName, titulo: 'Estabilidad y bienestar', texto: 'Un entorno de trabajo seguro y profesional' },
  ],

  vacantesTitulo: 'Oportunidades',
  vacantesTituloAccent: 'disponibles',
  vacantesTexto: 'Explora nuestras vacantes y encuentra la oportunidad ideal para ti.',
  vacantes: [
    { icon: 'code' as IconName, puesto: 'Desarrollador de Software', area: 'Tecnología', lugar: 'Santo Domingo', jornada: 'Tiempo completo' },
    { icon: 'headset' as IconName, puesto: 'Soporte Técnico', area: 'Operaciones', lugar: 'Santo Domingo / Regional', jornada: 'Tiempo completo' },
    { icon: 'settings' as IconName, puesto: 'Especialista en Implementaciones', area: 'Proyectos', lugar: 'Santo Domingo', jornada: 'Tiempo completo' },
    { icon: 'chart' as IconName, puesto: 'Ejecutivo(a) de Ventas', area: 'Comercial', lugar: 'Santo Domingo', jornada: 'Tiempo completo' },
    { icon: 'send' as IconName, puesto: 'Encargado(a) de Comunicaciones', area: 'Marketing', lugar: 'Santo Domingo', jornada: 'Tiempo completo' },
  ],

  procesoTitulo: 'Nuestro',
  procesoTituloAccent: 'proceso de selección',
  procesoTexto: 'Un proceso transparente y orientado al talento.',
  proceso: [
    { icon: 'file-text' as IconName, label: 'Recepción de tu CV' },
    { icon: 'search' as IconName, label: 'Revisión del perfil' },
    { icon: 'users' as IconName, label: 'Entrevista con el equipo' },
    { icon: 'check-circle' as IconName, label: 'Resultados y seguimiento' },
  ],

  formularioTitulo: 'Envía',
  formularioTituloAccent: 'tu solicitud',
  formularioTexto:
    'Completa el formulario y adjunta tu CV en formato PDF. Nuestro equipo de Talento Humano revisará tu información y se pondrá en contacto contigo si tu perfil se ajusta a nuestras necesidades.',
  provincias: [
    'Distrito Nacional',
    'Santo Domingo',
    'Santiago',
    'La Vega',
    'San Cristóbal',
    'Puerto Plata',
    'San Pedro de Macorís',
    'La Romana',
    'Otra provincia',
    'Fuera del país',
  ],

  cierre: {
    titulo: 'Aquí tu talento',
    tituloAccent: 'tiene un propósito',
    texto:
      'Sé parte de una empresa dominicana que desarrolla soluciones tecnológicas para una salud más accesible, eficiente y humana.',
    cta: 'Quiero unirme al equipo',
    ctaDestino: 'contacto' as const,
    items: [
      { icon: 'heart' as IconName, label: 'Personas primero' },
      { icon: 'chart' as IconName, label: 'Crecimiento profesional' },
      { icon: 'settings' as IconName, label: 'Proyectos desafiantes' },
      { icon: 'globe' as IconName, label: 'Impacto en la salud' },
      { icon: 'trophy' as IconName, label: 'Reconocimiento al talento' },
    ],
    imagenAlt: 'Sala de reuniones de LINKDICOM con el logotipo en la pared',
  },
};
