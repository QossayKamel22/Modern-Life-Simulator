import type { GameState } from "@/types/game";
import { netWorth } from "@/game/finance";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  check: (state: GameState) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-job",
    title: "First Job",
    description: "Started your career.",
    check: (s) => s.career.trackId !== null,
  },
  {
    id: "first-paycheck",
    title: "First Paycheck",
    description: "Received your first salary.",
    check: (s) => s.finances.transactions.some((t) => t.category === "salary"),
  },
  {
    id: "promoted",
    title: "Moving Up",
    description: "Earned a promotion.",
    check: (s) => s.events.some((e) => e.type === "promotion"),
  },
  {
    id: "first-wheels",
    title: "First Wheels",
    description: "Bought your first vehicle.",
    check: (s) => s.vehicles.length > 0,
  },
  {
    id: "car-collector",
    title: "Car Collector",
    description: "Own 3 or more vehicles.",
    check: (s) => s.vehicles.length >= 3,
  },
  {
    id: "homeowner",
    title: "Homeowner",
    description: "Bought your first property.",
    check: (s) => s.properties.length > 0,
  },
  {
    id: "landlord",
    title: "Landlord",
    description: "Rented out a property.",
    check: (s) => s.properties.some((p) => p.status === "rentedOut"),
  },
  {
    id: "property-mogul",
    title: "Property Mogul",
    description: "Own 3 or more properties.",
    check: (s) => s.properties.length >= 3,
  },
  {
    id: "content-creator",
    title: "Content Creator",
    description: "Launched a channel.",
    check: (s) => s.creator.channels.length > 0,
  },
  {
    id: "viral-hit",
    title: "Viral Hit",
    description: "Had a video go viral.",
    check: (s) => s.events.some((e) => e.type === "viralVideo"),
  },
  {
    id: "gym-rat",
    title: "Gym Rat",
    description: "Reached 50 fitness level.",
    check: (s) => s.fitness.fitnessLevel >= 50,
  },
  {
    id: "six-figures",
    title: "Six Figures",
    description: "Net worth passed 1,000,000 AED.",
    check: (s) => netWorth(s) >= 1_000_000,
  },
  {
    id: "multi-millionaire",
    title: "Multi-Millionaire",
    description: "Net worth passed 10,000,000 AED.",
    check: (s) => netWorth(s) >= 10_000_000,
  },
  {
    id: "well-traveled",
    title: "Well Traveled",
    description: "Moved to a different city.",
    check: (s) => s.city.currentCityId !== "dubai",
  },
];

export function checkNewAchievements(state: GameState): Achievement[] {
  const unlocked = new Set(state.achievements);
  return ACHIEVEMENTS.filter((a) => !unlocked.has(a.id) && a.check(state));
}
