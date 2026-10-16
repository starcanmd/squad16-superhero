"use client";

// A synthesized gong. Browsers only allow audio after a user gesture, so call
// armGong() from a click handler (Start) before relying on playGong().

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

export function armGong() {
  const c = getCtx();
  if (c && c.state === "suspended") c.resume();
}

export function playGong(volume = 0.9) {
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") c.resume();
  const t0 = c.currentTime;

  const master = c.createGain();
  // Soft bloom instead of a hard strike, then a long even tail.
  master.gain.setValueAtTime(0.0001, t0);
  master.gain.exponentialRampToValueAtTime(volume * 0.7, t0 + 0.06);
  master.gain.exponentialRampToValueAtTime(volume, t0 + 0.35);
  master.gain.exponentialRampToValueAtTime(volume * 0.5, t0 + 2.5);
  master.gain.exponentialRampToValueAtTime(0.0001, t0 + 9);

  // A gentle low pass takes the edge off the attack so it reads as metal, not a beep.
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(2600, t0);
  lp.frequency.exponentialRampToValueAtTime(700, t0 + 6);
  lp.Q.value = 0.5;

  master.connect(lp);
  lp.connect(c.destination);

  // Deeper fundamental that carries the tone, with a few warm overtones.
  // Ratios sit close to a singing bowl, which reads calm but still fills a room.
  const base = 82;
  const partials: [number, number, number][] = [
    // ratio, relative gain, decay seconds
    [1.0, 1.0, 9.0],
    [1.5, 0.3, 7.5],
    [2.0, 0.45, 7.0],
    [2.72, 0.28, 6.0],
    [3.0, 0.2, 5.5],
    [4.08, 0.14, 4.5],
    [5.2, 0.08, 3.5],
    [6.6, 0.04, 2.5],
  ];

  for (const [ratio, g, decay] of partials) {
    const osc = c.createOscillator();
    osc.type = "sine";
    const f = base * ratio;
    osc.frequency.setValueAtTime(f * 1.004, t0);
    osc.frequency.exponentialRampToValueAtTime(f, t0 + 0.4);

    // Slow beating between near-identical partials makes the sustain swell.
    const osc2 = c.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(f * 1.0035, t0);

    const env = c.createGain();
    env.gain.setValueAtTime(0.0001, t0);
    env.gain.exponentialRampToValueAtTime(g * 0.5, t0 + 0.05 + ratio * 0.01);
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + decay);

    osc.connect(env);
    osc2.connect(env);
    env.connect(master);
    osc.start(t0);
    osc2.start(t0);
    osc.stop(t0 + decay + 0.1);
    osc2.stop(t0 + decay + 0.1);
  }

  // Short noise burst for the mallet strike.
  const len = Math.floor(c.sampleRate * 0.05);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const noise = c.createBufferSource();
  noise.buffer = buf;
  const nGain = c.createGain();
  nGain.gain.setValueAtTime(0.08, t0);
  nGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.06);
  const nFilter = c.createBiquadFilter();
  nFilter.type = "bandpass";
  nFilter.frequency.value = 900;
  nFilter.Q.value = 1.2;
  noise.connect(nFilter);
  nFilter.connect(nGain);
  nGain.connect(master);
  noise.start(t0);
}
