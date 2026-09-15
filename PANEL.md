# Panel de administración

`https://link-dicom.com/admin/`

Aplicación aparte de la web (`admin/index.html` → `src/admin/`), con una API en
PHP (`public/api/admin/`). No necesita base de datos: todo son archivos JSON.

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
                                actividad.json, historial/, sesiones/, subidas/
public_html/
  datos/sitio.json              lo PUBLICADO: la web lo lee al arrancar
  media/<tipo>/<año>/<mes>/     archivos subidos (nunca se sobrescriben)
  api/admin/*.php               la API
  admin/index.html              el panel
```

Si el hosting no deja escribir fuera de `public_html`, la carpeta privada pasa
a `public_html/datos/privado/` (tapada con `.htaccess`). Ajustes lo indica.

La publicación por GitHub Actions no toca `datos/*.json` ni `media/`: lo que
el cliente sube y publica sobrevive a cada despliegue.

## Cómo llega el contenido a la web

`src/main.tsx` llama a `cargarSitio()` antes del primer render: pide
`/datos/sitio.json` y, si no existe, usa el contenido del código
(`src/contenido/base.ts`). Las páginas leen con `getNoticias()`,
`getRecursos()`, `getJornadas()`… y toda foto fija pasa por `imagen(ruta)`,
que aplica las sustituciones del panel.

Con `?borrador=1` y sesión abierta en el panel, la web carga el maestro
completo (con borradores) para revisar antes de publicar.

## Primera vez

Al abrir `/admin/` sin ninguna cuenta creada aparece la pantalla de
instalación: nombre, correo y contraseña del primer administrador. Conviene
hacerlo nada más publicar. Después, el contenido actual de la web se carga
solo como punto de partida.

## Desarrollo

```
npm run dev        # web + panel en http://localhost:5180 (el panel en /admin/)
npm run dev:api    # API PHP en 127.0.0.1:8090 (necesita php con gd y fileinfo)
```

Vite reenvía `/api/admin`, `/datos` y `/media` al servidor PHP. Lo que el
panel escribe en desarrollo va a `linkdicom-dev/` (ignorada por git), así que
`public/` se queda limpio y un build nunca arrastra datos de prueba.

Si se añaden fotos nuevas a `src/data`, hay que regenerar el catálogo de
«Imágenes del sitio» con `npm run catalogo`.
