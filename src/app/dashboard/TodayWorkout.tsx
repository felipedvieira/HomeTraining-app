"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SessionTimer } from "@/components/workout/SessionTimer";
import { RestTimer } from "@/components/workout/RestTimer";
import { ExerciseVideoModal } from "@/components/workout/ExerciseVideoModal";
import { completeWorkoutDay } from "./actions";
import { emojiForWorkoutLabel } from "@/lib/workout-engine/emoji";

const MUSCLE_LABELS: Record<string, string> = {
  chest: "Peito",
  back: "Costas",
  shoulders: "Ombros",
  biceps: "Bíceps",
  triceps: "Tríceps",
  quads: "Quadríceps",
  hamstrings: "Posterior de coxa",
  glutes: "Glúteos",
  calves: "Panturrilha",
  core: "Core",
  cardio: "Cardio",
};

interface ExerciseInfo {
  id: string;
  name: string;
  primary_muscle: string;
  category: string;
  video_url: string | null;
  thumbnail_url: string | null;
}

interface PlanExercise {
  id: string;
  order_index: number;
  sets: number;
  reps: string;
  rest_seconds: number;
  exercises: ExerciseInfo;
}

export interface TodayWorkoutDay {
  id: string;
  week_number: number;
  day_number: number;
  label: string;
  workout_plan_exercises: PlanExercise[];
}

export function TodayWorkout({ day }: { day: TodayWorkoutDay }) {
  const router = useRouter();
  const [elapsed, setElapsed] = useState(0);
  const [rest, setRest] = useState<{ seconds: number; token: number } | null>(null);
  const [videoExercise, setVideoExercise] = useState<ExerciseInfo | null>(null);
  const [finishing, setFinishing] = useState(false);

  const exercises = [...day.workout_plan_exercises].sort((a, b) => a.order_index - b.order_index);

  async function handleFinish() {
    setFinishing(true);
    await completeWorkoutDay(day.id, elapsed);
    router.push("/dashboard");
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-muted uppercase tracking-wide">
          Semana {day.week_number} · Dia {day.day_number}
        </p>
        <h2 className="text-xl font-bold text-primary">
          {emojiForWorkoutLabel(day.label)} {day.label}
        </h2>
      </div>

      <SessionTimer onElapsedChange={setElapsed} />

      <div className="space-y-3">
        {exercises.map((pe) => (
          <Card key={pe.id} className="flex items-center gap-3">
            <div className="flex-1">
              <p className="font-semibold">{pe.exercises.name}</p>
              <p className="text-sm text-muted">
                {MUSCLE_LABELS[pe.exercises.primary_muscle] ?? pe.exercises.primary_muscle} ·{" "}
                {pe.sets}x {pe.reps}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="ghost" onClick={() => setVideoExercise(pe.exercises)}>
                Ver vídeo
              </Button>
              <Button
                variant="secondary"
                onClick={() => setRest({ seconds: pe.rest_seconds, token: Date.now() })}
              >
                Descansar {pe.rest_seconds}s
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Button className="w-full" onClick={handleFinish} disabled={finishing}>
        {finishing ? "Salvando..." : "Concluir treino"}
      </Button>

      {rest && <RestTimer key={rest.token} seconds={rest.seconds} onDone={() => setRest(null)} />}

      {videoExercise && (
        <ExerciseVideoModal
          exerciseId={videoExercise.id}
          name={videoExercise.name}
          onClose={() => setVideoExercise(null)}
        />
      )}
    </div>
  );
}
