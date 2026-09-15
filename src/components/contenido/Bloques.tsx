import Icon from '../ui/Icon';
import { imagen } from '../../contenido/store';
import type { Bloque } from '../../contenido/tipos';

/**
 * Cuerpo de un articulo: los bloques que se escriben desde el panel
 * (parrafos, subtitulos, listas, destacados, fotos y videos). Lo usan las
 * noticias y los recursos, con las clases de la noticia.
 */
export function BloqueCuerpo({ b }: { b: Bloque }) {
  switch (b.tipo) {
    case 'h2':
      return <h2>{b.texto}</h2>;
    case 'p':
      return <p>{b.texto}</p>;
    case 'lista':
      return (
        <ul className="not-articulo__lista">
          {b.items.map((i) => (
            <li key={i}>
              <Icon name="check-circle" size={16} strokeWidth={2} />
              {i}
            </li>
          ))}
        </ul>
      );
    case 'destacado':
      return <p className="not-articulo__destacado">{b.texto}</p>;
    case 'foto':
      return (
        <figure className="not-articulo__figura">
          <img src={imagen(b.src)} alt={b.alt} loading="lazy" />
          {b.pie && <figcaption>{b.pie}</figcaption>}
        </figure>
      );
    case 'video':
      return (
        <figure className="not-articulo__figura not-articulo__figura--video">
          {/* video vertical de telefono: se centra sin estirarlo */}
          <video src={imagen(b.src)} poster={imagen(b.poster)} controls playsInline preload="none" />
          {b.pie && <figcaption>{b.pie}</figcaption>}
        </figure>
      );
    default:
      return null;
  }
}

export function Cuerpo({ bloques }: { bloques: Bloque[] }) {
  return (
    <>
      {bloques.map((b, i) => (
        <BloqueCuerpo b={b} key={i} />
      ))}
    </>
  );
}
