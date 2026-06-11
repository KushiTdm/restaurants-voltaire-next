'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VButton from '@/components/VButton';
import VLabel from '@/components/VLabel';
import VIcon from '@/components/VIcon';
import { V } from '@/lib/tokens';

interface User {
  name: string;
  email: string;
  points: number;
  since: string;
}

const HISTORIQUE = [
  { ref: 'VOL-A4F2', date: '3 juin 2026', desc: 'Dîner · 2 couverts', montant: 68, pts: 68 },
  { ref: 'VOL-B7C1', date: '18 mai 2026', desc: 'Dîner · 4 couverts', montant: 142, pts: 142 },
  { ref: 'VOL-E3D9', date: '5 mai 2026', desc: 'Déjeuner · 2 couverts', montant: 44, pts: 44 },
  { ref: 'VOL-F1A0', date: '22 avr. 2026', desc: 'Dîner · 2 couverts', montant: 76, pts: 76 },
];

const AVANTAGES = [
  { pts: 100, label: 'Café offert', desc: 'À réclamer en fin de repas', unlocked: true },
  { pts: 250, label: 'Dessert offert', desc: 'Pour 2 personnes', unlocked: true },
  { pts: 500, label: '20€ de réduction', desc: 'Sur votre prochain repas', unlocked: false },
  { pts: 1000, label: 'Dîner pour 2 offert', desc: 'Entrée + plat + dessert', unlocked: false },
];

export default function ComptePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'points' | 'historique' | 'profil'>('points');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('voltaire_user');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser({ name: 'Marie D.', email: 'marie@exemple.fr', points: 330, since: '2024' });
      }
    } catch {
      setUser({ name: 'Marie D.', email: 'marie@exemple.fr', points: 330, since: '2024' });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('voltaire_user');
    router.push('/');
  };

  if (!user) return null;

  const nextReward = AVANTAGES.find((a) => a.pts > user.points);
  const progressPct = nextReward
    ? Math.min((user.points / nextReward.pts) * 100, 100)
    : 100;

  return (
    <div style={{ fontFamily: V.sans, color: V.ink, background: V.paper, minHeight: '100vh' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderBottom: `2px solid ${V.ink}`,
            paddingBottom: 16,
            marginBottom: 32,
          }}
        >
          <div>
            <VLabel>Mon espace</VLabel>
            <h1
              style={{
                fontFamily: V.serif,
                fontSize: 'clamp(34px,5vw,56px)',
                lineHeight: 0.95,
                margin: '8px 0 0',
              }}
            >
              Bonjour, {user.name.split(' ')[0]}.
            </h1>
            <p style={{ fontSize: 13, color: V.muted, marginTop: 6 }}>
              Client depuis {user.since} · {user.email}
            </p>
          </div>
          <VButton variant="ghost" size="sm" onClick={logout}>
            Déconnexion
          </VButton>
        </div>

        {/* points card */}
        <div
          style={{
            background: V.ink,
            color: V.cream,
            padding: '28px 32px',
            marginBottom: 32,
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 24,
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: V.saf }}>
              Solde de points
            </div>
            <div
              style={{ fontFamily: V.serif, fontSize: 'clamp(52px,8vw,80px)', lineHeight: 1, marginTop: 6 }}
            >
              {user.points} <span style={{ fontSize: 'clamp(20px,3vw,28px)', color: V.saf }}>pts</span>
            </div>
            {nextReward && (
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 12, color: 'rgba(242,234,219,.6)', marginBottom: 7 }}>
                  Plus que {nextReward.pts - user.points} pts pour : <strong style={{ color: V.saf }}>{nextReward.label}</strong>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,.15)', borderRadius: 0 }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${progressPct}%`,
                      background: V.saf,
                      transition: 'width 1s ease',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(242,234,219,.5)', marginBottom: 8 }}>
              Statut
            </div>
            <div
              style={{
                padding: '8px 18px',
                border: `1.5px solid ${V.saf}`,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '.1em',
                color: V.saf,
              }}
            >
              {user.points >= 500 ? 'FIDÈLE' : user.points >= 200 ? 'RÉGULIER' : 'NOUVEAU'}
            </div>
          </div>
        </div>

        {/* tabs */}
        <div
          style={{ display: 'flex', borderBottom: `1.5px solid ${V.line}`, marginBottom: 28 }}
        >
          {([['points', 'Avantages'], ['historique', 'Historique'], ['profil', 'Profil']] as [typeof activeTab, string][]).map(
            ([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: '12px 0',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `2.5px solid ${activeTab === tab ? V.ink : 'transparent'}`,
                  cursor: 'pointer',
                  fontFamily: V.sans,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '.12em',
                  textTransform: 'uppercase',
                  color: activeTab === tab ? V.ink : V.muted,
                  transition: 'all .15s',
                  marginBottom: -1.5,
                }}
              >
                {label}
              </button>
            )
          )}
        </div>

        {/* tab: avantages */}
        {activeTab === 'points' && (
          <div>
            <p style={{ fontSize: 14, color: V.muted, marginBottom: 20 }}>
              Chaque euro dépensé chez Voltaire = 1 point. Débloquez des avantages exclusifs.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
              {AVANTAGES.map((a) => (
                <div
                  key={a.pts}
                  style={{
                    padding: '20px',
                    border: `1.5px solid ${a.unlocked ? V.ink : V.line}`,
                    background: a.unlocked ? '#fff' : 'transparent',
                    opacity: a.unlocked ? 1 : 0.55,
                    position: 'relative',
                  }}
                >
                  {a.unlocked && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        width: 20,
                        height: 20,
                        background: V.saf,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        color: V.ink,
                        fontWeight: 700,
                      }}
                    >
                      ✓
                    </div>
                  )}
                  <div
                    style={{
                      fontFamily: V.sans,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '.14em',
                      textTransform: 'uppercase',
                      color: V.saf,
                      marginBottom: 8,
                    }}
                  >
                    {a.pts} pts
                  </div>
                  <div style={{ fontFamily: V.serif, fontSize: 20, marginBottom: 4 }}>{a.label}</div>
                  <div style={{ fontSize: 12.5, color: V.muted }}>{a.desc}</div>
                  {a.unlocked && (
                    <button
                      style={{
                        marginTop: 14,
                        width: '100%',
                        padding: '9px 0',
                        background: V.ink,
                        color: V.cream,
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: V.sans,
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '.08em',
                      }}
                    >
                      Utiliser
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* tab: historique */}
        {activeTab === 'historique' && (
          <div>
            <p style={{ fontSize: 14, color: V.muted, marginBottom: 20 }}>
              Vos repas chez Voltaire — chaque dépense génère des points automatiquement.
            </p>
            {HISTORIQUE.map((h) => (
              <div
                key={h.ref}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 0',
                  borderBottom: `1px solid ${V.line}`,
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontFamily: V.serif, fontSize: 18 }}>{h.desc}</div>
                  <div style={{ fontSize: 12, color: V.muted, marginTop: 2 }}>
                    {h.date} · <span style={{ letterSpacing: '.08em' }}>RÉF. {h.ref}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{h.montant}€</div>
                  <div style={{ fontSize: 12, color: V.saf, marginTop: 2 }}>+{h.pts} pts</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* tab: profil */}
        {activeTab === 'profil' && (
          <div style={{ maxWidth: 480 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                ['Prénom et nom', user.name],
                ['E-mail', user.email],
                ['Membre depuis', user.since],
              ].map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: V.muted, marginBottom: 6 }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 15.5, padding: '11px 14px', background: '#fff', border: `1.5px solid ${V.line}` }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24 }}>
              <VButton variant="ink" size="sm">
                Modifier mes informations
              </VButton>
            </div>
            <div
              style={{
                marginTop: 28,
                padding: '16px',
                background: `rgba(224,153,46,.08)`,
                border: `1px solid rgba(224,153,46,.25)`,
                fontSize: 13,
                color: V.muted,
                lineHeight: 1.6,
              }}
            >
              <strong style={{ color: V.saf }}>Préférences</strong>
              <br />
              Allergies, régimes alimentaires, occasions spéciales — notre équipe en prend note
              pour personnaliser chaque visite.
            </div>
          </div>
        )}

        {/* footer nav */}
        <div style={{ marginTop: 40, paddingTop: 24, borderTop: `1.5px solid ${V.ink}`, display: 'flex', gap: 12 }}>
          <VButton variant="gold" onClick={() => router.push('/reservation')}>
            Réserver une table <VIcon name="arrow" size={14} />
          </VButton>
          <VButton variant="outline" onClick={() => router.push('/carte')}>
            Voir la carte
          </VButton>
        </div>
      </div>
    </div>
  );
}
