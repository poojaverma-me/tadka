"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { Clock, RotateCcw } from "lucide-react";
import { useState } from "react";
import { IMAGES } from "@/lib/images";
import type { Ranked } from "@/lib/rank";
import { DietMark, Spice, minutesLabel } from "./bits";

const DEPTH = 4;

/**
 * The top matches as a physical stack of cards. When the ranking changes, cards fly to their new
 * depth in 3D; the front card can be swiped away to reveal the next.
 */
export default function Deck({ items, wave, onOpen }: { items: Ranked[]; wave: string; onOpen: (r: Ranked) => void }) {
  // How many cards have been swiped off the front, per result set.
  const [skip, setSkip] = useState({ wave, n: 0 });
  const offset = skip.wave === wave ? skip.n : 0;
  const visible = items.slice(offset, offset + DEPTH);

  const swipe = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 500) setSkip({ wave, n: Math.min(offset + 1, items.length - 1) });
  };

  return (
    <div className="relative pt-10">
      <div className="relative mx-auto aspect-[4/5] w-full max-w-[420px] sm:aspect-[5/6]" style={{ perspective: 1400, perspectiveOrigin: "50% 0%" }}>
        <AnimatePresence initial={false}>
          {visible
            .map((r, i) => (
              <motion.button
                key={r.dish.id}
                type="button"
                onClick={() => i === 0 && onOpen(r)}
                className="absolute inset-0 overflow-hidden rounded-[26px] border-[2.5px] border-edge text-left will-change-transform"
                style={{ zIndex: DEPTH - i, transformStyle: "preserve-3d", boxShadow: "7px 7px 0 var(--edge)", pointerEvents: i === 0 ? "auto" : "none" }}
                initial={{ y: 90, z: -220, rotateX: -24, opacity: 0, scale: 0.9 }}
                animate={{ y: -i * 22, z: -i * 70, rotateX: i * 3, scale: 1 - i * 0.045, opacity: 1 - i * 0.12, filter: `brightness(${1 - i * 0.12})` }}
                exit={{ y: -40, z: -320, rotateX: 18, opacity: 0, transition: { duration: 0.35 } }}
                transition={{ type: "spring", stiffness: 210, damping: 24, mass: 0.9, delay: i * 0.05 }}
                drag={i === 0 ? "x" : false}
                dragSnapToOrigin
                dragElastic={0.7}
                onDragEnd={i === 0 ? swipe : undefined}
                whileTap={i === 0 ? { scale: 0.985 } : undefined}
                aria-label={i === 0 ? `Open ${r.dish.name}` : undefined}
                tabIndex={i === 0 ? 0 : -1}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={IMAGES[r.dish.id].src} alt={r.dish.name} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06191c]/95 via-[#06191c]/30 to-transparent" />
                <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border-[1.5px] border-edge bg-white px-2.5 py-1 text-[12px] font-bold text-[#0d2b30]">
                  <DietMark diet={r.dish.diet} size={12} /> {r.dish.region === "Pan-Indian" ? "All over India" : `${r.dish.state}`}
                </div>
                <div className="absolute right-3 top-3 grid h-[58px] w-[58px] rotate-6 place-items-center rounded-full border-[2px] border-edge bg-pista text-[#0d2b30] shadow-[3px_3px_0_var(--edge)]">
                  <span className="display text-[24px] leading-none">{Math.round(r.score * 100)}</span>
                  <span className="-mt-2 text-[8.5px] font-extrabold uppercase tracking-wider">match</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  {i === 0 && (
                    <div className="mb-2 flex items-center gap-2">
                      <span className="-rotate-3 rounded-md border-[1.5px] border-edge bg-rani px-2 py-0.5 text-[12px] font-extrabold uppercase tracking-wide text-white shadow-[2px_2px_0_var(--edge)]">{offset === 0 ? "Top pick" : `Pick #${offset + 1}`}</span>
                      {offset + 1 < items.length && <span className="hand text-[16px] text-white/80">swipe me →</span>}
                    </div>
                  )}
                  <div className="display text-[44px] uppercase">{r.dish.name}</div>
                  {r.dish.local && <div className="hand mt-0.5 text-[19px] text-pista">{r.dish.local}</div>}
                  <p className="mt-2 line-clamp-2 text-[14.5px] leading-snug text-white/85">{r.dish.blurb}</p>
                  <div className="mt-3 flex items-center gap-3 text-[12.5px] font-medium text-white/85">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={13} /> {minutesLabel(r.dish.minutes)}
                    </span>
                    <Spice level={r.dish.spice} className="[&_svg]:!text-white/30 [&_svg[fill=currentColor]]:!text-[#ff7a50]" />
                    <span>{r.dish.feel}</span>
                  </div>
                </div>
              </motion.button>
            ))
            .reverse()}
        </AnimatePresence>
      </div>
      {offset > 0 && (
        <button onClick={() => setSkip({ wave, n: 0 })} className="mx-auto mt-5 flex items-center gap-1.5 rounded-full border-[1.5px] border-edge bg-surface px-3.5 py-1.5 text-[13px] font-bold shadow-[3px_3px_0_var(--edge)]">
          <RotateCcw size={14} /> Back to top pick
        </button>
      )}
    </div>
  );
}
