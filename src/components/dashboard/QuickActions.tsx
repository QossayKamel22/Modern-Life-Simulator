"use client";

import { Briefcase, Bed, Dumbbell } from "lucide-react";
import { useGameStore } from "@/hooks/useGameStore";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function QuickActions() {
  const work = useGameStore((s) => s.work);
  const sleep = useGameStore((s) => s.sleep);
  const goToGym = useGameStore((s) => s.goToGym);

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 pt-5 sm:flex-row">
        <Button className="flex-1" onClick={work}>
          <Briefcase size={16} /> Work
        </Button>
        <Button className="flex-1" variant="secondary" onClick={goToGym}>
          <Dumbbell size={16} /> Gym
        </Button>
        <Button className="flex-1" variant="secondary" onClick={sleep}>
          <Bed size={16} /> Sleep
        </Button>
      </CardContent>
    </Card>
  );
}
