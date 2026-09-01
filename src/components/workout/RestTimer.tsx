"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

function playBeep() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.frequency.value = 880;
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.4);
  } catch {
    // Web Audio indisponível — sem som, sem quebrar o cronômetro.
  }
}

export function RestTimer({ seconds, onDone }: { seconds: number; onDone: () => void }) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(true);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!running) return;
    if (remaining <= 0) {
      if (!doneRef.current) {
        doneRef.current = true;
        playBeep();
        onDone();
      }
      return;
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining, running, onDone]);

  const progress = Math.max(0, remaining / seconds);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 flex justify-center">
      <div className="w-full max-w-sm bg-surface border border-primary/50 rounded-2xl p-5 shadow-xl">
        <p className="text-xs text-muted uppercase tracking-wide text-center mb-1">Descanso</p>
        <p className="text-4xl font-mono font-bold text-center tabular-nums text-primary">
          {remaining}s
        </p>
        <div className="h-1.5 bg-surface-2 rounded-full mt-3 overflow-hidden">
          <div
            className="h-full bg-primary transition-[width] duration-1000 ease-linear"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="secondary" className="flex-1" onClick={() => setRunning((r) => !r)}>
            {running ? "Pausar" : "Retomar"}
          </Button>
          <Button
            variant="ghost"
            className="flex-1"
            onClick={() => {
              doneRef.current = true;
              onDone();
            }}
          >
            Pular
          </Button>
        </div>
      </div>
    </div>
  );
}
