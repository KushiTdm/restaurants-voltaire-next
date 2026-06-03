'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import VButton from '@/components/VButton';
import VLabel from '@/components/VLabel';
import VIcon from '@/components/VIcon';
import { V } from '@/lib/tokens';
import { MENU, WINES, type DietTag, type MenuCat } from '@/lib/menu-data';

const CATS = [
  { id: 'tout', label: 'Tout' },
  { id: 'grignoter', label: 'À grignoter' },
  { id: 'entrees', label: 'Entrées' },
  { id: 'plats', label: 'Plats' },
  { id: 'desserts', label: 'Desserts' },
  { id: 'vins', label: 'Vins' },
];

const SECTIONS = [
  { id: 'grignoter' as MenuCat, num: 'I', head: 'À grignoter' },
  { id: 'entrees' as MenuCat, num: 'II', head: 'Entrées' },
  { id: 'plats' as MenuCat, num: 'III', head: 'Les plats' },
  { id: 'desserts' as MenuCat, num: 'IV', head: 'Desserts' },
];

const DIETS: { id: DietTag; label: string; icon: 'leaf' | 'spark' }[] = [
  { id: 'vege', label: 'Végétarien', icon: 'leaf' },
  { id: 'vegan', label: 'Vegan', icon: 'leaf' },
  { id: 'sansgluten', label: 'Sans gluten', icon: 'spark' },
  { id: 'signature', label: 'Signature', icon: 'spark' },
];

const TAGMETA: Record<DietTag, { label: string; c: string }> = {
  vege: { label: 'Végé', c: '#3f6b3a' },
  vegan: { label: 'Vegan', c: '#2f6b4f' },
  sansgluten: { label: 'Sans gluten', c: '#8a6a1f' },
  signature: { label: 'Signature', c: V.brick },
};

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: V.sans,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '.02em',
        cursor: 'pointer',
        padding: '8px 14px',
        borderRadius: 999,
        transition: 'all .15s',
        border: `1.5px solid ${active ? V.ink : V.line}`,
        background: active ? V.ink : 'transparent',
        color: active ? V.cream : V.ink,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      {children}
    </button>
  );
}

export default function CartePage() {
  const router = useRouter();
  const [cat, setCat] = useState('tout');
  const [diets, setDiets] = useState<Set<DietTag>>(new Set());
  const [q, setQ] = useState('');

  const toggleDiet = (id: DietTag) =>
    setDiets((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const match = (m: (typeof MENU)[0]) => {
    if (diets.size && ![...diets].every((d) => m.tags.includes(d))) return false;
    if (q.trim()) {
      const s = (m.n + ' ' + m.d).toLowerCase();
      if (!s.includes(q.toLowerCase().trim())) return false;
    }
    return true;
  };

  const showVins = cat === 'tout' || cat === 'vins';
  const visibleSections = SECTIONS
    .filter((s) => cat === 'tout' || cat === s.id)
    .map((s) => ({ ...s, items: MENU.filter((m) => m.cat === s.id && match(m)) }))
    .filter((s) => s.items.length);

  const winesMatch = !q.trim() || WINES.some((w) => (w.n + w.d).toLowerCase().includes(q.toLowerCase().trim()));
  const total = visibleSections.reduce((a, s) => a + s.items.length, 0);

  return (
    <div style={{ fontFamily: V.sans, color: V.ink, background: V.paper }}>
      {/* header */}
      <div className="v-carte-top" style={{ maxWidth: 1080, margin: '0 auto', padding: '28px 32px 0' }}>
        <div
          className="v-carte-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderBottom: `2px solid ${V.ink}`,
            paddingBottom: 16,
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <VLabel>L&apos;ardoise · réécrite chaque matin</VLabel>
            <h1
              data-fx="fade-up"
              data-fx-from-y="36"
              style={{
                fontFamily: V.serif,
                fontSize: 'clamp(48px,7vw,86px)',
                lineHeight: 0.95,
                margin: '8px 0 0',
              }}
            >
              La carte
            </h1>
          </div>
          <div
            style={{
              textAlign: 'right',
              fontFamily: V.sans,
              fontSize: 12,
              color: V.muted,
              lineHeight: 1.7,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                letterSpacing: '.14em',
                textTransform: 'uppercase',
                color: V.brick,
              }}
            >
              Mardi 2 juin
            </div>
            <div>Formule midi · 19€</div>
            <div>Service 12h–14h30 · 19h–23h</div>
          </div>
        </div>
      </div>

      {/* filter bar */}
      <div
        style={{
          position: 'sticky',
          top: 56,
          zIndex: 20,
          background: 'rgba(251,246,236,.94)',
          backdropFilter: 'blur(8px)',
          borderBottom: `1px solid ${V.line}`,
        }}
      >
        <div
          className="v-carte-filter"
          style={{
            maxWidth: 1080,
            margin: '0 auto',
            padding: '14px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div
            className="v-carte-filter-row"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {CATS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCat(c.id)}
                  style={{
                    fontFamily: V.sans,
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: '.02em',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    padding: '6px 12px',
                    color: cat === c.id ? V.ink : V.muted,
                    borderBottom: `2px solid ${cat === c.id ? V.brick : 'transparent'}`,
                    transition: 'color .15s',
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <div
              className="v-carte-search"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                border: `1.5px solid ${V.line}`,
                borderRadius: 999,
                padding: '7px 14px',
                minWidth: 200,
                background: '#fff',
              }}
            >
              <VIcon name="search" size={15} style={{ color: V.muted }} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher un plat…"
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontFamily: V.sans,
                  fontSize: 13,
                  width: '100%',
                  color: V.ink,
                }}
              />
              {q && (
                <button
                  onClick={() => setQ('')}
                  style={{
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: V.muted,
                    display: 'flex',
                  }}
                >
                  <VIcon name="close" size={13} />
                </button>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '.14em',
                textTransform: 'uppercase',
                color: V.muted,
                marginRight: 4,
              }}
            >
              Régime
            </span>
            {DIETS.map((d) => (
              <Chip key={d.id} active={diets.has(d.id)} onClick={() => toggleDiet(d.id)}>
                <VIcon name={d.icon} size={13} /> {d.label}
              </Chip>
            ))}
            {(diets.size > 0 || q) && (
              <button
                onClick={() => { setDiets(new Set()); setQ(''); setCat('tout'); }}
                style={{
                  marginLeft: 4,
                  fontFamily: V.sans,
                  fontSize: 12,
                  color: V.brick,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>
      </div>

      {/* dishes */}
      <div className="v-carte-wrap" style={{ maxWidth: 1080, margin: '0 auto', padding: '36px 32px 80px' }}>
        {visibleSections.map((s) => (
          <section key={s.id} data-fx="fade-up" style={{ marginBottom: 44 }}>
            <div className="v-carte-section-head" style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
              <span style={{ fontFamily: V.serif, fontSize: 34, color: V.saf }}>{s.num}</span>
              <h2 style={{ fontFamily: V.serif, fontSize: 'clamp(28px,4vw,36px)', margin: 0, lineHeight: 1 }}>{s.head}</h2>
              <span style={{ fontSize: 11, color: V.muted, fontWeight: 600 }}>
                {s.items.length} plat{s.items.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="v-carte-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 48px' }}>
              {s.items.map((m) => (
                <div
                  key={m.n}
                  style={{
                    padding: '16px 0',
                    borderTop: `1px solid ${V.line}`,
                    display: 'flex',
                    gap: 14,
                    alignItems: 'baseline',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 10,
                        flexWrap: 'wrap',
                      }}
                    >
                      <span style={{ fontFamily: V.serif, fontSize: 23, lineHeight: 1.1 }}>{m.n}</span>
                      {m.tags.map((t) => (
                        <span
                          key={t}
                          style={{
                            fontFamily: V.sans,
                            fontSize: 9.5,
                            fontWeight: 700,
                            letterSpacing: '.1em',
                            textTransform: 'uppercase',
                            color: TAGMETA[t].c,
                            border: `1px solid ${TAGMETA[t].c}`,
                            borderRadius: 999,
                            padding: '2px 7px',
                          }}
                        >
                          {TAGMETA[t].label}
                        </span>
                      ))}
                    </div>
                    <div
                      style={{
                        fontSize: 13.5,
                        lineHeight: 1.5,
                        color: V.muted,
                        marginTop: 5,
                        maxWidth: 460,
                      }}
                    >
                      {m.d}
                    </div>
                  </div>
                  <span style={{ fontFamily: V.serif, fontSize: 24, fontVariantNumeric: 'tabular-nums' }}>
                    {m.p}€
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* vins */}
        {showVins && winesMatch && diets.size === 0 && (
          <section
            data-fx="fade-up"
            className="v-carte-wines"
            style={{
              marginBottom: 20,
              background: V.ink,
              color: V.cream,
              padding: '36px 36px 30px',
            }}
          >
            <div className="v-carte-section-head" style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
              <span style={{ fontFamily: V.serif, fontSize: 34, color: V.saf }}>V</span>
              <h2 style={{ fontFamily: V.serif, fontSize: 'clamp(28px,4vw,36px)', margin: 0, lineHeight: 1 }}>
                La cave vivante
              </h2>
              <span
                style={{ fontSize: 11, color: 'rgba(242,234,219,.6)', fontWeight: 600 }}
              >
                verre · bouteille
              </span>
            </div>
            <div className="v-carte-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 48px' }}>
              {WINES.map((w) => (
                <div
                  key={w.n}
                  style={{
                    padding: '15px 0',
                    borderTop: '1px solid rgba(242,234,219,.18)',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 14,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: V.serif, fontSize: 21 }}>{w.n}</div>
                    <div
                      style={{ fontSize: 12.5, color: 'rgba(242,234,219,.6)', marginTop: 3 }}
                    >
                      {w.d}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                    <span style={{ fontFamily: V.serif, fontSize: 20, color: V.saf }}>{w.g}€</span>
                    <span style={{ fontSize: 12, color: 'rgba(242,234,219,.5)', margin: '0 6px' }}>
                      /
                    </span>
                    <span style={{ fontFamily: V.serif, fontSize: 20 }}>{w.b}€</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {total === 0 && cat !== 'vins' && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: V.muted }}>
            <div style={{ fontFamily: V.serif, fontSize: 32, color: V.ink }}>
              Rien à cette table.
            </div>
            <p style={{ fontSize: 14, marginTop: 8 }}>
              Aucun plat ne correspond à ces filtres.
            </p>
            <div style={{ marginTop: 18 }}>
              <VButton
                variant="outline"
                size="sm"
                onClick={() => { setDiets(new Set()); setQ(''); setCat('tout'); }}
              >
                Tout afficher
              </VButton>
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div style={{ background: V.ink, color: V.cream }}>
        <div
          data-fx="fade-up"
          className="v-carte-cta"
          style={{
            maxWidth: 1080,
            margin: '0 auto',
            padding: '48px 32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              fontFamily: V.serif,
              fontSize: 'clamp(28px,4vw,42px)',
              lineHeight: 1,
            }}
          >
            Cette carte vous ouvre l&apos;appétit&nbsp;?
          </div>
          <VButton variant="gold" size="lg" onClick={() => router.push('/reservation')}>
            Réserver une table <VIcon name="arrow" size={16} />
          </VButton>
        </div>
      </div>
    </div>
  );
}
