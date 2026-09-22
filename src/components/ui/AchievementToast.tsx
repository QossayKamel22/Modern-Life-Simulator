"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";
import type { Achievement } from "@/game/achievements";

export function AchievementToast({ achievement }: { achievement: Achievement | null }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!achievement) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- must re-show on every new unlock
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 4200);
    return () => clearTimeout(timer);
  }, [achievement]);

  return (
    <AnimatePresence>
      {achievement && visible && (
        <motion.div
          key={achievement.id}
          initial={{ opacity: 0, y: -24, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -16, x: "-50%" }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="glass-strong fixed left-1/2 top-20 z-50 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-xl sm:top-24"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
            <Trophy size={18} />
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-accent">Achievement Unlocked</p>
            <p className="text-sm font-semibold">{achievement.title}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
