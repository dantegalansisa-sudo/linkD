import type { SVGProps } from 'react';

export type IconName =
  | 'arrow-right'
  | 'arrow-up-right'
  | 'chevron-down'
  | 'search'
  | 'check'
  | 'check-circle'
  | 'shield'
  | 'code'
  | 'headset'
  | 'sparkles'
  | 'users'
  | 'building'
  | 'landmark'
  | 'heart'
  | 'cloud'
  | 'calendar'
  | 'clock'
  | 'chart'
  | 'activity'
  | 'whatsapp'
  | 'facebook'
  | 'instagram'
  | 'linkedin'
  | 'youtube'
  | 'phone'
  | 'mail'
  | 'map-pin'
  | 'menu'
  | 'close'
  | 'lock'
  | 'cpu'
  | 'layers'
  | 'file-text'
  | 'credit-card'
  | 'image'
  | 'printer'
  | 'box'
  | 'stethoscope'
  | 'microscope'
  | 'hospital'
  | 'network'
  | 'brain'
  | 'database'
  | 'monitor'
  | 'user-round'
  | 'send'
  | 'star'
  | 'zap'
  | 'globe'
  | 'graduation'
  | 'home'
  | 'external-link'
  | 'play'
  | 'gift'
  | 'scan'
  | 'arrow-up'
  | 'chevron-right'
  | 'handshake'
  | 'trophy'
  | 'settings'
  | 'lightbulb'
  | 'scale'
  | 'pill'
  | 'plane'
  | 'briefcase';

const PATHS: Record<IconName, JSX.Element> = {
  'arrow-right': <path d="M5 12h14M13 6l6 6-6 6" />,
  'arrow-up-right': <path d="M7 17 17 7M8 7h9v9" />,
  'arrow-up': <path d="M12 19V5M6 11l6-6 6 6" />,
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  'chevron-right': <path d="m9 6 6 6-6 6" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </>
  ),
  check: <path d="m4 12.5 5 5L20 6.5" />,
  'check-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.2 12.2 2.6 2.6 5-5.4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5.6c0 4.3 3 8.1 7 9.4 4-1.3 7-5.1 7-9.4V6l-7-3Z" />
      <path d="m9.2 12 2 2 3.6-3.9" />
    </>
  ),
  code: <path d="m9 18-6-6 6-6M15 6l6 6-6 6" />,
  headset: (
    <>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <path d="M4 13h2.5a1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1H5.5A1.5 1.5 0 0 1 4 17V13ZM20 13h-2.5a1 1 0 0 0-1 1v3.5a1 1 0 0 0 1 1h1A1.5 1.5 0 0 0 20 17V13Z" />
      <path d="M18 18.5v.5a2.5 2.5 0 0 1-2.5 2.5H13" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 3.5 13.6 8 18 9.5 13.6 11 12 15.5 10.4 11 6 9.5 10.4 8 12 3.5Z" />
      <path d="M18.5 15.5 19.3 18l2.2.8-2.2.8-.8 2.4-.8-2.4-2.2-.8 2.2-.8.8-2.5ZM5 14l.6 1.8L7.5 16.4l-1.9.7L5 19l-.6-1.9-1.9-.7 1.9-.6L5 14Z" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.4" />
      <path d="M3 20c0-3.3 2.7-5.4 6-5.4S15 16.7 15 20" />
      <path d="M16 5.2a3.4 3.4 0 0 1 0 6.6M17.5 14.9c2.1.6 3.5 2.3 3.5 5.1" />
    </>
  ),
  landmark: (
    <>
      <path d="M3 10h18L12 4 3 10Z" />
      <path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8" />
      <path d="M3 21h18" />
    </>
  ),
  handshake: (
    <>
      <path d="M11 17.5 13 19.5a1.4 1.4 0 0 0 2-2" />
      <path d="M13.5 15 16.5 18a1.4 1.4 0 0 0 2-2l-4.2-4.2a2 2 0 0 0-1.6-.6l-2.5.3a2 2 0 0 1-1.5-.5L7 9.5" />
      <path d="M21 4.5 16.5 8M3 4.5 7.5 8" />
      <path d="M3 12.5 6.5 9a2 2 0 0 1 2.8 0l3 3" />
    </>
  ),
  trophy: (
    <>
      <path d="M6.5 4h11v5a5.5 5.5 0 0 1-11 0V4Z" />
      <path d="M6.5 6H4.5a2 2 0 0 0 0 4h2M17.5 6h2a2 2 0 0 1 0 4h-2" />
      <path d="M12 14.5V18M9 21h6M10 18h4" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" />
    </>
  ),
  lightbulb: (
    <>
      <path d="M9.5 18h5M10.5 21h3" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.5.4.8 1 .9 1.6l.1.5h5l.1-.5c.1-.6.4-1.2.9-1.6A6 6 0 0 0 12 3Z" />
    </>
  ),
  scale: (
    <>
      <path d="M12 3.5v17.5M7 21h10" />
      <path d="m12 6.5-7 1.8m7-1.8 7 1.8" />
      <path d="M5 8.3 2.6 14a2.5 2.5 0 0 0 4.8 0L5 8.3Zm14 0L16.6 14a2.5 2.5 0 0 0 4.8 0L19 8.3Z" />
    </>
  ),
  pill: (
    <>
      <path d="M8.5 3.5 3.5 8.5a4.2 4.2 0 0 0 6 6l5-5a4.2 4.2 0 0 0-6-6Z" />
      <path d="m6.5 5.5 6 6" />
      <path d="M14.5 9.5 19.5 14.5a4.2 4.2 0 0 1-6 6" opacity="0" />
    </>
  ),
  plane: <path d="M10.4 3.7a1.4 1.4 0 0 1 2.6 0L14.6 9l5.4 1.6a1.3 1.3 0 0 1 0 2.5L14.6 15l-1.6 5.3a1.3 1.3 0 0 1-2.5 0L8.9 15 3.6 13.1a1.3 1.3 0 0 1 0-2.5L8.9 9l1.5-5.3Z" />,
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12h18" />
    </>
  ),
  building: (
    <>
      <path d="M4 21V6l7-3v18M11 21V9l8 3v9M3 21h18" />
      <path d="M7 9v.01M7 13v.01M7 17v.01M15 14v.01M15 17v.01" />
    </>
  ),
  heart: <path d="M12 20s-7-4.4-7-9.3A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.7C19 15.6 12 20 12 20Z" />,
  cloud: <path d="M7.5 19a4.2 4.2 0 0 1-.4-8.4 5.6 5.6 0 0 1 10.8-.6A3.9 3.9 0 0 1 17.5 19h-10Z" />,
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 7v5.3l3.2 1.9" />
    </>
  ),
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  activity: <path d="M2 12.5h4l2.4-6.5 4.4 12 2.6-7 1.8 1.5H22" />,
  whatsapp: (
    <path
      fill="currentColor"
      stroke="none"
      d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.9.53 3.68 1.46 5.2L2 22l5.1-1.6a9.83 9.83 0 0 0 4.94 1.32c5.44 0 9.84-4.4 9.84-9.84S17.48 2 12.04 2Zm5.72 13.9c-.24.68-1.4 1.3-1.94 1.34-.5.06-1.12.08-1.8-.12-.42-.14-.96-.32-1.64-.62-2.9-1.26-4.78-4.16-4.92-4.36-.14-.2-1.18-1.56-1.18-2.98s.74-2.12 1-2.4c.26-.3.58-.36.76-.36l.56.01c.18 0 .42-.06.66.5.24.6.84 2.02.9 2.16.08.14.12.3.02.5-.1.2-.14.32-.28.5-.14.18-.3.4-.42.52-.14.14-.28.3-.12.58.16.28.72 1.18 1.54 1.92 1.06.94 1.94 1.24 2.22 1.38.28.14.44.12.6-.08.16-.2.7-.82.88-1.1.18-.28.36-.24.62-.14.24.1 1.66.78 1.94.92.28.14.46.22.54.34.06.14.06.74-.18 1.42Z"
    />
  ),
  facebook: (
    <path
      fill="currentColor"
      stroke="none"
      d="M13.5 21v-7.8h2.6l.4-3h-3V8.2c0-.88.24-1.47 1.5-1.47H16.7V4.06A21 21 0 0 0 14.36 4c-2.32 0-3.9 1.4-3.9 4v2.2H7.9v3h2.56V21h3.04Z"
    />
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.9" />
      <path d="M17 7.2h.01" />
    </>
  ),
  linkedin: (
    <path
      fill="currentColor"
      stroke="none"
      d="M6.94 8.5H4.1V21h2.84V8.5ZM5.52 3.5a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4ZM20 13.9c0-3.3-1.76-4.84-4.1-4.84-1.9 0-2.75 1.04-3.22 1.78V8.5H9.84c.04.8 0 12.5 0 12.5h2.84v-6.98c0-.25.02-.5.1-.68.2-.5.66-1.02 1.44-1.02 1.02 0 1.42.78 1.42 1.92V21H20v-7.1Z"
    />
  ),
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="m10.3 9.4 5 2.6-5 2.6V9.4Z" fill="currentColor" stroke="none" />
    </>
  ),
  phone: (
    <path d="M6.2 3.5h2.9l1.4 3.5-2 1.4a12.6 12.6 0 0 0 5.1 5.1l1.4-2 3.5 1.4v2.9a2.2 2.2 0 0 1-2.4 2.2A15.9 15.9 0 0 1 4 5.9a2.2 2.2 0 0 1 2.2-2.4Z" />
  ),
  mail: (
    <>
      <rect x="2.8" y="5" width="18.4" height="14" rx="2.6" />
      <path d="m3.6 7 8.4 6 8.4-6" />
    </>
  ),
  'map-pin': (
    <>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  menu: <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  lock: (
    <>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.6" />
      <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
    </>
  ),
  cpu: (
    <>
      <rect x="6.5" y="6.5" width="11" height="11" rx="2.4" />
      <rect x="10" y="10" width="4" height="4" rx="1" />
      <path d="M9.5 3v3.5M14.5 3v3.5M9.5 17.5V21M14.5 17.5V21M3 9.5h3.5M3 14.5h3.5M17.5 9.5H21M17.5 14.5H21" />
    </>
  ),
  layers: <path d="m12 3 9 4.6-9 4.6-9-4.6L12 3ZM3 12.4l9 4.6 9-4.6M3 16.9l9 4.6 9-4.6" />,
  'file-text': (
    <>
      <path d="M13.5 3H7a2.5 2.5 0 0 0-2.5 2.5v13A2.5 2.5 0 0 0 7 21h10a2.5 2.5 0 0 0 2.5-2.5V9l-6-6Z" />
      <path d="M13.5 3v6h6M8.5 13.5h7M8.5 17h5" />
    </>
  ),
  'credit-card': (
    <>
      <rect x="2.8" y="5.5" width="18.4" height="13" rx="2.6" />
      <path d="M2.8 10h18.4M6.5 14.8h3" />
    </>
  ),
  image: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.6" />
      <circle cx="9" cy="10" r="1.8" />
      <path d="m4.5 17.5 4.6-4.4 3.4 3 3-2.6 4 3.8" />
    </>
  ),
  printer: (
    <>
      <path d="M7 9V4h10v5" />
      <rect x="3.5" y="9" width="17" height="7.5" rx="2.2" />
      <path d="M7 14h10v6H7z" />
    </>
  ),
  box: (
    <>
      <path d="m12 3 8 4v10l-8 4-8-4V7l8-4Z" />
      <path d="m4 7 8 4 8-4M12 11v10" />
    </>
  ),
  stethoscope: (
    <>
      <path d="M6 3v5a4 4 0 0 0 8 0V3" />
      <path d="M5 3h2M13 3h2M10 12v2.5a4.5 4.5 0 0 0 9 0V13" />
      <circle cx="19" cy="11" r="2.1" />
    </>
  ),
  microscope: (
    <>
      <path d="M7 20h12M9.5 20a5.5 5.5 0 0 0 5.5-5.5" />
      <path d="M10.5 4.5 8 7l4 4 2.5-2.5a2.8 2.8 0 0 0-4-4Z" />
      <path d="m8.5 11.5-2.6 2.6a2 2 0 0 0 2.8 2.8l2.6-2.6" />
    </>
  ),
  hospital: (
    <>
      <path d="M4 21V8l8-4 8 4v13M2.5 21h19" />
      <path d="M12 9.5v5M9.5 12h5M9 21v-3.5h6V21" />
    </>
  ),
  network: (
    <>
      <circle cx="12" cy="12" r="2.6" />
      <circle cx="12" cy="4" r="1.9" />
      <circle cx="19" cy="17" r="1.9" />
      <circle cx="5" cy="17" r="1.9" />
      <path d="M12 6v3.4M13.9 13.6l3.4 2M10.1 13.6l-3.4 2" />
    </>
  ),
  brain: (
    <>
      <path d="M12 5.2a3 3 0 0 0-5.6 1.2A2.9 2.9 0 0 0 4.5 9a2.9 2.9 0 0 0 1 2.2A3 3 0 0 0 6.8 16 3 3 0 0 0 12 18.4V5.2Z" />
      <path d="M12 5.2a3 3 0 0 1 5.6 1.2A2.9 2.9 0 0 1 19.5 9a2.9 2.9 0 0 1-1 2.2 3 3 0 0 1-1.3 4.8A3 3 0 0 1 12 18.4" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="6" rx="7.5" ry="3" />
      <path d="M4.5 6v12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3" />
    </>
  ),
  monitor: (
    <>
      <rect x="2.8" y="4" width="18.4" height="12.5" rx="2.4" />
      <path d="M8.5 20.5h7M12 16.5v4" />
    </>
  ),
  'user-round': (
    <>
      <circle cx="12" cy="8.4" r="3.9" />
      <path d="M4.5 20.5c0-3.9 3.4-6.2 7.5-6.2s7.5 2.3 7.5 6.2" />
    </>
  ),
  send: <path d="M21 3 10.5 13.5M21 3l-6.8 18-3.7-7.5L3 9.8 21 3Z" />,
  star: <path d="m12 3.5 2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.8l6-.8L12 3.5Z" />,
  zap: <path d="M13.2 2.5 4.5 13.6h6l-.7 7.9 8.7-11.1h-6l.7-7.9Z" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M3.4 12h17.2M12 3.4c2.2 2.4 3.4 5.4 3.4 8.6S14.2 18.2 12 20.6c-2.2-2.4-3.4-5.4-3.4-8.6S9.8 5.8 12 3.4Z" />
    </>
  ),
  graduation: (
    <>
      <path d="m12 4 9.5 4.5L12 13 2.5 8.5 12 4Z" />
      <path d="M6.5 10.5v5.2c0 1.6 2.5 2.8 5.5 2.8s5.5-1.2 5.5-2.8v-5.2M20.5 9v5.5" />
    </>
  ),
  home: (
    <>
      <path d="M3.5 10.4 12 3.6l8.5 6.8V19a1.6 1.6 0 0 1-1.6 1.6H5.1A1.6 1.6 0 0 1 3.5 19v-8.6Z" />
      <path d="M9.4 20.6v-6.2h5.2v6.2" />
    </>
  ),
  'external-link': (
    <>
      <path d="M13.5 4.5H19a.5.5 0 0 1 .5.5v5.5" />
      <path d="M19.5 5 12 12.5" />
      <path d="M18 14.4V18a1.6 1.6 0 0 1-1.6 1.6H6A1.6 1.6 0 0 1 4.4 18V7.6A1.6 1.6 0 0 1 6 6h3.6" />
    </>
  ),
  play: <path d="M9 6.6 17.4 12 9 17.4V6.6Z" fill="currentColor" stroke="none" />,
  scan: (
    <>
      <rect x="2.8" y="4.2" width="18.4" height="12.6" rx="3" />
      <circle cx="12" cy="10.5" r="3.3" />
      <path d="M7.5 20.4h9M12 16.8v3.6" />
    </>
  ),
  gift: (
    <>
      <rect x="3.4" y="8.6" width="17.2" height="4.2" rx="1.2" />
      <path d="M4.9 12.8V19a1.6 1.6 0 0 0 1.6 1.6h11a1.6 1.6 0 0 0 1.6-1.6v-6.2M12 8.6v12" />
      <path d="M12 8.6H8.2a2.1 2.1 0 1 1 0-4.2c2 0 3.8 4.2 3.8 4.2Zm0 0h3.8a2.1 2.1 0 1 0 0-4.2c-2 0-3.8 4.2-3.8 4.2Z" />
    </>
  ),
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
  strokeWidth?: number;
}

export default function Icon({ name, size = 20, strokeWidth = 1.6, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
