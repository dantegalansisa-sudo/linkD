/*
  Jornadas ya realizadas del Programa Virginia Toca, cada una con su pagina
  (/empresa/obra-social/:slug): video resumen, galeria, agradecimientos y
  cifras. Las fotos y los videos son los que entrego el cliente; los textos
  van como estan en su diseno.
*/

import type { Jornada, PiezaGaleria } from '../contenido/tipos';

export type { PiezaGaleria };
/** Nombre anterior del tipo. */
export type EventoObraSocial = Jornada;

export const EVENTOS_OBRA_SOCIAL: Jornada[] = [
  {
    slug: 'utiles-escolares-yaguate-2026',
    miga: 'Útiles Escolares 2026',
    titulo: 'Ayuda de Útiles Escolares – Regreso a Clases · 5 Jul. 2026',
    tituloCorto: 'Ayuda de Útiles Escolares – Regreso a Clases',
    fechaISO: '2026-07-05',
    lugar: 'Escuela Básica La Esperanza, Santo Domingo Este',
    publicado: true,
    resumen:
      'Una jornada de solidaridad para acompañar a familias en el regreso a clases, entregando mochilas preparadas con útiles escolares para niñas y niños de la comunidad.',
    descripcion:
      'Apoyo con la entrega de 50 mochilas con 4 cuadernos, lápices, lapiceros, crayolas, reglas, sacapuntas, marcadores, correctores y otros útiles escolares.',
    portada: '/img/obra-social/utiles-2026/portada.webp',
    portadaAlt: 'Entrega de mochilas con útiles escolares a niñas y niños del Programa Virginia Toca',
    video: { src: '/video/obra-social/utiles-2026-resumen.mp4', poster: '/video/obra-social/utiles-2026-resumen.jpg' },
    galeriaTexto:
      'Las imágenes de la jornada de entrega de mochilas y útiles escolares a niñas y niños de Yaguate, San Cristóbal, el 5 de julio de 2026.',
    galeria: [
      { tipo: 'video', src: '/video/obra-social/utiles-2026-resumen.mp4', poster: '/video/obra-social/utiles-2026-resumen.jpg', alt: 'Video resumen de la entrega de útiles escolares' },
      ...Array.from({ length: 14 }, (_, i) => ({
        tipo: 'foto' as const,
        src: `/img/obra-social/utiles-2026/foto-${String(i + 1).padStart(2, '0')}.webp`,
        alt: `Entrega de útiles escolares en Yaguate, foto ${i + 1}`,
      })),
    ],
    nota: {
      icon: 'graduation',
      titulo: '50 mochilas entregadas',
      texto: 'Cada mochila incluyó 4 cuadernos, lápices, lapiceros, crayolas, reglas, sacapuntas, marcadores, correctores y otros útiles escolares.',
    },
    iniciativa: {
      titulo: 'Una iniciativa que nace desde LINKDICOM',
      parrafos: [
        'La iniciativa de esta jornada fue impulsada por la Licda. Esmirna Batista, Administradora de LINKDICOM, como parte del compromiso de la empresa con las comunidades y con el acompañamiento a las familias durante el regreso a clases.',
        'Nos acompañó la Sra. Leonisa Bruján, quien por ser de la zona nos ayudó a localizar las familias beneficiarias y colaboró con la captura de fotografías y videos de la jornada.',
      ],
    },
    cifras: [
      { icon: 'users', valor: '+50', label: 'Familias beneficiadas' },
      { icon: 'graduation', valor: '50', label: 'Mochilas entregadas' },
      { icon: 'handshake', valor: '+15', label: 'Colaboradores voluntarios' },
      { icon: 'home', valor: '+1', label: 'Gran objetivo: comunidades más fuertes' },
    ],
  },
  {
    slug: 'cena-navidena-yaguate-2025',
    miga: 'Cena Navideña 2025',
    titulo: 'Ayuda Yaguate – Cena Navideña 24 Dic. 2025',
    tituloCorto: 'Entrega de cenas navideñas',
    fechaISO: '2025-12-24',
    lugar: 'Yaguate, San Cristóbal',
    publicado: true,
    resumen:
      'Una jornada de solidaridad, realizada con mucho amor para llevar alimentos y esperanza a familias de Yaguate, San Cristóbal.',
    descripcion:
      'El 24 de diciembre de 2025, llevamos cenas navideñas a familias de escasos recursos en Yaguate, San Cristóbal, compartiendo alegría y solidaridad en estas fechas especiales.',
    portada: '/img/obra-social/cena-2025/portada-familia.webp',
    portadaAlt: 'Entrega de una cena navideña a una familia de Yaguate',
    video: { src: '/video/obra-social/cena-2025-resumen.mp4', poster: '/video/obra-social/cena-2025-resumen.jpg' },
    galeriaTexto:
      'Aquí están las imágenes que con mucho amor realizamos a familias que las necesitaban, en Yaguate, San Cristóbal, el 24 de diciembre de 2025, donde estuvimos contando con la participación voluntaria de los colaboradores de LINKDICOM.',
    galeria: [
      { tipo: 'video', src: '/video/obra-social/cena-2025-resumen.mp4', poster: '/video/obra-social/cena-2025-resumen.jpg', alt: 'Video resumen de la cena navideña' },
      { tipo: 'video', src: '/video/obra-social/cena-2025-clip.mp4', poster: '/video/obra-social/cena-2025-clip.jpg', alt: 'Momento de la entrega de alimentos' },
      // la foto 07 se retiro (persona ajena a la empresa); se conservan los numeros originales
      ...[1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12].map((n, i) => ({
        tipo: 'foto' as const,
        src: `/img/obra-social/cena-2025/foto-${String(n).padStart(2, '0')}.webp`,
        alt: `Entrega de cenas navideñas en Yaguate, foto ${i + 1}`,
      })),
    ],
    agradecimiento: {
      logo: '/img/obra-social/aprezio.webp',
      logoAlt: 'Logotipo de Supermercados Aprezio',
      nombre: 'Supermercados Aprezio',
      parrafos: [
        'Nuestro especial agradecimiento al personal de Supermercados Aprezio, quienes nos brindaron su apoyo y facilidades en la adquisición de los productos destinados a las familias de Yaguate, San Cristóbal.',
        'Agradecemos especialmente a su personal de carga y logística, quienes en todo momento estuvieron atentos y colaborando en el proceso, contribuyendo a que esta jornada pudiera realizarse de manera exitosa.',
      ],
      fotos: ['/img/obra-social/cena-2025/foto-10.webp', '/img/obra-social/cena-2025/foto-12.webp'],
      cierre: '¡Gracias por ser parte de esta causa! Su apoyo, disposición y excelente servicio fueron fundamentales para llevar esperanza a más familias.',
    },
    cifras: [
      { icon: 'users', valor: '+50', label: 'Familias beneficiadas' },
      { icon: 'gift', valor: '+1,200', label: 'Libras de alimentos entregados' },
      { icon: 'handshake', valor: '+15', label: 'Colaboradores voluntarios' },
      { icon: 'home', valor: '+1', label: 'Gran objetivo: comunidades más fuertes' },
    ],
  },
];
