'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { V } from '@/lib/tokens';

export default function VNav() {
  const pathname = usePathname();

  const linkStyle = (path: string): React.CSSProperties => ({
    textDecoration: 'none',
    fontFamily: V.sans,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '.14em',
    textTransform: 'uppercase',
    color: pathname === path ? V.ink : V.muted,
    borderBottom: pathname === path ? `2px solid ${V.brick}` : '2px solid transparent',
    paddingBottom: 2,
    transition: 'color .15s',
  });

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(251,246,236,.96)',
        backdropFilter: 'blur(8px)',
        borderBottom: `1.5px solid ${V.ink}`,
      }}
    >
      <div
        className="v-nav-inner"
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 56,
        }}
      >
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: V.serif, fontSize: 22, color: V.ink, letterSpacing: '-0.01em' }}>
            Voltaire
          </span>
        </Link>
        <div className="v-nav-links" style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          <Link href="/carte" style={linkStyle('/carte')}>
            La carte
          </Link>
          <Link href="/compte" style={linkStyle('/compte')}>
            Mon compte
          </Link>
          <Link href="/reservation" style={{ textDecoration: 'none' }}>
            <span
              className="v-nav-cta"
              style={{
                fontFamily: V.sans,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                color: V.cream,
                background: V.ink,
                padding: '10px 22px',
                display: 'inline-block',
              }}
            >
              Réserver
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
