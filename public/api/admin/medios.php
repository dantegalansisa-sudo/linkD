<?php
/*
  Biblioteca de medios: fotos, videos y documentos que sube el panel.

    GET  /api/admin/medios?tipo=imagen|video|documento&q=texto
    POST multipart con "archivo"                 -> subida directa (archivos pequenos)
    POST ?accion=iniciar  { nombre, tamano }     -> subida por trozos: abre
    POST ?accion=trozo&id=..&indice=N  (cuerpo binario)
    POST ?accion=terminar { id }                 -> cierra y procesa
    POST ?accion=eliminar { id }
    POST ?accion=renombrar { id, nombre }

  Las fotos se reducen a 2000px de lado mayor y se guardan en WebP (si el
  servidor lo permite), con una miniatura de 480px para las rejillas del
  panel. Los videos y documentos se guardan tal cual.

  Los archivos van a public_html/media/<tipo>/<ano>/<mes>/nombre-xxxxxx.ext
  y el indice con sus datos, a la carpeta privada (medios.json).
*/

declare(strict_types=1);

require __DIR__ . '/comun.php';

iniciarSesion();
$yo = exigirSesion();

const LADO_MAXIMO = 2000;
const LADO_MINI = 480;
const CALIDAD_WEBP = 82;
const CALIDAD_JPEG = 86;
/** Trozo de 4 MB: por debajo de cualquier limite de subida de PHP. */
const TROZO = 4 * 1024 * 1024;
/** Tope absoluto por archivo (videos): 1,5 GB. */
const TAMANO_MAXIMO = 1536 * 1024 * 1024;

const EXT_IMAGEN = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
const EXT_VIDEO = ['mp4', 'webm', 'mov', 'm4v'];
const EXT_DOCUMENTO = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip', 'txt', 'csv'];

/* ============================================================
   Lectura
   ============================================================ */

if (metodo() === 'GET') {
    $tipo = texto($_GET['tipo'] ?? '', 20);
    $q = function_exists('mb_strtolower') ? mb_strtolower(texto($_GET['q'] ?? '', 80)) : strtolower(texto($_GET['q'] ?? '', 80));
    $lista = leerMedios();
    if ($tipo !== '') {
        $lista = array_values(array_filter($lista, function ($m) use ($tipo) {
            return ($m['tipo'] ?? '') === $tipo;
        }));
    }
    if ($q !== '') {
        $lista = array_values(array_filter($lista, function ($m) use ($q) {
            $n = function_exists('mb_strtolower') ? mb_strtolower((string) ($m['nombre'] ?? '')) : strtolower((string) ($m['nombre'] ?? ''));
            return strpos($n, $q) !== false;
        }));
    }
    responder(200, ['ok' => true, 'medios' => $lista, 'limites' => limitesSubida()]);
}

if (metodo() !== 'POST') {
    fallo(405, 'Método no permitido.');
}
exigirOrigen();

$accion = texto($_GET['accion'] ?? '', 20);

/* ============================================================
   Utilidades
   ============================================================ */

function aBytes(string $valor): int
{
    $valor = trim($valor);
    if ($valor === '' || $valor === '-1') {
        return PHP_INT_MAX;
    }
    $unidad = strtolower(substr($valor, -1));
    $n = (float) $valor;
    switch ($unidad) {
        case 'g':
            return (int) ($n * 1024 * 1024 * 1024);
        case 'm':
            return (int) ($n * 1024 * 1024);
        case 'k':
            return (int) ($n * 1024);
    }
    return (int) $n;
}

function limitesSubida(): array
{
    $directo = min(aBytes((string) ini_get('upload_max_filesize')), aBytes((string) ini_get('post_max_size')));
    return [
        'directo' => $directo,
        'trozo' => TROZO,
        'maximo' => TAMANO_MAXIMO,
        'webp' => function_exists('imagewebp'),
        'gd' => function_exists('imagecreatetruecolor'),
    ];
}

function extensionDe(string $nombre): string
{
    return strtolower(pathinfo($nombre, PATHINFO_EXTENSION));
}

function tipoPorExtension(string $ext): ?string
{
    if (in_array($ext, EXT_IMAGEN, true)) {
        return 'imagen';
    }
    if (in_array($ext, EXT_VIDEO, true)) {
        return 'video';
    }
    if (in_array($ext, EXT_DOCUMENTO, true)) {
        return 'documento';
    }
    return null;
}

/** Comprueba que el contenido del archivo cuadre con lo que dice ser. */
function comprobarContenido(string $ruta, string $tipo, string $ext): void
{
    $mime = '';
    if (function_exists('finfo_open')) {
        $f = finfo_open(FILEINFO_MIME_TYPE);
        if ($f) {
            $mime = (string) finfo_file($f, $ruta);
            finfo_close($f);
        }
    }
    // nada que pueda ejecutarse o pintarse como pagina
    if (preg_match('#^(text/html|application/x-httpd|application/x-php|text/x-php|application/javascript|text/javascript|image/svg)#i', $mime)) {
        fallo(400, 'Ese tipo de archivo no está permitido.');
    }
    if ($tipo === 'imagen') {
        $info = @getimagesize($ruta);
        if ($info === false) {
            fallo(400, 'El archivo no es una imagen válida.');
        }
        return;
    }
    if ($tipo === 'video' && $mime !== '' && strpos($mime, 'video/') !== 0 && $mime !== 'application/octet-stream') {
        fallo(400, 'El archivo no parece un video (' . $mime . ').');
    }
    if ($tipo === 'documento' && $ext === 'pdf' && $mime !== '' && $mime !== 'application/pdf' && $mime !== 'application/octet-stream') {
        fallo(400, 'El archivo no parece un PDF.');
    }
}

/** Carpeta de destino y nombre unico para un archivo nuevo. */
function destinoNuevo(string $tipo, string $nombreOriginal, string $ext): array
{
    $carpeta = ($tipo === 'imagen' ? 'imagenes' : ($tipo === 'video' ? 'videos' : 'documentos'));
    $sub = $carpeta . '/' . gmdate('Y') . '/' . gmdate('m');
    $dir = dirMedios() . '/' . $sub;
    if (!asegurarCarpeta($dir)) {
        fallo(500, 'No se pudo crear la carpeta de medios (permisos).');
    }
    $base = slugificar(pathinfo($nombreOriginal, PATHINFO_FILENAME), 60);
    if ($base === '') {
        $base = $tipo;
    }
    $base .= '-' . bin2hex(random_bytes(3));
    return [$dir, '/media/' . $sub, $base, $ext];
}

/**
 * Reduce, endereza y convierte una imagen. Devuelve la ruta publica final,
 * la miniatura y las medidas. Si GD no puede con ella (memoria, formato
 * raro), se guarda el original tal cual.
 */
function procesarImagen(string $origen, string $dir, string $url, string $base, string $ext): array
{
    $info = @getimagesize($origen);
    if ($info === false) {
        fallo(400, 'No se pudo leer la imagen.');
    }
    [$ancho, $alto, $tipoImg] = $info;
    $webp = function_exists('imagewebp');
    $gd = function_exists('imagecreatetruecolor');

    // sin GD (o si es un GIF, que puede ser animado) se guarda el original
    if (!$gd || $tipoImg === IMAGETYPE_GIF) {
        $final = "$dir/$base.$ext";
        if (!@rename($origen, $final) && !@copy($origen, $final)) {
            fallo(500, 'No se pudo guardar la imagen.');
        }
        @unlink($origen);
        return ['url' => "$url/$base.$ext", 'mini' => "$url/$base.$ext", 'ancho' => $ancho, 'alto' => $alto, 'tamano' => filesize($final) ?: 0];
    }

    @ini_set('memory_limit', '512M');
    $img = null;
    switch ($tipoImg) {
        case IMAGETYPE_JPEG:
            $img = @imagecreatefromjpeg($origen);
            break;
        case IMAGETYPE_PNG:
            $img = @imagecreatefrompng($origen);
            break;
        case IMAGETYPE_WEBP:
            $img = function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($origen) : null;
            break;
    }
    if (!$img) {
        // no se pudo decodificar: se guarda tal cual
        $final = "$dir/$base.$ext";
        if (!@rename($origen, $final) && !@copy($origen, $final)) {
            fallo(500, 'No se pudo guardar la imagen.');
        }
        @unlink($origen);
        return ['url' => "$url/$base.$ext", 'mini' => "$url/$base.$ext", 'ancho' => $ancho, 'alto' => $alto, 'tamano' => filesize($final) ?: 0];
    }

    // fotos de telefono: la orientacion viene en el EXIF
    if ($tipoImg === IMAGETYPE_JPEG && function_exists('exif_read_data')) {
        $exif = @exif_read_data($origen);
        $o = (int) ($exif['Orientation'] ?? 1);
        if ($o === 3) {
            $img = imagerotate($img, 180, 0);
        } elseif ($o === 6) {
            $img = imagerotate($img, -90, 0);
        } elseif ($o === 8) {
            $img = imagerotate($img, 90, 0);
        }
        if ($o === 6 || $o === 8) {
            [$ancho, $alto] = [$alto, $ancho];
        }
    }

    $conAlpha = $tipoImg === IMAGETYPE_PNG || $tipoImg === IMAGETYPE_WEBP;
    $grande = redimensionar($img, $ancho, $alto, LADO_MAXIMO, $conAlpha);
    $mini = redimensionar($img, $ancho, $alto, LADO_MINI, $conAlpha);
    imagedestroy($img);

    $extFinal = $webp ? 'webp' : ($conAlpha ? 'png' : 'jpg');
    $final = "$dir/$base.$extFinal";
    $finalMini = "$dir/$base-mini.$extFinal";
    if (!guardarImagen($grande['img'], $final, $extFinal) || !guardarImagen($mini['img'], $finalMini, $extFinal)) {
        fallo(500, 'No se pudo escribir la imagen procesada.');
    }
    imagedestroy($grande['img']);
    imagedestroy($mini['img']);
    @unlink($origen);

    return [
        'url' => "$url/$base.$extFinal",
        'mini' => "$url/$base-mini.$extFinal",
        'ancho' => $grande['ancho'],
        'alto' => $grande['alto'],
        'tamano' => filesize($final) ?: 0,
    ];
}

function redimensionar($img, int $ancho, int $alto, int $lado, bool $conAlpha): array
{
    $escala = min(1, $lado / max($ancho, $alto, 1));
    $na = max(1, (int) round($ancho * $escala));
    $nh = max(1, (int) round($alto * $escala));
    $nuevo = imagecreatetruecolor($na, $nh);
    if ($conAlpha) {
        imagealphablending($nuevo, false);
        imagesavealpha($nuevo, true);
        $transparente = imagecolorallocatealpha($nuevo, 0, 0, 0, 127);
        imagefilledrectangle($nuevo, 0, 0, $na, $nh, $transparente);
    } else {
        $blanco = imagecolorallocate($nuevo, 255, 255, 255);
        imagefilledrectangle($nuevo, 0, 0, $na, $nh, $blanco);
    }
    imagecopyresampled($nuevo, $img, 0, 0, 0, 0, $na, $nh, imagesx($img), imagesy($img));
    return ['img' => $nuevo, 'ancho' => $na, 'alto' => $nh];
}

function guardarImagen($img, string $ruta, string $ext): bool
{
    switch ($ext) {
        case 'webp':
            return @imagewebp($img, $ruta, CALIDAD_WEBP);
        case 'png':
            return @imagepng($img, $ruta, 7);
        default:
            return @imagejpeg($img, $ruta, CALIDAD_JPEG);
    }
}

/** Procesa un archivo ya en disco y lo anota en el indice. */
function incorporar(string $temporal, string $nombreOriginal, int $tamano, string $uso = ''): array
{
    global $yo;
    $ext = extensionDe($nombreOriginal);
    $tipo = tipoPorExtension($ext);
    if ($tipo === null) {
        @unlink($temporal);
        fallo(400, 'Formato no admitido. Fotos: JPG, PNG, WebP. Videos: MP4, WebM, MOV. Documentos: PDF, Word, Excel, PowerPoint, ZIP.');
    }
    comprobarContenido($temporal, $tipo, $ext);
    if ($ext === 'jpeg') {
        $ext = 'jpg';
    }
    [$dir, $url, $base, $ext] = destinoNuevo($tipo, $nombreOriginal, $ext);

    $entrada = [
        'id' => idNuevo(),
        'nombre' => texto($nombreOriginal, 160),
        'tipo' => $tipo,
        'extension' => $ext,
        'fecha' => ahora(),
        'usuario' => $yo['nombre'] ?? '',
        'uso' => texto($uso, 80),
    ];

    if ($tipo === 'imagen') {
        $r = procesarImagen($temporal, $dir, $url, $base, $ext);
        $entrada += $r;
        $entrada['extension'] = extensionDe($r['url']);
    } else {
        $final = "$dir/$base.$ext";
        if (!@rename($temporal, $final) && !@copy($temporal, $final)) {
            fallo(500, 'No se pudo guardar el archivo.');
        }
        @unlink($temporal);
        @chmod($final, 0644);
        $entrada['url'] = "$url/$base.$ext";
        $entrada['tamano'] = filesize($final) ?: $tamano;
    }

    $lista = leerMedios();
    array_unshift($lista, $entrada);
    guardarMedios($lista);
    anotarActividad('Medios', 'Subió ' . $entrada['nombre']);
    return $entrada;
}

/* ============================================================
   Subida directa (multipart)
   ============================================================ */

if ($accion === '' && isset($_FILES['archivo'])) {
    $f = $_FILES['archivo'];
    if (($f['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        $codigo = (int) $f['error'];
        if ($codigo === UPLOAD_ERR_INI_SIZE || $codigo === UPLOAD_ERR_FORM_SIZE) {
            fallo(413, 'El archivo supera el límite de subida directa del servidor.');
        }
        fallo(400, 'No se recibió el archivo (error ' . $codigo . ').');
    }
    if (!is_uploaded_file($f['tmp_name'])) {
        fallo(400, 'Subida no válida.');
    }
    $temporal = archivoPrivado('subidas/' . idNuevo() . '.tmp');
    asegurarCarpeta(dirname($temporal));
    if (!move_uploaded_file($f['tmp_name'], $temporal)) {
        fallo(500, 'No se pudo guardar el archivo temporal.');
    }
    $entrada = incorporar($temporal, (string) $f['name'], (int) $f['size'], texto($_POST['uso'] ?? '', 80));
    responder(200, ['ok' => true, 'medio' => $entrada]);
}

/* ============================================================
   Subida por trozos
   ============================================================ */

function carpetaSubidas(): string
{
    $c = archivoPrivado('subidas');
    asegurarCarpeta($c);
    // restos de subidas que nunca terminaron
    foreach (glob($c . '/*') ?: [] as $viejo) {
        if (filemtime($viejo) < time() - 86400) {
            @unlink($viejo);
        }
    }
    return $c;
}

if ($accion === 'iniciar') {
    $cuerpo = cuerpoJson();
    $nombre = texto($cuerpo['nombre'] ?? '', 160);
    $tamano = (int) ($cuerpo['tamano'] ?? 0);
    $ext = extensionDe($nombre);
    if (tipoPorExtension($ext) === null) {
        fallo(400, 'Formato no admitido. Fotos: JPG, PNG, WebP. Videos: MP4, WebM, MOV. Documentos: PDF, Word, Excel, PowerPoint, ZIP.');
    }
    if ($tamano <= 0 || $tamano > TAMANO_MAXIMO) {
        fallo(413, 'El archivo supera el máximo permitido (1,5 GB).');
    }
    $carpeta = carpetaSubidas();
    $id = idNuevo();
    escribirJson("$carpeta/$id.json", [
        'nombre' => $nombre,
        'tamano' => $tamano,
        'uso' => texto($cuerpo['uso'] ?? '', 80),
        'recibidos' => 0,
        'siguiente' => 0,
        'usuario' => $yo['id'],
    ]);
    @file_put_contents("$carpeta/$id.parte", '');
    responder(200, ['ok' => true, 'id' => $id, 'trozo' => TROZO]);
}

if ($accion === 'trozo') {
    $id = texto($_GET['id'] ?? '', 40);
    $indice = (int) ($_GET['indice'] ?? -1);
    if (!preg_match('/^[a-f0-9]{16}$/', $id)) {
        fallo(400, 'Subida desconocida.');
    }
    $carpeta = archivoPrivado('subidas');
    $meta = leerJson("$carpeta/$id.json", null);
    if (!is_array($meta) || ($meta['usuario'] ?? '') !== $yo['id']) {
        fallo(404, 'La subida ya no existe. Vuelve a empezar.');
    }
    if ($indice !== (int) $meta['siguiente']) {
        // el panel reintenta el trozo: si ya lo tenemos, seguimos
        if ($indice < (int) $meta['siguiente']) {
            responder(200, ['ok' => true, 'siguiente' => $meta['siguiente'], 'recibidos' => $meta['recibidos']]);
        }
        fallo(409, 'Trozo fuera de orden.', ['siguiente' => $meta['siguiente']]);
    }
    $datos = file_get_contents('php://input');
    if ($datos === false || $datos === '') {
        fallo(400, 'Trozo vacío.');
    }
    if ((int) $meta['recibidos'] + strlen($datos) > (int) $meta['tamano']) {
        fallo(400, 'La subida excede el tamaño anunciado.');
    }
    if (@file_put_contents("$carpeta/$id.parte", $datos, FILE_APPEND | LOCK_EX) === false) {
        fallo(500, 'No se pudo escribir el trozo.');
    }
    $meta['recibidos'] = (int) $meta['recibidos'] + strlen($datos);
    $meta['siguiente'] = $indice + 1;
    escribirJson("$carpeta/$id.json", $meta);
    responder(200, ['ok' => true, 'siguiente' => $meta['siguiente'], 'recibidos' => $meta['recibidos']]);
}

if ($accion === 'terminar') {
    $cuerpo = cuerpoJson();
    $id = texto($cuerpo['id'] ?? '', 40);
    if (!preg_match('/^[a-f0-9]{16}$/', $id)) {
        fallo(400, 'Subida desconocida.');
    }
    $carpeta = archivoPrivado('subidas');
    $meta = leerJson("$carpeta/$id.json", null);
    if (!is_array($meta) || ($meta['usuario'] ?? '') !== $yo['id']) {
        fallo(404, 'La subida ya no existe. Vuelve a empezar.');
    }
    if ((int) $meta['recibidos'] !== (int) $meta['tamano']) {
        fallo(400, 'La subida está incompleta (' . $meta['recibidos'] . ' de ' . $meta['tamano'] . ' bytes).');
    }
    @unlink("$carpeta/$id.json");
    $entrada = incorporar("$carpeta/$id.parte", (string) $meta['nombre'], (int) $meta['tamano'], (string) ($meta['uso'] ?? ''));
    responder(200, ['ok' => true, 'medio' => $entrada]);
}

/* ============================================================
   Eliminar y renombrar
   ============================================================ */

/** Ruta en disco de una URL /media/... del indice (y solo de ahi). */
function rutaEnDisco(string $url): ?string
{
    if (!preg_match('#^/media/[A-Za-z0-9_./\-]+$#', $url) || strpos($url, '..') !== false) {
        return null;
    }
    return rutaPublica() . $url;
}

if ($accion === 'eliminar') {
    $cuerpo = cuerpoJson();
    $id = texto($cuerpo['id'] ?? '', 40);
    $lista = leerMedios();
    $indice = null;
    foreach ($lista as $i => $m) {
        if (($m['id'] ?? '') === $id) {
            $indice = $i;
            break;
        }
    }
    if ($indice === null) {
        fallo(404, 'Archivo no encontrado.');
    }
    $medio = $lista[$indice];
    // si el contenido lo usa, no se borra: quedaria un hueco en la web
    $contenido = @file_get_contents(archivoPrivado('contenido.json')) ?: '';
    if ($contenido !== '' && strpos($contenido, (string) $medio['url']) !== false) {
        fallo(409, 'Este archivo se está usando en el contenido publicado. Quítalo de donde aparece antes de eliminarlo.');
    }
    foreach ([$medio['url'] ?? '', $medio['mini'] ?? ''] as $u) {
        $ruta = $u !== '' ? rutaEnDisco((string) $u) : null;
        if ($ruta && is_file($ruta)) {
            @unlink($ruta);
        }
    }
    array_splice($lista, $indice, 1);
    guardarMedios($lista);
    anotarActividad('Medios', 'Eliminó ' . ($medio['nombre'] ?? ''));
    responder(200, ['ok' => true]);
}

if ($accion === 'renombrar') {
    $cuerpo = cuerpoJson();
    $id = texto($cuerpo['id'] ?? '', 40);
    $nombre = texto($cuerpo['nombre'] ?? '', 160);
    if ($nombre === '') {
        fallo(400, 'Escribe un nombre.');
    }
    $lista = leerMedios();
    foreach ($lista as $i => $m) {
        if (($m['id'] ?? '') === $id) {
            $lista[$i]['nombre'] = $nombre;
            guardarMedios($lista);
            responder(200, ['ok' => true, 'medio' => $lista[$i]]);
        }
    }
    fallo(404, 'Archivo no encontrado.');
}

fallo(400, 'Acción desconocida.');
