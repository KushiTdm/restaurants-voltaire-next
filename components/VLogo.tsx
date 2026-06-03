import React from 'react';
import { V } from '@/lib/tokens';

interface VLogoProps {
  size?: number;
  color?: string;
  sub?: boolean;
}

export default function VLogo({ size = 26, color = V.ink, sub = true }: VLogoProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, lineHeight: 1 }}>
      <span style={{ fontFamily: V.serif, fontSize: size, color, letterSpacing: '-0.01em' }}>
        Voltaire
      </span>
      {sub && (
        <span
          style={{
            fontFamily: V.sans,
            fontSize: size * 0.31,
            fontWeight: 700,
            letterSpacing: '.18em',
            textTransform: 'uppercase',
            color: V.saf,
          }}
        >
          Cantine · XI
        </span>
      )}
    </div>
  );
}
