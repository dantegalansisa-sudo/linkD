import type { IconName } from '../components/ui/Icon';
import { CALIDAD, CUMPLIMIENTO, PRIVACIDAD, SEGURIDAD, TERMINOS, type DocumentoLegal } from './legal';

/*
  Politicas y terminos.

  Los cinco documentos llegan de `legal.ts`, volcados tal cual de los textos
  del cliente. Los tres ultimos (seguridad, calidad y cumplimiento) no traen
  fecha de actualizacion, asi que la pestana no la muestra.
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
      icon: 'lock' as IconName,
      titulo: 'Política de Seguridad de la Información',
      documento: SEGURIDAD,
    },
    {
      key: 'calidad',
      label: 'Política de Calidad',
      icon: 'settings' as IconName,
      titulo: 'Política de Calidad',
      documento: CALIDAD,
    },
    {
      key: 'cumplimiento',
      label: 'Cumplimiento Legal',
      icon: 'building' as IconName,
      titulo: 'Cumplimiento Legal y Regulatorio',
      documento: CUMPLIMIENTO,
    },
  ] as PestanaPolitica[],

  compromisoTitulo: 'Nuestro compromiso',
  compromisoTexto:
    'La protección de tus datos es fundamental para nosotros. Cumplimos con las leyes y regulaciones aplicables en la República Dominicana y mejores prácticas internacionales en seguridad de la información.',
  compromisoCita: 'Tu confianza nos impulsa a seguir construyendo un entorno digital más seguro.',

  documentosTitulo: 'Documentos relacionados',
  /*
    `pestana` enlaza cada documento con su pestana. Sin `pestana` no hay
    texto todavia y se anuncia como pendiente.
  */
  documentos: [
    { titulo: 'Política de Privacidad', fecha: PRIVACIDAD.actualizado, pestana: 'privacidad' },
    { titulo: 'Términos y Condiciones de Uso', fecha: TERMINOS.actualizado, pestana: 'terminos' },
    { titulo: 'Política de Seguridad de la Información', pestana: 'seguridad' },
    { titulo: 'Política de Calidad', pestana: 'calidad' },
    { titulo: 'Cumplimiento Legal y Regulatorio', pestana: 'cumplimiento' },
    // el codigo de etica no ha llegado: sigue anunciado como pendiente
    { titulo: 'Código de Ética y Conducta' },
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
