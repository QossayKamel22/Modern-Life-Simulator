"use client";

import { useState } from "react";
import type { Character, Gender } from "@/types/game";
import { createDefaultCharacter } from "@/game/initialState";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/format";

const HAIRSTYLES = ["short", "buzz", "curly", "long", "bald"];
const HAIR_COLORS = ["black", "brown", "blonde", "red", "gray"];
const BODY_TYPES = ["slim", "average", "athletic", "heavy"];
const CLOTHING = ["casual", "business", "streetwear", "sportswear"];
const BEARDS = ["none", "stubble", "short", "full"];

interface OptionRowProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

function OptionRow({ label, options, value, onChange }: OptionRowProps) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm capitalize transition-all duration-200",
              value === option
                ? "bg-accent text-accent-foreground shadow-[0_4px_14px_-4px_var(--accent)]"
                : "glass text-foreground hover:bg-white/10",
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CharacterCreator({ onComplete }: { onComplete: (character: Character) => void }) {
  const [character, setCharacter] = useState<Character>(createDefaultCharacter(""));

  function update<K extends keyof Character>(key: K, value: Character[K]) {
    setCharacter((c) => ({ ...c, [key]: value }));
  }

  function handleSubmit() {
    if (!character.name.trim()) return;
    onComplete(character);
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-12">
      <Card className="w-full max-w-lg">
        <CardContent className="space-y-6 pt-6">
          <div>
            <h1 className="text-xl font-semibold">Create your character</h1>
            <p className="mt-1 text-sm text-muted">This is who you&apos;ll be building a life as.</p>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Name</p>
            <Input
              placeholder="Your character's name"
              value={character.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Age</p>
              <Input
                type="number"
                min={18}
                max={70}
                value={character.age}
                onChange={(e) => update("age", Number(e.target.value))}
              />
            </div>
            <OptionRow
              label="Gender"
              options={["male", "female"]}
              value={character.gender}
              onChange={(v) => update("gender", v as Gender)}
            />
          </div>

          <OptionRow label="Hairstyle" options={HAIRSTYLES} value={character.hairstyle} onChange={(v) => update("hairstyle", v)} />
          <OptionRow label="Hair color" options={HAIR_COLORS} value={character.hairColor} onChange={(v) => update("hairColor", v)} />
          <OptionRow label="Beard" options={BEARDS} value={character.beard} onChange={(v) => update("beard", v)} />
          <OptionRow label="Body type" options={BODY_TYPES} value={character.bodyType} onChange={(v) => update("bodyType", v)} />
          <OptionRow label="Clothing" options={CLOTHING} value={character.clothing} onChange={(v) => update("clothing", v)} />

          <Button className="w-full" size="lg" onClick={handleSubmit} disabled={!character.name.trim()}>
            Begin your life
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
