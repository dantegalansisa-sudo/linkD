/*
  Noticias.

  Las cuatro noticias reales que entrego el cliente, con su texto tal cual.
  Cada una es una pagina (/noticias/:slug); la portada (/noticias) las lista y
  destaca la mas reciente. Van ordenadas de la mas nueva a la mas antigua.
*/

import type { Bloque, Noticia } from '../contenido/tipos';

/** Nombres anteriores, que siguen usando algunas paginas. */
export type BloqueNoticia = Bloque;
export type { Noticia };

export const CATEGORIAS_NOTICIAS: Record<string, string> = {
  'Responsabilidad Social': '#0f8a5f',
  Implementaciones: '#2563eb',
  Innovación: '#6d5bd0',
};

export const NOTICIAS: Noticia[] = [
  /* ---------------------------------------------------------------- */
  {
    slug: 'la-esquinita-de-yaguate-campeon',
    titulo: 'LINKDICOM patrocina al equipo de sóftbol La Esquinita de Yaguate, campeón del torneo',
    subtitulo:
      'El equipo conquistó la copa de la victoria en una jornada deportiva que reunió a jugadores, dirigentes y colaboradores en torno al deporte y la comunidad.',
    fecha: '20 de diciembre de 2025',
    fechaISO: '2025-12-20',
    categoria: 'Responsabilidad Social',
    color: '#0f8a5f',
    lectura: '3 min de lectura',
    imagen: '/img/noticias/softball-equipo.webp',
    imagenAlt: 'Eduardo Batista Alcántara junto a los jugadores y dirigentes de La Esquinita de Yaguate',
    pie: 'Eduardo Batista Alcántara, CEO de LINKDICOM, junto a los jugadores y dirigentes de La Esquinita de Yaguate durante la celebración de la conquista de la copa.',
    resumen:
      'LINKDICOM respaldó al equipo de sóftbol La Esquinita de Yaguate, que se alzó con la copa del torneo celebrado en el Play de Pajarito.',
    cuerpo: [
      { tipo: 'h2', texto: 'LINKDICOM apuesta por el deporte y las comunidades' },
      {
        tipo: 'p',
        texto:
          'Yaguate, San Cristóbal. — LINKDICOM reafirmó su compromiso con el desarrollo de iniciativas deportivas y comunitarias al participar como patrocinador del equipo de sóftbol La Esquinita de Yaguate, que se alzó con la copa de la victoria en el torneo celebrado el 20 de diciembre en el Play de Pajarito, en Yaguate.',
      },
      {
        tipo: 'p',
        texto:
          'La jornada estuvo marcada por la emoción de los jugadores y seguidores del equipo, quienes celebraron el resultado de una competencia que reunió a distintos conjuntos y promovió el sóftbol como espacio de integración y sana convivencia.',
      },
      {
        tipo: 'p',
        texto:
          'Para LINKDICOM, respaldar este tipo de iniciativas representa una forma de contribuir al fortalecimiento de actividades que promueven el deporte, la disciplina, el trabajo en equipo y la participación comunitaria.',
      },
      { tipo: 'h2', texto: 'Una victoria para celebrar juntos' },
      {
        tipo: 'p',
        texto:
          'La conquista del campeonato tuvo un significado especial para los integrantes de La Esquinita de Yaguate, quienes levantaron la copa como reconocimiento al esfuerzo y dedicación demostrados durante el torneo.',
      },
      {
        tipo: 'foto',
        src: '/img/noticias/softball-copa.webp',
        alt: 'Omar Ramírez levanta la copa del torneo',
        pie: 'Omar Ramírez, dirigente de La Esquinita de Yaguate, levanta la copa de la victoria.',
      },
      {
        tipo: 'p',
        texto:
          'En este momento de celebración estuvo presente Eduardo Batista Alcántara, CEO de LINKDICOM, quien acompañó a los jugadores y dirigentes y compartió directamente con el equipo la alegría de alcanzar el campeonato.',
      },
      {
        tipo: 'p',
        texto:
          'La presencia del CEO de LINKDICOM junto a los jugadores refleja el espíritu con el que la empresa asume su participación en iniciativas comunitarias: estar presente, acompañar y celebrar junto a quienes hacen posible cada logro.',
      },
      { tipo: 'h2', texto: 'Impulsando el sóftbol en Yaguate' },
      {
        tipo: 'p',
        texto:
          'El torneo forma parte de los esfuerzos que durante los últimos años han realizado jóvenes dirigentes y colaboradores para fortalecer la práctica del sóftbol en Yaguate y recuperar espacios de participación deportiva en la comunidad.',
      },
      {
        tipo: 'p',
        texto:
          'Entre quienes han trabajado en el impulso de estas iniciativas se encuentran Omar Ramírez y Deilin Florian, dirigentes vinculados a la organización y promoción de actividades deportivas en el municipio.',
      },
      {
        tipo: 'p',
        texto:
          'Estos esfuerzos han permitido crear espacios para que jugadores de diferentes sectores puedan participar en competencias organizadas, al tiempo que se fomenta la integración de familias y comunidades alrededor del deporte.',
      },
      {
        tipo: 'foto',
        src: '/img/noticias/softball-marca.webp',
        alt: 'El equipo La Esquinita de Yaguate de espaldas, con la marca LINKDICOM en sus uniformes',
        pie: 'El equipo La Esquinita de Yaguate, con la marca LINKDICOM en sus uniformes.',
      },
      { tipo: 'h2', texto: 'El deporte como punto de encuentro' },
      { tipo: 'p', texto: 'El sóftbol representa mucho más que una competencia.' },
      {
        tipo: 'p',
        texto:
          'En comunidades como Yaguate, este tipo de actividades se convierte en un punto de encuentro donde jóvenes y adultos pueden compartir, desarrollar habilidades, fortalecer amistades y construir vínculos alrededor de una pasión común.',
      },
      {
        tipo: 'p',
        texto:
          'Los torneos comunitarios también contribuyen a mantener activos los espacios deportivos y a generar alternativas de recreación para las familias.',
      },
      {
        tipo: 'p',
        texto:
          'La victoria de La Esquinita de Yaguate es, en ese sentido, también una celebración del esfuerzo colectivo de jugadores, dirigentes, colaboradores, patrocinadores y seguidores.',
      },
      { tipo: 'h2', texto: 'LINKDICOM, presente en las iniciativas que transforman' },
      {
        tipo: 'p',
        texto: 'Para LINKDICOM, el desarrollo tecnológico y el compromiso con la sociedad forman parte de una misma visión.',
      },
      {
        tipo: 'p',
        texto:
          'Como empresa dominicana dedicada al desarrollo de soluciones tecnológicas para la salud, entendemos que nuestro propósito también implica contribuir al bienestar de las personas y acompañar iniciativas que generan un impacto positivo en nuestras comunidades.',
      },
      {
        tipo: 'p',
        texto:
          'El patrocinio a La Esquinita de Yaguate forma parte de ese compromiso con el deporte y con los espacios que promueven la integración, la disciplina y el crecimiento comunitario.',
      },
      {
        tipo: 'p',
        texto:
          'Celebramos junto a todo el equipo esta importante victoria y extendemos nuestras felicitaciones a sus jugadores, dirigentes y colaboradores por el esfuerzo realizado durante el torneo.',
      },
      { tipo: 'destacado', texto: '¡Felicidades, La Esquinita de Yaguate!' },
      {
        tipo: 'p',
        texto:
          'La copa representa una victoria dentro del terreno de juego, pero también el resultado de trabajar juntos por un objetivo común.',
      },
      {
        tipo: 'p',
        texto:
          'En LINKDICOM continuaremos apoyando las iniciativas que conectan a las personas, fortalecen nuestras comunidades y nos impulsan a avanzar.',
      },
      { tipo: 'p', texto: 'LINKDICOM — Conecta y Avanza.' },
    ],
    publicado: true,
    destacada: true,
    cta: {
      titulo: '¿Quieres conocer cómo LINKDICOM puede apoyar iniciativas en tu institución?',
      texto: 'Solicita una demostración personalizada y descubre todo lo que podemos hacer juntos.',
      boton: 'Solicitar Demo',
    },
  },

  /* ---------------------------------------------------------------- */
  {
    slug: 'rodamontes-rodando-por-la-restauracion',
    titulo: 'LINKDICOM co-patrocina el 5.º evento RODAMONTESSJ “Rodando por la Restauración”',
    subtitulo:
      'Una jornada deportiva que reunió a cientos de ciclistas de diferentes puntos del país y promovió el deporte, la comunidad y los atractivos de San Juan de la Maguana.',
    fecha: '18 de agosto de 2025',
    fechaISO: '2025-08-18',
    categoria: 'Responsabilidad Social',
    color: '#0f8a5f',
    lectura: '3 min de lectura',
    imagen: '/img/noticias/rodamontes-equipo.webp',
    imagenAlt: 'Equipo de LINKDICOM y ciclistas frente al cartel del 5.º evento Rodamontes SJ',
    pie: 'Equipo LINKDICOM presente en el 5.º evento RODAMONTESSJ “Rodando por la Restauración”, San Juan de la Maguana.',
    resumen:
      'LINKDICOM participó como Co-Patrocinador de la quinta edición de “Rodando por la Restauración”, con una ruta de 38 kilómetros por los paisajes de San Juan de la Maguana.',
    cuerpo: [
      { tipo: 'h2', texto: 'LINKDICOM junto al deporte y la comunidad' },
      {
        tipo: 'p',
        texto:
          'San Juan de la Maguana. — LINKDICOM participó como Co-Patrocinador del 5.º evento RODAMONTESSJ “Rodando por la Restauración”, una iniciativa organizada por el club de ciclismo Rodamontes SJ que reunió a ciclistas provenientes de diferentes puntos de la República Dominicana.',
      },
      {
        tipo: 'p',
        texto:
          'La actividad se desarrolló en un ambiente de deporte, integración y contacto con la naturaleza, llevando a los participantes por una ruta de aproximadamente 38 kilómetros a través de distintos paisajes rurales de San Juan de la Maguana.',
      },
      {
        tipo: 'p',
        texto:
          'Con una ruta de dificultad media-alta, los ciclistas recorrieron caminos, trillos y ríos de la zona, disfrutando de los paisajes naturales de la provincia y compartiendo una experiencia marcada por la convivencia y la pasión por el ciclismo.',
      },
      { tipo: 'h2', texto: 'Deporte, salud y comunidad' },
      {
        tipo: 'p',
        texto:
          'Más allá de la actividad deportiva, “Rodando por la Restauración” representa un espacio para promover estilos de vida activos y saludables, fortalecer los vínculos entre las comunidades y proyectar los atractivos naturales de San Juan de la Maguana.',
      },
      {
        tipo: 'p',
        texto:
          'El ciclismo de montaña combina actividad física, bienestar y contacto con la naturaleza, al mismo tiempo que permite crear nuevos vínculos entre personas y clubes de distintas localidades del país.',
      },
      {
        tipo: 'p',
        texto:
          'Durante la jornada, los participantes contaron con asistencia médica, puntos de hidratación, kits, alimentación y medallas de participación, como parte de la organización y logística preparada para el evento.',
      },
      { tipo: 'h2', texto: 'Una ruta que también promueve a San Juan' },
      {
        tipo: 'p',
        texto:
          'Uno de los principales objetivos de RODAMONTESSJ es utilizar el ciclismo como una vía para dar a conocer los diferentes paisajes, comunidades y parajes de San Juan de la Maguana.',
      },
      {
        tipo: 'p',
        texto:
          'La presencia de participantes provenientes de otras provincias contribuye además al movimiento de la economía local, especialmente en sectores como alojamiento, alimentación, transporte y comercio.',
      },
      {
        tipo: 'p',
        texto:
          'De esta manera, el evento trasciende lo deportivo y se convierte en una oportunidad para mostrar parte de la riqueza natural y cultural de la provincia.',
      },
      { tipo: 'h2', texto: 'Rodando por la Restauración' },
      {
        tipo: 'p',
        texto:
          'El evento se celebra en el marco de la conmemoración de la Restauración de la República Dominicana, vinculando la práctica deportiva con una fecha de gran significado para la historia nacional.',
      },
      {
        tipo: 'p',
        texto:
          'A través de esta iniciativa, los organizadores buscan mantener vivo el espíritu de identidad, unidad y orgullo dominicano, llevando ese mensaje a través de una actividad que reúne deporte, naturaleza y comunidad.',
      },
      { tipo: 'h2', texto: 'Una experiencia construida en equipo' },
      {
        tipo: 'p',
        texto:
          'El éxito de una jornada de esta magnitud requiere del esfuerzo conjunto de organizadores, voluntarios, patrocinadores, clubes y participantes.',
      },
      {
        tipo: 'p',
        texto:
          'Uno de los momentos especiales de la jornada tuvo lugar durante el acto de apertura, cuando Eduardo Batista Alcántara, CEO de LINKDICOM, tuvo el honor de dar la bandera de salida a los ciclistas, marcando oficialmente el inicio del recorrido.',
      },
      {
        tipo: 'video',
        src: '/video/noticias/rodamontes-salida.mp4',
        poster: '/video/noticias/rodamontes-salida.jpg',
        pie: 'Eduardo Batista Alcántara, CEO de LINKDICOM, dando la bandera de salida durante la apertura del 5.º RODAMONTESSJ “Rodando por la Restauración”.',
      },
      {
        tipo: 'p',
        texto:
          'El gesto, realizado por los organizadores de RODAMONTESSJ, constituyó una muestra de reconocimiento y agradecimiento por el respaldo de LINKDICOM como Co-Patrocinador de esta quinta edición.',
      },
      {
        tipo: 'p',
        texto:
          'LINKDICOM se sumó a esta iniciativa como Co-Patrocinador, respaldando una actividad que promueve valores como la disciplina, el bienestar, la colaboración y la integración comunitaria.',
      },
      {
        tipo: 'p',
        texto:
          'Para LINKDICOM, formar parte de este tipo de iniciativas representa también una forma de contribuir al desarrollo de las comunidades donde estamos presentes.',
      },
      {
        tipo: 'foto',
        src: '/img/noticias/rodamontes-camisetas.webp',
        alt: 'Participantes muestran las camisetas del evento junto al equipo de LINKDICOM',
        pie: 'Organizadores, ciclistas y colaboradores en la apertura del evento.',
      },
      { tipo: 'h2', texto: 'Comprometidos con iniciativas que transforman' },
      { tipo: 'p', texto: 'En LINKDICOM creemos que conectar también significa crear vínculos con nuestra comunidad.' },
      {
        tipo: 'p',
        texto:
          'Como empresa dominicana dedicada al desarrollo de soluciones tecnológicas para la salud, entendemos que nuestro compromiso va más allá de la tecnología. Apoyar iniciativas que promueven el deporte, la salud, la integración y el desarrollo de nuestras comunidades forma parte de nuestra visión de contribuir a un mejor futuro.',
      },
      {
        tipo: 'p',
        texto:
          'Nos sentimos orgullosos de haber acompañado a Rodamontes SJ, a sus organizadores, colaboradores y a todos los ciclistas que hicieron posible esta quinta edición de “Rodando por la Restauración”.',
      },
      { tipo: 'p', texto: 'LINKDICOM — Conecta y Avanza.' },
    ],
    publicado: true,
    destacada: true,
    cta: {
      titulo: '¿Quieres conocer cómo LINKDICOM puede apoyar iniciativas en tu institución?',
      texto: 'Solicita una demostración personalizada y descubre todo lo que podemos hacer juntos.',
      boton: 'Solicitar Demo',
    },
  },

  /* ---------------------------------------------------------------- */
  {
    slug: 'ecosistema-en-el-centro-dr-nelson-astacio',
    titulo:
      'LINKDICOM implementa con éxito su ecosistema tecnológico en el Centro Especializado de Atención Ambulatoria en Salud Dr. Nelson Astacio',
    subtitulo:
      'La transformación digital integra PACS-RIS, gestión de turnos, infraestructura tecnológica, entrega de resultados y un moderno Portal al Paciente para optimizar la experiencia de atención.',
    fecha: '26 de mayo de 2025',
    fechaISO: '2025-05-26',
    categoria: 'Implementaciones',
    color: '#2563eb',
    lectura: '5 min de lectura',
    imagen: '/img/noticias/nelson-astacio.webp',
    imagenAlt: 'Edificio de consultas externas del Centro Especializado de Atención Ambulatoria en Salud Dr. Nelson Astacio',
    pie: 'Centro Especializado de Atención Ambulatoria en Salud Dr. Nelson Astacio, Santo Domingo.',
    resumen:
      'PACS-RIS, gestión de turnos, entrega de resultados y Portal al Paciente, integrados en un ecosistema que conecta toda la operación del centro.',
    cuerpo: [
      { tipo: 'h2', texto: 'Tecnología para una nueva experiencia de atención en salud' },
      {
        tipo: 'p',
        texto:
          'Santo Domingo, República Dominicana. — El Centro Especializado de Atención Ambulatoria en Salud Dr. Nelson Astacio, anteriormente conocido como Hospital Dr. Luis Eduardo Aybar, avanza en su proceso de transformación y modernización de los servicios de salud con la implementación del ecosistema tecnológico de LINKDICOM.',
      },
      {
        tipo: 'p',
        texto:
          'La implementación integra diferentes soluciones diseñadas para trabajar de manera coordinada, permitiendo digitalizar y optimizar procesos relacionados con el diagnóstico por imágenes, la gestión de pacientes, la administración de turnos y la entrega de resultados.',
      },
      {
        tipo: 'p',
        texto:
          'Más que la incorporación de una herramienta tecnológica aislada, el proyecto representa la puesta en marcha de un ecosistema digital orientado a conectar los diferentes puntos del proceso asistencial, desde la atención del paciente hasta la gestión de la información clínica.',
      },
      { tipo: 'h2', texto: 'Un ecosistema que conecta toda la operación' },
      {
        tipo: 'p',
        texto:
          'Como parte de la implementación, LINKDICOM ha desplegado sus soluciones PACS-RIS, permitiendo gestionar de manera digital el flujo de los estudios de diagnóstico por imágenes, desde su realización hasta la interpretación, almacenamiento y entrega de resultados.',
      },
      {
        tipo: 'p',
        texto:
          'La integración facilita el acceso a la información y contribuye a agilizar los procesos internos, reduciendo tareas manuales y permitiendo que los profesionales dispongan de la información necesaria de manera más organizada y oportuna.',
      },
      {
        tipo: 'p',
        texto:
          'A esta plataforma se suma el Sistema de Gestión de Turnos, diseñado para ordenar el flujo de pacientes y mejorar la experiencia durante su permanencia en la institución.',
      },
      {
        tipo: 'p',
        texto: 'La combinación de estas tecnologías permite avanzar hacia un modelo de atención más organizado, conectado y eficiente.',
      },
      { tipo: 'h2', texto: 'Menos procesos manuales, mayor agilidad' },
      {
        tipo: 'p',
        texto:
          'Uno de los principales resultados observados durante las primeras fases de implementación ha sido la agilización de los procesos de atención.',
      },
      {
        tipo: 'p',
        texto:
          'La digitalización permite reducir pasos innecesarios, mejorar el flujo de información entre las diferentes áreas y facilitar la gestión de los servicios que reciben diariamente a numerosos pacientes.',
      },
      {
        tipo: 'p',
        texto:
          'Este tipo de optimización tiene un impacto que va más allá del área tecnológica: permite que el personal pueda dedicar mayor atención a sus responsabilidades asistenciales y administrativas, mientras el paciente experimenta un proceso más fluido.',
      },
      { tipo: 'h2', texto: 'Un impacto también en la gestión administrativa' },
      {
        tipo: 'p',
        texto:
          'La implementación de las soluciones de LINKDICOM también ha contribuido a fortalecer los procesos relacionados con la gestión de los servicios facturados a las Administradoras de Riesgos de Salud (ARS).',
      },
      {
        tipo: 'p',
        texto:
          'La disponibilidad de información más organizada y trazable ayuda a disminuir inconsistencias en los procesos y contribuye a reducir el número de glosas, fortaleciendo la gestión administrativa asociada a los servicios prestados.',
      },
      {
        tipo: 'p',
        texto:
          'De esta manera, la transformación digital genera beneficios tanto en la experiencia del paciente como en la eficiencia operacional de la institución.',
      },
      { tipo: 'h2', texto: 'Una experiencia que comienza desde el primer contacto' },
      { tipo: 'p', texto: 'La modernización no se limita a los procesos internos.' },
      {
        tipo: 'p',
        texto:
          'Uno de los objetivos principales del proyecto ha sido transformar también la percepción y experiencia del paciente dentro de la institución.',
      },
      {
        tipo: 'p',
        texto:
          'Desde la gestión de turnos hasta la entrega de resultados, las soluciones implementadas buscan ofrecer un recorrido más organizado y acorde con las expectativas de un centro de salud moderno y especializado.',
      },
      {
        tipo: 'p',
        texto:
          'La incorporación de tecnología visible para el paciente contribuye además a proyectar una imagen de innovación y modernidad, generando una experiencia coherente con el proceso de transformación que vive la institución.',
      },
      { tipo: 'h2', texto: 'Resultados físicos y digitales' },
      {
        tipo: 'p',
        texto:
          'Como parte del ecosistema implementado, LINKDICOM también ha establecido la infraestructura y los servicios necesarios para facilitar la entrega de resultados en formato físico, manteniendo una alternativa accesible para aquellos pacientes que requieren o prefieren disponer de su documentación impresa.',
      },
      {
        tipo: 'p',
        texto:
          'Esta capacidad convive con las herramientas digitales, permitiendo que la institución pueda adaptarse a las diferentes necesidades de sus usuarios.',
      },
      {
        tipo: 'p',
        texto: 'El objetivo no es sustituir una modalidad por otra, sino construir un sistema de entrega de información más completo y flexible.',
      },
      { tipo: 'h2', texto: 'El Portal al Paciente: información clínica al alcance del usuario' },
      { tipo: 'p', texto: 'Uno de los componentes más importantes de esta transformación es el Portal al Paciente de LINKDICOM.' },
      {
        tipo: 'p',
        texto:
          'A través de esta plataforma, los pacientes pueden acceder de manera digital a información relacionada con su atención, incluyendo elementos de su historia clínica, resultados y otros datos disponibles dentro del ecosistema de la institución.',
      },
      {
        tipo: 'p',
        texto:
          'Este tipo de herramientas coloca al paciente en el centro del proceso digital, permitiéndole tener un mayor acceso a su información y reduciendo la dependencia de procesos exclusivamente presenciales.',
      },
      {
        tipo: 'p',
        texto:
          'El Portal al Paciente representa así un paso hacia una atención más conectada, en la que la relación entre institución y usuario continúa más allá de las paredes del centro de salud.',
      },
      { tipo: 'h2', texto: 'La visión de una institución moderna' },
      {
        tipo: 'p',
        texto:
          'El proceso de transformación tecnológica del Centro Especializado de Atención Ambulatoria en Salud Dr. Nelson Astacio responde a una visión en la que la tecnología se convierte en un elemento estratégico para mejorar la prestación de servicios.',
      },
      {
        tipo: 'p',
        texto:
          'La institución busca ofrecer una experiencia acorde con las nuevas expectativas de los pacientes y con los estándares de modernización que demanda el sector salud.',
      },
      {
        tipo: 'p',
        texto:
          'En este proceso, la tecnología no funciona como un elemento independiente, sino como una infraestructura que conecta personas, procesos e información.',
      },
      { tipo: 'h2', texto: 'La valoración de su dirección' },
      {
        tipo: 'p',
        texto:
          'El Dr. Onnes Gleyton Tapia, director del Centro Especializado de Atención Ambulatoria en Salud Dr. Nelson Astacio y médico especialista en pediatría, ha mostrado su satisfacción con los resultados obtenidos durante las primeras fases de la implementación.',
      },
      {
        tipo: 'p',
        texto:
          'La valoración de la dirección destaca especialmente los avances observados en la agilización de los procesos de atención, la reducción de glosas y la percepción de modernidad experimentada por los pacientes.',
      },
      {
        tipo: 'p',
        texto:
          'Estos primeros resultados representan un indicador importante para continuar ampliando y fortaleciendo el ecosistema tecnológico dentro de la institución.',
      },
      { tipo: 'h2', texto: 'Una implementación que continúa avanzando' },
      { tipo: 'p', texto: 'La transformación digital de una institución de salud es un proceso continuo.' },
      {
        tipo: 'p',
        texto:
          'Cada nueva herramienta abre oportunidades para optimizar procesos, mejorar la gestión de la información y ofrecer mejores experiencias a pacientes y profesionales.',
      },
      {
        tipo: 'p',
        texto:
          'Con la implementación de su ecosistema tecnológico, LINKDICOM acompaña al Centro Especializado de Atención Ambulatoria en Salud Dr. Nelson Astacio en este proceso, proporcionando no solo las plataformas de software, sino también la infraestructura, los servicios tecnológicos y los mecanismos necesarios para llevar estas soluciones a la operación diaria.',
      },
      {
        tipo: 'p',
        texto:
          'El resultado es una institución más conectada, con mayor capacidad para gestionar su información y con nuevas herramientas para ofrecer servicios de salud de manera más eficiente.',
      },
      { tipo: 'h2', texto: 'LINKDICOM: tecnología que conecta la salud' },
      {
        tipo: 'p',
        texto:
          'Para LINKDICOM, este proyecto representa un ejemplo de cómo la tecnología desarrollada en República Dominicana puede contribuir directamente a la modernización de nuestras instituciones de salud.',
      },
      {
        tipo: 'p',
        texto:
          'Nuestro objetivo no es simplemente instalar sistemas, sino crear ecosistemas tecnológicos capaces de conectar procesos, profesionales, pacientes e información.',
      },
      {
        tipo: 'p',
        texto:
          'La implementación en el Centro Especializado de Atención Ambulatoria en Salud Dr. Nelson Astacio demuestra que la transformación digital puede generar resultados concretos cuando la tecnología se integra de manera estratégica dentro de la operación de una institución.',
      },
      {
        tipo: 'destacado',
        texto: 'PACS-RIS. Gestión de turnos. Portal al Paciente. Entrega de resultados. Infraestructura. Servicios tecnológicos.',
      },
      { tipo: 'p', texto: 'Todo conectado bajo una misma visión:' },
      { tipo: 'p', texto: 'LINKDICOM — Conecta y Avanza.' },
    ],
    publicado: true,
    destacada: true,
    cta: {
      titulo: '¿Quieres lograr resultados similares en tu institución?',
      texto: 'Solicita una demostración personalizada y descubre cómo LINKDICOM puede ayudarte.',
      boton: 'Solicitar Demo',
      interes: 'Hospitalario',
    },
  },

  /* ---------------------------------------------------------------- */
  {
    slug: 'radiologox-beta-nueva-generacion',
    titulo: 'LINKDICOM presenta RadioloGOx Beta, la nueva generación de su plataforma PACS-RIS',
    subtitulo:
      'Una nueva etapa en la evolución de la tecnología de LINKDICOM que combina la estabilidad que caracterizó a RadioloGOx Pro con una arquitectura moderna, mayor capacidad de visualización y herramientas diseñadas para una nueva generación de servicios de diagnóstico por imágenes.',
    fecha: 'Enero de 2025',
    fechaISO: '2025-01-15',
    categoria: 'Innovación',
    color: '#6d5bd0',
    lectura: '5 min de lectura',
    imagen: '/img/noticias/radiologox-beta.webp',
    imagenAlt: 'RadioloGOx Beta: la evolución de una plataforma que ha hecho historia',
    pie: 'RadioloGOx Beta, la nueva generación de la plataforma PACS-RIS de LINKDICOM.',
    resumen:
      'La nueva generación de RadioloGOx conserva la estabilidad de RadioloGOx Pro e incorpora una arquitectura moderna y nuevas herramientas de visualización diagnóstica.',
    cuerpo: [
      { tipo: 'h2', texto: 'Una nueva generación comienza' },
      {
        tipo: 'p',
        texto:
          'Santo Domingo, República Dominicana. — LINKDICOM inició el 2025 presentando RadioloGOx Beta, la nueva generación de su plataforma PACS-RIS, marcando un nuevo capítulo en la evolución tecnológica de una solución que durante años ha acompañado a instituciones y profesionales del diagnóstico por imágenes en República Dominicana y otros mercados internacionales.',
      },
      {
        tipo: 'p',
        texto:
          'RadioloGOx Beta nace después de años de desarrollo, experiencia y aprendizaje acumulado a través de la operación de RadioloGOx Pro, una plataforma que se convirtió en uno de los pilares tecnológicos de LINKDICOM y que llegó a operar en instituciones de diferentes países.',
      },
      { tipo: 'p', texto: 'La nueva versión no representa una ruptura con ese legado. Representa su evolución.' },
      { tipo: 'h2', texto: 'De RadioloGOx Pro a una nueva generación' },
      {
        tipo: 'p',
        texto:
          'Durante más de siete años, RadioloGOx Pro se mantuvo como una de las versiones de mayor permanencia dentro del ecosistema tecnológico de LINKDICOM.',
      },
      {
        tipo: 'p',
        texto:
          'Su estabilidad y confiabilidad hicieron que numerosos clientes desarrollaran una relación particular con la plataforma. Incluso después de la llegada de nuevas tecnologías, algunas instituciones mostraban resistencia a abandonar RadioloGOx Pro precisamente por la confianza construida durante años de operación.',
      },
      { tipo: 'p', texto: 'Era un sistema conocido. Probado. Estable. Y, sobre todo, confiable.' },
      {
        tipo: 'p',
        texto:
          'A lo largo de su trayectoria, RadioloGOx Pro llegó a registrar más de 3.3 millones de estudios, cifra que supera los 3.8 millones de estudios clínicos cuando se consideran infraestructuras y servidores históricos que no forman parte de las estadísticas centrales de la plataforma.',
      },
      {
        tipo: 'p',
        texto:
          'Detrás de esos números existen millones de imágenes médicas, reportes, diagnósticos, pacientes y profesionales que utilizaron la tecnología de LINKDICOM como parte de sus procesos diarios.',
      },
      {
        tipo: 'p',
        texto:
          'Por eso, desarrollar su sucesor no significaba simplemente crear una interfaz diferente. Significaba superar el estándar que la propia plataforma había construido.',
      },
      {
        tipo: 'foto',
        src: '/img/noticias/radiologox-beta-listado.webp',
        alt: 'Listado de casos de pacientes en RadioloGOx Beta',
        pie: 'Listado de casos de pacientes en RadioloGOx Beta.',
      },
      { tipo: 'h2', texto: 'RadioloGOx Beta: estabilidad con una nueva experiencia' },
      { tipo: 'p', texto: 'RadioloGOx Beta fue concebido bajo una premisa clara:' },
      { tipo: 'destacado', texto: 'La tecnología puede cambiar sin perder aquello que funciona.' },
      {
        tipo: 'p',
        texto:
          'La nueva plataforma conserva el enfoque de estabilidad y confiabilidad que caracterizó a RadioloGOx Pro, pero incorpora una arquitectura y una experiencia de usuario adaptadas a las nuevas necesidades del diagnóstico por imágenes.',
      },
      {
        tipo: 'p',
        texto:
          'Su interfaz presenta un diseño más moderno, limpio e intuitivo, pensado para facilitar el acceso a las diferentes herramientas y reducir la complejidad durante la operación cotidiana.',
      },
      {
        tipo: 'p',
        texto:
          'La plataforma también ha sido diseñada considerando la diversidad de dispositivos utilizados actualmente en los entornos de salud, ofreciendo una experiencia adaptada a computadores, estaciones de trabajo, laptops y otros dispositivos con acceso web.',
      },
      { tipo: 'p', texto: 'El objetivo es que la tecnología se adapte al profesional y no que el profesional tenga que adaptarse a la tecnología.' },
      { tipo: 'h2', texto: 'Nuevas herramientas para la visualización diagnóstica' },
      {
        tipo: 'p',
        texto:
          'Uno de los principales avances de RadioloGOx Beta se encuentra en sus herramientas de visualización y reconstrucción de imágenes.',
      },
      {
        tipo: 'p',
        texto:
          'La nueva generación amplía las capacidades disponibles para el análisis de estudios, incorporando herramientas avanzadas de reconstrucción y procesamiento que permiten aprovechar mejor la información contenida en las imágenes médicas.',
      },
      { tipo: 'p', texto: 'Entre sus capacidades se encuentran herramientas para:' },
      {
        tipo: 'lista',
        items: [
          'Reconstrucción multiplanar (MPR)',
          'Proyección de máxima intensidad (MIP)',
          'Proyección de mínima intensidad (MinIP)',
          'Visualización y navegación avanzada de series',
          'Mediciones y anotaciones',
          'Herramientas de ajuste de ventana y nivel',
          'Comparación y revisión de estudios',
          'Reconstrucciones y visualizaciones avanzadas para estudios volumétricos',
          'Herramientas orientadas a optimizar el flujo de interpretación radiológica',
        ],
      },
      {
        tipo: 'p',
        texto:
          'Estas capacidades permiten que estudios complejos puedan ser explorados de manera más eficiente, proporcionando al especialista herramientas que acompañan diferentes escenarios de diagnóstico.',
      },
      { tipo: 'p', texto: 'Y esto es apenas una parte de la evolución.' },
      { tipo: 'h2', texto: 'Una plataforma diseñada para el diagnóstico moderno' },
      { tipo: 'p', texto: 'RadioloGOx Beta también representa una evolución en la forma de entender un PACS-RIS.' },
      { tipo: 'p', texto: 'La plataforma no se limita al almacenamiento y visualización de imágenes.' },
      {
        tipo: 'p',
        texto:
          'Su arquitectura está concebida como parte de un ecosistema tecnológico integral, donde las imágenes, los estudios, los informes, los usuarios y los diferentes procesos de una institución pueden mantenerse conectados.',
      },
      {
        tipo: 'p',
        texto:
          'Esta visión permite a LINKDICOM continuar desarrollando soluciones alrededor de las necesidades reales de los centros de diagnóstico, hospitales, clínicas, consultorios y redes de salud.',
      },
      { tipo: 'h2', texto: 'La experiencia de años convertida en tecnología' },
      {
        tipo: 'p',
        texto:
          'Una de las mayores ventajas de RadioloGOx Beta no está solamente en las funcionalidades que incorpora. Está en la experiencia que existe detrás de ellas.',
      },
      {
        tipo: 'p',
        texto:
          'LINKDICOM ha desarrollado sus soluciones a partir de años de interacción directa con profesionales de la salud, radiólogos, técnicos, administradores y responsables de instituciones médicas.',
      },
      {
        tipo: 'p',
        texto:
          'Cada implementación, cada integración y cada desafío operativo se ha convertido en conocimiento utilizado para evolucionar la plataforma.',
      },
      { tipo: 'p', texto: 'RadioloGOx Beta es, en ese sentido, el resultado de años de desarrollo continuo. No comienza desde cero. Comienza desde la experiencia.' },
      { tipo: 'h2', texto: 'Una empresa que convirtió innovación en identidad' },
      {
        tipo: 'p',
        texto:
          'El lanzamiento de RadioloGOx Beta también representa un momento importante en la trayectoria de LINKDICOM como empresa tecnológica dominicana.',
      },
      {
        tipo: 'p',
        texto: 'Desde sus inicios, LINKDICOM asumió el desafío de desarrollar tecnología especializada para el sector salud desde República Dominicana.',
      },
      {
        tipo: 'p',
        texto:
          'La compañía se convirtió en la primera empresa dominicana en desarrollar un sistema PACS-RIS, dando origen a una trayectoria que posteriormente la llevaría a posicionarse como una de las marcas dominicanas de mayor reconocimiento en el desarrollo de soluciones para diagnóstico por imágenes.',
      },
      {
        tipo: 'p',
        texto:
          'A partir de República Dominicana, sus tecnologías han alcanzado presencia en diferentes mercados de Latinoamérica e India, mientras la empresa ha establecido colaboraciones y vínculos tecnológicos con organizaciones de Europa, Estados Unidos y Latinoamérica.',
      },
      {
        tipo: 'p',
        texto:
          'Esta expansión ha permitido a LINKDICOM intercambiar conocimientos, integrar tecnologías y mantenerse conectada con las tendencias internacionales del sector.',
      },
      { tipo: 'h2', texto: 'De República Dominicana para el mundo' },
      { tipo: 'p', texto: 'El crecimiento de LINKDICOM representa también una historia de innovación tecnológica desarrollada desde el Caribe.' },
      {
        tipo: 'p',
        texto:
          'En un sector dominado históricamente por grandes fabricantes y plataformas internacionales, una empresa dominicana logró desarrollar, implementar y evolucionar sus propias soluciones para el manejo de imágenes médicas y procesos radiológicos.',
      },
      { tipo: 'p', texto: 'RadioloGOx Pro fue una parte fundamental de ese recorrido. RadioloGOx Beta representa el siguiente paso.' },
      {
        tipo: 'p',
        texto:
          'La nueva plataforma lleva consigo la experiencia de miles de implementaciones y millones de estudios, pero está construida pensando en los próximos años y en las nuevas exigencias de la salud digital.',
      },
      { tipo: 'h2', texto: 'Una evolución que apenas comienza' },
      { tipo: 'p', texto: 'El lanzamiento de RadioloGOx Beta no representa el punto final de la evolución de RadioloGOx. Es el comienzo de una nueva etapa.' },
      {
        tipo: 'p',
        texto:
          'La tecnología médica cambia constantemente. Los dispositivos evolucionan, las modalidades de diagnóstico generan mayores volúmenes de información y los profesionales demandan herramientas cada vez más rápidas, inteligentes y accesibles.',
      },
      { tipo: 'p', texto: 'Por eso, LINKDICOM mantiene una filosofía de desarrollo continuo.' },
      {
        tipo: 'p',
        texto:
          'Cada nueva generación debe ser capaz de responder a las necesidades actuales, pero también preparar el camino para las que todavía están por llegar.',
      },
      { tipo: 'p', texto: 'RadioloGOx Beta nace precisamente bajo esa visión.' },
      { tipo: 'destacado', texto: 'Más moderno. Más adaptable. Más herramientas. Más capacidad. La misma obsesión por la estabilidad.' },
      { tipo: 'h2', texto: 'El legado continúa' },
      { tipo: 'p', texto: 'RadioloGOx Pro dejó una huella importante en la historia de LINKDICOM.' },
      {
        tipo: 'p',
        texto:
          'Fue la plataforma que acompañó durante años a instituciones y profesionales, que demostró su estabilidad en diferentes escenarios y que permitió a la empresa llevar su tecnología más allá de las fronteras dominicanas.',
      },
      { tipo: 'p', texto: 'Ahora, esa experiencia se convierte en el punto de partida para una nueva generación.' },
      { tipo: 'p', texto: 'RadioloGOx Beta no llega para borrar el legado de RadioloGOx Pro. Llega para continuar construyéndolo.' },
      { tipo: 'h2', texto: 'LINKDICOM: innovación que nace aquí' },
      {
        tipo: 'p',
        texto:
          'El lanzamiento de RadioloGOx Beta reafirma el compromiso de LINKDICOM con el desarrollo de tecnología especializada para la salud desde República Dominicana.',
      },
      {
        tipo: 'p',
        texto:
          'Nuestra visión siempre ha sido demostrar que la innovación también puede desarrollarse desde nuestro país y alcanzar mercados internacionales.',
      },
      {
        tipo: 'p',
        texto:
          'Después de años de evolución, millones de estudios gestionados, múltiples implementaciones y una creciente presencia internacional, LINKDICOM continúa desarrollando tecnología con una misma filosofía: crear soluciones que conecten personas, información y servicios de salud para hacerlos avanzar.',
      },
      { tipo: 'p', texto: 'Y RadioloGOx Beta es el comienzo de una nueva etapa.' },
      { tipo: 'p', texto: 'LINKDICOM — Conecta y Avanza.' },
    ],
    publicado: true,
    destacada: true,
    cta: {
      titulo: '¿Quieres ver RadioloGOx Beta en acción?',
      texto: 'Solicita una demostración personalizada y conoce la nueva generación de nuestra plataforma PACS-RIS.',
      boton: 'Solicitar Demo',
      interes: 'RadiologoX',
    },
  },
];
