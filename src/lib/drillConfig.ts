import type { DrillType } from "./types";

export interface FieldConfig {
  key: string;
  label: string;
  placeholder?: string;
  rows?: number;
}

export interface DrillConfig {
  needsSource?: boolean;
  needsModel?: "apply" | "identify";
  timerSeconds?: number;
  needsEntryPicker?: boolean;
  wordTarget?: [number, number];
  fields: FieldConfig[];
}

export const DRILL_CONFIG: Record<DrillType, DrillConfig> = {
  "argument-anatomy": {
    needsSource: true,
    fields: [
      { key: "claim", label: "Claim", rows: 2 },
      { key: "reason", label: "Main reason given", rows: 2 },
      { key: "evidence", label: "Evidence used", rows: 2 },
      { key: "assumption", label: "Hidden assumption", rows: 2 },
    ],
  },
  "model-apply": {
    needsSource: true,
    needsModel: "apply",
    fields: [{ key: "application", label: "Apply the model above to this item (3-4 sentences)", rows: 4 }],
  },
  "model-identify": {
    needsSource: true,
    needsModel: "identify",
    fields: [
      { key: "guess", label: "Which model(s) explain what's going on here? Guess before revealing.", rows: 2 },
      { key: "reflection", label: "After revealing — how close was your guess? Anything you'd add?", rows: 2 },
    ],
  },
  "3-in-3": {
    needsSource: true,
    timerSeconds: 180,
    fields: [
      { key: "claim", label: "The claim (fetch a source above, or type your own)", rows: 2 },
      { key: "counter1", label: "Counter-argument 1", rows: 2 },
      { key: "counter2", label: "Counter-argument 2", rows: 2 },
      { key: "counter3", label: "Counter-argument 3", rows: 2 },
    ],
  },
  steelman: {
    needsSource: true,
    fields: [
      { key: "steelman", label: "The strongest version of this position (4-5 sentences)", rows: 4 },
      { key: "response", label: "Your response, now that you've steelmanned it", rows: 4 },
    ],
  },
  "devils-advocate": {
    wordTarget: [200, 300],
    fields: [
      { key: "belief", label: "Something you actually believe", rows: 2 },
      { key: "argument", label: "The best case against it (200-300 words, argue to win)", rows: 8 },
    ],
  },
  "unusual-connection": {
    fields: [
      { key: "thingA", label: "Thing A (from this week)", rows: 2 },
      { key: "thingB", label: "Thing B (unrelated, also from this week)", rows: 2 },
      { key: "connection", label: "What they share structurally (3-4 sentences)", rows: 3 },
    ],
  },
  "so-what": {
    needsEntryPicker: true,
    fields: [{ key: "soWhat", label: "So what does this actually mean for how someone should act or think differently?", rows: 3 }],
  },
  "post-draft": {
    wordTarget: [150, 250],
    fields: [
      { key: "hook", label: "Hook — a specific, concrete claim", rows: 2 },
      { key: "tension", label: "Tension — why the obvious take is wrong or incomplete", rows: 2 },
      { key: "insight", label: "The actual insight (one sentence)", rows: 2 },
      { key: "evidence", label: "One piece of evidence or example", rows: 2 },
      { key: "soWhat", label: "So what — what changes if this is true", rows: 2 },
    ],
  },
};
