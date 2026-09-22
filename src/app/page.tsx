"use client";

import Link from "next/link";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { DynamicCarViewer } from "@/components/three/DynamicCarViewer";

export default function LandingPage() {
  const { user, loading, firebaseConfigured } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace("/play");
  }, [loading, user, router]);

  return (
    <main className="relative flex flex-1 flex-col overflow-hidden">
      <div className="absolute inset-0 -z-0 opacity-90">
        <DynamicCarViewer color="#c81e2c" performance={99} className="h-full w-full" zoom={1.35} controls={false} />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

      <div className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-end px-6 pb-20 pt-24 text-center sm:justify-center sm:pb-24">
        <motion.span
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass mb-6 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-muted"
        >
          Early Access — MVP
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-4xl font-semibold tracking-tight drop-shadow-sm sm:text-6xl"
        >
          Modern Life Simulator
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-5 max-w-xl text-balance text-base text-muted sm:text-lg"
        >
          Build a career, earn a salary, buy cars and property, grow a creator brand,
          and build a life in Dubai — one decision at a time.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-10 flex flex-col gap-3 sm:flex-row"
        >
          <Link href="/signup">
            <Button size="lg">Start your life</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="secondary">
              Log in
            </Button>
          </Link>
        </motion.div>
        {!firebaseConfigured && (
          <p className="mt-8 max-w-md text-xs text-warning">
            Firebase isn&apos;t configured yet — running in local guest mode. Saves will be
            stored in this browser only. Add your Firebase keys to .env.local to enable
            cloud accounts.
          </p>
        )}
      </div>
    </main>
  );
}
