import { NextResponse } from "next/server";
import { authPerson } from "@/lib/content";
import { getJSON, setJSON, storeConfigured } from "@/lib/store";
import type { TimerState } from "@/lib/timer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KEY = "timer";

// Anyone can read the timer. Only the lab lead can write it.
export async function GET() {
  const state = await getJSON<TimerState>(KEY);
  return NextResponse.json({ state, now: Date.now(), storeConfigured }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  let code = "";
  let s: Partial<TimerState> = {};
  try {
    const b = await req.json();
    code = String(b?.code ?? "");
    s = b?.state ?? {};
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const person = authPerson(code);
  if (!person?.isLead) return NextResponse.json({ error: "Lead only" }, { status: 403 });

  const now = Date.now();
  const state: TimerState = {
    idx: Math.max(0, Number(s.idx) || 0),
    running: Boolean(s.running),
    // The lead sends remaining seconds; the server fixes endsAt on its own clock.
    endsAt: s.running ? now + (Number(s.remaining) || 0) * 1000 : null,
    remaining: Number(s.remaining) || 0,
    auto: s.auto !== false,
    updatedAt: now,
  };
  await setJSON(KEY, state);
  return NextResponse.json({ state, now }, { headers: { "Cache-Control": "no-store" } });
}
