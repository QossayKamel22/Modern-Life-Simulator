"use client";

import { motion } from "framer-motion";
import { Briefcase, Wallet, Building2, Car, Video, Dumbbell, MapPin } from "lucide-react";
import type { GameState } from "@/types/game";
import type { Tab } from "@/components/layout/GameShell";
import { getCityById } from "@/data/cities";
import { getCareerTrackById } from "@/data/careers";
import { cn } from "@/lib/utils/format";

interface Location {
  tab: Tab;
  label: string;
  icon: typeof Briefcase;
  status: (state: GameState) => string;
  span: string;
  accent: string;
}

const LOCATIONS: Location[] = [
  {
    tab: "career",
    label: "Downtown Office",
    icon: Briefcase,
    status: (s) => (s.career.trackId ? "You work here" : "No job yet"),
    span: "md:col-span-2 md:row-span-2",
    accent: "from-amber-500/25",
  },
  {
    tab: "property",
    label: "Real Estate Office",
    icon: Building2,
    status: (s) => `${s.properties.length} owned`,
    span: "md:col-span-2",
    accent: "from-teal-500/25",
  },
  {
    tab: "vehicle",
    label: "Dealership",
    icon: Car,
    status: (s) => `${s.vehicles.length} in garage`,
    span: "md:row-span-2",
    accent: "from-orange-500/25",
  },
  {
    tab: "finance",
    label: "Bank",
    icon: Wallet,
    status: () => "Manage your money",
    span: "",
    accent: "from-emerald-500/25",
  },
  {
    tab: "creator",
    label: "Studio",
    icon: Video,
    status: (s) => `${s.creator.channels.length} channels`,
    span: "",
    accent: "from-pink-500/25",
  },
  {
    tab: "fitness",
    label: "Gym",
    icon: Dumbbell,
    status: (s) => `Fitness ${Math.round(s.fitness.fitnessLevel)}`,
    span: "",
    accent: "from-lime-500/25",
  },
];

export function CityMap({ state, onNavigate }: { state: GameState; onNavigate: (tab: Tab) => void }) {
  const city = getCityById(state.city.currentCityId);
  const track = state.career.trackId ? getCareerTrackById(state.career.trackId) : null;
  const level = track?.levels[state.career.levelIndex];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{city?.name}</h1>
        <p className="mt-1 text-sm text-muted">
          {state.character.name} · {level ? level.title : "Unemployed"} · Tap a location to visit it.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:auto-rows-[110px]">
        {LOCATIONS.map((loc, index) => {
          const Icon = loc.icon;
          return (
            <motion.button
              key={loc.tab}
              onClick={() => onNavigate(loc.tab)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "glass relative flex flex-col justify-end overflow-hidden rounded-2xl p-4 text-left",
                loc.span,
              )}
            >
              <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent", loc.accent)} />
              <Icon size={22} className="relative mb-8 text-foreground/80" />
              <p className="relative text-sm font-semibold">{loc.label}</p>
              <p className="relative text-xs text-muted">{loc.status(state)}</p>
            </motion.button>
          );
        })}

        <motion.button
          onClick={() => onNavigate("city")}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: LOCATIONS.length * 0.05 }}
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="glass relative flex flex-col justify-end overflow-hidden rounded-2xl p-4 text-left"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-500/25 to-transparent" />
          <MapPin size={22} className="relative mb-8 text-foreground/80" />
          <p className="relative text-sm font-semibold">Travel</p>
          <p className="relative text-xs text-muted">Move to another city</p>
        </motion.button>
      </div>
    </div>
  );
}
