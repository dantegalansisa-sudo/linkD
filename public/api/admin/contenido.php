<?php
/*
  Contenido del sitio: leer el maestro, guardar una coleccion, publicar,
  historial y restauracion.

    GET  /api/admin/contenido?accion=maestro     -> todo, con borradores
    GET  /api/admin/contenido?accion=borrador    -> lo que la web lee en vista previa
    GET  /api/admin/contenido?accion=historial   -> copias guardadas (administrador)
    POST { accion: 'inicializar', sitio }        -> carga inicial, solo una vez
    POST { accion: 'guardar', coleccion, datos, version }
    POST { accion: 'publicar' }                  -> vuelve a generar /datos/sitio.json
    POST { accion: 'restaurar', archivo }        -> administrador
*/

declare(strict_types=1);

require __DIR__ . '/comun.php';

iniciarSesion();
$yo = exigirSesion();

/* ---------- lecturas ---------- */
if (metodo() === 'GET') {
    $accion = texto($_GET['accion'] ?? 'maestro', 40);
    $m = leerMaestro();

    if ($accion === 'borrador') {
        // la web publica, en vista previa: todo, publicado o no
        $quitar = function (array $lista): array {
            return array_values(array_map(function ($x) {
                if (is_array($x)) {
                    unset($x['publicado']);
                }
                return $x;
            }, $lista));
        };
        $recursos = [];
        foreach (TIPOS_RECURSO as $t) {
            $recursos[$t] = $quitar($m['recursos'][$t] ?? []);
        }
        responder(200, ['ok' => true, 'sitio' => [
            'version' => (int) $m['version'],
            'actualizado' => (string) $m['actualizado'],
            'noticias' => $quitar($m['noticias']),
            'categoriasNoticias' => comoObjeto($m['categoriasNoticias']),
            'recursos' => $recursos,
            'obraSocial' => [
                'proximas' => $quitar($m['obraSocial']['proximas']),
                'jornadas' => $quitar($m['obraSocial']['jornadas']),
                'cifras' => array_values($m['obraSocial']['cifras']),
            ],
            'imagenes' => comoObjeto($m['imagenes']),
        ]]);
    }

    if ($accion === 'historial') {
        exigirSesion('administrador');
        $archivos = glob(archivoPrivado('historial') . '/contenido-*.json') ?: [];
        rsort($archivos);
        $lista = [];
        foreach ($archivos as $a) {
            $lista[] = [
                'archivo' => basename($a),
                'fecha' => gmdate('Y-m-d\TH:i:s\Z', filemtime($a) ?: 0),
                'tamano' => filesize($a) ?: 0,
            ];
        }
        responder(200, ['ok' => true, 'historial' => $lista]);
    }

    $m['categoriasNoticias'] = comoObjeto($m['categoriasNoticias']);
    $m['imagenes'] = comoObjeto($m['imagenes']);
    responder(200, ['ok' => true, 'maestro' => $m]);
}

if (metodo() !== 'POST') {
    fallo(405, 'Método no permitido.');
}
exigirOrigen();

$cuerpo = cuerpoJson();
$accion = texto($cuerpo['accion'] ?? '', 40);
$m = leerMaestro();

/* ---------- carga inicial ---------- */
if ($accion === 'inicializar') {
    if (!empty($m['inicializado'])) {
        fallo(409, 'El contenido ya estaba inicializado.');
    }
    $sitio = limpiarContenido($cuerpo['sitio'] ?? []);
    if (!is_array($sitio)) {
        fallo(400, 'Contenido inicial incorrecto.');
    }
    foreach (COLECCIONES as $c) {
        if (isset($sitio[$c])) {
            $m[$c] = $sitio[$c];
        }
    }
    $m = guardarMaestro($m, 'Contenido', 'Cargó el contenido inicial de la web');
    responder(200, ['ok' => true, 'version' => $m['version'], 'actualizado' => $m['actualizado']]);
}

/* ---------- guardar una coleccion ---------- */
if ($accion === 'guardar') {
    $coleccion = texto($cuerpo['coleccion'] ?? '', 40);
    if (!in_array($coleccion, COLECCIONES, true)) {
        fallo(400, 'Colección desconocida.');
    }
    // alguien mas puede haber guardado mientras tanto
    $version = isset($cuerpo['version']) ? (int) $cuerpo['version'] : null;
    if ($version !== null && $version !== (int) $m['version']) {
        $m['categoriasNoticias'] = comoObjeto($m['categoriasNoticias']);
        $m['imagenes'] = comoObjeto($m['imagenes']);
        fallo(409, 'Otra persona guardó cambios mientras editabas. Se ha recargado el contenido; revisa y vuelve a guardar.', ['maestro' => $m]);
    }

    $datos = limpiarContenido($cuerpo['datos'] ?? null);
    $detalle = texto($cuerpo['detalle'] ?? '', 200);

    switch ($coleccion) {
        case 'noticias':
            if (!is_array($datos)) {
                fallo(400, 'Formato incorrecto.');
            }
            $datos = array_values($datos);
            validarSlugs($datos, 'noticias');
            break;
        case 'recursos':
            if (!is_array($datos)) {
                fallo(400, 'Formato incorrecto.');
            }
            $limpio = [];
            foreach (TIPOS_RECURSO as $t) {
                $lista = array_values(is_array($datos[$t] ?? null) ? $datos[$t] : []);
                validarSlugs($lista, $t);
                foreach ($lista as &$item) {
                    $item['tipo'] = $t;
                }
                unset($item);
                $limpio[$t] = $lista;
            }
            $datos = $limpio;
            break;
        case 'obraSocial':
            if (!is_array($datos)) {
                fallo(400, 'Formato incorrecto.');
            }
            $proximas = array_values(is_array($datos['proximas'] ?? null) ? $datos['proximas'] : []);
            $jornadas = array_values(is_array($datos['jornadas'] ?? null) ? $datos['jornadas'] : []);
            validarSlugs($proximas, 'próximas jornadas');
            validarSlugs($jornadas, 'jornadas realizadas');
            $datos = [
                'proximas' => $proximas,
                'jornadas' => $jornadas,
                'cifras' => array_values(is_array($datos['cifras'] ?? null) ? $datos['cifras'] : []),
            ];
            break;
        case 'categoriasNoticias':
            $limpio = [];
            foreach (is_array($datos) ? $datos : [] as $nombre => $color) {
                if (is_string($nombre) && $nombre !== '' && is_string($color) && preg_match('/^#[0-9a-fA-F]{6}$/', $color)) {
                    $limpio[$nombre] = strtolower($color);
                }
            }
            $datos = comoObjeto($limpio);
            break;
        case 'imagenes':
            $limpio = [];
            foreach (is_array($datos) ? $datos : [] as $ruta => $nueva) {
                if (is_string($ruta) && preg_match('#^/(img|video)/#', $ruta) && is_string($nueva) && $nueva !== '' && urlAdmitida($nueva)) {
                    $limpio[$ruta] = $nueva;
                }
            }
            $datos = comoObjeto($limpio);
            break;
    }

    $m[$coleccion] = $datos;
    $etiquetas = [
        'noticias' => 'Noticias',
        'categoriasNoticias' => 'Categorías',
        'recursos' => 'Recursos',
        'obraSocial' => 'Obra social',
        'imagenes' => 'Imágenes del sitio',
    ];
    $m = guardarMaestro($m, $etiquetas[$coleccion], $detalle);
    responder(200, ['ok' => true, 'version' => $m['version'], 'actualizado' => $m['actualizado']]);
}

/* ---------- volver a publicar ---------- */
if ($accion === 'publicar') {
    if (!escribirJson(dirDatos() . '/sitio.json', construirPublicado($m))) {
        fallo(500, 'No se pudo escribir /datos/sitio.json.');
    }
    anotarActividad('Publicación', 'Volvió a generar el contenido publicado');
    responder(200, ['ok' => true]);
}

/* ---------- restaurar una copia ---------- */
if ($accion === 'restaurar') {
    exigirSesion('administrador');
    $archivo = basename(texto($cuerpo['archivo'] ?? '', 120));
    if (!preg_match('/^contenido-\d{8}-\d{6}-v\d+\.json$/', $archivo)) {
        fallo(400, 'Copia no válida.');
    }
    $ruta = archivoPrivado('historial') . '/' . $archivo;
    $copia = leerJson($ruta, null);
    if (!is_array($copia)) {
        fallo(404, 'No se encontró esa copia.');
    }
    foreach (COLECCIONES as $c) {
        if (isset($copia[$c])) {
            $m[$c] = $copia[$c];
        }
    }
    $m = guardarMaestro($m, 'Restauración', "Restauró la copia $archivo");
    responder(200, ['ok' => true, 'version' => $m['version'], 'actualizado' => $m['actualizado']]);
}

fallo(400, 'Acción desconocida.');
