<?php
/*
  Bandeja de solicitudes: lo que llega por los formularios de la web
  (demo, contacto, empleo, aportes a la obra social y boletin). Cada envio
  se anota aqui ademas de mandarse por correo, para que nada se pierda.

    GET  /api/ldwam/solicitudes?estado=nueva|atendida
    POST { accion: 'estado', id, estado }
    POST { accion: 'eliminar', id }
*/

declare(strict_types=1);

require __DIR__ . '/comun.php';

iniciarSesion();
exigirSesion();

$ruta = archivoPrivado('solicitudes.json');

if (metodo() === 'GET') {
    $lista = leerJson($ruta, []);
    if (!is_array($lista)) {
        $lista = [];
    }
    $estado = texto($_GET['estado'] ?? '', 20);
    if ($estado !== '') {
        $lista = array_values(array_filter($lista, function ($s) use ($estado) {
            return ($s['estado'] ?? 'nueva') === $estado;
        }));
    }
    $nuevas = 0;
    foreach (leerJson($ruta, []) ?: [] as $s) {
        if (($s['estado'] ?? 'nueva') === 'nueva') {
            $nuevas++;
        }
    }
    responder(200, ['ok' => true, 'solicitudes' => array_slice($lista, 0, 500), 'nuevas' => $nuevas]);
}

if (metodo() !== 'POST') {
    fallo(405, 'Método no permitido.');
}
exigirOrigen();

$cuerpo = cuerpoJson();
$accion = texto($cuerpo['accion'] ?? '', 20);
$id = texto($cuerpo['id'] ?? '', 40);
$lista = leerJson($ruta, []);
if (!is_array($lista)) {
    $lista = [];
}

$indice = null;
foreach ($lista as $i => $s) {
    if (($s['id'] ?? '') === $id) {
        $indice = $i;
        break;
    }
}
if ($indice === null) {
    fallo(404, 'Solicitud no encontrada.');
}

if ($accion === 'estado') {
    $estado = texto($cuerpo['estado'] ?? '', 20);
    if (!in_array($estado, ['nueva', 'atendida'], true)) {
        fallo(400, 'Estado desconocido.');
    }
    $lista[$indice]['estado'] = $estado;
    $lista[$indice]['atendidaPor'] = $estado === 'atendida' ? (usuarioActual()['nombre'] ?? '') : '';
    $lista[$indice]['atendidaEl'] = $estado === 'atendida' ? ahora() : '';
    escribirJson($ruta, $lista);
    responder(200, ['ok' => true, 'solicitud' => $lista[$indice]]);
}

if ($accion === 'eliminar') {
    array_splice($lista, $indice, 1);
    escribirJson($ruta, $lista);
    responder(200, ['ok' => true]);
}

fallo(400, 'Acción desconocida.');
