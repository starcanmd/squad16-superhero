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
  onSubmit: (code: string) => void;
  busy: boolean;
  error: string | null;
}) {
  const [code, setCode] = useState("");
  return (
    <div className="gate wrap">
      <h2 className="serif">{title}</h2>
      <p>{blurb}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (code.trim()) onSubmit(code.trim());
        }}
      >
        <input
          type="text"
          placeholder="Passcode"
          value={code}
          autoComplete="off"
          autoCapitalize="characters"
          onChange={(e) => setCode(e.target.value)}
          aria-label="Passcode"
          className="code"
        />
        <button className="btn" type="submit" disabled={busy || !code.trim()}>
          {busy ? "Checking" : "Open"}
        </button>
      </form>
      {error && <div className="err">{error}</div>}
    </div>
  );
}
