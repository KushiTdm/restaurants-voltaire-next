'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VButton from '@/components/VButton';
import VLabel from '@/components/VLabel';
import VIcon from '@/components/VIcon';
import VPhoto from '@/components/VPhoto';
import { V } from '@/lib/tokens';
import { PHOTOS } from '@/lib/photos';
import { track } from '@/lib/analytics';

const STEPS = ['Couverts', 'Date & service', 'Heure', 'Vos coordonnées'];

const PROMOS: Record<string, { label: string; off: number }> = {
  VOLTAIRE10: { label: '−10% sur la note', off: 10 },
  BIENVENUE: { label: 'Coupe offerte', off: 0 },
  ANNIV: { label: 'Dessert offert', off: 0 },
};

const fmtDay = (d: Date) =>
  new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(d).replace('.', '');
const fmtFull = (d: Date) =>
  new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(d);

const SLOTS: Record<string, [string, boolean?][]> = {
  midi: [['12:00'], ['12:15'], ['12:30', true], ['12:45'], ['13:00'], ['13:15'], ['13:30'], ['13:45'], ['14:00']],
  soir: [['19:00'], ['19:15'], ['19:30'], ['19:45', true], ['20:00'], ['20:15'], ['20:30'], ['21:00'], ['21:30'], ['22:00']],
};

const DAYS = (() => {
  const t = new Date(2026, 5, 2);
  const out: { d: Date; closed: boolean }[] = [];
  for (let i = 0; i < 18; i++) {
    const d = new Date(t);
    d.setDate(t.getDate() + i);
    const dow = d.getDay();
    out.push({ d, closed: dow === 0 || dow === 1 });
  }
  return out;
})();

type Reservation = {
  party: number;
  dateIdx: number | null;
  service: string | null;
  time: string | null;
  first: string;
  last: string;
  phone: string;
  email: string;
  occasion: string;
  notes: string;
  promo: string;
  optIn: boolean;
};

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'block' }}>
      <div
        style={{
          fontFamily: V.sans,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '.12em',
          textTransform: 'uppercase',
          color: error ? V.brick : V.muted,
          marginBottom: 6,
        }}
      >
        {label}
        {error && (
          <span
            style={{
              textTransform: 'none',
              letterSpacing: 0,
              fontWeight: 500,
              marginLeft: 8,
            }}
          >
            · {error}
          </span>
        )}
      </div>
      {children}
    </label>
  );
}

const inputStyle = (error?: string): React.CSSProperties => ({
  width: '100%',
  fontFamily: V.sans,
  fontSize: 15,
  padding: '12px 14px',
  border: `1.5px solid ${error ? V.brick : V.line}`,
  borderRadius: 0,
  outline: 'none',
  background: '#fff',
  color: V.ink,
  boxSizing: 'border-box',
});

export default function ReservationPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [r, setR] = useState<Reservation>({
    party: 2,
    dateIdx: null,
    service: null,
    time: null,
    first: '',
    last: '',
    phone: '',
    email: '',
    occasion: 'Aucune',
    notes: '',
    promo: '',
    optIn: true,
  });
  const [touched, setTouched] = useState(false);
  const [ref] = useState(() => 'VOL-' + Math.random().toString(36).slice(2, 6).toUpperCase());
  const [done, setDone] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try { window.scrollTo({ top: 0 }); } catch {}
    track('reservation_step_view', { step });
  }, [step]);
  useEffect(() => {
    if (done) track('reservation_confirmed', { party: r.party, service: r.service, ref });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const promoValid = !!PROMOS[r.promo.trim().toUpperCase()];

  const set = (patch: Partial<Reservation>) => setR((x) => ({ ...x, ...patch }));

  const errs = {
    first: !r.first.trim() ? 'requis' : '',
    last: !r.last.trim() ? 'requis' : '',
    phone: !r.phone.trim() ? 'requis' : !/^[0-9 +.()-]{8,}$/.test(r.phone.trim()) ? 'numéro invalide' : '',
    email: !r.email.trim() ? 'requis' : !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(r.email.trim()) ? 'email invalide' : '',
  };

  const canProceed = [
    !!r.party,
    r.dateIdx !== null && !!r.service,
    !!r.time,
    !errs.first && !errs.last && !errs.phone && !errs.email,
  ][step];

  const next = () => {
    if (step === 3) {
      if (!canProceed) { setTouched(true); return; }
      setDone(true);
      return;
    }
    if (!canProceed) { setTouched(true); return; }
    setTouched(false);
    setStep((s) => s + 1);
  };

  const back = () => {
    if (step === 0) router.push('/');
    else { setTouched(false); setStep((s) => s - 1); }
  };

  const recap = [
    { k: 'Couverts', v: r.party ? (r.party === 9 ? '9 et +' : r.party + (r.party > 1 ? ' personnes' : ' personne')) : null },
    { k: 'Date', v: r.dateIdx !== null ? fmtFull(DAYS[r.dateIdx].d) : null },
    { k: 'Service', v: r.service ? (r.service === 'midi' ? 'Le midi' : 'Le soir') : null },
    { k: 'Heure', v: r.time },
    ...(promoValid ? [{ k: 'Code promo', v: r.promo.trim().toUpperCase() }] : []),
  ];

  if (done) {
    return (
      <div style={{ fontFamily: V.sans, color: V.ink, background: V.paper, minHeight: '100vh' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '56px 32px 90px', textAlign: 'center' }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 999,
              background: V.saf,
              color: V.ink,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
            }}
          >
            <VIcon name="check" size={30} stroke={2} />
          </div>
          <VLabel style={{ marginTop: 24, display: 'block', textAlign: 'center' }}>
            Réservation confirmée
          </VLabel>
          <h1
            style={{
              fontFamily: V.serif,
              fontSize: 'clamp(40px,6vw,68px)',
              lineHeight: 1,
              margin: '10px 0 0',
            }}
          >
            À très vite, {r.first || 'cher convive'}.
          </h1>
          <p
            style={{
              fontSize: 15.5,
              lineHeight: 1.6,
              color: V.muted,
              maxWidth: 480,
              margin: '16px auto 0',
            }}
          >
            Un e-mail de confirmation part à l&apos;instant. La maison vous garde la table 15 minutes&nbsp;: prévenez-nous d&apos;un retard, on s&apos;arrange toujours.
          </p>
          <div
            style={{
              background: '#fff',
              boxShadow: `inset 0 0 0 1.5px ${V.ink}`,
              textAlign: 'left',
              marginTop: 36,
              padding: '28px 32px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                borderBottom: `1.5px solid ${V.ink}`,
                paddingBottom: 14,
                marginBottom: 16,
              }}
            >
              <span style={{ fontFamily: V.serif, fontSize: 28 }}>Voltaire</span>
              <span
                style={{
                  fontFamily: V.sans,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '.12em',
                  color: V.brick,
                }}
              >
                RÉF. {ref}
              </span>
            </div>
            <div className="v-resa-success-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
              {[
                ['Au nom de', `${r.first} ${r.last}`],
                ['Couverts', recap[0].v],
                ['Date', recap[1].v],
                ['Service', `${recap[2].v} · ${r.time}`],
                ['Téléphone', r.phone],
                ['Occasion', r.occasion],
              ].map(([k, v]) => (
                <div key={k}>
                  <div
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      letterSpacing: '.12em',
                      textTransform: 'uppercase',
                      color: V.muted,
                    }}
                  >
                    {k}
                  </div>
                  <div
                    style={{
                      fontSize: 15.5,
                      marginTop: 3,
                      textTransform: k === 'Date' ? 'capitalize' : 'none',
                    }}
                  >
                    {v}
                  </div>
                </div>
              ))}
            </div>
            {r.notes && (
              <div
                style={{
                  marginTop: 16,
                  paddingTop: 14,
                  borderTop: `1px solid ${V.line}`,
                  fontSize: 13.5,
                  color: V.muted,
                  fontStyle: 'italic',
                }}
              >
                « {r.notes} »
              </div>
            )}
            {promoValid && (
              <div
                style={{
                  marginTop: 14,
                  padding: '10px 12px',
                  background: 'rgba(63,107,58,.08)',
                  border: '1px solid #3f6b3a',
                  color: '#3f6b3a',
                  fontSize: 12.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <VIcon name="check" size={13} />
                <span>
                  Code <strong>{r.promo.trim().toUpperCase()}</strong> appliqué ·{' '}
                  {PROMOS[r.promo.trim().toUpperCase()].label}
                </span>
              </div>
            )}
          </div>

          {r.optIn && (
            <div
              style={{
                marginTop: 24,
                padding: '18px 20px',
                background: '#fff',
                border: `1px solid ${V.line}`,
                textAlign: 'left',
                fontSize: 13,
                color: V.muted,
                lineHeight: 1.6,
              }}
            >
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: V.saf,
                  marginBottom: 8,
                }}
              >
                ✦ Automatisations programmées
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 6 }}>
                <VIcon name="check" size={13} stroke={2} />
                <span>E-mail de confirmation — <strong>à l&apos;instant</strong></span>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 6 }}>
                <span style={{ width: 13, textAlign: 'center', color: V.saf }}>•</span>
                <span>Rappel automatique — <strong>J-1, 18h00</strong></span>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ width: 13, textAlign: 'center', color: V.saf }}>•</span>
                <span>Demande d&apos;avis post-repas — <strong>J+1, 14h00</strong></span>
              </div>
            </div>
          )}
          <div
            style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              marginTop: 28,
              flexWrap: 'wrap',
            }}
          >
            <VButton variant="ink" onClick={() => router.push('/carte')}>
              Revoir la carte
            </VButton>
            <VButton variant="outline" onClick={() => router.push('/')}>
              Retour à l&apos;accueil
            </VButton>
          </div>
          <div
            style={{
              marginTop: 22,
              fontSize: 13,
              color: V.muted,
              display: 'flex',
              gap: 18,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <VIcon name="pin" size={14} /> 112 boulevard Voltaire, 75011
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <VIcon name="phone" size={14} /> 01 43 00 00 00
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={topRef} style={{ fontFamily: V.sans, color: V.ink, background: V.paper, minHeight: '100vh' }}>
      <div className="v-resa-wrap" style={{ maxWidth: 1080, margin: '0 auto', padding: '28px 32px 80px' }}>
        {/* header */}
        <div
          style={{
            borderBottom: `2px solid ${V.ink}`,
            paddingBottom: 16,
            marginBottom: 28,
          }}
        >
          <VLabel>Réservation</VLabel>
          <h1
            data-fx="fade-up"
            data-fx-from-y="32"
            style={{
              fontFamily: V.serif,
              fontSize: 'clamp(40px,6vw,68px)',
              lineHeight: 0.95,
              margin: '6px 0 18px',
            }}
          >
            Gardez-nous une chaise
          </h1>
          {/* stepper */}
          <div className="v-resa-stepper" style={{ display: 'flex', gap: 0, alignItems: 'center', flexWrap: 'wrap' }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: i <= step ? 1 : 0.4 }}>
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 999,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: V.sans,
                      fontSize: 11,
                      fontWeight: 700,
                      background: i < step ? V.ink : i === step ? V.saf : 'transparent',
                      color: i < step ? V.cream : V.ink,
                      boxShadow: i >= step ? `inset 0 0 0 1.5px ${i === step ? V.saf : V.line}` : 'none',
                    }}
                  >
                    {i < step ? <VIcon name="check" size={13} /> : i + 1}
                  </span>
                  <span style={{ fontFamily: V.sans, fontSize: 12, fontWeight: 600, letterSpacing: '.02em', color: V.ink }}>
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <span style={{ width: 28, height: 1.5, background: V.line, margin: '0 12px', display: 'inline-block' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="v-resa-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 48, alignItems: 'start' }}>
          {/* step content */}
          <div style={{ minHeight: 320 }}>
            {step === 0 && (
              <div>
                <h2 style={{ fontFamily: V.serif, fontSize: 34, margin: '0 0 4px' }}>
                  Vous serez combien&nbsp;?
                </h2>
                <p style={{ fontSize: 14.5, color: V.muted, margin: '0 0 24px' }}>
                  Choisissez le nombre de couverts.
                </p>
                <div className="v-resa-party" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <button
                      key={n}
                      onClick={() => set({ party: n })}
                      style={{
                        width: 64,
                        height: 64,
                        fontFamily: V.serif,
                        fontSize: 26,
                        cursor: 'pointer',
                        transition: 'all .14s',
                        border: `1.5px solid ${r.party === n ? V.ink : V.line}`,
                        background: r.party === n ? V.ink : '#fff',
                        color: r.party === n ? V.cream : V.ink,
                      }}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    className="v-resa-party-more"
                    onClick={() => set({ party: 9 })}
                    style={{
                      height: 64,
                      padding: '0 22px',
                      fontFamily: V.sans,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all .14s',
                      border: `1.5px solid ${r.party === 9 ? V.ink : V.line}`,
                      background: r.party === 9 ? V.ink : '#fff',
                      color: r.party === 9 ? V.cream : V.ink,
                    }}
                  >
                    9 et +
                  </button>
                </div>
                {r.party === 9 && (
                  <p
                    style={{
                      fontSize: 13.5,
                      color: V.brick,
                      marginTop: 18,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <VIcon name="phone" size={15} /> Pour les grandes tablées, appelez-nous au 01 43 00 00 00 — on privatise volontiers.
                  </p>
                )}
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 style={{ fontFamily: V.serif, fontSize: 34, margin: '0 0 4px' }}>
                  Quel jour, quel service&nbsp;?
                </h2>
                <p style={{ fontSize: 14.5, color: V.muted, margin: '0 0 20px' }}>
                  Nous sommes fermés dimanche et lundi.
                </p>
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    overflowX: 'auto',
                    paddingBottom: 10,
                    marginBottom: 26,
                  }}
                >
                  {DAYS.map((day, i) => (
                    <button
                      key={i}
                      disabled={day.closed}
                      onClick={() => set({ dateIdx: i })}
                      style={{
                        flexShrink: 0,
                        width: 62,
                        padding: '10px 0',
                        cursor: day.closed ? 'not-allowed' : 'pointer',
                        textAlign: 'center',
                        transition: 'all .14s',
                        border: `1.5px solid ${r.dateIdx === i ? V.ink : V.line}`,
                        background: r.dateIdx === i ? V.ink : day.closed ? 'transparent' : '#fff',
                        color: day.closed ? 'rgba(22,20,18,.25)' : r.dateIdx === i ? V.cream : V.ink,
                        opacity: day.closed ? 0.7 : 1,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          letterSpacing: '.06em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {fmtDay(day.d)}
                      </div>
                      <div
                        style={{
                          fontFamily: V.serif,
                          fontSize: 24,
                          lineHeight: 1.1,
                          marginTop: 2,
                        }}
                      >
                        {day.d.getDate()}
                      </div>
                      {day.closed && (
                        <div style={{ fontSize: 8.5, marginTop: 2 }}>fermé</div>
                      )}
                    </button>
                  ))}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '.12em',
                    textTransform: 'uppercase',
                    color: V.muted,
                    marginBottom: 10,
                  }}
                >
                  Service
                </div>
                <div
                  className="v-resa-service-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 12,
                    maxWidth: 460,
                  }}
                >
                  {[
                    ['midi', 'Le midi', '12h – 14h30'],
                    ['soir', 'Le soir', '19h – 23h'],
                  ].map(([id, t, h]) => (
                    <button
                      key={id}
                      onClick={() => set({ service: id, time: null })}
                      style={{
                        textAlign: 'left',
                        padding: '16px 18px',
                        cursor: 'pointer',
                        transition: 'all .14s',
                        border: `1.5px solid ${r.service === id ? V.ink : V.line}`,
                        background: r.service === id ? V.ink : '#fff',
                        color: r.service === id ? V.cream : V.ink,
                      }}
                    >
                      <div style={{ fontFamily: V.serif, fontSize: 24 }}>{t}</div>
                      <div style={{ fontSize: 12.5, opacity: 0.7, marginTop: 2 }}>{h}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 style={{ fontFamily: V.serif, fontSize: 34, margin: '0 0 4px' }}>
                  À quelle heure&nbsp;?
                </h2>
                <p style={{ fontSize: 14.5, color: V.muted, margin: '0 0 22px' }}>
                  {r.service === 'midi' ? 'Service du midi' : 'Service du soir'} ·{' '}
                  {r.dateIdx !== null ? fmtFull(DAYS[r.dateIdx].d) : ''}
                </p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', maxWidth: 520 }}>
                  {(SLOTS[r.service || 'midi'] || []).map(([t, full]) => (
                    <button
                      key={t}
                      disabled={!!full}
                      onClick={() => set({ time: t })}
                      style={{
                        padding: '12px 18px',
                        fontFamily: V.sans,
                        fontSize: 15,
                        fontWeight: 600,
                        cursor: full ? 'not-allowed' : 'pointer',
                        transition: 'all .14s',
                        border: `1.5px solid ${r.time === t ? V.ink : V.line}`,
                        background: r.time === t ? V.ink : full ? 'transparent' : '#fff',
                        color: full ? 'rgba(22,20,18,.3)' : r.time === t ? V.cream : V.ink,
                        textDecoration: full ? 'line-through' : 'none',
                      }}
                    >
                      {t}
                      {full && (
                        <span
                          style={{
                            display: 'block',
                            fontSize: 8.5,
                            fontWeight: 700,
                            letterSpacing: '.08em',
                            textTransform: 'uppercase',
                            textDecoration: 'none',
                          }}
                        >
                          complet
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 style={{ fontFamily: V.serif, fontSize: 34, margin: '0 0 4px' }}>
                  Vos coordonnées
                </h2>
                <p style={{ fontSize: 14.5, color: V.muted, margin: '0 0 24px' }}>
                  Pour confirmer et vous prévenir en cas d&apos;imprévu.
                </p>
                <div
                  className="v-resa-form-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 18,
                    maxWidth: 560,
                  }}
                >
                  <Field label="Prénom" error={touched ? errs.first : undefined}>
                    <input
                      value={r.first}
                      onChange={(e) => set({ first: e.target.value })}
                      style={inputStyle(touched ? errs.first : undefined)}
                    />
                  </Field>
                  <Field label="Nom" error={touched ? errs.last : undefined}>
                    <input
                      value={r.last}
                      onChange={(e) => set({ last: e.target.value })}
                      style={inputStyle(touched ? errs.last : undefined)}
                    />
                  </Field>
                  <Field label="Téléphone" error={touched ? errs.phone : undefined}>
                    <input
                      value={r.phone}
                      onChange={(e) => set({ phone: e.target.value })}
                      placeholder="06 12 34 56 78"
                      style={inputStyle(touched ? errs.phone : undefined)}
                    />
                  </Field>
                  <Field label="E-mail" error={touched ? errs.email : undefined}>
                    <input
                      value={r.email}
                      onChange={(e) => set({ email: e.target.value })}
                      placeholder="vous@exemple.fr"
                      style={inputStyle(touched ? errs.email : undefined)}
                    />
                  </Field>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Field label="Occasion (facultatif)">
                      <select
                        value={r.occasion}
                        onChange={(e) => set({ occasion: e.target.value })}
                        style={{ ...inputStyle(), appearance: 'none', cursor: 'pointer' }}
                      >
                        {['Aucune', 'Anniversaire', 'En amoureux', 'Entre amis', "Dîner d'affaires", 'Autre'].map(
                          (o) => <option key={o}>{o}</option>
                        )}
                      </select>
                    </Field>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Field label="Un mot pour la maison (facultatif)">
                      <textarea
                        value={r.notes}
                        onChange={(e) => set({ notes: e.target.value })}
                        rows={3}
                        placeholder="Allergies, poussette, table en terrasse…"
                        style={{ ...inputStyle(), resize: 'vertical', fontFamily: V.sans }}
                      />
                    </Field>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Field label="Code promo (facultatif)">
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <input
                          value={r.promo}
                          onChange={(e) => set({ promo: e.target.value.toUpperCase() })}
                          placeholder="VOLTAIRE10 · BIENVENUE · ANNIV"
                          style={{ ...inputStyle(), flex: '1 1 200px', textTransform: 'uppercase' }}
                        />
                        {r.promo && (
                          <div
                            style={{
                              padding: '12px 14px',
                              border: `1.5px solid ${promoValid ? '#3f6b3a' : V.brick}`,
                              background: promoValid ? 'rgba(63,107,58,.08)' : 'rgba(140,59,43,.06)',
                              color: promoValid ? '#3f6b3a' : V.brick,
                              fontSize: 13,
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                            }}
                          >
                            {promoValid ? (
                              <>
                                <VIcon name="check" size={13} />{' '}
                                {PROMOS[r.promo.trim().toUpperCase()].label}
                              </>
                            ) : (
                              'Code inconnu'
                            )}
                          </div>
                        )}
                      </div>
                    </Field>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label
                      style={{
                        display: 'flex',
                        gap: 10,
                        alignItems: 'flex-start',
                        cursor: 'pointer',
                        fontSize: 13.5,
                        color: V.muted,
                        lineHeight: 1.5,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={r.optIn}
                        onChange={(e) => set({ optIn: e.target.checked })}
                        style={{
                          width: 18,
                          height: 18,
                          marginTop: 2,
                          accentColor: V.ink,
                          flexShrink: 0,
                        }}
                      />
                      <span>
                        Je souhaite recevoir le rappel de réservation par e-mail (J-1) et les offres
                        saisonnières — désabonnement en 1 clic.
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* nav */}
            <div className="v-resa-actions v-resa-actions-reverse" style={{ display: 'flex', gap: 12, marginTop: 36, alignItems: 'center' }}>
              <VButton variant="ghost" onClick={back}>
                <VIcon name="arrowLeft" size={15} /> {step === 0 ? 'Annuler' : 'Retour'}
              </VButton>
              <VButton
                variant={canProceed ? 'ink' : 'ghost'}
                onClick={next}
                style={!canProceed ? { opacity: 0.55 } : undefined}
              >
                {step === 3 ? 'Confirmer la réservation' : 'Continuer'}{' '}
                <VIcon name="arrow" size={15} />
              </VButton>
            </div>
          </div>

          {/* sidebar */}
          <aside className="v-resa-aside" style={{ position: 'sticky', top: 88 }}>
            <VPhoto
              className="v-resa-photo"
              src={PHOTOS.table}
              alt="Table dressée à la maison Voltaire"
              from={V.saf}
              to={V.brick}
              caption="Votre table vous attend"
              tag="salle"
              overlay={0.28}
              parallax
              parallaxAmount={26}
              style={{ height: 150 }}
            />
            <div
              style={{
                background: '#fff',
                boxShadow: `inset 0 0 0 1.5px ${V.ink}`,
                padding: '22px 24px',
              }}
            >
              <div
                style={{
                  fontFamily: V.serif,
                  fontSize: 22,
                  borderBottom: `1px solid ${V.line}`,
                  paddingBottom: 12,
                  marginBottom: 14,
                }}
              >
                Votre réservation
              </div>
              {recap.map((x) => (
                <div
                  key={x.k}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    padding: '8px 0',
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      color: V.muted,
                    }}
                  >
                    {x.k}
                  </span>
                  <span
                    style={{
                      fontSize: 14.5,
                      textAlign: 'right',
                      textTransform: x.k === 'Date' ? 'capitalize' : 'none',
                      color: x.v ? V.ink : 'rgba(22,20,18,.3)',
                    }}
                  >
                    {x.v || '—'}
                  </span>
                </div>
              ))}
              <div
                style={{
                  marginTop: 14,
                  paddingTop: 14,
                  borderTop: `1px solid ${V.line}`,
                  fontSize: 12.5,
                  color: V.muted,
                  lineHeight: 1.6,
                }}
              >
                112 bd Voltaire, 75011 Paris · table gardée 15 min.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
