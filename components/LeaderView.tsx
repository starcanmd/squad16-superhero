"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Payload, Results } from "@/lib/types";
import { AGENDA } from "@/lib/public";
import { useLocal } from "@/lib/useLocal";
import { armGong, playGong } from "@/lib/gong";


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

  // Publish the timer so the Timer tab on everyone's phone follows this one.
  const [epoch, setEpoch] = useState(0);
  const remainingRef = useRef(remaining);
  useEffect(() => {
    remainingRef.current = remaining;
  }, [remaining]);
  useEffect(() => {
    fetch("/api/timer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, state: { idx, running, remaining: remainingRef.current, auto, sound } }),
    }).catch(() => {});
  }, [idx, running, auto, sound, epoch, code]);

  function goTo(i: number) {
    const n = Math.max(0, Math.min(AGENDA.length - 1, i));
    setIdx(n);
    setRemaining(AGENDA[n].minutes * 60);
    setEpoch((e) => e + 1);
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

  // Notes
  const [notes, setNotes] = useLocal<string>("ml-notes", "");


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
                {step.detail.map((d) =>
            typeof d === "string" ? (
              <li key={d}>{d}</li>
            ) : (
              <li key={d.text}>
                {d.text}
                <ul>
                  {d.sub.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </li>
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
              <h3>Playing Casey in round 1</h3>
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
          <h2 className="serif">Each person's rep this week</h2>
          <span className="meta">What each squad member is trying, so you can set them up for success</span>
        </div>
        <div className="grid grid-2">
          {squad.map((m) => (
            <div key={m.key} className="card">
              <div className="label">
                {m.character} · {m.playingRound === "both" ? "Both rounds" : `Round ${m.playingRound}`}
              </div>
              <h3>{m.name}</h3>
              <div className="label" style={{ marginTop: 8 }}>
                Leadership goals
              </div>
              <ul style={{ marginTop: 0 }}>
                {m.goals.length > 0 ? (
                  m.goals.map((g) => <li key={g.title}>{g.title}</li>)
                ) : (
                  <li>Fellow. Continuity across both rounds, leads the feedback on Hayden, runs the pulse check between the parts</li>
                )}
              </ul>
              <div className="label" style={{ marginTop: 12 }}>
                Suggested behaviors
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
