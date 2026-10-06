import { askJev, costUsd } from "@/lib/jev";
import { AVOID, INTENT, matchQuestions, matchState, type AvoidKey, type IntentKey } from "@/lib/intent";
import { DISHES } from "@/lib/dishes";
import type { MatchResult } from "@/lib/rank";

// Same query, same answers: keep recent results so retyping or going back is instant.
const cache = new Map<string, MatchResult>();

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const query = typeof body.query === "string" ? body.query.slice(0, 200).trim() : "";
  const hour = Number.isFinite(body.hour) ? Math.max(0, Math.min(23, Math.round(body.hour))) : 19;
  const withRequest = body.debug === true;
  if (!query) return Response.json({ error: "query is required" }, { status: 400 });

  const key = `${query.toLowerCase()}|${hour}`;
  const hit = cache.get(key);
  if (hit && !withRequest) return Response.json({ ...hit, latencyMs: 0, cached: true });

  try {
    const res = await askJev(matchState(query, hour), matchQuestions());
    const a = res.answers;
    const intent = Object.fromEntries(
      (Object.keys(INTENT) as IntentKey[]).map((k) => {
        const ans = a[k];
        return [k, ans?.type === "choice" ? { choice: ans.choice, probs: ans.probabilities, confidence: ans.confidence } : { choice: "Any", probs: { Any: 1 }, confidence: 0 }];
      }),
    ) as MatchResult["intent"];
    const avoid = Object.fromEntries(
      (Object.keys(AVOID) as AvoidKey[]).map((k) => {
        const ans = a[`avoid_${k}`];
        return [k, ans?.type === "noul" ? ans.noul : 0];
      }),
    ) as MatchResult["avoid"];
    const fit = DISHES.map((_, i) => {
      const ans = a[`dish_${i}`];
      return ans?.type === "noul" ? ans.noul : 0;
    });
    const result: MatchResult = {
      query,
      intent,
      avoid,
      fit,
      questions: Object.keys(res.request.questions).length,
      latencyMs: res.latencyMs,
      inputTokens: res.usage.input_tokens,
      costUsd: costUsd(res.usage.input_tokens),
      source: "jev",
    };
    cache.set(key, result);
    if (cache.size > 300) cache.delete(cache.keys().next().value!);
    return Response.json(withRequest ? { ...result, request: res.request } : result);
  } catch (err) {
    return Response.json({ error: err instanceof Error ? err.message : String(err) }, { status: 502 });
  }
}
