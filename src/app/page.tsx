"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  const { user, loading, firebaseConfigured } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace("/play");
  }, [loading, user, router]);

  return (
    <main className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <span className="mb-6 inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium text-muted">
          Early Access — MVP
        </span>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
          Modern Life Simulator
        </h1>
        <p className="mt-5 max-w-xl text-balance text-base text-muted sm:text-lg">
          Build a career, earn a salary, buy cars and property, grow a creator brand,
          and build a life in Dubai — one decision at a time.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/signup">
            <Button size="lg">Start your life</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="secondary">
              Log in
            </Button>
          </Link>
        </div>
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
