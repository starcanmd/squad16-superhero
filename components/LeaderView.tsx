"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Payload, Results } from "@/lib/types";
import { AGENDA, ASSESSMENT, ITEM_TEXT } from "@/lib/public";
import { useLocal } from "@/lib/useLocal";
import { armGong, playGong } from "@/lib/gong";

const WATCH: Record<string, { what: string; unit: string }> = {
  serim: { what: "Stated a disagreement and held it", unit: "disagreements" },
  ellis: { what: "Qualified a statement (I think, I would say)", unit: "qualifiers" },
  yash: { what: "Asked follow up questions before stating a view", unit: "questions" },
  cam: { what: "Spoke when Ren did not need to", unit: "moments" },
  minyoung: { what: "Reasserted a view through a full exchange", unit: "exchanges" },
  yuhan: { what: "Pace sped up or body showed irritation", unit: "moments" },
};

export default function LeaderView({ data, code }: { data: Payload; code: string }) {
  const squad = data.squad ?? [];

  // Live prep and assessment status from the shared store
  const [results, setResults] = useState<Results | null>(null);
  const loadResults = useCallback(async () => {
    try {
      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (res.ok) setResults(await res.json());
    } catch {}
  }, [code]);
  useEffect(() => {
    loadResults();
    const t = window.setInterval(loadResults, 30000);
    return () => window.clearInterval(t);
  }, [loadResults]);

  // Run of show
  const [idx, setIdx] = useLocal<number>("ml-step", 0);
  const [remaining, setRemaining] = useLocal<number>("ml-remaining", AGENDA[0].minutes * 60);
  const [running, setRunning] = useState(false);
  const tick = useRef<number | null>(null);
  const step = AGENDA[Math.min(idx, AGENDA.length - 1)];

  const [sound, setSound] = useLocal<boolean>("ml-sound", true);
  const soundRef = useRef(sound);
  useEffect(() => {
    soundRef.current = sound;
  }, [sound]);

  const [auto, setAuto] = useLocal<boolean>("ml-auto", true);

  useEffect(() => {
    if (!running) return;
    tick.current = window.setInterval(() => setRemaining((r) => r - 1), 1000);
    return () => {
      if (tick.current) window.clearInterval(tick.current);
    };
  }, [running, setRemaining]);

  // When a step's clock reaches zero: ring the gong, then move to the next step if auto advance is on.
  useEffect(() => {
    if (!running || remaining !== 0) return;
    if (soundRef.current) playGong();
    if (auto && idx < AGENDA.length - 1) {
      const n = idx + 1;
      setIdx(n);
      setRemaining(AGENDA[n].minutes * 60);
    }
    // On the last step the clock keeps counting up so you can see the overrun.
  }, [remaining, running, auto, idx, setIdx, setRemaining]);

  function goTo(i: number) {
    const n = Math.max(0, Math.min(AGENDA.length - 1, i));
    setIdx(n);
    setRemaining(AGENDA[n].minutes * 60);
  }
  function next() {
    goTo(idx + 1);
  }
  function resetAll() {
    setRunning(false);
    goTo(0);
  }

  const over = remaining < 0;
  const abs = Math.abs(remaining);
  const mm = String(Math.floor(abs / 60)).padStart(2, "0");
  const ss = String(abs % 60).padStart(2, "0");
  const pct = Math.max(0, Math.min(100, (1 - remaining / (step.minutes * 60)) * 100));

  // Goal tallies
  const [tally, setTally] = useLocal<Record<string, number>>("ml-tally", {});
  // Team assessment votes
  const [votes, setVotes] = useLocal<Record<string, { s: number; i: number }>>("ml-votes", {});
  // Notes
  const [notes, setNotes] = useLocal<string>("ml-notes", "");

  const topVotes = useMemo(() => {
    const all = Object.entries(votes);
    const s = [...all].sort((a, b) => b[1].s - a[1].s).filter((x) => x[1].s > 0).slice(0, 2);
    const i = [...all].sort((a, b) => b[1].i - a[1].i).filter((x) => x[1].i > 0).slice(0, 2);
    return { s, i };
  }, [votes]);

  return (
    <>
      <section className="hero wrap" style={{ paddingBottom: 12 }}>
        <div className="eyebrow">Leader View · Serim</div>
        <div className="timer-bar">
          <div>
            <div className="now">
              Part {step.part} · Step {idx + 1} of {AGENDA.length}
            </div>
            <div className="name">{step.label}</div>
            <div className="controls">
              <button
                className="btn sm"
                onClick={() => {
                  armGong();
                  setRunning(!running);
                }}
              >
                {running ? "Pause" : remaining === step.minutes * 60 ? "Start" : "Resume"}
              </button>
              <button className="btn sm ghost" onClick={next} disabled={idx >= AGENDA.length - 1}>
                Next step
              </button>
              <button className="btn sm ghost" onClick={() => goTo(idx)}>
                Restart step
              </button>
              <button className="btn sm ghost" onClick={resetAll}>
                Reset all
              </button>
              <button
                className="btn sm ghost"
                onClick={() => setAuto(!auto)}
                title={auto ? "Next step starts by itself when the clock hits zero" : "Clock counts up past zero until you press Next step"}
              >
                {auto ? "Auto advance on" : "Auto advance off"}
              </button>
              <button
                className="btn sm ghost"
                onClick={() => {
                  armGong();
                  setSound(!sound);
                }}
                title={sound ? "Gong rings when a step ends" : "Gong is muted"}
              >
                {sound ? "Gong on" : "Gong off"}
              </button>
              <button
                className="btn sm ghost"
                onClick={() => {
                  armGong();
                  playGong();
                }}
              >
                Test gong
              </button>
            </div>
            <div className="progress">
              <div style={{ width: `${pct}%` }} />
            </div>
          </div>
          <div className={`clock ${over ? "over" : ""}`}>
            {over ? "+" : ""}
            {mm}:{ss}
          </div>
        </div>
      </section>

      <section className="section wrap">
        <div className="grid grid-2">
          <div>
            <div className="label">Run of show</div>
            <div className="steps">
              {AGENDA.map((a, i) => (
                <div key={a.id} className={`step ${i === idx ? "current" : i < idx ? "done" : ""}`}>
                  <span className="n">{i + 1}</span>
                  <span className="m">{a.minutes} min</span>
                  <span>{a.label}</span>
                  <button onClick={() => goTo(i)}>Go</button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="label">Right now</div>
            <div className="card yellow">
              <h3>{step.label}</h3>
              <ul>
                {step.detail.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              {step.leadNotes && (
                <>
                  <div className="label" style={{ marginTop: 14 }}>
                    ML reminders
                  </div>
                  <ul style={{ marginTop: 0 }}>
                    {step.leadNotes.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            <div className="card" style={{ marginTop: 14 }}>
              <h3>Playing Casey in Round 1</h3>
              <ul>
                <li>Open with Arrow's assessment of the plan and the technical execution. Speak first</li>
                <li>Hand to Vanessa (Quinn) for the feedback on each co-founder and the concerns about Hayden</li>
                <li>Raise Option 1, technical team only, when it fits. Keep Option 2 in reserve</li>
                <li>Probe the pricing wedge between Ren and Hayden</li>
                <li>Your goal rep. Say I see this differently at least once and hold it through pushback</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section wrap">
        <div className="section-head">
          <h2 className="serif">Goal tally during the role play</h2>
          <span className="meta">One count per person, taken from what they asked the squad to watch</span>
        </div>
        <div className="tally">
          {squad.filter((m) => WATCH[m.key]).map((m) => {
            const w = WATCH[m.key];
            const c = tally[m.key] ?? 0;
            return (
              <div key={m.key} className="tally-item">
                <div className="name">{m.firstName}</div>
                <div className="sub">{w?.what}</div>
                <div className="row">
                  <span className="count">{c}</span>
                  <span style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => setTally({ ...tally, [m.key]: Math.max(0, c - 1) })}>–</button>
                    <button onClick={() => setTally({ ...tally, [m.key]: c + 1 })}>+</button>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section wrap">
        <div className="section-head">
          <h2 className="serif">Prep tracker</h2>
          <span className="meta">Live from each person's checklist. Refreshes every 30 seconds</span>
        </div>
        {results && !results.storeConfigured && (
          <p className="warn">Shared storage is not configured, so this only reflects the current server process. See README.</p>
        )}
        <table className="roster">
          <thead>
            <tr>
              <th>Member</th>
              <th>Plays</th>
              <th>Checklist</th>
              <th>Assessment</th>
            </tr>
          </thead>
          <tbody>
            {squad.map((m) => {
              const r = results?.people.find((p) => p.key === m.key);
              const done = r ? Object.values(r.checks).filter(Boolean).length : 0;
              const total = r?.checklistTotal ?? 0;
              return (
                <tr key={m.key}>
                  <td>{m.name}</td>
                  <td>
                    {m.character.split(",")[0]} · {m.playingRound === "both" ? "both rounds" : `Round ${m.playingRound}`}
                  </td>
                  <td>
                    <span className="meter sm">
                      <span style={{ width: total ? `${(done / total) * 100}%` : 0 }} />
                    </span>
                    <small style={{ marginLeft: 8, color: "var(--ink-3)" }}>
                      {done}/{total}
                    </small>
                  </td>
                  <td>
                    {r?.submission ? (
                      <span className="pill vc">submitted</span>
                    ) : (
                      <span className="pill note">not yet</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className="section wrap">
        <div className="section-head">
          <h2 className="serif">Priority vote in the room</h2>
          <span className="meta">
            Leading strength: {topVotes.s.map(([k]) => ITEM_TEXT[k]).join(" / ") || "none yet"} · Leading
            improvement: {topVotes.i.map(([k]) => ITEM_TEXT[k]).join(" / ") || "none yet"}
          </span>
        </div>
        <p className="lede">Use the Team assessment results tab for what people submitted. Tally the live vote here during Priority issues.</p>
        <div className="grid grid-3">
          {ASSESSMENT.map((cat) => (
            <div key={cat.key} className="card">
              <h3>{cat.label}</h3>
              {cat.items.map((item) => {
                const k = item.id;
                const v = votes[k] ?? { s: 0, i: 0 };
                return (
                  <div key={k} className="vote">
                    <span>{item.text}</span>
                    <span className="ctr">
                      <button title="strength" onClick={() => setVotes({ ...votes, [k]: { ...v, s: v.s + 1 } })}>
                        S
                      </button>
                      <b className="s">{v.s}</b>
                      <button title="improve" onClick={() => setVotes({ ...votes, [k]: { ...v, i: v.i + 1 } })}>
                        I
                      </button>
                      <b className="i">{v.i}</b>
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <p style={{ marginTop: 10 }}>
          <button className="btn sm ghost" onClick={() => setVotes({})}>
            Clear votes
          </button>
        </p>
      </section>

      <section className="section wrap">
        <div className="section-head">
          <h2 className="serif">Each person's rep this week</h2>
          <span className="meta">What they are trying, so you can set them up for it</span>
        </div>
        <div className="grid grid-2">
          {squad.map((m) => (
            <div key={m.key} className="card">
              <div className="label">
                {m.character} · {m.playingRound === "both" ? "Both rounds" : `Round ${m.playingRound}`}
              </div>
              <h3>{m.name}</h3>
              <ul>
                {m.goals.length > 0 ? (
                  m.goals.map((g) => <li key={g.title}>{g.title}</li>)
                ) : (
                  <li>Fellow. Continuity across both rounds, leads the feedback on Hayden, closes the Lab</li>
                )}
              </ul>
              <div className="label" style={{ marginTop: 12 }}>
                Set up
              </div>
              <ul style={{ marginTop: 0 }}>
                {m.tryThis[0]?.items.slice(0, 2).map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="section wrap">
        <div className="section-head">
          <h2 className="serif">Notes</h2>
          <span className="meta">Saved on this device</span>
        </div>
        <textarea className="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Observations, feedback to give, course corrections" />
      </section>
    </>
  );
}
