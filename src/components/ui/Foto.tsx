import Icon from './Icon';

/**
 * Imagen con marcador.
 *
 * Mientras el cliente no entregue la foto, en lugar de un hueco roto se pinta
 * un bloque con el texto alternativo, que describe justo lo que debe ir ahi.
 * Cuando llegue el archivo basta con rellenar `src` en los datos.
 */
export default function Foto({
  src,
  alt,
  className,
  ratio,
}: {
  src?: string;
  alt: string;
  className?: string;
  ratio?: string;
}) {
  if (src) {
    return <img src={src} alt={alt} className={className} loading="lazy" style={{ aspectRatio: ratio }} />;
  }

  return (
    <div className={`foto-pendiente ${className ?? ''}`.trim()} style={{ aspectRatio: ratio }} role="img" aria-label={alt}>
      <Icon name="image" size={26} strokeWidth={1.5} />
      <span>{alt}</span>
      <small>Imagen pendiente de entrega</small>
    </div>
  );
}
