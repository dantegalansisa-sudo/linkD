<?php
/*
  Panel de administracion de LINKDICOM: funciones comunes de la API.

  Todo lo que el panel gestiona se guarda en archivos JSON en una carpeta
  PRIVADA, fuera de public_html (la misma carpeta donde vive la
  configuracion SMTP). Lo publicado se vuelca a public_html/datos/sitio.json,
  que es lo que lee la web. Las fotos, videos y documentos subidos van a
  public_html/media/.

  Este archivo solo define funciones y constantes: no arranca sesion ni
  responde nada por si mismo. Cada endpoint decide que necesita.

  Carpeta privada, por este orden:
    1. la variable de entorno LINKDICOM_DATOS_DIR, si existe;
    2. <carpeta padre de public_html>/linkdicom-datos;
    3. si no se puede escribir ahi, public_html/datos/privado (protegida con
       un .htaccess que la deniega al navegador).
*/

declare(strict_types=1);

const ADMIN_VERSION = '1.0.0';
const NOMBRE_SESION = 'linkdicom_admin';
/** Doce horas sin actividad cierran la sesion. */
const DURACION_SESION = 43200;
/** Tras estos fallos seguidos, la IP espera BLOQUEO_MINUTOS. */
const INTENTOS_MAXIMOS = 6;
const BLOQUEO_MINUTOS = 15;
/** Cuantas copias del contenido se conservan al guardar. */
const HISTORIAL_MAXIMO = 40;
/** Cabecera que el panel manda en cada peticion que modifica algo. */
const CABECERA_CSRF = 'HTTP_X_LINKDICOM_ADMIN';

const COLECCIONES = ['noticias', 'categoriasNoticias', 'recursos', 'obraSocial', 'imagenes'];
const TIPOS_RECURSO = ['conferencias', 'webinars', 'entrevistas', 'materiales-de-apoyo'];
const ROLES = ['administrador', 'editor'];

/* ============================================================
   Respuestas y entrada
   ============================================================ */

/** Termina la peticion con una respuesta JSON. */
function responder(int $codigo, array $cuerpo): void
{
    http_response_code($codigo);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($cuerpo, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PARTIAL_OUTPUT_ON_ERROR);
    exit;
}

function fallo(int $codigo, string $mensaje, array $extra = []): void
{
    responder($codigo, array_merge(['ok' => false, 'error' => $mensaje], $extra));
}

/** Cuerpo JSON de la peticion (o [] si no hay). */
function cuerpoJson(): array
{
    $bruto = file_get_contents('php://input');
    if ($bruto === false || trim($bruto) === '') {
        return [];
    }
    $datos = json_decode($bruto, true);
    return is_array($datos) ? $datos : [];
}

function metodo(): string
{
    return strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
}

function texto($valor, int $maximo = 500): string
{
    if (!is_scalar($valor)) {
        return '';
    }
    $t = trim((string) $valor);
    return function_exists('mb_substr') ? mb_substr($t, 0, $maximo) : substr($t, 0, $maximo);
}

/* ============================================================
   Carpetas
   ============================================================ */

/** Raiz publica (public_html). */
function rutaPublica(): string
{
    if (!empty($_SERVER['DOCUMENT_ROOT']) && is_dir($_SERVER['DOCUMENT_ROOT'])) {
        return rtrim(str_replace('\\', '/', realpath($_SERVER['DOCUMENT_ROOT']) ?: $_SERVER['DOCUMENT_ROOT']), '/');
    }
    // public_html/api/ldwam/comun.php -> public_html
    return str_replace('\\', '/', dirname(__DIR__, 2));
}

function asegurarCarpeta(string $ruta): bool
{
    if (is_dir($ruta)) {
        return is_writable($ruta);
    }
    return @mkdir($ruta, 0755, true) && is_writable($ruta);
}

/** Carpeta privada con los JSON. Se crea si no existe. */
function dirPrivado(): string
{
    static $ruta = null;
    if ($ruta !== null) {
        return $ruta;
    }

    $candidatas = [];
    $env = getenv('LINKDICOM_DATOS_DIR');
    if ($env !== false && $env !== '') {
        $candidatas[] = rtrim($env, '/\\');
    }
    $candidatas[] = dirname(rutaPublica()) . '/linkdicom-datos';

    foreach ($candidatas as $c) {
        if (asegurarCarpeta($c)) {
            $ruta = $c;
            return $ruta;
        }
    }

    // ultimo recurso: dentro de public_html, tapada al navegador
    $ruta = rutaPublica() . '/datos/privado';
    asegurarCarpeta($ruta);
    $htaccess = $ruta . '/.htaccess';
    if (!is_file($htaccess)) {
        @file_put_contents($htaccess, "Require all denied\n<IfModule !mod_authz_core.c>\nDeny from all\n</IfModule>\n");
    }
    return $ruta;
}

/** Carpeta publica de los archivos subidos. */
function dirMedios(): string
{
    $ruta = rutaPublica() . '/media';
    asegurarCarpeta($ruta);
    return $ruta;
}

/** Carpeta publica de los JSON publicados. */
function dirDatos(): string
{
    $ruta = rutaPublica() . '/datos';
    asegurarCarpeta($ruta);
    return $ruta;
}

function archivoPrivado(string $nombre): string
{
    return dirPrivado() . '/' . $nombre;
}

/* ============================================================
   JSON en disco
   ============================================================ */

function leerJson(string $ruta, $defecto = [])
{
    if (!is_file($ruta)) {
        return $defecto;
    }
    $bruto = @file_get_contents($ruta);
    if ($bruto === false || $bruto === '') {
        return $defecto;
    }
    $datos = json_decode($bruto, true);
    return $datos === null ? $defecto : $datos;
}

/** Escritura atomica: se escribe a un temporal y se renombra. */
function escribirJson(string $ruta, $datos, bool $bonito = false): bool
{
    $carpeta = dirname($ruta);
    if (!asegurarCarpeta($carpeta)) {
        return false;
    }
    $opciones = JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES;
    if ($bonito) {
        $opciones |= JSON_PRETTY_PRINT;
    }
    $json = json_encode($datos, $opciones);
    if ($json === false) {
        return false;
    }
    $temporal = $ruta . '.' . bin2hex(random_bytes(4)) . '.tmp';
    if (@file_put_contents($temporal, $json, LOCK_EX) === false) {
        return false;
    }
    if (!@rename($temporal, $ruta)) {
        @unlink($temporal);
        return false;
    }
    return true;
}

function ahora(): string
{
    return gmdate('Y-m-d\TH:i:s\Z');
}

function idNuevo(): string
{
    return bin2hex(random_bytes(8));
}

/** "Mi foto nueva.JPG" -> "mi-foto-nueva". */
function slugificar(string $texto, int $maximo = 80): string
{
    $t = $texto;
    if (function_exists('iconv')) {
        $conv = @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $t);
        if ($conv !== false) {
            $t = $conv;
        }
    }
    $t = strtolower($t);
    $t = preg_replace('/[^a-z0-9]+/', '-', $t) ?? '';
    $t = trim($t, '-');
    return substr($t, 0, $maximo);
}

/* ============================================================
   Sesion y usuarios
   ============================================================ */

function esHttps(): bool
{
    if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
        return true;
    }
    return strtolower((string) ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '')) === 'https';
}

function iniciarSesion(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    // las sesiones viven en la carpeta privada: asi no dependen de la
    // limpieza (corta) que el hosting aplica a su carpeta por defecto
    $carpeta = archivoPrivado('sesiones');
    if (asegurarCarpeta($carpeta)) {
        session_save_path($carpeta);
    }
    ini_set('session.gc_maxlifetime', (string) DURACION_SESION);
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    session_name(NOMBRE_SESION);
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => esHttps(),
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_start();

    // caducidad por inactividad
    $ultimo = $_SESSION['ultimo'] ?? 0;
    if ($ultimo && time() - (int) $ultimo > DURACION_SESION) {
        cerrarSesion();
        session_start();
    }
    $_SESSION['ultimo'] = time();
}

function cerrarSesion(): void
{
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', [
            'expires' => time() - 42000,
            'path' => $p['path'],
            'secure' => $p['secure'],
            'httponly' => $p['httponly'],
            'samesite' => $p['samesite'] ?? 'Strict',
        ]);
    }
    if (session_status() === PHP_SESSION_ACTIVE) {
        session_destroy();
    }
}

function leerUsuarios(): array
{
    $u = leerJson(archivoPrivado('usuarios.json'), []);
    return is_array($u) ? array_values($u) : [];
}

function guardarUsuarios(array $usuarios): bool
{
    return escribirJson(archivoPrivado('usuarios.json'), array_values($usuarios), true);
}

/** Usuario de la sesion, sin la clave. Null si no hay sesion. */
function usuarioActual(): ?array
{
    $id = $_SESSION['usuario'] ?? null;
    if (!$id) {
        return null;
    }
    foreach (leerUsuarios() as $u) {
        if (($u['id'] ?? '') === $id && !empty($u['activo'])) {
            return usuarioPublico($u);
        }
    }
    return null;
}

function usuarioPublico(array $u): array
{
    return [
        'id' => $u['id'] ?? '',
        'nombre' => $u['nombre'] ?? '',
        'correo' => $u['correo'] ?? '',
        'rol' => $u['rol'] ?? 'editor',
        'activo' => !empty($u['activo']),
        'creado' => $u['creado'] ?? '',
        'ultimoAcceso' => $u['ultimoAcceso'] ?? '',
    ];
}

/** Exige sesion abierta (y, si se pide, el rol de administrador). */
function exigirSesion(?string $rol = null): array
{
    $u = usuarioActual();
    if ($u === null) {
        fallo(401, 'Tu sesión ha caducado. Vuelve a entrar.', ['sesion' => false]);
    }
    if ($rol === 'administrador' && $u['rol'] !== 'administrador') {
        fallo(403, 'Solo un administrador puede hacer esto.');
    }
    return $u;
}

/**
 * Las peticiones que cambian algo deben venir del propio panel: la cabecera
 * la pone el codigo del panel y un formulario de otro sitio no puede
 * anadirla. Ademas, si el navegador manda Origin, tiene que ser este dominio.
 */
function exigirOrigen(): void
{
    if (empty($_SERVER[CABECERA_CSRF])) {
        fallo(403, 'Petición no permitida.');
    }
    $host = strtolower((string) ($_SERVER['HTTP_HOST'] ?? ''));
    foreach (['HTTP_ORIGIN', 'HTTP_REFERER'] as $cab) {
        if (!empty($_SERVER[$cab])) {
            $h = strtolower((string) parse_url((string) $_SERVER[$cab], PHP_URL_HOST));
            $puerto = parse_url((string) $_SERVER[$cab], PHP_URL_PORT);
            $hostPeticion = strtolower(explode(':', $host)[0]);
            if ($h !== '' && $h !== $hostPeticion) {
                fallo(403, 'Petición no permitida (origen).');
            }
            unset($puerto);
            break;
        }
    }
}

function ipCliente(): string
{
    return (string) ($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
}

/** Bloqueo temporal por intentos fallidos de entrada. */
function ipBloqueada(): bool
{
    $intentos = leerJson(archivoPrivado('intentos.json'), []);
    $reg = $intentos[ipCliente()] ?? null;
    return $reg && ($reg['n'] ?? 0) >= INTENTOS_MAXIMOS && ($reg['hasta'] ?? 0) > time();
}

function registrarIntento(bool $ok): void
{
    $ruta = archivoPrivado('intentos.json');
    $intentos = leerJson($ruta, []);
    $ip = ipCliente();
    // limpieza de entradas viejas
    foreach ($intentos as $k => $r) {
        if (($r['hasta'] ?? 0) < time() - 86400) {
            unset($intentos[$k]);
        }
    }
    if ($ok) {
        unset($intentos[$ip]);
    } else {
        $n = (int) ($intentos[$ip]['n'] ?? 0) + 1;
        $intentos[$ip] = ['n' => $n, 'hasta' => time() + BLOQUEO_MINUTOS * 60];
    }
    escribirJson($ruta, $intentos);
}

/** Bitacora de lo que hace cada usuario, para el panel de inicio. */
function anotarActividad(string $accion, string $detalle = ''): void
{
    $ruta = archivoPrivado('actividad.json');
    $lista = leerJson($ruta, []);
    if (!is_array($lista)) {
        $lista = [];
    }
    $u = usuarioActual();
    array_unshift($lista, [
        'fecha' => ahora(),
        'usuario' => $u['nombre'] ?? 'Sistema',
        'accion' => $accion,
        'detalle' => $detalle,
    ]);
    escribirJson($ruta, array_slice($lista, 0, 300));
}

/* ============================================================
   Contenido: maestro (privado) y publicado (publico)
   ============================================================ */

function maestroVacio(): array
{
    return [
        'inicializado' => false,
        // true en cuanto alguien guarda algo desde el panel. Mientras sea
        // false, el contenido de partida se vuelve a cargar del codigo con
        // cada version nueva de la web (ver 'inicializar' en contenido.php).
        'editado' => false,
        'huellaBase' => '',
        'version' => 0,
        'actualizado' => '',
        'actualizadoPor' => '',
        'noticias' => [],
        'categoriasNoticias' => new stdClass(),
        'recursos' => ['conferencias' => [], 'webinars' => [], 'entrevistas' => [], 'materiales-de-apoyo' => []],
        'obraSocial' => ['proximas' => [], 'jornadas' => [], 'cifras' => []],
        'imagenes' => new stdClass(),
    ];
}

function leerMaestro(): array
{
    $m = leerJson(archivoPrivado('contenido.json'), null);
    if (!is_array($m)) {
        return maestroVacio();
    }
    // maestros guardados antes de existir 'editado': solo la carga inicial
    // deja la version en 1; cualquier guardado posterior la sube
    if (!array_key_exists('editado', $m)) {
        $m['editado'] = (int) ($m['version'] ?? 0) > 1;
    }
    $m += maestroVacio();
    foreach (TIPOS_RECURSO as $t) {
        if (!isset($m['recursos'][$t]) || !is_array($m['recursos'][$t])) {
            $m['recursos'][$t] = [];
        }
    }
    foreach (['proximas', 'jornadas', 'cifras'] as $k) {
        if (!isset($m['obraSocial'][$k]) || !is_array($m['obraSocial'][$k])) {
            $m['obraSocial'][$k] = [];
        }
    }
    return $m;
}

/** Un array asociativo vacio se codificaria como [] y la web espera {}. */
function comoObjeto($valor)
{
    if ($valor instanceof stdClass) {
        return $valor;
    }
    if (!is_array($valor) || $valor === []) {
        return new stdClass();
    }
    return $valor;
}

function soloPublicados(array $lista): array
{
    return array_values(array_filter($lista, function ($x) {
        return is_array($x) && (!array_key_exists('publicado', $x) || $x['publicado'] !== false);
    }));
}

/** Lo que ve la web: solo lo publicado, sin campos internos. */
function construirPublicado(array $m): array
{
    $recursos = [];
    foreach (TIPOS_RECURSO as $t) {
        $recursos[$t] = soloPublicados($m['recursos'][$t] ?? []);
    }
    return [
        'version' => (int) ($m['version'] ?? 0),
        'actualizado' => (string) ($m['actualizado'] ?? ''),
        'editado' => !empty($m['editado']),
        'noticias' => soloPublicados($m['noticias'] ?? []),
        'categoriasNoticias' => comoObjeto($m['categoriasNoticias'] ?? []),
        'recursos' => $recursos,
        'obraSocial' => [
            'proximas' => soloPublicados($m['obraSocial']['proximas'] ?? []),
            'jornadas' => soloPublicados($m['obraSocial']['jornadas'] ?? []),
            'cifras' => array_values($m['obraSocial']['cifras'] ?? []),
        ],
        'imagenes' => comoObjeto($m['imagenes'] ?? []),
    ];
}

/**
 * Guarda el maestro, publica y deja una copia en el historial.
 * $edicion es false solo para la carga del contenido de partida: no cuenta
 * como cambio hecho desde el panel.
 */
function guardarMaestro(array $m, string $accion, string $detalle = '', bool $edicion = true): array
{
    $u = usuarioActual();
    $m['inicializado'] = true;
    if ($edicion) {
        $m['editado'] = true;
    }
    $m['version'] = (int) ($m['version'] ?? 0) + 1;
    $m['actualizado'] = ahora();
    $m['actualizadoPor'] = $u['nombre'] ?? '';
    $m['categoriasNoticias'] = comoObjeto($m['categoriasNoticias'] ?? []);
    $m['imagenes'] = comoObjeto($m['imagenes'] ?? []);

    if (!escribirJson(archivoPrivado('contenido.json'), $m)) {
        fallo(500, 'No se pudo guardar el contenido en el servidor (carpeta sin permisos de escritura).');
    }
    if (!escribirJson(dirDatos() . '/sitio.json', construirPublicado($m))) {
        fallo(500, 'Se guardó el contenido, pero no se pudo publicar en /datos (permisos).');
    }
    guardarHistorial($m);
    anotarActividad($accion, $detalle);
    return $m;
}

function guardarHistorial(array $m): void
{
    $carpeta = archivoPrivado('historial');
    if (!asegurarCarpeta($carpeta)) {
        return;
    }
    $nombre = $carpeta . '/contenido-' . gmdate('Ymd-His') . '-v' . (int) $m['version'] . '.json';
    escribirJson($nombre, $m);
    $archivos = glob($carpeta . '/contenido-*.json') ?: [];
    sort($archivos);
    while (count($archivos) > HISTORIAL_MAXIMO) {
        @unlink(array_shift($archivos));
    }
}

/* ============================================================
   Limpieza del contenido que llega del panel
   ============================================================ */

/** Rutas y enlaces admitidos en el contenido. */
function urlAdmitida(string $u): bool
{
    if ($u === '') {
        return true;
    }
    if (preg_match('#^/(media|img|video|brand|datos)/#', $u)) {
        return true;
    }
    return (bool) preg_match('#^https?://#i', $u);
}

/**
 * Recorre el contenido: recorta textos, tira claves raras y comprueba que
 * lo que parece una ruta o un enlace lo sea de verdad.
 */
function limpiarContenido($valor, int $nivel = 0)
{
    if ($nivel > 12) {
        return null;
    }
    if (is_string($valor)) {
        $t = trim($valor);
        return function_exists('mb_substr') ? mb_substr($t, 0, 20000) : substr($t, 0, 20000);
    }
    if (is_int($valor) || is_float($valor) || is_bool($valor) || $valor === null) {
        return $valor;
    }
    if (is_array($valor)) {
        $limpio = [];
        foreach ($valor as $k => $v) {
            if (is_string($k)) {
                // las claves son nombres de campo, rutas de foto o nombres de categoria
                if ($k === '' || strlen($k) > 200 || preg_match('/[\x00-\x1f]/', $k)) {
                    continue;
                }
                $vl = limpiarContenido($v, $nivel + 1);
                if (in_array($k, ['src', 'url', 'poster', 'imagen', 'portada', 'logo', 'href', 'mini', 'foto'], true) && is_string($vl) && !urlAdmitida($vl)) {
                    $vl = '';
                }
                if ($k === 'fotos' && is_array($vl)) {
                    $vl = array_values(array_filter($vl, function ($f) {
                        return is_string($f) && urlAdmitida($f);
                    }));
                }
                $limpio[$k] = $vl;
            } else {
                $limpio[] = limpiarContenido($v, $nivel + 1);
            }
        }
        return $limpio;
    }
    return null;
}

/** Comprueba que una lista de items tenga slugs validos y unicos. */
function validarSlugs(array $lista, string $que): void
{
    $vistos = [];
    foreach ($lista as $item) {
        if (!is_array($item)) {
            fallo(400, "Formato incorrecto en $que.");
        }
        $slug = (string) ($item['slug'] ?? '');
        if ($slug === '' || !preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $slug)) {
            fallo(400, "Hay un elemento de $que sin dirección (slug) válida: \"$slug\".");
        }
        if (isset($vistos[$slug])) {
            fallo(400, "Dos elementos de $que tienen la misma dirección: \"$slug\". Cambia una de ellas.");
        }
        $vistos[$slug] = true;
        if (trim((string) ($item['titulo'] ?? '')) === '') {
            fallo(400, "Hay un elemento de $que sin título.");
        }
    }
}

/* ============================================================
   Solicitudes recibidas (bandeja del panel)
   ============================================================ */

/** La llama solicitud.php con cada formulario que llega. */
function registrarSolicitud(string $tipo, array $datos, string $origen, bool $correoEnviado): void
{
    try {
        $ruta = archivoPrivado('solicitudes.json');
        $lista = leerJson($ruta, []);
        if (!is_array($lista)) {
            $lista = [];
        }
        unset($datos['web']);
        array_unshift($lista, [
            'id' => idNuevo(),
            'fecha' => ahora(),
            'tipo' => $tipo,
            'origen' => $origen,
            'datos' => $datos,
            'correoEnviado' => $correoEnviado,
            'estado' => 'nueva',
        ]);
        escribirJson($ruta, array_slice($lista, 0, 2000));
    } catch (Throwable $e) {
        error_log('registrarSolicitud: ' . $e->getMessage());
    }
}

/* ============================================================
   Indice de medios
   ============================================================ */

function leerMedios(): array
{
    $l = leerJson(archivoPrivado('medios.json'), []);
    return is_array($l) ? array_values($l) : [];
}

function guardarMedios(array $lista): bool
{
    return escribirJson(archivoPrivado('medios.json'), array_values($lista));
}
