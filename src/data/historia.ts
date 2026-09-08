import type { IconName } from '../components/ui/Icon';

/*
  Nuestra historia.

  El relato completo que el cliente entrego en texto plano, repartido en
  capitulos. Es el destino del boton "Conoce mas sobre nuestra historia" de la
  pagina de Quienes somos, que solo cuenta la version corta.

  Se respeta la redaccion del original. Solo se citan empresas, proyectos y
  comunidades: de terceros no se publican nombres de personas.
*/

export interface CapituloHistoria {
  anio?: string;
  titulo: string;
  subtitulo?: string;
  parrafos: string[];
  /** Enumeracion con vinetas al final del capitulo. */
  lista?: string[];
  /** Evolucion en pasos, del pasado al presente. */
  cadena?: string[];
  imagen?: string;
  imagenAlt?: string;
  /** Aviso destacado dentro del capitulo. */
  nota?: { titulo: string; texto: string };
  /** Cifra al margen. */
  dato?: { valor: string; label: string };
  /** Frase suelta, en grande, antes de los parrafos. */
  pregunta?: string;
}

export const HISTORIA = {
  cabecera: {
    slug: 'nuestra-historia',
    miga: 'Nuestra historia',
    titulo: 'Nuestra',
    tituloAccent: 'historia',
    subtitulo: 'De un proyecto personal de tecnología médica a una empresa dominicana con alcance internacional',
    intro:
      'La historia de LINKDICOM comienza antes de su constitución formal como empresa. Este es el recorrido completo: los años de aprendizaje, las primeras implementaciones, las colaboraciones internacionales y el desarrollo de nuestra propia tecnología.',
    bullets: [
      { icon: 'clock' as IconName, label: 'Desde el año 2000' },
      { icon: 'code' as IconName, label: 'Primer PACS dominicano' },
      { icon: 'globe' as IconName, label: 'Colaboración internacional' },
      { icon: 'cpu' as IconName, label: 'Core propio desde 2022' },
    ],
    lema: 'De ISL/1 a RadiologoX',
    lemaNota: 'Más de una década de evolución tecnológica.',
    imagen: '/img/empresa/historia-hero.webp',
    imagenAlt: 'Bandera de la República Dominicana ondeando sobre la ciudad al atardecer',
  },

  /* ---------- Los capitulos, en orden ---------- */

  origen: {
    anio: '2000',
    titulo: 'Donde empieza todo',
    parrafos: [
      'En el año 2000, Eduardo Batista Alcántara inició su trayectoria profesional en el área de imágenes médicas, trabajando como técnico de Rayos X, Tomografía y Densitometría Ósea en CEDISA San Juan de la Maguana, República Dominicana.',
      'Su incorporación a este campo ocurrió en una etapa de transición tecnológica, cuando los servicios de diagnóstico por imágenes todavía dependían ampliamente de las películas radiográficas y sus procesos químicos de revelado, basados en revelador, fijador y agua, antes de la consolidación de los flujos completamente digitales.',
      'Esta experiencia directa dentro de los servicios de diagnóstico permitió identificar una necesidad que posteriormente se convertiría en el eje de su trayectoria: llevar la tecnología digital al flujo completo de las imágenes médicas.',
    ],
  } as CapituloHistoria,

  isl1: {
    anio: '2008 – 2010',
    titulo: 'Nace ISL/1',
    subtitulo: 'Interfaz Server Lineal',
    parrafos: [
      'Antes de existir LINKDICOM, Eduardo Batista Alcántara inició el diseño y desarrollo del ISL/1 (Interfaz Server Lineal), un proyecto tecnológico que se extendió durante más de dos años, desde 2008 hasta 2009–2010.',
      'El objetivo era desarrollar una solución capaz de recibir, transferir, organizar y gestionar imágenes médicas bajo DICOM, utilizando una arquitectura basada en servidor.',
      'El desarrollo del ISL/1 constituye uno de los primeros esfuerzos conocidos en República Dominicana por construir una solución PACS de desarrollo local. Para ese período no se conocía otra solución dominicana de características equivalentes, por lo que ISL/1 se convirtió en el primer sistema PACS de desarrollo dominicano identificado por sus desarrolladores.',
    ],
    nota: {
      titulo: 'Importante',
      texto:
        'El ISL/1 fue diseñado originalmente por Eduardo Batista Alcántara, antes de la constitución de LINKDICOM, y posteriormente pasó a formar parte de la trayectoria tecnológica que dio origen a la empresa.',
    },
    imagen: '/img/sectores/pacs-isl1.webp',
    imagenAlt: 'Pantalla del sistema ISL/1 y su evolución hacia SGMM',
  } as CapituloHistoria,

  flujo: {
    titulo: '¿Cómo funcionaba ISL/1?',
    texto:
      'ISL/1 fue concebido alrededor de una arquitectura de servidor dedicado, donde las imágenes provenientes de los equipos de diagnóstico podían ser recibidas y gestionadas centralmente.',
    pasos: [
      { icon: 'scan' as IconName, label: 'Modalidad DICOM' },
      { icon: 'database' as IconName, label: 'Servidor ISL/1' },
      { icon: 'layers' as IconName, label: 'Recepción y organización del estudio' },
      { icon: 'cloud' as IconName, label: 'Almacenamiento' },
      { icon: 'network' as IconName, label: 'Transferencia hacia otros puntos' },
      { icon: 'monitor' as IconName, label: 'Consulta y visualización' },
    ],
    pie: [
      'El sistema estaba orientado a conectar diferentes áreas y ubicaciones dentro de una institución, permitiendo centralizar los estudios y facilitar su disponibilidad.',
      'Posteriormente, el desarrollo incorporó capacidades de transferencia remota, preparando el camino para lo que sería un flujo de teleradiología.',
    ],
  },

  transferencia: {
    titulo: 'Optimización de transferencia',
    parrafos: [
      'Uno de los principales desafíos técnicos de aquella época era la transferencia de estudios médicos a través de redes con capacidades considerablemente menores que las actuales.',
      'Durante el desarrollo de ISL/1 se trabajó con tecnologías del ecosistema DICOM y posteriormente con componentes relacionados con DCM4CHEE, incluyendo mecanismos de procesamiento, compresión y transferencia.',
      'Sobre esa experiencia desarrollamos un algoritmo en lenguaje C orientado a acelerar la transferencia de paquetes entre servidores remotos.',
      'En las pruebas realizadas en los escenarios de operación de aquella época, esta optimización permitió obtener mejoras de hasta aproximadamente un 25 % en la velocidad de transferencia, algo especialmente relevante considerando las condiciones de conectividad disponibles en ese período.',
    ],
    dato: { valor: '≈25 %', label: 'de mejora en la velocidad de transferencia entre servidores remotos' },
  } as CapituloHistoria,

  implementacionesTitulo: 'Primeras implementaciones',
  implementacionesTexto: 'Los tres primeros centros que pusieron el ISL/1 en funcionamiento.',
  implementaciones: [
    {
      orden: '01',
      nombre: 'SOMARAX',
      lugar: 'San Pedro de Macorís',
      texto:
        'Uno de los primeros centros en poner en funcionamiento el ISL/1 y una de las primeras instituciones de la zona en disponer de una solución PACS basada en servidor dedicado. Evolucionó hacia un esquema de teleradiología cuando se incorporó oficialmente Oviyam como visor del ISL/1.',
      nota:
        'En su primera etapa, ISL/1 gestionaba las imágenes mediante una visualización estática. La incorporación de Oviyam permitió dar un salto importante hacia una experiencia de visualización médica basada en navegador.',
    },
    {
      orden: '02',
      nombre: 'CEMEDI',
      lugar: 'Centro Diagnóstico',
      texto:
        'El segundo cliente en implementar ISL/1, con una instalación particularmente compacta: el servidor fue montado dentro de un gabinete de pared personalizado, integrando la infraestructura necesaria para centralizar el flujo de varias modalidades.',
      items: ['CT', 'MRI', 'Rayos X'],
    },
    {
      orden: '03',
      nombre: 'Centro Médico Integral II',
      lugar: 'Conectividad institucional',
      texto:
        'El tercer cliente en implementar ISL/1. Aquí el proyecto adquirió una dimensión mayor, manteniendo comunicación entre diferentes niveles y áreas del centro.',
      items: ['Consultorios', 'Emergencias', 'UCI', 'Enfermerías', 'Áreas diagnósticas'],
      nota:
        'Esta implementación demostró que el concepto podía extenderse más allá del departamento de imágenes y convertirse en una infraestructura de distribución de información médica dentro de toda una institución.',
    },
  ],

  peliculas: {
    titulo: 'De las películas al CD/DVD',
    parrafos: [
      'La transformación digital no se limitó al almacenamiento y a la transferencia de imágenes. Durante esta etapa comenzamos a experimentar con una nueva forma de entregar los estudios al paciente: CD y DVD con las imágenes digitales.',
      'Los centros proporcionaban sus discos previamente diseñados e impresos, y al principio se utilizaba una grabadora externa de CD/DVD para realizar la grabación. Los discos se adquirían en cantidades de aproximadamente 100 unidades o más, con un costo aproximado de RD$7.00 por unidad.',
      'En aquella época, sin embargo, el cambio cultural era importante. La entrega en CD/DVD generaba cierta resistencia tanto entre algunas instituciones como entre los propios pacientes, porque todavía estaba muy arraigada la cultura de recibir físicamente las imágenes impresas.',
      'Esta experiencia sería el punto de partida de una evolución posterior hacia sistemas automatizados de entrega digital.',
    ],
    cadena: ['Películas radiográficas', 'Acetato', 'Medios digitales'],
  } as CapituloHistoria,

  robots: {
    titulo: 'De los CD prediseñados a los robots',
    parrafos: [
      'Después de varios años trabajando con el modelo de CD/DVD prediseñado, comenzamos a implementar robots de grabación de CD/DVD bajo modelos de comodato y consumo.',
      'Aunque ya existían en el mercado equipos para grabación automatizada de discos, en ese momento no era habitual encontrar empresas que asumieran su instalación y operación bajo un modelo basado en el consumo de tinta y medios CD/DVD.',
      'El modelo fue inicialmente cuestionado por algunos actores del mercado, pero terminó demostrando una importante aceptación comercial. Con el tiempo, otros participantes del sector comenzaron a adoptar modelos similares.',
    ],
    imagen: '/img/sectores/robots-cd.webp',
    imagenAlt: 'Robot de grabación e impresión de CD y DVD con estudios médicos',
  } as CapituloHistoria,

  enLinea: {
    titulo: 'La evolución hacia los resultados en línea',
    pregunta: '¿Por qué entregar el estudio físicamente si el paciente y el médico pueden acceder a él en línea?',
    parrafos: [
      'La experiencia acumulada con la distribución física de imágenes llevó a una nueva pregunta.',
      'A partir de esta visión seguimos desarrollando herramientas orientadas a la entrega digital de imágenes y reportes médicos a través de Internet, tanto para pacientes como para médicos referidores.',
      'LINKDICOM desarrollaría después soluciones que permitieron llevar este concepto mucho más lejos, integrando:',
    ],
    lista: [
      'Imágenes médicas en línea.',
      'Reportes asociados.',
      'Acceso remoto.',
      'Portal de pacientes.',
      'Consulta de resultados.',
      'Distribución digital de estudios.',
    ],
    cadena: ['Película radiográfica', 'CD/DVD', 'Entrega automatizada', 'Resultados en línea'],
    imagen: '/img/sectores/entrega-en-linea.webp',
    imagenAlt: 'Paciente consultando su estudio de imagen desde el teléfono',
  } as CapituloHistoria,

  nedical: {
    anio: '2011',
    titulo: 'De NEDICAL LINK a LINKDICOM',
    parrafos: [
      'Durante los primeros años de este proceso, LINKDICOM todavía no existía como empresa. La actividad tecnológica se encontraba vinculada a NEDICAL LINK, nombre que provenía de una etapa empresarial anterior relacionada con Onnetx Server’s, dedicada al mantenimiento, la instalación de redes y la infraestructura tecnológica.',
      'La evolución hacia soluciones especializadas en imágenes médicas fue transformando progresivamente la identidad y el enfoque del proyecto.',
      'Finalmente, en 2011 nace LINKDICOM, enfocada específicamente en el desarrollo de tecnología para imágenes médicas, interoperabilidad y salud digital. La empresa quedaría legalmente constituida como LINKDICOM, SRL el 11 de noviembre de 2016.',
    ],
  } as CapituloHistoria,

  internacional: {
    anio: '2011',
    titulo: 'El comienzo de la colaboración internacional',
    parrafos: [
      'Con LINKDICOM ya en marcha comenzó una nueva etapa, caracterizada por la búsqueda de alianzas tecnológicas fuera de República Dominicana.',
      'Uno de los primeros países donde se estableció una relación estratégica fue Ecuador, mediante la colaboración con Ecuasmart. La relación se basó en el intercambio de conocimiento, tecnologías y desarrollos, con una visión compartida de ampliar las posibilidades de la tecnología aplicada al sector salud.',
      'Posteriormente también contribuimos a abrir camino para que Ecuasmart pudiera introducir otras soluciones en República Dominicana, incluyendo sistemas de facturación clínica que inicialmente no formaban parte del enfoque principal de desarrollo de LINKDICOM.',
    ],
    imagen: '/img/sectores/oviyam.webp',
    imagenAlt: 'Apretón de manos entre LINKDICOM y una organización internacional',
  } as CapituloHistoria,

  ecosistema: {
    anio: '2011 – 2021',
    titulo: 'Un ecosistema que creció con la colaboración',
    texto:
      'Durante los años siguientes, LINKDICOM amplió sus relaciones, colaboraciones y proyectos hacia diferentes mercados. La trayectoria incluyó vínculos con organizaciones y desarrolladores de países como:',
    paises: ['Ecuador', 'Honduras', 'Costa Rica', 'México', 'Uruguay', 'India'],
    textoAportes:
      'Entre estas relaciones también surgieron colaboraciones con proyectos internacionales de código abierto vinculados al ecosistema DICOM.',
    aportes: [
      {
        logo: '/img/internacional/dcm4che.png',
        logoAlt: 'Logotipo de DCM4CHE',
        nombre: 'DCM4CHEE',
        anio: '2011',
        texto: 'Trabajo con las versiones 2.16.0 y 2.17.0, incluyendo integración de tecnologías y traducción al español.',
      },
      {
        logo: '/img/internacional/raster.png',
        logoAlt: 'Logotipo de Raster Images, desarrolladores de Oviyam',
        nombre: 'Oviyam',
        por: 'Raster Images',
        anio: '2013',
        texto: 'Incorporación como visor oficial del ISL/1 y posterior desarrollo de extensiones y adaptaciones.',
      },
      {
        logo: '/img/internacional/orthanc.png',
        logoAlt: 'Logotipo de Orthanc',
        nombre: 'Orthanc',
        anio: '2014',
        texto:
          'Integración con Oviyam y desarrollo de herramientas y adaptaciones relacionadas con la gestión DICOM y el Transfer Syntax.',
      },
      {
        logo: '/img/internacional/raster.png',
        logoAlt: 'Logotipo de Raster Images, desarrolladores de Oviyam',
        nombre: 'Oviyam',
        por: 'Raster Images',
        anio: '2020 – 2021',
        texto: 'Nueva etapa de desarrollo, traducción y extensiones funcionales puestas a disposición de la comunidad.',
      },
    ],
  },

  core: {
    anio: '2022',
    titulo: 'El nacimiento de nuestro Core propio',
    parrafos: [
      'Toda esta trayectoria tuvo un objetivo mayor: aprender, experimentar y desarrollar conocimiento propio.',
      'Después de más de una década trabajando con tecnologías DICOM, visualización, transferencia, almacenamiento, interoperabilidad y flujos de diagnóstico, LINKDICOM inició una nueva etapa tecnológica: desarrollamos nuestro propio Core.',
      'A partir de 2022, LINKDICOM comenzó a consolidar un Core tecnológico propio, junto con su propio entorno de operaciones, integración y arquitectura de soluciones.',
    ],
    destacado:
      'Actualmente, RadiologoX PACS/RIS funciona sobre tecnología propia de LINKDICOM, desarrollada y mantenida enteramente por nuestro equipo.',
    nota:
      'DCM4CHEE, Oviyam y Orthanc ya no constituyen la base tecnológica de nuestras soluciones actuales. Sin embargo, forman parte de una etapa fundamental de nuestra historia.',
    imagen: '/img/sectores/innovacion-continua.webp',
    imagenAlt: 'Equipo de desarrollo de LINKDICOM trabajando en la oficina',
  },

  gracias: {
    titulo: 'Una historia de evolución, colaboración y aprendizaje',
    parrafos: [
      'Aunque actualmente no utilizamos estas aplicaciones como base de nuestras soluciones, mantenemos comunicación con las organizaciones y comunidades relacionadas con ellas, procurando conservar los vínculos construidos durante años y mantener abierta la posibilidad de colaboración mutua en iniciativas que puedan contribuir al desarrollo tecnológico y al beneficio de la sociedad.',
      'En 2026, al celebrar nuestros 10 años como empresa, reconocemos especialmente a quienes formaron parte de ese camino.',
    ],
    citas: [
      {
        logo: '/img/internacional/raster.png',
        logoAlt: 'Logotipo de Raster Images',
        nombre: 'Raster Images',
        rol: 'Desarrolladores de Oviyam',
        cita:
          'Nos complace saber que LINKDICOM celebra su décimo aniversario en 2026. Enhorabuena a todo el equipo de LINKDICOM por este logro tan significativo.',
        nota:
          'Raster Images confirmó expresamente su autorización para que LINKDICOM mencione a Oviyam y a Raster Images como parte de su historial corporativo.',
      },
      {
        logo: '/img/internacional/orthanc.png',
        logoAlt: 'Logotipo de Orthanc',
        nombre: 'Orthanc',
        rol: 'Proyecto de código abierto',
        cita: 'Les deseamos un feliz aniversario y mucho éxito en su negocio.',
      },
    ],
    pie: 'Son palabras sencillas, pero para nosotros tienen un significado especial: representan vínculos construidos durante años de intercambio tecnológico y colaboración internacional.',
  },

  cronologiaTitulo: 'De ISL/1 a RadiologoX',
  cronologiaTexto: 'Más de una década de evolución tecnológica.',
  cronologia: [
    { anio: '2008 – 2010', titulo: 'ISL/1', texto: 'Desarrollo y diseño inicial.', color: '#2563eb' },
    {
      anio: '2010 – 2013',
      titulo: 'ISL/1 en operación',
      texto: 'Implementaciones en SOMARAX, CEMEDI y Centro Médico Integral II.',
      color: '#2563eb',
    },
    { anio: '2011', titulo: 'LINKDICOM', texto: 'Nace la empresa y comienza su etapa empresarial.', color: '#f97316' },
    { anio: '2011', titulo: 'DCM4CHEE', texto: 'Integración y aportes sobre las versiones 2.16.0 y 2.17.0.', color: '#dc2626' },
    { anio: '2013', titulo: 'Oviyam', texto: 'Incorporación como visor del ISL/1.', color: '#7c3aed' },
    { anio: '2014', titulo: 'Orthanc + Oviyam', texto: 'Integración, adaptaciones y herramientas DICOM.', color: '#2563eb' },
    {
      anio: '2019 – 2021',
      titulo: 'Salud digital',
      texto: 'Evolución de herramientas para imágenes, reportes, resultados en línea, portal de pacientes y automatización.',
      color: '#f97316',
    },
    {
      anio: '2020 – 2021',
      titulo: 'Aportes a Oviyam',
      texto: 'Traducciones, extensiones y funcionalidades liberadas a la comunidad.',
      color: '#7c3aed',
    },
    {
      anio: '2022 – Hoy',
      titulo: 'Core LINKDICOM',
      texto: 'Desarrollo y consolidación de arquitectura tecnológica propia.',
      color: '#f97316',
    },
    {
      anio: 'Hoy',
      titulo: 'RadiologoX PACS/RIS',
      texto: 'PACS/RIS basado en Core propio, desarrollado y mantenido enteramente por LINKDICOM.',
      color: '#2563eb',
    },
  ],

  cierre: {
    titulo: 'Una historia que sigue',
    tituloAccent: 'escribiéndose',
    texto:
      'Cada etapa de este recorrido nos trajo hasta aquí. Si quieres saber cómo puede ayudar a tu institución la tecnología que nació de este camino, conversemos.',
    cta: 'Conversemos sobre tu proyecto',
    ctaDestino: 'contacto' as const,
    lema: ['De ISL/1', 'a RadiologoX', 'y lo que viene'],
    imagen: '/img/sectores/cierre-internacional.webp',
    imagenAlt: 'Vista aérea de una ciudad al amanecer',
  },
};
