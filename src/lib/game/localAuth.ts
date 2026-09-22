// Fallback "auth" used only when Firebase env vars are not configured, so the
// game is still playable locally during development. Not used once Firebase is set up.

const UID_KEY = "mls_local_uid";
const NAME_KEY = "mls_local_name";

export function getOrCreateLocalUser(displayName?: string): { uid: string; displayName: string } {
  if (typeof window === "undefined") return { uid: "guest", displayName: displayName ?? "Guest" };
  let uid = window.localStorage.getItem(UID_KEY);
  if (!uid) {
    uid = `local_${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(UID_KEY, uid);
  }
  let name = window.localStorage.getItem(NAME_KEY);
  if (displayName) {
    name = displayName;
    window.localStorage.setItem(NAME_KEY, displayName);
  }
  return { uid, displayName: name ?? "Player" };
}

export function clearLocalUser(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(UID_KEY);
  window.localStorage.removeItem(NAME_KEY);
}
