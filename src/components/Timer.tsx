"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/Card";

export function Timer({ seconds, onDone }: { seconds: number; onDone?: (elapsed: number) => void }) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            onDone?.(seconds);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const mm = Math.floor(remaining / 60);
  const ss = remaining % 60;

  return (
    <div className="flex items-center gap-3">
      <span className={`font-mono text-2xl ${remaining <= 10 && running ? "text-red-400" : "text-neutral-100"}`}>
        {mm}:{ss.toString().padStart(2, "0")}
      </span>
      {!running && remaining > 0 && (
        <Button variant="primary" onClick={() => setRunning(true)}>
          {remaining === seconds ? "Start" : "Resume"}
        </Button>
      )}
      {running && (
        <Button variant="secondary" onClick={() => setRunning(false)}>
          Pause
        </Button>
      )}
      {remaining !== seconds && (
        <Button
          variant="ghost"
          onClick={() => {
            setRunning(false);
            setRemaining(seconds);
          }}
        >
          Reset
        </Button>
      )}
    </div>
  );
}
