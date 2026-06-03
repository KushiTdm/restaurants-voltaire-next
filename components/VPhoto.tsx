import React from 'react';
import { GRAIN } from '@/lib/tokens';

interface VPhotoProps {
  src?: string;
  alt?: string;
  from?: string;
  to?: string;
  caption?: string;
  tag?: string;
  deg?: number;
  overlay?: number;
  /** if true, the inner image layer is rendered slightly larger and tagged
      with data-fx="parallax" so ScrollFx can translate it on scroll. */
  parallax?: boolean;
  parallaxAmount?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export default function VPhoto({
  src,
  alt,
  from = '#E0992E',
  to = '#8C3B2B',
  caption,
  tag,
  deg = 150,
  overlay,
  parallax,
  parallaxAmount,
  children,
  style,
  className,
}: VPhotoProps) {
  const gradient = `linear-gradient(${deg}deg, ${from}, ${to})`;
  const ov = overlay ?? 0.25;
  // The dark overlay sits between the image and the grain, so the caption
  // stays readable on bright photos.
  const overlayCss = `linear-gradient(${deg}deg, rgba(22,20,18,${ov}), rgba(22,20,18,${ov * 0.55}))`;
  const imageCss = src ? `url("${src}") center / cover no-repeat` : '';

  return (
    <div
      className={className}
      role={src ? 'img' : undefined}
      aria-label={src ? alt : undefined}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: gradient,
        ...style,
      }}
    >
      {src && (
        <div
          data-fx={parallax ? 'parallax' : undefined}
          data-fx-amount={parallax ? parallaxAmount ?? 40 : undefined}
          style={{
            position: 'absolute',
            inset: parallax ? '-12% 0' : 0,
            background: `${overlayCss}, ${imageCss}`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            willChange: parallax ? 'transform' : undefined,
          }}
        />
      )}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: GRAIN,
          backgroundSize: '160px',
          mixBlendMode: 'soft-light',
          opacity: 0.35,
          pointerEvents: 'none',
        }}
      />
      {tag && (
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 14,
            fontFamily: 'var(--font-sans)',
            fontSize: 9.5,
            fontWeight: 700,
            letterSpacing: '.18em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,.85)',
            textShadow: '0 1px 4px rgba(0,0,0,.4)',
            zIndex: 3,
          }}
        >
          ✶ {tag}
        </div>
      )}
      {caption && (
        <div
          style={{
            position: 'absolute',
            left: 16,
            bottom: 14,
            right: 16,
            fontFamily: 'var(--font-serif)',
            fontSize: 18,
            fontStyle: 'italic',
            color: 'rgba(255,255,255,.95)',
            textShadow: '0 1px 8px rgba(0,0,0,.45)',
            zIndex: 3,
          }}
        >
          {caption}
        </div>
      )}
      {children}
    </div>
  );
}
