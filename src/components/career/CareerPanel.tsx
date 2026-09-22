"use client";

import type { GameState } from "@/types/game";
import { useGameStore } from "@/hooks/useGameStore";
import { getCareerTracksForCity, getCareerTrackById } from "@/data/careers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StatBar } from "@/components/ui/StatBar";
import { formatCurrency } from "@/lib/utils/format";

export function CareerPanel({ state }: { state: GameState }) {
  const applyForJob = useGameStore((s) => s.applyForJob);
  const resignFromJob = useGameStore((s) => s.resignFromJob);
  const tracks = getCareerTracksForCity(state.city.currentCityId);
  const currentTrack = state.career.trackId ? getCareerTrackById(state.career.trackId) : null;
  const currentLevel = currentTrack?.levels[state.career.levelIndex];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Career</h1>
        <p className="mt-1 text-sm text-muted">Choose a career track and work your way up.</p>
      </div>

      {currentTrack && currentLevel && (
        <Card>
          <CardHeader>
            <CardTitle>Current Job</CardTitle>
            <Badge tone="success">Employed</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline justify-between">
              <p className="text-lg font-semibold">{currentLevel.title}</p>
              <p className="text-sm text-muted">{formatCurrency(currentLevel.salary)}/mo</p>
            </div>
            <p className="text-xs text-muted">
              Working hours: {currentLevel.workingHours.start}:00–{currentLevel.workingHours.end}:00
            </p>
            {currentTrack.levels[state.career.levelIndex + 1] && (
              <StatBar
                label={`Progress to ${currentTrack.levels[state.career.levelIndex + 1].title}`}
                value={state.career.experienceHours}
                max={currentTrack.levels[state.career.levelIndex + 1].experienceRequired}
              />
            )}
            <Button variant="danger" size="sm" onClick={resignFromJob}>
              Resign
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {tracks.map((track) => {
          const isCurrent = track.id === state.career.trackId;
          return (
            <Card key={track.id}>
              <CardHeader>
                <CardTitle>{track.name}</CardTitle>
                <Badge tone="neutral">{track.industry}</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <ol className="space-y-1.5">
                  {track.levels.map((level, idx) => (
                    <li key={level.id} className="flex items-center justify-between text-sm">
                      <span className={idx === 0 ? "font-medium" : "text-muted"}>{level.title}</span>
                      <span className="text-muted">{formatCurrency(level.salary)}/mo</span>
                    </li>
                  ))}
                </ol>
                <Button
                  className="w-full"
                  variant={isCurrent ? "secondary" : "primary"}
                  disabled={isCurrent}
                  onClick={() => applyForJob(track.id)}
                >
                  {isCurrent ? "Current Track" : "Apply"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
