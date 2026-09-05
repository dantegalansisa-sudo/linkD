/**
 * Banderas dibujadas a mano.
 *
 * Windows no trae la tipografia de banderas, asi que los emoji de pais se
 * pintan como dos letras sueltas ("CR", "CL"). Se dibujan en SVG para que se
 * vean igual en cualquier sistema.
 */
export type CodigoBandera = 'cr' | 'cl' | 'ec' | 'in' | 'mundo';

const BANDERAS: Record<CodigoBandera, JSX.Element> = {
  cr: (
    <>
      <rect width="30" height="20" fill="#002b7f" />
      <rect y="3.4" width="30" height="13.2" fill="#fff" />
      <rect y="7" width="30" height="6" fill="#ce1126" />
    </>
  ),
  cl: (
    <>
      <rect width="30" height="20" fill="#fff" />
      <rect y="10" width="30" height="10" fill="#d52b1e" />
      <rect width="10" height="10" fill="#0039a6" />
      <path d="m5 2.2 .9 2.7h2.9l-2.3 1.7.9 2.7L5 7.6 2.6 9.3l.9-2.7L1.2 4.9h2.9Z" fill="#fff" />
    </>
  ),
  ec: (
    <>
      <rect width="30" height="20" fill="#ffdd00" />
      <rect y="10" width="30" height="5" fill="#034ea2" />
      <rect y="15" width="30" height="5" fill="#ed1c24" />
    </>
  ),
  in: (
    <>
      <rect width="30" height="20" fill="#f93" />
      <rect y="6.7" width="30" height="6.6" fill="#fff" />
      <rect y="13.3" width="30" height="6.7" fill="#128807" />
      <circle cx="15" cy="10" r="2.6" fill="none" stroke="#008" strokeWidth="0.8" />
      <circle cx="15" cy="10" r="0.6" fill="#008" />
    </>
  ),
  mundo: (
    <>
      <rect width="30" height="20" rx="2" fill="#e8f0fb" />
      <circle cx="15" cy="10" r="6.4" fill="none" stroke="#2563eb" strokeWidth="1.2" />
      <path
        d="M15 3.6v12.8M8.6 10h12.8M15 3.6c-2.4 2-2.4 10.8 0 12.8M15 3.6c2.4 2 2.4 10.8 0 12.8"
        fill="none"
        stroke="#2563eb"
        strokeWidth="1.1"
      />
    </>
  ),
};

export default function Bandera({ codigo, alt }: { codigo: CodigoBandera; alt: string }) {
  return (
    <svg className="bandera" viewBox="0 0 30 20" role="img" aria-label={alt}>
      {BANDERAS[codigo]}
      <rect
        x="0.4"
        y="0.4"
        width="29.2"
        height="19.2"
        rx="1.6"
        fill="none"
        stroke="rgba(11,17,32,0.16)"
        strokeWidth="0.8"
      />
    </svg>
  );
}
