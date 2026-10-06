"use client";

import { AnimatePresence, motion } from "framer-motion";
import { LoaderCircle, Search, Sparkles, WifiOff, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { mealForHour } from "@/lib/offline";
import { rank, understood, type Ranked } from "@/lib/rank";
import { useMatch } from "@/lib/useMatch";
import Deck from "./Deck";
import DishSheet from "./DishSheet";
import ResultList from "./ResultList";

const EXAMPLES = [
  "something light",
  "spicy without onions",
  "quick vegetarian breakfast",
  "comfort food for a rainy evening",
  "Jain food",
  "high protein, no dairy",
  "something sweet for Diwali",
  "South Indian brunch",
  "mild enough for the kids",
  "street food craving",
];

// The hour only matters to the minute; read it once on the client.
const subscribe = () => () => {};
const clientHour = () => new Date().getHours();
const serverHour = () => 19;

function greeting(h: number) {
  if (h >= 5 && h < 12) return "Good morning";
  if (h >= 12 && h < 17) return "Good afternoon";
  return "Good evening";
}

export default function Kitchen() {
  const hour = useSyncExternalStore(subscribe, clientHour, serverHour);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Ranked | null>(null);
  const { result, status, wallMs } = useMatch(query, hour);
  const ranked = useMemo(() => rank(result), [result]);
  const chips = useMemo(() => (result.source === "jev" ? understood(result) : []), [result]);
  const wave = `${result.query}|${result.source}`;
  const meal = mealForHour(hour);
  const searching = result.query !== "";
  const weak = searching && ranked[0] && ranked[0].score < 0.25;

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,440px)_1fr] lg:gap-10">
      <section className="lg:sticky lg:top-24 lg:self-start">
        <div className="hand inline-block -rotate-3 text-[22px] leading-none text-rani">{greeting(hour)}!</div>
        <h1 className="display mt-2 text-[58px] uppercase sm:text-[72px] lg:text-[60px]">
          What to cook
          <span className="relative ml-1 mt-1 inline-block -rotate-2 rounded-[14px] border-[2px] border-edge bg-pista px-3 pb-1 pt-2 text-[#0d2b30] shadow-[5px_5px_0_var(--edge)]">today?</span>
        </h1>

        <label className="mt-7 flex items-center gap-2.5 rounded-[18px] border-[2px] border-edge bg-surface px-4 py-3.5 shadow-[5px_5px_0_var(--edge)] transition focus-within:-translate-x-[2px] focus-within:-translate-y-[2px] focus-within:shadow-[7px_7px_0_var(--rani)]">
          <Search size={20} strokeWidth={2.6} className="shrink-0 text-rani" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Try “${meal.hint}”…`}
            className="min-w-0 flex-1 bg-transparent text-[18px] font-semibold outline-none placeholder:font-medium placeholder:text-ink-3"
            enterKeyHint="search"
            aria-label="Describe what you feel like eating"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear" className="grid h-7 w-7 place-items-center rounded-full border-[1.5px] border-edge bg-bg-2 text-ink">
              <X size={14} />
            </button>
          )}
        </label>

        <Status status={status} latency={result.latencyMs} wall={wallMs} questions={result.questions} cost={result.costUsd} />

        <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-2 pt-1 lg:mx-0 lg:px-0 lg:[mask-image:linear-gradient(to_right,black_85%,transparent)]">
          {EXAMPLES.map((e) => (
            <button
              key={e}
              onClick={() => setQuery(e)}
              className={`shrink-0 rounded-full border-[1.5px] border-edge px-3.5 py-1.5 text-[13.5px] font-bold transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${query === e ? "-rotate-2 bg-rani text-white shadow-[3px_3px_0_var(--edge)]" : "bg-surface text-ink hover:bg-bg-2"}`}
            >
              {e}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {chips.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 flex flex-wrap items-center gap-1.5">
              <span className="hand mr-1 inline-flex items-center gap-1 text-[18px] text-peacock">
                <Sparkles size={15} className="text-rani" /> Jev heard →
              </span>
              {chips.map((c, i) => (
                <span key={c.label} className={`rounded-md border-[1.5px] border-edge bg-pista px-2 py-0.5 text-[13px] font-bold text-[#0d2b30] ${i % 2 ? "rotate-1" : "-rotate-1"}`}>
                  {c.label} <span className="font-semibold opacity-60">{Math.round(c.p * 100)}%</span>
                </span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="display text-[30px] uppercase">{searching ? (weak ? "Closest options" : "Best matches") : meal.title}</h2>
            {searching && (
              <Link href={`/how?q=${encodeURIComponent(result.query)}`} className="hand rotate-2 text-[18px] text-rani underline decoration-wavy underline-offset-4">
                why these?
              </Link>
            )}
          </div>
          {weak && <p className="-mt-1 mb-3 text-[13.5px] text-ink-2">Nothing fits every part of that exactly. These come closest.</p>}
          <Deck items={ranked.slice(0, 8)} wave={wave} onOpen={setOpen} />
        </div>
      </section>

      <section className="mt-10 lg:mt-0">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="display text-[30px] uppercase">{searching ? "Everything else, ranked" : "More to explore"}</h2>
          <span className="hand text-[17px] text-ink-3">{ranked.length} dishes</span>
        </div>
        <ResultList items={ranked.slice(1)} wave={wave} onOpen={setOpen} showScore={searching} />
        <p className="mt-8 text-center text-[12px] text-ink-3">
          68 classic dishes · search by Jev ·{" "}
          <Link href="/credits" className="underline underline-offset-2">
            photo credits
          </Link>
        </p>
      </section>

      <DishSheet item={open} onClose={() => setOpen(null)} query={searching ? result.query : undefined} />
    </div>
  );
}

function Status({ status, latency, wall, questions, cost }: { status: string; latency: number; wall: number; questions: number; cost: number }) {
  return (
    <div className="mt-2 flex h-5 items-center gap-1.5 px-1 text-[12.5px] text-ink-3" aria-live="polite">
      {status === "typing" && <span>Waiting for you to finish typing…</span>}
      {status === "thinking" && (
        <>
          <LoaderCircle size={13} className="animate-spin text-rani" /> Jev is reading all 68 dishes…
        </>
      )}
      {status === "done" && (
        <span>
          <span className="font-extrabold text-rani">Jev</span> · {latency ? `${latency} ms` : `cached, ${wall} ms`} · {questions} questions in one request · ${cost.toFixed(5)}
        </span>
      )}
      {status === "offline" && (
        <>
          <WifiOff size={13} /> Offline: simple keyword match until you&apos;re back online
        </>
      )}
      {status === "today" && <span>Picks for the time of day. Type anything to ask Jev.</span>}
    </div>
  );
}
