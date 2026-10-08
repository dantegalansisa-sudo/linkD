# Panel de administración

`https://link-dicom.com/ldwam/`

(La ruta no lleva «admin» a propósito: `/admin` es lo primero que prueban
los robots de ataque. Lo mismo con su API, en `/api/ldwam/`.)

Aplicación aparte de la web (`ldwam/index.html` → `src/admin/`), con una API en
PHP (`public/api/ldwam/`). No necesita base de datos: todo son archivos JSON.

## Qué gestiona

| Sección | Qué cambia en la web |
| --- | --- |
| Noticias | `/noticias`, cada artículo y el panel de actualidad del inicio |
| Recursos | Conferencias, webinars, entrevistas y materiales (`/recursos/<tipo>` y `/recursos/<tipo>/<item>`). Mientras un tipo está vacío la web muestra «En desarrollo» |
| Obra social | Próximas jornadas, jornadas realizadas (`/empresa/obra-social/<jornada>`) y las cifras del programa |
| Imágenes del sitio | Cualquiera de las fotos y videos fijos (catálogo en `src/contenido/catalogo-imagenes.ts`) |
| Biblioteca | Fotos, videos y documentos subidos |
| Solicitudes | Lo que llega por los formularios (además del correo) |
| Usuarios | Administradores y editores |
| Ajustes | Contraseña, estado del servidor, copias y restauración |

## Dónde vive cada cosa en el servidor

```
/home/.../                      (padre de public_html)
  linkdicom-smtp.php            configuración SMTP (ya existía)
  linkdicom-datos/              PRIVADO: contenido.json (maestro con borradores),
                                usuarios.json, medios.json, solicitudes.json,
                                actividad.json, historial/, sesiones/, subidas/,
                                noticias-estadisticas.json (visitas y votos),
                                noticias-comentarios.json, noticias-votos.json,
                                noticias-vistos.json, sal.txt (huella anonima)
public_html/
  datos/sitio.json              lo PUBLICADO: la web lo lee al arrancar
  media/<tipo>/<año>/<mes>/     archivos subidos (nunca se sobrescriben)
  api/ldwam/*.php               la API del panel
  api/noticias.php              NoticiaX publica: visitas, votos y comentarios
  api/correo.php                envio de avisos por SMTP (formularios y comentarios)
  ldwam/index.html              el panel
```

Si el hosting no deja escribir fuera de `public_html`, la carpeta privada pasa
a `public_html/datos/privado/` (tapada con `.htaccess`). Ajustes lo indica.

La publicación por GitHub Actions no toca `datos/*.json` ni `media/`: lo que
el cliente sube y publica sobrevive a cada despliegue.

## NoticiaX (noticias)

- **Portada** `/noticias`: destacado que rota (las marcadas «Puede ir en grande
  en el inicio»), tarjetas, «Últimas noticias» con páginas 1, 2, 3…,
  categorías, buscador, más leídas (por visitas reales), boletín, próximos
  eventos (conferencias y webinars futuros de Recursos), historias en video
  (Recursos con video) y tres espacios de publicidad. Lo que no tiene datos
  no se muestra. `?categoria=`, `?q=` y `?ver=todas` muestran la rejilla.
- **Noticia abierta**: compartir, etiquetas, me gusta / no me gusta y
  comentarios sin registro. Los comentarios entran **pendientes**: se aprueban
  en Noticias › Comentarios y cada uno avisa por correo al buzón `to` de
  `linkdicom-smtp.php`. Para no contar dos veces una visita o un voto se usa
  una huella anónima (IP + navegador con sal, en SHA-256); no se guarda ninguna IP.
- **Panel**: dashboard con cifras, gráfica de visitas, fuentes de tráfico
  (Google, directo, redes, sitio, enlaces externos, otros; también
  `?utm_source=`), tabla con filtros, menú ⋮ (ver, editar, estadísticas,
  duplicar, cambiar estado, cambiar categoría, eliminar), publicación
  programada (hora de RD, sin cron: se publica sola con la primera visita
  después de la hora), Comentarios, Gestión de Publicidad y Categorías.
  «Creada por» y «Publicada por» los anota el servidor; las noticias
  anteriores los recuperan del registro de actividad cuando se puede.

## Cómo llega el contenido a la web

`src/main.tsx` llama a `cargarSitio()` antes del primer render: pide
`/datos/sitio.json` y, si no existe, usa el contenido del código
(`src/contenido/base.ts`). Mientras nadie haya guardado nada desde el panel
(`editado: false` en el JSON), la web también usa el del código: lo
publicado es solo la copia hecha al instalar y el código puede ser más
nuevo. Las páginas leen con `getNoticias()`,
`getRecursos()`, `getJornadas()`… y toda foto fija pasa por `imagen(ruta)`,
que aplica las sustituciones del panel.

Con `?borrador=1` y sesión abierta en el panel, la web carga el maestro
completo (con borradores) para revisar antes de publicar.

## Primera vez

Al abrir `/ldwam/` sin ninguna cuenta creada aparece la pantalla de
instalación: nombre, correo y contraseña del primer administrador. Conviene
hacerlo nada más publicar. Después, el contenido actual de la web se carga
solo como punto de partida.

Ese punto de partida se vuelve a cargar del código cada vez que se publica
una versión nueva de la web, **siempre que nadie haya guardado nada desde el
panel todavía**: el panel compara una huella del contenido del código con la
guardada y, si cambió, sustituye la copia. En cuanto alguien guarda algo, el
contenido del panel manda y el código deja de tocarlo.

## Desarrollo

```
npm run dev        # web + panel en http://localhost:5180 (el panel en /ldwam/)
npm run dev:api    # API PHP en 127.0.0.1:8090 (necesita php con gd y fileinfo)
```

Vite reenvía `/api/ldwam`, `/datos` y `/media` al servidor PHP. Lo que el
panel escribe en desarrollo va a `linkdicom-dev/` (ignorada por git), así que
`public/` se queda limpio y un build nunca arrastra datos de prueba.

Si se añaden fotos nuevas a `src/data`, hay que regenerar el catálogo de
«Imágenes del sitio» con `npm run catalogo`.
