"use client";

import { useState } from "react";
import type { ContentNiche, GameState } from "@/types/game";
import { useGameStore } from "@/hooks/useGameStore";
import { CONTENT_NICHES } from "@/data/content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils/format";

export function CreatorPanel({ state }: { state: GameState }) {
  const createChannel = useGameStore((s) => s.createChannel);
  const createContent = useGameStore((s) => s.createContent);
  const [name, setName] = useState("");
  const [niche, setNiche] = useState<ContentNiche>("technology");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Creator</h1>
        <p className="mt-1 text-sm text-muted">Build a content brand and grow an audience.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {state.creator.channels.map((channel) => (
          <Card key={channel.id}>
            <CardHeader>
              <CardTitle>{channel.name}</CardTitle>
              <Badge tone="accent">{CONTENT_NICHES.find((n) => n.id === channel.niche)?.label}</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-2xl font-semibold">{channel.followers.toLocaleString()} followers</p>
              <p className="text-xs text-muted">
                {channel.totalViews.toLocaleString()} views · {channel.videosPosted} videos posted
              </p>
              <p className="text-sm font-medium text-success">{formatCurrency(channel.revenue)} earned</p>
              <Button className="w-full" size="sm" onClick={() => createContent(channel.id)}>
                Create Content (2h)
              </Button>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader>
            <CardTitle>Launch a Channel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Channel name" value={name} onChange={(e) => setName(e.target.value)} />
            <div className="flex flex-wrap gap-2">
              {CONTENT_NICHES.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setNiche(n.id)}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    niche === n.id ? "border-accent bg-accent text-accent-foreground" : "border-border text-muted"
                  }`}
                >
                  {n.label}
                </button>
              ))}
            </div>
            <Button
              className="w-full"
              disabled={!name.trim()}
              onClick={() => {
                createChannel(name.trim(), niche);
                setName("");
              }}
            >
              Launch Channel
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
