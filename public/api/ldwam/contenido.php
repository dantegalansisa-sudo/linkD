<?php
/*
  Contenido del sitio: leer el maestro, guardar una coleccion, publicar,
  historial y restauracion.

    GET  /api/ldwam/contenido?accion=maestro     -> todo, con borradores
    GET  /api/ldwam/contenido?accion=borrador    -> lo que la web lee en vista previa
    GET  /api/ldwam/contenido?accion=historial   -> copias guardadas (administrador)
    POST { accion: 'inicializar', sitio, huella } -> contenido de partida (se repite
                                                    mientras nadie haya guardado nada)
    POST { accion: 'guardar', coleccion, datos, version }
    POST { accion: 'guardar-varias', colecciones: { nombre: datos }, version }
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
            'editado' => !empty($m['editado']),
            'noticias' => $quitar($m['noticias']),
            'categoriasNoticias' => comoObjeto($m['categoriasNoticias']),
            'recursos' => $recursos,
            'obraSocial' => [
                'proximas' => $quitar($m['obraSocial']['proximas']),
                'jornadas' => $quitar($m['obraSocial']['jornadas']),
                'cifras' => array_values($m['obraSocial']['cifras']),
            ],
            'imagenes' => comoObjeto($m['imagenes']),
            'publicidad' => comoObjeto($m['publicidad']),
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
    $m['publicidad'] = comoObjeto($m['publicidad']);
    $m['noticias'] = completarAutores($m['noticias']);
    responder(200, ['ok' => true, 'maestro' => $m]);
}

if (metodo() !== 'POST') {
    fallo(405, 'Método no permitido.');
}
exigirOrigen();

$cuerpo = cuerpoJson();
$accion = texto($cuerpo['accion'] ?? '', 40);
$m = leerMaestro();

/* ---------- contenido de partida ---------- */
// La primera vez carga lo que trae la web. Mientras nadie haya guardado nada
// desde el panel, cada version nueva de la web lo vuelve a cargar (el panel
// compara la huella del contenido del codigo con la guardada), para que los
// cambios hechos en el codigo lleguen sin pisar el trabajo de nadie.
if ($accion === 'inicializar') {
    if (!empty($m['inicializado']) && !empty($m['editado'])) {
        fallo(409, 'El contenido ya tiene cambios guardados desde el panel; no se sustituye.');
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
    $m['huellaBase'] = texto($cuerpo['huella'] ?? '', 40);
    $detalle = empty($m['inicializado']) ? 'Cargó el contenido inicial de la web' : 'Actualizó el contenido de partida con la versión nueva de la web';
    $m = guardarMaestro($m, 'Contenido', $detalle, false);
    responder(200, ['ok' => true, 'version' => $m['version'], 'actualizado' => $m['actualizado']]);
}

/* ---------- guardar ---------- */

/** Limpia y valida los datos de una coleccion antes de guardarlos. */
function limpiarColeccion(string $coleccion, $datos)
{
    switch ($coleccion) {
        case 'noticias':
            if (!is_array($datos)) {
                fallo(400, 'Formato incorrecto.');
            }
            $datos = array_values($datos);
            validarSlugs($datos, 'noticias');
            foreach ($datos as &$n) {
                // fecha y hora de publicacion programada: "2026-10-12T09:00" o nada
                $cuando = substr((string) ($n['publicarEl'] ?? ''), 0, 16);
                if ($cuando === '' || !preg_match('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/', $cuando)) {
                    unset($n['publicarEl']);
                } else {
                    $n['publicarEl'] = $cuando;
                }
                if (isset($n['etiquetas'])) {
                    $n['etiquetas'] = array_values(array_filter(array_map(function ($e) {
                        return is_string($e) ? texto($e, 40) : '';
                    }, is_array($n['etiquetas']) ? $n['etiquetas'] : [])));
                }
            }
            unset($n);
            return $datos;
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
            return $limpio;
        case 'obraSocial':
            if (!is_array($datos)) {
                fallo(400, 'Formato incorrecto.');
            }
            $proximas = array_values(is_array($datos['proximas'] ?? null) ? $datos['proximas'] : []);
            $jornadas = array_values(is_array($datos['jornadas'] ?? null) ? $datos['jornadas'] : []);
            validarSlugs($proximas, 'próximas jornadas');
            validarSlugs($jornadas, 'jornadas realizadas');
            return [
                'proximas' => $proximas,
                'jornadas' => $jornadas,
                'cifras' => array_values(is_array($datos['cifras'] ?? null) ? $datos['cifras'] : []),
            ];
        case 'categoriasNoticias':
            $limpio = [];
            foreach (is_array($datos) ? $datos : [] as $nombre => $color) {
                if (is_string($nombre) && $nombre !== '' && is_string($color) && preg_match('/^#[0-9a-fA-F]{6}$/', $color)) {
                    $limpio[$nombre] = strtolower($color);
                }
            }
            return comoObjeto($limpio);
        case 'imagenes':
            $limpio = [];
            foreach (is_array($datos) ? $datos : [] as $ruta => $nueva) {
                if (is_string($ruta) && preg_match('#^/(img|video|brand)/#', $ruta) && is_string($nueva) && $nueva !== '' && urlAdmitida($nueva)) {
                    $limpio[$ruta] = $nueva;
                }
            }
            return comoObjeto($limpio);
        case 'publicidad':
            // un anuncio por espacio: imagen de la biblioteca y enlace (web externa o pagina propia)
            $limpio = [];
            foreach (ESPACIOS_PUBLICIDAD as $espacio) {
                $a = is_array($datos[$espacio] ?? null) ? $datos[$espacio] : null;
                if ($a === null) {
                    continue;
                }
                $enlace = texto($a['enlace'] ?? '', 500);
                if ($enlace !== '' && !preg_match('#^(https?://|/)#i', $enlace)) {
                    $enlace = 'https://' . $enlace;
                }
                if (preg_match('#^//#', $enlace)) {
                    $enlace = '';
                }
                $imagen = texto($a['imagen'] ?? '', 500);
                $limpio[$espacio] = [
                    'activo' => !empty($a['activo']),
                    'imagen' => urlAdmitida($imagen) ? $imagen : '',
                    'enlace' => $enlace,
                    'alt' => texto($a['alt'] ?? '', 200),
                    'anunciante' => texto($a['anunciante'] ?? '', 120),
                ];
            }
            return comoObjeto($limpio);
    }
    fallo(400, 'Colección desconocida.');
    return null;
}

/**
 * Quien crea y quien publica cada noticia lo anota el servidor con el
 * usuario de la sesion: no se puede falsear desde el navegador.
 */
function sellarAutores(array $nuevas, array $antes, array $yo): array
{
    $previas = [];
    foreach (completarAutores($antes) as $n) {
        if (is_array($n) && isset($n['slug'])) {
            $previas[$n['slug']] = $n;
        }
    }
    $nombre = (string) ($yo['nombre'] ?? '');
    foreach ($nuevas as &$n) {
        $p = $previas[$n['slug']] ?? null;
        $n['creadoPor'] = (string) ($p['creadoPor'] ?? '');
        if ($n['creadoPor'] === '') {
            $n['creadoPor'] = $p === null ? $nombre : '';
        }
        $publicada = !array_key_exists('publicado', $n) || $n['publicado'] !== false;
        $estabaPublicada = $p !== null && (!array_key_exists('publicado', $p) || $p['publicado'] !== false);
        if ($publicada && $p !== null && $estabaPublicada) {
            // sigue publicada: se conserva quien la publico
            $n['publicadoPor'] = (string) ($p['publicadoPor'] ?? '');
            $n['publicadoEl'] = (string) ($p['publicadoEl'] ?? '');
        } elseif ($publicada) {
            $n['publicadoPor'] = $nombre;
            $n['publicadoEl'] = ahora();
        } else {
            unset($n['publicadoPor'], $n['publicadoEl']);
        }
    }
    unset($n);
    return $nuevas;
}

$etiquetas = [
    'noticias' => 'Noticias',
    'categoriasNoticias' => 'Categorías',
    'recursos' => 'Recursos',
    'obraSocial' => 'Obra social',
    'imagenes' => 'Imágenes del sitio',
    'publicidad' => 'Publicidad',
];

/*
  guardar: una coleccion. guardar-varias: varias de una vez, con una sola
  version (renombrar una categoria cambia tambien sus noticias).
*/
if ($accion === 'guardar' || $accion === 'guardar-varias') {
    if ($accion === 'guardar') {
        $cambios = [texto($cuerpo['coleccion'] ?? '', 40) => $cuerpo['datos'] ?? null];
    } else {
        $cambios = is_array($cuerpo['colecciones'] ?? null) ? $cuerpo['colecciones'] : [];
    }
    if ($cambios === []) {
        fallo(400, 'No hay nada que guardar.');
    }
    foreach (array_keys($cambios) as $c) {
        if (!in_array($c, COLECCIONES, true)) {
            fallo(400, 'Colección desconocida.');
        }
    }
    // alguien mas puede haber guardado mientras tanto
    $version = isset($cuerpo['version']) ? (int) $cuerpo['version'] : null;
    if ($version !== null && $version !== (int) $m['version']) {
        $m['categoriasNoticias'] = comoObjeto($m['categoriasNoticias']);
        $m['imagenes'] = comoObjeto($m['imagenes']);
        $m['publicidad'] = comoObjeto($m['publicidad']);
        fallo(409, 'Otra persona guardó cambios mientras editabas. Se ha recargado el contenido; revisa y vuelve a guardar.', ['maestro' => $m]);
    }

    $detalle = texto($cuerpo['detalle'] ?? '', 200);
    $nombres = [];
    foreach ($cambios as $c => $bruto) {
        $datos = limpiarColeccion($c, limpiarContenido($bruto));
        if ($c === 'noticias') {
            $datos = sellarAutores($datos, $m['noticias'], $yo);
        }
        $m[$c] = $datos;
        $nombres[] = $etiquetas[$c];
    }
    $m = guardarMaestro($m, implode(' y ', $nombres), $detalle);
    responder(200, [
        'ok' => true,
        'version' => $m['version'],
        'actualizado' => $m['actualizado'],
        // las noticias vuelven con sus autores ya sellados
        'noticias' => isset($cambios['noticias']) ? $m['noticias'] : null,
    ]);
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
