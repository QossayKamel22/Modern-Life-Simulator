"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import type { GameState } from "@/types/game";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatBar } from "@/components/ui/StatBar";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { DynamicCharacterViewer } from "@/components/three/DynamicCharacterViewer";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { getCareerTrackById } from "@/data/careers";
import { getCityById } from "@/data/cities";
import { monthlyExpenses, monthlyIncome, netWorth } from "@/game/finance";
import { ACHIEVEMENTS } from "@/game/achievements";

const cardEntrance = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
};

export function Dashboard({ state }: { state: GameState }) {
  const track = state.career.trackId ? getCareerTrackById(state.career.trackId) : null;
  const level = track?.levels[state.career.levelIndex];
  const nextLevel = track?.levels[state.career.levelIndex + 1];
  const city = getCityById(state.city.currentCityId);
  const income = monthlyIncome(state.finances);
  const expenses = monthlyExpenses(state.finances);
  const followers = state.creator.channels.reduce((sum, c) => sum + c.followers, 0);
  const views = state.creator.channels.reduce((sum, c) => sum + c.totalViews, 0);
  const creatorRevenue = state.creator.channels.reduce((sum, c) => sum + c.revenue, 0);
  const unlockedAchievements = ACHIEVEMENTS.filter((a) => state.achievements.includes(a.id));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_1fr]">
        <Card className="overflow-hidden">
          <div className="h-52 w-full lg:h-full">
            <DynamicCharacterViewer character={state.character} className="h-full w-full" controls={false} />
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Welcome back, {state.character.name}</h1>
            <p className="mt-1 text-sm text-muted">
              {formatDate(state.time)} — Age {state.character.age} — Living in {city?.name}
            </p>
          </div>
          <QuickActions />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <motion.div {...cardEntrance} transition={{ duration: 0.3, delay: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle>Net Worth</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                <AnimatedNumber value={netWorth(state)} format={(n) => formatCurrency(n)} />
              </p>
              <p className="mt-1 text-xs text-muted">Cash + assets</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...cardEntrance} transition={{ duration: 0.3, delay: 0.05 }}>
          <Card>
            <CardHeader>
              <CardTitle>Cash on Hand</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                <AnimatedNumber value={state.finances.cash + state.finances.bank} format={(n) => formatCurrency(n)} />
              </p>
              <p className="mt-1 text-xs text-muted">
                Income {formatCurrency(income)} · Expenses {formatCurrency(expenses)}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...cardEntrance} transition={{ duration: 0.3, delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle>Career</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{level ? level.title : "Unemployed"}</p>
              <p className="mt-1 text-xs text-muted">
                {level ? `${formatCurrency(level.salary)}/mo` : "Apply for a job in the Career tab"}
              </p>
              {level && nextLevel && (
                <div className="mt-3">
                  <StatBar
                    label={`Progress to ${nextLevel.title}`}
                    value={state.career.experienceHours}
                    max={nextLevel.experienceRequired}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...cardEntrance} transition={{ duration: 0.3, delay: 0.15 }}>
          <Card>
            <CardHeader>
              <CardTitle>Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                {state.properties.length} {state.properties.length === 1 ? "property" : "properties"}
              </p>
              <p className="mt-1 text-xs text-muted">
                {state.vehicles.length} {state.vehicles.length === 1 ? "vehicle" : "vehicles"}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Lifestyle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <StatBar label="Energy" value={state.fitness.energy} colorClassName="bg-accent" />
            <StatBar label="Fitness" value={state.fitness.fitnessLevel} colorClassName="bg-success" />
            <StatBar label="Health" value={state.fitness.health} colorClassName="bg-warning" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Creator</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{followers.toLocaleString()} followers</p>
            <p className="mt-1 text-xs text-muted">
              {views.toLocaleString()} total views · {formatCurrency(creatorRevenue)} earned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {unlockedAchievements.length}/{ACHIEVEMENTS.length}
            </p>
            <ul className="mt-2 space-y-1">
              {unlockedAchievements
                .slice(-3)
                .reverse()
                .map((a) => (
                  <li key={a.id} className="flex items-center gap-1.5 text-xs text-muted">
                    <Trophy size={12} className="text-accent" /> {a.title}
                  </li>
                ))}
              {unlockedAchievements.length === 0 && <li className="text-xs text-muted">None yet — get started!</li>}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {state.finances.transactions.slice(0, 5).map((t) => (
                <li key={t.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted">{t.description}</span>
                  <span className={t.type === "income" ? "text-success" : "text-danger"}>
                    {t.type === "income" ? "+" : "-"}
                    {formatCurrency(t.amount)}
                  </span>
                </li>
              ))}
              {state.finances.transactions.length === 0 && (
                <li className="text-sm text-muted">No activity yet — try working a shift.</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      {state.events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Life Events</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {state.events.slice(0, 5).map((event) => (
                <li key={event.id} className="glass rounded-xl px-4 py-3">
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="mt-0.5 text-xs text-muted">{event.description}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
