<?php
/*
  Servidor PHP de desarrollo para la API del panel de administracion.

    php -S 127.0.0.1:8090 dev/php-router.php

  Vite (npm run dev) reenvia /api/admin, /api/solicitud, /datos y /media a
  este servidor. Todo lo que el panel escribe en desarrollo (JSON, subidas,
  sesiones) va a la carpeta linkdicom-dev/ de la raiz del proyecto, que no
  se sube al repositorio, para que public/ se quede limpio y un build nunca
  arrastre datos de prueba a produccion.
*/

$raiz = dirname(__DIR__);
$www = $raiz . '/linkdicom-dev/www';
if (!is_dir($www)) {
    mkdir($www, 0777, true);
}
$_SERVER['DOCUMENT_ROOT'] = $www;

$ruta = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/';

// API del panel: /api/admin/<nombre> -> public/api/admin/<nombre>.php
if (preg_match('#^/api/admin/([a-z]+)/?$#', $ruta, $m)) {
    $archivo = $raiz . '/public/api/admin/' . $m[1] . '.php';
    if (is_file($archivo)) {
        chdir(dirname($archivo));
        require $archivo;
        return true;
    }
    http_response_code(404);
    return true;
}

// formulario de la web (version PHP)
if ($ruta === '/api/solicitud' || $ruta === '/api/solicitud/') {
    chdir($raiz . '/public/api');
    require $raiz . '/public/api/solicitud.php';
    return true;
}

// lo que el panel ha publicado o subido
$estatico = $www . $ruta;
if (is_file($estatico)) {
    $ext = strtolower(pathinfo($estatico, PATHINFO_EXTENSION));
    $tipos = [
        'json' => 'application/json', 'webp' => 'image/webp', 'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg',
        'png' => 'image/png', 'gif' => 'image/gif', 'mp4' => 'video/mp4', 'webm' => 'video/webm', 'mov' => 'video/quicktime',
        'pdf' => 'application/pdf',
    ];
    header('Content-Type: ' . ($tipos[$ext] ?? 'application/octet-stream'));
    header('Cache-Control: no-cache');
    readfile($estatico);
    return true;
}

http_response_code(404);
return true;
