/**
 * Marca LINKDICOM en texto.
 *
 * Se dibuja con tipografia y no con el PNG: el lockup nuevo lleva
 * "CONECTA Y AVANZA" y necesita cambiar de color segun el fondo, cosa
 * que un raster no permite. Ademas queda nitido en cualquier tamano.
 */
export default function Logo({
  variant = 'onLight',
  className = '',
}: {
  variant?: 'onLight' | 'onDark';
  className?: string;
}) {
  return (
    <span className={`logo logo--${variant} ${className}`.trim()}>
      <span className="logo__word">
        <span className="logo__link">LINK</span>
        <span className="logo__dicom">DICOM</span>
      </span>
      <span className="logo__tag">
        <i aria-hidden="true" />
        CONECTA Y AVANZA
        <i aria-hidden="true" />
      </span>
    </span>
  );
}
