export function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <g stroke="var(--primary)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="16" width="7" height="16" rx="2" />
        <rect x="38" y="16" width="7" height="16" rx="2" />
        <rect x="9" y="20" width="4.5" height="8" rx="1" />
        <rect x="34.5" y="20" width="4.5" height="8" rx="1" />
        <line x1="13" y1="24" x2="35" y2="24" />
      </g>
    </svg>
  );
}
