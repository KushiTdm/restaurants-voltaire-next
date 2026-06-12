'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VButton from '@/components/VButton';
import VLabel from '@/components/VLabel';
import VIcon from '@/components/VIcon';
import { V } from '@/lib/tokens';
import { track, readEvents, clearEvents, type AnalyticsEvent } from '@/lib/analytics';

interface Prefs {
  allergies: string;
  regime: string;
  table: string;
  occasions: string;
}

interface Address {
  id: string;
  label: string;
  line: string;
  city: string;
  primary?: boolean;
}

interface User {
  name: string;
  email: string;
  phone?: string;
  points: number;
  since: string;
  prefs?: Prefs;
  addresses?: Address[];
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

const PROMOS_PERSO = [
  {
    code: 'ANNIV',
    label: 'Joyeux anniversaire 🎂',
    desc: 'Dessert offert sur votre prochain repas',
    expire: '30 juin 2026',
    tone: 'gold' as const,
  },
  {
    code: 'VOLTAIRE10',
    label: '−10% sur la note du soir',
    desc: 'Réservé aux fidèles — utilisable mardi à jeudi',
    expire: '15 juillet 2026',
    tone: 'brick' as const,
  },
];

const AUTOMATIONS = [
  { trigger: 'J-1 · 18h00', label: 'Rappel de réservation', target: 'bonjour@voltaire-paris.fr', enabled: true },
  { trigger: 'Après chaque visite', label: 'Demande d\'avis', target: 'Brevo · template "feedback"', enabled: true },
  { trigger: '−14 jours sans visite', label: 'Relance "on vous attend"', target: 'Brevo · segment "régulier"', enabled: true },
  { trigger: 'Anniversaire', label: 'Bon dessert offert', target: 'Code ANNIV envoyé J-7', enabled: true },
];

const TABS = [
  { id: 'points', label: 'Avantages' },
  { id: 'promos', label: 'Mes offres' },
  { id: 'historique', label: 'Historique' },
  { id: 'prefs', label: 'Préférences' },
  { id: 'profil', label: 'Profil' },
] as const;

type Tab = (typeof TABS)[number]['id'];

const inputStyle: React.CSSProperties = {
  width: '100%',
  fontFamily: V.sans,
  fontSize: 14.5,
  padding: '11px 14px',
  border: `1.5px solid ${V.line}`,
  borderRadius: 0,
  outline: 'none',
  background: '#fff',
  color: V.ink,
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  fontSize: 10.5,
  fontWeight: 700,
  letterSpacing: '.12em',
  textTransform: 'uppercase',
  color: V.muted,
  marginBottom: 6,
};

const DEFAULT_PREFS: Prefs = {
  allergies: 'Fruits de mer',
  regime: 'Aucun',
  table: 'Banquette',
  occasions: 'Anniversaire le 14 juin',
};

const DEFAULT_ADDR: Address[] = [
  { id: 'a1', label: 'Domicile', line: '24 rue de la Roquette', city: '75011 Paris', primary: true },
  { id: 'a2', label: 'Bureau', line: '8 place de la République', city: '75003 Paris' },
];

export default function ComptePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('points');
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [editPrefs, setEditPrefs] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('voltaire_user');
      const parsed: User = stored
        ? JSON.parse(stored)
        : { name: 'Marie D.', email: 'marie@exemple.fr', phone: '06 12 34 56 78', points: 330, since: '2024' };
      if (!parsed.prefs) parsed.prefs = DEFAULT_PREFS;
      if (!parsed.addresses) parsed.addresses = DEFAULT_ADDR;
      setUser(parsed);
    } catch {
      setUser({ name: 'Marie D.', email: 'marie@exemple.fr', phone: '06 12 34 56 78', points: 330, since: '2024', prefs: DEFAULT_PREFS, addresses: DEFAULT_ADDR });
    }
    setEvents(readEvents());
    const handler = () => setEvents(readEvents());
    window.addEventListener('voltaire:track', handler);
    return () => window.removeEventListener('voltaire:track', handler);
  }, []);

  useEffect(() => {
    track('account_tab_view', { tab: activeTab });
  }, [activeTab]);

  const savePrefs = (patch: Partial<Prefs>) => {
    if (!user) return;
    const next = { ...user, prefs: { ...(user.prefs || DEFAULT_PREFS), ...patch } };
    setUser(next);
    try { localStorage.setItem('voltaire_user', JSON.stringify(next)); } catch {}
  };

  const removeAddress = (id: string) => {
    if (!user) return;
    const next = { ...user, addresses: (user.addresses || []).filter((a) => a.id !== id) };
    setUser(next);
    try { localStorage.setItem('voltaire_user', JSON.stringify(next)); } catch {}
  };

  const logout = () => {
    localStorage.removeItem('voltaire_user');
    router.push('/');
  };

  if (!user) return null;

  const nextReward = AVANTAGES.find((a) => a.pts > user.points);
  const progressPct = nextReward
    ? Math.min((user.points / nextReward.pts) * 100, 100)
    : 100;

  const fmtTs = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div style={{ fontFamily: V.sans, color: V.ink, background: V.paper, minHeight: '100vh' }}>
      <div className="v-compte-wrap" style={{ maxWidth: 920, margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* header */}
        <div
          className="v-compte-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderBottom: `2px solid ${V.ink}`,
            paddingBottom: 16,
            marginBottom: 28,
            gap: 16,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <VLabel>Mon espace</VLabel>
            <h1
              style={{
                fontFamily: V.serif,
                fontSize: 'clamp(30px,5vw,52px)',
                lineHeight: 0.95,
                margin: '8px 0 0',
                wordBreak: 'break-word',
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
          className="v-compte-points"
          style={{
            background: V.ink,
            color: V.cream,
            padding: '28px 32px',
            marginBottom: 24,
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 24,
            alignItems: 'center',
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: V.saf }}>
              Solde de points
            </div>
            <div
              style={{ fontFamily: V.serif, fontSize: 'clamp(48px,8vw,76px)', lineHeight: 1, marginTop: 6 }}
            >
              {user.points} <span style={{ fontSize: 'clamp(18px,3vw,26px)', color: V.saf }}>pts</span>
            </div>
            {nextReward && (
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 12, color: 'rgba(242,234,219,.6)', marginBottom: 7 }}>
                  Plus que {nextReward.pts - user.points} pts pour : <strong style={{ color: V.saf }}>{nextReward.label}</strong>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,.15)' }}>
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
          <div className="v-compte-points-status" style={{ textAlign: 'center' }}>
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
          className="v-compte-tabs"
          style={{ display: 'flex', borderBottom: `1.5px solid ${V.line}`, marginBottom: 28, gap: 0 }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '12px 0',
                background: 'transparent',
                border: 'none',
                borderBottom: `2.5px solid ${activeTab === tab.id ? V.ink : 'transparent'}`,
                cursor: 'pointer',
                fontFamily: V.sans,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '.12em',
                textTransform: 'uppercase',
                color: activeTab === tab.id ? V.ink : V.muted,
                transition: 'all .15s',
                marginBottom: -1.5,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* tab: avantages */}
        {activeTab === 'points' && (
          <div>
            <p style={{ fontSize: 14, color: V.muted, marginBottom: 20 }}>
              Chaque euro dépensé chez Voltaire = 1 point. Débloquez des avantages exclusifs.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
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
                      onClick={() => track('reward_redeem', { reward: a.label, pts: a.pts })}
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

        {/* tab: promos / offres ciblées */}
        {activeTab === 'promos' && (
          <div>
            <p style={{ fontSize: 14, color: V.muted, marginBottom: 20 }}>
              Vos offres personnalisées — déclenchées par votre profil et votre historique.
            </p>
            <div
              className="v-compte-promos"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 32 }}
            >
              {PROMOS_PERSO.map((p) => (
                <div
                  key={p.code}
                  style={{
                    border: `1.5px solid ${p.tone === 'gold' ? V.saf : V.brick}`,
                    padding: '22px 22px 18px',
                    background: '#fff',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      letterSpacing: '.14em',
                      textTransform: 'uppercase',
                      color: p.tone === 'gold' ? V.saf : V.brick,
                      marginBottom: 8,
                    }}
                  >
                    Offre personnelle
                  </div>
                  <div style={{ fontFamily: V.serif, fontSize: 22, lineHeight: 1.15, marginBottom: 6 }}>
                    {p.label}
                  </div>
                  <p style={{ fontSize: 13, color: V.muted, lineHeight: 1.5, marginBottom: 14 }}>
                    {p.desc}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: `1px dashed ${V.line}`,
                      paddingTop: 12,
                      gap: 10,
                      flexWrap: 'wrap',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 10.5, color: V.muted, letterSpacing: '.1em', textTransform: 'uppercase' }}>
                        Code
                      </div>
                      <div style={{ fontFamily: V.serif, fontSize: 18, letterSpacing: '.08em' }}>{p.code}</div>
                    </div>
                    <div style={{ fontSize: 11.5, color: V.muted, textAlign: 'right' }}>
                      Expire le
                      <br />
                      <strong style={{ color: V.ink }}>{p.expire}</strong>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      track('promo_apply_from_account', { code: p.code });
                      router.push('/reservation');
                    }}
                    style={{
                      marginTop: 14,
                      width: '100%',
                      padding: '10px 0',
                      background: V.ink,
                      color: V.cream,
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: V.sans,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '.12em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Réserver avec ce code
                  </button>
                </div>
              ))}
            </div>

            <div style={{ borderTop: `1.5px solid ${V.line}`, paddingTop: 26 }}>
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
                Automatisations marketing
              </div>
              <p style={{ fontSize: 13.5, color: V.muted, marginBottom: 18, lineHeight: 1.6 }}>
                Les e-mails et SMS programmés sur votre compte. Tout est désactivable.
              </p>
              <div style={{ display: 'grid', gap: 10 }}>
                {AUTOMATIONS.map((a) => (
                  <div
                    key={a.label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '14px 16px',
                      background: '#fff',
                      border: `1px solid ${V.line}`,
                      gap: 12,
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ minWidth: 0, flex: '1 1 220px' }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{a.label}</div>
                      <div style={{ fontSize: 12, color: V.muted, marginTop: 2 }}>
                        {a.trigger} · <span style={{ fontStyle: 'italic' }}>{a.target}</span>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        letterSpacing: '.12em',
                        textTransform: 'uppercase',
                        color: a.enabled ? '#3f6b3a' : V.muted,
                        border: `1px solid ${a.enabled ? '#3f6b3a' : V.line}`,
                        padding: '4px 10px',
                      }}
                    >
                      {a.enabled ? 'Activé' : 'Désactivé'}
                    </span>
                  </div>
                ))}
              </div>
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
                className="v-compte-history-row"
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

        {/* tab: preferences */}
        {activeTab === 'prefs' && (
          <div>
            <p style={{ fontSize: 14, color: V.muted, marginBottom: 20 }}>
              Préférences personnelles — notre équipe en prend note pour chaque visite.
            </p>
            <div
              className="v-compte-prefs"
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}
            >
              {(
                [
                  ['allergies', 'Allergies / intolérances', 'Fruits de mer, gluten…'],
                  ['regime', 'Régime alimentaire', 'Aucun, végétarien, vegan…'],
                  ['table', 'Table préférée', 'Banquette, terrasse, comptoir…'],
                  ['occasions', 'Occasions à retenir', 'Anniversaire, dates clés…'],
                ] as [keyof Prefs, string, string][]
              ).map(([k, label, ph]) => (
                <div key={k}>
                  <div style={labelStyle}>{label}</div>
                  {editPrefs ? (
                    <input
                      value={user.prefs?.[k] || ''}
                      onChange={(e) => savePrefs({ [k]: e.target.value } as Partial<Prefs>)}
                      placeholder={ph}
                      style={inputStyle}
                    />
                  ) : (
                    <div
                      style={{
                        ...inputStyle,
                        background: 'transparent',
                        borderColor: V.line,
                        color: user.prefs?.[k] ? V.ink : 'rgba(22,20,18,.4)',
                      }}
                    >
                      {user.prefs?.[k] || ph}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 36 }}>
              <VButton
                variant={editPrefs ? 'ink' : 'outline'}
                size="sm"
                onClick={() => {
                  if (editPrefs) track('prefs_save');
                  setEditPrefs((v) => !v);
                }}
              >
                {editPrefs ? 'Enregistrer' : 'Modifier les préférences'}
              </VButton>
            </div>

            {/* adresses */}
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
              Mes adresses
            </div>
            <p style={{ fontSize: 13.5, color: V.muted, marginBottom: 16, lineHeight: 1.6 }}>
              Vos adresses sauvegardées — utilisées pour les commandes à emporter ou la facturation.
            </p>
            <div className="v-compte-adr" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12, marginBottom: 16 }}>
              {(user.addresses || []).map((a) => (
                <div
                  key={a.id}
                  style={{
                    padding: '16px 18px',
                    background: '#fff',
                    border: `1px solid ${a.primary ? V.ink : V.line}`,
                    position: 'relative',
                  }}
                >
                  {a.primary && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 12,
                        fontSize: 9.5,
                        fontWeight: 700,
                        letterSpacing: '.14em',
                        textTransform: 'uppercase',
                        color: V.saf,
                      }}
                    >
                      ✶ Principale
                    </span>
                  )}
                  <div
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      letterSpacing: '.12em',
                      textTransform: 'uppercase',
                      color: V.muted,
                      marginBottom: 6,
                    }}
                  >
                    {a.label}
                  </div>
                  <div style={{ fontSize: 14.5, lineHeight: 1.45 }}>
                    {a.line}
                    <br />
                    {a.city}
                  </div>
                  {!a.primary && (
                    <button
                      onClick={() => removeAddress(a.id)}
                      style={{
                        marginTop: 10,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: V.brick,
                        fontSize: 12,
                        fontWeight: 600,
                        padding: 0,
                        textDecoration: 'underline',
                      }}
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              ))}
            </div>
            <VButton variant="ghost" size="sm" onClick={() => track('address_add_click')}>
              + Ajouter une adresse
            </VButton>
          </div>
        )}

        {/* tab: profil */}
        {activeTab === 'profil' && (
          <div style={{ maxWidth: 520 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                ['Prénom et nom', user.name],
                ['E-mail', user.email],
                ['Téléphone', user.phone || '—'],
                ['Membre depuis', user.since],
              ].map(([label, value]) => (
                <div key={label}>
                  <div style={labelStyle}>{label}</div>
                  <div style={{ fontSize: 15.5, padding: '11px 14px', background: '#fff', border: `1.5px solid ${V.line}` }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24 }}>
              <VButton variant="ink" size="sm" onClick={() => track('profile_edit_click')}>
                Modifier mes informations
              </VButton>
            </div>

            {/* Analytics démo */}
            <div
              style={{
                marginTop: 36,
                padding: '20px 22px',
                background: '#fff',
                border: `1.5px solid ${V.line}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 8 }}>
                <div>
                  <div
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      letterSpacing: '.14em',
                      textTransform: 'uppercase',
                      color: V.saf,
                    }}
                  >
                    Analytics · démonstration GA4
                  </div>
                  <div style={{ fontFamily: V.serif, fontSize: 22, marginTop: 4 }}>
                    Vos événements en direct
                  </div>
                </div>
                <button
                  onClick={() => { clearEvents(); setEvents([]); }}
                  style={{
                    background: 'none',
                    border: `1px solid ${V.line}`,
                    cursor: 'pointer',
                    padding: '6px 10px',
                    fontSize: 11,
                    color: V.muted,
                    fontWeight: 600,
                  }}
                >
                  Effacer
                </button>
              </div>
              <p style={{ fontSize: 12.5, color: V.muted, marginBottom: 14, lineHeight: 1.55 }}>
                Chaque action (changement d&apos;onglet, langue, code promo, réservation) déclenche un événement.
                En production : envoyé à <strong>GA4</strong> ou <strong>Plausible</strong>.
              </p>
              {events.length === 0 ? (
                <div style={{ fontSize: 13, color: V.muted, fontStyle: 'italic', padding: '14px 0' }}>
                  Aucun événement encore — naviguez sur le site pour en générer.
                </div>
              ) : (
                <div style={{ maxHeight: 220, overflowY: 'auto', border: `1px solid ${V.line}` }}>
                  {events.slice(0, 12).map((ev, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        padding: '8px 12px',
                        borderBottom: i < events.length - 1 ? `1px solid ${V.line}` : 'none',
                        fontSize: 12,
                        gap: 8,
                        flexWrap: 'wrap',
                      }}
                    >
                      <span style={{ fontFamily: 'ui-monospace, Menlo, monospace', color: V.ink }}>
                        {ev.event}
                      </span>
                      <span style={{ color: V.muted, fontVariantNumeric: 'tabular-nums' }}>
                        {fmtTs(ev.ts)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              style={{
                marginTop: 24,
                padding: '16px',
                background: `rgba(224,153,46,.08)`,
                border: `1px solid rgba(224,153,46,.25)`,
                fontSize: 13,
                color: V.muted,
                lineHeight: 1.6,
              }}
            >
              <strong style={{ color: V.saf }}>RGPD</strong>
              <br />
              Vos données sont stockées chiffrées — vous pouvez à tout moment demander leur export ou
              leur suppression depuis cet écran.
            </div>
          </div>
        )}

        {/* footer nav */}
        <div className="v-compte-actions" style={{ marginTop: 40, paddingTop: 24, borderTop: `1.5px solid ${V.ink}`, display: 'flex', gap: 12 }}>
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
