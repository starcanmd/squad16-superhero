"use client";
import type { Payload } from "@/lib/types";
import { AGENDA, type Submission } from "@/lib/public";
import Checklist from "./Checklist";
import AssessmentForm from "./AssessmentForm";

export default function MyView({
  data,
  email,
  onData,
}: {
  data: Payload;
  email: string;
  onData: (next: Payload) => void;
}) {
  const { person, pack } = data;
  const sideLabel = person.side === "vc" ? "Arrow Ventures" : "Co-founders";
  const both = person.playingRound === "both";
  const observingRound = person.playingRound === 1 ? 2 : 1;
  const prepMin = AGENDA.find((a) => a.id === "prep")?.minutes ?? 5;
  const partnerFirst = both ? "Serim and Ellis" : person.partner.split(" ")[0];

  return (
    <>
      <section className="hero wrap" style={{ paddingBottom: 12 }}>
        <div className="eyebrow">Individual view · {person.name}</div>
        <div className="role-hero">
          <div className="card">
            <div className="label">You play</div>
            <div className="big">{person.character}</div>
            <p>{person.roleSummary}</p>
            <div className="chips">
              <span className={`chip ${person.side === "vc" ? "" : "yellow"}`}>{sideLabel}</span>
              {both ? (
                <span className="chip">Playing both rounds</span>
              ) : (
                <>
                  <span className="chip">Playing Round {person.playingRound}</span>
                  <span className="chip">Observing Round {observingRound}</span>
                </>
              )}
              <span className="chip">{both ? "Casey players" : "Partner"} · {person.partner}</span>
            </div>
          </div>
          <div className="card warm">
            <div className="label">How the 45 minutes run</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 15, color: "var(--ink-2)" }}>
              <li>{prepMin} min prep with your side</li>
              <li>12 min Round 1</li>
              <li>8 min midpoint, in pairs with your partner</li>
              <li>12 min Round 2, partner tags in and continues the conversation</li>
              <li>8 min feedback in pairs, after de-roling</li>
            </ul>
            <p style={{ marginTop: 12, fontSize: 14 }}>
              {both
                ? "Meet Serim and Ellis for 30 minutes before Wednesday. Agree on the opening, who raises which concern, and which funding option you lead with."
                : `Meet ${partnerFirst} before Wednesday. Agree on your opening, the first concern you raise, and what you want the other side to walk away believing.`}
            </p>
          </div>
        </div>
      </section>

      <Checklist
        email={email}
        items={data.checklist}
        checks={data.checks}
        onChange={(checks) => onData({ ...data, checks })}
      />

      <section className="section wrap">
        <div className="section-head">
          <h2 className="serif">Try this in the Lab</h2>
          <span className="meta">Built from your own leadership goals</span>
        </div>
        <div className="grid grid-2">
          {person.tryThis.map((t) => (
            <div key={t.when} className={`card ${t.when.startsWith("As") ? "yellow" : ""}`}>
              <h3>{t.when}</h3>
              <ul>
                {t.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
          <div className="card green">
            <h3>{both ? "Settle in the prep meeting" : `Ask ${partnerFirst} to watch for`}</h3>
            <ul>
              {person.askYourPartner.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {person.fellowPrep && (
        <section className="section wrap">
          <div className="section-head">
            <h2 className="serif">Fellow prep for Week 5</h2>
            <span className="meta">From the Fellows only Required Prep page</span>
          </div>
          <div className="card warm">
            <ul style={{ margin: 0 }}>
              {person.fellowPrep.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {person.goals.length > 0 && (
      <section className="section wrap">
        <div className="section-head">
          <h2 className="serif">Your leadership goals</h2>
          <span className="meta">From the Nightwalkers shared goals doc</span>
        </div>
        <div className="card">
          {person.goals.map((g) => (
            <div key={g.title} className="goal">
              <h4>{g.title}</h4>
              <div className="two-col">
                <div>
                  <div className="label">Behaviors</div>
                  <ul style={{ margin: 0 }}>
                    {g.behaviors.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="label">How others hold you accountable</div>
                  <ul style={{ margin: 0 }}>
                    {g.accountability.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      )}

      <AssessmentForm
        email={email}
        existing={data.submission}
        onSaved={(submission: Submission, checks) => onData({ ...data, submission, checks })}
      />

      <section className="section wrap">
        <div className="section-head">
          <h2 className="serif">
            Case pack
            <span className="confidential">{sideLabel} only</span>
          </h2>
          <span className="meta">Read all of it once, then your character twice</span>
        </div>
        <div className="card pack">
          {pack.map((s, i) => (
            <details key={s.heading} open={i === 0}>
              <summary>{s.heading}</summary>
              <div className="body">
                {s.paragraphs?.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
                {s.bullets && (
                  <ul>
                    {s.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
