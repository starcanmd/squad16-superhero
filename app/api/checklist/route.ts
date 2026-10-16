import { NextResponse } from "next/server";
import { authPerson } from "@/lib/content";
import { getJSON, setJSON } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let code = "", taskId = "", done = false;
  try {
    const b = await req.json();
    code = String(b?.code ?? "");
    taskId = String(b?.taskId ?? "");
    done = Boolean(b?.done);
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const person = authPerson(code);
  if (!person || !taskId) return NextResponse.json({ error: "Passcode not recognized." }, { status: 403 });

  const key = `check:${person.key}`;
  const current = (await getJSON<Record<string, boolean>>(key)) ?? {};
  current[taskId] = done;
  await setJSON(key, current);
  return NextResponse.json({ checks: current }, { headers: { "Cache-Control": "no-store" } });
}
