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

/** Campos de cada tipo de solicitud: etiqueta visible y si es obligatorio. */
const FORMULARIOS = {
  demo: {
    asunto: 'Solicitud de demo',
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
    campos: [
      ['nombre', 'Nombre completo', true],
      ['correo', 'Correo electrónico', true],
      ['telefono', 'Teléfono', true],
      ['ubicacion', 'Ciudad / Provincia', true],
      ['vacante', 'Vacante de interés', false],
      ['mensaje', 'Mensaje', false],
    ],
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

function construirCorreo(formulario, datos, origen) {
  const filas = formulario.campos
    .filter(([clave]) => datos[clave])
    .map(
      ([clave, etiqueta]) =>
        `<tr>
           <td style="padding:8px 14px;border-bottom:1px solid #e6ebf3;color:#5f6b83;font-size:13px;white-space:nowrap;vertical-align:top">${etiqueta}</td>
           <td style="padding:8px 14px;border-bottom:1px solid #e6ebf3;color:#0c1526;font-size:14px">${escapar(datos[clave]).replace(/\n/g, '<br>')}</td>
         </tr>`,
    )
    .join('');

  return `<!doctype html>
<html lang="es"><body style="margin:0;background:#f5f7fb;padding:24px;font-family:Segoe UI,system-ui,sans-serif">
  <table style="max-width:620px;margin:0 auto;background:#fff;border:1px solid #dce3ef;border-radius:12px;border-collapse:collapse;width:100%">
    <tr><td style="padding:18px 22px;background:#0b1120;border-radius:12px 12px 0 0">
      <span style="color:#fff;font-size:18px;font-weight:700;letter-spacing:-0.5px">LINK<span style="color:#ff6a13">DICOM</span></span>
      <div style="color:#9fb2cf;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin-top:4px">${formulario.asunto}</div>
    </td></tr>
    <tr><td style="padding:6px 8px">
      <table style="width:100%;border-collapse:collapse">${filas}</table>
    </td></tr>
    <tr><td style="padding:14px 22px;color:#5f6b83;font-size:12px;border-top:1px solid #e6ebf3">
      Enviado desde el formulario de la web${origen ? ` · ${escapar(origen)}` : ''}
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

  if (!CORREO_VALIDO.test(String(datos.correo))) {
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
        reply_to: String(datos.correo),
        subject: `${formulario.asunto} · ${String(datos.nombre).slice(0, 60)}`,
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
