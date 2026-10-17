"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ASSESSMENT, ITEM_TEXT, type Rating } from "@/lib/public";
import type { Results } from "@/lib/types";

export default function ResultsView({ code }: { code: string }) {
  const [data, setData] = useState<Results | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) throw new Error();
      setData(await res.json());
      setErr(null);
    } catch {
      setErr("Could not load results.");
    }
  }, [code]);

  useEffect(() => {
    load();
    const t = window.setInterval(load, 20000);
    return () => window.clearInterval(t);
  }, [load]);

  const submitted = useMemo(() => (data?.people ?? []).filter((p) => p.submission), [data]);

  const counts = useMemo(() => {
    const c: Record<string, Record<Rating, number>> = {};
    for (const cat of ASSESSMENT) for (const it of cat.items) c[it.id] = { S: 0, I: 0, N: 0 };
    for (const p of submitted) for (const [id, r] of Object.entries(p.submission!.ratings)) if (c[id]) c[id][r]++;
    return c;
  }, [submitted]);

  const noms = useMemo(() => {
    const s: Record<string, string[]> = {};
    const i: Record<string, string[]> = {};
    for (const p of submitted) {
      for (const id of p.submission!.topStrengths) (s[id] ??= []).push(p.firstName);
      for (const id of p.submission!.topImprove) (i[id] ??= []).push(p.firstName);
    }
    const sort = (o: Record<string, string[]>) => Object.entries(o).sort((a, b) => b[1].length - a[1].length);
    return { s: sort(s), i: sort(i) };
  }, [submitted]);

  if (err) return <div className="gate wrap"><p className="err">{err}</p></div>;
  if (!data) return <div className="gate wrap"><p>Loading</p></div>;

  const n = submitted.length;

  return (
    <>
      <section className="hero wrap" style={{ paddingBottom: 12 }}>
        <div className="eyebrow">Team Assessment results</div>
        <h1 className="serif" style={{ fontSize: 40 }}>
          {n} of {data.people.length} submitted
        </h1>
        <div className="chips">
          {data.people.map((p) => (
            <span key={p.key} className={`chip ${p.submission ? "green" : ""}`}>
              {p.firstName}
            </span>
          ))}
        </div>
        {!data.storeConfigured && (
          <p className="warn">
            Shared storage is not configured on this deployment, so submissions are not being kept between visits. Add
            Upstash Redis in the Vercel Storage tab. See the README.
          </p>
        )}
      </section>

      <section className="section wrap">
        <div className="section-head stacked">
          <h2 className="serif">What people nominated</h2>
          <p className="subtitle">
            This shows top 2 picks per person. Use these to vote on the one strength and one area of improvement to
            discuss today.
          </p>
        </div>
        <div className="grid grid-2">
          <div className="card green">
            <div className="label">Nominated areas of strength</div>
            {noms.s.length === 0 ? <p>None yet.</p> : noms.s.map(([id, who]) => <Nom key={id} id={id} who={who} />)}
          </div>
          <div className="card rose">
            <div className="label">Nominated areas of improvement</div>
            {noms.i.length === 0 ? <p>None yet.</p> : noms.i.map(([id, who]) => <Nom key={id} id={id} who={who} />)}
          </div>
        </div>
      </section>

      <section className="section wrap">
        <div className="section-head stacked">
          <h2 className="serif">Items from the team assessment</h2>
          <p className="subtitle">
            Each bar shows how the squad rated that item. Green is the share who called it a strength, rose the share who
            said it needs improvement, grey the share who were not sure. The numbers on the right are the counts in the
            same order.
          </p>
        </div>
        {ASSESSMENT.map((cat) => (
          <div key={cat.key} className="card" style={{ marginBottom: 12 }}>
            <div className="cat-head">
              <span className="cat-label">{cat.label}</span>
              <span className="cat-q">{cat.question}</span>
            </div>
            {cat.items.map((it) => {
              const c = counts[it.id];
              const tot = c.S + c.I + c.N || 1;
              return (
                <div key={it.id} className="bar-row">
                  <span className="bar-text">{it.text}</span>
                  <span className="bar" aria-label={`${c.S} strength, ${c.I} improve, ${c.N} not sure`}>
                    <i className="S" style={{ width: `${(c.S / tot) * 100}%` }} />
                    <i className="I" style={{ width: `${(c.I / tot) * 100}%` }} />
                    <i className="N" style={{ width: `${(c.N / tot) * 100}%` }} />
                  </span>
                  <span className="bar-nums">
                    <b className="s">{c.S}</b> <b className="i">{c.I}</b> <b className="n">{c.N}</b>
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </section>

      <section className="section wrap">
        <div className="section-head">
          <h2 className="serif">By person</h2>
          <span className="meta">Each person&apos;s picks and their explanation, for the share out</span>
        </div>
        <div className="card pack">
          {data.people.map((p) => (
            <details key={p.key}>
              <summary>
                <span>
                  {p.name}
                  {!p.submission && <span className="pill note" style={{ marginLeft: 8 }}>not submitted</span>}
                </span>
              </summary>
              {p.submission && (
                <div className="body two-col">
                  <div>
                    <div className="label">Strengths</div>
                    {p.submission.topStrengths.map((id) => (
                      <div key={id} className="pick">
                        <b>{ITEM_TEXT[id]}</b>
                        {p.submission!.examples[id] && <p>{p.submission!.examples[id]}</p>}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="label">Areas to improve</div>
                    {p.submission.topImprove.map((id) => (
                      <div key={id} className="pick">
                        <b>{ITEM_TEXT[id]}</b>
                        {p.submission!.examples[id] && <p>{p.submission!.examples[id]}</p>}
                      </div>
                    ))}
                  </div>
                  {p.submission.other && (
                    <div style={{ gridColumn: "1 / -1" }}>
                      <div className="label">Other</div>
                      <p>{p.submission.other}</p>
                    </div>
                  )}
                </div>
              )}
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

function Nom({ id, who }: { id: string; who: string[] }) {
  return (
    <div className="nom">
      <span className="nom-count">{who.length}</span>
      <span>
        <b>{ITEM_TEXT[id]}</b>
        <small>{who.join(", ")}</small>
      </span>
    </div>
  );
}
