"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { GameEvent } from "@/types/game";
import { useGameStore } from "@/hooks/useGameStore";
import { Card, CardContent } from "@/components/ui/Card";

export function EventModal({ event }: { event: GameEvent | null }) {
  const resolveEventChoice = useGameStore((s) => s.resolveEventChoice);

  return (
    <AnimatePresence>
      {event && (
        <motion.div
          key={event.id}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
          >
            <Card className="w-full max-w-sm">
              <CardContent className="space-y-4 pt-6">
                <div>
                  <h2 className="text-lg font-semibold">{event.title}</h2>
                  <p className="mt-1 text-sm text-muted">{event.description}</p>
                </div>
                <div className="space-y-2">
                  {event.choices?.map((choice) => (
                    <button
                      key={choice.id}
                      onClick={() => resolveEventChoice(event.id, choice.id)}
                      className="glass w-full rounded-2xl px-4 py-3 text-left transition-colors hover:bg-white/10"
                    >
                      <p className="text-sm font-medium">{choice.label}</p>
                      <p className="mt-0.5 text-xs text-muted">{choice.description}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
