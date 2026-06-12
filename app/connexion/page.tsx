'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import VButton from '@/components/VButton';
import VLabel from '@/components/VLabel';
import VIcon from '@/components/VIcon';
import { V } from '@/lib/tokens';
import { track } from '@/lib/analytics';

type Mode = 'login' | 'register';

const inputStyle: React.CSSProperties = {
  width: '100%',
  fontFamily: V.sans,
  fontSize: 15,
  padding: '12px 14px',
  border: `1.5px solid ${V.line}`,
  borderRadius: 0,
  outline: 'none',
  background: '#fff',
  color: V.ink,
  boxSizing: 'border-box',
};

export default function ConnexionPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    track(mode === 'login' ? 'login' : 'signup', { email });
    // Demo: store a mock session and redirect to account
    localStorage.setItem(
      'voltaire_user',
      JSON.stringify({ name: name || 'Marie D.', email, points: 240, since: '2024' })
    );
    router.push('/compte');
  };

  return (
    <div style={{ fontFamily: V.sans, color: V.ink, background: V.paper, minHeight: '100vh' }}>
      <div className="v-login-wrap" style={{ maxWidth: 480, margin: '0 auto', padding: '56px 24px 80px' }}>
        {/* header */}
        <div style={{ borderBottom: `2px solid ${V.ink}`, paddingBottom: 16, marginBottom: 36 }}>
          <VLabel>Espace client</VLabel>
          <h1
            style={{
              fontFamily: V.serif,
              fontSize: 'clamp(40px,6vw,60px)',
              lineHeight: 0.95,
              margin: '8px 0 0',
            }}
          >
            {mode === 'login' ? 'Connexion' : 'Créer un compte'}
          </h1>
        </div>

        {/* tab switcher */}
        <div
          style={{
            display: 'flex',
            borderBottom: `1.5px solid ${V.line}`,
            marginBottom: 28,
          }}
        >
          {(['login', 'register'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1,
                padding: '12px 0',
                background: 'transparent',
                border: 'none',
                borderBottom: `2.5px solid ${mode === m ? V.ink : 'transparent'}`,
                cursor: 'pointer',
                fontFamily: V.sans,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '.12em',
                textTransform: 'uppercase',
                color: mode === m ? V.ink : V.muted,
                transition: 'all .15s',
                marginBottom: -1.5,
              }}
            >
              {m === 'login' ? 'Se connecter' : 'Créer un compte'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {mode === 'register' && (
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: V.muted, marginBottom: 6 }}>
                  Prénom et nom
                </div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Marie Dupont"
                  style={inputStyle}
                  required
                />
              </div>
            )}
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: V.muted, marginBottom: 6 }}>
                Adresse e-mail
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.fr"
                style={inputStyle}
                required
              />
            </div>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: V.muted, marginBottom: 6 }}>
                Mot de passe
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
                required
              />
            </div>
          </div>

          {mode === 'register' && (
            <div
              style={{
                marginTop: 20,
                padding: '16px',
                background: '#fff',
                border: `1px solid ${V.line}`,
                fontSize: 13,
                color: V.muted,
                lineHeight: 1.6,
              }}
            >
              <span style={{ color: V.saf, fontWeight: 700 }}>✦ Programme fidélité</span>
              <br />
              En créant un compte, vous accédez à notre programme de points. Chaque repas vous rapporte des points convertibles en avantages.
            </div>
          )}

          <div style={{ marginTop: 24 }}>
            <VButton type="submit" variant="ink" full>
              {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}{' '}
              <VIcon name="arrow" size={14} />
            </VButton>
          </div>
        </form>

        <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid ${V.line}` }}>
          <p style={{ fontSize: 13, color: V.muted, textAlign: 'center' }}>
            {mode === 'login' ? "Pas encore client ?" : 'Déjà un compte ?'}{' '}
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: V.brick, fontWeight: 700, textDecoration: 'underline', fontSize: 13 }}
            >
              {mode === 'login' ? 'Créer un compte' : 'Se connecter'}
            </button>
          </p>
        </div>

        {/* demo hint */}
        <div style={{ marginTop: 24, padding: '12px 14px', background: `rgba(224,153,46,.08)`, border: `1px solid rgba(224,153,46,.3)`, fontSize: 12, color: V.muted }}>
          <strong style={{ color: V.saf }}>Démo :</strong> remplissez n&apos;importe quels champs et cliquez pour accéder à l&apos;espace client.
        </div>
      </div>
    </div>
  );
}
