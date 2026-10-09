"use client";

import { useState } from "react";
import Link from "next/link";
import { TUTORIALS, type Tutorial, type WorkedExample } from "@/lib/tutorials";
import { PHASE_INFO } from "@/lib/curriculum";
import { Button, Card } from "@/components/Card";
import { api } from "@/lib/api";

type GeneratedExample = {
  drillType: string;
  example: WorkedExample;
} | null;

export default function LearnPage() {
  const [openId, setOpenId] = useState<string | null>(null);

  const phases = [1, 2, 3, 4, 5] as const;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Learn</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Tutorials for every thinking skill. Read the explanation, study the
          worked example, then hit Practice when you&apos;re ready.
        </p>
      </div>

      {phases.map((phase) => {
        const info = PHASE_INFO[phase];
        const phaseTutorials = TUTORIALS.filter((t) => t.phase === phase);
        if (phaseTutorials.length === 0) return null;

        return (
          <section key={phase}>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">
                Phase {phase}: {info.name}
              </h2>
              <p className="text-xs text-neutral-500">
                {info.range} &middot; {info.goal}
              </p>
            </div>

            <div className="space-y-3">
              {phaseTutorials.map((tutorial) => (
                <TutorialCard
                  key={tutorial.drillType}
                  tutorial={tutorial}
                  isOpen={openId === tutorial.drillType}
                  onToggle={() =>
                    setOpenId(
                      openId === tutorial.drillType
                        ? null
                        : tutorial.drillType
                    )
                  }
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function TutorialCard({
  tutorial,
  isOpen,
  onToggle,
}: {
  tutorial: Tutorial;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const [showExample, setShowExample] = useState(false);
  const [generated, setGenerated] = useState<GeneratedExample>(null);
  const [generating, setGenerating] = useState(false);

  async function generateFreshExample() {
    setGenerating(true);
    try {
      const res = await api.tutorialExample(tutorial.drillType);
      setGenerated({ drillType: tutorial.drillType, example: res.example });
    } catch {
      setGenerated(null);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <Card>
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between text-left"
      >
        <div>
          <h3 className="font-medium">{tutorial.title}</h3>
          <p className="mt-0.5 text-xs text-neutral-400 line-clamp-1">
            {tutorial.what}
          </p>
        </div>
        <span className="ml-4 shrink-0 text-neutral-500 text-lg">
          {isOpen ? "−" : "+"}
        </span>
      </button>

      {isOpen && (
        <div className="mt-4 space-y-5 border-t border-neutral-800 pt-4">
          {/* What & Why */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-emerald-500 mb-1">
              What it is
            </h4>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {tutorial.what}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-emerald-500 mb-1">
              Why it matters
            </h4>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {tutorial.why}
            </p>
          </div>

          {/* Steps */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-blue-400 mb-2">
              How to do it
            </h4>
            <ol className="space-y-1.5">
              {tutorial.steps.map((step, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-sm text-neutral-300 leading-relaxed"
                >
                  <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-blue-900/50 text-[10px] font-bold text-blue-400">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Tips */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-amber-500 mb-2">
              Watch out for
            </h4>
            <ul className="space-y-1">
              {tutorial.tips.map((tip, i) => (
                <li
                  key={i}
                  className="text-sm text-neutral-400 pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[9px] before:h-1.5 before:w-1.5 before:rounded-full before:bg-amber-700"
                >
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Worked Example */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-purple-400">
                Worked example
              </h4>
              {!showExample && (
                <Button
                  variant="ghost"
                  className="text-xs border border-purple-800 text-purple-400"
                  onClick={() => setShowExample(true)}
                >
                  Show example
                </Button>
              )}
            </div>

            {showExample && (
              <ExampleDisplay example={tutorial.workedExample} />
            )}
          </div>

          {/* AI-generated fresh example */}
          {showExample && (
            <div>
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  className="text-xs"
                  onClick={generateFreshExample}
                  disabled={generating}
                >
                  {generating
                    ? "Generating..."
                    : generated
                      ? "Generate another"
                      : "Show me a fresh AI example"}
                </Button>
                {generated === null && !generating && (
                  <span className="text-[10px] text-neutral-600">
                    Requires API key
                  </span>
                )}
              </div>

              {generated && (
                <div className="mt-3">
                  <p className="text-[10px] uppercase tracking-wide text-neutral-500 mb-2">
                    AI-generated example
                  </p>
                  <ExampleDisplay example={generated.example} />
                </div>
              )}
            </div>
          )}

          {/* Practice CTA */}
          <div className="flex items-center gap-3 pt-2 border-t border-neutral-800">
            <Link href={`/drill/${tutorial.drillType}`}>
              <Button>Practice this now</Button>
            </Link>
            <span className="text-xs text-neutral-500">
              Try it yourself with live content
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}

function ExampleDisplay({ example }: { example: WorkedExample }) {
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 overflow-hidden">
      {/* Source */}
      <div className="border-b border-neutral-800 px-4 py-3">
        <p className="text-[10px] uppercase tracking-wide text-neutral-500 mb-1">
          Source material
        </p>
        <p className="text-sm font-medium text-neutral-200">
          {example.source.title}
        </p>
        <p className="mt-1 text-xs text-neutral-400 leading-relaxed">
          {example.source.excerpt}
        </p>
      </div>

      {/* Responses */}
      <div className="divide-y divide-neutral-800">
        {example.responses.map((resp, i) => (
          <div key={i} className="px-4 py-3">
            <p className="text-[10px] uppercase tracking-wide text-emerald-600 mb-1">
              {resp.label}
            </p>
            <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
              {resp.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
