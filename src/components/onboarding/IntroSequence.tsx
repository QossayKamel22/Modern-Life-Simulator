"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { DynamicCarViewer } from "@/components/three/DynamicCarViewer";
import { playWhoosh } from "@/lib/audio/sfx";

const LINES = ["Dubai, present day.", "Almost nothing to your name.", "Everything still to build."];

export function IntroSequence({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);

  function advance() {
    playWhoosh();
    if (step < LINES.length - 1) {
      setStep((s) => s + 1);
    } else {
      onDone();
    }
  }

  return (
    <main className="relative flex flex-1 flex-col overflow-hidden" onClick={advance}>
      <div className="absolute inset-0 -z-0 opacity-80">
        <DynamicCarViewer color="#e8b84b" performance={90} className="h-full w-full" zoom={1.5} controls={false} spin />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-0 bg-gradient-to-t from-background via-background/70 to-background/20" />

      <div className="relative flex flex-1 flex-col items-center justify-center px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.h1
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg text-3xl font-semibold tracking-tight sm:text-5xl"
          >
            {LINES[step]}
          </motion.h1>
        </AnimatePresence>

        <div className="mt-10 flex items-center gap-3">
          <Button
            size="lg"
            onClick={(e) => {
              e.stopPropagation();
              advance();
            }}
          >
            {step < LINES.length - 1 ? "Continue" : "Create your character"}
          </Button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDone();
            }}
            className="text-sm text-muted hover:text-foreground"
          >
            Skip
          </button>
        </div>

        <div className="mt-6 flex gap-1.5">
          {LINES.map((_, i) => (
            <span key={i} className={`h-1 w-6 rounded-full ${i <= step ? "bg-accent" : "bg-white/15"}`} />
          ))}
        </div>
      </div>
    </main>
  );
}
