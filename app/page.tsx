'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import VPhoto from '@/components/VPhoto';
import VButton from '@/components/VButton';
import VLabel from '@/components/VLabel';
import VIcon from '@/components/VIcon';
import { V } from '@/lib/tokens';
import { MENU } from '@/lib/menu-data';
import { PHOTOS } from '@/lib/photos';

export default function HomePage() {
  const router = useRouter();
  const pick = (cat: string) => MENU.filter((m) => m.cat === cat).slice(0, 4);
  const cols: [string, string, ReturnType<typeof pick>][] = [
    ['I', 'Pour commencer', pick('entrees')],
    ['II', 'Les plats', pick('plats')],
    ['III', 'La fin', pick('desserts')],
  ];

  return (
    <div style={{ fontFamily: V.sans, color: V.ink }}>
      {/* hero */}
      <section className="v-section" style={{ maxWidth: 1180, margin: '0 auto', padding: '0 32px' }}>
        <div
          style={{
            textAlign: 'center',
            borderBottom: `2px solid ${V.ink}`,
            paddingBottom: 10,
            marginTop: 16,
          }}
        >
          <div
            className="v-hero-strip"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: V.sans,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '.18em',
              textTransform: 'uppercase',
              color: V.muted,
              paddingBottom: 16,
            }}
          >
            <span>Cantine — Paris XI</span>
            <span style={{ color: V.brick }}>N°11 · Été</span>
            <span>Mar–Sam · Midi &amp; Soir</span>
          </div>
          <div
            data-fx="hero-title"
            style={{
              fontFamily: V.serif,
              fontSize: 'clamp(64px, 15vw, 188px)',
              lineHeight: 0.9,
              letterSpacing: '-0.01em',
              willChange: 'transform',
            }}
          >
            Voltaire
          </div>
        </div>

        <div
          className="v-hero-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.15fr 1fr',
            gap: 0,
            borderBottom: `1.5px solid ${V.ink}`,
          }}
        >
          <div
            className="v-hero-text"
            style={{
              padding: '48px 44px 44px 0',
              borderRight: `1.5px solid ${V.ink}`,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <VLabel>L&apos;édito · le chef</VLabel>
            <h1
              data-fx="fade-up"
              style={{
                fontFamily: V.serif,
                fontSize: 'clamp(32px,5vw,64px)',
                lineHeight: 1.0,
                fontWeight: 400,
                margin: '16px 0 0',
                letterSpacing: '-0.01em',
              }}
            >
              On cuisine ce que le marché décide. Vous, vous n&apos;avez qu&apos;à vous installer.
            </h1>
            <div
              className="v-hero-paragraphs"
              data-fx-group
              data-fx-stagger="120"
              style={{
                marginTop: 26,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 28,
                fontSize: 14.5,
                lineHeight: 1.62,
                color: '#3a342c',
              }}
            >
              <p data-fx-item style={{ margin: 0 }}>
                Boulevard Voltaire, une grande salle, des banquettes en velours et une carte qui tient
                sur une page — réécrite chaque matin.
              </p>
              <p data-fx-item style={{ margin: 0 }}>
                Le midi file vite, le soir s&apos;étire. On y vient seul au comptoir comme à douze
                autour d&apos;une grande tablée.
              </p>
            </div>
            <div
              className="v-hero-ctas"
              style={{ marginTop: 'auto', paddingTop: 30, display: 'flex', gap: 12, flexWrap: 'wrap' }}
            >
              <VButton variant="ink" onClick={() => router.push('/reservation')}>
                Réserver une table
              </VButton>
              <VButton variant="outline" onClick={() => router.push('/carte')}>
                Lire la carte <VIcon name="arrow" size={15} />
              </VButton>
            </div>
          </div>
          <VPhoto
            className="v-hero-photo"
            src={PHOTOS.salle}
            alt="Salle du restaurant Voltaire un soir de service"
            from={V.saf}
            to={V.brick}
            caption="Service du soir, salle comble"
            tag="salle"
            overlay={0.18}
            parallax
            parallaxAmount={48}
            style={{ minHeight: 440 }}
          />
        </div>
      </section>

      {/* sommaire du jour */}
      <section
        className="v-sommaire"
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: '52px 32px',
          borderBottom: `1.5px solid ${V.ink}`,
        }}
      >
        <div
          className="v-sommaire-head"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 28,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <h2
            data-fx="fade-up"
            style={{
              fontFamily: V.serif,
              fontSize: 'clamp(32px,4vw,54px)',
              lineHeight: 1,
              margin: 0,
            }}
          >
            Le sommaire du jour
          </h2>
          <button
            onClick={() => router.push('/carte')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: V.sans,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              color: V.brick,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: 0,
            }}
          >
            Toute la carte <VIcon name="arrow" size={15} />
          </button>
        </div>
        <div className="v-sommaire-cols" data-fx-group data-fx-stagger="110" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0 }}>
          {cols.map(([num, head, rows], i) => (
            <div
              key={head}
              data-fx-item
              className="v-sommaire-col"
              style={{
                padding: i ? '0 0 0 28px' : '0 28px 0 0',
                borderLeft: i ? `1px solid ${V.line}` : 'none',
                marginLeft: i ? 28 : 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 14 }}>
                <span style={{ fontFamily: V.serif, fontSize: 30, color: V.saf }}>{num}</span>
                <VLabel color={V.ink}>{head}</VLabel>
              </div>
              {rows.map((m) => (
                <div
                  key={m.n}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 8,
                    padding: '9px 0',
                    borderTop: `1px solid ${V.line}`,
                  }}
                >
                  <span style={{ fontFamily: V.serif, fontSize: 18, lineHeight: 1.2 }}>{m.n}</span>
                  <span
                    style={{
                      flex: 1,
                      borderBottom: `1px dotted ${V.line}`,
                      transform: 'translateY(-5px)',
                    }}
                  />
                  <span style={{ fontWeight: 700, fontSize: 13.5, fontVariantNumeric: 'tabular-nums' }}>
                    {m.p}€
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* formule */}
      <section className="v-section" style={{ maxWidth: 1180, margin: '0 auto', padding: '0 32px' }}>
        <div
          className="v-formule"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            borderBottom: `1.5px solid ${V.ink}`,
          }}
        >
          <VPhoto
            className="v-formule-photo"
            src={PHOTOS.formule}
            alt="Plat de la formule du midi"
            from="#C9A86A"
            to={V.brick}
            tag="formule"
            deg={150}
            overlay={0.22}
            parallax
            parallaxAmount={36}
            style={{ minHeight: 380, borderRight: `1.5px solid ${V.ink}` }}
          />
          <div
            className="v-formule-text"
            style={{
              padding: '48px 0 48px 44px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <VLabel>La formule du midi</VLabel>
            <div
              data-fx="fade-up"
              data-fx-from-y="40"
              style={{
                fontFamily: V.serif,
                fontSize: 'clamp(72px,10vw,120px)',
                lineHeight: 0.9,
                margin: '8px 0 0',
              }}
            >
              19€
            </div>
            <div
              style={{
                fontFamily: V.serif,
                fontSize: 'clamp(24px,3vw,34px)',
                fontStyle: 'italic',
                color: V.brick,
                marginTop: 2,
              }}
            >
              entrée · plat · café
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.62, color: '#3a342c', maxWidth: 400, marginTop: 18 }}>
              Servie tous les midis, du mardi au samedi. La carte courte du marché, dressée en moins de
              quarante-cinq minutes — chrono en main.
            </p>
            <div style={{ marginTop: 24 }}>
              <VButton variant="gold" onClick={() => router.push('/reservation')}>
                Réserver le midi
              </VButton>
            </div>
          </div>
        </div>
      </section>

      {/* le lieu */}
      <section className="v-lieu" style={{ maxWidth: 1180, margin: '56px auto 0', padding: '0 32px' }}>
        <VPhoto
          className="v-lieu-photo"
          src={PHOTOS.lieu}
          alt="Banquettes et nappes blanches du restaurant"
          from={V.brick}
          to="#5e2417"
          tag="le lieu"
          overlay={0.45}
          parallax
          parallaxAmount={60}
          style={{ minHeight: 360, display: 'flex', alignItems: 'flex-end' }}
        >
          <div className="v-lieu-inner" data-fx="fade-up" style={{ position: 'relative', zIndex: 2, padding: 44 }}>
            <VLabel color="rgba(255,255,255,.78)">Le lieu</VLabel>
            <div
              style={{
                fontFamily: V.serif,
                fontSize: 'clamp(28px,4vw,46px)',
                color: '#fff',
                maxWidth: 620,
                lineHeight: 1.08,
                marginTop: 10,
                textShadow: '0 2px 18px rgba(0,0,0,.4)',
              }}
            >
              Banquettes de velours, nappes blanches et le brouhaha des grands soirs.
            </div>
          </div>
        </VPhoto>
      </section>

      {/* réservation */}
      <section style={{ background: V.ink, color: V.cream, marginTop: 56 }}>
        <div
          className="v-cta-strip"
          style={{
            maxWidth: 1180,
            margin: '0 auto',
            padding: '60px 32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 32,
            flexWrap: 'wrap',
          }}
        >
          <div data-fx="fade-up">
            <VLabel color={V.saf}>Réservation</VLabel>
            <div
              style={{
                fontFamily: V.serif,
                fontSize: 'clamp(34px,5vw,64px)',
                lineHeight: 1,
                marginTop: 8,
              }}
            >
              Gardez-nous une chaise.
            </div>
          </div>
          <VButton variant="gold" size="lg" onClick={() => router.push('/reservation')}>
            Réserver une table <VIcon name="arrow" size={16} />
          </VButton>
        </div>
      </section>

      {/* fidélité */}
      <section style={{ background: V.cream, borderTop: `1.5px solid ${V.ink}` }}>
        <div
          className="v-fidelite"
          style={{
            maxWidth: 1180,
            margin: '0 auto',
            padding: '48px 32px',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 32,
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: V.sans,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '.18em',
                textTransform: 'uppercase',
                color: V.saf,
                marginBottom: 10,
              }}
            >
              Programme fidélité
            </div>
            <div style={{ fontFamily: V.serif, fontSize: 'clamp(24px,3.5vw,40px)', lineHeight: 1.05 }}>
              Chaque repas compte. Accumulez des points et débloquez des avantages exclusifs.
            </div>
            <div className="v-fidelite-stats" style={{ display: 'flex', gap: 32, marginTop: 20 }}>
              {[
                ['1€ = 1 pt', 'Chaque dépense'],
                ['Café offert', 'Dès 100 pts'],
                ['Dessert offert', 'Dès 250 pts'],
                ['Dîner pour 2', 'Dès 1000 pts'],
              ].map(([val, label]) => (
                <div key={val}>
                  <div style={{ fontFamily: V.serif, fontSize: 22, color: V.saf }}>{val}</div>
                  <div style={{ fontFamily: V.sans, fontSize: 11.5, color: V.muted, marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
          <VButton variant="gold" size="lg" onClick={() => router.push('/connexion')}>
            Créer mon compte <VIcon name="arrow" size={15} />
          </VButton>
        </div>
      </section>

      {/* footer */}
      <footer
        className="v-footer"
        style={{
          background: V.cream,
          padding: '40px 48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: 40,
          borderTop: `1.5px solid ${V.ink}`,
        }}
      >
        <div style={{ maxWidth: 420 }}>
          <div style={{ fontFamily: V.serif, fontSize: 40, lineHeight: 1 }}>Voltaire</div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: '#4a4339', marginTop: 12 }}>
            112 boulevard Voltaire, 75011 Paris · 01 43 00 00 00 · bonjour@voltaire-paris.fr
          </p>
        </div>
        <div className="v-footer-hours" style={{ display: 'flex', gap: 48 }}>
          <div>
            <div
              style={{
                fontFamily: V.sans,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '.18em',
                textTransform: 'uppercase',
                color: 'rgba(22,20,18,.5)',
                marginBottom: 10,
              }}
            >
              Le midi
            </div>
            <div style={{ fontFamily: V.serif, fontSize: 22 }}>12h — 14h30</div>
          </div>
          <div>
            <div
              style={{
                fontFamily: V.sans,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '.18em',
                textTransform: 'uppercase',
                color: 'rgba(22,20,18,.5)',
                marginBottom: 10,
              }}
            >
              Le soir
            </div>
            <div style={{ fontFamily: V.serif, fontSize: 22 }}>19h — 23h00</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
