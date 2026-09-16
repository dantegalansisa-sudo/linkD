import { imagen } from '../../contenido/store';

/**
 * Logotipo oficial de LINKDICOM (el archivo que entrego el cliente).
 *
 * Hay dos versiones del mismo lockup: sobre fondo claro, con "LINK" en gris;
 * sobre fondo oscuro, con "LINK" y el lema en blanco. El naranja de "DICOM"
 * es el mismo en las dos. Ambas se pueden sustituir desde el panel
 * (Imagenes del sitio).
 */
export default function Logo({
  variant = 'onLight',
  className = '',
}: {
  variant?: 'onLight' | 'onDark';
  className?: string;
}) {
  const src = variant === 'onDark' ? '/brand/logo-blanco.webp' : '/brand/logo.webp';
  return (
    <img
      className={`logo logo--${variant} ${className}`.trim()}
      src={imagen(src)}
      alt="LINKDICOM — Conecta y avanza"
      width={1200}
      height={187}
      decoding="async"
    />
  );
}
