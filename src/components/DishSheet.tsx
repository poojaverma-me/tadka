"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, BookmarkCheck, Check, Clock, MapPin, X } from "lucide-react";
import { useEffect } from "react";
import { IMAGES } from "@/lib/images";
import type { Ranked } from "@/lib/rank";
import { useSaved } from "@/lib/saved";
import { DietMark, Spice, minutesLabel } from "./bits";

const CONTAINS = [
  ["onion", "Onion"],
  ["garlic", "Garlic"],
  ["dairy", "Dairy"],
  ["gluten", "Gluten"],
  ["nuts", "Nuts"],
] as const;

/** Full recipe card: a bottom sheet on phones, a centred panel on larger screens. */
export default function DishSheet({ item, onClose, query }: { item: Ranked | null; onClose: () => void; query?: string }) {
  const saved = useSaved();
  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={onClose} />
          <motion.article
            role="dialog"
            aria-modal="true"
            aria-label={item.dish.name}
            className="relative max-h-[92dvh] w-full max-w-[560px] overflow-y-auto rounded-t-[28px] border-[2.5px] border-b-0 border-edge bg-bg no-scrollbar sm:rounded-[28px] sm:border-b-[2.5px] sm:shadow-[8px_8px_0_var(--edge)]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 34 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, i) => (i.offset.y > 120 || i.velocity.y > 600) && onClose()}
          >
            <Body item={item} onClose={onClose} saved={saved} query={query} />
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Body({ item, onClose, saved, query }: { item: Ranked; onClose: () => void; saved: ReturnType<typeof useSaved>; query?: string }) {
  const { dish } = item;
  const img = IMAGES[dish.id];
  const isSaved = saved.has(dish.id);
  return (
    <>
      <div className="relative aspect-[16/11] w-full border-b-[2.5px] border-edge">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img.src} alt={dish.name} className="h-full w-full object-cover" draggable={false} />
        <div className="absolute inset-x-0 top-0 flex justify-center pt-2 sm:hidden">
          <span className="h-1.5 w-10 rounded-full bg-white/70" />
        </div>
        <button onClick={onClose} aria-label="Close" className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full border-[1.5px] border-edge bg-white text-[#0d2b30] shadow-[2px_2px_0_var(--edge)]">
          <X size={18} />
        </button>
        <button
          onClick={() => saved.toggle(dish.id)}
          aria-pressed={isSaved}
          className={`absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border-[1.5px] border-edge px-4 py-2 text-[14px] font-extrabold shadow-[3px_3px_0_var(--edge)] transition ${isSaved ? "rotate-2 bg-rani text-white" : "bg-pista text-[#0d2b30]"}`}
        >
          {isSaved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />} {isSaved ? "Saved" : "Save"}
        </button>
      </div>

      <div className="px-5 pb-10 pt-5">
        <div className="flex items-center gap-2 text-[12.5px] font-medium text-ink-3">
          <DietMark diet={dish.diet} size={13} /> {dish.diet} · {dish.course}
          <span className="inline-flex items-center gap-0.5">
            <MapPin size={12} /> {dish.state}
          </span>
        </div>
        <h2 className="display mt-2 text-[52px] uppercase">
          {dish.name}
        </h2>
        {dish.local && <div className="hand -rotate-1 text-[22px] text-rani">{dish.local}</div>}
        <p className="mt-3 text-[16px] leading-relaxed text-ink-2">{dish.blurb}</p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Fact label="Time" value={minutesLabel(dish.minutes)} icon={<Clock size={14} />} />
          <Fact label="Spice" value={<Spice level={dish.spice} />} />
          <Fact label="Feels" value={dish.feel} />
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {dish.tags.map((t) => (
            <span key={t} className="rounded-full border-[1.5px] border-edge bg-surface px-2.5 py-0.5 text-[12.5px] font-bold">
              {t}
            </span>
          ))}
        </div>

        {query && item.factors.length > 0 && (
          <section className="mt-6 rounded-[20px] border-[2px] border-edge bg-peacock p-4 text-white shadow-[5px_5px_0_var(--edge)] [--ink-2:rgba(255,255,255,.8)] [--bg-2:rgba(255,255,255,.15)]">
            <div className="flex items-baseline justify-between">
              <h3 className="display text-[24px] uppercase text-pista">Why Jev picked this</h3>
              <span className="hand text-[16px] text-white/75">for “{query}”</span>
            </div>
            <div className="mt-3 space-y-2">
              {item.factors.map((f) => (
                <div key={f.key} className="grid grid-cols-[92px_1fr_40px] items-center gap-2 text-[13px]">
                  <span className="font-medium">{f.label}</span>
                  <span className="h-1.5 overflow-hidden rounded-full bg-bg-2">
                    <span className="block h-full rounded-full" style={{ width: `${f.value * 100}%`, background: f.key === "fit" ? "var(--pista)" : f.value < 0.5 ? "#ff7a50" : "#ffffff" }} />
                  </span>
                  <span className="text-right tabular-nums text-ink-2">×{f.value.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 border-t border-white/20 pt-2 text-right text-[14px] font-bold">
              Match <span className="display ml-1 text-[28px] text-pista">{Math.round(item.score * 100)}%</span>
            </div>
          </section>
        )}

        <section className="mt-6">
          <h3 className="hand text-[22px] leading-none text-rani">contains</h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {CONTAINS.map(([k, label]) => (
              <span key={k} className={`inline-flex items-center gap-1 rounded-full border-[1.5px] px-2.5 py-1 text-[12.5px] font-bold ${dish.has[k] ? "border-chili text-chili" : "border-leaf text-leaf"}`}>
                {dish.has[k] ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />} {label}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h3 className="hand text-[22px] leading-none text-rani">you&apos;ll need</h3>
          <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[14.5px]">
            {dish.ingredients.map((x) => (
              <li key={x} className="flex gap-2">
                <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rotate-45 bg-rani" /> {x}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6">
          <h3 className="hand text-[22px] leading-none text-rani">method</h3>
          <ol className="mt-2 space-y-3">
            {dish.steps.map((s, i) => (
              <li key={i} className="flex gap-3 text-[15px] leading-relaxed">
                <span className="display grid h-8 w-8 shrink-0 place-items-center rounded-full border-[1.5px] border-edge bg-pista text-[18px] text-[#0d2b30]">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </section>

        <p className="mt-8 text-[11.5px] leading-relaxed text-ink-3">
          Photo:{" "}
          <a href={img.page} target="_blank" rel="noreferrer" className="underline underline-offset-2">
            {img.credit}
          </a>
          , {img.licenseUrl ? <a href={img.licenseUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">{img.license}</a> : img.license}, via Wikimedia Commons.
        </p>
      </div>
    </>
  );
}

function Fact({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="card rounded-[16px] px-3 py-2.5">
      <div className="text-[10.5px] font-extrabold uppercase tracking-wider text-ink-3">{label}</div>
      <div className="mt-0.5 flex items-center gap-1 text-[15px] font-extrabold">
        {icon}
        {value}
      </div>
    </div>
  );
}
