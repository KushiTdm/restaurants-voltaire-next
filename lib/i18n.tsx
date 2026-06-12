'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type Lang = 'fr' | 'en';

type Dict = Record<string, { fr: string; en: string }>;

export const DICT: Dict = {
  // Nav
  'nav.carte': { fr: 'La carte', en: 'The menu' },
  'nav.compte': { fr: 'Mon compte', en: 'My account' },
  'nav.reserver': { fr: 'Réserver', en: 'Book' },
  'nav.lang': { fr: 'FR', en: 'EN' },

  // Hero
  'hero.tagline.left': { fr: 'Cantine — Paris XI', en: 'Cantine — Paris 11th' },
  'hero.tagline.mid': { fr: 'N°11 · Été', en: 'N°11 · Summer' },
  'hero.tagline.right': { fr: 'Mar–Sam · Midi & Soir', en: 'Tue–Sat · Lunch & Dinner' },
  'hero.edito.kicker': { fr: "L'édito · le chef", en: 'Editorial · The chef' },
  'hero.edito.title': {
    fr: "On cuisine ce que le marché décide. Vous, vous n'avez qu'à vous installer.",
    en: 'We cook what the market dictates. You — just settle in.',
  },
  'hero.edito.p1': {
    fr: "Boulevard Voltaire, une grande salle, des banquettes en velours et une carte qui tient sur une page — réécrite chaque matin.",
    en: 'Boulevard Voltaire, a wide room, velvet banquettes and a one-page menu — rewritten every morning.',
  },
  'hero.edito.p2': {
    fr: "Le midi file vite, le soir s'étire. On y vient seul au comptoir comme à douze autour d'une grande tablée.",
    en: 'Lunch goes fast, dinner stretches. Come solo at the counter or twelve around a big table.',
  },
  'hero.cta.book': { fr: 'Réserver une table', en: 'Book a table' },
  'hero.cta.menu': { fr: 'Lire la carte', en: 'See the menu' },
  'hero.photo.caption': { fr: 'Service du soir, salle comble', en: 'Evening service, room packed' },

  // Sommaire
  'home.sommaire.title': { fr: 'Le sommaire du jour', en: "Today's lineup" },
  'home.sommaire.all': { fr: 'Toute la carte', en: 'Full menu' },
  'home.sommaire.entrees': { fr: 'Pour commencer', en: 'To start' },
  'home.sommaire.plats': { fr: 'Les plats', en: 'Main courses' },
  'home.sommaire.desserts': { fr: 'La fin', en: 'The finale' },

  // Formule
  'home.formule.label': { fr: 'La formule du midi', en: 'Lunch menu' },
  'home.formule.sub': { fr: 'entrée · plat · café', en: 'starter · main · coffee' },
  'home.formule.desc': {
    fr: 'Servie tous les midis, du mardi au samedi. La carte courte du marché, dressée en moins de quarante-cinq minutes — chrono en main.',
    en: 'Every weekday lunch, Tue–Sat. The short market menu, served in under forty-five minutes — stopwatch in hand.',
  },
  'home.formule.cta': { fr: 'Réserver le midi', en: 'Book for lunch' },

  // Lieu
  'home.lieu.label': { fr: 'Le lieu', en: 'The room' },
  'home.lieu.title': {
    fr: 'Banquettes de velours, nappes blanches et le brouhaha des grands soirs.',
    en: 'Velvet banquettes, white tablecloths and the hum of full nights.',
  },

  // CTA strip
  'home.cta.label': { fr: 'Réservation', en: 'Booking' },
  'home.cta.title': { fr: 'Gardez-nous une chaise.', en: 'Save us a seat.' },
  'home.cta.button': { fr: 'Réserver une table', en: 'Book a table' },

  // Fidélité
  'home.fid.label': { fr: 'Programme fidélité', en: 'Loyalty program' },
  'home.fid.title': {
    fr: 'Chaque repas compte. Accumulez des points et débloquez des avantages exclusifs.',
    en: 'Every meal counts. Earn points and unlock exclusive perks.',
  },
  'home.fid.s1.v': { fr: '1€ = 1 pt', en: '1€ = 1 pt' },
  'home.fid.s1.l': { fr: 'Chaque dépense', en: 'Each spend' },
  'home.fid.s2.v': { fr: 'Café offert', en: 'Free coffee' },
  'home.fid.s2.l': { fr: 'Dès 100 pts', en: 'From 100 pts' },
  'home.fid.s3.v': { fr: 'Dessert offert', en: 'Free dessert' },
  'home.fid.s3.l': { fr: 'Dès 250 pts', en: 'From 250 pts' },
  'home.fid.s4.v': { fr: 'Dîner pour 2', en: 'Dinner for 2' },
  'home.fid.s4.l': { fr: 'Dès 1000 pts', en: 'From 1000 pts' },
  'home.fid.cta': { fr: 'Créer mon compte', en: 'Create my account' },

  // Footer
  'footer.lunch': { fr: 'Le midi', en: 'Lunch' },
  'footer.dinner': { fr: 'Le soir', en: 'Dinner' },
};

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fr');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('voltaire_lang') as Lang | null;
      if (stored === 'fr' || stored === 'en') setLangState(stored);
    } catch {}
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem('voltaire_lang', l); } catch {}
    if (typeof window !== 'undefined') {
      // GA4 mock — language change event
      (window as any).__voltaireEvents = (window as any).__voltaireEvents || [];
      (window as any).__voltaireEvents.push({ event: 'language_change', lang: l, ts: Date.now() });
    }
  };

  const t = (key: string) => DICT[key]?.[lang] ?? key;

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) return { lang: 'fr' as Lang, setLang: () => {}, t: (k: string) => DICT[k]?.fr ?? k };
  return ctx;
}
