import { DISHES, type Dish } from "./dishes";
import { AVOID, INTENT, type AvoidKey, type IntentKey } from "./intent";

/** What /api/match returns: Jev's typed answers, untouched. */
export type MatchResult = {
  query: string;
  intent: Record<IntentKey, { choice: string; probs: Record<string, number>; confidence: number }>;
  avoid: Record<AvoidKey, number>;
  /** Jev's "good answer?" probability for each dish, in DISHES order. */
  fit: number[];
  questions: number;
  latencyMs: number;
  inputTokens: number;
  costUsd: number;
  request?: unknown;
  source: "jev" | "offline";
};

export type Factor = { key: string; label: string; value: number; note: string };
export type Ranked = { dish: Dish; index: number; score: number; fit: number; factors: Factor[] };

const MEAT = new Set(["Chicken", "Mutton", "Fish", "Pork"]);

function dietCompat(option: string, d: Dish) {
  switch (option) {
    case "Vegetarian":
      return d.diet === "Vegetarian" || d.diet === "Vegan" ? 1 : 0.02;
    case "Vegan":
      return d.diet === "Vegan" ? 1 : d.diet === "Vegetarian" ? 0.06 : 0.02;
    case "Eggetarian":
      return MEAT.has(d.diet) ? 0.02 : 1;
    case "Wants meat or fish":
      return MEAT.has(d.diet) ? 1 : d.diet === "Egg" ? 0.45 : 0.15;
    default:
      return 1;
  }
}

function spiceCompat(option: string, d: Dish) {
  if (option === "Mild") return d.spice <= 2 ? 1 : d.spice === 3 ? 0.45 : 0.12;
  if (option === "Medium") return d.spice === 2 || d.spice === 3 ? 1 : 0.55;
  if (option === "Spicy") return d.spice >= 4 ? 1 : d.spice === 3 ? 0.6 : 0.2;
  return 1;
}

function courseCompat(option: string, d: Dish) {
  if (option === "Breakfast") return d.course === "Breakfast" ? 1 : d.course === "Snack" ? 0.45 : 0.2;
  if (option === "Main meal") return d.course === "Main" || d.course === "Rice" ? 1 : 0.3;
  if (option === "Snack") return d.course === "Snack" ? 1 : d.course === "Breakfast" ? 0.5 : 0.25;
  if (option === "Dessert") return d.course === "Dessert" ? 1 : 0.05;
  if (option === "Drink") return d.course === "Drink" ? 1 : 0.05;
  return 1;
}

function feelCompat(option: string, d: Dish) {
  if (option === "Light") return d.feel === "Light" ? 1 : d.feel === "Medium" ? 0.6 : 0.25;
  if (option === "Hearty") return d.feel === "Rich" ? 1 : d.feel === "Medium" ? 0.7 : 0.35;
  return 1;
}

function timeCompat(option: string, d: Dish) {
  if (option === "Quick") return d.minutes <= 30 ? 1 : d.minutes <= 45 ? 0.55 : 0.2;
  if (option === "Leisurely") return d.minutes >= 60 ? 1 : 0.7;
  return 1;
}

function regionCompat(option: string, d: Dish) {
  if (option === "Any") return 1;
  if (d.region === option) return 1;
  return d.region === "Pan-Indian" ? 0.6 : 0.3;
}

const COMPAT: Record<IntentKey, (o: string, d: Dish) => number> = {
  diet: dietCompat,
  spice: spiceCompat,
  course: courseCompat,
  feel: feelCompat,
  time: timeCompat,
  region: regionCompat,
};

/** Probability-weighted: an unsure answer pulls less than a confident one. */
function expected(probs: Record<string, number>, f: (o: string) => number) {
  let s = 0;
  let total = 0;
  for (const [o, p] of Object.entries(probs)) {
    s += p * f(o);
    total += p;
  }
  return total > 0 ? s / total : 1;
}

/**
 * The ranking rules, all in code: Jev's per-dish fit, multiplied by how well the dish meets each
 * thing Jev heard in the request. Ingredients to avoid act as near-hard filters.
 */
export function rank(r: MatchResult): Ranked[] {
  const out = DISHES.map((dish, index) => {
    const fit = r.fit[index] ?? 0;
    const factors: Factor[] = [{ key: "fit", label: "Jev fit", value: fit, note: "Jev: is this a good answer to the request?" }];
    for (const k of Object.keys(INTENT) as IntentKey[]) {
      const a = r.intent[k];
      if (!a) continue;
      // Diet is a hard rule; the rest are preferences Jev's fit already weighs, so they only nudge.
      const raw = expected(a.probs, (o) => COMPAT[k](o, dish));
      const v = k === "diet" ? raw : 0.45 + 0.55 * raw;
      if (v < 0.995) factors.push({ key: k, label: INTENT[k].label, value: v, note: `wants ${a.choice}` });
    }
    for (const k of Object.keys(AVOID) as AvoidKey[]) {
      // Only act once Jev is fairly sure the request rules the ingredient out: a stray 20%
      // shouldn't sink every garlic dish. Full strength from 70%.
      const p = r.avoid[k] ?? 0;
      const w = Math.min(1, Math.max(0, (p - 0.3) / 0.4));
      if (dish.has[k] && w > 0) factors.push({ key: `avoid_${k}`, label: `No ${k}`, value: 1 - w * 0.97, note: `contains ${k}` });
    }
    const score = Math.pow(fit, 0.85) * factors.slice(1).reduce((m, f) => m * f.value, 1);
    return { dish, index, score, fit, factors };
  });
  return out.sort((a, b) => b.score - a.score);
}

/** The "understood" chips: only what Jev is confident the request asked for. */
export function understood(r: MatchResult) {
  const chips: { label: string; p: number }[] = [];
  for (const k of Object.keys(INTENT) as IntentKey[]) {
    const a = r.intent[k];
    if (a && a.choice !== "Any" && (a.probs[a.choice] ?? 0) >= 0.8) chips.push({ label: a.choice === "Wants meat or fish" ? "Meat or fish" : a.choice, p: a.probs[a.choice] });
  }
  for (const k of Object.keys(AVOID) as AvoidKey[]) if ((r.avoid[k] ?? 0) >= 0.6) chips.push({ label: `No ${k}`, p: r.avoid[k] });
  return chips;
}
