<?php
/*
  Estado del sistema: lo que el panel de inicio muestra (resumen del
  contenido, actividad reciente) y lo que "Ajustes" necesita para saber si
  el servidor puede procesar fotos, cuanto admite por subida y si las
  carpetas se pueden escribir.

    GET /api/ldwam/estado
*/

declare(strict_types=1);

require __DIR__ . '/comun.php';

iniciarSesion();
exigirSesion();

function tamanoCarpeta(string $ruta): array
{
    $bytes = 0;
    $archivos = 0;
    if (!is_dir($ruta)) {
        return ['bytes' => 0, 'archivos' => 0];
    }
    $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($ruta, FilesystemIterator::SKIP_DOTS));
    foreach ($it as $f) {
        if ($f->isFile()) {
            $bytes += $f->getSize();
            $archivos++;
        }
    }
    return ['bytes' => $bytes, 'archivos' => $archivos];
}

function aBytesEstado(string $valor): int
{
    $valor = trim($valor);
    if ($valor === '' || $valor === '-1') {
        return -1;
    }
    $unidad = strtolower(substr($valor, -1));
    $n = (float) $valor;
    if ($unidad === 'g') {
        return (int) ($n * 1073741824);
    }
    if ($unidad === 'm') {
        return (int) ($n * 1048576);
    }
    if ($unidad === 'k') {
        return (int) ($n * 1024);
    }
    return (int) $n;
}

$m = leerMaestro();
$medios = leerMedios();
$solicitudes = leerJson(archivoPrivado('solicitudes.json'), []);
$actividad = leerJson(archivoPrivado('actividad.json'), []);
$publicado = dirDatos() . '/sitio.json';

$cuenta = function (array $lista): array {
    $pub = 0;
    foreach ($lista as $x) {
        if (is_array($x) && (!array_key_exists('publicado', $x) || $x['publicado'] !== false)) {
            $pub++;
        }
    }
    return ['total' => count($lista), 'publicados' => $pub];
};

$recursos = [];
foreach (TIPOS_RECURSO as $t) {
    $recursos[$t] = $cuenta($m['recursos'][$t] ?? []);
}
$nuevas = 0;
foreach (is_array($solicitudes) ? $solicitudes : [] as $s) {
    if (($s['estado'] ?? 'nueva') === 'nueva') {
        $nuevas++;
    }
}
$porTipo = ['imagen' => 0, 'video' => 0, 'documento' => 0];
foreach ($medios as $x) {
    $porTipo[$x['tipo'] ?? 'imagen'] = ($porTipo[$x['tipo'] ?? 'imagen'] ?? 0) + 1;
}

responder(200, [
    'ok' => true,
    'resumen' => [
        'inicializado' => !empty($m['inicializado']),
        'version' => (int) $m['version'],
        'actualizado' => (string) $m['actualizado'],
        'actualizadoPor' => (string) ($m['actualizadoPor'] ?? ''),
        'publicadoEl' => is_file($publicado) ? gmdate('Y-m-d\TH:i:s\Z', filemtime($publicado) ?: 0) : '',
        'noticias' => $cuenta($m['noticias'] ?? []),
        'recursos' => $recursos,
        'proximas' => $cuenta($m['obraSocial']['proximas'] ?? []),
        'jornadas' => $cuenta($m['obraSocial']['jornadas'] ?? []),
        'imagenesSustituidas' => is_array($m['imagenes']) ? count($m['imagenes']) : 0,
        'medios' => $porTipo,
        'solicitudesNuevas' => $nuevas,
        'solicitudesTotal' => is_array($solicitudes) ? count($solicitudes) : 0,
    ],
    'actividad' => array_slice(is_array($actividad) ? $actividad : [], 0, 12),
    'servidor' => [
        'php' => PHP_VERSION,
        'panel' => ADMIN_VERSION,
        'gd' => function_exists('imagecreatetruecolor'),
        'webp' => function_exists('imagewebp'),
        'exif' => function_exists('exif_read_data'),
        'finfo' => function_exists('finfo_open'),
        'uploadMax' => aBytesEstado((string) ini_get('upload_max_filesize')),
        'postMax' => aBytesEstado((string) ini_get('post_max_size')),
        'memoria' => (string) ini_get('memory_limit'),
        'tiempoMax' => (int) ini_get('max_execution_time'),
        'privado' => dirPrivado(),
        'privadoEscribible' => is_writable(dirPrivado()),
        'privadoDentroDePublic' => strpos(dirPrivado(), rutaPublica()) === 0,
        'mediosEscribible' => is_writable(dirMedios()),
        'datosEscribible' => is_writable(dirDatos()),
        'medios' => tamanoCarpeta(dirMedios()),
        'https' => esHttps(),
    ],
]);
