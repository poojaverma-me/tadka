import { DISHES } from "./dishes";
import { AVOID, INTENT, type AvoidKey, type IntentKey } from "./intent";
import type { MatchResult } from "./rank";

/** What the clock suggests when nothing has been typed. */
export function mealForHour(hour: number): { course: string; title: string; hint: string } {
  if (hour >= 5 && hour < 11) return { course: "Breakfast", title: "Breakfast ideas", hint: "something for breakfast" };
  if (hour >= 11 && hour < 16) return { course: "Main meal", title: "For lunch", hint: "a satisfying lunch" };
  if (hour >= 16 && hour < 19) return { course: "Snack", title: "Tea-time bites", hint: "a tea-time snack" };
  if (hour >= 19 && hour < 23) return { course: "Main meal", title: "Tonight's dinner", hint: "dinner tonight" };
  return { course: "Dessert", title: "Late-night cravings", hint: "a late-night treat" };
}

function seeded(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}

const ANY = (): { choice: string; probs: Record<string, number>; confidence: number } => ({ choice: "Any", probs: { Any: 1 }, confidence: 1 });

function blank(query: string, source: MatchResult["source"]): MatchResult {
  return {
    query,
    intent: Object.fromEntries((Object.keys(INTENT) as IntentKey[]).map((k) => [k, ANY()])) as MatchResult["intent"],
    avoid: Object.fromEntries((Object.keys(AVOID) as AvoidKey[]).map((k) => [k, 0])) as MatchResult["avoid"],
    fit: DISHES.map(() => 0.5),
    questions: 0,
    latencyMs: 0,
    inputTokens: 0,
    costUsd: 0,
    source,
  };
}

/** Today's picks: the right course for the hour, shuffled by date so they change daily. */
export function todaysPicks(hour: number, date = new Date()): MatchResult {
  const meal = mealForHour(hour);
  const r = blank("", "offline");
  r.intent.course = { choice: meal.course, probs: { [meal.course]: 1 }, confidence: 1 };
  const rand = seeded(date.getFullYear() * 400 + date.getMonth() * 32 + date.getDate());
  r.fit = DISHES.map(() => 0.55 + rand() * 0.4);
  return r;
}

const WORDS: [RegExp, (r: MatchResult) => void][] = [
  [/\b(veg|vegetarian|no meat)\b/, (r) => (r.intent.diet = { choice: "Vegetarian", probs: { Vegetarian: 1 }, confidence: 1 })],
  [/\bvegan\b/, (r) => (r.intent.diet = { choice: "Vegan", probs: { Vegan: 1 }, confidence: 1 })],
  [/\b(chicken|mutton|lamb|fish|meat|pork|prawn)\b/, (r) => (r.intent.diet = { choice: "Wants meat or fish", probs: { "Wants meat or fish": 1 }, confidence: 1 })],
  [/\b(spicy|hot|fiery)\b/, (r) => (r.intent.spice = { choice: "Spicy", probs: { Spicy: 1 }, confidence: 1 })],
  [/\b(mild|not spicy|kid)/, (r) => (r.intent.spice = { choice: "Mild", probs: { Mild: 1 }, confidence: 1 })],
  [/\bbreakfast\b/, (r) => (r.intent.course = { choice: "Breakfast", probs: { Breakfast: 1 }, confidence: 1 })],
  [/\b(sweet|dessert)\b/, (r) => (r.intent.course = { choice: "Dessert", probs: { Dessert: 1 }, confidence: 1 })],
  [/\b(snack|starter|tea)\b/, (r) => (r.intent.course = { choice: "Snack", probs: { Snack: 1 }, confidence: 1 })],
  [/\b(light|healthy)\b/, (r) => (r.intent.feel = { choice: "Light", probs: { Light: 1 }, confidence: 1 })],
  [/\b(quick|fast|hurry|30 min)/, (r) => (r.intent.time = { choice: "Quick", probs: { Quick: 1 }, confidence: 1 })],
  [/(no|without) onion|jain/, (r) => (r.avoid.onion = 1)],
  [/(no|without) garlic|jain/, (r) => (r.avoid.garlic = 1)],
  [/(no|without) (dairy|milk)|lactose|vegan/, (r) => (r.avoid.dairy = 1)],
  [/gluten/, (r) => (r.avoid.gluten = 1)],
  [/(no|without) nuts|nut allergy|peanut allergy/, (r) => (r.avoid.nuts = 1)],
];

/**
 * Without a connection, a simple keyword match stands in for Jev, so the app still works on
 * a plane. It's clearly labelled in the UI, and it is much blunter than the real thing.
 */
export function offlineMatch(query: string): MatchResult {
  const q = query.toLowerCase();
  const r = blank(query, "offline");
  for (const [re, apply] of WORDS) if (re.test(q)) apply(r);
  const terms = q.split(/[^a-z]+/).filter((t) => t.length > 2);
  r.fit = DISHES.map((d) => {
    const hay = `${d.name} ${d.local ?? ""} ${d.blurb} ${d.tags.join(" ")} ${d.region} ${d.state} ${d.ingredients.join(" ")}`.toLowerCase();
    const hits = terms.filter((t) => hay.includes(t)).length;
    return Math.min(0.95, 0.35 + hits * 0.2);
  });
  return r;
}
