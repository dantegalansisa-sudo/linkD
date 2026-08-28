import { useId } from 'react';

/**
 * Escenas ilustradas en SVG para las cards.
 * Sustituyen fotografia de stock: son ligeras, nunca se rompen y mantienen
 * la identidad. Para cambiar a foto real basta reemplazar <Scene/> por <img/>.
 */

export type SceneVariant =
  | 'diagnostic'
  | 'hospital'
  | 'lab'
  | 'clinic'
  | 'patients'
  | 'referrers'
  | 'providers'
  | 'services'
  | 'history'
  | 'vision'
  | 'mission';

type Composition = 'viewer' | 'agenda' | 'rows' | 'device' | 'flow';

const CONFIG: Record<SceneVariant, { a: string; b: string; accent: string; comp: Composition }> = {
  diagnostic: { a: '#0b1a38', b: '#050a18', accent: '#4da3ff', comp: 'viewer' },
  hospital: { a: '#101a30', b: '#06090f', accent: '#21d4c6', comp: 'flow' },
  lab: { a: '#0a1b2c', b: '#05090f', accent: '#31c46b', comp: 'rows' },
  clinic: { a: '#1c1026', b: '#080611', accent: '#ff8a3d', comp: 'agenda' },
  patients: { a: '#0d1b34', b: '#050810', accent: '#4da3ff', comp: 'device' },
  referrers: { a: '#12142e', b: '#06070f', accent: '#7b5cff', comp: 'rows' },
  providers: { a: '#231607', b: '#0a0703', accent: '#ffb020', comp: 'flow' },
  services: { a: '#0a1f24', b: '#04090c', accent: '#21d4c6', comp: 'agenda' },
  history: { a: '#0e1730', b: '#05070f', accent: '#ff6a13', comp: 'viewer' },
  vision: { a: '#0a1730', b: '#050a14', accent: '#4da3ff', comp: 'flow' },
  mission: { a: '#1a1024', b: '#07060e', accent: '#ff8a3d', comp: 'device' },
};

export default function Scene({ variant, className }: { variant: SceneVariant; className?: string }) {
  const uid = useId().replace(/:/g, '');
  const { a, b, accent, comp } = CONFIG[variant];

  return (
    <svg
      className={className}
      viewBox="0 0 400 240"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={a} />
          <stop offset="100%" stopColor={b} />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.55" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`glow2-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff6a13" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ff6a13" stopOpacity="0" />
        </radialGradient>
        <pattern id={`grid-${uid}`} width="26" height="26" patternUnits="userSpaceOnUse">
          <path d="M26 0H0V26" fill="none" stroke="#ffffff" strokeOpacity="0.055" strokeWidth="1" />
        </pattern>
      </defs>

      <rect width="400" height="240" fill={`url(#bg-${uid})`} />
      <rect width="400" height="240" fill={`url(#grid-${uid})`} />
      <ellipse cx="312" cy="46" rx="150" ry="120" fill={`url(#glow-${uid})`} />
      <ellipse cx="66" cy="216" rx="130" ry="100" fill={`url(#glow2-${uid})`} />

      {comp === 'viewer' && <Viewer accent={accent} />}
      {comp === 'agenda' && <Agenda accent={accent} />}
      {comp === 'rows' && <Rows accent={accent} />}
      {comp === 'device' && <Device accent={accent} />}
      {comp === 'flow' && <Flow accent={accent} />}

      <rect
        x="0.5"
        y="0.5"
        width="399"
        height="239"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.09"
      />
    </svg>
  );
}

/* --------- Composiciones --------- */

function Panel({ x, y, w, h, r = 10 }: { x: number; y: number; w: number; h: number; r?: number }) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={r}
      fill="#ffffff"
      fillOpacity="0.055"
      stroke="#ffffff"
      strokeOpacity="0.13"
    />
  );
}

function Viewer({ accent }: { accent: string }) {
  return (
    <g>
      <Panel x={44} y={38} w={312} h={164} r={14} />
      {/* barra superior */}
      <g fill="#ffffff" fillOpacity="0.3">
        <circle cx="60" cy="54" r="3" />
        <circle cx="71" cy="54" r="3" />
        <circle cx="82" cy="54" r="3" />
      </g>
      <rect x="180" y="50" width="70" height="8" rx="4" fill="#ffffff" fillOpacity="0.12" />
      <line x1="44" y1="68" x2="356" y2="68" stroke="#ffffff" strokeOpacity="0.1" />

      {/* estudio */}
      <circle cx="150" cy="134" r="46" fill="none" stroke={accent} strokeOpacity="0.5" strokeWidth="1.2" />
      <circle cx="150" cy="134" r="30" fill={accent} fillOpacity="0.1" />
      <circle cx="150" cy="134" r="30" fill="none" stroke={accent} strokeOpacity="0.85" strokeWidth="1.4">
        <animate attributeName="r" values="28;33;28" dur="4.5s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" values="0.85;0.35;0.85" dur="4.5s" repeatCount="indefinite" />
      </circle>
      <path
        d="M112 134h20l7-16 10 34 8-22 6 10h25"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.75"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* panel lateral */}
      <g>
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x="224" y={90 + i * 26} width="112" height="16" rx="5" fill="#ffffff" fillOpacity="0.045" />
            <rect
              x="230"
              y={95 + i * 26}
              width={i === 1 ? 64 : i === 3 ? 38 : 50}
              height="6"
              rx="3"
              fill={i === 1 ? accent : '#ffffff'}
              fillOpacity={i === 1 ? 0.85 : 0.22}
            />
          </g>
        ))}
      </g>
    </g>
  );
}

function Agenda({ accent }: { accent: string }) {
  return (
    <g>
      <Panel x={52} y={40} w={296} h={160} r={14} />
      <rect x="68" y="56" width="58" height="8" rx="4" fill="#ffffff" fillOpacity="0.28" />
      <rect x="296" y="54" width="36" height="12" rx="6" fill={accent} fillOpacity="0.85" />
      <line x1="52" y1="78" x2="348" y2="78" stroke="#ffffff" strokeOpacity="0.1" />
      {Array.from({ length: 21 }).map((_, i) => {
        const col = i % 7;
        const row = Math.floor(i / 7);
        const active = [4, 9, 15].includes(i);
        return (
          <rect
            key={i}
            x={68 + col * 38}
            y={92 + row * 34}
            width={30}
            height={24}
            rx={6}
            fill={active ? accent : '#ffffff'}
            fillOpacity={active ? 0.85 : 0.06}
          >
            {active && (
              <animate
                attributeName="fill-opacity"
                values="0.85;0.4;0.85"
                dur="3.4s"
                begin={`${i * 0.3}s`}
                repeatCount="indefinite"
              />
            )}
          </rect>
        );
      })}
    </g>
  );
}

function Rows({ accent }: { accent: string }) {
  return (
    <g>
      <Panel x={48} y={36} w={304} h={168} r={14} />
      <rect x="64" y="52" width="70" height="8" rx="4" fill="#ffffff" fillOpacity="0.28" />
      <line x1="48" y1="74" x2="352" y2="74" stroke="#ffffff" strokeOpacity="0.1" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="64" y={88 + i * 28} width="272" height="20" rx="7" fill="#ffffff" fillOpacity="0.045" />
          <circle cx="78" cy={98 + i * 28} r="5" fill={i === 0 ? accent : '#ffffff'} fillOpacity={i === 0 ? 0.9 : 0.2} />
          <rect x="92" y={95 + i * 28} width={110 - i * 14} height="6" rx="3" fill="#ffffff" fillOpacity="0.24" />
          <rect
            x="278"
            y={94 + i * 28}
            width="46"
            height="8"
            rx="4"
            fill={accent}
            fillOpacity={0.7 - i * 0.15}
          />
        </g>
      ))}
      <rect x="64" y="88" width="272" height="20" rx="7" fill={accent} fillOpacity="0.08">
        <animate attributeName="y" values="88;144;88" dur="6s" repeatCount="indefinite" />
      </rect>
    </g>
  );
}

function Device({ accent }: { accent: string }) {
  return (
    <g>
      <Panel x={148} y={26} w={104} h={188} r={16} />
      <rect x="182" y="36" width="36" height="5" rx="2.5" fill="#ffffff" fillOpacity="0.2" />
      <rect x="162" y="54" width="76" height="46" rx="10" fill={accent} fillOpacity="0.16" />
      <path
        d="M172 82h12l5-13 8 26 6-17 4 8h16"
        fill="none"
        stroke={accent}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="162" y={110 + i * 22} width="76" height="15" rx="5" fill="#ffffff" fillOpacity="0.05" />
          <rect x="168" y={114 + i * 22} width={44 - i * 7} height="5" rx="2.5" fill="#ffffff" fillOpacity="0.22" />
          <circle cx="230" cy={117 + i * 22} r="3.4" fill={accent} fillOpacity={0.8 - i * 0.16} />
        </g>
      ))}
      {/* nodos flotantes */}
      <g>
        <circle cx="88" cy="86" r="4" fill={accent} fillOpacity="0.8">
          <animate attributeName="cy" values="86;74;86" dur="5s" repeatCount="indefinite" />
        </circle>
        <circle cx="318" cy="150" r="4" fill="#ff6a13" fillOpacity="0.8">
          <animate attributeName="cy" values="150;162;150" dur="6.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="104" cy="168" r="3" fill="#ffffff" fillOpacity="0.4" />
        <circle cx="308" cy="66" r="3" fill="#ffffff" fillOpacity="0.4" />
        <path d="M92 88 148 110M314 148 252 132" stroke={accent} strokeOpacity="0.3" strokeWidth="1" />
      </g>
    </g>
  );
}

function Flow({ accent }: { accent: string }) {
  const nodes = [
    { x: 84, y: 78 },
    { x: 200, y: 52 },
    { x: 316, y: 82 },
    { x: 128, y: 168 },
    { x: 264, y: 172 },
  ];
  return (
    <g>
      <g stroke={accent} strokeOpacity="0.35" strokeWidth="1.1" fill="none">
        <path d="M84 78 200 52 316 82M84 78 128 168 264 172 316 82M200 52 200 120M128 168 200 120 264 172" />
      </g>
      <circle cx="200" cy="120" r="26" fill={accent} fillOpacity="0.14" />
      <circle cx="200" cy="120" r="26" fill="none" stroke={accent} strokeOpacity="0.7" strokeWidth="1.4">
        <animate attributeName="r" values="24;30;24" dur="4s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" values="0.75;0.2;0.75" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="200" cy="120" r="9" fill="#ff6a13" />
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r="14" fill="#ffffff" fillOpacity="0.06" stroke="#ffffff" strokeOpacity="0.14" />
          <circle cx={n.x} cy={n.y} r="4.5" fill={accent} fillOpacity="0.9">
            <animate
              attributeName="fill-opacity"
              values="0.9;0.35;0.9"
              dur="3.6s"
              begin={`${i * 0.55}s`}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}
      <circle r="3" fill="#ffffff" fillOpacity="0.9">
        <animateMotion dur="5s" repeatCount="indefinite" path="M200 120 84 78" />
      </circle>
      <circle r="3" fill="#ff9a4d">
        <animateMotion dur="6.4s" repeatCount="indefinite" path="M200 120 316 82" />
      </circle>
      <circle r="2.6" fill="#ffffff" fillOpacity="0.7">
        <animateMotion dur="7.2s" repeatCount="indefinite" path="M200 120 264 172" />
      </circle>
    </g>
  );
}
