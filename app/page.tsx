"use client";
import { useCallback, useEffect, useState } from "react";
import Overview from "@/components/Overview";
import Gate from "@/components/Gate";
import MyView from "@/components/MyView";
import LeaderView from "@/components/LeaderView";
import ResultsView from "@/components/ResultsView";
import type { Payload } from "@/lib/types";

type Tab = "overview" | "me" | "results" | "lead";

export default function Page() {
  const [tab, setTab] = useState<Tab>("overview");
  const [email, setEmail] = useState<string>("");
  const [data, setData] = useState<Payload | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (e: string, silent = false) => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/pack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: e }),
      });
      const json = await res.json();
      if (!res.ok) {
        if (!silent) setError(json.error ?? "Something went wrong.");
        try { window.localStorage.removeItem("squad-email"); } catch {}
        return;
      }
      setData(json);
      setEmail(e.trim().toLowerCase());
      try { window.localStorage.setItem("squad-email", e); } catch {}
    } catch {
      if (!silent) setError("Could not reach the server. Try again.");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("squad-email");
      if (saved) load(saved, true);
    } catch {}
  }, [load]);

  function signOut() {
    setData(null);
    setEmail("");
    try { window.localStorage.removeItem("squad-email"); } catch {}
  }

  const gate = (title: string, blurb: string) => (
    <Gate title={title} blurb={blurb} onSubmit={(e) => load(e)} busy={busy} error={error} />
  );

  return (
    <>
      <header className="topbar">
        <div className="wrap topbar-inner">
          <div className="brand">
            <span className="brand-dot" />
            <span>Nightwalkers</span>
          </div>
          <nav className="tabs" aria-label="Views">
            <button className={`tab ${tab === "overview" ? "active" : ""}`} onClick={() => setTab("overview")}>
              Lab agenda
            </button>
            <button className={`tab ${tab === "me" ? "active" : ""}`} onClick={() => setTab("me")}>
              Individual view
            </button>
            <button className={`tab ${tab === "results" ? "active" : ""}`} onClick={() => setTab("results")}>
              Team assessment results
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
        {tab === "overview" && <Overview onOpenMyView={() => setTab("me")} />}

        {tab === "me" &&
          (data ? (
            <MyView data={data} email={email} onData={setData} />
          ) : (
            gate("Your role and prep", "Enter your Stanford email to open your role, your checklist, the Team Assessment, and your side's case pack.")
          ))}

        {tab === "results" &&
          (data ? (
            <ResultsView email={email} />
          ) : (
            gate("Team Assessment results", "Enter your Stanford email to see the squad's consolidated assessment.")
          ))}

        {tab === "lead" &&
          (data?.person.isLead ? (
            <LeaderView data={data} email={email} />
          ) : data ? (
            <div className="gate wrap">
              <h2 className="serif">Meeting Lead only</h2>
              <p>This tab is for the Meeting Lead. Your prep is under Individual view.</p>
            </div>
          ) : (
            gate("Leader view", "Enter the Meeting Lead's Stanford email.")
          ))}
      </main>

      <footer className="footer wrap">
        OB 209 Leadership Labs · Nightwalkers · Week 5. Case material is the property of Stanford GSB and is shared here for
        squad preparation only.
      </footer>
    </>
  );
}
