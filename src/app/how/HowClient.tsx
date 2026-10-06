"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, LoaderCircle, Minus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DietMark } from "@/components/bits";
import { DISHES } from "@/lib/dishes";
import { IMAGES } from "@/lib/images";
import { AVOID, INTENT, type AvoidKey, type IntentKey } from "@/lib/intent";
import { rank, type MatchResult } from "@/lib/rank";

const EXAMPLES = ["spicy without onions", "something light", "Jain food", "high protein, no dairy", "comfort food for a rainy evening", "I have chicken and 30 minutes"];

// A rough LLM baseline for the same job: read ~10k tokens of dishes, then write a ranked list.
// Assumptions are spelled out on the page; only Jev's numbers are measured.
const LLM = { ttftMs: 900, outTokens: 700, tokPerSec: 80, inPerM: 3, outPerM: 15 };

type Debug = MatchResult & { request?: { questions: Record<string, unknown>; state: unknown }; error?: string };

export default function HowClient({ initial }: { initial: string }) {
  const [text, setText] = useState(initial || EXAMPLES[0]);
  const [q, setQ] = useState(initial || EXAMPLES[0]);
  const [data, setData] = useState<Debug | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let live = true;
    const run = async () => {
      setBusy(true);
      try {
        const res = await fetch("/api/match", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ query: q, hour: new Date().getHours(), debug: true }) });
        const d = (await res.json()) as Debug;
        if (live) setData(d);
      } finally {
        if (live) setBusy(false);
      }
    };
    void run();
    return () => {
      live = false;
    };
  }, [q]);

  const ranked = useMemo(() => (data && !data.error ? rank(data) : []), [data]);
  const byFit = useMemo(() => (data && !data.error ? DISHES.map((d, i) => ({ d, i, p: data.fit[i] })).sort((a, b) => b.p - a.p) : []), [data]);
  const fitRank = useMemo(() => Object.fromEntries(byFit.map((x, i) => [x.d.id, i])), [byFit]);
  const llmMs = LLM.ttftMs + (LLM.outTokens / LLM.tokPerSec) * 1000;
  const llmCost = data ? (data.inputTokens / 1e6) * LLM.inPerM + (LLM.outTokens / 1e6) * LLM.outPerM : 0;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="hand inline-block -rotate-3 text-[22px] leading-none text-rani">Under the hood</div>
      <h1 className="display mt-2 text-[56px] uppercase sm:text-[68px]">
        How Jev picks <span className="text-rani">your dinner</span>
      </h1>
      <p className="mt-3 text-[16px] leading-relaxed text-ink-2">
        Jev is TypeSafe&apos;s System One model. It doesn&apos;t write text; it answers typed questions with probabilities, fast. Every search in Tadka is a
        single request that asks Jev about your words <i>and</i> about every dish at once. Plain code then turns the answers into a ranking.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (text.trim()) setQ(text.trim());
        }}
        className="mt-7 flex items-center gap-2.5 rounded-[18px] border-[2px] border-edge bg-surface px-4 py-3 shadow-[5px_5px_0_var(--edge)]"
      >
        <Search size={19} className="text-ink-3" />
        <input value={text} onChange={(e) => setText(e.target.value)} className="min-w-0 flex-1 bg-transparent text-[17px] outline-none" aria-label="Request to explain" />
        <button className="rounded-full border-[1.5px] border-edge bg-rani px-4 py-1.5 text-[14px] font-extrabold text-white shadow-[2px_2px_0_var(--edge)]">Explain</button>
      </form>
      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-2 pt-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {EXAMPLES.map((e) => (
          <button
            key={e}
            onClick={() => {
              setText(e);
              setQ(e);
            }}
            className={`shrink-0 rounded-full border-[1.5px] border-edge px-3.5 py-1.5 text-[13px] font-bold ${q === e ? "-rotate-2 bg-rani text-white shadow-[3px_3px_0_var(--edge)]" : "bg-surface text-ink"}`}
          >
            {e}
          </button>
        ))}
      </div>

      {busy && !data && (
        <div className="mt-10 flex items-center gap-2 text-ink-3">
          <LoaderCircle size={16} className="animate-spin" /> Asking Jev…
        </div>
      )}
      {data?.error && <p className="mt-8 rounded-2xl bg-chili/10 p-4 text-chili">Jev is unreachable right now: {data.error}</p>}

      {data && !data.error && (
        <motion.div key={data.query} initial={{ opacity: 0, y: 8 }} animate={{ opacity: busy ? 0.5 : 1, y: 0 }} className="mt-8 space-y-10">
          <Step n={1} title="One request, 79 questions">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Stat label="Questions" value={String(data.questions)} sub="6 choices · 5 yes/no · 68 dishes" />
              <Stat label="Jev latency" value={`${data.latencyMs} ms`} sub="one round trip" />
              <Stat label="Input tokens" value={data.inputTokens.toLocaleString()} sub="output is free" />
              <Stat label="Cost" value={`$${data.costUsd.toFixed(5)}`} sub="per search" />
            </div>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">
              The state is just your words and the time. Six <b>choice</b> questions ask what kind of food you mean, five <b>yes/no</b> questions ask
              what to avoid, and one yes/no per dish asks whether it&apos;s a good answer. Each dish question carries that dish&apos;s facts (diet,
              spice, onion, garlic, dairy and more), so Jev judges the dish, not just its name.
            </p>
            <details className="mt-3 card rounded-[18px] p-4">
              <summary className="cursor-pointer text-[13px] font-semibold text-rani">The exact request (first dish questions shown)</summary>
              <pre className="no-scrollbar mt-3 max-h-[420px] overflow-auto text-[11.5px] leading-relaxed text-ink-2">{JSON.stringify(trimRequest(data.request), null, 2)}</pre>
            </details>
          </Step>

          <Step n={2} title="What Jev heard in your words">
            <div className="grid gap-3 sm:grid-cols-2">
              {(Object.keys(INTENT) as IntentKey[]).map((k) => (
                <div key={k} className="card rounded-[18px] p-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[13px] font-semibold uppercase tracking-wider text-ink-3">{INTENT[k].label}</span>
                    <span className="text-[13px] font-semibold">{data.intent[k].choice}</span>
                  </div>
                  <div className="mt-2 space-y-1">
                    {Object.entries(data.intent[k].probs)
                      .sort((a, b) => b[1] - a[1])
                      .map(([o, p]) => (
                        <Bar key={o} label={o} p={p} strong={o === data.intent[k].choice} />
                      ))}
                  </div>
                </div>
              ))}
              <div className="card rounded-[18px] p-4 sm:col-span-2">
                <span className="text-[13px] font-semibold uppercase tracking-wider text-ink-3">Avoid? (yes/no)</span>
                <div className="mt-2 grid gap-1 sm:grid-cols-2 sm:gap-x-6">
                  {(Object.keys(AVOID) as AvoidKey[]).map((k) => (
                    <Bar key={k} label={`No ${k}`} p={data.avoid[k]} strong={data.avoid[k] >= 0.6} />
                  ))}
                </div>
              </div>
            </div>
          </Step>

          <Step n={3} title="How well each dish fits, according to Jev">
            <p className="mb-3 text-[14.5px] text-ink-2">The probability Jev gives each of the 68 dishes for “{data.query}”.</p>
            <div className="max-h-[520px] space-y-1 overflow-y-auto card rounded-[18px] p-3 no-scrollbar">
              {byFit.map(({ d, p }) => (
                <div key={d.id} className="grid grid-cols-[28px_minmax(0,150px)_1fr_40px] items-center gap-2 text-[13px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={IMAGES[d.id].small} alt="" loading="lazy" className="h-7 w-7 rounded-md object-cover" />
                  <span className="flex items-center gap-1.5 truncate">
                    <DietMark diet={d.diet} size={10} /> {d.name}
                  </span>
                  <span className="h-2 overflow-hidden rounded-full bg-bg-2">
                    <motion.span className="block h-full rounded-full bg-rani" initial={{ width: 0 }} animate={{ width: `${p * 100}%` }} transition={{ duration: 0.6 }} />
                  </span>
                  <span className="text-right tabular-nums text-ink-2">{Math.round(p * 100)}%</span>
                </div>
              ))}
            </div>
          </Step>

          <Step n={4} title="Rules in code turn answers into a ranking">
            <p className="text-[14.5px] leading-relaxed text-ink-2">
              <b>Match = Jev fit × diet × preferences × avoid.</b> Diet and ingredients to avoid are near-hard rules: once Jev is fairly sure you said
              “without onions” (above about 30%), every dish containing onion is scaled down, reaching ×0.03 when Jev is certain. Spice, meal, weight, time and region only nudge, since
              Jev&apos;s fit already weighs them. Every factor is weighted by Jev&apos;s probabilities, so an unsure answer pulls less than a sure one.
            </p>
            <div className="mt-3 space-y-2">
              {ranked.slice(0, 8).map((r) => (
                <div key={r.dish.id} className="card rounded-[18px] p-3">
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={IMAGES[r.dish.id].small} alt="" className="h-9 w-9 rounded-lg object-cover" />
                    <span className="flex-1 truncate text-[15px] font-semibold">{r.dish.name}</span>
                    <span className="text-[17px] font-semibold tabular-nums text-rani">{Math.round(r.score * 100)}%</span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1 text-[12px]">
                    {r.factors.map((f, i) => (
                      <span key={f.key} className="flex items-center gap-1">
                        {i > 0 && <span className="text-ink-3">×</span>}
                        <span className={`rounded-full px-2 py-0.5 font-medium ${f.key === "fit" ? "bg-rani/15 text-rani" : f.value < 0.5 ? "bg-chili/10 text-chili" : "bg-bg-2 text-ink-2"}`} title={f.note}>
                          {f.label} {f.value.toFixed(2)}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Step>

          <Step n={5} title="The final order">
            <ol className="space-y-1.5">
              {ranked.slice(0, 10).map((r, i) => {
                const moved = fitRank[r.dish.id] - i;
                return (
                  <li key={r.dish.id} className="flex items-center gap-3 card rounded-[14px] px-3 py-2 text-[14.5px]">
                    <span className="w-5 text-right font-semibold tabular-nums text-ink-3">{i + 1}</span>
                    <span className="flex-1 truncate font-medium">{r.dish.name}</span>
                    <span className={`flex items-center gap-0.5 text-[12px] font-semibold ${moved > 0 ? "text-leaf" : moved < 0 ? "text-chili" : "text-ink-3"}`} title="Places moved by the rules, versus Jev fit alone">
                      {moved > 0 ? <ArrowUp size={12} /> : moved < 0 ? <ArrowDown size={12} /> : <Minus size={12} />}
                      {moved !== 0 ? Math.abs(moved) : ""}
                    </span>
                    <span className="w-10 text-right font-semibold tabular-nums text-rani">{Math.round(r.score * 100)}</span>
                  </li>
                );
              })}
            </ol>
            <p className="mt-2 text-[12.5px] text-ink-3">Arrows show how many places the rules moved a dish compared with Jev&apos;s fit alone.</p>
          </Step>

          <Step n={6} title="Why this needs a model like Jev">
            <div className="grid gap-3 sm:grid-cols-2">
              <Compare label="Jev (measured)" ms={data.latencyMs || 150} cost={data.costUsd} color="var(--rani)" max={llmMs} />
              <Compare label="LLM writing a ranked list (estimate)" ms={llmMs} cost={llmCost} color="var(--ink-3)" max={llmMs} />
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-3">
              Searching as you type only works if the answer lands before you notice. Tadka waits {500} ms after your last keystroke, then Jev answers
              in about {data.latencyMs || 150} ms. The LLM estimate assumes the same ~{data.inputTokens.toLocaleString()} input tokens, {LLM.ttftMs} ms to
              first token, {LLM.outTokens} output tokens at {LLM.tokPerSec} tokens/s, and ${LLM.inPerM}/${LLM.outPerM} per million tokens. It would also
              return free text that has to be parsed and checked; Jev returns typed answers with probabilities.
            </p>
          </Step>
        </motion.div>
      )}
    </div>
  );
}

function trimRequest(req: Debug["request"]) {
  if (!req) return null;
  const entries = Object.entries(req.questions);
  const keep = entries.filter(([k]) => !k.startsWith("dish_")).concat(entries.filter(([k]) => k.startsWith("dish_")).slice(0, 2));
  return { model: "jev-latest", state: req.state, questions: { ...Object.fromEntries(keep), "…": `${entries.length - keep.length} more dish questions` } };
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2.5">
        <span className="display grid h-10 w-10 shrink-0 -rotate-6 place-items-center rounded-[12px] border-[2px] border-edge bg-pista text-[24px] text-[#0d2b30] shadow-[3px_3px_0_var(--edge)]">{n}</span>
        <h2 className="display text-[30px] uppercase">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="card rounded-[18px] p-3">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-3">{label}</div>
      <div className="display mt-1 text-[34px] tabular-nums">{value}</div>
      <div className="text-[11.5px] text-ink-3">{sub}</div>
    </div>
  );
}

function Bar({ label, p, strong }: { label: string; p: number; strong?: boolean }) {
  return (
    <div className="grid grid-cols-[minmax(0,130px)_1fr_38px] items-center gap-2 text-[13px]">
      <span className={`truncate ${strong ? "font-semibold" : "text-ink-2"}`}>{label}</span>
      <span className="h-1.5 overflow-hidden rounded-full bg-bg-2">
        <motion.span className="block h-full rounded-full" style={{ background: strong ? "var(--rani)" : "var(--ink-3)" }} initial={{ width: 0 }} animate={{ width: `${p * 100}%` }} transition={{ duration: 0.5 }} />
      </span>
      <span className="text-right tabular-nums text-ink-2">{Math.round(p * 100)}%</span>
    </div>
  );
}

function Compare({ label, ms, cost, color, max }: { label: string; ms: number; cost: number; color: string; max: number }) {
  return (
    <div className="card rounded-[18px] p-4">
      <div className="text-[13px] font-semibold">{label}</div>
      <div className="display mt-1 text-[40px] tabular-nums">{ms >= 1000 ? `${(ms / 1000).toFixed(1)} s` : `${ms} ms`}</div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-bg-2">
        <motion.div className="h-full rounded-full" style={{ background: color }} initial={{ width: 0 }} animate={{ width: `${Math.max(2, (ms / max) * 100)}%` }} transition={{ duration: 0.8 }} />
      </div>
      <div className="mt-2 text-[12.5px] text-ink-3">${cost.toFixed(5)} per search</div>
    </div>
  );
}
