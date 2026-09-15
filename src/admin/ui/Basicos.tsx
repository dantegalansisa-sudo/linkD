import { useEffect, useId, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import Icon, { type IconName } from '../../components/ui/Icon';

/* ============================================================
   Piezas basicas del panel: botones, campos, avisos, cabeceras
   ============================================================ */

type Variante = 'primario' | 'secundario' | 'suave' | 'peligro' | 'fantasma';

export function Boton({
  variante = 'secundario',
  icono,
  cargando,
  pequeno,
  children,
  className = '',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variante?: Variante; icono?: IconName; cargando?: boolean; pequeno?: boolean }) {
  return (
    <button
      type="button"
      {...rest}
      disabled={rest.disabled || cargando}
      className={`adm-boton adm-boton--${variante}${pequeno ? ' adm-boton--pequeno' : ''}${cargando ? ' is-cargando' : ''} ${className}`.trim()}
    >
      {cargando ? <span className="adm-girando" aria-hidden="true" /> : icono && <Icon name={icono} size={pequeno ? 15 : 17} strokeWidth={2} />}
      {children}
    </button>
  );
}

export function EnlaceBoton({
  to,
  variante = 'secundario',
  icono,
  pequeno,
  children,
  externo,
}: {
  to: string;
  variante?: Variante;
  icono?: IconName;
  pequeno?: boolean;
  children: ReactNode;
  externo?: boolean;
}) {
  const clase = `adm-boton adm-boton--${variante}${pequeno ? ' adm-boton--pequeno' : ''}`;
  if (externo) {
    return (
      <a className={clase} href={to} target="_blank" rel="noreferrer">
        {icono && <Icon name={icono} size={pequeno ? 15 : 17} strokeWidth={2} />}
        {children}
      </a>
    );
  }
  return (
    <Link className={clase} to={to}>
      {icono && <Icon name={icono} size={pequeno ? 15 : 17} strokeWidth={2} />}
      {children}
    </Link>
  );
}

/** Etiqueta + control + ayuda. El control se pasa como hijo. */
export function Campo({
  etiqueta,
  ayuda,
  error,
  obligatorio,
  children,
  ancho,
}: {
  etiqueta: string;
  ayuda?: ReactNode;
  error?: string;
  obligatorio?: boolean;
  children: ReactNode;
  /** Ocupa las dos columnas de una rejilla de campos. */
  ancho?: boolean;
}) {
  return (
    <label className={`adm-campo${ancho ? ' adm-campo--ancho' : ''}${error ? ' is-error' : ''}`}>
      <span className="adm-campo__etiqueta">
        {etiqueta}
        {obligatorio && <em aria-hidden="true">*</em>}
      </span>
      {children}
      {error ? <span className="adm-campo__error">{error}</span> : ayuda && <span className="adm-campo__ayuda">{ayuda}</span>}
    </label>
  );
}

export function Entrada(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`adm-entrada ${props.className ?? ''}`.trim()} />;
}

export function Area(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`adm-entrada adm-area ${props.className ?? ''}`.trim()} />;
}

export function Selector(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className="adm-selector">
      <select {...props} className={`adm-entrada ${props.className ?? ''}`.trim()} />
      <Icon name="chevron-down" size={15} strokeWidth={2.2} />
    </span>
  );
}

export function Interruptor({
  activo,
  onChange,
  etiqueta,
  descripcion,
}: {
  activo: boolean;
  onChange: (v: boolean) => void;
  etiqueta: string;
  descripcion?: string;
}) {
  const id = useId();
  return (
    <div className="adm-interruptor">
      <button
        type="button"
        role="switch"
        aria-checked={activo}
        aria-labelledby={id}
        className={`adm-interruptor__pista${activo ? ' is-activo' : ''}`}
        onClick={() => onChange(!activo)}
      >
        <span className="adm-interruptor__bola" />
      </button>
      <span className="adm-interruptor__texto" id={id}>
        <b>{etiqueta}</b>
        {descripcion && <small>{descripcion}</small>}
      </span>
    </div>
  );
}

export function AvisoEnLinea({ tipo = 'info', children }: { tipo?: 'info' | 'ok' | 'error' | 'alerta'; children: ReactNode }) {
  const icono: IconName = tipo === 'ok' ? 'check-circle' : tipo === 'error' ? 'alert' : tipo === 'alerta' ? 'alert' : 'info';
  return (
    <div className={`adm-aviso adm-aviso--${tipo}`} role={tipo === 'error' ? 'alert' : undefined}>
      <Icon name={icono} size={18} strokeWidth={2} />
      <div>{children}</div>
    </div>
  );
}

export function Vacio({ icono = 'inbox', titulo, texto, accion }: { icono?: IconName; titulo: string; texto?: string; accion?: ReactNode }) {
  return (
    <div className="adm-vacio">
      <span className="adm-vacio__icono">
        <Icon name={icono} size={30} strokeWidth={1.5} />
      </span>
      <b>{titulo}</b>
      {texto && <p>{texto}</p>}
      {accion}
    </div>
  );
}

export function Tarjeta({ titulo, acciones, children, className = '' }: { titulo?: ReactNode; acciones?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`adm-tarjeta ${className}`.trim()}>
      {(titulo || acciones) && (
        <header className="adm-tarjeta__cabeza">
          {titulo && <h2>{titulo}</h2>}
          {acciones && <div className="adm-tarjeta__acciones">{acciones}</div>}
        </header>
      )}
      <div className="adm-tarjeta__cuerpo">{children}</div>
    </section>
  );
}

/** Cabecera de una pantalla: titulo, subtitulo y acciones a la derecha. */
export function Cabecera({ titulo, subtitulo, volver, acciones, chip }: { titulo: string; subtitulo?: ReactNode; volver?: string; acciones?: ReactNode; chip?: ReactNode }) {
  return (
    <header className="adm-cabecera">
      <div className="adm-cabecera__texto">
        {volver && (
          <Link className="adm-cabecera__volver" to={volver}>
            <Icon name="arrow-left" size={15} strokeWidth={2.2} />
            Volver
          </Link>
        )}
        <h1>
          {titulo}
          {chip}
        </h1>
        {subtitulo && <p>{subtitulo}</p>}
      </div>
      {acciones && <div className="adm-cabecera__acciones">{acciones}</div>}
    </header>
  );
}

export function Chip({ tono = 'gris', children }: { tono?: 'gris' | 'verde' | 'naranja' | 'azul' | 'rojo'; children: ReactNode }) {
  return <span className={`adm-chip adm-chip--${tono}`}>{children}</span>;
}

/** "hace 3 min", "ayer", "12 sep 2026". */
export function haceCuanto(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const seg = (Date.now() - d.getTime()) / 1000;
  if (seg < 60) return 'hace un momento';
  if (seg < 3600) return `hace ${Math.round(seg / 60)} min`;
  if (seg < 86400) return `hace ${Math.round(seg / 3600)} h`;
  if (seg < 172800) return 'ayer';
  return d.toLocaleDateString('es-DO', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function fechaHora(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('es-DO', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

/** Campo de busqueda con retardo. */
export function Buscador({ valor, onChange, placeholder = 'Buscar…' }: { valor: string; onChange: (v: string) => void; placeholder?: string }) {
  const [local, setLocal] = useState(valor);
  useEffect(() => {
    const t = window.setTimeout(() => onChange(local), 180);
    return () => window.clearTimeout(t);
  }, [local, onChange]);
  return (
    <label className="adm-buscador">
      <Icon name="search" size={16} strokeWidth={2} />
      <input type="search" value={local} onChange={(e) => setLocal(e.target.value)} placeholder={placeholder} aria-label={placeholder} />
    </label>
  );
}

/** Pestanas simples. */
export function Pestanas<T extends string>({ valor, opciones, onChange }: { valor: T; opciones: { clave: T; label: string; total?: number }[]; onChange: (v: T) => void }) {
  return (
    <div className="adm-pestanas" role="tablist">
      {opciones.map((o) => (
        <button
          key={o.clave}
          type="button"
          role="tab"
          aria-selected={valor === o.clave}
          className={`adm-pestana${valor === o.clave ? ' is-activa' : ''}`}
          onClick={() => onChange(o.clave)}
        >
          {o.label}
          {o.total !== undefined && <b>{o.total}</b>}
        </button>
      ))}
    </div>
  );
}
