"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { MentalModel } from "@/lib/types";
import { Button } from "@/components/Card";

export function ModelPanel({
  mode,
  onModel,
}: {
  mode: "apply" | "identify";
  onModel: (model: MentalModel) => void;
}) {
  const [model, setModel] = useState<MentalModel | null>(null);
  const [revealed, setRevealed] = useState(mode === "apply");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .nextModel()
      .then(({ model }) => {
        setModel(model);
        onModel(model);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <p className="text-sm text-neutral-500">Picking a model…</p>;
  if (!model) return null;

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-3">
      {mode === "apply" || revealed ? (
        <>
          <p className="text-xs uppercase tracking-wide text-emerald-500">{model.discipline}</p>
          <p className="font-medium">{model.name}</p>
          <p className="mt-1 text-sm text-neutral-400">{model.description}</p>
          <p className="mt-2 text-xs text-neutral-500">e.g. {model.exampleUse}</p>
        </>
      ) : (
        <Button variant="secondary" onClick={() => setRevealed(true)}>
          Reveal the model I had in mind
        </Button>
      )}
    </div>
  );
}
