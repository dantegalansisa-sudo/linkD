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

const DESTINO_POR_DEFECTO = 'info@link-dicom.com';
const REMITE_NOMBRE_POR_DEFECTO = 'LINKDICOM';
const CORREO_VALIDO = '/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/';

/** Campos de cada tipo de solicitud: clave, etiqueta visible y si es obligatorio. */
const FORMULARIOS = [
    'demo' => [
        'asunto' => 'Solicitud de demo',
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
        'campos' => [
            ['nombre', 'Nombre completo', true],
            ['correo', 'Correo electrónico', true],
            ['telefono', 'Teléfono', true],
            ['ubicacion', 'Ciudad / Provincia', true],
            ['vacante', 'Vacante de interés', false],
            ['mensaje', 'Mensaje', false],
        ],
    ],
];

/** Termina la peticion con una respuesta JSON. */
function responder(int $codigo, array $cuerpo): void
{
    http_response_code($codigo);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($cuerpo, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

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
    foreach ($formulario['campos'] as [$clave, $etiqueta]) {
        if (empty($datos[$clave])) {
            continue;
        }
        $valor = nl2br(escapar((string) $datos[$clave]), false);
        $filas .= '<tr>'
            . '<td style="padding:8px 14px;border-bottom:1px solid #e6ebf3;color:#5f6b83;font-size:13px;white-space:nowrap;vertical-align:top">' . escapar($etiqueta) . '</td>'
            . '<td style="padding:8px 14px;border-bottom:1px solid #e6ebf3;color:#0c1526;font-size:14px">' . $valor . '</td>'
            . '</tr>';
    }

    $pie = 'Enviado desde el formulario de la web' . ($origen !== '' ? ' · ' . escapar($origen) : '');

    return '<!doctype html>'
        . '<html lang="es"><body style="margin:0;background:#f5f7fb;padding:24px;font-family:Segoe UI,system-ui,sans-serif">'
        . '<table style="max-width:620px;margin:0 auto;background:#fff;border:1px solid #dce3ef;border-radius:12px;border-collapse:collapse;width:100%">'
        . '<tr><td style="padding:18px 22px;background:#0b1120;border-radius:12px 12px 0 0">'
        . '<span style="color:#fff;font-size:18px;font-weight:700;letter-spacing:-0.5px">LINK<span style="color:#ff6a13">DICOM</span></span>'
        . '<div style="color:#9fb2cf;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin-top:4px">' . escapar($formulario['asunto']) . '</div>'
        . '</td></tr>'
        . '<tr><td style="padding:6px 8px"><table style="width:100%;border-collapse:collapse">' . $filas . '</table></td></tr>'
        . '<tr><td style="padding:14px 22px;color:#5f6b83;font-size:12px;border-top:1px solid #e6ebf3">' . $pie . '</td></tr>'
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
if (!preg_match(CORREO_VALIDO, $correoVisitante)) {
    responder(400, ['ok' => false, 'error' => 'El correo electrónico no es válido.']);
}

$config = leerConfiguracion();
if ($config === null) {
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
    $correo->addReplyTo($correoVisitante, (string) ($datos['nombre'] ?? ''));

    $correo->isHTML(true);
    $nombre = (string) ($datos['nombre'] ?? '');
    $correo->Subject = $formulario['asunto'] . ' · '
        . (function_exists('mb_substr') ? mb_substr($nombre, 0, 60) : substr($nombre, 0, 60));
    $correo->Body = construirCorreo($formulario, $datos, $origen);
    $correo->AltBody = construirTexto($formulario, $datos, $origen);

    $correo->send();
} catch (CorreoException $e) {
    error_log('solicitud.php: el SMTP rechazó el envío: ' . $e->getMessage());
    responder(502, ['ok' => false, 'error' => 'No se pudo enviar la solicitud.']);
} catch (Throwable $e) {
    error_log('solicitud.php: fallo al enviar la solicitud: ' . $e->getMessage());
    responder(500, ['ok' => false, 'error' => 'No se pudo enviar la solicitud.']);
}

responder(200, ['ok' => true]);
