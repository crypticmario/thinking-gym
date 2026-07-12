import type { DrillType, Entry, Phase } from "./types";

export const PHASE_INFO: Record<Phase | 0, { name: string; range: string; goal: string }> = {
  1: { name: "Argument Anatomy", range: "Days 1-7", goal: "See the skeleton of any argument in under a minute." },
  2: { name: "The Model Library", range: "Days 8-14", goal: "Stop starting from zero — reach for a model instead of a blank page." },
  3: { name: "The Counter-Argument Reflex", range: "Days 15-28", goal: "Train the reflex to generate a counter-argument on the spot." },
  4: { name: "Synthesis and Original Angles", range: "Days 29-42", goal: "Train the \"huh, I hadn't connected those\" move." },
  5: { name: "Writing Like a Thought Leader", range: "Days 43-56", goal: "Package the thinking into something worth reading." },
  0: { name: "Maintenance", range: "Day 57+", goal: "Keep the reflex running: 3-in-3 and weekly devil's-advocate, indefinitely." },
};

export const DRILL_INFO: Record<DrillType, { label: string; phase: Phase | 0; instructions: string; timerSeconds?: number }> = {
  "argument-anatomy": {
    label: "Argument Anatomy",
    phase: 1,
    instructions:
      "Take one opinion piece, thread, or post. Write four lines: Claim, Main reason given, Evidence used, Hidden assumption. Don't judge the argument yet — just diagram it.",
  },
  "model-apply": {
    label: "Model Library — Apply",
    phase: 2,
    instructions:
      "You're given a mental model. Find a real item and apply the model to it in 3-4 sentences.",
  },
  "model-identify": {
    label: "Model Library — Identify",
    phase: 2,
    instructions:
      "You're given an item with no model named. Which model(s) explain what's going on here? Name them before revealing suggestions.",
  },
  "3-in-3": {
    label: "3-in-3",
    phase: 3,
    instructions:
      "Take a claim. Write three distinct counter-arguments in three minutes. Not devil's-advocate-for-fun — actually try to win. Speed matters more than polish.",
    timerSeconds: 180,
  },
  steelman: {
    label: "Steelman First",
    phase: 3,
    instructions:
      "Pick a position you disagree with. Before critiquing it, write the strongest possible version of it in 4-5 sentences — the version its smartest defender would give. Only then write your response.",
  },
  "devils-advocate": {
    label: "Devil's Advocate for Yourself",
    phase: 3,
    instructions:
      "Pick something you actually believe. Write the best case against it, 200-300 words, as if you were paid to argue it and needed to win.",
  },
  "unusual-connection": {
    label: "Unusual Connection",
    phase: 4,
    instructions:
      "Take two things you've encountered this week that have nothing obviously to do with each other. Write 3-4 sentences on what they share structurally.",
  },
  "so-what": {
    label: "The \"So What\" Pass",
    phase: 4,
    instructions:
      "Take one earlier exercise this week and ask: so what does this actually mean for how someone should act or think differently?",
  },
  "post-draft": {
    label: "Write the Post",
    phase: 5,
    instructions:
      "Write one post, 150-250 words: Hook (a specific, concrete claim) -> Tension (why the obvious take is wrong/incomplete) -> The actual insight (one sentence) -> One piece of evidence -> So what.",
  },
};

export function dateKey(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function distinctDates(entries: Entry[]): string[] {
  return Array.from(new Set(entries.map((e) => e.date))).sort();
}

/** Day number the user is "on", derived from distinct days with at least one completed drill, not the calendar.
 * If today already has an entry, today *is* the current day; otherwise today is the next, not-yet-started day. */
export function currentDayNumber(entries: Entry[]): number {
  const days = distinctDates(entries);
  const hasToday = days.includes(dateKey());
  return hasToday ? days.length : days.length + 1;
}

export function phaseForDay(day: number): Phase | 0 {
  if (day <= 7) return 1;
  if (day <= 14) return 2;
  if (day <= 28) return 3;
  if (day <= 42) return 4;
  if (day <= 56) return 5;
  return 0;
}

export function currentStreak(entries: Entry[]): number {
  const days = new Set(distinctDates(entries));
  if (days.size === 0) return 0;
  let streak = 0;
  const cursor = new Date();
  // if nothing logged today yet, streak counts back from yesterday
  if (!days.has(dateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (days.has(dateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/** Suggested drills for "today", given the day number in the curriculum. */
export function todaysDrills(day: number): DrillType[] {
  const phase = phaseForDay(day);
  const drills: DrillType[] = [];

  switch (phase) {
    case 1:
      drills.push("argument-anatomy");
      break;
    case 2:
      drills.push(day % 2 === 0 ? "model-identify" : "model-apply");
      break;
    case 3:
      drills.push("3-in-3");
      if (day % 2 === 0) drills.push("steelman");
      if (day % 7 === 0) drills.push("devils-advocate");
      break;
    case 4:
      drills.push("unusual-connection");
      if (day % 7 === 3 || day % 7 === 6) drills.push("so-what");
      break;
    case 5:
      if (day % 7 === 2 || day % 7 === 5) {
        drills.push("post-draft");
      } else {
        drills.push("3-in-3");
      }
      break;
    case 0:
    default:
      drills.push(day % 7 === 0 ? "devils-advocate" : "3-in-3");
      break;
  }

  // Mental models training runs continuously alongside the main phase drill,
  // once the dedicated Phase 2 week is over.
  if (phase !== 2) {
    drills.push(day % 2 === 0 ? "model-apply" : "model-identify");
  }

  return drills;
}
