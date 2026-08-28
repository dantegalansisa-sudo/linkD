import { useEffect, useRef } from 'react';

/**
 * Red de nodos viva: orbitas concentricas, nodos que respiran,
 * enlaces con pulsos de datos viajando y parallax suave con el mouse.
 * Se dibuja detras del hero y reemplaza el fondo estatico del render original.
 */

interface Node {
  ring: number;
  angle: number;
  speed: number;
  size: number;
  glow: number;
  phase: number;
}

interface Pulse {
  node: number;
  t: number;
  speed: number;
  hue: 'orange' | 'blue';
}

const ORANGE = '255, 122, 40';
const BLUE = '90, 165, 255';
const CYAN = '120, 220, 255';

interface NetworkCanvasProps {
  className?: string;
  /** Centro de la red en proporcion del ancho / alto del canvas. */
  cx?: number;
  cy?: number;
  /** Centro alternativo por debajo de 900px de ancho. */
  cxSmall?: number;
  cySmall?: number;
}

export default function NetworkCanvas({
  className,
  cx: cxRatio = 0.73,
  cy: cyRatio = 0.5,
  cxSmall = 0.5,
  cySmall = 0.42,
}: NetworkCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    let cx = 0;
    let cy = 0;
    let scale = 1;
    let raf = 0;
    let running = true;

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    // --- Construccion de la red -------------------------------------------
    const RINGS = [0.17, 0.29, 0.42];
    const PER_RING = [6, 9, 12];
    const nodes: Node[] = [];

    RINGS.forEach((r, ri) => {
      const count = PER_RING[ri];
      for (let i = 0; i < count; i++) {
        nodes.push({
          ring: r,
          angle: (i / count) * Math.PI * 2 + ri * 0.4,
          speed: (ri % 2 === 0 ? 1 : -1) * (0.00007 + ri * 0.00002),
          size: ri === 0 ? 3.8 : ri === 1 ? 2.9 : 2.2,
          glow: ri === 0 ? 1 : ri === 1 ? 0.72 : 0.5,
          phase: Math.random() * Math.PI * 2,
        });
      }
    });

    const pulses: Pulse[] = Array.from({ length: 16 }, (_, i) => ({
      node: Math.floor(Math.random() * nodes.length),
      t: Math.random(),
      speed: 0.0022 + Math.random() * 0.0035,
      hue: i % 3 === 0 ? 'orange' : 'blue',
    }));

    // --- Dimensionado -----------------------------------------------------
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // el nucleo vive donde esta el edificio: derecha en desktop, centro en movil
      // el layout del hero apila en 1100px: ahi el nucleo pasa al centro
      const wide = window.innerWidth > 1100;
      cx = w * (wide ? cxRatio : cxSmall);
      cy = h * (wide ? cyRatio : cySmall);
      scale = Math.min(w * 0.92, h * 1.35);
    };

    const pos = (n: Node, t: number) => {
      const a = n.angle + t * n.speed * 1000;
      const r = n.ring * scale;
      return {
        x: cx + Math.cos(a) * r * 1.32 + mouse.x * (0.4 + n.ring),
        y: cy + Math.sin(a) * r * 0.62 + mouse.y * (0.4 + n.ring),
      };
    };

    // --- Render -----------------------------------------------------------
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;

      // orbitas
      ctx.lineWidth = 1;
      RINGS.forEach((r, i) => {
        ctx.beginPath();
        ctx.ellipse(cx + mouse.x * (0.4 + r), cy + mouse.y * (0.4 + r), r * scale * 1.32, r * scale * 0.62, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${BLUE}, ${0.28 - i * 0.05})`;
        ctx.stroke();
      });

      const pts = nodes.map((n) => pos(n, t));

      // enlaces radiales hacia el nucleo
      pts.forEach((p, i) => {
        const n = nodes[i];
        const grad = ctx.createLinearGradient(cx, cy, p.x, p.y);
        grad.addColorStop(0, `rgba(${BLUE}, ${0.5 * n.glow})`);
        grad.addColorStop(1, `rgba(${BLUE}, 0.05)`);
        ctx.beginPath();
        ctx.moveTo(cx + mouse.x * 0.3, cy + mouse.y * 0.3);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // enlaces entre vecinos del mismo anillo
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          if (nodes[i].ring !== nodes[j].ring) continue;
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.hypot(dx, dy);
          if (d > scale * 0.24) continue;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(${CYAN}, ${0.22 * (1 - d / (scale * 0.24))})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }

      // pulsos de datos viajando del nucleo al nodo
      pulses.forEach((p) => {
        p.t += p.speed;
        if (p.t > 1) {
          p.t = 0;
          p.node = Math.floor(Math.random() * nodes.length);
        }
        const target = pts[p.node];
        const ease = p.t * p.t * (3 - 2 * p.t);
        const x = cx + (target.x - cx) * ease;
        const y = cy + (target.y - cy) * ease;
        const fade = Math.sin(p.t * Math.PI);
        const color = p.hue === 'orange' ? ORANGE : CYAN;

        const g = ctx.createRadialGradient(x, y, 0, x, y, 9);
        g.addColorStop(0, `rgba(${color}, ${0.9 * fade})`);
        g.addColorStop(1, `rgba(${color}, 0)`);
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, 1.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.85 * fade})`;
        ctx.fill();
      });

      // nodos
      pts.forEach((p, i) => {
        const n = nodes[i];
        const breathe = 0.72 + Math.sin(t * 0.0016 + n.phase) * 0.28;
        const r = n.size * breathe;

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 7);
        g.addColorStop(0, `rgba(${BLUE}, ${0.6 * n.glow * breathe})`);
        g.addColorStop(1, `rgba(${BLUE}, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 7, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(228, 242, 255, ${0.7 + 0.3 * n.glow})`;
        ctx.fill();
      });

      // nucleo
      const coreX = cx + mouse.x * 0.3;
      const coreY = cy + mouse.y * 0.3;
      const pulse = 0.8 + Math.sin(t * 0.0013) * 0.2;
      const core = ctx.createRadialGradient(coreX, coreY, 0, coreX, coreY, 120 * pulse);
      core.addColorStop(0, `rgba(${ORANGE}, 0.2)`);
      core.addColorStop(0.45, `rgba(${BLUE}, 0.1)`);
      core.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(coreX, coreY, 120 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = core;
      ctx.fill();
    };

    const loop = (t: number) => {
      if (running) draw(t);
      raf = requestAnimationFrame(loop);
    };

    const onMouse = (e: MouseEvent) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 34;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 22;
    };

    resize();
    window.addEventListener('resize', resize);
    if (!reduced) window.addEventListener('mousemove', onMouse, { passive: true });

    if (reduced) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    // pausar fuera de pantalla
    const io = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting;
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      io.disconnect();
    };
  }, [cxRatio, cyRatio, cxSmall, cySmall]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
