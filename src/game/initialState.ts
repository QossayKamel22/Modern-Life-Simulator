import type { Character, GameState, Player } from "@/types/game";
import { INITIAL_TIME } from "@/game/time";

export function createInitialGameState(player: Player, character: Character): GameState {
  return {
    player,
    character,
    career: {
      trackId: null,
      levelIndex: 0,
      experienceHours: 0,
      employedSince: null,
      lastPayday: null,
    },
    finances: {
      cash: 5000,
      bank: 15000,
      transactions: [],
    },
    properties: [],
    vehicles: [],
    activeVehicleListingId: null,
    creator: {
      channels: [],
    },
    fitness: {
      fitnessLevel: 20,
      strength: 20,
      energy: 100,
      health: 80,
    },
    city: {
      currentCityId: "dubai",
    },
    time: INITIAL_TIME,
    events: [],
    currentActivity: "idle",
    achievements: [],
    version: 1,
  };
}

export function createDefaultCharacter(name: string): Character {
  return {
    name,
    age: 24,
    gender: "male",
    hairstyle: "short",
    hairColor: "black",
    beard: "none",
    bodyType: "average",
    clothing: "casual",
    accessories: [],
  };
}
