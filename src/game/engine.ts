import type {
  GameState,
  OwnedProperty,
  OwnedVehicle,
  Channel,
  ContentNiche,
  GameEvent,
  GameEventType,
  PropertyCustomization,
} from "@/types/game";
import { addMinutes, daysBetween, isWithinWorkingHours } from "@/game/time";
import { addExpense, addIncome } from "@/game/finance";
import { getCareerTrackById } from "@/data/careers";
import { getCityById } from "@/data/cities";
import { getPropertyListingById } from "@/data/properties";
import { getVehicleListingById } from "@/data/vehicles";
import { getNicheData } from "@/data/content";
import { generateId } from "@/lib/utils/id";

export interface ActionResult {
  success: boolean;
  message: string;
  state: GameState;
}

function fail(state: GameState, message: string): ActionResult {
  return { success: false, message, state };
}

function ok(state: GameState, message: string): ActionResult {
  return { success: true, message, state };
}

const DEFAULT_CUSTOMIZATION: PropertyCustomization = {
  wallStyle: "plain-white",
  flooring: "standard-tile",
  lighting: "basic",
  furniture: [],
  interiorStyle: "minimal",
};

function pushEvent(state: GameState, type: GameEventType, title: string, description: string): GameState {
  const event: GameEvent = {
    id: generateId("evt"),
    type,
    title,
    description,
    timestamp: state.time,
    resolved: false,
  };
  return { ...state, events: [event, ...state.events].slice(0, 100) };
}

/**
 * Advances game time and applies any recurring finance/passive-income effects
 * for every calendar day boundary crossed (payday, rent, monthly expenses).
 * All time-consuming actions must funnel through this instead of mutating
 * `state.time` directly, so payday/rent never gets skipped.
 */
function advanceTime(state: GameState, minutes: number): GameState {
  const previousTime = state.time;
  const newTime = addMinutes(previousTime, minutes);
  let next: GameState = { ...state, time: newTime };

  const daysCrossed = daysBetween(previousTime, newTime);
  if (daysCrossed > 0) {
    for (let i = 1; i <= daysCrossed; i++) {
      next = applyDailyTick(next);
    }
  }

  return next;
}

const PAYDAY_INTERVAL_DAYS = 30;
const BASE_DAILY_LIVING_COST = 60;

function applyDailyTick(state: GameState): GameState {
  let next = state;

  // Base living cost (food, utilities, misc) scaled by city cost of living.
  const city = getCityById(next.city.currentCityId);
  const livingCost = Math.round(BASE_DAILY_LIVING_COST * (city?.costOfLivingIndex ?? 1));
  next = {
    ...next,
    finances: addExpense(next.finances, "food", livingCost, next.time, "Daily living expenses"),
  };

  // Vehicle running costs (daily share of monthly figures).
  if (next.vehicles.length > 0) {
    const dailyVehicleCost = next.vehicles.reduce((sum, v) => {
      const listing = getVehicleListingById(v.listingId);
      if (!listing) return sum;
      return (
        sum +
        (listing.fuelCostPerMonth + listing.maintenanceCostPerMonth + listing.insuranceCostPerMonth) / 30
      );
    }, 0);
    next = {
      ...next,
      finances: addExpense(
        next.finances,
        "maintenance",
        Math.round(dailyVehicleCost),
        next.time,
        "Vehicle running costs",
      ),
    };
  }

  // Property expenses + rental income.
  for (const property of next.properties) {
    const listing = getPropertyListingById(property.listingId);
    if (!listing) continue;
    const dailyUpkeep = Math.round((listing.price * 0.002) / 30); // ~0.2% of value / month
    next = {
      ...next,
      finances: addExpense(next.finances, "property", dailyUpkeep, next.time, `Upkeep — ${listing.name}`),
    };
    if (property.status === "rentedOut") {
      const dailyRent = Math.round(listing.monthlyRent / 30);
      next = {
        ...next,
        finances: addIncome(next.finances, "rental", dailyRent, next.time, `Rental income — ${listing.name}`),
      };
    } else if (property.status === "owned") {
      // Vacant investment property — not primary residence, not rented.
    } else if (property.status === "primaryResidence") {
      // No rent owed to self.
    }
  }

  // Payday.
  if (next.career.trackId && next.career.employedSince) {
    const track = getCareerTrackById(next.career.trackId);
    const level = track?.levels[next.career.levelIndex];
    const lastPay = next.career.lastPayday ?? next.career.employedSince;
    if (level && daysBetween(lastPay, next.time) >= PAYDAY_INTERVAL_DAYS) {
      next = {
        ...next,
        finances: addIncome(next.finances, "salary", level.salary, next.time, `Salary — ${level.title}`),
        career: { ...next.career, lastPayday: next.time },
      };
    }
  }

  // Energy regenerates slightly overnight even without sleeping.
  next = {
    ...next,
    fitness: { ...next.fitness, energy: Math.min(100, next.fitness.energy + 5) },
  };

  return next;
}

// ---------------------------------------------------------------------------
// Time & lifestyle actions
// ---------------------------------------------------------------------------

export function work(state: GameState): ActionResult {
  if (!state.career.trackId) return fail(state, "You don't have a job yet. Apply for one first.");
  const track = getCareerTrackById(state.career.trackId);
  const level = track?.levels[state.career.levelIndex];
  if (!track || !level) return fail(state, "Career data not found.");
  if (!isWithinWorkingHours(state.time, level.workingHours.start, level.workingHours.end)) {
    return fail(state, `Work hours are ${level.workingHours.start}:00–${level.workingHours.end}:00.`);
  }
  if (state.fitness.energy < 20) return fail(state, "Too exhausted to work. Rest first.");

  const hoursWorked = level.workingHours.end - level.workingHours.start;
  let next = advanceTime(state, hoursWorked * 60);
  next = {
    ...next,
    career: { ...next.career, experienceHours: next.career.experienceHours + hoursWorked },
    fitness: { ...next.fitness, energy: Math.max(0, next.fitness.energy - 30) },
    currentActivity: "idle",
  };

  next = maybeCheckPromotion(next);
  return ok(next, `Worked a ${hoursWorked}-hour shift as ${level.title}.`);
}

function maybeCheckPromotion(state: GameState): GameState {
  if (!state.career.trackId) return state;
  const track = getCareerTrackById(state.career.trackId);
  if (!track) return state;
  const nextLevel = track.levels[state.career.levelIndex + 1];
  if (!nextLevel) return state;
  if (state.career.experienceHours >= nextLevel.experienceRequired) {
    const promoted = { ...state, career: { ...state.career, levelIndex: state.career.levelIndex + 1 } };
    return pushEvent(
      promoted,
      "promotion",
      "Promotion!",
      `You've been promoted to ${nextLevel.title} — new salary: ${nextLevel.salary} AED/mo.`,
    );
  }
  return state;
}

export function sleep(state: GameState): ActionResult {
  const next = advanceTime(state, 8 * 60);
  const rested: GameState = {
    ...next,
    fitness: { ...next.fitness, energy: 100, health: Math.min(100, next.fitness.health + 5) },
    currentActivity: "idle",
  };
  return ok(rested, "Slept for 8 hours. Energy restored.");
}

export function goToGym(state: GameState): ActionResult {
  if (state.fitness.energy < 15) return fail(state, "Too exhausted to work out.");
  const gymCost = 50;
  if (state.finances.cash + state.finances.bank < gymCost) return fail(state, "Not enough money for the gym.");

  let next = advanceTime(state, 90);
  next = {
    ...next,
    fitness: {
      ...next.fitness,
      energy: Math.max(0, next.fitness.energy - 15),
      fitnessLevel: Math.min(100, next.fitness.fitnessLevel + 2),
      strength: Math.min(100, next.fitness.strength + 1.5),
      health: Math.min(100, next.fitness.health + 1),
    },
    finances: addExpense(next.finances, "gym", gymCost, next.time, "Gym session"),
    currentActivity: "idle",
  };
  return ok(next, "Finished a solid gym session.");
}

// ---------------------------------------------------------------------------
// Career actions
// ---------------------------------------------------------------------------

export function applyForJob(state: GameState, trackId: string): ActionResult {
  const track = getCareerTrackById(trackId);
  if (!track) return fail(state, "Career track not found.");
  if (!track.cityIds.includes(state.city.currentCityId)) {
    return fail(state, `${track.name} isn't available in this city.`);
  }
  const next: GameState = {
    ...state,
    career: {
      trackId: track.id,
      levelIndex: 0,
      experienceHours: 0,
      employedSince: state.time,
      lastPayday: state.time,
    },
  };
  return ok(next, `You're now a ${track.levels[0].title}!`);
}

export function resignFromJob(state: GameState): ActionResult {
  if (!state.career.trackId) return fail(state, "You don't currently have a job.");
  const next: GameState = {
    ...state,
    career: { trackId: null, levelIndex: 0, experienceHours: 0, employedSince: null, lastPayday: null },
  };
  return ok(next, "You resigned.");
}

// ---------------------------------------------------------------------------
// Vehicle actions
// ---------------------------------------------------------------------------

export function buyVehicle(state: GameState, listingId: string): ActionResult {
  const listing = getVehicleListingById(listingId);
  if (!listing) return fail(state, "Vehicle not found.");
  const totalFunds = state.finances.cash + state.finances.bank;
  if (totalFunds < listing.price) return fail(state, "Not enough money to buy this vehicle.");

  const owned: OwnedVehicle = {
    listingId: listing.id,
    purchasePrice: listing.price,
    currentValue: listing.price,
    condition: "excellent",
    customization: { color: listing.defaultColor, wheels: "stock", suspension: "stock", interior: "stock" },
    purchasedAt: state.time,
  };

  const next: GameState = {
    ...state,
    finances: addExpense(state.finances, "other", listing.price, state.time, `Purchased ${listing.brand} ${listing.model}`),
    vehicles: [...state.vehicles, owned],
    activeVehicleListingId: state.activeVehicleListingId ?? listing.id,
  };
  return ok(next, `Bought a ${listing.brand} ${listing.model}.`);
}

export function sellVehicle(state: GameState, listingId: string): ActionResult {
  const owned = state.vehicles.find((v) => v.listingId === listingId);
  if (!owned) return fail(state, "You don't own this vehicle.");
  const salePrice = Math.round(owned.currentValue * 0.85);
  const next: GameState = {
    ...state,
    finances: addIncome(state.finances, "other", salePrice, state.time, "Sold vehicle"),
    vehicles: state.vehicles.filter((v) => v.listingId !== listingId),
    activeVehicleListingId: state.activeVehicleListingId === listingId ? null : state.activeVehicleListingId,
  };
  return ok(next, `Sold your vehicle for ${salePrice} AED.`);
}

export function setActiveVehicle(state: GameState, listingId: string): ActionResult {
  if (!state.vehicles.some((v) => v.listingId === listingId)) return fail(state, "You don't own this vehicle.");
  return ok({ ...state, activeVehicleListingId: listingId }, "Active vehicle updated.");
}

export function customizeVehiclePaint(state: GameState, listingId: string, color: string): ActionResult {
  if (!state.vehicles.some((v) => v.listingId === listingId)) return fail(state, "You don't own this vehicle.");
  const next: GameState = {
    ...state,
    vehicles: state.vehicles.map((v) =>
      v.listingId === listingId ? { ...v, customization: { ...v.customization, color } } : v,
    ),
  };
  return ok(next, "Respray complete.");
}

// ---------------------------------------------------------------------------
// Property actions
// ---------------------------------------------------------------------------

export function buyProperty(state: GameState, listingId: string): ActionResult {
  const listing = getPropertyListingById(listingId);
  if (!listing) return fail(state, "Property not found.");
  const totalFunds = state.finances.cash + state.finances.bank;
  if (totalFunds < listing.price) return fail(state, "Not enough money to buy this property.");

  const hasPrimaryResidence = state.properties.some((p) => p.status === "primaryResidence");
  const owned: OwnedProperty = {
    listingId: listing.id,
    purchasePrice: listing.price,
    currentValue: listing.price,
    status: hasPrimaryResidence ? "owned" : "primaryResidence",
    customization: { ...DEFAULT_CUSTOMIZATION },
    purchasedAt: state.time,
    lastRentCollected: null,
  };

  const next: GameState = {
    ...state,
    finances: addExpense(state.finances, "other", listing.price, state.time, `Purchased ${listing.name}`),
    properties: [...state.properties, owned],
  };
  return ok(next, `You now own ${listing.name}.`);
}

export function sellProperty(state: GameState, listingId: string): ActionResult {
  const owned = state.properties.find((p) => p.listingId === listingId);
  if (!owned) return fail(state, "You don't own this property.");
  const salePrice = Math.round(owned.currentValue * 0.92);
  const next: GameState = {
    ...state,
    finances: addIncome(state.finances, "other", salePrice, state.time, "Sold property"),
    properties: state.properties.filter((p) => p.listingId !== listingId),
  };
  return ok(next, `Sold property for ${salePrice} AED.`);
}

export function rentOutProperty(state: GameState, listingId: string): ActionResult {
  const owned = state.properties.find((p) => p.listingId === listingId);
  if (!owned) return fail(state, "You don't own this property.");
  if (owned.status === "primaryResidence") return fail(state, "You can't rent out your primary residence.");
  const next: GameState = {
    ...state,
    properties: state.properties.map((p) =>
      p.listingId === listingId ? { ...p, status: "rentedOut" as const } : p,
    ),
  };
  return ok(next, "Property listed for rent. Rental income will now come in monthly.");
}

export function stopRentingProperty(state: GameState, listingId: string): ActionResult {
  const owned = state.properties.find((p) => p.listingId === listingId);
  if (!owned) return fail(state, "You don't own this property.");
  const next: GameState = {
    ...state,
    properties: state.properties.map((p) => (p.listingId === listingId ? { ...p, status: "owned" as const } : p)),
  };
  return ok(next, "Property removed from the rental market.");
}

export function renovateProperty(
  state: GameState,
  listingId: string,
  customization: Partial<PropertyCustomization>,
): ActionResult {
  const owned = state.properties.find((p) => p.listingId === listingId);
  if (!owned) return fail(state, "You don't own this property.");
  const renovationCost = 8000;
  const totalFunds = state.finances.cash + state.finances.bank;
  if (totalFunds < renovationCost) return fail(state, "Not enough money to renovate.");

  const next: GameState = {
    ...state,
    finances: addExpense(state.finances, "property", renovationCost, state.time, `Renovated ${listingId}`),
    properties: state.properties.map((p) =>
      p.listingId === listingId
        ? {
            ...p,
            customization: { ...p.customization, ...customization },
            currentValue: Math.round(p.currentValue * 1.04),
          }
        : p,
    ),
  };
  return ok(next, "Renovation complete. Property value increased.");
}

// ---------------------------------------------------------------------------
// Creator actions
// ---------------------------------------------------------------------------

export function createChannel(state: GameState, name: string, niche: ContentNiche): ActionResult {
  if (state.creator.channels.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
    return fail(state, "You already have a channel with that name.");
  }
  const channel: Channel = {
    id: generateId("chn"),
    name,
    niche,
    followers: 0,
    totalViews: 0,
    engagement: 0.05,
    revenue: 0,
    videosPosted: 0,
    createdAt: state.time,
  };
  const next: GameState = { ...state, creator: { channels: [...state.creator.channels, channel] } };
  return ok(next, `Launched channel "${name}".`);
}

export function createContent(state: GameState, channelId: string): ActionResult {
  const channel = state.creator.channels.find((c) => c.id === channelId);
  if (!channel) return fail(state, "Channel not found.");
  if (state.fitness.energy < 20) return fail(state, "Too exhausted to create content.");

  const niche = getNicheData(channel.niche);
  let next = advanceTime(state, 2 * 60);
  next = { ...next, fitness: { ...next.fitness, energy: Math.max(0, next.fitness.energy - 20) } };

  const randomness = 1 + (Math.random() * 2 - 1) * niche.volatility;
  const baseAudience = Math.max(50, channel.followers);
  const views = Math.round(baseAudience * niche.baseViewsPerFollower * randomness * (1 + channel.engagement));
  const newFollowers = Math.round(views * 0.015 * randomness);
  const revenue = Math.round(views * 0.012);

  const wentViral = randomness > 1 + niche.volatility * 0.85 && views > 500;

  const updatedChannel: Channel = {
    ...channel,
    followers: channel.followers + newFollowers,
    totalViews: channel.totalViews + views,
    engagement: Math.min(0.6, channel.engagement + 0.002),
    revenue: channel.revenue + revenue,
    videosPosted: channel.videosPosted + 1,
  };

  next = {
    ...next,
    creator: {
      channels: next.creator.channels.map((c) => (c.id === channelId ? updatedChannel : c)),
    },
    finances: addIncome(next.finances, "creator", revenue, next.time, `Content revenue — ${channel.name}`),
  };

  if (wentViral) {
    next = pushEvent(
      next,
      "viralVideo",
      "Your video went viral!",
      `"${channel.name}" picked up ${newFollowers} new followers from one video.`,
    );
  }

  return ok(next, `Published a video. +${newFollowers} followers, +${revenue} AED.`);
}

// ---------------------------------------------------------------------------
// City actions
// ---------------------------------------------------------------------------

export function moveCity(state: GameState, cityId: string): ActionResult {
  const city = getCityById(cityId);
  if (!city) return fail(state, "City not found.");
  if (city.id === state.city.currentCityId) return fail(state, "You already live here.");
  const movingCost = 3000;
  const totalFunds = state.finances.cash + state.finances.bank;
  if (totalFunds < movingCost) return fail(state, "Not enough money to relocate.");

  let next: GameState = {
    ...state,
    city: { currentCityId: city.id },
    finances: addExpense(state.finances, "other", movingCost, state.time, `Relocation to ${city.name}`),
  };

  if (next.career.trackId) {
    const track = getCareerTrackById(next.career.trackId);
    if (track && !track.cityIds.includes(city.id)) {
      next = { ...next, career: { trackId: null, levelIndex: 0, experienceHours: 0, employedSince: null, lastPayday: null } };
    }
  }

  next = advanceTime(next, 4 * 60);
  return ok(next, `Moved to ${city.name}.`);
}

export { advanceTime };
