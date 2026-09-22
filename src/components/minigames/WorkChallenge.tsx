"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { playConfirm } from "@/lib/audio/sfx";

interface WorkChallengeProps {
  onComplete: (bonus: number) => void;
  onCancel: () => void;
}

const SWEET_SPOT = [68, 88] as const; // percent range for the big bonus
const OK_SPOT = [40, 68] as const;

export function WorkChallenge({ onComplete, onCancel }: WorkChallengeProps) {
  const progress = useMotionValue(0);
  const [display, setDisplay] = useState(0);
  const [result, setResult] = useState<"sweet" | "ok" | "miss" | null>(null);
  const stoppedRef = useRef(false);

  useEffect(() => {
    const controls = animate(progress, [0, 100, 0], {
      duration: 1.6,
      repeat: Infinity,
      ease: "easeInOut",
    });
    const unsubscribe = progress.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleStop() {
    if (stoppedRef.current) return;
    stoppedRef.current = true;
    const value = progress.get();
    playConfirm();
    if (value >= SWEET_SPOT[0] && value <= SWEET_SPOT[1]) {
      setResult("sweet");
      setTimeout(() => onComplete(350), 700);
    } else if (value >= OK_SPOT[0] && value <= OK_SPOT[1]) {
      setResult("ok");
      setTimeout(() => onComplete(120), 700);
    } else {
      setResult("miss");
      setTimeout(() => onComplete(0), 700);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="w-full max-w-sm">
          <CardContent className="space-y-5 pt-6">
            <div>
              <h2 className="text-lg font-semibold">Focus at Work</h2>
              <p className="mt-1 text-sm text-muted">
                Stop the marker in the gold zone for a performance bonus.
              </p>
            </div>

            <div className="relative h-4 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="absolute inset-y-0 bg-success/30"
                style={{ left: `${OK_SPOT[0]}%`, width: `${OK_SPOT[1] - OK_SPOT[0]}%` }}
              />
              <div
                className="absolute inset-y-0 bg-accent/50"
                style={{ left: `${SWEET_SPOT[0]}%`, width: `${SWEET_SPOT[1] - SWEET_SPOT[0]}%` }}
              />
              <div
                className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 -translate-x-1/2 rounded-full bg-foreground shadow-md"
                style={{ left: `${display}%` }}
              />
            </div>

            {result === null && (
              <Button className="w-full" onClick={handleStop}>
                Stop
              </Button>
            )}
            {result === "sweet" && <p className="text-center text-sm font-medium text-success">Perfect timing! +350 AED</p>}
            {result === "ok" && <p className="text-center text-sm font-medium text-accent">Solid effort. +120 AED</p>}
            {result === "miss" && <p className="text-center text-sm font-medium text-muted">Missed the zone — normal pay.</p>}

            {result === null && (
              <button onClick={onCancel} className="w-full text-center text-xs text-muted hover:text-foreground">
                Skip mini-game
              </button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
