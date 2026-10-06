import { DISHES, type Dish } from "./dishes";

/**
 * What Jev is asked about the request itself. Each is a typed question with fixed options, so the
 * app can turn the answers straight into rules without parsing any text.
 */
export const INTENT = {
  diet: {
    label: "Diet",
    instructions: "What diet does the request call for?",
    criteria: {
      Any: "No dietary requirement mentioned",
      Vegetarian: "No meat, fish or egg",
      Vegan: "No animal products at all, including milk, yogurt, ghee, paneer and egg",
      Eggetarian: "Vegetarian, but eggs are fine",
      "Wants meat or fish": "Explicitly asks for chicken, mutton, lamb, fish, seafood, pork or meat",
    },
  },
  spice: {
    label: "Spice",
    instructions: "How spicy should the dish be?",
    criteria: { Any: "No preference mentioned", Mild: "Not spicy, gentle, kid-friendly", Medium: "Some heat", Spicy: "Hot, fiery, lots of chilli" },
  },
  course: {
    label: "Meal",
    instructions: "What kind of dish or meal is the user looking for?",
    criteria: { Any: "Not specified", Breakfast: "Breakfast or brunch", "Main meal": "Lunch or dinner, a main course", Snack: "Snack, starter, street food or tea-time bite", Dessert: "Something sweet, a dessert", Drink: "A drink or beverage" },
  },
  feel: {
    label: "Weight",
    instructions: "How light or filling should it be?",
    criteria: { Any: "Not specified", Light: "Light, healthy, easy on the stomach, not heavy or fried", Hearty: "Rich, indulgent, filling, comforting" },
  },
  time: {
    label: "Time",
    instructions: "How much time does the user want to spend cooking?",
    criteria: { Any: "Not specified", Quick: "Quick, 30 minutes or less, weeknight, in a hurry", Leisurely: "Happy to spend time, weekend project, slow-cooked" },
  },
  region: {
    label: "Region",
    instructions: "Does the request ask for food from a particular part of India?",
    criteria: { Any: "No region mentioned", North: "North Indian, Punjabi, Kashmiri, Delhi", South: "South Indian, Kerala, Tamil, Karnataka, Hyderabadi", East: "Bengali, Odia, Bihari", West: "Gujarati, Maharashtrian, Goan, Mumbai", Northeast: "Northeast, Himalayan, Sikkim, Tibetan" },
  },
} as const;

export const AVOID = {
  onion: "Does the user want to avoid onion (for example 'without onions', 'no onion', Jain food)?",
  garlic: "Does the user want to avoid garlic (for example 'no garlic', Jain or satvik food)?",
  dairy: "Does the user want to avoid dairy (milk, cream, paneer, yogurt, ghee), e.g. lactose-free or vegan?",
  gluten: "Does the user want to avoid gluten or wheat?",
  nuts: "Does the user want to avoid nuts or peanuts (allergy)?",
} as const;

export type IntentKey = keyof typeof INTENT;
export type AvoidKey = keyof typeof AVOID;

export function dishSummary(d: Dish) {
  const yes = (k: keyof Dish["has"]) => (d.has[k] ? "yes" : "no");
  return [
    `${d.name}${d.local ? ` (${d.local})` : ""}: ${d.blurb}`,
    `Region ${d.region} (${d.state}); course ${d.course}; diet ${d.diet}; spice ${d.spice}/5; ${d.minutes} min; ${d.feel.toLowerCase()}.`,
    `Contains onion ${yes("onion")}, garlic ${yes("garlic")}, dairy ${yes("dairy")}, gluten ${yes("gluten")}, nuts ${yes("nuts")}.`,
    `Tags: ${d.tags.join(", ")}.`,
  ].join(" ");
}

type Question =
  | { type: "choice"; instructions: unknown; criteria: Record<string, string> }
  | { type: "noul"; instructions: unknown };

/** One request: 6 intent choices, 5 avoid yes/nos and one yes/no per dish. */
export function matchQuestions(dishes: Dish[] = DISHES): Record<string, Question> {
  const q: Record<string, Question> = {};
  for (const [k, v] of Object.entries(INTENT)) q[k] = { type: "choice", instructions: v.instructions, criteria: { ...v.criteria } };
  for (const [k, v] of Object.entries(AVOID)) q[`avoid_${k}`] = { type: "noul", instructions: v };
  dishes.forEach((d, i) => {
    q[`dish_${i}`] = {
      type: "noul",
      instructions: {
        dish: dishSummary(d),
        question: "Would `dish` be a good answer to what the user is asking for? Respect every constraint in the request (diet, ingredients to avoid, spice, meal, time).",
      },
    };
  });
  return q;
}

export const matchState = (query: string, hour: number) => ({
  request: query,
  context: { local_time: `${String(hour).padStart(2, "0")}:00`, cuisine: "Indian home cooking" },
});
