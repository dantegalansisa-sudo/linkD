import { useId, useMemo, useState } from 'react';

/*
  Grafica de linea con area para las visitas de las noticias. SVG propio:
  sin librerias, se adapta al ancho de la tarjeta (viewBox) y muestra el
  valor del dia al pasar el raton.
*/

export interface PuntoSerie {
  /** '2026-10-08' */
  dia: string;
  valor: number;
}

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export function etiquetaDia(iso: string): string {
  const [, m, d] = iso.split('-').map(Number);
  return `${d} ${MESES[(m ?? 1) - 1]}`;
}

/** Rellena con ceros los dias sin visitas entre desde y hasta (incluidos). */
export function serieDiaria(datos: Record<string, number>, desde: string, hasta: string): PuntoSerie[] {
  const puntos: PuntoSerie[] = [];
  const d = new Date(`${desde}T12:00:00Z`);
  const fin = new Date(`${hasta}T12:00:00Z`);
  while (d <= fin) {
    const iso = d.toISOString().slice(0, 10);
    puntos.push({ dia: iso, valor: datos[iso] ?? 0 });
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return puntos;
}

/** Un escalon "redondo" para el eje: 0, 200, 400... */
function techo(max: number): number {
  if (max <= 4) return 4;
  const pot = 10 ** Math.floor(Math.log10(max));
  for (const f of [1, 2, 2.5, 4, 5, 8, 10]) {
    if (f * pot >= max) return f * pot;
  }
  return 10 * pot;
}

export function GraficaLinea({ puntos, alto = 210, color = '#2e7dff' }: { puntos: PuntoSerie[]; alto?: number; color?: string }) {
  const id = useId().replace(/:/g, '');
  const [sobre, setSobre] = useState<number | null>(null);
  const ancho = 760;
  const margen = { izq: 38, der: 12, arriba: 12, abajo: 26 };
  const w = ancho - margen.izq - margen.der;
  const h = alto - margen.arriba - margen.abajo;

  const { max, xs, ys, linea, area } = useMemo(() => {
    const max = techo(Math.max(0, ...puntos.map((p) => p.valor)));
    const paso = puntos.length > 1 ? w / (puntos.length - 1) : 0;
    const xs = puntos.map((_, i) => margen.izq + (puntos.length > 1 ? i * paso : w / 2));
    const ys = puntos.map((p) => margen.arriba + h - (p.valor / max) * h);
    const linea = xs.map((x, i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
    const area = puntos.length ? `${linea} L${xs[xs.length - 1].toFixed(1)},${margen.arriba + h} L${xs[0].toFixed(1)},${margen.arriba + h} Z` : '';
    return { max, xs, ys, linea, area };
  }, [puntos, w, h, margen.izq, margen.arriba]);

  // unas seis fechas en el eje, repartidas
  const cadaCuanto = Math.max(1, Math.ceil(puntos.length / 7));

  return (
    <svg className="adm-grafica" viewBox={`0 0 ${ancho} ${alto}`} role="img" aria-label="Visualizaciones por día" onMouseLeave={() => setSobre(null)}>
      <defs>
        <linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.26" />
          <stop offset="1" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((f) => {
        const y = margen.arriba + h - f * h;
        return (
          <g key={f}>
            <line x1={margen.izq} x2={ancho - margen.der} y1={y} y2={y} className="adm-grafica__rejilla" />
            <text x={margen.izq - 8} y={y + 4} textAnchor="end" className="adm-grafica__eje">
              {Math.round(f * max).toLocaleString('es-DO')}
            </text>
          </g>
        );
      })}
      {puntos.map((p, i) =>
        i % cadaCuanto === 0 || i === puntos.length - 1 ? (
          <text key={p.dia} x={xs[i]} y={alto - 6} textAnchor="middle" className="adm-grafica__eje">
            {etiquetaDia(p.dia)}
          </text>
        ) : null,
      )}
      {area && <path d={area} fill={`url(#${id}-area)`} />}
      {linea && <path d={linea} fill="none" stroke={color} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />}
      {puntos.length <= 45 &&
        puntos.map((p, i) => <circle key={p.dia} cx={xs[i]} cy={ys[i]} r={sobre === i ? 5 : 3.2} fill="#fff" stroke={color} strokeWidth="2" />)}
      {/* zonas invisibles para el raton, una por dia */}
      {puntos.map((p, i) => (
        <rect
          key={`z${p.dia}`}
          x={xs[i] - (puntos.length > 1 ? w / (puntos.length - 1) / 2 : w / 2)}
          y={margen.arriba}
          width={puntos.length > 1 ? w / (puntos.length - 1) : w}
          height={h}
          fill="transparent"
          onMouseEnter={() => setSobre(i)}
        />
      ))}
      {sobre !== null && puntos[sobre] && (
        <g className="adm-grafica__globo" transform={`translate(${Math.min(Math.max(xs[sobre], margen.izq + 60), ancho - margen.der - 60)}, ${Math.max(ys[sobre] - 14, margen.arriba + 30)})`}>
          <rect x="-58" y="-34" width="116" height="30" rx="8" />
          <text x="0" y="-15" textAnchor="middle">
            {etiquetaDia(puntos[sobre].dia)} · {puntos[sobre].valor.toLocaleString('es-DO')}
          </text>
        </g>
      )}
    </svg>
  );
}
