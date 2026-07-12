import type { MentalModel } from "./types";

/** Weighted random pick that favors never-seen and long-unseen models (simple spaced resurfacing). */
export function pickModel(models: MentalModel[]): MentalModel {
  const weighted = models.map((m) => {
    const exposure = m.timesApplied + m.timesIdentified;
    const neverSeen = m.lastSeen === null;
    const daysSinceSeen = neverSeen ? 9999 : (Date.now() - new Date(m.lastSeen as string).getTime()) / 86_400_000;
    const weight = neverSeen ? 100 : 1 / (exposure + 1) + daysSinceSeen * 0.1;
    return { model: m, weight };
  });

  const total = weighted.reduce((sum, w) => sum + w.weight, 0);
  let r = Math.random() * total;
  for (const w of weighted) {
    r -= w.weight;
    if (r <= 0) return w.model;
  }
  return weighted[weighted.length - 1].model;
}
