import type { CityData } from "@/types/game";

export const CITIES: CityData[] = [
  {
    id: "dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    costOfLivingIndex: 1.0,
    availableCareerTrackIds: [
      "software-engineering",
      "sales",
      "creative",
      "hospitality",
    ],
  },
  {
    id: "sharjah",
    name: "Sharjah",
    country: "United Arab Emirates",
    costOfLivingIndex: 0.75,
    availableCareerTrackIds: ["sales", "hospitality"],
  },
  {
    id: "ajman",
    name: "Ajman",
    country: "United Arab Emirates",
    costOfLivingIndex: 0.65,
    availableCareerTrackIds: ["hospitality"],
  },
  {
    id: "umm-al-quwain",
    name: "Umm Al Quwain",
    country: "United Arab Emirates",
    costOfLivingIndex: 0.55,
    availableCareerTrackIds: ["hospitality"],
  },
  {
    id: "riyadh",
    name: "Riyadh",
    country: "Saudi Arabia",
    costOfLivingIndex: 0.85,
    availableCareerTrackIds: ["software-engineering", "sales", "creative"],
  },
];

export function getCityById(id: string): CityData | undefined {
  return CITIES.find((c) => c.id === id);
}
