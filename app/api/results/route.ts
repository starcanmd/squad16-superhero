import { NextResponse } from "next/server";
import { authPerson, PEOPLE, checklistFor } from "@/lib/content";
import { getMany, storeConfigured } from "@/lib/store";
import type { Submission } from "@/lib/public";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let code = "";
  try {
    const b = await req.json();
    code = String(b?.code ?? "");
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const person = authPerson(code);
  if (!person) return NextResponse.json({ error: "Passcode not recognized." }, { status: 403 });

  const keys = PEOPLE.map((p) => p.key);
  const [subs, checks] = await Promise.all([
    getMany<Submission>(keys.map((k) => `assess:${k}`)),
    getMany<Record<string, boolean>>(keys.map((k) => `check:${k}`)),
  ]);

  const people = PEOPLE.map((p, i) => ({
    key: p.key,
    name: p.name,
    firstName: p.firstName,
    submission: subs[i] ?? null,
    checks: checks[i] ?? {},
    checklistTotal: checklistFor(p).length,
  }));

  return NextResponse.json({ people, storeConfigured }, { headers: { "Cache-Control": "no-store" } });
}
