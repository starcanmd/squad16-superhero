// Shared timer state, published by the lab lead and read by everyone.
// `endsAt` is an absolute server-time epoch (ms) so viewers stay in sync regardless of polling lag.
export type TimerState = {
  idx: number;
  running: boolean;
  endsAt: number | null; // set while running
  remaining: number; // seconds, meaningful while paused
  auto: boolean;
  sound: boolean; // the lead's gong setting, followed by every viewer
  updatedAt: number;
};

// Resolve what viewers should show at time `now`, walking forward through auto advances
// so the shared clock keeps moving even between the lead's publishes.
export function resolveTimer(s: TimerState, now: number, minutes: number[]): { idx: number; remaining: number } {
  if (!s.running || s.endsAt === null) return { idx: s.idx, remaining: s.remaining };
  let idx = s.idx;
  let endsAt = s.endsAt;
  while (s.auto && now >= endsAt && idx < minutes.length - 1) {
    idx += 1;
    endsAt += minutes[idx] * 60 * 1000;
  }
  return { idx, remaining: Math.round((endsAt - now) / 1000) };
}
