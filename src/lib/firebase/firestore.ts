import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/config";
import type { GameState } from "@/types/game";

function gameStateDocRef(uid: string) {
  return doc(getFirebaseDb(), "users", uid, "gameState", "main");
}

export async function loadGameState(uid: string): Promise<GameState | null> {
  const snapshot = await getDoc(gameStateDocRef(uid));
  if (!snapshot.exists()) return null;
  return snapshot.data() as GameState;
}

export async function saveGameState(uid: string, state: GameState): Promise<void> {
  await setDoc(gameStateDocRef(uid), { ...state, updatedAt: serverTimestamp() });
}
