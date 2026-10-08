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

require __DIR__ . '/correo.php';

use PHPMailer\PHPMailer\Exception as CorreoException;
use PHPMailer\PHPMailer\PHPMailer;

// responder() y registrarSolicitud(): cada envio queda tambien en la bandeja
// del panel de administracion, ademas de salir por correo
require __DIR__ . '/ldwam/comun.php';

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
