<?php
/*
  Configuracion SMTP del formulario de la web (public/api/solicitud.php).

  Copia este archivo como `linkdicom-smtp.php` en la carpeta PADRE de
  public_html (fuera de la web, nunca dentro del repositorio) y rellena los
  datos de la cuenta de correo creada en cPanel.

    /home/<usuario>/linkdicom-smtp.php     <- aqui
    /home/<usuario>/public_html/           <- la web

  Si prefieres variables de entorno, las equivalentes son LINKDICOM_SMTP_HOST,
  _PORT, _SECURE, _USER, _PASS, _FROM, _FROM_NAME y _TO; o LINKDICOM_SMTP_CONFIG
  con la ruta a este archivo si lo guardas en otro sitio.
*/

return [
    // Servidor SMTP de cPanel (Correo > Cuentas de correo > Conectar dispositivos)
    'host' => 'smtp.link-dicom.com',

    // 465 con 'ssl' (recomendado) o 587 con 'tls'
    'port' => 465,
    'secure' => 'ssl',

    // La cuenta que envia. Tiene que existir en cPanel y ser del mismo dominio.
    'user' => 'solicitudes@link-dicom.com',
    'pass' => 'CAMBIAR-POR-LA-CONTRASENA-DE-LA-CUENTA',

    // Remitente que vera quien reciba el correo (normalmente el mismo usuario)
    'from' => 'solicitudes@link-dicom.com',
    'from_name' => 'LINKDICOM',

    // Adonde llegan las solicitudes
    'to' => 'info@link-dicom.com',
];
