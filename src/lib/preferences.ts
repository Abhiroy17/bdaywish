const key = 'birthday-music-muted';

export function readMuted(): boolean {
  try { return window.localStorage.getItem(key) !== 'false'; } catch { return true; }
}

export function saveMuted(muted: boolean): void {
  try { window.localStorage.setItem(key, String(muted)); } catch { /* Private browsing must not block the birthday. */ }
}