'use client';
import React, { useState } from 'react';
import { V } from '@/lib/tokens';

type Variant = 'ink' | 'gold' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface VButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  full?: boolean;
  style?: React.CSSProperties;
}

export default function VButton({
  children,
  onClick,
  variant = 'ink',
  size = 'md',
  disabled,
  type,
  full,
  style,
}: VButtonProps) {
  const [hovered, setHovered] = useState(false);

  const pad = size === 'lg' ? '16px 32px' : size === 'sm' ? '9px 16px' : '13px 26px';
  const fs = size === 'lg' ? 13.5 : size === 'sm' ? 11.5 : 12.5;

  const variantStyles: Record<Variant, React.CSSProperties> = {
    ink: { background: hovered ? V.brick : V.ink, color: V.cream },
    gold: { background: hovered ? '#c9871f' : V.saf, color: V.ink },
    outline: {
      background: hovered ? V.ink : 'transparent',
      color: hovered ? V.cream : V.ink,
      boxShadow: `inset 0 0 0 1.5px ${V.ink}`,
    },
    ghost: { background: 'transparent', color: V.ink, boxShadow: `inset 0 0 0 1px ${V.line}` },
  };

  return (
    <button
      type={type || 'button'}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: V.sans,
        fontSize: fs,
        fontWeight: 700,
        letterSpacing: '.04em',
        textTransform: 'uppercase',
        padding: pad,
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        borderRadius: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
        width: full ? '100%' : 'auto',
        transition: 'background .16s, color .16s, box-shadow .16s, transform .08s',
        opacity: disabled ? 0.4 : 1,
        transform: hovered && !disabled ? 'translateY(-1px)' : 'none',
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}
