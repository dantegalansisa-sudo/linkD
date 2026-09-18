<?php
/*
  Usuarios del panel (solo administradores).

    GET  /api/ldwam/usuarios
    POST { accion: 'crear', nombre, correo, rol, clave }
    POST { accion: 'editar', id, nombre, correo, rol, activo }
    POST { accion: 'clave', id, clave }        (restablecer la de otro)
    POST { accion: 'eliminar', id }
*/

declare(strict_types=1);

require __DIR__ . '/comun.php';

iniciarSesion();
$yo = exigirSesion('administrador');

if (metodo() === 'GET') {
    responder(200, ['ok' => true, 'usuarios' => array_map('usuarioPublico', leerUsuarios())]);
}
if (metodo() !== 'POST') {
    fallo(405, 'Método no permitido.');
}
exigirOrigen();

$cuerpo = cuerpoJson();
$accion = texto($cuerpo['accion'] ?? '', 40);
$usuarios = leerUsuarios();

function indiceDe(array $usuarios, string $id): int
{
    foreach ($usuarios as $i => $u) {
        if (($u['id'] ?? '') === $id) {
            return $i;
        }
    }
    fallo(404, 'Usuario no encontrado.');
    return -1;
}

function correoLibre(array $usuarios, string $correo, ?string $exceptoId = null): void
{
    foreach ($usuarios as $u) {
        if (strtolower((string) ($u['correo'] ?? '')) === $correo && ($u['id'] ?? '') !== $exceptoId) {
            fallo(409, 'Ya hay un usuario con ese correo.');
        }
    }
}

function quedaAdministrador(array $usuarios): bool
{
    foreach ($usuarios as $u) {
        if (($u['rol'] ?? '') === 'administrador' && !empty($u['activo'])) {
            return true;
        }
    }
    return false;
}

if ($accion === 'crear') {
    $nombre = texto($cuerpo['nombre'] ?? '', 80);
    $correo = strtolower(texto($cuerpo['correo'] ?? '', 120));
    $rol = texto($cuerpo['rol'] ?? 'editor', 20);
    $clave = (string) ($cuerpo['clave'] ?? '');
    if ($nombre === '' || !filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        fallo(400, 'Escribe un nombre y un correo válido.');
    }
    if (!in_array($rol, ROLES, true)) {
        fallo(400, 'Rol desconocido.');
    }
    if (strlen($clave) < 8) {
        fallo(400, 'La contraseña debe tener al menos 8 caracteres.');
    }
    correoLibre($usuarios, $correo);
    $nuevo = [
        'id' => idNuevo(),
        'nombre' => $nombre,
        'correo' => $correo,
        'rol' => $rol,
        'clave' => password_hash($clave, PASSWORD_DEFAULT),
        'activo' => true,
        'creado' => ahora(),
        'ultimoAcceso' => '',
    ];
    $usuarios[] = $nuevo;
    guardarUsuarios($usuarios);
    anotarActividad('Usuarios', "Creó la cuenta de $nombre ($rol)");
    responder(200, ['ok' => true, 'usuarios' => array_map('usuarioPublico', $usuarios)]);
}

if ($accion === 'editar') {
    $id = texto($cuerpo['id'] ?? '', 40);
    $i = indiceDe($usuarios, $id);
    $nombre = texto($cuerpo['nombre'] ?? '', 80);
    $correo = strtolower(texto($cuerpo['correo'] ?? '', 120));
    $rol = texto($cuerpo['rol'] ?? 'editor', 20);
    $activo = !empty($cuerpo['activo']);
    if ($nombre === '' || !filter_var($correo, FILTER_VALIDATE_EMAIL) || !in_array($rol, ROLES, true)) {
        fallo(400, 'Revisa el nombre, el correo y el rol.');
    }
    correoLibre($usuarios, $correo, $id);
    $usuarios[$i]['nombre'] = $nombre;
    $usuarios[$i]['correo'] = $correo;
    $usuarios[$i]['rol'] = $rol;
    $usuarios[$i]['activo'] = $activo;
    if (!quedaAdministrador($usuarios)) {
        fallo(400, 'Tiene que quedar al menos un administrador activo.');
    }
    guardarUsuarios($usuarios);
    anotarActividad('Usuarios', "Editó la cuenta de $nombre");
    responder(200, ['ok' => true, 'usuarios' => array_map('usuarioPublico', $usuarios)]);
}

if ($accion === 'clave') {
    $id = texto($cuerpo['id'] ?? '', 40);
    $i = indiceDe($usuarios, $id);
    $clave = (string) ($cuerpo['clave'] ?? '');
    if (strlen($clave) < 8) {
        fallo(400, 'La contraseña debe tener al menos 8 caracteres.');
    }
    $usuarios[$i]['clave'] = password_hash($clave, PASSWORD_DEFAULT);
    guardarUsuarios($usuarios);
    anotarActividad('Usuarios', 'Restableció la contraseña de ' . $usuarios[$i]['nombre']);
    responder(200, ['ok' => true]);
}

if ($accion === 'eliminar') {
    $id = texto($cuerpo['id'] ?? '', 40);
    $i = indiceDe($usuarios, $id);
    if ($id === $yo['id']) {
        fallo(400, 'No puedes eliminar tu propia cuenta.');
    }
    $nombre = $usuarios[$i]['nombre'];
    array_splice($usuarios, $i, 1);
    if (!quedaAdministrador($usuarios)) {
        fallo(400, 'Tiene que quedar al menos un administrador activo.');
    }
    guardarUsuarios($usuarios);
    anotarActividad('Usuarios', "Eliminó la cuenta de $nombre");
    responder(200, ['ok' => true, 'usuarios' => array_map('usuarioPublico', $usuarios)]);
}

fallo(400, 'Acción desconocida.');
