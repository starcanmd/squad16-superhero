"use client";
import { useState } from "react";
import { LAB, PREP_TASKS } from "@/lib/public";
import { useLocal } from "@/lib/useLocal";
import type { Payload } from "@/lib/types";

// Extras attached to common checklist items by id (links, insights, buttons).
const EXTRAS: Record<string, { link?: { label: string; href: string }; insights?: { title: string; text: string }[]; openMe?: boolean }> = {
  "read-pack": { openMe: true },
  video: { link: PREP_TASKS.find((t) => t.id === "video")!.link },
  tpr: { link: PREP_TASKS.find((t) => t.id === "tpr")!.link, insights: PREP_TASKS.find((t) => t.id === "tpr")!.insights },
};

export default function ChecklistView({
  data,
  code,
  onData,
  onOpenMe,
  onLogin,
  busy,
  error,
}: {
  data: Payload | null;
  code: string;
  onData: (next: Payload) => void;
  onOpenMe: () => void;
  onLogin: (code: string) => void;
  busy: boolean;
  error: string | null;
}) {
  const [localDone, setLocalDone] = useLocal<Record<string, boolean>>("prep-done", {});
  const [pending, setPending] = useState<string | null>(null);
  const [draftCode, setDraftCode] = useState("");

  async function togglePersonal(id: string, value: boolean) {
    if (!data) return;
    const optimistic = { ...data.checks, [id]: value };
    onData({ ...data, checks: optimistic });
    setPending(id);
    try {
      const res = await fetch("/api/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, taskId: id, done: value }),
      });
      if (res.ok) {
        const j = await res.json();
        onData({ ...data, checks: j.checks });
      }
    } catch {}
    setPending(null);
  }

  const personal = !!data;
  const items = personal
    ? data!.checklist.map((c) => ({ id: c.id, title: c.title, detail: c.detail ?? "", ...(EXTRAS[c.id] ?? {}) }))
    : PREP_TASKS.map((t) => ({ id: t.id, title: t.title, detail: t.detail, link: t.link, insights: t.insights, openMe: t.id === "read-case" }));
  const checks = personal ? data!.checks : localDone;
  const done = items.filter((i) => checks[i.id]).length;

  return (
    <>
      <section className="hero wrap" style={{ paddingBottom: 8 }}>
        <div className="eyebrow">Before {LAB.date.split(",")[0]}</div>
        <h1 className="serif" style={{ fontSize: 40 }}>
          {personal ? `${data!.person.firstName}'s checklist` : "Checklist"}
        </h1>
        <p>
          {personal
            ? "Built for your role. Ticks save to the squad site, so Serim can see who is ready without asking."
            : "This is the list everyone shares. Enter the passcode Serim sent you and it becomes your own list, with the items for your role added and your ticks saved."}
        </p>
        {!personal && (
          <form
            className="inline-gate"
            onSubmit={(e) => {
              e.preventDefault();
              if (draftCode.trim()) onLogin(draftCode.trim());
            }}
          >
            <input
              type="text"
              placeholder="Passcode"
              value={draftCode}
              autoComplete="off"
              autoCapitalize="characters"
              aria-label="Passcode"
              className="code"
              onChange={(e) => setDraftCode(e.target.value)}
            />
            <button className="btn" type="submit" disabled={busy || !draftCode.trim()}>
              {busy ? "Checking" : "Show my list"}
            </button>
            {error && <span className="err">{error}</span>}
          </form>
        )}
      </section>

      <section className="section wrap">
        <div className="section-head">
          <h2 className="serif">
            {done} of {items.length} done
          </h2>
          <span className="meta">{personal ? "Saved to the site" : "Saved on this device only"}</span>
        </div>
        <div className="meter">
          <div style={{ width: `${(done / items.length) * 100}%` }} />
        </div>
        <div className="grid" style={{ marginTop: 14 }}>
          {items.map((t) => (
            <label key={t.id} className={`card task ${checks[t.id] ? "done" : ""}`}>
              <input
                type="checkbox"
                checked={!!checks[t.id]}
                disabled={pending === t.id}
                onChange={(e) =>
                  personal ? togglePersonal(t.id, e.target.checked) : setLocalDone({ ...localDone, [t.id]: e.target.checked })
                }
              />
              <div>
                <h3>{t.title}</h3>
                {t.detail && <p>{t.detail}</p>}
                {t.link && (
                  <p style={{ marginTop: 8 }}>
                    <a href={t.link.href} target="_blank" rel="noreferrer">
                      {t.link.label}
                    </a>
                  </p>
                )}
                {t.insights && (
                  <div className="insights">
                    <div className="label">Four ideas from the TPR Model for Wednesday</div>
                    {t.insights.map((i) => (
                      <div key={i.title} className="insight">
                        <b>{i.title}</b>
                        <p>{i.text}</p>
                      </div>
                    ))}
                  </div>
                )}
                {t.openMe && (
                  <p style={{ marginTop: 8 }}>
                    <button className="btn sm yellow" type="button" onClick={onOpenMe}>
                      Open Individual view
                    </button>
                  </p>
                )}
              </div>
            </label>
          ))}
        </div>
      </section>
    </>
  );
}
