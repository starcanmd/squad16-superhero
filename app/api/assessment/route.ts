import { NextResponse } from "next/server";
import { findPerson } from "@/lib/content";
import { setJSON, getJSON } from "@/lib/store";
import { ALL_ITEMS, type Submission } from "@/lib/public";

export const runtime = "nodejs";

const VALID = new Set(ALL_ITEMS.map((i) => i.id));

export async function POST(req: Request) {
  let email = "", data: Partial<Submission> = {};
  try {
    const b = await req.json();
    email = String(b?.email ?? "");
    data = b?.submission ?? {};
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const person = findPerson(email);
  if (!person) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const ratings: Submission["ratings"] = {};
  for (const [k, v] of Object.entries(data.ratings ?? {})) {
    if (VALID.has(k) && (v === "S" || v === "I" || v === "N")) ratings[k] = v;
  }
  const clean = (arr?: string[]) => (arr ?? []).filter((x) => VALID.has(x)).slice(0, 2);
  const examples: Record<string, string> = {};
  for (const [k, v] of Object.entries(data.examples ?? {})) {
    if (VALID.has(k) && typeof v === "string") examples[k] = v.slice(0, 1000);
  }

  const submission: Submission = {
    ratings,
    topStrengths: clean(data.topStrengths),
    topImprove: clean(data.topImprove),
    examples,
    other: typeof data.other === "string" ? data.other.slice(0, 1500) : undefined,
    submittedAt: new Date().toISOString(),
  };

  if (Object.keys(ratings).length < ALL_ITEMS.length) {
    return NextResponse.json({ error: "Rate every item before submitting." }, { status: 400 });
  }
  if (submission.topStrengths.length !== 2 || submission.topImprove.length !== 2) {
    return NextResponse.json({ error: "Pick exactly 2 strengths and 2 areas to improve." }, { status: 400 });
  }

  await setJSON(`assess:${person.key}`, submission);
  // also mark the checklist item
  const ck = `check:${person.key}`;
  const current = (await getJSON<Record<string, boolean>>(ck)) ?? {};
  current["assessment"] = true;
  await setJSON(ck, current);

  return NextResponse.json({ submission, checks: current }, { headers: { "Cache-Control": "no-store" } });
}
