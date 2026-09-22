import type { ContentNiche } from "@/types/game";

export interface NicheData {
  id: ContentNiche;
  label: string;
  baseViewsPerFollower: number;
  volatility: number; // 0-1, higher = more random swings
}

export const CONTENT_NICHES: NicheData[] = [
  { id: "cars", label: "Cars", baseViewsPerFollower: 0.35, volatility: 0.4 },
  { id: "realEstate", label: "Real Estate", baseViewsPerFollower: 0.25, volatility: 0.25 },
  { id: "fitness", label: "Fitness", baseViewsPerFollower: 0.4, volatility: 0.3 },
  { id: "gaming", label: "Gaming", baseViewsPerFollower: 0.5, volatility: 0.5 },
  { id: "technology", label: "Technology", baseViewsPerFollower: 0.3, volatility: 0.3 },
  { id: "vlogs", label: "Vlogs", baseViewsPerFollower: 0.45, volatility: 0.45 },
  { id: "finance", label: "Finance", baseViewsPerFollower: 0.22, volatility: 0.2 },
  { id: "lifestyle", label: "Lifestyle", baseViewsPerFollower: 0.38, volatility: 0.35 },
];

export function getNicheData(id: ContentNiche): NicheData {
  return CONTENT_NICHES.find((n) => n.id === id)!;
}
