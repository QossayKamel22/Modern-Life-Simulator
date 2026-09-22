"use client";

// Lightweight synthesized sound effects (Web Audio oscillators) — no external
// audio files to license or fetch, and near-zero bundle cost.

const STORAGE_KEY = "mls_sound_enabled";
let ctx: AudioContext | null = null;

export function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return true;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === null ? true : stored === "true";
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, String(enabled));
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!ctx) ctx = new AudioCtx();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(freq: number, duration: number, delay = 0, type: OscillatorType = "sine", peakGain = 0.16) {
  const audio = getCtx();
  if (!audio || !isSoundEnabled()) return;
  const start = audio.currentTime + delay;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(peakGain, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

export function playClick() {
  tone(520, 0.06, 0, "sine", 0.08);
}

export function playConfirm() {
  tone(660, 0.09, 0, "sine", 0.12);
  tone(880, 0.12, 0.06, "sine", 0.1);
}

export function playError() {
  tone(180, 0.18, 0, "sawtooth", 0.1);
}

export function playCash() {
  [660, 880, 1100].forEach((freq, i) => tone(freq, 0.1, i * 0.05, "triangle", 0.1));
}

export function playFanfare() {
  [523, 659, 784, 1047].forEach((freq, i) => tone(freq, 0.22, i * 0.09, "triangle", 0.13));
}

export function playWhoosh() {
  tone(300, 0.25, 0, "sine", 0.05);
}
