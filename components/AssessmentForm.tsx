"use client";
import { useMemo, useState } from "react";
import { ASSESSMENT, ITEM_TEXT, type Rating, type Submission } from "@/lib/public";

const RATINGS: { v: Rating; label: string }[] = [
  { v: "S", label: "Strength" },
  { v: "I", label: "Improve" },
  { v: "N", label: "Not sure" },
];

export default function AssessmentForm({
  code,
  existing,
  onSaved,
}: {
  code: string;
  existing: Submission | null;
  onSaved: (s: Submission, checks: Record<string, boolean>) => void;
}) {
  const [ratings, setRatings] = useState<Record<string, Rating>>(existing?.ratings ?? {});
  const [topS, setTopS] = useState<string[]>(existing?.topStrengths ?? []);
  const [topI, setTopI] = useState<string[]>(existing?.topImprove ?? []);
  const [examples, setExamples] = useState<Record<string, string>>(existing?.examples ?? {});
  const [other, setOther] = useState(existing?.other ?? "");
  const [editing, setEditing] = useState(!existing);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const total = ASSESSMENT.reduce((n, c) => n + c.items.length, 0);
  const rated = Object.keys(ratings).length;
  const strengths = useMemo(() => Object.entries(ratings).filter(([, v]) => v === "S").map(([k]) => k), [ratings]);
  const improves = useMemo(() => Object.entries(ratings).filter(([, v]) => v === "I").map(([k]) => k), [ratings]);

  function pick(list: string[], set: (v: string[]) => void, id: string) {
    if (list.includes(id)) set(list.filter((x) => x !== id));
    else if (list.length < 2) set([...list, id]);
  }

  async function submit() {
    setErr(null);
    if (rated < total) return setErr(`Rate all ${total} items first. ${total - rated} left.`);
    if (topS.length !== 2 || topI.length !== 2) return setErr("Pick exactly 2 strengths and 2 areas to improve.");
    setBusy(true);
    try {
      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          submission: { ratings, topStrengths: topS, topImprove: topI, examples, other },
        }),
      });
      const j = await res.json();
      if (!res.ok) setErr(j.error ?? "Could not save.");
      else {
        onSaved(j.submission, j.checks);
        setEditing(false);
      }
    } catch {
      setErr("Could not reach the server.");
    }
    setBusy(false);
  }

  if (!editing && existing) {
    return (
      <section className="section wrap" id="assessment">
        <div className="section-head">
          <h2 className="serif">Team Assessment</h2>
          <span className="meta">Submitted {new Date(existing.submittedAt).toLocaleString()}</span>
        </div>
        <div className="grid grid-2">
          <div className="card green">
            <div className="label">Your top 2 strengths</div>
            {existing.topStrengths.map((id) => (
              <div key={id} className="pick">
                <b>{ITEM_TEXT[id]}</b>
                {existing.examples[id] && <p>{existing.examples[id]}</p>}
              </div>
            ))}
          </div>
          <div className="card rose">
            <div className="label">Your top 2 areas to improve</div>
            {existing.topImprove.map((id) => (
              <div key={id} className="pick">
                <b>{ITEM_TEXT[id]}</b>
                {existing.examples[id] && <p>{existing.examples[id]}</p>}
              </div>
            ))}
          </div>
        </div>
        <p style={{ marginTop: 12 }}>
          <button className="btn sm ghost" onClick={() => setEditing(true)}>
            Edit my answers
          </button>
        </p>
      </section>
    );
  }

  return (
    <section className="section wrap" id="assessment">
      <div className="section-head">
        <h2 className="serif">Team Assessment</h2>
        <span className="meta">
          {rated} of {total} rated
        </span>
      </div>
      <div className="lede">
        <p>
          Use the Assessment to identify the dynamics in your squad that in your opinion contribute to high team
          performance and those that in your opinion impede it. Your squad will discuss its performance in detail during
          the lab.
        </p>
        <p>Be honest in your assessment: member honesty is a key input to group emotional intelligence.</p>
        <p>
          After completing the assessment, select the 2 areas you see as the squad&apos;s top strengths and the 2 areas
          most in need of improvement.
        </p>
        <p>
          Be prepared to share your 2 top and 2 bottom areas and a brief explanation of why you chose them. You will
          have only 2 ½ minutes to share this, so think ahead about what you want to say.
        </p>
      </div>

      {ASSESSMENT.map((cat) => (
        <div key={cat.key} className="card" style={{ marginBottom: 12 }}>
          <div className="cat-head">
            <span className="cat-label">{cat.label}</span>
            <span className="cat-q">{cat.question}</span>
          </div>
          {cat.items.map((it) => (
            <div key={it.id} className="rate-row">
              <span className="rate-text">{it.text}</span>
              <span className="rate-opts" role="radiogroup" aria-label={it.text}>
                {RATINGS.map((r) => (
                  <button
                    key={r.v}
                    type="button"
                    className={`rate ${r.v} ${ratings[it.id] === r.v ? "on" : ""}`}
                    onClick={() => setRatings({ ...ratings, [it.id]: r.v })}
                  >
                    {r.label}
                  </button>
                ))}
              </span>
            </div>
          ))}
        </div>
      ))}

      <div className="grid grid-2" style={{ marginTop: 6 }}>
        <div className="card green">
          <div className="label">Pick top 2 areas of strength ({topS.length}/2)</div>
          {strengths.length === 0 ? (
            <p>Mark some items as Strength above first.</p>
          ) : (
            strengths.map((id) => (
              <div key={id}>
                <label className="check">
                  <input type="checkbox" checked={topS.includes(id)} onChange={() => pick(topS, setTopS, id)} />
                  <span>{ITEM_TEXT[id]}</span>
                </label>
                {topS.includes(id) && (
                  <textarea
                    className="notes sm"
                    placeholder="Why you chose this, in a sentence or two"
                    value={examples[id] ?? ""}
                    onChange={(e) => setExamples({ ...examples, [id]: e.target.value })}
                  />
                )}
              </div>
            ))
          )}
        </div>
        <div className="card rose">
          <div className="label">Pick top 2 areas to improve ({topI.length}/2)</div>
          {improves.length === 0 ? (
            <p>Mark some items as Improve above first.</p>
          ) : (
            improves.map((id) => (
              <div key={id}>
                <label className="check">
                  <input type="checkbox" checked={topI.includes(id)} onChange={() => pick(topI, setTopI, id)} />
                  <span>{ITEM_TEXT[id]}</span>
                </label>
                {topI.includes(id) && (
                  <textarea
                    className="notes sm"
                    placeholder="Why you chose this, in a sentence or two"
                    value={examples[id] ?? ""}
                    onChange={(e) => setExamples({ ...examples, [id]: e.target.value })}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="label">Anything not covered above that the squad should discuss (optional)</div>
        <textarea className="notes sm" value={other} onChange={(e) => setOther(e.target.value)} />
      </div>

      <p style={{ marginTop: 14, display: "flex", gap: 10, alignItems: "center" }}>
        <button className="btn" onClick={submit} disabled={busy}>
          {busy ? "Saving" : existing ? "Save changes" : "Submit assessment"}
        </button>
        {existing && (
          <button className="btn ghost" onClick={() => setEditing(false)}>
            Cancel
          </button>
        )}
        {err && <span className="err" style={{ marginTop: 0 }}>{err}</span>}
      </p>
    </section>
  );
}
