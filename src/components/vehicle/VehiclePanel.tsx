"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GameState } from "@/types/game";
import { useGameStore } from "@/hooks/useGameStore";
import { VEHICLE_LISTINGS, getVehicleListingById } from "@/data/vehicles";
import { PAINT_OPTIONS } from "@/data/vehicles/colors";
import { DynamicCarViewer } from "@/components/three/DynamicCarViewer";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StatBar } from "@/components/ui/StatBar";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils/format";

export function VehiclePanel({ state }: { state: GameState }) {
  const [view, setView] = useState<"garage" | "market">("garage");
  const [selectedId, setSelectedId] = useState<string | null>(
    state.activeVehicleListingId ?? state.vehicles[0]?.listingId ?? null,
  );
  const buyVehicle = useGameStore((s) => s.buyVehicle);
  const sellVehicle = useGameStore((s) => s.sellVehicle);
  const setActiveVehicle = useGameStore((s) => s.setActiveVehicle);
  const customizeVehiclePaint = useGameStore((s) => s.customizeVehiclePaint);

  const funds = state.finances.cash + state.finances.bank;
  const list = view === "garage" ? state.vehicles.map((v) => v.listingId) : VEHICLE_LISTINGS.map((v) => v.id);
  const effectiveSelectedId = selectedId && list.includes(selectedId) ? selectedId : (list[0] ?? null);

  const listing = effectiveSelectedId ? getVehicleListingById(effectiveSelectedId) : null;
  const owned = effectiveSelectedId ? state.vehicles.find((v) => v.listingId === effectiveSelectedId) : null;
  const isOwned = Boolean(owned);
  const isActive = state.activeVehicleListingId === effectiveSelectedId;
  const canAfford = listing ? funds >= listing.price : false;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Garage</h1>
          <p className="mt-1 text-sm text-muted">Browse, buy, and respray your vehicles.</p>
        </div>
        <div className="glass flex gap-1 rounded-full p-1">
          <Button
            size="sm"
            variant={view === "garage" ? "primary" : "ghost"}
            onClick={() => {
              setView("garage");
              setSelectedId(state.vehicles[0]?.listingId ?? null);
            }}
          >
            My Garage
          </Button>
          <Button
            size="sm"
            variant={view === "market" ? "primary" : "ghost"}
            onClick={() => {
              setView("market");
              setSelectedId(VEHICLE_LISTINGS[0]?.id ?? null);
            }}
          >
            Dealership
          </Button>
        </div>
      </div>

      {!listing && (
        <p className="text-sm text-muted">
          {view === "garage" ? "Your garage is empty. Visit the dealership." : "No vehicles available."}
        </p>
      )}

      {listing && (
        <Card className="overflow-hidden">
          <div className="relative h-[320px] w-full sm:h-[420px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={listing.id + (owned?.customization.color ?? listing.defaultColor)}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <DynamicCarViewer
                  color={owned?.customization.color ?? listing.defaultColor}
                  performance={listing.performance}
                  bodyStyle={listing.bodyStyle}
                  className="h-full w-full"
                />
              </motion.div>
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/60">{listing.year}</p>
                <h2 className="text-2xl font-semibold text-white drop-shadow-sm">
                  {listing.brand} {listing.model}
                </h2>
              </div>
              {isActive && (
                <Badge tone="accent" className="pointer-events-auto">
                  Active
                </Badge>
              )}
            </div>
          </div>

          <CardContent className="space-y-4 pt-4">
            <StatBar label="Performance" value={listing.performance} colorClassName="bg-accent" />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xl font-semibold">{formatCurrency(listing.price)}</p>
              <p className="text-xs text-muted">
                Fuel {formatCurrency(listing.fuelCostPerMonth)}/mo · Maintenance{" "}
                {formatCurrency(listing.maintenanceCostPerMonth)}/mo · Insurance{" "}
                {formatCurrency(listing.insuranceCostPerMonth)}/mo
              </p>
            </div>

            {isOwned && owned && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Respray</p>
                <div className="flex flex-wrap gap-2">
                  {PAINT_OPTIONS.map((paint) => (
                    <button
                      key={paint.hex}
                      title={paint.name}
                      onClick={() => customizeVehiclePaint(owned.listingId, paint.hex)}
                      className={cn(
                        "h-8 w-8 rounded-full border-2 transition-transform hover:scale-110",
                        owned.customization.color === paint.hex ? "border-accent scale-110" : "border-white/30",
                      )}
                      style={{ backgroundColor: paint.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-1">
              {!isOwned && (
                <Button disabled={!canAfford} onClick={() => buyVehicle(listing.id)}>
                  {canAfford ? "Buy" : "Not enough funds"}
                </Button>
              )}
              {isOwned && owned && !isActive && (
                <Button variant="secondary" onClick={() => setActiveVehicle(owned.listingId)}>
                  Drive This
                </Button>
              )}
              {isOwned && owned && (
                <Button variant="danger" onClick={() => sellVehicle(owned.listingId)}>
                  Sell for {formatCurrency(Math.round(owned.currentValue * 0.85))}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
        {list.map((id, index) => {
          const l = getVehicleListingById(id)!;
          const ownedEntry = state.vehicles.find((v) => v.listingId === id);
          const active = state.activeVehicleListingId === id;
          return (
            <motion.button
              key={id}
              onClick={() => setSelectedId(id)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.03 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.96 }}
              className={cn(
                "glass flex flex-col items-start gap-1 rounded-2xl p-3 text-left transition-shadow",
                effectiveSelectedId === id && "ring-2 ring-accent",
              )}
            >
              <div
                className="mb-1 h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: ownedEntry?.customization.color ?? l.defaultColor }}
              />
              <p className="text-xs font-semibold leading-tight">{l.brand}</p>
              <p className="text-[11px] text-muted leading-tight">{l.model}</p>
              <div className="mt-1 flex w-full items-center justify-between">
                <span className="text-[10px] text-muted">{formatCurrency(l.price)}</span>
                {active && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
