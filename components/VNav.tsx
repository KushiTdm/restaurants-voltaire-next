'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { V } from '@/lib/tokens';
import { useI18n } from '@/lib/i18n';

export default function VNav() {
  const pathname = usePathname();
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

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

  const links: [string, string][] = [
    ['/carte', t('nav.carte')],
    ['/compte', t('nav.compte')],
  ];

  const LangSwitch = ({ mobile = false }: { mobile?: boolean }) => (
    <div
      style={{
        display: 'inline-flex',
        border: `1px solid ${V.line}`,
        background: '#fff',
        padding: 2,
        gap: 2,
      }}
    >
      {(['fr', 'en'] as const).map((code) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          style={{
            border: 'none',
            cursor: 'pointer',
            fontFamily: V.sans,
            fontSize: mobile ? 12 : 10.5,
            fontWeight: 700,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            padding: mobile ? '8px 14px' : '4px 8px',
            background: lang === code ? V.ink : 'transparent',
            color: lang === code ? V.cream : V.muted,
            transition: 'all .15s',
          }}
        >
          {code}
        </button>
      ))}
    </div>
  );

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
          gap: 12,
        }}
      >
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <span style={{ fontFamily: V.serif, fontSize: 22, color: V.ink, letterSpacing: '-0.01em' }}>
            Voltaire
          </span>
        </Link>

        {/* desktop links */}
        <div className="v-nav-links" style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {links.map(([href, label]) => (
            <Link key={href} href={href} style={linkStyle(href)}>
              {label}
            </Link>
          ))}
          <LangSwitch />
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
              {t('nav.reserver')}
            </span>
          </Link>
        </div>

        {/* mobile burger */}
        <button
          className="v-nav-burger"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          style={{
            display: 'none',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: 8,
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              position: 'relative',
              width: 22,
              height: 14,
              display: 'inline-block',
            }}
          >
            <span
              style={{
                position: 'absolute',
                left: 0,
                top: open ? 6 : 0,
                width: '100%',
                height: 2,
                background: V.ink,
                transform: open ? 'rotate(45deg)' : 'none',
                transition: 'transform .22s, top .22s',
              }}
            />
            <span
              style={{
                position: 'absolute',
                left: 0,
                top: 6,
                width: '100%',
                height: 2,
                background: V.ink,
                opacity: open ? 0 : 1,
                transition: 'opacity .15s',
              }}
            />
            <span
              style={{
                position: 'absolute',
                left: 0,
                top: open ? 6 : 12,
                width: '100%',
                height: 2,
                background: V.ink,
                transform: open ? 'rotate(-45deg)' : 'none',
                transition: 'transform .22s, top .22s',
              }}
            />
          </span>
        </button>
      </div>

      {/* mobile drawer */}
      <div
        className="v-nav-drawer"
        style={{
          display: 'none',
          position: 'fixed',
          top: 56,
          left: 0,
          right: 0,
          bottom: 0,
          background: V.paper,
          padding: '28px 24px 40px',
          transform: open ? 'translateY(0)' : 'translateY(-110%)',
          transition: 'transform .28s ease',
          zIndex: 49,
          flexDirection: 'column',
          gap: 4,
          overflowY: 'auto',
        }}
      >
        {links.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            style={{
              textDecoration: 'none',
              padding: '18px 0',
              borderBottom: `1px solid ${V.line}`,
              fontFamily: V.serif,
              fontSize: 30,
              color: pathname === href ? V.brick : V.ink,
            }}
          >
            {label}
          </Link>
        ))}
        <Link
          href="/reservation"
          style={{
            textDecoration: 'none',
            padding: '18px 0',
            borderBottom: `1px solid ${V.line}`,
            fontFamily: V.serif,
            fontSize: 30,
            color: pathname === '/reservation' ? V.brick : V.ink,
          }}
        >
          {t('nav.reserver')}
        </Link>
        <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 14 }}>
          <span
            style={{
              fontFamily: V.sans,
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              color: V.muted,
            }}
          >
            Langue · Language
          </span>
          <LangSwitch mobile />
        </div>
        <Link
          href="/reservation"
          style={{
            textDecoration: 'none',
            marginTop: 28,
            background: V.ink,
            color: V.cream,
            textAlign: 'center',
            padding: '16px 0',
            fontFamily: V.sans,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '.14em',
            textTransform: 'uppercase',
          }}
        >
          {t('nav.reserver')}
        </Link>
      </div>
    </nav>
  );
}
