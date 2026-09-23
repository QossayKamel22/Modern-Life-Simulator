// Core domain types for Modern Life Simulator.
// Game logic (src/game, src/lib/game) reads and writes these shapes.
// UI components should never mutate them directly — always go through the engine.

export type Gender = "male" | "female";

export interface Character {
  name: string;
  age: number;
  gender: Gender;
  hairstyle: string;
  hairColor: string;
  beard: string;
  bodyType: string;
  clothing: string;
  accessories: string[];
}

export interface GameTime {
  day: number;
  month: number; // 1-12
  year: number;
  hour: number; // 0-23
  minute: number;
}

export type ActivityId =
  | "work"
  | "sleep"
  | "gym"
  | "createContent"
  | "shopping"
  | "idle";

export interface CareerLevel {
  id: string;
  title: string;
  salary: number; // monthly, in AED
  experienceRequired: number; // hours worked to unlock
  workingHours: { start: number; end: number };
}

export interface CareerTrack {
  id: string;
  name: string;
  industry: string;
  cityIds: string[];
  levels: CareerLevel[];
}

export interface CareerState {
  trackId: string | null;
  levelIndex: number;
  experienceHours: number;
  employedSince: GameTime | null;
  lastPayday: GameTime | null;
}

export type TransactionType = "income" | "expense";

export type IncomeCategory = "salary" | "creator" | "rental" | "side" | "other";
export type ExpenseCategory =
  | "rent"
  | "food"
  | "transportation"
  | "fuel"
  | "insurance"
  | "maintenance"
  | "gym"
  | "entertainment"
  | "property"
  | "other";

export interface Transaction {
  id: string;
  type: TransactionType;
  category: IncomeCategory | ExpenseCategory;
  amount: number;
  timestamp: GameTime;
  description: string;
}

export interface FinanceState {
  cash: number;
  bank: number;
  transactions: Transaction[];
}

export type PropertyType =
  | "studio"
  | "apartment"
  | "townhouse"
  | "villa"
  | "commercial"
  | "land";

export type PropertyCondition = "poor" | "fair" | "good" | "excellent";

export interface PropertyListing {
  id: string;
  name: string;
  cityId: string;
  type: PropertyType;
  price: number;
  monthlyRent: number;
  sizeSqm: number;
  rooms: number;
  condition: PropertyCondition;
}

export interface PropertyCustomization {
  wallStyle: string;
  flooring: string;
  lighting: string;
  furniture: string[];
  interiorStyle: string;
}

export type PropertyOwnershipStatus = "owned" | "rentedOut" | "primaryResidence";

export interface OwnedProperty {
  listingId: string;
  purchasePrice: number;
  currentValue: number;
  status: PropertyOwnershipStatus;
  customization: PropertyCustomization;
  purchasedAt: GameTime;
  lastRentCollected: GameTime | null;
}

export type VehicleCondition = "poor" | "fair" | "good" | "excellent";

export type VehicleBodyStyle = "sedan" | "suv" | "coupe" | "hypercar";

export interface VehicleListing {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  fuelCostPerMonth: number;
  maintenanceCostPerMonth: number;
  insuranceCostPerMonth: number;
  performance: number; // 0-100
  defaultColor: string; // hex, used for the showroom default paint
  bodyStyle: VehicleBodyStyle; // drives the 3D showroom silhouette
}

export interface VehicleCustomization {
  color: string; // hex paint color
  wheels: string;
  suspension: string;
  interior: string;
}

export interface OwnedVehicle {
  listingId: string;
  purchasePrice: number;
  currentValue: number;
  condition: VehicleCondition;
  customization: VehicleCustomization;
  purchasedAt: GameTime;
}

export type ContentNiche =
  | "cars"
  | "realEstate"
  | "fitness"
  | "gaming"
  | "technology"
  | "vlogs"
  | "finance"
  | "lifestyle";

export interface Channel {
  id: string;
  name: string;
  niche: ContentNiche;
  followers: number;
  totalViews: number;
  engagement: number; // 0-1
  revenue: number; // lifetime
  videosPosted: number;
  createdAt: GameTime;
}

export interface CreatorState {
  channels: Channel[];
}

export interface FitnessState {
  fitnessLevel: number; // 0-100
  strength: number; // 0-100
  energy: number; // 0-100
  health: number; // 0-100
}

export interface CityData {
  id: string;
  name: string;
  country: string;
  costOfLivingIndex: number; // relative multiplier, 1.0 = baseline
  availableCareerTrackIds: string[];
}

export interface CityState {
  currentCityId: string;
}

export type GameEventType =
  | "promotion"
  | "unexpectedExpense"
  | "carBreakdown"
  | "viralVideo"
  | "jobOffer"
  | "propertyOpportunity"
  | "rentalVacancy"
  | "sponsorshipOffer";

export interface EventChoice {
  id: string;
  label: string;
  description: string;
}

export interface GameEvent {
  id: string;
  type: GameEventType;
  title: string;
  description: string;
  timestamp: GameTime;
  resolved: boolean;
  /** Present when the player must pick an outcome (e.g. repair vs. ignore a breakdown). */
  choices?: EventChoice[];
  chosenId?: string;
}

export interface Player {
  uid: string;
  displayName: string;
  createdAt: GameTime;
}

export interface GameState {
  player: Player;
  character: Character;
  career: CareerState;
  finances: FinanceState;
  properties: OwnedProperty[];
  vehicles: OwnedVehicle[];
  activeVehicleListingId: string | null;
  creator: CreatorState;
  fitness: FitnessState;
  city: CityState;
  time: GameTime;
  events: GameEvent[];
  currentActivity: ActivityId;
  achievements: string[];
  version: number;
}
