<?php
/*
  Sesion del panel: quien soy, entrar, salir, instalar la primera cuenta y
  cambiar la propia contrasena.

    GET  /api/admin/sesion                    -> estado
    POST { accion: 'instalar', nombre, correo, clave }   (solo sin usuarios)
    POST { accion: 'entrar', correo, clave }
    POST { accion: 'salir' }
    POST { accion: 'clave', actual, nueva }
*/

declare(strict_types=1);

require __DIR__ . '/comun.php';

iniciarSesion();

if (metodo() === 'GET') {
    $usuarios = leerUsuarios();
    responder(200, [
        'ok' => true,
        'instalado' => count($usuarios) > 0,
        'usuario' => usuarioActual(),
        'version' => ADMIN_VERSION,
        // para avisar en la pantalla de instalacion si el servidor no deja guardar
        'servidor' => [
            'php' => PHP_VERSION,
            'escribible' => is_writable(dirPrivado()) && is_writable(dirDatos()) && is_writable(dirMedios()),
            'gd' => function_exists('imagecreatetruecolor'),
        ],
    ]);
}

if (metodo() !== 'POST') {
    fallo(405, 'Método no permitido.');
}

exigirOrigen();
$cuerpo = cuerpoJson();
$accion = texto($cuerpo['accion'] ?? '', 40);

/* ---------- primera cuenta ---------- */
if ($accion === 'instalar') {
    if (count(leerUsuarios()) > 0) {
        fallo(409, 'El panel ya está instalado.');
    }
    $nombre = texto($cuerpo['nombre'] ?? '', 80);
    $correo = strtolower(texto($cuerpo['correo'] ?? '', 120));
    $clave = (string) ($cuerpo['clave'] ?? '');
    if ($nombre === '' || !filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        fallo(400, 'Escribe tu nombre y un correo válido.');
    }
    if (strlen($clave) < 8) {
        fallo(400, 'La contraseña debe tener al menos 8 caracteres.');
    }
    $usuario = [
        'id' => idNuevo(),
        'nombre' => $nombre,
        'correo' => $correo,
        'rol' => 'administrador',
        'clave' => password_hash($clave, PASSWORD_DEFAULT),
        'activo' => true,
        'creado' => ahora(),
        'ultimoAcceso' => ahora(),
    ];
    if (!guardarUsuarios([$usuario])) {
        fallo(500, 'No se pudo crear la carpeta de datos del panel. Revisa los permisos de escritura en el servidor.');
    }
    session_regenerate_id(true);
    $_SESSION['usuario'] = $usuario['id'];
    anotarActividad('Instalación', 'Se creó la cuenta de administrador');
    responder(200, ['ok' => true, 'usuario' => usuarioPublico($usuario)]);
}

/* ---------- entrar ---------- */
if ($accion === 'entrar') {
    if (ipBloqueada()) {
        fallo(429, 'Demasiados intentos. Espera ' . BLOQUEO_MINUTOS . ' minutos y vuelve a probar.');
    }
    $correo = strtolower(texto($cuerpo['correo'] ?? '', 120));
    $clave = (string) ($cuerpo['clave'] ?? '');
    $usuarios = leerUsuarios();
    $encontrado = null;
    foreach ($usuarios as $i => $u) {
        if (strtolower((string) ($u['correo'] ?? '')) === $correo) {
            $encontrado = $i;
            break;
        }
    }
    // el tiempo de respuesta no debe delatar si el correo existe
    $hashComparar = $encontrado !== null ? (string) $usuarios[$encontrado]['clave'] : password_hash('x', PASSWORD_DEFAULT);
    $correcto = password_verify($clave, $hashComparar) && $encontrado !== null && !empty($usuarios[$encontrado]['activo']);
    registrarIntento($correcto);
    if (!$correcto) {
        fallo(401, 'Correo o contraseña incorrectos.');
    }
    $usuarios[$encontrado]['ultimoAcceso'] = ahora();
    guardarUsuarios($usuarios);
    session_regenerate_id(true);
    $_SESSION['usuario'] = $usuarios[$encontrado]['id'];
    anotarActividad('Entrada', 'Inició sesión');
    responder(200, ['ok' => true, 'usuario' => usuarioPublico($usuarios[$encontrado])]);
}

/* ---------- salir ---------- */
if ($accion === 'salir') {
    cerrarSesion();
    responder(200, ['ok' => true]);
}

/* ---------- cambiar mi contrasena ---------- */
if ($accion === 'clave') {
    $yo = exigirSesion();
    $actual = (string) ($cuerpo['actual'] ?? '');
    $nueva = (string) ($cuerpo['nueva'] ?? '');
    if (strlen($nueva) < 8) {
        fallo(400, 'La nueva contraseña debe tener al menos 8 caracteres.');
    }
    $usuarios = leerUsuarios();
    foreach ($usuarios as $i => $u) {
        if (($u['id'] ?? '') === $yo['id']) {
            if (!password_verify($actual, (string) $u['clave'])) {
                fallo(400, 'La contraseña actual no es correcta.');
            }
            $usuarios[$i]['clave'] = password_hash($nueva, PASSWORD_DEFAULT);
            guardarUsuarios($usuarios);
            anotarActividad('Contraseña', 'Cambió su contraseña');
            responder(200, ['ok' => true]);
        }
    }
    fallo(404, 'Usuario no encontrado.');
}

fallo(400, 'Acción desconocida.');
