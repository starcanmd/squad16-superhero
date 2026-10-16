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
            Nightwalkers, you are summoned for our next Lead Lab on {LAB.date}. We will spend 105 minutes together.
            The first 45 are a founder and VC showdown over seed money, played in two rounds so everyone gets a turn in
            the hot seat. The next 60 are ours, a frank look at how this squad is working and what we want to change.
            Everything you need is here. Skim the agenda, do the few things on the checklist, and open Individual view
            to find your role, your case pack, and the assessment form. Come ready to play yourself.
          </p>
          <div className="chips">
            <span className="chip yellow">{LAB.squad}</span>
            <span className="chip">Meeting Lead · {LAB.meetingLead}</span>
            <span className="chip">Fellow · {LAB.fellow}</span>
            <span className="chip">{total1 + total2} minutes</span>
          </div>
        </div>
        <figure className="hero-photo">
          <img src="/squad.jpg" alt="Nightwalkers raising glasses on a rooftop at sunset" />
          <figcaption>Nightwalkers, est. 2026</figcaption>
        </figure>
      </section>

      <section className="section wrap">
        <div className="section-head">
          <h2 className="serif">Before Wednesday</h2>
          <span className="meta">
            Everyone. Your role-specific checklist is in Individual view
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
                {t.insights && (
                  <div className="insights">
                    <div className="label">Four ideas from the TPR Model for Wednesday</div>
                    {t.insights.map((i) => (
                      <div key={i.title} className="insight">
                        <b>{i.title}</b>
                        <p>{i.text}</p>
                      </div>
                    ))}
                  </div>
                )}
                {t.id === "read-case" && (
                  <p style={{ marginTop: 8 }}>
                    <button className="btn sm yellow" type="button" onClick={onOpenMyView}>
                      Open Individual view
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
          <h2 className="serif">Objectives for today's lab</h2>
        </div>
        <div className="grid grid-2">
          {LAB.objectives.map((o) => (
            <div key={o} className="card warm">
              <p>{o}</p>
            </div>
          ))}
        </div>
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
        <div className="part-tag">Who plays whom · Round 2 continues Round 1, partners tag in</div>
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
        <div className="part-tag">Part 2 · Team Assessment</div>
        <div className="agenda">
          {part2.map((a) => (
            <AgendaRow key={a.id} a={a} />
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
