"use client";
import { useState } from "react";

export default function Gate({
  title,
  blurb,
  onSubmit,
  busy,
  error,
}: {
  title: string;
  blurb: string;
  onSubmit: (email: string) => void;
  busy: boolean;
  error: string | null;
}) {
  const [email, setEmail] = useState("");
  return (
    <div className="gate wrap">
      <h2 className="serif">{title}</h2>
      <p>{blurb}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (email.trim()) onSubmit(email.trim());
        }}
      >
        <input
          type="email"
          placeholder="sunetid@stanford.edu"
          value={email}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Stanford email"
        />
        <button className="btn" type="submit" disabled={busy || !email.trim()}>
          {busy ? "Checking" : "Open"}
        </button>
      </form>
      {error && <div className="err">{error}</div>}
    </div>
  );
}
