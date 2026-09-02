// Shared 22px outline icon set for the toolbar and panel (1.8px stroke,
// currentColor) so every surface draws from one consistent weight.

type IconProps = {
  size?: number;
};

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const CameraIcon = ({ size = 22 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M3 8.5a2 2 0 0 1 2-2h1.6l1.2-1.8a1.5 1.5 0 0 1 1.25-.7h5.9a1.5 1.5 0 0 1 1.25.7l1.2 1.8H19a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <circle cx="12" cy="12.5" r="3.4" />
  </svg>
);

export const ChatIcon = ({ size = 22 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M8.2 5h9.3A2.5 2.5 0 0 1 20 7.5v5A2.5 2.5 0 0 1 17.5 15H16v3l-3.4-3H8.2a2.5 2.5 0 0 1-2.5-2.5v-5A2.5 2.5 0 0 1 8.2 5z" />
    <path d="M5.7 9H5a2 2 0 0 0-2 2v4.5A1.5 1.5 0 0 0 4.5 17H5v2l2.2-2" />
  </svg>
);

export const HelpIcon = ({ size = 22 }: IconProps) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.6 9.2a2.5 2.5 0 0 1 4.9.7c0 1.6-2.5 2.1-2.5 3.4" />
    <circle cx="12" cy="16.8" r="0.4" fill="currentColor" stroke="none" />
  </svg>
);

export const DragGridIcon = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" stroke="none">
    {[3, 8, 13].map((x) =>
      [5, 11].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.2" />),
    )}
  </svg>
);

export const CloseIcon = ({ size = 18 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const KebabIcon = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <circle cx="12" cy="5.5" r="1.6" />
    <circle cx="12" cy="12" r="1.6" />
    <circle cx="12" cy="18.5" r="1.6" />
  </svg>
);

export const ChevronDownIcon = ({ size = 16 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const FilterIcon = ({ size = 16 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M4 6h16M7 12h10M10 18h4" />
  </svg>
);

export const ClockIcon = ({ size = 14 }: IconProps) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);
