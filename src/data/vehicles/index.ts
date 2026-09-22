import type { VehicleListing } from "@/types/game";

export const VEHICLE_LISTINGS: VehicleListing[] = [
  {
    id: "econo-hatch",
    brand: "Kaito",
    model: "Drift",
    year: 2019,
    price: 32000,
    fuelCostPerMonth: 350,
    maintenanceCostPerMonth: 200,
    insuranceCostPerMonth: 250,
    performance: 30,
  },
  {
    id: "midsize-sedan",
    brand: "Voltrix",
    model: "Sedan LX",
    year: 2022,
    price: 85000,
    fuelCostPerMonth: 450,
    maintenanceCostPerMonth: 300,
    insuranceCostPerMonth: 400,
    performance: 48,
  },
  {
    id: "suv-family",
    brand: "Atlas",
    model: "Ranger SUV",
    year: 2023,
    price: 165000,
    fuelCostPerMonth: 650,
    maintenanceCostPerMonth: 450,
    insuranceCostPerMonth: 600,
    performance: 55,
  },
  {
    id: "sport-coupe",
    brand: "Falcon",
    model: "GT Coupe",
    year: 2023,
    price: 320000,
    fuelCostPerMonth: 900,
    maintenanceCostPerMonth: 800,
    insuranceCostPerMonth: 1200,
    performance: 78,
  },
  {
    id: "luxury-sedan",
    brand: "Aurum",
    model: "Prestige S",
    year: 2024,
    price: 620000,
    fuelCostPerMonth: 1100,
    maintenanceCostPerMonth: 1400,
    insuranceCostPerMonth: 2200,
    performance: 82,
  },
  {
    id: "hypercar",
    brand: "Velocis",
    model: "Nova Hyper",
    year: 2024,
    price: 2400000,
    fuelCostPerMonth: 2500,
    maintenanceCostPerMonth: 4500,
    insuranceCostPerMonth: 8000,
    performance: 99,
  },
];

export function getVehicleListingById(id: string): VehicleListing | undefined {
  return VEHICLE_LISTINGS.find((v) => v.id === id);
}
