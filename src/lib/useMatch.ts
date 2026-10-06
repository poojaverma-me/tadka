"use client";

import { useEffect, useRef, useState } from "react";
import { offlineMatch, todaysPicks } from "./offline";
import type { MatchResult } from "./rank";

export type MatchStatus = "today" | "typing" | "thinking" | "done" | "offline";

/** Half a second after typing stops, ask Jev. Newer keystrokes cancel older requests. */
export const DEBOUNCE_MS = 500;

export function useMatch(query: string, hour: number) {
  const [result, setResult] = useState<MatchResult>(() => todaysPicks(hour));
  const [status, setStatus] = useState<MatchStatus>("today");
  const [wallMs, setWallMs] = useState(0);
  const ctrl = useRef<AbortController | null>(null);
  const q = query.trim();

  useEffect(() => {
    ctrl.current?.abort();
    if (!q) {
      const t = setTimeout(() => {
        setResult(todaysPicks(hour));
        setStatus("today");
      }, 0);
      return () => clearTimeout(t);
    }
    const typing = setTimeout(() => setStatus("typing"), 0);
    const t = setTimeout(async () => {
      const c = new AbortController();
      ctrl.current = c;
      setStatus("thinking");
      const started = performance.now();
      try {
        if (typeof navigator !== "undefined" && !navigator.onLine) throw new Error("offline");
        const res = await fetch("/api/match", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ query: q, hour }),
          signal: c.signal,
        });
        const data = await res.json();
        if (!res.ok || data.error) throw new Error(data.error || res.statusText);
        if (c.signal.aborted) return;
        setWallMs(Math.round(performance.now() - started));
        setResult(data as MatchResult);
        setStatus("done");
      } catch (err) {
        if (c.signal.aborted || (err as Error).name === "AbortError") return;
        setResult(offlineMatch(q));
        setStatus("offline");
      }
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(typing);
      clearTimeout(t);
    };
  }, [q, hour]);

  return { result, status, wallMs };
}
