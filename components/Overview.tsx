"use client";
import { AGENDA, LAB, ROSTER } from "@/lib/public";

export default function Overview() {
  const part1 = AGENDA.filter((a) => a.part === 1);
  const part2 = AGENDA.filter((a) => a.part === 2);
  const total1 = part1.reduce((s, a) => s + a.minutes, 0);
  const total2 = part2.reduce((s, a) => s + a.minutes, 0);

  return (
    <>
      <section className="hero wrap hero-split">
        <div>
          <div className="eyebrow">{LAB.course}</div>
          <h1 className="serif">
            Superhero View case <em>and</em> team assessment
          </h1>
          <p>
            Nightwalkers, you are summoned for our next lead lab on {LAB.date}. We will spend 105 minutes together,
            split into two parts. In the first part, we are going to come to an agreement over seed funding. Some of us
            will play the founders who need the money, some of us will play the VCs who have doubts, and the rest will
            watch closely and give feedback. In the second part, we turn the lens on ourselves and talk about how this
            squad is working and what we want to change.
          </p>
          <p>
            To get the most benefit out of our time together, I&apos;d suggest that you skim the agenda below, follow
            the checklist in the second tab above, and review your case pack in the individual view tab.
          </p>
          <p>Come ready to play and have fun! 🦸⭐</p>
          <p className="ps">
            P.S. Feel free to bring one prop for your character if you&apos;d like.
          </p>
          <p className="ps">
            P.P.S. Don&apos;t worry about the team assessment results and timer tabs above for now. We will use them during
            the lab.
          </p>
        </div>
        <figure className="hero-photo">
          <img src="/squad.jpg" alt="Nightwalkers raising glasses on a rooftop at sunset" />
          <figcaption>Nightwalkers, est. 2026</figcaption>
        </figure>
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
          <p className="subtitle">
            We&apos;ll be in Room {LAB.room}. Please arrive by {LAB.arrive} so we can enjoy Minyoung&apos;s barley tea before the
            role play starts.
          </p>
        </div>
        <div className="part-tag">Part 1 · Superhero View case</div>
        <div className="agenda">
          {part1.map((a) => (
            <AgendaRow key={a.id} a={a} />
          ))}
        </div>
        <div className="part-tag">Who plays whom in each round</div>
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
        <div className="part-tag">Part 2 · team assessment</div>
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
          {a.detail.map((d) =>
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
      </div>
    </div>
  );
}
