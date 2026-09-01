"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

function formatDuration(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function SessionTimer({
  onElapsedChange,
}: {
  onElapsedChange?: (elapsedSeconds: number) => void;
}) {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  useEffect(() => {
    onElapsedChange?.(elapsed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsed]);

  return (
    <div className="flex items-center justify-between bg-surface-2 border border-border rounded-xl px-4 py-3">
      <div>
        <p className="text-xs text-muted uppercase tracking-wide">Tempo de treino</p>
        <p className="text-2xl font-mono font-bold tabular-nums">{formatDuration(elapsed)}</p>
      </div>
      <div className="flex gap-2">
        {!running ? (
          <Button variant="primary" onClick={() => setRunning(true)}>
            {elapsed === 0 ? "Iniciar" : "Retomar"}
          </Button>
        ) : (
          <Button variant="secondary" onClick={() => setRunning(false)}>
            Pausar
          </Button>
        )}
      </div>
    </div>
  );
}
