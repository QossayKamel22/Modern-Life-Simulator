"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useGameStore } from "@/hooks/useGameStore";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { getOrCreateLocalUser } from "@/lib/game/localAuth";
import { signOut } from "@/lib/firebase/auth";
import { CharacterCreator } from "@/components/character/CharacterCreator";
import { GameShell, type Tab } from "@/components/layout/GameShell";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { CareerPanel } from "@/components/career/CareerPanel";
import { FinancePanel } from "@/components/finance/FinancePanel";
import { PropertyPanel } from "@/components/property/PropertyPanel";
import { VehiclePanel } from "@/components/vehicle/VehiclePanel";
import { CreatorPanel } from "@/components/creator/CreatorPanel";
import { FitnessPanel } from "@/components/fitness/FitnessPanel";
import { CityPanel } from "@/components/city/CityPanel";
import { Toast } from "@/components/ui/Toast";

export default function PlayPage() {
  const router = useRouter();
  const { user, loading, firebaseConfigured } = useAuth();
  const { state, status, lastMessage, init, createCharacter, reset } = useGameStore();
  const [tab, setTab] = useState<Tab>("dashboard");

  useEffect(() => {
    if (loading) return;
    if (firebaseConfigured) {
      if (!user) {
        router.replace("/login");
        return;
      }
      init(user.uid, user.displayName ?? "Player");
    } else {
      const local = getOrCreateLocalUser();
      init(local.uid, local.displayName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user, firebaseConfigured]);

  async function handleLogout() {
    reset();
    if (isFirebaseConfigured) await signOut();
    router.replace("/");
  }

  if (loading || status === "idle" || status === "loading") {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted">Loading your life…</p>
      </main>
    );
  }

  if (status === "needsCharacter") {
    return <CharacterCreator onComplete={createCharacter} />;
  }

  if (!state) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted">Something went wrong loading your save.</p>
      </main>
    );
  }

  return (
    <GameShell state={state} activeTab={tab} onTabChange={setTab} onLogout={handleLogout}>
      {tab === "dashboard" && <Dashboard state={state} />}
      {tab === "career" && <CareerPanel state={state} />}
      {tab === "finance" && <FinancePanel state={state} />}
      {tab === "property" && <PropertyPanel state={state} />}
      {tab === "vehicle" && <VehiclePanel state={state} />}
      {tab === "creator" && <CreatorPanel state={state} />}
      {tab === "fitness" && <FitnessPanel state={state} />}
      {tab === "city" && <CityPanel state={state} />}
      <Toast message={lastMessage} />
    </GameShell>
  );
}
