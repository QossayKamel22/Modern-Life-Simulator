"use client";

import type { GameState } from "@/types/game";
import { useGameStore } from "@/hooks/useGameStore";
import { CITIES } from "@/data/cities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FadeInUp } from "@/components/ui/Motion";

export function CityPanel({ state }: { state: GameState }) {
  const moveCity = useGameStore((s) => s.moveCity);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Cities</h1>
        <p className="mt-1 text-sm text-muted">Relocate to access different careers and property markets.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {CITIES.map((city, index) => {
          const isCurrent = city.id === state.city.currentCityId;
          return (
            <FadeInUp key={city.id} index={index} whileHover={{ y: -3 }}>
              <Card>
                <CardHeader>
                  <CardTitle>{city.name}</CardTitle>
                  {isCurrent && <Badge tone="accent">Current</Badge>}
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted">{city.country}</p>
                  <p className="text-xs text-muted">
                    Cost of living: {Math.round(city.costOfLivingIndex * 100)}% of baseline
                  </p>
                  <Button className="w-full" variant="secondary" disabled={isCurrent} onClick={() => moveCity(city.id)}>
                    {isCurrent ? "You live here" : "Move here (3,000 AED)"}
                  </Button>
                </CardContent>
              </Card>
            </FadeInUp>
          );
        })}
      </div>
    </div>
  );
}
