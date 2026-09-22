"use client";

import type { GameState } from "@/types/game";
import { useGameStore } from "@/hooks/useGameStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatBar } from "@/components/ui/StatBar";

export function FitnessPanel({ state }: { state: GameState }) {
  const goToGym = useGameStore((s) => s.goToGym);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Fitness</h1>
        <p className="mt-1 text-sm text-muted">Stay in shape — but it costs time and energy.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Condition</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <StatBar label="Fitness Level" value={state.fitness.fitnessLevel} colorClassName="bg-success" />
          <StatBar label="Strength" value={state.fitness.strength} colorClassName="bg-accent" />
          <StatBar label="Energy" value={state.fitness.energy} colorClassName="bg-warning" />
          <StatBar label="Health" value={state.fitness.health} colorClassName="bg-success" />
          <Button onClick={goToGym}>Go to Gym (1.5h · 50 AED)</Button>
        </CardContent>
      </Card>
    </div>
  );
}
