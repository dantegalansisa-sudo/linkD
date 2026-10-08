<?php
/*
  NoticiaX: lo que la web publica pide y envia de cada noticia.

    GET  /api/noticias?slug=x              -> votos y comentarios aprobados
    GET  /api/noticias?accion=populares    -> las mas leidas (slugs)
    POST { accion: 'vista', slug, ref, fuente }   -> cuenta una visita
    POST { accion: 'voto', slug, voto }            -> 'si', 'no' o '' (quitar)
    POST { accion: 'comentar', slug, nombre, texto, web }

  Sin cuenta ni registro. Los comentarios entran como pendientes: el equipo
  los aprueba desde el panel (Noticias > Comentarios) y cada uno avisa por
  correo al buzon de notificaciones. No se guarda ninguna IP: para no contar
  dos veces se usa una huella anonima (ver huellaVisitante()).
*/

declare(strict_types=1);

require __DIR__ . '/correo.php';
require __DIR__ . '/ldwam/comun.php';

date_default_timezone_set(ZONA_HORARIA);

/** Solo desde la propia web: otra pagina no puede votar ni comentar por el visitante. */
function mismoOrigen(): void
{
    $host = strtolower(explode(':', (string) ($_SERVER['HTTP_HOST'] ?? ''))[0]);
    foreach (['HTTP_ORIGIN', 'HTTP_REFERER'] as $cab) {
        if (!empty($_SERVER[$cab])) {
            $h = strtolower((string) parse_url((string) $_SERVER[$cab], PHP_URL_HOST));
            if ($h !== '' && $h !== $host) {
                fallo(403, 'Petición no permitida.');
            }
            return;
        }
    }
}

// las noticias programadas salen solas cuando alguien entra a leer
publicarProgramadasSiToca();

/* ---------- lecturas ---------- */
if (metodo() === 'GET') {
    $accion = texto($_GET['accion'] ?? '', 30);

    if ($accion === 'populares') {
        $publicas = slugsPublicos();
        $e = leerEstadisticas();
        $total = [];
        foreach ($publicas as $slug => $_) {
            $total[$slug] = (int) ($e['vistas'][$slug]['total'] ?? 0);
        }
        arsort($total);
        header('Cache-Control: public, max-age=300');
        responder(200, ['ok' => true, 'populares' => array_slice(array_keys(array_filter($total)), 0, 5)]);
    }

    $slug = texto($_GET['slug'] ?? '', 120);
    $e = leerEstadisticas();
    $aprobados = [];
    foreach (leerComentarios() as $c) {
        if (($c['slug'] ?? '') === $slug && ($c['estado'] ?? '') === 'aprobado') {
            $aprobados[] = [
                'id' => (string) $c['id'],
                'nombre' => (string) ($c['nombre'] ?? ''),
                'texto' => (string) ($c['texto'] ?? ''),
                'fecha' => (string) ($c['fecha'] ?? ''),
            ];
        }
    }
    usort($aprobados, function ($a, $b) {
        return strcmp($a['fecha'], $b['fecha']);
    });
    header('Cache-Control: no-store');
    responder(200, [
        'ok' => true,
        'votos' => [
            'si' => (int) ($e['votos'][$slug]['si'] ?? 0),
            'no' => (int) ($e['votos'][$slug]['no'] ?? 0),
        ],
        'comentarios' => $aprobados,
    ]);
}

if (metodo() !== 'POST') {
    fallo(405, 'Método no permitido.');
}
mismoOrigen();

$cuerpo = cuerpoJson();
$accion = texto($cuerpo['accion'] ?? '', 30);
$slug = texto($cuerpo['slug'] ?? '', 120);
$publicas = slugsPublicos();
if (!isset($publicas[$slug])) {
    fallo(404, 'Esa noticia no existe.');
}
$huella = huellaVisitante();

/* ---------- una visita ---------- */
if ($accion === 'vista') {
    $origen = clasificarOrigen(texto($cuerpo['ref'] ?? '', 500), texto($cuerpo['fuente'] ?? '', 30));
    conBloqueo('noticias-estadisticas', function () use ($slug, $huella, $origen) {
        // la misma persona, la misma noticia, en media hora: una sola visita
        $vistos = leerJson(archivoPrivado('noticias-vistos.json'), []);
        if (!is_array($vistos)) {
            $vistos = [];
        }
        $ahora = time();
        $vistos = array_filter($vistos, function ($t) use ($ahora) {
            return is_int($t) && $ahora - $t < 1800;
        });
        $clave = $slug . '|' . $huella;
        if (isset($vistos[$clave])) {
            return;
        }
        $vistos[$clave] = $ahora;
        escribirJson(archivoPrivado('noticias-vistos.json'), $vistos ?: new stdClass());

        $e = leerEstadisticas();
        $dia = date('Y-m-d');
        $v = is_array($e['vistas'][$slug] ?? null) ? $e['vistas'][$slug] : [];
        $v['total'] = (int) ($v['total'] ?? 0) + 1;
        $v['dias'] = is_array($v['dias'] ?? null) ? $v['dias'] : [];
        $v['dias'][$dia] = (int) ($v['dias'][$dia] ?? 0) + 1;
        $v['fuentes'] = is_array($v['fuentes'] ?? null) ? $v['fuentes'] : [];
        $v['fuentes'][$origen] = (int) ($v['fuentes'][$origen] ?? 0) + 1;
        $e['vistas'][$slug] = $v;
        $f = is_array($e['fuentes'][$dia] ?? null) ? $e['fuentes'][$dia] : [];
        $f[$origen] = (int) ($f[$origen] ?? 0) + 1;
        $e['fuentes'][$dia] = $f;
        guardarEstadisticas($e);
    });
    responder(200, ['ok' => true]);
}

/* ---------- me gusta / no me gusta ---------- */
if ($accion === 'voto') {
    $voto = texto($cuerpo['voto'] ?? '', 4);
    if (!in_array($voto, ['si', 'no', ''], true)) {
        fallo(400, 'Voto no válido.');
    }
    $totales = conBloqueo('noticias-estadisticas', function () use ($slug, $huella, $voto) {
        $votos = leerJson(archivoPrivado('noticias-votos.json'), []);
        if (!is_array($votos)) {
            $votos = [];
        }
        $previo = (string) ($votos[$slug][$huella] ?? '');
        $e = leerEstadisticas();
        $t = is_array($e['votos'][$slug] ?? null) ? $e['votos'][$slug] : ['si' => 0, 'no' => 0];
        if ($previo !== '') {
            $t[$previo] = max(0, (int) ($t[$previo] ?? 0) - 1);
        }
        if ($voto !== '') {
            $t[$voto] = (int) ($t[$voto] ?? 0) + 1;
            $votos[$slug][$huella] = $voto;
        } else {
            unset($votos[$slug][$huella]);
        }
        $e['votos'][$slug] = ['si' => (int) ($t['si'] ?? 0), 'no' => (int) ($t['no'] ?? 0)];
        guardarEstadisticas($e);
        escribirJson(archivoPrivado('noticias-votos.json'), $votos ?: new stdClass());
        return $e['votos'][$slug];
    });
    responder(200, ['ok' => true, 'votos' => $totales]);
}

/* ---------- comentario ---------- */
if ($accion === 'comentar') {
    // trampa para robots: un campo oculto que una persona nunca rellena
    if (!empty($cuerpo['web'])) {
        responder(200, ['ok' => true]);
    }
    $nombre = texto($cuerpo['nombre'] ?? '', 60);
    $textoComentario = texto($cuerpo['texto'] ?? '', 1500);
    $largo = function_exists('mb_strlen') ? mb_strlen($textoComentario) : strlen($textoComentario);
    if ($largo < 3) {
        fallo(400, 'Escribe tu comentario.');
    }

    $lista = leerComentarios();
    // como mucho tres comentarios cada diez minutos desde el mismo visitante
    $recientes = array_filter($lista, function ($c) use ($huella) {
        return ($c['huella'] ?? '') === $huella && strtotime((string) ($c['fecha'] ?? '')) > time() - 600;
    });
    if (count($recientes) >= 3) {
        fallo(429, 'Has enviado varios comentarios seguidos. Espera unos minutos.');
    }

    $comentario = [
        'id' => idNuevo(),
        'slug' => $slug,
        'nombre' => $nombre,
        'texto' => $textoComentario,
        'fecha' => ahora(),
        'estado' => 'pendiente',
        'huella' => $huella,
    ];
    conBloqueo('noticias-comentarios', function () use ($comentario) {
        $l = leerComentarios();
        array_unshift($l, $comentario);
        guardarComentarios($l);
    });

    // aviso al buzon de notificaciones; si falla, el comentario ya esta guardado
    $panel = (esHttps() ? 'https' : 'http') . '://' . ($_SERVER['HTTP_HOST'] ?? 'link-dicom.com') . '/ldwam/noticias/comentarios';
    enviarAviso(
        [
            'asunto' => 'Nuevo comentario en una noticia',
            'titulo' => 'Nuevo comentario pendiente',
            'descripcion' => 'Alguien comentó una noticia de NoticiaX. No se publica hasta que el equipo lo apruebe en el panel.',
            'pie' => 'Comentario recibido en NoticiaX',
            'campos' => [
                ['noticia', 'Noticia'],
                ['nombre', 'Nombre o alias'],
                ['texto', 'Comentario'],
                ['panel', 'Revisar y aprobar'],
            ],
        ],
        [
            'noticia' => $publicas[$slug],
            'nombre' => $nombre !== '' ? $nombre : 'Anónimo',
            'texto' => $textoComentario,
            'panel' => $panel,
        ],
        'link-dicom.com/noticias/' . $slug,
        'Nuevo comentario · ' . (function_exists('mb_substr') ? mb_substr($publicas[$slug], 0, 70) : substr($publicas[$slug], 0, 70)),
    );

    responder(200, ['ok' => true, 'pendiente' => true]);
}

fallo(400, 'Acción desconocida.');
