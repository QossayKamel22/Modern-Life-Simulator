"use client";

import { create } from "zustand";
import type { Character, ContentNiche, GameState, Player, PropertyCustomization } from "@/types/game";
import { createInitialGameState } from "@/game/initialState";
import * as engine from "@/game/engine";
import { loadSave, persistSave } from "@/lib/game/persistence";

type Status = "idle" | "loading" | "ready" | "needsCharacter";

interface GameStore {
  uid: string | null;
  state: GameState | null;
  status: Status;
  lastMessage: string | null;
  init: (uid: string, displayName: string) => Promise<void>;
  createCharacter: (character: Character) => void;
  work: () => void;
  sleep: () => void;
  goToGym: () => void;
  applyForJob: (trackId: string) => void;
  resignFromJob: () => void;
  buyVehicle: (listingId: string) => void;
  sellVehicle: (listingId: string) => void;
  setActiveVehicle: (listingId: string) => void;
  customizeVehiclePaint: (listingId: string, color: string) => void;
  buyProperty: (listingId: string) => void;
  sellProperty: (listingId: string) => void;
  rentOutProperty: (listingId: string) => void;
  stopRentingProperty: (listingId: string) => void;
  renovateProperty: (listingId: string, customization: Partial<PropertyCustomization>) => void;
  createChannel: (name: string, niche: ContentNiche) => void;
  createContent: (channelId: string) => void;
  moveCity: (cityId: string) => void;
  reset: () => void;
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleSave(uid: string, state: GameState) {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    persistSave(uid, state).catch((err) => console.error("Autosave failed", err));
  }, 1200);
}

function applyResult(
  set: (partial: Partial<GameStore>) => void,
  get: () => GameStore,
  result: engine.ActionResult,
) {
  set({ state: result.state, lastMessage: result.message });
  const uid = get().uid;
  if (result.success && uid) scheduleSave(uid, result.state);
}

export const useGameStore = create<GameStore>((set, get) => ({
  uid: null,
  state: null,
  status: "idle",
  lastMessage: null,

  init: async (uid, displayName) => {
    set({ status: "loading", uid });
    const existing = await loadSave(uid);
    if (existing) {
      set({ state: existing, status: "ready" });
      return;
    }
    const player: Player = { uid, displayName, createdAt: { year: 1, month: 1, day: 1, hour: 8, minute: 0 } };
    set({ state: null, status: "needsCharacter", uid, lastMessage: null });
    void player;
  },

  createCharacter: (character) => {
    const uid = get().uid;
    if (!uid) return;
    const player: Player = {
      uid,
      displayName: character.name,
      createdAt: { year: 1, month: 1, day: 1, hour: 8, minute: 0 },
    };
    const state = createInitialGameState(player, character);
    set({ state, status: "ready", lastMessage: "Welcome to your new life." });
    scheduleSave(uid, state);
  },

  work: () => {
    const { state } = get();
    if (!state) return;
    applyResult(set, get, engine.work(state));
  },
  sleep: () => {
    const { state } = get();
    if (!state) return;
    applyResult(set, get, engine.sleep(state));
  },
  goToGym: () => {
    const { state } = get();
    if (!state) return;
    applyResult(set, get, engine.goToGym(state));
  },
  applyForJob: (trackId) => {
    const { state } = get();
    if (!state) return;
    applyResult(set, get, engine.applyForJob(state, trackId));
  },
  resignFromJob: () => {
    const { state } = get();
    if (!state) return;
    applyResult(set, get, engine.resignFromJob(state));
  },
  buyVehicle: (listingId) => {
    const { state } = get();
    if (!state) return;
    applyResult(set, get, engine.buyVehicle(state, listingId));
  },
  sellVehicle: (listingId) => {
    const { state } = get();
    if (!state) return;
    applyResult(set, get, engine.sellVehicle(state, listingId));
  },
  setActiveVehicle: (listingId) => {
    const { state } = get();
    if (!state) return;
    applyResult(set, get, engine.setActiveVehicle(state, listingId));
  },
  customizeVehiclePaint: (listingId, color) => {
    const { state } = get();
    if (!state) return;
    applyResult(set, get, engine.customizeVehiclePaint(state, listingId, color));
  },
  buyProperty: (listingId) => {
    const { state } = get();
    if (!state) return;
    applyResult(set, get, engine.buyProperty(state, listingId));
  },
  sellProperty: (listingId) => {
    const { state } = get();
    if (!state) return;
    applyResult(set, get, engine.sellProperty(state, listingId));
  },
  rentOutProperty: (listingId) => {
    const { state } = get();
    if (!state) return;
    applyResult(set, get, engine.rentOutProperty(state, listingId));
  },
  stopRentingProperty: (listingId) => {
    const { state } = get();
    if (!state) return;
    applyResult(set, get, engine.stopRentingProperty(state, listingId));
  },
  renovateProperty: (listingId, customization) => {
    const { state } = get();
    if (!state) return;
    applyResult(set, get, engine.renovateProperty(state, listingId, customization));
  },
  createChannel: (name, niche) => {
    const { state } = get();
    if (!state) return;
    applyResult(set, get, engine.createChannel(state, name, niche));
  },
  createContent: (channelId) => {
    const { state } = get();
    if (!state) return;
    applyResult(set, get, engine.createContent(state, channelId));
  },
  moveCity: (cityId) => {
    const { state } = get();
    if (!state) return;
    applyResult(set, get, engine.moveCity(state, cityId));
  },

  reset: () => set({ uid: null, state: null, status: "idle", lastMessage: null }),
}));
