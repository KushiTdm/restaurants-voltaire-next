import React from 'react';

type IconName =
  | 'arrow' | 'arrowLeft' | 'down' | 'check' | 'clock'
  | 'users' | 'cal' | 'search' | 'plus' | 'minus'
  | 'close' | 'pin' | 'phone' | 'leaf' | 'spark';

const PATHS: Record<IconName, string> = {
  arrow: 'M4 10h12M11 5l5 5-5 5',
  arrowLeft: 'M16 10H4M9 5l-5 5 5 5',
  down: 'M5 8l5 5 5-5',
  check: 'M4 10.5l4 4 8-9',
  clock: 'M10 5v5l3 2',
  users: 'M7 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM2.5 16c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4M13 12c2 .3 3.5 1.7 3.5 4M12.5 4.2a2.5 2.5 0 010 4.6',
  cal: 'M3.5 5.5h13v11h-13zM3.5 8.5h13M7 3.5v3M13 3.5v3',
  search: 'M9 15a6 6 0 100-12 6 6 0 000 12zM17 17l-3.5-3.5',
  plus: 'M10 4v12M4 10h12',
  minus: 'M4 10h12',
  close: 'M5 5l10 10M15 5L5 15',
  pin: 'M10 17s6-5.2 6-9.5A6 6 0 004 7.5C4 11.8 10 17 10 17zM10 9.5a2 2 0 100-4 2 2 0 000 4z',
  phone: 'M5 3.5h3l1.2 3-1.6 1.2a9 9 0 004.7 4.7L17.5 11l3 1.2v3a1.5 1.5 0 01-1.6 1.5A14 14 0 013.5 5.1 1.5 1.5 0 015 3.5z',
  leaf: 'M16 4C9 4 4 8 4 15c5 0 11-3 12-11zM4 15c4-4 7-5 9-6',
  spark: 'M10 3l1.6 4.8L16.5 9l-4.9 1.2L10 15l-1.6-4.8L3.5 9l4.9-1.2z',
};

interface VIconProps {
  name: IconName;
  size?: number;
  stroke?: number;
  style?: React.CSSProperties;
}

export default function VIcon({ name, size = 18, stroke = 1.6, style }: VIconProps) {
  const p = PATHS[name] || '';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-hidden="true"
    >
      <path d={p} />
    </svg>
  );
}
