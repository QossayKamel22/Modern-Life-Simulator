"use client";

import { useState } from "react";
import type { GameState } from "@/types/game";
import { useGameStore } from "@/hooks/useGameStore";
import { VEHICLE_LISTINGS, getVehicleListingById } from "@/data/vehicles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StatBar } from "@/components/ui/StatBar";
import { formatCurrency } from "@/lib/utils/format";

export function VehiclePanel({ state }: { state: GameState }) {
  const [view, setView] = useState<"garage" | "market">("garage");
  const buyVehicle = useGameStore((s) => s.buyVehicle);
  const sellVehicle = useGameStore((s) => s.sellVehicle);
  const setActiveVehicle = useGameStore((s) => s.setActiveVehicle);

  const funds = state.finances.cash + state.finances.bank;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Garage</h1>
          <p className="mt-1 text-sm text-muted">Buy, sell, and manage your vehicles.</p>
        </div>
        <div className="flex gap-1 rounded-xl border border-border p-1">
          <Button size="sm" variant={view === "garage" ? "primary" : "ghost"} onClick={() => setView("garage")}>
            My Garage
          </Button>
          <Button size="sm" variant={view === "market" ? "primary" : "ghost"} onClick={() => setView("market")}>
            Dealership
          </Button>
        </div>
      </div>

      {view === "garage" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {state.vehicles.length === 0 && (
            <p className="text-sm text-muted">Your garage is empty. Visit the dealership.</p>
          )}
          {state.vehicles.map((owned) => {
            const listing = getVehicleListingById(owned.listingId);
            if (!listing) return null;
            const isActive = state.activeVehicleListingId === owned.listingId;
            return (
              <Card key={owned.listingId}>
                <CardHeader>
                  <CardTitle>{listing.brand} {listing.model}</CardTitle>
                  {isActive && <Badge tone="accent">Active</Badge>}
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted">{listing.year} · {owned.condition}</p>
                  <StatBar label="Performance" value={listing.performance} colorClassName="bg-accent" />
                  <p className="text-sm font-semibold">{formatCurrency(owned.currentValue)}</p>
                  <div className="flex flex-wrap gap-2">
                    {!isActive && (
                      <Button size="sm" variant="secondary" onClick={() => setActiveVehicle(owned.listingId)}>
                        Drive This
                      </Button>
                    )}
                    <Button size="sm" variant="danger" onClick={() => sellVehicle(owned.listingId)}>
                      Sell
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {view === "market" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {VEHICLE_LISTINGS.map((listing) => {
            const owned = state.vehicles.some((v) => v.listingId === listing.id);
            const canAfford = funds >= listing.price;
            return (
              <Card key={listing.id}>
                <CardHeader>
                  <CardTitle>{listing.brand} {listing.model}</CardTitle>
                  <Badge tone="neutral">{listing.year}</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <StatBar label="Performance" value={listing.performance} colorClassName="bg-accent" />
                  <p className="text-lg font-semibold">{formatCurrency(listing.price)}</p>
                  <p className="text-xs text-muted">
                    Fuel {formatCurrency(listing.fuelCostPerMonth)}/mo · Maintenance{" "}
                    {formatCurrency(listing.maintenanceCostPerMonth)}/mo
                  </p>
                  <Button className="w-full" disabled={owned || !canAfford} onClick={() => buyVehicle(listing.id)}>
                    {owned ? "Owned" : canAfford ? "Buy" : "Not enough funds"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
