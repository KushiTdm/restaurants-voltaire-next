import type { Metadata, Viewport } from 'next';
import { Instrument_Serif, Archivo } from 'next/font/google';
import VNav from '@/components/VNav';
import ScrollFx from '@/components/ScrollFx';
import { I18nProvider } from '@/lib/i18n';
import './globals.css';

const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Voltaire — Cantine Paris 11ᵉ',
  description: 'Table de jour et de nuit. Boulevard Voltaire, Paris XI.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${instrumentSerif.variable} ${archivo.variable}`}>
      <body
        style={{
          fontFamily: 'var(--font-sans), system-ui, sans-serif',
        }}
      >
        <I18nProvider>
          <VNav />
          {children}
          <ScrollFx />
        </I18nProvider>
      </body>
    </html>
  );
}
