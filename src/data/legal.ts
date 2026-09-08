/*
  Textos legales.

  Los dos documentos llegaron del cliente en texto plano y se vuelcan aqui tal
  cual: son textos legales, asi que no se resumen ni se reescriben. Cada
  apartado del original es una seccion y el acordeon de la pagina de Politicas
  los despliega uno a uno.

  Los otros tres documentos (seguridad, calidad y cumplimiento) siguen
  pendientes de redaccion; viven en `politicas.ts` con su resumen.
*/

/** Un parrafo, una lista, un subtitulo o el bloque de datos de contacto. */
export interface BloqueLegal {
  tipo: 'p' | 'lista' | 'sub' | 'datos';
  texto?: string;
  items?: string[];
}

export interface SeccionLegal {
  titulo: string;
  cuerpo: BloqueLegal[];
}

export interface DocumentoLegal {
  key: string;
  titulo: string;
  /** Fecha declarada en el propio documento. */
  actualizado: string;
  /** Parrafos de entrada, antes del articulado. */
  intro: string[];
  secciones: SeccionLegal[];
}

export const PRIVACIDAD: DocumentoLegal = {
  key: 'privacidad',
  titulo: 'Política de privacidad',
  actualizado: '8 de septiembre de 2026',
  intro: [
    'LINKDICOM, S.R.L. (“LINKDICOM”, “nosotros” o “la empresa”), con domicilio en la República Dominicana, reconoce la importancia de proteger la privacidad y los datos personales de las personas que visitan nuestro sitio web, utilizan nuestros canales digitales, completan formularios, solicitan información o mantienen una relación comercial con nosotros.',
    'La presente Política de Privacidad explica qué información podemos recopilar, para qué podemos utilizarla, cómo procuramos protegerla y cuáles son los derechos que corresponden a sus titulares.',
    'Esta Política aplica principalmente a la información recopilada a través del sitio web institucional de LINKDICOM y de los canales digitales asociados a este.',
    'Cuando determinados servicios, aplicaciones o plataformas de LINKDICOM requieran un tratamiento específico de datos personales, podrá existir documentación, contrato, aviso de privacidad o condiciones particulares aplicables a dichos servicios.',
  ],
  secciones: [
    {
      titulo: 'Responsable del tratamiento',
      cuerpo: [
        { tipo: 'p', texto: 'El responsable del tratamiento de los datos personales recopilados directamente a través de este sitio web es:' },
        {
          tipo: 'datos',
          items: [
            'LINKDICOM, S.R.L.',
            'República Dominicana',
            'Correo electrónico de contacto: info@linkdicom.com',
          ],
        },
        { tipo: 'p', texto: 'Para determinadas operaciones, LINKDICOM podrá actuar como responsable del tratamiento o, cuando corresponda, como encargado del tratamiento por cuenta de una institución, empresa, centro de salud u otra organización cliente.' },
      ],
    },
    {
      titulo: 'Información que podemos recopilar',
      cuerpo: [
        { tipo: 'p', texto: 'Dependiendo de la interacción que usted tenga con nuestro sitio web, podemos recopilar información como:' },
        {
          tipo: 'lista',
          items: [
            'Nombre y apellido.',
            'Nombre de la empresa, institución o centro de salud.',
            'Cargo o función profesional.',
            'Dirección de correo electrónico.',
            'Número de teléfono.',
            'País, ciudad u otra información de ubicación proporcionada voluntariamente.',
            'Información relacionada con una solicitud comercial o de servicio.',
            'Información proporcionada al solicitar una demostración, cotización, soporte o contacto.',
            'Información necesaria para procesos de facturación o contratación, cuando corresponda.',
            'Información técnica relacionada con el uso del sitio web, como dirección IP, navegador, sistema operativo, dispositivo, páginas visitadas y datos similares.',
            'Información proporcionada voluntariamente mediante formularios, correos electrónicos u otros canales oficiales de comunicación.',
          ],
        },
        { tipo: 'p', texto: 'LINKDICOM procurará recopilar únicamente la información que resulte adecuada, pertinente y necesaria para la finalidad correspondiente.' },
      ],
    },
    {
      titulo: 'Datos personales relacionados con la salud',
      cuerpo: [
        { tipo: 'p', texto: 'LINKDICOM desarrolla y comercializa tecnologías destinadas al sector salud. Por esta razón, es importante distinguir entre la información recopilada mediante el sitio web institucional y los datos clínicos que puedan ser tratados mediante sistemas tecnológicos contratados por instituciones de salud.' },
        { tipo: 'p', texto: 'La información relacionada con la salud constituye una categoría especialmente protegida por la legislación dominicana.' },
        { tipo: 'p', texto: 'El sitio web institucional de LINKDICOM no está destinado a que los usuarios introduzcan información clínica, diagnósticos, imágenes médicas, resultados de estudios u otros datos sensibles de pacientes, salvo que expresamente se habilite una funcionalidad específica para ello.' },
        { tipo: 'p', texto: 'Cuando LINKDICOM opere una plataforma o servicio tecnológico contratado por una institución de salud y dicho servicio implique el tratamiento de datos personales o datos relacionados con la salud, dicho tratamiento estará sujeto a las condiciones contractuales, técnicas y legales aplicables al servicio correspondiente.' },
        { tipo: 'p', texto: 'En estos casos, LINKDICOM podrá actuar como encargado del tratamiento por cuenta de la institución responsable de los datos, según corresponda.' },
      ],
    },
    {
      titulo: 'Finalidades del tratamiento',
      cuerpo: [
        { tipo: 'p', texto: 'La información recopilada podrá utilizarse para las siguientes finalidades:' },
        { tipo: 'sub', texto: 'Atención de solicitudes' },
        { tipo: 'p', texto: 'Responder preguntas, solicitudes de información, demostraciones, cotizaciones, reuniones, soporte y comunicaciones realizadas por los usuarios.' },
        { tipo: 'sub', texto: 'Relación comercial' },
        { tipo: 'p', texto: 'Gestionar procesos relacionados con clientes, prospectos, proveedores, socios comerciales y otras relaciones profesionales.' },
        { tipo: 'sub', texto: 'Prestación de servicios' },
        { tipo: 'p', texto: 'Gestionar, mantener, configurar, soportar y mejorar los servicios contratados por nuestros clientes.' },
        { tipo: 'sub', texto: 'Comunicación' },
        { tipo: 'p', texto: 'Enviar comunicaciones relacionadas con solicitudes realizadas por el usuario, servicios contratados, actualizaciones importantes, soporte, mantenimiento, seguridad o información administrativa.' },
        { tipo: 'sub', texto: 'Información comercial' },
        { tipo: 'p', texto: 'Cuando corresponda y exista una base legal o consentimiento aplicable, enviar información sobre productos, servicios, novedades, eventos, promociones, publicaciones o actividades de LINKDICOM.' },
        { tipo: 'p', texto: 'El usuario podrá solicitar en cualquier momento dejar de recibir comunicaciones comerciales.' },
        { tipo: 'sub', texto: 'Seguridad' },
        { tipo: 'p', texto: 'Detectar, prevenir y gestionar accesos no autorizados, fraude, abuso, actividades maliciosas, incidentes de seguridad u otros usos indebidos de nuestros sistemas.' },
        { tipo: 'sub', texto: 'Mejora del sitio y servicios' },
        { tipo: 'p', texto: 'Analizar de forma agregada o estadística el uso de nuestro sitio web y nuestros servicios para mejorar su funcionamiento, contenido, seguridad y experiencia de usuario.' },
      ],
    },
    {
      titulo: 'Base y legitimidad del tratamiento',
      cuerpo: [
        { tipo: 'p', texto: 'LINKDICOM tratará los datos personales de acuerdo con la legislación aplicable y, cuando corresponda, con el consentimiento del titular.' },
        { tipo: 'p', texto: 'La Ley núm. 172-13 establece principios relacionados con la licitud, calidad, información, consentimiento, seguridad y finalidad del tratamiento de datos personales.' },
        { tipo: 'p', texto: 'Dependiendo de la situación, el tratamiento podrá estar fundamentado, entre otros supuestos, en:' },
        {
          tipo: 'lista',
          items: [
            'El consentimiento del titular.',
            'La ejecución de una relación contractual o comercial.',
            'El cumplimiento de obligaciones legales.',
            'La atención de una solicitud realizada por el propio titular.',
            'La protección de la seguridad de nuestros sistemas.',
            'Otros fundamentos permitidos por la legislación aplicable.',
          ],
        },
        { tipo: 'p', texto: 'Cuando el tratamiento requiera consentimiento, este será solicitado de manera que permita al titular conocer razonablemente la finalidad para la cual serán utilizados sus datos.' },
      ],
    },
    {
      titulo: 'Conservación de los datos',
      cuerpo: [
        { tipo: 'p', texto: 'LINKDICOM conservará los datos personales durante el período que resulte necesario para cumplir con las finalidades para las cuales fueron recopilados, atender obligaciones contractuales o legales, resolver reclamaciones, mantener registros necesarios o proteger los derechos e intereses legítimos de la empresa.' },
        { tipo: 'p', texto: 'Cuando los datos ya no sean necesarios y no exista una obligación legal o contractual que justifique su conservación, podrán ser eliminados, anonimizados o sometidos a medidas de bloqueo o conservación limitada, según corresponda.' },
        { tipo: 'p', texto: 'La cancelación o eliminación de información podrá estar sujeta a excepciones cuando exista una obligación legal o contractual de conservar determinados registros. La Ley 172-13 contempla expresamente esta circunstancia.' },
      ],
    },
    {
      titulo: 'Seguridad de la información',
      cuerpo: [
        { tipo: 'p', texto: 'LINKDICOM adopta medidas técnicas, administrativas y organizativas razonables destinadas a proteger los datos personales contra:' },
        {
          tipo: 'lista',
          items: [
            'Acceso no autorizado.',
            'Alteración.',
            'Pérdida.',
            'Destrucción.',
            'Divulgación indebida.',
            'Uso no autorizado.',
            'Tratamientos incompatibles con la finalidad correspondiente.',
          ],
        },
        { tipo: 'p', texto: 'Estas medidas podrán incluir controles de acceso, autenticación, gestión de permisos, mecanismos de protección de infraestructura, respaldos, monitoreo, actualización de sistemas y otras medidas de seguridad apropiadas según la naturaleza de la información y el riesgo asociado.' },
        { tipo: 'p', texto: 'No obstante, ningún sistema informático, transmisión por Internet o mecanismo de almacenamiento puede garantizar seguridad absoluta.' },
      ],
    },
    {
      titulo: 'Confidencialidad',
      cuerpo: [
        { tipo: 'p', texto: 'LINKDICOM procurará limitar el acceso a información personal únicamente a las personas, colaboradores, proveedores o encargados que necesiten acceder a ella para cumplir una finalidad legítima y autorizada.' },
        { tipo: 'p', texto: 'Las personas que tengan acceso a información personal estarán sujetas a obligaciones de confidencialidad y a las políticas internas correspondientes.' },
      ],
    },
    {
      titulo: 'Comunicación y transferencia de datos a terceros',
      cuerpo: [
        { tipo: 'p', texto: 'LINKDICOM no vende datos personales de sus usuarios.' },
        { tipo: 'p', texto: 'Los datos podrán ser comunicados o tratados por terceros únicamente cuando resulte necesario y permitido por la legislación aplicable, por ejemplo:' },
        {
          tipo: 'lista',
          items: [
            'Proveedores tecnológicos.',
            'Proveedores de alojamiento o infraestructura.',
            'Proveedores de correo electrónico o comunicaciones.',
            'Proveedores de herramientas de analítica o seguridad.',
            'Proveedores de servicios profesionales.',
            'Socios tecnológicos involucrados en la prestación de un servicio.',
            'Autoridades públicas o judiciales cuando exista obligación legal.',
          ],
        },
        { tipo: 'p', texto: 'Cuando resulte aplicable, LINKDICOM procurará que dichos terceros utilicen la información únicamente para la finalidad autorizada y adopten medidas razonables de protección.' },
      ],
    },
    {
      titulo: 'Transferencias internacionales',
      cuerpo: [
        { tipo: 'p', texto: 'Algunos proveedores tecnológicos utilizados para operar servicios digitales pueden encontrarse fuera de la República Dominicana.' },
        { tipo: 'p', texto: 'Cuando sea necesario transferir o permitir el tratamiento de datos personales fuera del territorio nacional, LINKDICOM procurará realizarlo de conformidad con la legislación aplicable y adoptando medidas razonables para preservar la confidencialidad y seguridad de la información.' },
        { tipo: 'p', texto: 'La Ley 172-13 contempla expresamente la transferencia internacional de datos personales y define al exportador e importador de datos dentro de este contexto.' },
      ],
    },
    {
      titulo: 'Cookies',
      cuerpo: [
        { tipo: 'p', texto: 'Nuestro sitio web puede utilizar cookies y tecnologías similares para determinadas funciones técnicas, de seguridad, análisis y mejora de la experiencia del usuario.' },
        { tipo: 'p', texto: 'Las cookies pueden utilizarse, entre otras finalidades, para:' },
        {
          tipo: 'lista',
          items: [
            'Mantener determinadas funcionalidades del sitio.',
            'Recordar preferencias.',
            'Analizar el funcionamiento del sitio.',
            'Obtener estadísticas de navegación.',
            'Detectar problemas técnicos.',
            'Mejorar el rendimiento y la experiencia de usuario.',
          ],
        },
        { tipo: 'p', texto: 'Algunas cookies pueden ser colocadas directamente por LINKDICOM y otras podrían corresponder a proveedores tecnológicos utilizados por el sitio.' },
        { tipo: 'p', texto: 'El usuario puede configurar su navegador para aceptar, bloquear o eliminar cookies. Sin embargo, determinadas funcionalidades del sitio podrían verse afectadas si se deshabilitan algunas cookies técnicas.' },
        { tipo: 'p', texto: 'LINKDICOM no deberá afirmar que todas las cookies son eliminadas automáticamente o que ninguna cookie puede identificar al usuario, ya que esto dependerá de la configuración real del sitio y de los servicios tecnológicos utilizados.' },
      ],
    },
    {
      titulo: 'Herramientas de terceros',
      cuerpo: [
        { tipo: 'p', texto: 'Nuestro sitio web podría utilizar herramientas de terceros para determinadas funciones, tales como:' },
        {
          tipo: 'lista',
          items: [
            'Analítica web.',
            'Mapas.',
            'Formularios.',
            'Videos.',
            'Redes sociales.',
            'Servicios de comunicación.',
            'Seguridad.',
            'Infraestructura y alojamiento.',
          ],
        },
        { tipo: 'p', texto: 'Estos servicios pueden recopilar información directamente desde el navegador del usuario conforme a sus propias políticas y condiciones.' },
        { tipo: 'p', texto: 'Por esta razón, recomendamos consultar también las políticas de privacidad de los proveedores correspondientes cuando interactúe con sus servicios.' },
      ],
    },
    {
      titulo: 'Enlaces a sitios externos',
      cuerpo: [
        { tipo: 'p', texto: 'Nuestro sitio web puede contener enlaces hacia páginas web, plataformas o servicios de terceros.' },
        { tipo: 'p', texto: 'Una vez que el usuario abandona el sitio web de LINKDICOM, el tratamiento de sus datos estará sujeto a las políticas y condiciones del sitio externo correspondiente.' },
        { tipo: 'p', texto: 'LINKDICOM no controla las políticas de privacidad, prácticas de seguridad o contenido de sitios web de terceros.' },
      ],
    },
    {
      titulo: 'Derechos del titular de los datos',
      cuerpo: [
        { tipo: 'p', texto: 'De conformidad con la legislación aplicable, los titulares podrán ejercer, según corresponda, derechos relacionados con sus datos personales, incluyendo:' },
        {
          tipo: 'lista',
          items: [
            'Acceso: conocer qué información personal puede estar siendo tratada.',
            'Rectificación: solicitar la corrección de información incorrecta.',
            'Actualización: solicitar la actualización de información que haya quedado desactualizada.',
            'Cancelación o supresión: solicitar la eliminación cuando legalmente corresponda.',
            'Oposición: oponerse a determinados tratamientos cuando resulte procedente.',
            'Información: conocer la finalidad y uso previsto de sus datos.',
          ],
        },
        { tipo: 'p', texto: 'La Ley 172-13 reconoce estos derechos y establece mecanismos para su ejercicio.' },
      ],
    },
    {
      titulo: 'Ejercicio de los derechos',
      cuerpo: [
        { tipo: 'p', texto: 'Para realizar una solicitud relacionada con sus datos personales, el titular podrá comunicarse con LINKDICOM mediante:' },
        { tipo: 'p', texto: 'Correo electrónico: info@linkdicom.com' },
        { tipo: 'p', texto: 'La solicitud deberá proporcionar información suficiente para permitir verificar la identidad del solicitante y localizar razonablemente los datos correspondientes.' },
        { tipo: 'p', texto: 'LINKDICOM podrá solicitar información adicional cuando resulte necesaria para comprobar la identidad del solicitante o proteger los datos frente a solicitudes fraudulentas.' },
        { tipo: 'p', texto: 'Las solicitudes serán atendidas conforme a los procedimientos y plazos establecidos por la legislación aplicable.' },
      ],
    },
    {
      titulo: 'Comunicaciones comerciales',
      cuerpo: [
        { tipo: 'p', texto: 'Cuando un usuario haya autorizado o exista una base legal aplicable para recibir comunicaciones comerciales, LINKDICOM podrá enviar información relacionada con:' },
        {
          tipo: 'lista',
          items: [
            'Nuevos productos.',
            'Nuevos servicios.',
            'Actualizaciones tecnológicas.',
            'Eventos.',
            'Noticias.',
            'Publicaciones.',
            'Ofertas o promociones.',
            'Actividades institucionales.',
          ],
        },
        { tipo: 'p', texto: 'El usuario podrá solicitar en cualquier momento la suspensión de este tipo de comunicaciones.' },
        { tipo: 'p', texto: 'La cancelación de comunicaciones comerciales no necesariamente implica la eliminación de todas las comunicaciones, ya que LINKDICOM podrá continuar enviando comunicaciones estrictamente necesarias relacionadas con servicios contratados, seguridad, obligaciones contractuales o asuntos administrativos.' },
      ],
    },
    {
      titulo: 'Datos proporcionados voluntariamente',
      cuerpo: [
        { tipo: 'p', texto: 'El usuario es responsable de procurar que la información que proporcione a LINKDICOM sea correcta, actualizada y legítimamente proporcionada.' },
        { tipo: 'p', texto: 'No deberá introducir en formularios públicos del sitio información confidencial de pacientes, historias clínicas, diagnósticos, imágenes médicas, resultados de estudios u otros datos sensibles, salvo que LINKDICOM haya habilitado expresamente un mecanismo destinado a recibir dicha información.' },
      ],
    },
    {
      titulo: 'Menores de edad',
      cuerpo: [
        { tipo: 'p', texto: 'Los servicios institucionales y comerciales de LINKDICOM no están dirigidos deliberadamente a menores de edad para la recopilación de datos personales.' },
        { tipo: 'p', texto: 'Cuando un servicio específico requiera tratar información relacionada con menores, dicho tratamiento deberá realizarse de acuerdo con la legislación aplicable y las condiciones particulares del servicio.' },
      ],
    },
    {
      titulo: 'Prevención del fraude y seguridad digital',
      cuerpo: [
        { tipo: 'p', texto: 'LINKDICOM podrá utilizar información técnica y registros de actividad para detectar y prevenir:' },
        {
          tipo: 'lista',
          items: [
            'Intentos de acceso no autorizado.',
            'Suplantación de identidad.',
            'Fraude.',
            'Ataques informáticos.',
            'Uso abusivo de las plataformas.',
            'Actividades maliciosas.',
            'Manipulación de formularios o servicios.',
            'Otras conductas que puedan comprometer la seguridad de usuarios, clientes o sistemas.',
          ],
        },
        { tipo: 'p', texto: 'Cuando corresponda, LINKDICOM podrá conservar determinados registros y poner información a disposición de las autoridades competentes cuando exista una obligación legal o requerimiento válido.' },
        { tipo: 'p', texto: 'El nuevo Código Penal dominicano contempla, entre otras conductas, la captación y uso no consentido de datos personales, incluyendo la recolección, conservación, comercialización, acceso o divulgación ilícita de datos personales bajo las condiciones establecidas por la ley.' },
      ],
    },
    {
      titulo: 'Protección de la información frente a accesos no autorizados',
      cuerpo: [
        { tipo: 'p', texto: 'Queda expresamente prohibido intentar obtener, acceder, modificar, extraer, divulgar o utilizar información personal perteneciente a otros usuarios sin autorización.' },
        { tipo: 'p', texto: 'LINKDICOM podrá adoptar medidas técnicas y legales para investigar incidentes de seguridad y proteger sus sistemas y la información bajo su responsabilidad.' },
      ],
    },
    {
      titulo: 'Datos de clientes de servicios de salud',
      cuerpo: [
        { tipo: 'p', texto: 'Cuando LINKDICOM proporcione soluciones tecnológicas a hospitales, clínicas, centros diagnósticos, consultorios u otras instituciones de salud, la responsabilidad sobre los datos personales introducidos por dichas instituciones dependerá de la naturaleza del servicio y de las funciones que correspondan a cada parte.' },
        { tipo: 'p', texto: 'En determinados escenarios:' },
        { tipo: 'p', texto: 'La institución de salud puede actuar como responsable de los datos, mientras que LINKDICOM puede actuar como proveedor tecnológico o encargado del tratamiento.' },
        { tipo: 'p', texto: 'Esto resulta especialmente relevante respecto de información de pacientes, estudios médicos, imágenes diagnósticas, informes radiológicos y otros datos relacionados con la salud.' },
        { tipo: 'p', texto: 'Las condiciones específicas de tratamiento, seguridad, acceso, conservación, respaldo, transferencia y eliminación de dichos datos podrán establecerse mediante contratos, acuerdos de servicio y documentación técnica específica.' },
      ],
    },
    {
      titulo: 'No utilización de los datos para fines incompatibles',
      cuerpo: [
        { tipo: 'p', texto: 'LINKDICOM no utilizará deliberadamente los datos personales recopilados a través de sus canales para finalidades incompatibles con aquellas para las cuales fueron obtenidos, salvo que exista una base legal que permita dicho tratamiento.' },
        { tipo: 'p', texto: 'Asimismo, procurará limitar la recopilación de información a aquella que resulte adecuada, pertinente y necesaria para la finalidad correspondiente, en línea con los principios establecidos por la legislación dominicana.' },
      ],
    },
    {
      titulo: 'Cambios a esta Política de Privacidad',
      cuerpo: [
        { tipo: 'p', texto: 'LINKDICOM podrá modificar, actualizar o ampliar esta Política de Privacidad cuando resulte necesario para reflejar:' },
        {
          tipo: 'lista',
          items: [
            'Cambios en nuestros servicios.',
            'Cambios tecnológicos.',
            'Nuevas funcionalidades del sitio.',
            'Cambios en nuestras prácticas de tratamiento.',
            'Modificaciones legales o regulatorias.',
            'Recomendaciones de seguridad.',
          ],
        },
        { tipo: 'p', texto: 'La versión vigente será publicada en este sitio web indicando su fecha de actualización.' },
        { tipo: 'p', texto: 'Cuando una modificación requiera una comunicación específica al titular conforme a la legislación aplicable, LINKDICOM utilizará los medios de contacto disponibles.' },
      ],
    },
    {
      titulo: 'Legislación aplicable',
      cuerpo: [
        { tipo: 'p', texto: 'La presente Política de Privacidad se interpretará de conformidad con las leyes de la República Dominicana aplicables al tratamiento y protección de datos personales.' },
        { tipo: 'p', texto: 'Entre las normas relevantes se encuentra la Ley núm. 172-13 sobre Protección Integral de los Datos Personales, reconocida actualmente dentro del marco legal oficial de la República Dominicana.' },
        { tipo: 'p', texto: 'También serán aplicables, según la naturaleza de la situación, las demás disposiciones legales y reglamentarias vigentes, incluyendo aquellas relacionadas con seguridad informática, comercio electrónico, propiedad intelectual, contratación y responsabilidad civil o penal.' },
        { tipo: 'p', texto: 'El nuevo Código Penal, Ley núm. 74-25, incorporó disposiciones específicas relacionadas con la protección de información privada y datos personales.' },
      ],
    },
    {
      titulo: 'Contacto',
      cuerpo: [
        { tipo: 'p', texto: 'Para consultas relacionadas con esta Política de Privacidad, tratamiento de datos personales o ejercicio de derechos, puede comunicarse con:' },
        {
          tipo: 'datos',
          items: [
            'LINKDICOM, S.R.L.',
            'República Dominicana',
            'Correo: info@linkdicom.com',
            'Sitio web: LINKDICOM',
          ],
        },
      ],
    },
  ],
};

export const TERMINOS: DocumentoLegal = {
  key: 'terminos',
  titulo: 'Términos y condiciones de uso',
  actualizado: 'septiembre de 2026',
  intro: [
    'Bienvenido al sitio web oficial de LINKDICOM, S.R.L. El acceso, navegación, consulta y utilización de este sitio web implica la aceptación de los presentes Términos y Condiciones de Uso.',
    'Estos términos regulan el acceso y utilización de los contenidos, información, materiales, funcionalidades, servicios y recursos publicados en el sitio web de LINKDICOM, así como las condiciones aplicables a cualquier interacción, solicitud, contratación o transacción realizada a través de sus canales digitales.',
    'Al utilizar este sitio, el usuario declara haber leído, comprendido y aceptado estos términos.',
  ],
  secciones: [
    {
      titulo: 'Identificación del titular del sitio',
      cuerpo: [
        { tipo: 'p', texto: 'El presente sitio web es propiedad y está administrado por:' },
        {
          tipo: 'datos',
          items: [
            'LINKDICOM, S.R.L.',
            'República Dominicana',
            'Correo electrónico: info@linkdicom.com',
          ],
        },
        { tipo: 'p', texto: 'En adelante, “LINKDICOM”, “la empresa”, “nosotros” o “el titular”.' },
      ],
    },
    {
      titulo: 'Objeto del sitio web',
      cuerpo: [
        { tipo: 'p', texto: 'El sitio web de LINKDICOM tiene como finalidad proporcionar información institucional, comercial, técnica y corporativa sobre la empresa, sus productos, soluciones, servicios, proyectos, desarrollos tecnológicos, historia, alianzas, actividades y demás iniciativas relacionadas con su actividad empresarial.' },
        { tipo: 'p', texto: 'La información publicada en el sitio tiene carácter informativo y comercial y no constituye, por sí misma, una obligación contractual de suministro, implementación, licencia, soporte o prestación de servicios, salvo que exista un contrato, propuesta comercial, orden de compra, cotización o documento formal suscrito por las partes.' },
      ],
    },
    {
      titulo: 'Aceptación de los términos',
      cuerpo: [
        { tipo: 'p', texto: 'El acceso al sitio web y su utilización implican la aceptación de estos Términos y Condiciones.' },
        { tipo: 'p', texto: 'Si el usuario no está de acuerdo con alguno de ellos, deberá abstenerse de utilizar el sitio web o sus contenidos.' },
        { tipo: 'p', texto: 'LINKDICOM podrá actualizar, modificar, ampliar o sustituir estos términos cuando resulte necesario para adaptarlos a cambios legales, tecnológicos, comerciales o funcionales.' },
        { tipo: 'p', texto: 'La versión vigente será la publicada en este sitio.' },
      ],
    },
    {
      titulo: 'Propiedad intelectual',
      cuerpo: [
        { tipo: 'p', texto: 'Todos los contenidos originales publicados en este sitio web pertenecen a LINKDICOM, S.R.L. o se utilizan legítimamente con autorización, licencia, atribución o bajo las condiciones correspondientes a sus respectivos titulares.' },
        { tipo: 'p', texto: 'Esto comprende, entre otros:' },
        {
          tipo: 'lista',
          items: [
            'Textos y artículos.',
            'Fotografías.',
            'Imágenes.',
            'Ilustraciones.',
            'Diseños gráficos.',
            'Videos.',
            'Animaciones.',
            'Infografías.',
            'Presentaciones.',
            'Catálogos.',
            'Documentos.',
            'Manuales.',
            'Materiales comerciales.',
            'Interfaces y elementos visuales.',
            'Código y componentes de software cuando corresponda.',
            'Bases o compilaciones de información protegibles.',
            'Diagramas y representaciones técnicas.',
            'Elementos gráficos de productos.',
            'Material audiovisual.',
            'Estructuras y contenidos originales del sitio.',
          ],
        },
        { tipo: 'p', texto: 'La protección de estos contenidos se encuentra sujeta al marco jurídico dominicano aplicable en materia de derecho de autor y propiedad intelectual. La Ley 65-00 reconoce protección a diversas obras literarias, artísticas, científicas y programas de computadora, entre otras creaciones intelectuales.' },
      ],
    },
    {
      titulo: 'Marcas, logotipos, nombres y signos distintivos',
      cuerpo: [
        { tipo: 'p', texto: 'El nombre LINKDICOM, su identidad corporativa, logotipos, elementos gráficos, denominaciones comerciales, nombres de productos, nombres de soluciones, slogans, diseños y demás signos distintivos utilizados por LINKDICOM no podrán ser utilizados de manera que pueda generar confusión, asociación, patrocinio, autorización, representación o afiliación inexistente con LINKDICOM.' },
        { tipo: 'p', texto: 'Esto incluye, entre otros, el uso de:' },
        {
          tipo: 'lista',
          items: [
            'LINKDICOM.',
            'Logotipo de LINKDICOM.',
            'RadiologoX.',
            'ECOTurnox.',
            'SIEGIX y sus denominaciones asociadas.',
            'LINKRix.',
            'LinkXpace.',
            'LinkBurnPrint.',
            'Otros nombres, productos, servicios o signos distintivos pertenecientes a LINKDICOM.',
          ],
        },
        { tipo: 'p', texto: 'La Ley 20-00 sobre Propiedad Industrial establece mecanismos de protección de marcas, nombres comerciales y otros signos distintivos, incluyendo acciones frente a determinados usos no autorizados que puedan producir confusión o afectar los derechos del titular.' },
        { tipo: 'p', texto: 'La mera mención nominativa de un producto, empresa, proyecto o tecnología con fines legítimos de referencia, crítica, información o identificación no implica por sí misma autorización para utilizar sus signos distintivos como propios ni para aparentar una relación comercial inexistente.' },
      ],
    },
    {
      titulo: 'Uso del logotipo y marca LINKDICOM',
      cuerpo: [
        { tipo: 'p', texto: 'Queda prohibida, salvo autorización previa y escrita de LINKDICOM, la utilización del logotipo, identidad gráfica o elementos visuales de LINKDICOM:' },
        {
          tipo: 'lista',
          items: [
            'En sitios web de terceros.',
            'En campañas publicitarias.',
            'En materiales comerciales.',
            'En propuestas de negocio.',
            'En presentaciones institucionales.',
            'En documentos destinados a terceros.',
            'En productos o servicios de terceros.',
            'En redes sociales con finalidad comercial.',
            'En anuncios, publicaciones o comunicaciones que puedan sugerir una relación inexistente con LINKDICOM.',
          ],
        },
        { tipo: 'p', texto: 'Cualquier autorización concedida podrá estar limitada a un propósito, medio, territorio y período determinado.' },
      ],
    },
    {
      titulo: 'Uso de información y contenidos del sitio',
      cuerpo: [
        { tipo: 'p', texto: 'El contenido publicado en el sitio web de LINKDICOM está destinado a informar al público y facilitar el conocimiento de la empresa, sus soluciones y sus actividades.' },
        { tipo: 'p', texto: 'El usuario podrá consultar la información disponible públicamente para fines personales, informativos o de referencia legítima.' },
        { tipo: 'p', texto: 'Sin embargo, no se autoriza la reproducción, copia, extracción, adaptación, modificación, republicación, distribución o utilización comercial sistemática de contenidos del sitio sin autorización previa y escrita de LINKDICOM, cuando dicha utilización se encuentre protegida por la legislación aplicable.' },
        { tipo: 'p', texto: 'Esto incluye especialmente:' },
        {
          tipo: 'lista',
          items: [
            'Copiar artículos completos.',
            'Reproducir páginas completas.',
            'Copiar descripciones comerciales o técnicas.',
            'Extraer catálogos.',
            'Copiar imágenes.',
            'Copiar infografías.',
            'Reproducir diseños.',
            'Replicar presentaciones.',
            'Copiar documentación técnica.',
            'Utilizar materiales comerciales de LINKDICOM.',
            'Crear contenidos derivados sustancialmente basados en materiales originales de LINKDICOM.',
            'Utilizar contenido de LINKDICOM para desarrollar materiales comerciales de terceros.',
          ],
        },
        { tipo: 'p', texto: 'Las excepciones y usos permitidos por la legislación dominicana continuarán siendo aplicables. La Ley 65-00 contempla determinadas excepciones y usos legítimos, incluyendo determinados supuestos de cita y reproducción, por lo que estos Términos no pretenden limitar derechos que la legislación reconoce expresamente.' },
      ],
    },
    {
      titulo: 'Obligación de atribución y notificación',
      cuerpo: [
        { tipo: 'p', texto: 'Cuando un tercero utilice legítimamente información, referencias, datos públicos, declaraciones, antecedentes históricos, referencias técnicas o cualquier otro contenido publicado por LINKDICOM, se recomienda y, cuando corresponda legalmente, deberá identificarse claramente a LINKDICOM como fuente.' },
        { tipo: 'p', texto: 'Cuando se utilice material protegido, la autorización correspondiente deberá ser obtenida previamente cuando sea requerida por la legislación aplicable.' },
        { tipo: 'p', texto: 'Para usos institucionales, académicos, periodísticos, comerciales, publicitarios o de investigación que involucren contenido sustancial de LINKDICOM, el interesado podrá contactar previamente a:' },
        { tipo: 'p', texto: 'info@linkdicom.com' },
        { tipo: 'p', texto: 'La notificación o solicitud de autorización podrá indicar:' },
        {
          tipo: 'lista',
          items: [
            'Contenido que se desea utilizar.',
            'Finalidad.',
            'Medio donde será publicado.',
            'Alcance de la publicación.',
            'Territorio.',
            'Duración estimada.',
            'Identificación del responsable.',
          ],
        },
      ],
    },
    {
      titulo: 'Información histórica y referencias tecnológicas',
      cuerpo: [
        { tipo: 'p', texto: 'LINKDICOM podrá publicar información relacionada con su trayectoria histórica, incluyendo referencias a proyectos, tecnologías, empresas, colaboradores, comunidades de código abierto, instituciones y herramientas que hayan formado parte de diferentes etapas de su evolución.' },
        { tipo: 'p', texto: 'La referencia histórica a una tecnología, empresa, producto o proyecto no significa necesariamente que dicha tecnología forme parte de las soluciones actuales de LINKDICOM.' },
        { tipo: 'p', texto: 'Asimismo, la mención de terceros no constituye necesariamente una asociación comercial, representación, distribución, patrocinio, certificación o afiliación actual, salvo que expresamente se indique lo contrario.' },
        { tipo: 'p', texto: 'Cuando corresponda, LINKDICOM procurará identificar adecuadamente a los titulares de las tecnologías, marcas y proyectos mencionados.' },
      ],
    },
    {
      titulo: 'Contenidos de terceros y código abierto',
      cuerpo: [
        { tipo: 'p', texto: 'Algunos contenidos, referencias, nombres, marcas, tecnologías o proyectos mencionados en el sitio pueden pertenecer a terceros.' },
        { tipo: 'p', texto: 'Estos permanecen bajo la titularidad y condiciones de sus respectivos propietarios.' },
        { tipo: 'p', texto: 'LINKDICOM reconoce y respeta las licencias de software libre y código abierto aplicables a los proyectos correspondientes.' },
        { tipo: 'p', texto: 'La inclusión de referencias a proyectos de código abierto dentro de la historia tecnológica de LINKDICOM no implica que LINKDICOM sea titular de dichos proyectos ni que las licencias originales hayan sido modificadas por estos Términos.' },
      ],
    },
    {
      titulo: 'Prohibición de uso engañoso o confuso',
      cuerpo: [
        { tipo: 'p', texto: 'Queda prohibido utilizar contenidos, marcas, nombres, imágenes, referencias o información de LINKDICOM de manera que pueda:' },
        {
          tipo: 'lista',
          items: [
            'Generar confusión respecto de la identidad del usuario.',
            'Hacer creer que existe una relación comercial inexistente.',
            'Hacer creer que existe una autorización de LINKDICOM que no ha sido concedida.',
            'Presentar productos o servicios de terceros como productos de LINKDICOM.',
            'Atribuir a LINKDICOM declaraciones que no haya realizado.',
            'Alterar sustancialmente información publicada por LINKDICOM para cambiar su significado.',
            'Utilizar contenidos de LINKDICOM para desacreditar, engañar o perjudicar deliberadamente a terceros.',
            'Utilizar la identidad de LINKDICOM para obtener ventajas comerciales, económicas o reputacionales indebidas.',
          ],
        },
      ],
    },
    {
      titulo: 'Contenidos falsos, manipulados o difamatorios',
      cuerpo: [
        { tipo: 'p', texto: 'LINKDICOM respeta la libertad de expresión, crítica, opinión, investigación y legítimo intercambio de información.' },
        { tipo: 'p', texto: 'No obstante, cuando una persona física o jurídica realice públicamente afirmaciones falsas, imputaciones concretas o contenidos que afecten ilegítimamente el honor, buen nombre, imagen, reputación o consideración de LINKDICOM, la empresa podrá ejercer las acciones que correspondan conforme al ordenamiento jurídico vigente.' },
        { tipo: 'p', texto: 'El nuevo Código Penal dominicano, en su régimen vigente, contempla expresamente la difamación respecto de personas jurídicas y la afectación de su honor, buen nombre e imagen. La regulación fue además modificada por la Ley 44-26.' },
        { tipo: 'p', texto: 'LINKDICOM se reserva el derecho de ejercer las acciones civiles, comerciales, administrativas o penales que correspondan cuando una conducta exceda los límites legalmente permitidos.' },
        { tipo: 'p', texto: 'La existencia de una opinión negativa, crítica o comentario desfavorable no será considerada por sí misma una infracción. La determinación de cualquier responsabilidad corresponderá a las autoridades competentes conforme a la legislación aplicable.' },
      ],
    },
    {
      titulo: 'Protección frente a usos perjudiciales de la información',
      cuerpo: [
        { tipo: 'p', texto: 'La utilización de información obtenida de este sitio con la intención deliberada de:' },
        {
          tipo: 'lista',
          items: [
            'perjudicar la reputación de LINKDICOM;',
            'inducir a error sobre sus productos o servicios;',
            'desacreditar fraudulentamente a la empresa;',
            'atribuirle hechos falsos;',
            'presentar información fuera de contexto con finalidad maliciosa;',
            'suplantar a LINKDICOM;',
            'obtener beneficios comerciales mediante la identidad de LINKDICOM;',
            'crear confusión frente a clientes, proveedores o instituciones;',
          ],
        },
        { tipo: 'p', texto: 'podrá ser documentada y, cuando corresponda, puesta en conocimiento de las autoridades competentes.' },
        { tipo: 'p', texto: 'LINKDICOM podrá ejercer las acciones legales que correspondan cuando los hechos puedan constituir una infracción civil, comercial, administrativa o penal.' },
      ],
    },
    {
      titulo: 'Enlaces y referencias a LINKDICOM',
      cuerpo: [
        { tipo: 'p', texto: 'La inclusión de enlaces hacia el sitio oficial de LINKDICOM no implica autorización para utilizar la marca LINKDICOM como si fuera propia ni para crear una apariencia de asociación comercial.' },
        { tipo: 'p', texto: 'Los terceros podrán referenciar el sitio de LINKDICOM mediante enlaces legítimos siempre que:' },
        {
          tipo: 'lista',
          items: [
            'No se presente a LINKDICOM como patrocinador o socio cuando no exista tal relación.',
            'No se utilice la marca para inducir a error.',
            'No se reproduzca el sitio dentro de un marco que pueda confundir al usuario sobre su titularidad.',
            'No se utilice el enlace para actividades ilícitas o fraudulentas.',
          ],
        },
      ],
    },
    {
      titulo: 'Información comercial y precios',
      cuerpo: [
        { tipo: 'p', texto: 'Los precios, promociones, características, disponibilidades, especificaciones y condiciones comerciales publicadas en el sitio podrán ser modificados sin previo aviso.' },
        { tipo: 'p', texto: 'Una publicación en el sitio web no constituye necesariamente una oferta irrevocable ni sustituye una cotización o propuesta comercial formal.' },
        { tipo: 'p', texto: 'Las condiciones definitivas de adquisición, implementación, licencia, soporte, mantenimiento o contratación serán las establecidas en los documentos comerciales correspondientes.' },
      ],
    },
    {
      titulo: 'Contratación y adquisición de servicios',
      cuerpo: [
        { tipo: 'p', texto: 'Cuando una contratación se realice mediante cotización, propuesta, orden de compra, contrato u otro documento comercial, prevalecerán las condiciones establecidas en dicho instrumento respecto de las condiciones generales del sitio web.' },
        { tipo: 'p', texto: 'En caso de contradicción entre estos Términos y un contrato formal firmado por LINKDICOM y el cliente, prevalecerá el contrato específico.' },
      ],
    },
    {
      titulo: 'Cuentas, accesos y credenciales',
      cuerpo: [
        { tipo: 'p', texto: 'Cuando LINKDICOM proporcione al usuario una cuenta, acceso, credencial o mecanismo de autenticación, el usuario será responsable de mantener la confidencialidad de sus credenciales.' },
        { tipo: 'p', texto: 'El usuario deberá notificar inmediatamente a LINKDICOM cualquier sospecha de acceso no autorizado, pérdida, divulgación o compromiso de sus credenciales.' },
        { tipo: 'p', texto: 'LINKDICOM podrá solicitar mecanismos razonables de verificación de identidad antes de realizar cambios sobre una cuenta o proporcionar información relacionada con ella.' },
      ],
    },
    {
      titulo: 'Seguridad y uso ilícito',
      cuerpo: [
        { tipo: 'p', texto: 'Queda prohibido utilizar el sitio web para:' },
        {
          tipo: 'lista',
          items: [
            'Intentar obtener acceso no autorizado a sistemas.',
            'Alterar contenidos.',
            'Introducir código malicioso.',
            'Interrumpir el funcionamiento del sitio.',
            'Realizar ataques informáticos.',
            'Extraer información mediante mecanismos automatizados de forma abusiva.',
            'Suplantar identidades.',
            'Realizar actividades fraudulentas.',
            'Utilizar vulnerabilidades con fines ilícitos.',
            'Interferir deliberadamente con la disponibilidad o integridad del sitio.',
          ],
        },
        { tipo: 'p', texto: 'LINKDICOM podrá conservar registros técnicos y evidencias relacionadas con incidentes de seguridad y ponerlos a disposición de las autoridades competentes cuando corresponda.' },
        { tipo: 'p', texto: 'El nuevo régimen penal dominicano contempla, entre otras figuras, conductas relacionadas con acceso ilícito, interceptación y sabotaje informático.' },
      ],
    },
    {
      titulo: 'Disponibilidad del sitio',
      cuerpo: [
        { tipo: 'p', texto: 'LINKDICOM realizará esfuerzos razonables para mantener disponible el sitio web, pero no garantiza que éste permanezca permanentemente libre de interrupciones, errores, mantenimiento, fallas técnicas o circunstancias fuera de su control.' },
        { tipo: 'p', texto: 'LINKDICOM podrá realizar actualizaciones, modificaciones, mantenimiento o interrupciones temporales cuando sean necesarias.' },
      ],
    },
    {
      titulo: 'Exactitud de la información',
      cuerpo: [
        { tipo: 'p', texto: 'LINKDICOM procura mantener información actualizada y correcta.' },
        { tipo: 'p', texto: 'Sin embargo, determinadas publicaciones pueden corresponder a información histórica, técnica, comercial o institucional cuya actualización puede variar con el tiempo.' },
        { tipo: 'p', texto: 'El usuario deberá verificar con LINKDICOM las condiciones comerciales, técnicas o contractuales vigentes antes de tomar decisiones basadas exclusivamente en información publicada en el sitio.' },
      ],
    },
    {
      titulo: 'Limitación de responsabilidad',
      cuerpo: [
        { tipo: 'p', texto: 'En la medida permitida por la legislación aplicable, LINKDICOM no será responsable por daños derivados exclusivamente del uso indebido que un tercero haga de la información publicada en el sitio.' },
        { tipo: 'p', texto: 'Tampoco será responsable por:' },
        {
          tipo: 'lista',
          items: [
            'Información modificada por terceros.',
            'Enlaces externos fuera de su control.',
            'Interrupciones causadas por proveedores de Internet.',
            'Fallas de terceros.',
            'Ataques informáticos externos que no puedan razonablemente ser evitados.',
            'Decisiones tomadas por usuarios exclusivamente a partir de información general publicada en el sitio.',
          ],
        },
        { tipo: 'p', texto: 'Esta disposición no excluye responsabilidades que legalmente no puedan ser excluidas o limitadas.' },
      ],
    },
    {
      titulo: 'Garantías de productos y servicios',
      cuerpo: [
        { tipo: 'p', texto: 'Las garantías aplicables a productos, equipos, licencias, software, implementaciones o servicios serán las establecidas específicamente en la propuesta, contrato, factura, licencia, documentación técnica o condiciones particulares correspondientes.' },
        { tipo: 'p', texto: 'En ausencia de una condición específica, se aplicarán las disposiciones legales correspondientes.' },
      ],
    },
    {
      titulo: 'Política de reembolso',
      cuerpo: [
        { tipo: 'p', texto: 'Cuando corresponda, las condiciones de reembolso serán establecidas en la cotización, contrato o documento comercial correspondiente.' },
        { tipo: 'p', texto: 'En el caso de servicios digitales, software, implementaciones o productos no tangibles, las condiciones particulares deberán ser revisadas antes de la contratación.' },
        { tipo: 'p', texto: 'Nada de esta disposición pretende excluir derechos que correspondan al consumidor o contratante conforme a la legislación aplicable.' },
      ],
    },
    {
      titulo: 'Prevención de fraude',
      cuerpo: [
        { tipo: 'p', texto: 'LINKDICOM podrá realizar verificaciones razonables antes de procesar determinadas solicitudes, contrataciones o transacciones.' },
        { tipo: 'p', texto: 'Cuando existan indicios razonables de fraude, suplantación, utilización no autorizada de medios de pago o identidad de terceros, LINKDICOM podrá suspender temporalmente la operación mientras realiza las verificaciones correspondientes.' },
      ],
    },
    {
      titulo: 'Reportes sobre uso no autorizado',
      cuerpo: [
        { tipo: 'p', texto: 'Cualquier persona que considere que un contenido, marca, imagen, documento o información de LINKDICOM está siendo utilizado de forma no autorizada podrá comunicarlo a:' },
        { tipo: 'p', texto: 'info@linkdicom.com' },
        { tipo: 'p', texto: 'La comunicación deberá incluir, cuando sea posible:' },
        {
          tipo: 'lista',
          items: [
            'Identificación del contenido.',
            'URL o ubicación donde se utiliza.',
            'Descripción del uso.',
            'Identificación del responsable, si se conoce.',
            'Evidencias disponibles.',
            'Información de contacto del denunciante.',
          ],
        },
        { tipo: 'p', texto: 'LINKDICOM evaluará cada caso y podrá solicitar el retiro, corrección o modificación del contenido cuando corresponda.' },
      ],
    },
    {
      titulo: 'Acciones legales',
      cuerpo: [
        { tipo: 'p', texto: 'El incumplimiento de estos Términos no significa automáticamente que exista responsabilidad penal.' },
        { tipo: 'p', texto: 'Cuando una conducta constituya una infracción legal, LINKDICOM podrá ejercer las acciones que correspondan ante las autoridades competentes.' },
        { tipo: 'p', texto: 'Estas acciones podrán incluir, según la naturaleza del caso y la legislación aplicable:' },
        {
          tipo: 'lista',
          items: [
            'Acciones civiles.',
            'Acciones comerciales.',
            'Acciones administrativas.',
            'Acciones en materia de propiedad industrial.',
            'Acciones en materia de derecho de autor.',
            'Denuncias o querellas penales cuando los hechos puedan constituir una infracción penal.',
            'Solicitud de medidas cautelares o de protección cuando legalmente proceda.',
          ],
        },
        { tipo: 'p', texto: 'La Ley 20-00 contempla sanciones frente a determinados usos intencionales no autorizados de signos distintivos, mientras que la legislación de derecho de autor protege la reproducción y utilización no autorizada de obras dentro de su ámbito.' },
      ],
    },
    {
      titulo: 'No renuncia',
      cuerpo: [
        { tipo: 'p', texto: 'El hecho de que LINKDICOM no ejerza inmediatamente un derecho o acción frente a un incumplimiento no constituye una renuncia a dicho derecho.' },
        { tipo: 'p', texto: 'LINKDICOM podrá ejercer sus derechos posteriormente dentro de los plazos y condiciones establecidos por la legislación aplicable.' },
      ],
    },
    {
      titulo: 'Legislación aplicable',
      cuerpo: [
        { tipo: 'p', texto: 'Estos Términos se regirán e interpretarán conforme a las leyes de la República Dominicana, sin perjuicio de las normas imperativas que resulten aplicables.' },
        { tipo: 'p', texto: 'Entre otras disposiciones, serán consideradas, según corresponda:' },
        {
          tipo: 'lista',
          items: [
            'Constitución de la República Dominicana.',
            'Ley núm. 20-00 sobre Propiedad Industrial.',
            'Ley núm. 65-00 sobre Derecho de Autor y sus modificaciones.',
            'Ley Orgánica núm. 74-25 que instituye el Código Penal, con las modificaciones introducidas por la Ley núm. 44-26.',
            'Ley núm. 97-25 que instituye el Código Procesal Penal.',
            'Demás legislación dominicana aplicable.',
          ],
        },
        { tipo: 'p', texto: 'La Ley 20-00 es administrada en materia de propiedad industrial por ONAPI, mientras que la protección y tutela administrativa del derecho de autor corresponde a ONDA.' },
      ],
    },
    {
      titulo: 'Jurisdicción',
      cuerpo: [
        { tipo: 'p', texto: 'Para las controversias que no puedan resolverse mediante comunicación directa o mecanismos de solución acordados entre las partes, serán competentes las autoridades y tribunales de la República Dominicana que correspondan conforme a las reglas legales de competencia.' },
      ],
    },
    {
      titulo: 'Modificaciones de estos términos',
      cuerpo: [
        { tipo: 'p', texto: 'LINKDICOM podrá modificar estos Términos y Condiciones cuando sea necesario para:' },
        {
          tipo: 'lista',
          items: [
            'Adaptarlos a cambios legislativos.',
            'Incorporar nuevos servicios.',
            'Actualizar procedimientos.',
            'Mejorar la seguridad.',
            'Incorporar nuevas funcionalidades.',
            'Proteger adecuadamente sus derechos.',
            'Reflejar cambios en la operación de la empresa.',
          ],
        },
        { tipo: 'p', texto: 'La fecha de actualización aparecerá al inicio del documento.' },
      ],
    },
    {
      titulo: 'Contacto',
      cuerpo: [
        { tipo: 'p', texto: 'Para consultas, solicitudes de autorización, reportes de uso de contenido, asuntos relacionados con propiedad intelectual o cualquier otra comunicación relacionada con estos Términos:' },
        {
          tipo: 'datos',
          items: [
            'LINKDICOM, S.R.L.',
            'República Dominicana',
            'Correo: info@linkdicom.com',
            'Tel.: +1 (809) 792-9763',
          ],
        },
      ],
    },
  ],
};
