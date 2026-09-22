"use client";

import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Briefcase,
  Wallet,
  Building2,
  Car,
  Video,
  Dumbbell,
  MapPin,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { cn, formatDate, formatTime } from "@/lib/utils/format";
import type { GameState } from "@/types/game";
import { getCityById } from "@/data/cities";
import { getCareerTrackById } from "@/data/careers";

export type Tab = "dashboard" | "career" | "finance" | "property" | "vehicle" | "creator" | "fitness" | "city";

const TABS: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "career", label: "Career", icon: Briefcase },
  { id: "finance", label: "Finance", icon: Wallet },
  { id: "property", label: "Property", icon: Building2 },
  { id: "vehicle", label: "Garage", icon: Car },
  { id: "creator", label: "Creator", icon: Video },
  { id: "fitness", label: "Fitness", icon: Dumbbell },
  { id: "city", label: "City", icon: MapPin },
];

interface GameShellProps {
  state: GameState;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onLogout: () => void;
  children: ReactNode;
}

export function GameShell({ state, activeTab, onTabChange, onLogout, children }: GameShellProps) {
  const { theme, toggleTheme } = useTheme();
  const city = getCityById(state.city.currentCityId);
  const track = state.career.trackId ? getCareerTrackById(state.career.trackId) : null;
  const level = track?.levels[state.career.levelIndex];

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="flex shrink-0 flex-col border-b border-border bg-surface lg:w-64 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-4 lg:flex-col lg:items-start lg:gap-1">
          <div>
            <p className="text-sm font-semibold">{state.character.name}</p>
            <p className="text-xs text-muted">
              {level ? level.title : "Unemployed"} · {city?.name}
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="rounded-lg border border-border p-2 text-muted hover:text-foreground lg:hidden"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-0">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                activeTab === id
                  ? "bg-accent/12 text-accent"
                  : "text-muted hover:bg-border/40 hover:text-foreground",
              )}
            >
              <Icon size={17} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto hidden flex-col gap-2 border-t border-border p-4 lg:flex">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>{formatDate(state.time)}</span>
            <span>{formatTime(state.time)}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleTheme}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border py-2 text-xs text-muted hover:text-foreground"
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
              {theme === "dark" ? "Light" : "Dark"}
            </button>
            <button
              onClick={onLogout}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border py-2 text-xs text-muted hover:text-danger"
            >
              <LogOut size={14} />
              Log out
            </button>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-3 lg:hidden">
          <div className="text-xs text-muted">
            {formatDate(state.time)} · {formatTime(state.time)}
          </div>
          <button onClick={onLogout} className="text-xs text-muted hover:text-danger">
            Log out
          </button>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
