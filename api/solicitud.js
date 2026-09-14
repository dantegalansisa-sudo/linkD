/*
  Recepcion de las solicitudes de la web: demo, contacto y postulaciones.

  Funcion serverless de Vercel. Recibe el formulario, lo valida y lo envia por
  correo a LINKDICOM. No guarda nada: el correo es el registro.

  Para que funcione hace falta una variable de entorno en Vercel:

    RESEND_API_KEY    clave de https://resend.com (plan gratuito: 3.000/mes)
    CORREO_DESTINO    opcional, por defecto info@linkdicom.com
    CORREO_REMITE     opcional, por defecto solicitudes@linkdicom.com
                      el dominio tiene que estar verificado en Resend

  Mientras no exista la clave, la funcion responde 503 y el formulario avisa
  al visitante de que escriba directamente. Nunca se pierde una solicitud en
  silencio.
*/

const DESTINO = process.env.CORREO_DESTINO || 'info@linkdicom.com';
const REMITE = process.env.CORREO_REMITE || 'LINKDICOM <solicitudes@linkdicom.com>';

/** URL publica de la cabecera del correo (los clientes de correo no cargan imagenes locales). */
const CABECERA_CORREO = 'https://link-dicom.com/img/correo/cabecera.jpg';

/**
 * Campos de cada tipo de solicitud: clave, etiqueta visible y si es
 * obligatorio. `descripcion` es la frase de la cabecera del correo.
 */
const FORMULARIOS = {
  demo: {
    asunto: 'Solicitud de demo',
    descripcion: 'Se ha recibido una nueva solicitud de demo desde el formulario del sitio web.',
    campos: [
      ['nombre', 'Nombre completo', true],
      ['correo', 'Correo electrónico', true],
      ['telefono', 'Teléfono / WhatsApp', true],
      ['institucion', 'Institución / Empresa', true],
      ['cargo', 'Cargo / Posición', false],
      ['solucion', 'Solución de interés', true],
      ['mensaje', 'Mensaje adicional', false],
    ],
  },
  contacto: {
    asunto: 'Mensaje desde la web',
    descripcion: 'Se ha recibido un nuevo mensaje desde el formulario de contacto del sitio web.',
    campos: [
      ['nombre', 'Nombre completo', true],
      ['correo', 'Correo electrónico', true],
      ['telefono', 'Teléfono', true],
      ['empresa', 'Empresa', false],
      ['motivo', 'Tipo de consulta', true],
      ['mensaje', 'Mensaje', true],
    ],
  },
  empleo: {
    asunto: 'Postulación de empleo',
    descripcion: 'Se ha recibido una nueva postulación desde la página de Trabaja con nosotros.',
    campos: [
      ['nombre', 'Nombre completo', true],
      ['correo', 'Correo electrónico', true],
      ['telefono', 'Teléfono', true],
      ['ubicacion', 'Ciudad / Provincia', true],
      ['vacante', 'Vacante de interés', false],
      ['mensaje', 'Mensaje', false],
    ],
  },
  // aporte a una jornada de la obra social: el correo es opcional
  donacion: {
    asunto: 'Aporte a la obra social',
    descripcion: 'Alguien quiere aportar a una jornada del Programa Virginia Toca.',
    campos: [
      ['evento', 'Evento', false],
      ['nombre', 'Nombre o empresa', true],
      ['telefono', 'Número de contacto', true],
      ['correo', 'Correo electrónico', false],
      ['tipos', 'Cómo quiere ayudar', true],
      ['detalle', 'Detalle de la ayuda', false],
    ],
  },
  // alta en el boletin de noticias: solo el correo
  boletin: {
    asunto: 'Suscripción al boletín',
    descripcion: 'Una persona se ha suscrito a las noticias desde el sitio web.',
    campos: [['correo', 'Correo electrónico', true]],
  },
};

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Escapa el texto del visitante antes de meterlo en el HTML del correo. */
function escapar(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Plantilla del correo, segun el diseno del cliente (misma que en solicitud.php). */
function construirCorreo(formulario, datos, origen) {
  let n = 0;
  const filas = formulario.campos
    .filter(([clave]) => datos[clave])
    .map(([clave, etiqueta]) => {
      const fondo = n++ % 2 === 0 ? '#f6f9fe' : '#ffffff';
      return `<tr>
        <td style="width:190px;padding:13px 16px;background:#eef4fc;border-bottom:1px solid #dfe7f3;color:#3b4a66;font-size:14px;vertical-align:top;border-left:3px solid #2563eb">${escapar(etiqueta)}</td>
        <td style="padding:13px 16px;background:${fondo};border-bottom:1px solid #dfe7f3;color:#0c1526;font-size:15px;vertical-align:top">${escapar(datos[clave]).replace(/\n/g, '<br>')}</td>
      </tr>`;
    })
    .join('');

  const pie =
    'Enviado desde el formulario de la web' +
    (origen ? ` · <b style="color:#2563eb">${escapar(origen)}</b>` : '');

  return `<!doctype html>
<html lang="es"><body style="margin:0;background:#eef2f8;padding:28px 12px;font-family:Segoe UI,Helvetica,Arial,sans-serif">
<table role="presentation" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;width:100%;background:#fff;border:1px solid #d9e2f0;border-radius:14px;border-collapse:separate;overflow:hidden">
  <tr><td style="padding:0;background:#0b1a36">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%"><tr>
      <td style="padding:26px 26px;vertical-align:middle">
        <div style="font-size:28px;font-weight:800;letter-spacing:-1px;color:#fff;line-height:1">LINK<span style="color:#ff6a13">DICOM</span></div>
        <div style="margin-top:6px;font-size:11px;letter-spacing:4px;color:#9fb2cf">CONECTA Y AVANZA</div>
      </td>
      <td style="padding:0 18px;vertical-align:middle;border-left:1px solid rgba(255,255,255,0.25);color:#dbe6f7;font-size:12px;letter-spacing:3px;white-space:nowrap">${escapar(formulario.asunto.toUpperCase())}</td>
      <td style="padding:0;width:200px;vertical-align:middle;text-align:right"><img src="${CABECERA_CORREO}" width="200" alt="" style="display:block;width:200px;height:auto;border:0"></td>
    </tr></table>
  </td></tr>
  <tr><td style="padding:26px 26px 14px">
    <table role="presentation" cellpadding="0" cellspacing="0"><tr>
      <td style="width:56px;height:56px;border-radius:28px;background:#e3edfb;text-align:center;vertical-align:middle;color:#2563eb;font-size:24px">&#9993;</td>
      <td style="padding-left:16px;vertical-align:middle">
        <div style="font-size:22px;font-weight:800;letter-spacing:-0.5px;color:#0c1526">Nueva solicitud recibida</div>
        <div style="margin-top:4px;font-size:14px;color:#5f6b83">${escapar(formulario.descripcion)}</div>
      </td>
    </tr></table>
  </td></tr>
  <tr><td style="padding:6px 26px 18px">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border:1px solid #dfe7f3;border-radius:10px;border-collapse:separate;overflow:hidden">${filas}</table>
  </td></tr>
  <tr><td style="padding:0 26px 22px">
    <div style="padding:14px 16px;border-radius:10px;background:#e9f1fd;color:#3b4a66;font-size:13px">&#8505;&nbsp; ${pie}</div>
  </td></tr>
  <tr><td style="padding:18px 26px;border-top:1px solid #dfe7f3">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%"><tr>
      <td style="vertical-align:middle"><div style="font-size:16px;font-weight:800;letter-spacing:-0.5px;color:#0c1526">LINK<span style="color:#ff6a13">DICOM</span>, SRL</div><div style="font-size:10px;letter-spacing:3px;color:#7c8aa5">CONECTA Y AVANZA</div></td>
      <td style="vertical-align:middle;text-align:right;font-size:12px;line-height:1.5;color:#7c8aa5">Este es un mensaje automático del sistema.<br>Al responder, el correo llega directamente al solicitante.</td>
    </tr></table>
  </td></tr>
</table>
</body></html>`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ ok: false, error: 'Método no permitido.' });
    return;
  }

  const cuerpo = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const { tipo, origen, ...datos } = cuerpo;

  const formulario = FORMULARIOS[tipo];
  if (!formulario) {
    res.status(400).json({ ok: false, error: 'Tipo de solicitud desconocido.' });
    return;
  }

  // trampa para robots: un campo oculto que una persona nunca rellena
  if (datos.web) {
    res.status(200).json({ ok: true });
    return;
  }

  const faltan = formulario.campos
    .filter(([clave, , obligatorio]) => obligatorio && !String(datos[clave] ?? '').trim())
    .map(([, etiqueta]) => etiqueta);

  if (faltan.length) {
    res.status(400).json({ ok: false, error: `Faltan campos: ${faltan.join(', ')}.` });
    return;
  }

  const correoVisitante = String(datos.correo ?? '').trim();
  if (correoVisitante && !CORREO_VALIDO.test(correoVisitante)) {
    res.status(400).json({ ok: false, error: 'El correo electrónico no es válido.' });
    return;
  }

  const clave = process.env.RESEND_API_KEY;
  if (!clave) {
    res.status(503).json({
      ok: false,
      error: 'El envío todavía no está configurado en el servidor.',
    });
    return;
  }

  try {
    const respuesta = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${clave}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: REMITE,
        to: [DESTINO],
        ...(correoVisitante ? { reply_to: correoVisitante } : {}),
        // en el asunto va quien escribe; si no hay nombre (boletin), su correo
        subject: `${formulario.asunto} · ${String(datos.nombre ?? correoVisitante).slice(0, 60)}`,
        html: construirCorreo(formulario, datos, origen),
      }),
    });

    if (!respuesta.ok) {
      const detalle = await respuesta.text();
      console.error('Resend respondió', respuesta.status, detalle);
      res.status(502).json({ ok: false, error: 'No se pudo enviar la solicitud.' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Fallo al enviar la solicitud', e);
    res.status(500).json({ ok: false, error: 'No se pudo enviar la solicitud.' });
  }
}
