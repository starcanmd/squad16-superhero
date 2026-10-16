"use client";
import { AGENDA, LAB, PREP_TASKS, ROSTER } from "@/lib/public";
import { useLocal } from "@/lib/useLocal";

export default function Overview({ onOpenMyView }: { onOpenMyView: () => void }) {
  const [done, setDone] = useLocal<Record<string, boolean>>("prep-done", {});
  const part1 = AGENDA.filter((a) => a.part === 1);
  const part2 = AGENDA.filter((a) => a.part === 2);
  const total1 = part1.reduce((s, a) => s + a.minutes, 0);
  const total2 = part2.reduce((s, a) => s + a.minutes, 0);
  const completed = PREP_TASKS.filter((t) => done[t.id]).length;

  return (
    <>
      <section className="hero wrap hero-split">
        <div>
          <div className="eyebrow">{LAB.course}</div>
          <h1 className="serif">
            Superhero View Case <em>and</em> Team Assessment
          </h1>
          <p>
            Two parts on {LAB.date}. A 45-minute founder and VC role play in two rounds, then a 60-minute
            squad Team Assessment. This page has the agenda and what to do before we meet. Your personal checklist and
            the assessment form are in My View.
          </p>
          <div className="chips">
            <span className="chip yellow">{LAB.squad}</span>
            <span className="chip">Meeting Lead · {LAB.meetingLead}</span>
            <span className="chip">Fellow · {LAB.fellow}</span>
            <span className="chip">{total1 + total2} minutes</span>
          </div>
        </div>
        <figure className="hero-photo">
          <img src="/squad.jpg" alt="Squad 16 raising glasses on a rooftop at sunset" />
          <figcaption>Squad 16, est. 2026</figcaption>
        </figure>
      </section>

      <section className="section wrap">
        <div className="section-head">
          <h2 className="serif">Before Wednesday</h2>
          <span className="meta">
            Everyone. Your role-specific checklist is in My View
          </span>
        </div>
        <div className="grid">
          {PREP_TASKS.map((t) => (
            <label key={t.id} className={`card task ${done[t.id] ? "done" : ""}`}>
              <input
                type="checkbox"
                checked={!!done[t.id]}
                onChange={(e) => setDone({ ...done, [t.id]: e.target.checked })}
              />
              <div>
                <h3>
                  {t.title}
                </h3>
                <p>{t.detail}</p>
                {t.link && (
                  <p style={{ marginTop: 8 }}>
                    <a href={t.link.href} target="_blank" rel="noreferrer">
                      {t.link.label}
                    </a>
                  </p>
                )}
                {t.id === "read-case" && (
                  <p style={{ marginTop: 8 }}>
                    <button className="btn sm yellow" type="button" onClick={onOpenMyView}>
                      Open My View
                    </button>
                  </p>
                )}
              </div>
            </label>
          ))}
        </div>
      </section>

      <section className="section wrap">
        <div className="section-head">
          <h2 className="serif">Who plays whom</h2>
          <span className="meta">Round 2 continues Round 1. Partners tag in.</span>
        </div>
        <table className="roster">
          <thead>
            <tr>
              <th>Squad member</th>
              <th>Round 1</th>
              <th>Round 2</th>
              <th>Side</th>
            </tr>
          </thead>
          <tbody>
            {ROSTER.map((r) => (
              <tr key={r.name}>
                <td>
                  {r.name}
                  {"extra" in r && r.extra ? <span className="pill note" style={{ marginLeft: 8 }}>{r.extra}</span> : null}
                </td>
                <td>{r.r1}</td>
                <td>{r.r2}</td>
                <td>
                  <span className={`pill ${r.side === "vc" ? "vc" : "cof"}`}>{r.side === "vc" ? "Arrow Ventures" : "Co-founders"}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="section wrap">
        <div className="section-head">
          <h2 className="serif">Agenda</h2>
          <span className="meta">
            Part 1, {total1} min · Part 2, {total2} min
          </span>
        </div>
        <div className="part-tag">Part 1 · Superhero View case</div>
        <div className="agenda">
          {part1.map((a) => (
            <AgendaRow key={a.id} a={a} />
          ))}
        </div>
        <div className="part-tag">Part 2 · Team Assessment</div>
        <div className="agenda">
          {part2.map((a) => (
            <AgendaRow key={a.id} a={a} />
          ))}
        </div>
      </section>

      <section className="section wrap">
        <div className="section-head">
          <h2 className="serif">What the Lab is for</h2>
        </div>
        <div className="grid grid-2">
          {LAB.objectives.map((o) => (
            <div key={o} className="card warm">
              <p>{o}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function AgendaRow({ a }: { a: (typeof AGENDA)[number] }) {
  return (
    <div className="agenda-row">
      <div className="min">
        {a.minutes}
        <small>min</small>
      </div>
      <div>
        <h3>{a.label}</h3>
        <ul>
          {a.detail.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
