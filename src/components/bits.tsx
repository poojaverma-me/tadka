import { Flame } from "lucide-react";
import type { Dish } from "@/lib/dishes";

/** India's food-packaging mark: green square-and-dot for vegetarian, brown triangle for non-veg. */
export function DietMark({ diet, size = 14 }: { diet: Dish["diet"]; size?: number }) {
  const veg = diet === "Vegan" || diet === "Vegetarian";
  const color = veg ? "#2f8f3a" : diet === "Egg" ? "#d4972b" : "#8a3b1f";
  return (
    <span aria-label={veg ? "Vegetarian" : diet === "Egg" ? "Contains egg" : "Non-vegetarian"} className="inline-grid shrink-0 place-items-center rounded-[3px] border-[1.5px] bg-white" style={{ width: size, height: size, borderColor: color }}>
      {veg ? (
        <span className="rounded-full" style={{ width: size * 0.45, height: size * 0.45, background: color }} />
      ) : (
        <span style={{ width: 0, height: 0, borderLeft: `${size * 0.26}px solid transparent`, borderRight: `${size * 0.26}px solid transparent`, borderBottom: `${size * 0.42}px solid ${color}` }} />
      )}
    </span>
  );
}

export function Spice({ level, className = "" }: { level: number; className?: string }) {
  return (
    <span className={`inline-flex items-center ${className}`} aria-label={`Spice ${level} of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Flame key={i} size={12} strokeWidth={2.4} className={i < level ? "text-chili" : "text-ink-3/35"} fill={i < level ? "currentColor" : "none"} />
      ))}
    </span>
  );
}

/** A small ring showing a 0–1 score. */
export function Ring({ value, size = 44, stroke = 4, label }: { value: number; size?: number; stroke?: number; label?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.round(value * 100);
  return (
    <span className="relative inline-grid place-items-center" style={{ width: size, height: size }} aria-label={label ?? `${pct}% match`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeOpacity={0.18} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value)} style={{ transition: "stroke-dashoffset .6s cubic-bezier(.2,.8,.2,1)" }} />
      </svg>
      <span className="absolute text-[11px] font-semibold tabular-nums">{pct}</span>
    </span>
  );
}

export function minutesLabel(m: number) {
  return m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} m` : ""}` : `${m} min`;
}
