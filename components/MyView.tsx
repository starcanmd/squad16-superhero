"use client";
import type { Goal, Payload } from "@/lib/types";
import { AGENDA, type Submission } from "@/lib/public";
import AssessmentForm from "./AssessmentForm";
import CasePack from "./CasePack";

export default function MyView({
  data,
  code,
  onData,
}: {
  data: Payload;
  code: string;
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
            <div className={person.photo ? "role-body with-photo" : "role-body"}>
              {person.photo && <img className="headshot" src={person.photo} alt={person.name} />}
              <p>{person.roleSummary}</p>
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

      <section className="section wrap">
        <div className="section-head">
          <h2 className="serif">
            Case pack
            <span className="confidential">{sideLabel} only</span>
          </h2>
          <span className="meta">Read all of it once, then your character twice</span>
        </div>
        <CasePack pack={pack} />
      </section>

      <section className="section wrap">
        <div className="section-head stacked">
          <h2 className="serif">Consider trying these behaviors today</h2>
          <p className="subtitle">These are AI-generated suggestions based on leadership goals. You can revisit your goals below if you like.</p>
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

      {(person.goals.length > 0 || (data.partners?.length ?? 0) > 0) && (
      <section className="section wrap">
        <details className="card fold">
          <summary>
            <h2 className="serif">Leadership goals</h2>
            <span className="meta">Yours and your partner&apos;s, so you can hold each other to them</span>
          </summary>
          <div className="fold-body">
            {person.goals.length > 0 && <GoalBlock name="Your goals" goals={person.goals} />}
            {data.partners?.map((pt) => (
              <GoalBlock key={pt.key} name={`${pt.firstName}'s goals`} goals={pt.goals} />
            ))}
          </div>
        </details>
      </section>
      )}

      <AssessmentForm
        code={code}
        existing={data.submission}
        onSaved={(submission: Submission, checks) => onData({ ...data, submission, checks })}
      />

    </>
  );
}


function GoalBlock({ name, goals }: { name: string; goals: Goal[] }) {
  return (
    <div className="goal-block">
      <div className="label goal-owner">{name}</div>
      {goals.map((g) => (
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
              <div className="label">How others hold them accountable</div>
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
  );
}
