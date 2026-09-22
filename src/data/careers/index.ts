import type { CareerTrack } from "@/types/game";

export const CAREER_TRACKS: CareerTrack[] = [
  {
    id: "software-engineering",
    name: "Software Engineering",
    industry: "Technology",
    cityIds: ["dubai", "riyadh"],
    levels: [
      {
        id: "junior-developer",
        title: "Junior Developer",
        salary: 9000,
        experienceRequired: 0,
        workingHours: { start: 9, end: 17 },
      },
      {
        id: "developer",
        title: "Developer",
        salary: 14000,
        experienceRequired: 480,
        workingHours: { start: 9, end: 17 },
      },
      {
        id: "senior-developer",
        title: "Senior Developer",
        salary: 22000,
        experienceRequired: 1600,
        workingHours: { start: 9, end: 17 },
      },
      {
        id: "tech-lead",
        title: "Tech Lead",
        salary: 32000,
        experienceRequired: 3200,
        workingHours: { start: 9, end: 18 },
      },
      {
        id: "engineering-manager",
        title: "Engineering Manager",
        salary: 45000,
        experienceRequired: 5600,
        workingHours: { start: 9, end: 18 },
      },
    ],
  },
  {
    id: "sales",
    name: "Sales",
    industry: "Business",
    cityIds: ["dubai", "sharjah", "riyadh"],
    levels: [
      {
        id: "sales-associate",
        title: "Sales Associate",
        salary: 6000,
        experienceRequired: 0,
        workingHours: { start: 9, end: 18 },
      },
      {
        id: "account-executive",
        title: "Account Executive",
        salary: 10000,
        experienceRequired: 480,
        workingHours: { start: 9, end: 18 },
      },
      {
        id: "sales-manager",
        title: "Sales Manager",
        salary: 18000,
        experienceRequired: 1600,
        workingHours: { start: 9, end: 19 },
      },
      {
        id: "director-of-sales",
        title: "Director of Sales",
        salary: 30000,
        experienceRequired: 3200,
        workingHours: { start: 9, end: 19 },
      },
    ],
  },
  {
    id: "creative",
    name: "Creative & Media",
    industry: "Media",
    cityIds: ["dubai", "riyadh"],
    levels: [
      {
        id: "junior-designer",
        title: "Junior Designer",
        salary: 7000,
        experienceRequired: 0,
        workingHours: { start: 10, end: 18 },
      },
      {
        id: "designer",
        title: "Designer",
        salary: 11000,
        experienceRequired: 480,
        workingHours: { start: 10, end: 18 },
      },
      {
        id: "senior-designer",
        title: "Senior Designer",
        salary: 17000,
        experienceRequired: 1600,
        workingHours: { start: 10, end: 18 },
      },
      {
        id: "creative-director",
        title: "Creative Director",
        salary: 28000,
        experienceRequired: 3200,
        workingHours: { start: 10, end: 19 },
      },
    ],
  },
  {
    id: "hospitality",
    name: "Hospitality",
    industry: "Hospitality",
    cityIds: ["dubai", "sharjah", "ajman", "umm-al-quwain"],
    levels: [
      {
        id: "front-desk",
        title: "Front Desk Associate",
        salary: 4500,
        experienceRequired: 0,
        workingHours: { start: 8, end: 16 },
      },
      {
        id: "supervisor",
        title: "Supervisor",
        salary: 7000,
        experienceRequired: 480,
        workingHours: { start: 8, end: 16 },
      },
      {
        id: "operations-manager",
        title: "Operations Manager",
        salary: 12000,
        experienceRequired: 1600,
        workingHours: { start: 8, end: 17 },
      },
      {
        id: "general-manager",
        title: "General Manager",
        salary: 20000,
        experienceRequired: 3200,
        workingHours: { start: 8, end: 18 },
      },
    ],
  },
];

export function getCareerTrackById(id: string): CareerTrack | undefined {
  return CAREER_TRACKS.find((t) => t.id === id);
}

export function getCareerTracksForCity(cityId: string): CareerTrack[] {
  return CAREER_TRACKS.filter((t) => t.cityIds.includes(cityId));
}
