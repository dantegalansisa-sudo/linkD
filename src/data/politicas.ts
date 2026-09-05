import type { IconName } from '../components/ui/Icon';

/*
  Politicas y terminos.

  Los apartados llevan por ahora el titulo y el resumen que muestra el diseno.
  El texto legal completo lo tiene que redactar el cliente: cuando llegue, se
  rellena `cuerpo` en cada apartado y el acordeon lo despliega.
*/
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
    imagenAlt: 'Recepción de las oficinas de LINKDICOM con el logotipo en la pared',
  },

  pestanas: [
    {
      key: 'privacidad',
      label: 'Política de Privacidad',
      icon: 'shield' as IconName,
      titulo: 'Política de Privacidad',
      actualizado: '15 de enero de 2026',
      intro:
        'En LINKDICOM, S.R.L. valoramos y protegemos la información personal de nuestros usuarios, clientes, colaboradores y demás relacionados. Esta política describe cómo recopilamos, usamos, almacenamos y protegemos la información que nos proporcionas a través de nuestros sitios web, sistemas, servicios y comunicaciones.',
      apartados: [
        { titulo: 'Información que recopilamos', resumen: 'Tipos de datos personales y fuentes de obtención.' },
        { titulo: 'Uso de la información', resumen: 'Finalidades del tratamiento de tus datos.' },
        { titulo: 'Protección de la información', resumen: 'Medidas de seguridad implementadas.' },
        { titulo: 'Compartición de datos', resumen: 'Con quién compartimos tu información y bajo qué condiciones.' },
        { titulo: 'Tus derechos', resumen: 'Acceso, rectificación, eliminación y otros derechos.' },
        { titulo: 'Cookies y tecnologías similares', resumen: 'Uso de cookies para mejorar tu experiencia.' },
        { titulo: 'Cambios en esta política', resumen: 'Cómo y cuándo te notificaremos sobre actualizaciones.' },
        { titulo: 'Contacto', resumen: 'Información para consultas sobre privacidad.' },
      ],
    },
    {
      key: 'terminos',
      label: 'Términos de Uso',
      icon: 'file-text' as IconName,
      titulo: 'Términos de Uso',
      actualizado: '15 de enero de 2026',
      intro:
        'Estos términos regulan el acceso y uso de los sitios web, portales y soluciones de LINKDICOM, S.R.L. Al utilizarlos, aceptas las condiciones descritas a continuación.',
      apartados: [
        { titulo: 'Aceptación de los términos', resumen: 'Alcance y vigencia de estas condiciones.' },
        { titulo: 'Uso permitido', resumen: 'Qué puedes y qué no puedes hacer con nuestras plataformas.' },
        { titulo: 'Cuentas y credenciales', resumen: 'Responsabilidad sobre el acceso a los sistemas.' },
        { titulo: 'Propiedad intelectual', resumen: 'Titularidad del software, marcas y contenidos.' },
        { titulo: 'Limitación de responsabilidad', resumen: 'Alcance de nuestra responsabilidad.' },
        { titulo: 'Legislación aplicable', resumen: 'Normativa que rige estos términos.' },
      ],
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
  ],

  compromisoTitulo: 'Nuestro compromiso',
  compromisoTexto:
    'La protección de tus datos es fundamental para nosotros. Cumplimos con las leyes y regulaciones aplicables en la República Dominicana y mejores prácticas internacionales en seguridad de la información.',
  compromisoCita: 'Tu confianza nos impulsa a seguir construyendo un entorno digital más seguro.',

  documentosTitulo: 'Documentos relacionados',
  documentos: [
    { titulo: 'Política de Privacidad', fecha: '15 ene 2026' },
    { titulo: 'Términos de Uso', fecha: '15 ene 2026' },
    { titulo: 'Política de Seguridad de la Información', fecha: '15 ene 2026' },
    { titulo: 'Política de Calidad', fecha: '15 ene 2026' },
    { titulo: 'Código de Ética y Conducta', fecha: '10 feb 2025' },
    { titulo: 'Cumplimiento Legal y Regulatorio', fecha: '15 ene 2026' },
  ],

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
    imagenAlt: 'Portátil mostrando un escudo de seguridad digital',
  },
};
