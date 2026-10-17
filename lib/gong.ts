"use client";

// The step-change chime: a short plucked-string phrase in a gypsy-jazz mood, played three
// times. It is synthesized once into a buffer (plucked-string model), then played back.
// Browsers only allow audio after a user gesture, so call armGong() from a click handler
// (Start, or the Timer tab) before relying on playGong().

let ctx: AudioContext | null = null;
let buffer: AudioBuffer | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

// Plucked string with a fractional delay line so each note is in tune, a soft pick,
// a per-note fade, and a loop loss that sets how fast it dies away.
function pluck(sr: number, freq: number, dur: number, gain: number, bright: number, loss: number): Float32Array {
  const n = Math.floor(sr * dur);
  const out = new Float32Array(n);
  const L = sr / freq - 0.5;
  const N = Math.floor(L);
  const frac = L - N;
  const M = N + 1;
  const buf = new Float32Array(M);
  for (let i = 0; i < M; i++) buf[i] = Math.random() * 2 - 1;
  for (let k = 0; k < 4; k++) for (let i = 1; i < M; i++) buf[i] = buf[i] * bright + buf[i - 1] * (1 - bright);
  let w = 0;
  for (let i = 0; i < n; i++) {
    const a0 = buf[w];
    const a1 = buf[(w + 1) % M];
    const a2 = buf[(w + 2) % M];
    const y = a0 * frac + a1 * (1 - frac);
    const nx = a1 * frac + a2 * (1 - frac);
    buf[w] = loss * 0.5 * (y + nx);
    w = (w + 1) % M;
    const fade = i > n - sr * 0.6 ? (n - i) / (sr * 0.6) : 1;
    out[i] = y * gain * fade;
  }
  return out;
}

type Note = [t: number, freq: number, len: number, gain: number, bright: number, loss: number];

const A3 = 220, C4 = 261.63, E4 = 329.63, Fs4 = 369.99, G4 = 392, A4 = 440;

function phrase(t0: number, g = 1): Note[] {
  return [
    [t0 + 0.0, A3, 1.6, 0.7 * g, 0.2, 0.99],
    [t0 + 0.14, C4, 1.5, 0.45 * g, 0.22, 0.99],
    [t0 + 0.28, E4, 1.5, 0.45 * g, 0.22, 0.99],
    [t0 + 0.42, A4, 1.8, 0.5 * g, 0.24, 0.99],
    [t0 + 1.05, G4, 1.4, 0.4 * g, 0.22, 0.99],
    [t0 + 1.25, Fs4, 2.2, 0.6 * g, 0.24, 0.991],
    [t0 + 1.25, A3, 2.2, 0.45 * g, 0.18, 0.991],
  ];
}

function render(c: AudioContext): AudioBuffer {
  const sr = c.sampleRate;
  const gap = 2.5;
  const notes = [...phrase(0), ...phrase(gap), ...phrase(gap * 2, 0.85)];
  const dur = gap * 2 + 3.6;
  const n = Math.floor(sr * dur);
  const s = new Float32Array(n);
  for (const [t, f, len, g, br, loss] of notes) {
    const p = pluck(sr, f, len, g, br, loss);
    const o = Math.floor(t * sr);
    for (let i = 0; i < p.length && o + i < n; i++) s[o + i] += p[i];
  }
  // Gentle low pass to take the top off.
  let y = 0;
  const a = 1 - Math.exp((-2 * Math.PI * 2200) / sr);
  for (let i = 0; i < n; i++) {
    y += a * (s[i] - y);
    s[i] = y;
  }
  let peak = 0;
  for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(s[i]));
  if (peak > 0) for (let i = 0; i < n; i++) s[i] *= 0.6 / peak;
  const b = c.createBuffer(1, n, sr);
  b.copyToChannel(s, 0);
  return b;
}

export function armGong() {
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") c.resume();
  if (!buffer) buffer = render(c);
}

export function playGong(volume = 0.9) {
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") c.resume();
  if (!buffer) buffer = render(c);
  const src = c.createBufferSource();
  src.buffer = buffer;
  const gain = c.createGain();
  gain.gain.value = volume;
  src.connect(gain);
  gain.connect(c.destination);
  src.start();
}
