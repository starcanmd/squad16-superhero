"use client";
import type { Bullet, Section, Sub, Table } from "@/lib/types";

function Bullets({ items }: { items: Bullet[] }) {
  return (
    <ul>
      {items.map((b, i) =>
        typeof b === "string" ? (
          <li key={i}>{b}</li>
        ) : b.text ? (
          <li key={i}>
            {b.text}
            {b.sub.length > 0 && (
              <ul>
                {b.sub.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            )}
          </li>
        ) : (
          <li key={i} className="no-marker">
            <ul>
              {b.sub.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </li>
        ),
      )}
    </ul>
  );
}

function Cell({ text }: { text: string }) {
  const lines = text.split("\n");
  if (lines.length === 1) return <>{text}</>;
  return (
    <>
      {lines.map((l, i) => (
        <div key={i} className="cell-line">
          {l}
        </div>
      ))}
    </>
  );
}

function TableView({ t }: { t: Table }) {
  return (
    <div className="case-table-wrap">
      <table className="case-table">
        <thead>
          <tr>
            {t.head.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {t.rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j}>
                  <Cell text={c} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {t.note && <p className="table-note">{t.note}</p>}
    </div>
  );
}

function Body({ s }: { s: Section | Sub }) {
  return (
    <>
      {s.paragraphs?.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
      {s.bullets && <Bullets items={s.bullets} />}
      {s.table && <TableView t={s.table} />}
      {s.bulletsAfter && <Bullets items={s.bulletsAfter} />}
      {s.after?.map((p, i) => (
        <p key={`a${i}`}>{p}</p>
      ))}
    </>
  );
}

export default function CasePack({ pack }: { pack: Section[] }) {
  return (
    <div className="card pack">
      {pack.map((s, i) => (
        <details key={s.heading} open={i === 0} className={s.small ? "small" : ""}>
          <summary>
            <span>
              {s.heading}
              {s.confidential && <span className="confidential">VC only</span>}
            </span>
          </summary>
          <div className="body">
            <Body s={s} />
            {s.subsections?.map((sub) => (
              <details key={sub.title} className="sub" open>
                <summary>{sub.title}</summary>
                <div className="body">
                  <Body s={sub} />
                </div>
              </details>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
