<?php
/*
  Recepcion de las solicitudes de la web: demo, contacto y postulaciones.

  Version para cPanel (Apache + PHP) de `api/solicitud.js`, con el mismo
  contrato: recibe JSON, responde JSON, valida los mismos campos y lleva la
  misma trampa para robots. Envia el correo por SMTP con PHPMailer.

  La configuracion SMTP NO va en el repositorio. Se lee, por este orden:

    1. Variables de entorno LINKDICOM_SMTP_HOST, _PORT, _SECURE, _USER,
       _PASS, _FROM, _FROM_NAME y _TO.
    2. Un archivo PHP que devuelve un array, fuera de public_html:
       - la ruta que diga LINKDICOM_SMTP_CONFIG, si existe, o
       - <carpeta padre de public_html>/linkdicom-smtp.php

  Mientras no haya configuracion, responde 503 y el formulario avisa al
  visitante de que escriba directamente. Nunca se pierde una solicitud en
  silencio.
*/

declare(strict_types=1);

require __DIR__ . '/phpmailer/Exception.php';
require __DIR__ . '/phpmailer/PHPMailer.php';
require __DIR__ . '/phpmailer/SMTP.php';

use PHPMailer\PHPMailer\Exception as CorreoException;
use PHPMailer\PHPMailer\PHPMailer;

// responder() y registrarSolicitud(): cada envio queda tambien en la bandeja
// del panel de administracion, ademas de salir por correo
require __DIR__ . '/ldwam/comun.php';

const DESTINO_POR_DEFECTO = 'info@link-dicom.com';
const REMITE_NOMBRE_POR_DEFECTO = 'LINKDICOM';
const CORREO_VALIDO = '/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/';

/** URL publica de la cabecera del correo (los clientes de correo no cargan imagenes locales). */
const CABECERA_CORREO = 'https://link-dicom.com/img/correo/cabecera.jpg';

/**
 * Campos de cada tipo de solicitud: clave, etiqueta visible y si es
 * obligatorio. `descripcion` es la frase de la cabecera del correo.
 */
const FORMULARIOS = [
    'demo' => [
        'asunto' => 'Solicitud de demo',
        'descripcion' => 'Se ha recibido una nueva solicitud de demo desde el formulario del sitio web.',
        'campos' => [
            ['nombre', 'Nombre completo', true],
            ['correo', 'Correo electrónico', true],
            ['telefono', 'Teléfono / WhatsApp', true],
            ['institucion', 'Institución / Empresa', true],
            ['cargo', 'Cargo / Posición', false],
            ['solucion', 'Solución de interés', true],
            ['mensaje', 'Mensaje adicional', false],
        ],
    ],
    'contacto' => [
        'asunto' => 'Mensaje desde la web',
        'descripcion' => 'Se ha recibido un nuevo mensaje desde el formulario de contacto del sitio web.',
        'campos' => [
            ['nombre', 'Nombre completo', true],
            ['correo', 'Correo electrónico', true],
            ['telefono', 'Teléfono', true],
            ['empresa', 'Empresa', false],
            ['motivo', 'Tipo de consulta', true],
            ['mensaje', 'Mensaje', true],
        ],
    ],
    'empleo' => [
        'asunto' => 'Postulación de empleo',
        'descripcion' => 'Se ha recibido una nueva postulación desde la página de Trabaja con nosotros.',
        'campos' => [
            ['nombre', 'Nombre completo', true],
            ['correo', 'Correo electrónico', true],
            ['telefono', 'Teléfono', true],
            ['ubicacion', 'Ciudad / Provincia', true],
            ['vacante', 'Vacante de interés', false],
            ['mensaje', 'Mensaje', false],
        ],
    ],
    // aporte a una jornada de la obra social: el correo es opcional
    'donacion' => [
        'asunto' => 'Aporte a la obra social',
        'descripcion' => 'Alguien quiere aportar a una jornada del Programa Virginia Toca.',
        'campos' => [
            ['evento', 'Evento', false],
            ['nombre', 'Nombre o empresa', true],
            ['telefono', 'Número de contacto', true],
            ['correo', 'Correo electrónico', false],
            ['tipos', 'Cómo quiere ayudar', true],
            ['detalle', 'Detalle de la ayuda', false],
        ],
    ],
    // alta en el boletin de noticias: solo el correo
    'boletin' => [
        'asunto' => 'Suscripción al boletín',
        'descripcion' => 'Una persona se ha suscrito a las noticias desde el sitio web.',
        'campos' => [
            ['correo', 'Correo electrónico', true],
        ],
    ],
];

/** Escapa el texto del visitante antes de meterlo en el HTML del correo. */
function escapar(string $texto): string
{
    return htmlspecialchars($texto, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/**
 * Configuracion SMTP: variables de entorno primero, archivo externo despues.
 * Devuelve null si no hay nada configurado.
 */
function leerConfiguracion(): ?array
{
    $claves = ['host', 'port', 'secure', 'user', 'pass', 'from', 'from_name', 'to'];

    $entorno = [];
    foreach ($claves as $clave) {
        $valor = getenv('LINKDICOM_SMTP_' . strtoupper($clave));
        if ($valor !== false && $valor !== '') {
            $entorno[$clave] = $valor;
        }
    }
    if (isset($entorno['host'], $entorno['user'], $entorno['pass'])) {
        return $entorno;
    }

    $candidatas = [];
    $ruta = getenv('LINKDICOM_SMTP_CONFIG');
    if ($ruta !== false && $ruta !== '') {
        $candidatas[] = $ruta;
    }
    // public_html/api/solicitud.php -> la carpeta padre de public_html
    $candidatas[] = dirname(__DIR__, 2) . '/linkdicom-smtp.php';
    if (!empty($_SERVER['DOCUMENT_ROOT'])) {
        $candidatas[] = dirname($_SERVER['DOCUMENT_ROOT']) . '/linkdicom-smtp.php';
    }

    foreach ($candidatas as $archivo) {
        if (is_readable($archivo)) {
            $config = include $archivo;
            if (is_array($config) && isset($config['host'], $config['user'], $config['pass'])) {
                return $config;
            }
        }
    }

    return null;
}

function construirCorreo(array $formulario, array $datos, string $origen): string
{
    $filas = '';
    $n = 0;
    foreach ($formulario['campos'] as [$clave, $etiqueta]) {
        if (empty($datos[$clave])) {
            continue;
        }
        $fondo = $n++ % 2 === 0 ? '#f6f9fe' : '#ffffff';
        $valor = nl2br(escapar((string) $datos[$clave]), false);
        $filas .= '<tr>'
            . '<td style="width:190px;padding:13px 16px;background:#eef4fc;border-bottom:1px solid #dfe7f3;color:#3b4a66;font-size:14px;vertical-align:top;border-left:3px solid #2563eb">' . escapar($etiqueta) . '</td>'
            . '<td style="padding:13px 16px;background:' . $fondo . ';border-bottom:1px solid #dfe7f3;color:#0c1526;font-size:15px;vertical-align:top">' . $valor . '</td>'
            . '</tr>';
    }

    $rotulo = function_exists('mb_strtoupper') ? mb_strtoupper($formulario['asunto'], 'UTF-8') : strtoupper($formulario['asunto']);
    $pie = 'Enviado desde el formulario de la web' . ($origen !== '' ? ' · <b style="color:#2563eb">' . escapar($origen) . '</b>' : '');

    return '<!doctype html>'
        . '<html lang="es"><body style="margin:0;background:#eef2f8;padding:28px 12px;font-family:Segoe UI,Helvetica,Arial,sans-serif">'
        . '<table role="presentation" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;width:100%;background:#fff;border:1px solid #d9e2f0;border-radius:14px;border-collapse:separate;overflow:hidden">'
        // cabecera: marca, rotulo y foto
        . '<tr><td style="padding:0;background:#0b1a36">'
        . '<table role="presentation" cellpadding="0" cellspacing="0" width="100%"><tr>'
        . '<td style="padding:26px 26px;vertical-align:middle">'
        . '<div style="font-size:28px;font-weight:800;letter-spacing:-1px;color:#fff;line-height:1">LINK<span style="color:#ff6a13">DICOM</span></div>'
        . '<div style="margin-top:6px;font-size:11px;letter-spacing:4px;color:#9fb2cf">CONECTA Y AVANZA</div>'
        . '</td>'
        . '<td style="padding:0 18px;vertical-align:middle;border-left:1px solid rgba(255,255,255,0.25);color:#dbe6f7;font-size:12px;letter-spacing:3px;white-space:nowrap">' . escapar($rotulo) . '</td>'
        . '<td style="padding:0;width:200px;vertical-align:middle;text-align:right">'
        . '<img src="' . CABECERA_CORREO . '" width="200" alt="" style="display:block;width:200px;height:auto;border:0">'
        . '</td>'
        . '</tr></table>'
        . '</td></tr>'
        // titulo
        . '<tr><td style="padding:26px 26px 14px">'
        . '<table role="presentation" cellpadding="0" cellspacing="0"><tr>'
        . '<td style="width:56px;height:56px;border-radius:28px;background:#e3edfb;text-align:center;vertical-align:middle;color:#2563eb;font-size:24px">&#9993;</td>'
        . '<td style="padding-left:16px;vertical-align:middle">'
        . '<div style="font-size:22px;font-weight:800;letter-spacing:-0.5px;color:#0c1526">Nueva solicitud recibida</div>'
        . '<div style="margin-top:4px;font-size:14px;color:#5f6b83">' . escapar($formulario['descripcion']) . '</div>'
        . '</td></tr></table>'
        . '</td></tr>'
        // datos
        . '<tr><td style="padding:6px 26px 18px">'
        . '<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border:1px solid #dfe7f3;border-radius:10px;border-collapse:separate;overflow:hidden">' . $filas . '</table>'
        . '</td></tr>'
        // origen
        . '<tr><td style="padding:0 26px 22px">'
        . '<div style="padding:14px 16px;border-radius:10px;background:#e9f1fd;color:#3b4a66;font-size:13px">&#8505;&nbsp; ' . $pie . '</div>'
        . '</td></tr>'
        // pie
        . '<tr><td style="padding:18px 26px;border-top:1px solid #dfe7f3">'
        . '<table role="presentation" cellpadding="0" cellspacing="0" width="100%"><tr>'
        . '<td style="vertical-align:middle"><div style="font-size:16px;font-weight:800;letter-spacing:-0.5px;color:#0c1526">LINK<span style="color:#ff6a13">DICOM</span>, SRL</div><div style="font-size:10px;letter-spacing:3px;color:#7c8aa5">CONECTA Y AVANZA</div></td>'
        . '<td style="vertical-align:middle;text-align:right;font-size:12px;line-height:1.5;color:#7c8aa5">Este es un mensaje automático del sistema.<br>Al responder, el correo llega directamente al solicitante.</td>'
        . '</tr></table>'
        . '</td></tr>'
        . '</table></body></html>';
}

/** Version en texto plano, para los clientes de correo que no muestran HTML. */
function construirTexto(array $formulario, array $datos, string $origen): string
{
    $lineas = [$formulario['asunto'], str_repeat('-', 40)];
    foreach ($formulario['campos'] as [$clave, $etiqueta]) {
        if (!empty($datos[$clave])) {
            $lineas[] = $etiqueta . ': ' . (string) $datos[$clave];
        }
    }
    $lineas[] = '';
    $lineas[] = 'Enviado desde el formulario de la web' . ($origen !== '' ? ' · ' . $origen : '');
    return implode("\n", $lineas);
}

// ---------------------------------------------------------------------------

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    responder(405, ['ok' => false, 'error' => 'Método no permitido.']);
}

$crudo = file_get_contents('php://input');
$cuerpo = json_decode($crudo === false ? '' : $crudo, true);
if (!is_array($cuerpo)) {
    $cuerpo = [];
}

$tipo = is_string($cuerpo['tipo'] ?? null) ? $cuerpo['tipo'] : '';
$origen = is_scalar($cuerpo['origen'] ?? null) ? trim((string) $cuerpo['origen']) : '';
unset($cuerpo['tipo'], $cuerpo['origen']);

// solo se aceptan valores de texto: el JSON podria traer arrays u objetos
$datos = [];
foreach ($cuerpo as $clave => $valor) {
    if (is_string($clave) && is_scalar($valor)) {
        $datos[$clave] = trim((string) $valor);
    }
}

$formulario = FORMULARIOS[$tipo] ?? null;
if ($formulario === null) {
    responder(400, ['ok' => false, 'error' => 'Tipo de solicitud desconocido.']);
}

// trampa para robots: un campo oculto que una persona nunca rellena
if (!empty($datos['web'])) {
    responder(200, ['ok' => true]);
}

$faltan = [];
foreach ($formulario['campos'] as [$clave, $etiqueta, $obligatorio]) {
    if ($obligatorio && trim((string) ($datos[$clave] ?? '')) === '') {
        $faltan[] = $etiqueta;
    }
}
if ($faltan !== []) {
    responder(400, ['ok' => false, 'error' => 'Faltan campos: ' . implode(', ', $faltan) . '.']);
}

$correoVisitante = (string) ($datos['correo'] ?? '');
if ($correoVisitante !== '' && !preg_match(CORREO_VALIDO, $correoVisitante)) {
    responder(400, ['ok' => false, 'error' => 'El correo electrónico no es válido.']);
}

$config = leerConfiguracion();
if ($config === null) {
    registrarSolicitud($tipo, $datos, $origen, false);
    responder(503, ['ok' => false, 'error' => 'El envío todavía no está configurado en el servidor.']);
}

$destino = $config['to'] ?? DESTINO_POR_DEFECTO;
$remite = $config['from'] ?? $config['user'];
$remiteNombre = $config['from_name'] ?? REMITE_NOMBRE_POR_DEFECTO;
$puerto = (int) ($config['port'] ?? 465);
$seguridad = strtolower((string) ($config['secure'] ?? ($puerto === 587 ? 'tls' : 'ssl')));

try {
    $correo = new PHPMailer(true);
    $correo->CharSet = PHPMailer::CHARSET_UTF8;
    $correo->isSMTP();
    $correo->Host = $config['host'];
    $correo->Port = $puerto;
    $correo->SMTPAuth = true;
    $correo->Username = $config['user'];
    $correo->Password = $config['pass'];
    $correo->SMTPSecure = $seguridad === 'tls' ? PHPMailer::ENCRYPTION_STARTTLS : PHPMailer::ENCRYPTION_SMTPS;
    $correo->Timeout = 15;

    $correo->setFrom($remite, $remiteNombre);
    $correo->addAddress($destino);
    if ($correoVisitante !== '') {
        $correo->addReplyTo($correoVisitante, (string) ($datos['nombre'] ?? ''));
    }

    $correo->isHTML(true);
    // en el asunto va quien escribe; si no hay nombre (boletin), su correo
    $quien = (string) ($datos['nombre'] ?? $correoVisitante);
    $correo->Subject = $formulario['asunto'] . ' · '
        . (function_exists('mb_substr') ? mb_substr($quien, 0, 60) : substr($quien, 0, 60));
    $correo->Body = construirCorreo($formulario, $datos, $origen);
    $correo->AltBody = construirTexto($formulario, $datos, $origen);

    $correo->send();
} catch (CorreoException $e) {
    error_log('solicitud.php: el SMTP rechazó el envío: ' . $e->getMessage());
    registrarSolicitud($tipo, $datos, $origen, false);
    responder(502, ['ok' => false, 'error' => 'No se pudo enviar la solicitud.']);
} catch (Throwable $e) {
    error_log('solicitud.php: fallo al enviar la solicitud: ' . $e->getMessage());
    registrarSolicitud($tipo, $datos, $origen, false);
    responder(500, ['ok' => false, 'error' => 'No se pudo enviar la solicitud.']);
}

registrarSolicitud($tipo, $datos, $origen, true);
responder(200, ['ok' => true]);
