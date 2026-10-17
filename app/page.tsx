"use client";
import { useCallback, useEffect, useState } from "react";
import Overview from "@/components/Overview";
import ChecklistView from "@/components/ChecklistView";
import Gate from "@/components/Gate";
import MyView from "@/components/MyView";
import LeaderView from "@/components/LeaderView";
import ResultsView from "@/components/ResultsView";
import TimerView from "@/components/TimerView";
import { armGong } from "@/lib/gong";
import type { Payload } from "@/lib/types";

type Tab = "overview" | "checklist" | "me" | "results" | "timer" | "lead";

export default function Page() {
  const [tab, setTab] = useState<Tab>("overview");
  const [code, setCode] = useState<string>("");
  const [data, setData] = useState<Payload | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (c: string, silent = false) => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/pack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: c }),
      });
      const json = await res.json();
      if (!res.ok) {
        if (!silent) setError(json.error ?? "Something went wrong.");
        try { window.localStorage.removeItem("squad-code"); } catch {}
        return;
      }
      setData(json);
      setCode(c.trim().toUpperCase());
      try { window.localStorage.setItem("squad-code", c); } catch {}
    } catch {
      if (!silent) setError("Could not reach the server. Try again.");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    try {
      const savedCode = window.localStorage.getItem("squad-code");
      if (savedCode) load(savedCode, true);
    } catch {}
  }, [load]);

  function signOut() {
    setData(null);
    setCode("");
    try { window.localStorage.removeItem("squad-code"); } catch {}
  }

  const gate = (title: string, blurb: string) => (
    <Gate title={title} blurb={blurb} onSubmit={(c) => load(c)} busy={busy} error={error} />
  );

  return (
    <>
      <header className="topbar">
        <div className="wrap topbar-inner">
          <div className="brand">
            <span>Nightwalkers</span>
          </div>
          <nav className="tabs" aria-label="Views">
            <button className={`tab ${tab === "overview" ? "active" : ""}`} onClick={() => setTab("overview")}>
              Lab agenda
            </button>
            <button className={`tab ${tab === "checklist" ? "active" : ""}`} onClick={() => setTab("checklist")}>
              Checklist
            </button>
            <button className={`tab ${tab === "me" ? "active" : ""}`} onClick={() => setTab("me")}>
              Individual view
            </button>
            <button className={`tab ${tab === "results" ? "active" : ""}`} onClick={() => setTab("results")}>
              Team assessment results
            </button>
            <button className={`tab ${tab === "timer" ? "active" : ""}`} onClick={() => { armGong(); setTab("timer"); }}>
              Timer
            </button>
            {(!data || data.person.isLead) && (
              <button className={`tab ${tab === "lead" ? "active" : ""}`} onClick={() => setTab("lead")}>
                Lab lead view
              </button>
            )}
          </nav>
          <div className="who">
            {data ? (
              <>
                <span>{data.person.firstName}</span>
                <button onClick={signOut}>Switch</button>
              </>
            ) : null}
          </div>
        </div>
      </header>

      <main>
        {tab === "overview" && <Overview />}

        {tab === "checklist" && (
          <ChecklistView
            data={data}
            code={code}
            onData={setData}
            onOpenMe={() => setTab("me")}
            onLogin={(c) => load(c)}
            busy={busy}
            error={error}
          />
        )}

        {tab === "me" &&
          (data ? (
            <MyView data={data} code={code} onData={setData} />
          ) : (
            gate("Your role and prep", "Enter the passcode Serim sent you to open your role, the team assessment, and your side's case pack.")
          ))}

        {tab === "results" &&
          (data ? (
            <ResultsView code={code} />
          ) : (
            gate("Team assessment results", "Enter your passcode to see the squad's consolidated assessment.")
          ))}

        {tab === "timer" && <TimerView />}

        {tab === "lead" &&
          (data?.person.isLead ? (
            <LeaderView data={data} code={code} />
          ) : data ? (
            <div className="gate wrap">
              <h2 className="serif">Meeting Lead only</h2>
              <p>This tab is for the meeting lead. Your prep is under the individual view tab.</p>
            </div>
          ) : (
            gate("Leader view", "Enter the meeting lead's passcode.")
          ))}
      </main>

      <footer className="footer wrap">
        OB 209 Leadership Laboratory · Nightwalkers · Week 5. Case material is the property of Stanford GSB and is shared here for
        squad preparation only.
      </footer>
    </>
  );
}
