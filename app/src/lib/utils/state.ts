// app/src/lib/utils/state.ts
export const state = {
  getItem(key: string): string | null {
    if (typeof window === 'undefined') return null;
    const ls = window.localStorage;
    if (!ls || typeof ls.getItem !== 'function') return null;
    try { return ls.getItem(key); } catch { return null; }
  },
  setItem(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    const ls = window.localStorage;
    if (!ls || typeof ls.setItem !== 'function') return;
    try { ls.setItem(key, value); } catch {}
  },
  removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    const ls = window.localStorage;
    if (!ls || typeof ls.removeItem !== 'function') return;
    try { ls.removeItem(key); } catch {}
  },
};