"use client";
import { useEffect, useRef, useState } from "react";
import { AGENDA } from "@/lib/public";
import { armGong, playGong } from "@/lib/gong";
import { resolveTimer, type TimerState } from "@/lib/timer";

const MINUTES = AGENDA.map((a) => a.minutes);

export default function TimerView() {
  const [state, setState] = useState<TimerState | null>(null);
  const [offset, setOffset] = useState(0); // server clock minus this device's clock
  const [configured, setConfigured] = useState(true);
  const [now, setNow] = useState(() => Date.now());
  // The gong follows the lead's setting. Audio is armed by the tap that opened this tab.
  const soundRef = useRef(true);

  useEffect(() => {
    armGong();
  }, []);

  // Poll the shared state every few seconds.
  useEffect(() => {
    let alive = true;
    async function poll() {
      try {
        const res = await fetch("/api/timer", { cache: "no-store" });
        if (!res.ok) return;
        const j = await res.json();
        if (!alive) return;
        setState(j.state ?? null);
        soundRef.current = j.state?.sound !== false;
        setOffset(j.now - Date.now());
        setConfigured(j.storeConfigured !== false);
      } catch {}
    }
    poll();
    const t = window.setInterval(poll, 3000);
    return () => {
      alive = false;
      window.clearInterval(t);
    };
  }, []);

  // Local one second tick so the clock moves smoothly between polls.
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const resolved = state ? resolveTimer(state, now + offset, MINUTES) : { idx: 0, remaining: AGENDA[0].minutes * 60 };
  const idx = Math.min(resolved.idx, AGENDA.length - 1);
  const remaining = resolved.remaining;
  const step = AGENDA[idx];
  const running = !!state?.running;

  // Ring when the step changes or the final step hits zero.
  const lastIdx = useRef<number | null>(null);
  const rangZero = useRef(false);
  useEffect(() => {
    if (!running) {
      lastIdx.current = idx;
      return;
    }
    if (lastIdx.current !== null && idx !== lastIdx.current && soundRef.current) playGong();
    lastIdx.current = idx;
  }, [idx, running]);
  useEffect(() => {
    if (!running || idx !== AGENDA.length - 1) {
      rangZero.current = false;
      return;
    }
    if (remaining <= 0 && !rangZero.current) {
      rangZero.current = true;
      if (soundRef.current) playGong();
    }
  }, [remaining, running, idx]);

  const started = !!state && (running || state.idx > 0 || state.remaining !== AGENDA[0].minutes * 60);
  const over = remaining < 0;
  const abs = Math.abs(remaining);
  const mm = String(Math.floor(abs / 60)).padStart(2, "0");
  const ss = String(abs % 60).padStart(2, "0");
  const pct = Math.max(0, Math.min(100, (1 - remaining / (step.minutes * 60)) * 100));

  return (
    <>
      <section className="hero wrap" style={{ paddingBottom: 12 }}>
        <div className="eyebrow">Timer</div>
        <div className="timer-bar">
          <div>
            <div className="now">
              {started ? `Part ${step.part} · Step ${idx + 1} of ${AGENDA.length}` : "Not started yet"}
              {started && !running ? " · Paused" : ""}
            </div>
            <div className="name">{step.label}</div>
            <div className="progress">
              <div style={{ width: `${pct}%` }} />
            </div>
          </div>
          <div className={`clock ${over ? "over" : ""}`}>
            {over ? "+" : ""}
            {mm}:{ss}
          </div>
        </div>
        <p className="subtitle" style={{ marginTop: 12 }}>
          This timer mirrors the lab lead&apos;s timer and rings a gong at the end of each step. Keep it open when the two groups split
          into separate rooms so everyone stays on the same clock.
        </p>
        {!configured && <p className="warn">Shared storage is not configured, so this timer cannot sync. See README.</p>}
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
                  <span />
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="label">Right now</div>
            <div className="card">
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
                  ),
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
