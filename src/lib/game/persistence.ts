import type { GameState } from "@/types/game";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { loadGameState, saveGameState } from "@/lib/firebase/firestore";

const LOCAL_KEY_PREFIX = "mls_save_";

export async function loadSave(uid: string): Promise<GameState | null> {
  if (isFirebaseConfigured) return loadGameState(uid);
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(LOCAL_KEY_PREFIX + uid);
  return raw ? (JSON.parse(raw) as GameState) : null;
}

export async function persistSave(uid: string, state: GameState): Promise<void> {
  if (isFirebaseConfigured) {
    await saveGameState(uid, state);
    return;
  }
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCAL_KEY_PREFIX + uid, JSON.stringify(state));
}
