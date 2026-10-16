"use client";
import { useState } from "react";
import type { CheckItem } from "@/lib/types";

export default function Checklist({
  email,
  items,
  checks,
  onChange,
}: {
  email: string;
  items: CheckItem[];
  checks: Record<string, boolean>;
  onChange: (next: Record<string, boolean>) => void;
}) {
  const [pending, setPending] = useState<string | null>(null);
  const done = items.filter((i) => checks[i.id]).length;

  async function toggle(id: string, value: boolean) {
    const optimistic = { ...checks, [id]: value };
    onChange(optimistic);
    setPending(id);
    try {
      const res = await fetch("/api/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, taskId: id, done: value }),
      });
      if (res.ok) {
        const j = await res.json();
        onChange(j.checks);
      }
    } catch {}
    setPending(null);
  }

  return (
    <section className="section wrap">
      <div className="section-head">
        <h2 className="serif">Your checklist</h2>
        <span className="meta">
          {done} of {items.length} done
        </span>
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
              onChange={(e) => toggle(t.id, e.target.checked)}
            />
            <div>
              <h3>{t.title}</h3>
              {t.detail && <p>{t.detail}</p>}
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}
