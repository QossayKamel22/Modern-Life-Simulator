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
    <div className="flex min-h-screen flex-col lg:flex-row lg:gap-4 lg:p-4">
      {/* Desktop floating glass sidebar */}
      <aside className="glass-strong sticky top-4 hidden h-[calc(100vh-2rem)] w-64 shrink-0 flex-col rounded-[28px] lg:flex">
        <div className="px-5 pt-5">
          <p className="text-sm font-semibold">{state.character.name}</p>
          <p className="mt-0.5 text-xs text-muted">
            {level ? level.title : "Unemployed"} · {city?.name}
          </p>
        </div>

        <nav className="mt-5 flex flex-1 flex-col gap-1 px-3">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={cn(
                "flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                activeTab === id
                  ? "bg-accent text-accent-foreground shadow-[0_4px_14px_-4px_var(--accent)]"
                  : "text-muted hover:bg-white/10 hover:text-foreground",
              )}
            >
              <Icon size={17} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="flex flex-col gap-2 p-4">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>{formatDate(state.time)}</span>
            <span>{formatTime(state.time)}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleTheme}
              className="glass flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-xs text-muted hover:text-foreground"
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
              {theme === "dark" ? "Light" : "Dark"}
            </button>
            <button
              onClick={onLogout}
              className="glass flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-xs text-muted hover:text-danger"
            >
              <LogOut size={14} />
              Log out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile floating top bar */}
      <header className="glass-strong sticky top-3 z-40 mx-3 mt-3 flex items-center justify-between rounded-full px-4 py-2.5 lg:hidden">
        <div>
          <p className="text-xs font-semibold leading-none">{state.character.name}</p>
          <p className="mt-0.5 text-[11px] text-muted">
            {formatDate(state.time)} · {formatTime(state.time)}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:text-foreground"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={onLogout}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:text-danger"
            aria-label="Log out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 flex-col">
        <main className="flex-1 px-4 py-6 pb-28 sm:px-6 lg:px-2 lg:pb-6">{children}</main>
      </div>

      {/* Mobile floating glass tab bar */}
      <nav className="glass-strong fixed inset-x-3 bottom-3 z-40 flex items-center gap-1 overflow-x-auto rounded-full px-2 py-2 lg:hidden">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={cn(
                "flex shrink-0 flex-col items-center gap-0.5 rounded-full px-3 py-1.5 text-[10px] font-medium transition-colors",
                isActive ? "text-accent" : "text-muted",
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                  isActive && "bg-accent/15",
                )}
              >
                <Icon size={18} />
              </span>
              {label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
