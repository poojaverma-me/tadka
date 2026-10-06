"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { IMAGES } from "@/lib/images";
import type { Ranked } from "@/lib/rank";
import { DietMark, Spice, minutesLabel } from "./bits";

/**
 * Every other dish, best first. Positions glide to their new rank (layout animation) while each
 * card re-settles out of a slight 3D tilt, so a new search reads as the deck being re-stacked.
 */
export default function ResultList({ items, wave, onOpen, showScore = true }: { items: Ranked[]; wave: string; onOpen: (r: Ranked) => void; showScore?: boolean }) {
  return (
    <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2" style={{ perspective: 1200 }}>
      {items.map((r, i) => (
        <motion.li key={r.dish.id} layout="position" transition={{ type: "spring", stiffness: 260, damping: 30, mass: 0.8 }}>
          <motion.button
            key={wave}
            type="button"
            onClick={() => onOpen(r)}
            initial={{ rotateX: 28, y: 22, z: -60, opacity: 0 }}
            animate={{ rotateX: 0, y: 0, z: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 240, damping: 26, delay: Math.min(i, 14) * 0.03 }}
            whileTap={{ scale: 0.98 }}
            className="card flex w-full items-center gap-3 rounded-[18px] p-2.5 text-left transition-[transform,box-shadow] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[5px_5px_0_var(--edge)]"
            style={{ transformOrigin: "50% 0%" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMAGES[r.dish.id].small} alt="" loading="lazy" className="h-[76px] w-[76px] shrink-0 rounded-[12px] border-[1.5px] border-edge object-cover" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <DietMark diet={r.dish.diet} size={12} />
                <span className="truncate text-[16px] font-extrabold tracking-tight">{r.dish.name}</span>
              </div>
              <p className="mt-0.5 line-clamp-1 text-[13px] text-ink-2">{r.dish.blurb}</p>
              <div className="mt-1.5 flex items-center gap-2.5 whitespace-nowrap text-[12px] text-ink-3">
                <span className="inline-flex shrink-0 items-center gap-1">
                  <Clock size={12} /> {minutesLabel(r.dish.minutes)}
                </span>
                <Spice level={r.dish.spice} className="shrink-0" />
              </div>
            </div>
            {showScore && (
              <div className="w-12 shrink-0 text-right">
                <div className="display text-[28px] tabular-nums" style={{ color: r.score >= 0.5 ? "var(--rani)" : "var(--ink-3)" }}>
                  {Math.round(r.score * 100)}
                </div>
                <div className="text-[9.5px] font-extrabold uppercase tracking-wider text-ink-3">match</div>
              </div>
            )}
          </motion.button>
        </motion.li>
      ))}
    </ul>
  );
}
