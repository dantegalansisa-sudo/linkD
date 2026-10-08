<?php
/*
  NoticiaX en el panel: estadisticas del dashboard y moderacion de
  comentarios.

    GET  /api/ldwam/noticias?accion=resumen                 -> cifras por noticia y globales
    GET  /api/ldwam/noticias?accion=comentarios&estado=x    -> pendiente | aprobado | rechazado | todos
    POST { accion: 'moderar', id, estado }                   -> aprobado | rechazado | pendiente
    POST { accion: 'borrar-comentario', id }
    POST { accion: 'olvidar', slug }                         -> borra las cifras de una noticia eliminada
*/

declare(strict_types=1);

require __DIR__ . '/comun.php';

date_default_timezone_set(ZONA_HORARIA);

iniciarSesion();
$yo = exigirSesion();

/** Suma de las visitas de unos dias ('Y-m-d' => n) entre dos fechas incluidas. */
function sumarEntre(array $dias, string $desde, string $hasta): int
{
    $t = 0;
    foreach ($dias as $d => $n) {
        if ($d >= $desde && $d <= $hasta) {
            $t += (int) $n;
        }
    }
    return $t;
}

if (metodo() === 'GET') {
    $accion = texto($_GET['accion'] ?? 'resumen', 30);

    if ($accion === 'resumen') {
        publicarProgramadasSiToca();
        $e = leerEstadisticas();
        $comentarios = leerComentarios();
        $hoy = date('Y-m-d');
        $hace30 = date('Y-m-d', strtotime('-29 days'));
        $hace60 = date('Y-m-d', strtotime('-59 days'));
        $antes30 = date('Y-m-d', strtotime('-30 days'));
        $inicioMes = date('Y-m-01');
        $inicioMesAnterior = date('Y-m-01', strtotime('first day of last month'));
        $finMesAnterior = date('Y-m-t', strtotime('first day of last month'));

        $porNoticia = [];
        $serie = [];
        foreach ($e['vistas'] as $slug => $v) {
            $dias = is_array($v['dias'] ?? null) ? $v['dias'] : [];
            foreach ($dias as $d => $n) {
                $serie[$d] = ($serie[$d] ?? 0) + (int) $n;
            }
            $porNoticia[$slug] = [
                'vistas' => (int) ($v['total'] ?? 0),
                'ultimos30' => sumarEntre($dias, $hace30, $hoy),
                'previos30' => sumarEntre($dias, $hace60, $antes30),
                'fuentes' => comoObjeto(is_array($v['fuentes'] ?? null) ? $v['fuentes'] : []),
                'dias' => comoObjeto(array_filter($dias, function ($d) use ($hace60) {
                    return $d >= $hace60;
                }, ARRAY_FILTER_USE_KEY)),
                'si' => 0,
                'no' => 0,
                'comentarios' => 0,
                'pendientes' => 0,
            ];
        }
        foreach ($e['votos'] as $slug => $t) {
            $porNoticia[$slug] = $porNoticia[$slug] ?? ['vistas' => 0, 'ultimos30' => 0, 'previos30' => 0, 'fuentes' => new stdClass(), 'dias' => new stdClass(), 'si' => 0, 'no' => 0, 'comentarios' => 0, 'pendientes' => 0];
            $porNoticia[$slug]['si'] = (int) ($t['si'] ?? 0);
            $porNoticia[$slug]['no'] = (int) ($t['no'] ?? 0);
        }
        $pendientes = 0;
        foreach ($comentarios as $c) {
            $slug = (string) ($c['slug'] ?? '');
            $porNoticia[$slug] = $porNoticia[$slug] ?? ['vistas' => 0, 'ultimos30' => 0, 'previos30' => 0, 'fuentes' => new stdClass(), 'dias' => new stdClass(), 'si' => 0, 'no' => 0, 'comentarios' => 0, 'pendientes' => 0];
            if (($c['estado'] ?? '') !== 'rechazado') {
                $porNoticia[$slug]['comentarios']++;
            }
            if (($c['estado'] ?? '') === 'pendiente') {
                $porNoticia[$slug]['pendientes']++;
                $pendientes++;
            }
        }

        $fuentes30 = array_fill_keys(FUENTES_TRAFICO, 0);
        foreach ($e['fuentes'] as $d => $f) {
            if ($d >= $hace30 && is_array($f)) {
                foreach ($f as $k => $n) {
                    $fuentes30[$k] = ($fuentes30[$k] ?? 0) + (int) $n;
                }
            }
        }
        ksort($serie);

        responder(200, [
            'ok' => true,
            'hoy' => $hoy,
            'porNoticia' => comoObjeto($porNoticia),
            'global' => [
                'vistasTotales' => array_sum($serie),
                'vistasMes' => sumarEntre($serie, $inicioMes, $hoy),
                'vistasMesAnterior' => sumarEntre($serie, $inicioMesAnterior, $finMesAnterior),
                'serie' => comoObjeto($serie),
                'fuentes30' => $fuentes30,
            ],
            'comentariosPendientes' => $pendientes,
        ]);
    }

    if ($accion === 'comentarios') {
        $estado = texto($_GET['estado'] ?? 'todos', 20);
        $lista = array_values(array_filter(leerComentarios(), function ($c) use ($estado) {
            return $estado === 'todos' || ($c['estado'] ?? '') === $estado;
        }));
        $lista = array_map(function ($c) {
            unset($c['huella']);
            return $c;
        }, $lista);
        $cuenta = ['pendiente' => 0, 'aprobado' => 0, 'rechazado' => 0];
        foreach (leerComentarios() as $c) {
            $k = (string) ($c['estado'] ?? '');
            if (isset($cuenta[$k])) {
                $cuenta[$k]++;
            }
        }
        responder(200, ['ok' => true, 'comentarios' => $lista, 'cuenta' => $cuenta]);
    }

    fallo(400, 'Acción desconocida.');
}

if (metodo() !== 'POST') {
    fallo(405, 'Método no permitido.');
}
exigirOrigen();

$cuerpo = cuerpoJson();
$accion = texto($cuerpo['accion'] ?? '', 30);

if ($accion === 'moderar' || $accion === 'borrar-comentario') {
    $id = texto($cuerpo['id'] ?? '', 40);
    $estado = texto($cuerpo['estado'] ?? '', 20);
    if ($accion === 'moderar' && !in_array($estado, ['aprobado', 'rechazado', 'pendiente'], true)) {
        fallo(400, 'Estado no válido.');
    }
    $hecho = conBloqueo('noticias-comentarios', function () use ($id, $estado, $accion, $yo) {
        $lista = leerComentarios();
        $encontrado = false;
        foreach ($lista as $i => $c) {
            if (($c['id'] ?? '') === $id) {
                $encontrado = true;
                if ($accion === 'borrar-comentario') {
                    array_splice($lista, $i, 1);
                } else {
                    $lista[$i]['estado'] = $estado;
                    $lista[$i]['moderadoPor'] = (string) ($yo['nombre'] ?? '');
                    $lista[$i]['moderadoEl'] = ahora();
                }
                break;
            }
        }
        if ($encontrado) {
            guardarComentarios($lista);
        }
        return $encontrado;
    });
    if (!$hecho) {
        fallo(404, 'Ese comentario ya no existe.');
    }
    anotarActividad('Comentarios', $accion === 'borrar-comentario' ? 'Borró un comentario' : ($estado === 'aprobado' ? 'Aprobó un comentario' : ($estado === 'rechazado' ? 'Rechazó un comentario' : 'Devolvió un comentario a pendientes')));
    responder(200, ['ok' => true]);
}

if ($accion === 'olvidar') {
    $slug = texto($cuerpo['slug'] ?? '', 120);
    conBloqueo('noticias-estadisticas', function () use ($slug) {
        $e = leerEstadisticas();
        unset($e['vistas'][$slug], $e['votos'][$slug]);
        guardarEstadisticas($e);
    });
    conBloqueo('noticias-comentarios', function () use ($slug) {
        guardarComentarios(array_values(array_filter(leerComentarios(), function ($c) use ($slug) {
            return ($c['slug'] ?? '') !== $slug;
        })));
    });
    responder(200, ['ok' => true]);
}

fallo(400, 'Acción desconocida.');
