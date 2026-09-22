"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GameState } from "@/types/game";
import { useGameStore } from "@/hooks/useGameStore";
import { getPropertyListingsForCity, getPropertyListingById } from "@/data/properties";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils/format";
import { getPropertyImageUrl } from "@/lib/utils/images";

const TYPE_LABELS: Record<string, string> = {
  studio: "Studio",
  apartment: "Apartment",
  townhouse: "Townhouse",
  villa: "Villa",
  commercial: "Commercial",
  land: "Land",
};

function PropertyPhoto({ listing }: { listing: ReturnType<typeof getPropertyListingById> }) {
  if (!listing) return null;
  return (
    <div className="relative h-40 w-full overflow-hidden">
      <motion.img
        src={getPropertyImageUrl(listing)}
        alt={listing.name}
        loading="lazy"
        className="h-full w-full object-cover"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.06 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
    </div>
  );
}

const gridEntrance = (index: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, delay: Math.min(index * 0.05, 0.4) },
});

export function PropertyPanel({ state }: { state: GameState }) {
  const [view, setView] = useState<"market" | "owned">("owned");
  const buyProperty = useGameStore((s) => s.buyProperty);
  const sellProperty = useGameStore((s) => s.sellProperty);
  const rentOutProperty = useGameStore((s) => s.rentOutProperty);
  const stopRentingProperty = useGameStore((s) => s.stopRentingProperty);
  const renovateProperty = useGameStore((s) => s.renovateProperty);

  const listings = getPropertyListingsForCity(state.city.currentCityId);
  const funds = state.finances.cash + state.finances.bank;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Property</h1>
          <p className="mt-1 text-sm text-muted">Buy, rent out, and renovate real estate.</p>
        </div>
        <div className="glass flex gap-1 rounded-full p-1">
          <Button size="sm" variant={view === "owned" ? "primary" : "ghost"} onClick={() => setView("owned")}>
            My Properties
          </Button>
          <Button size="sm" variant={view === "market" ? "primary" : "ghost"} onClick={() => setView("market")}>
            Marketplace
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === "owned" && (
          <motion.div
            key="owned"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            {state.properties.length === 0 && (
              <p className="text-sm text-muted">You don&apos;t own any property yet. Check the marketplace.</p>
            )}
            {state.properties.map((owned, index) => {
              const listing = getPropertyListingById(owned.listingId);
              if (!listing) return null;
              return (
                <motion.div key={owned.listingId} {...gridEntrance(index)}>
                  <Card className="overflow-hidden">
                    <PropertyPhoto listing={listing} />
                    <CardHeader>
                      <CardTitle>{listing.name}</CardTitle>
                      <Badge tone={owned.status === "rentedOut" ? "success" : owned.status === "primaryResidence" ? "accent" : "neutral"}>
                        {owned.status === "primaryResidence" ? "Home" : owned.status === "rentedOut" ? "Rented Out" : "Vacant"}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted">
                        {TYPE_LABELS[listing.type]} · {listing.sizeSqm} sqm · {listing.rooms} rooms
                      </p>
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm text-muted">Current value</span>
                        <span className="font-semibold">{formatCurrency(owned.currentValue)}</span>
                      </div>
                      {listing.monthlyRent > 0 && (
                        <div className="flex items-baseline justify-between text-sm">
                          <span className="text-muted">Rent potential</span>
                          <span>{formatCurrency(listing.monthlyRent)}/mo</span>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {owned.status !== "primaryResidence" && listing.monthlyRent > 0 && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() =>
                              owned.status === "rentedOut"
                                ? stopRentingProperty(owned.listingId)
                                : rentOutProperty(owned.listingId)
                            }
                          >
                            {owned.status === "rentedOut" ? "Stop Renting" : "Rent Out"}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => renovateProperty(owned.listingId, { interiorStyle: "modern" })}
                        >
                          Renovate (8,000 AED)
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => sellProperty(owned.listingId)}>
                          Sell
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {view === "market" && (
          <motion.div
            key="market"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            {listings.map((listing, index) => {
              const owned = state.properties.some((p) => p.listingId === listing.id);
              const canAfford = funds >= listing.price;
              return (
                <motion.div key={listing.id} {...gridEntrance(index)}>
                  <Card className="overflow-hidden">
                    <PropertyPhoto listing={listing} />
                    <CardHeader>
                      <CardTitle>{listing.name}</CardTitle>
                      <Badge tone="neutral">{TYPE_LABELS[listing.type]}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted">
                        {listing.sizeSqm} sqm · {listing.rooms} rooms · {listing.condition}
                      </p>
                      <p className="text-lg font-semibold">{formatCurrency(listing.price)}</p>
                      {listing.monthlyRent > 0 && (
                        <p className="text-xs text-muted">Rent potential: {formatCurrency(listing.monthlyRent)}/mo</p>
                      )}
                      <Button
                        className="w-full"
                        disabled={owned || !canAfford}
                        onClick={() => buyProperty(listing.id)}
                      >
                        {owned ? "Owned" : canAfford ? "Buy" : "Not enough funds"}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
