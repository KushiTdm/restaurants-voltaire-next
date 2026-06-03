import React from 'react';
import { V } from '@/lib/tokens';

interface VLabelProps {
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
}

export default function VLabel({ children, color = V.brick, style }: VLabelProps) {
  return (
    <div
      style={{
        fontFamily: V.sans,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '.18em',
        textTransform: 'uppercase',
        color,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
