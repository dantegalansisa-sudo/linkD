import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../ui/Icon';
import { buscar, normalizar, sugerencias, type ResultadoBusqueda } from '../../utils/buscador';

/** Marca en el titulo lo que coincide con lo escrito, sin tener en cuenta acentos. */
function resaltar(titulo: string, consulta: string): ReactNode {
  const terminos = normalizar(consulta).split(/\s+/).filter(Boolean);
  if (!terminos.length) return titulo;
  // normalizado letra a letra, para que las posiciones coincidan con el original
  const plano = [...titulo].map((c) => normalizar(c).charAt(0) || c).join('');
  const marca = new Array<boolean>(titulo.length).fill(false);
  for (const t of terminos) {
    let i = plano.indexOf(t);
    while (i !== -1) {
      for (let k = i; k < i + t.length; k++) marca[k] = true;
      i = plano.indexOf(t, i + t.length);
    }
  }
  const trozos: ReactNode[] = [];
  let ini = 0;
  for (let i = 1; i <= titulo.length; i++) {
    if (i === titulo.length || marca[i] !== marca[ini]) {
      const t = titulo.slice(ini, i);
      trozos.push(marca[ini] ? <mark key={ini}>{t}</mark> : t);
      ini = i;
    }
  }
  return trozos;
}

/**
 * Caja de busqueda con resultados al vuelo. La usa la lupa del menu (con
 * cabecera y boton de cerrar) y el menu movil (sin cabecera).
 */
export default function Buscador({ onCerrar, cabecera = true }: { onCerrar: () => void; cabecera?: boolean }) {
  // en el menu movil, con la caja vacia no se ofrece nada: ya esta el menu debajo
  const sugerir = cabecera;
  const [consulta, setConsulta] = useState('');
  const [activo, setActivo] = useState(0);
  const campo = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const id = useId();

  const escrita = consulta.trim();
  const resultados: ResultadoBusqueda[] = useMemo(
    () => (escrita ? buscar(escrita) : sugerir ? sugerencias() : []),
    [escrita, sugerir],
  );

  useEffect(() => setActivo(0), [escrita]);
  useEffect(() => {
    // en el movil el teclado tapa medio menu: solo se enfoca en escritorio
    if (cabecera) campo.current?.focus();
  }, [cabecera]);

  const teclas = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActivo((a) => Math.min(a + 1, resultados.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActivo((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && resultados[activo]) {
      e.preventDefault();
      navigate(resultados[activo].ruta);
      onCerrar();
    } else if (e.key === 'Escape') {
      onCerrar();
    }
  };

  return (
    <div className="buscador" role="search">
      {cabecera && (
        <div className="buscador__cabeza">
          <b>¿Qué le interesa encontrar?</b>
          <button type="button" className="buscador__cerrar" onClick={onCerrar} aria-label="Cerrar el buscador">
            <Icon name="close" size={19} strokeWidth={2} />
          </button>
        </div>
      )}

      <label className="buscador__campo">
        <Icon name="search" size={19} strokeWidth={2} />
        <input
          ref={campo}
          type="search"
          value={consulta}
          onChange={(e) => setConsulta(e.target.value)}
          onKeyDown={teclas}
          placeholder="Busca un producto, solución o tema…"
          aria-label="Buscar en el sitio"
          role="combobox"
          aria-expanded={resultados.length > 0}
          aria-controls={`${id}-lista`}
          aria-activedescendant={resultados[activo] ? `${id}-${activo}` : undefined}
          autoComplete="off"
          spellCheck={false}
        />
        {consulta && (
          <button
            type="button"
            className="buscador__limpiar"
            onClick={() => {
              setConsulta('');
              campo.current?.focus();
            }}
            aria-label="Borrar la búsqueda"
          >
            <Icon name="close" size={17} strokeWidth={2} />
          </button>
        )}
      </label>

      {!escrita && sugerir && <p className="buscador__rotulo">Accesos rápidos</p>}

      {resultados.length > 0 ? (
        <ul className="buscador__lista" id={`${id}-lista`} role="listbox">
          {resultados.map((r, i) => (
            <li key={r.ruta} id={`${id}-${i}`} role="option" aria-selected={i === activo}>
              <Link
                to={r.ruta}
                className={`buscador__item buscador__item--${r.tono}${i === activo ? ' is-activo' : ''}`}
                onClick={onCerrar}
                onMouseEnter={() => setActivo(i)}
                tabIndex={-1}
              >
                <span className="buscador__icono">
                  <Icon name={r.icon} size={21} strokeWidth={1.8} />
                </span>
                <span className="buscador__texto">
                  <b>{resaltar(r.titulo, escrita)}</b>
                  <small>{r.migas.join(' › ')}</small>
                </span>
                <Icon name="chevron-right" size={18} strokeWidth={2} className="buscador__ir" />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        escrita && (
        <div className="buscador__vacio">
          <Icon name="search" size={26} strokeWidth={1.6} />
          <p>
            No encontramos resultados para <b>«{escrita}»</b>.
          </p>
          <Link to="/empresa/contacto" onClick={onCerrar}>
            Escríbenos y te ayudamos
            <Icon name="arrow-right" size={14} strokeWidth={2.2} />
          </Link>
        </div>
        )
      )}
    </div>
  );
}
