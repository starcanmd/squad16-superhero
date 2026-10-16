import { NextResponse } from "next/server";
import { checklistFor, authPerson, packFor, PEOPLE } from "@/lib/content";
import { getJSON, storeConfigured } from "@/lib/store";
import type { Submission } from "@/lib/public";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let code = "";
  try {
    const body = await req.json();
    code = String(body?.code ?? "");
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const person = authPerson(code);
  if (!person) {
    return NextResponse.json({ error: "That passcode is not on the Nightwalkers list." }, { status: 403 });
  }

  const { email: _e, ...safePerson } = person;

  const [checks, submission] = await Promise.all([
    getJSON<Record<string, boolean>>(`check:${person.key}`),
    getJSON<Submission>(`assess:${person.key}`),
  ]);

  const payload: Record<string, unknown> = {
    person: safePerson,
    pack: packFor(person),
    checklist: checklistFor(person),
    checks: checks ?? {},
    submission: submission ?? null,
    storeConfigured,
  };

  if (person.isLead) {
    payload.squad = PEOPLE.map((p) => ({
      key: p.key,
      name: p.name,
      firstName: p.firstName,
      side: p.side,
      character: p.character,
      playingRound: p.playingRound,
      partner: p.partner,
      goals: p.goals,
      tryThis: p.tryThis,
    }));
  }

  return NextResponse.json(payload, { headers: { "Cache-Control": "no-store" } });
}
