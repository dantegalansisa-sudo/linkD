import type { IconName } from '../components/ui/Icon';
import { PRIVACIDAD, TERMINOS, type DocumentoLegal } from './legal';

/*
  Politicas y terminos.

  Privacidad y Terminos ya tienen su texto legal completo: llega de `legal.ts`,
  volcado tal cual de los dos documentos del cliente.

  Los otros tres documentos siguen pendientes de redaccion, asi que muestran el
  titulo y el resumen del diseno y avisan de que el texto esta en camino.
*/

export interface PestanaPolitica {
  key: string;
  label: string;
  icon: IconName;
  titulo: string;
  /** Documento real. Cuando falta, la pestana sigue con el resumen del diseno. */
  documento?: DocumentoLegal;
  actualizado?: string;
  intro?: string;
  apartados?: { titulo: string; resumen: string }[];
}

export const POLITICAS = {
  cabecera: {
    slug: 'politicas-y-terminos',
    miga: 'Políticas y Términos',
    titulo: 'Políticas y',
    tituloAccent: 'Términos',
    subtitulo: 'Transparencia, confianza y cumplimiento en todo lo que hacemos',
    intro:
      'En LINKDICOM trabajamos con principios claros que rigen nuestra operación, nuestras relaciones y el uso de nuestras soluciones tecnológicas, garantizando la seguridad de la información, la privacidad de los datos y el cumplimiento de las normativas aplicables.',
    lema: 'Comprometidos con un entorno digital seguro y responsable',
    imagen: '/img/empresa/hero-politicas.webp',
    imagenAlt: 'Recepción de las oficinas de LINKDICOM con el logotipo en la pared',
  },

  pestanas: [
    {
      key: 'privacidad',
      label: 'Política de Privacidad',
      icon: 'shield' as IconName,
      titulo: 'Política de Privacidad',
      documento: PRIVACIDAD,
    },
    {
      key: 'terminos',
      label: 'Términos y Condiciones',
      icon: 'file-text' as IconName,
      titulo: 'Términos y Condiciones de Uso',
      documento: TERMINOS,
    },
    {
      key: 'seguridad',
      label: 'Política de Seguridad',
      icon: 'users' as IconName,
      titulo: 'Política de Seguridad de la Información',
      actualizado: '15 de enero de 2026',
      intro:
        'Protegemos la confidencialidad, integridad y disponibilidad de la información que gestionamos, aplicando controles técnicos y organizativos alineados con las mejores prácticas del sector salud.',
      apartados: [
        { titulo: 'Control de accesos', resumen: 'Quién accede a qué información y con qué permisos.' },
        { titulo: 'Cifrado y respaldo', resumen: 'Protección de los datos en tránsito y en reposo.' },
        { titulo: 'Continuidad del servicio', resumen: 'Planes de recuperación ante incidentes.' },
        { titulo: 'Gestión de incidentes', resumen: 'Cómo detectamos, reportamos y resolvemos incidencias.' },
        { titulo: 'Formación del personal', resumen: 'Concienciación continua del equipo.' },
      ],
    },
    {
      key: 'calidad',
      label: 'Política de Calidad',
      icon: 'settings' as IconName,
      titulo: 'Política de Calidad',
      actualizado: '15 de enero de 2026',
      intro:
        'Nuestro compromiso es entregar soluciones que cumplan con los requisitos de nuestros clientes y con las normativas del sector, mejorando de forma continua nuestros procesos.',
      apartados: [
        { titulo: 'Compromiso con el cliente', resumen: 'Requisitos, expectativas y satisfacción.' },
        { titulo: 'Mejora continua', resumen: 'Revisión periódica de procesos y resultados.' },
        { titulo: 'Control de versiones', resumen: 'Trazabilidad de cada entrega de software.' },
        { titulo: 'Soporte y acompañamiento', resumen: 'Atención durante todo el ciclo de vida.' },
      ],
    },
    {
      key: 'cumplimiento',
      label: 'Cumplimiento Legal',
      icon: 'building' as IconName,
      titulo: 'Cumplimiento Legal y Regulatorio',
      actualizado: '15 de enero de 2026',
      intro:
        'Operamos conforme a la legislación de la República Dominicana y a las normativas aplicables al tratamiento de datos de salud y a la facturación electrónica.',
      apartados: [
        { titulo: 'Marco normativo', resumen: 'Leyes y reglamentos que nos aplican.' },
        { titulo: 'Datos de salud', resumen: 'Tratamiento de información clínica sensible.' },
        { titulo: 'Facturación electrónica', resumen: 'Cumplimiento de los requisitos de la DGII.' },
        { titulo: 'Auditorías', resumen: 'Revisiones internas y externas.' },
      ],
    },
  ] as PestanaPolitica[],

  compromisoTitulo: 'Nuestro compromiso',
  compromisoTexto:
    'La protección de tus datos es fundamental para nosotros. Cumplimos con las leyes y regulaciones aplicables en la República Dominicana y mejores prácticas internacionales en seguridad de la información.',
  compromisoCita: 'Tu confianza nos impulsa a seguir construyendo un entorno digital más seguro.',

  documentosTitulo: 'Documentos relacionados',
  /*
    `pestana` enlaza el documento con su pestana: los dos que ya tienen texto
    se abren aqui mismo. Los demas siguen anunciados como pendientes.
  */
  documentos: [
    { titulo: 'Política de Privacidad', fecha: PRIVACIDAD.actualizado, pestana: 'privacidad' },
    { titulo: 'Términos y Condiciones de Uso', fecha: TERMINOS.actualizado, pestana: 'terminos' },
    { titulo: 'Política de Seguridad de la Información' },
    { titulo: 'Política de Calidad' },
    { titulo: 'Código de Ética y Conducta' },
    { titulo: 'Cumplimiento Legal y Regulatorio' },
  ] as { titulo: string; fecha?: string; pestana?: string }[],

  cierre: {
    titulo: 'Transparencia en cada',
    tituloAccent: 'conexión',
    texto: 'En LINKDICOM creemos que la tecnología avanza mejor cuando se construye sobre la confianza y el respeto.',
    cta: 'Contáctanos',
    ctaDestino: 'contacto' as const,
    items: [
      { icon: 'shield' as IconName, label: 'Protección de datos' },
      { icon: 'users' as IconName, label: 'Cumplimiento normativo' },
      { icon: 'file-text' as IconName, label: 'Gestión responsable' },
      { icon: 'lock' as IconName, label: 'Confianza a largo plazo' },
    ],
    imagen: '/img/empresa/cierre-politicas.webp',
    imagenAlt: 'Portátil mostrando un escudo de seguridad digital',
  },
};
