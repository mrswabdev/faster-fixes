import { THEME } from "../styles.js";

export const PIN_MARKER_SIZE = 32;

type PinMarkerProps = {
  statusColor: string;
  isActive: boolean;
};

// Feedbucket-style teardrop: navy drop with the tip at the anchor point;
// the inner dot carries the feedback status color.
export function PinMarker({ statusColor, isActive }: PinMarkerProps) {
  return (
    <svg
      width={PIN_MARKER_SIZE}
      height={PIN_MARKER_SIZE}
      viewBox="0 0 32 32"
      style={{
        display: "block",
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.28))",
        transform: isActive ? "scale(1.15)" : "scale(1)",
        transformOrigin: "50% 100%",
        transition: "transform 0.15s ease",
      }}
    >
      <path
        d="M16 1.5c-6.35 0-11.5 5.02-11.5 11.21 0 4.1 2.25 7.4 4.9 10.03 2.1 2.08 4.48 3.83 6.6 5.76 2.12-1.93 4.5-3.68 6.6-5.76 2.65-2.63 4.9-5.93 4.9-10.03C27.5 6.52 22.35 1.5 16 1.5z"
        fill={THEME.navy}
        stroke="#ffffff"
        strokeWidth="1.5"
      />
      <circle cx="16" cy="12.7" r="4.2" fill={statusColor} />
    </svg>
  );
}
