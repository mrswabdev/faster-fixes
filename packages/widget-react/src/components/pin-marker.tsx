export const PIN_MARKER_SIZE = 32;

type PinMarkerProps = {
  statusColor: string;
  isActive: boolean;
};

// AgencyDock speech-bubble marker: rounded bubble with its tail tip on the
// anchor point; three dots read as "comment", the middle one carries the
// feedback status color.
export function PinMarker({ statusColor, isActive }: PinMarkerProps) {
  return (
    <svg
      width={PIN_MARKER_SIZE}
      height={PIN_MARKER_SIZE}
      viewBox="0 0 32 32"
      style={{
        display: "block",
        filter: "drop-shadow(0 2px 4px rgba(11,17,36,0.3))",
        transform: isActive ? "scale(1.15)" : "scale(1)",
        transformOrigin: "25% 100%",
        transition: "transform 0.15s ease",
      }}
    >
      <path
        d="M7 2.5h18A5.5 5.5 0 0 1 30.5 8v10a5.5 5.5 0 0 1-5.5 5.5H13.8L8 31.2v-7.9A5.5 5.5 0 0 1 1.5 18V8A5.5 5.5 0 0 1 7 2.5z"
        fill="#2F6BFF"
        stroke="#ffffff"
        strokeWidth="1.5"
      />
      <circle cx="9.5" cy="13" r="2" fill="rgba(255,255,255,0.85)" />
      <circle cx="16" cy="13" r="2.4" fill={statusColor} stroke="#ffffff" strokeWidth="1" />
      <circle cx="22.5" cy="13" r="2" fill="rgba(255,255,255,0.85)" />
    </svg>
  );
}
