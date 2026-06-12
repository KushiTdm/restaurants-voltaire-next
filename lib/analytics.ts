// Lightweight client-only analytics mock — démontre la mécanique GA4
// (en production : gtag('event', name, payload) ou équivalent Plausible)

export interface AnalyticsEvent {
  event: string;
  payload?: Record<string, unknown>;
  ts: number;
}

const KEY = 'voltaire_events';
const MAX = 30;

export function track(event: string, payload?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  try {
    const list: AnalyticsEvent[] = JSON.parse(localStorage.getItem(KEY) || '[]');
    list.unshift({ event, payload, ts: Date.now() });
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
    (window as any).__voltaireEvents = list.slice(0, MAX);
    window.dispatchEvent(new CustomEvent('voltaire:track', { detail: { event, payload } }));
  } catch {}
}

export function readEvents(): AnalyticsEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function clearEvents() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(KEY);
    (window as any).__voltaireEvents = [];
    window.dispatchEvent(new CustomEvent('voltaire:track'));
  } catch {}
}
