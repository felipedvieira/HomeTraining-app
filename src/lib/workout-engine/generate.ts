import type {
  ExerciseDef,
  GeneratedPlan,
  MuscleGroup,
  PlannedDay,
  PlannedExercise,
  UserPreferences,
} from "./types";

const SPLIT_TEMPLATES: Record<string, MuscleGroup[][]> = {
  full_body: [
    ["quads", "chest", "back", "core"],
    ["hamstrings", "shoulders", "back", "core"],
    ["glutes", "chest", "biceps", "triceps"],
  ],
  upper_lower: [
    ["chest", "back", "shoulders", "triceps", "biceps"],
    ["quads", "hamstrings", "glutes", "calves"],
  ],
  push_pull_legs: [
    ["chest", "shoulders", "triceps"],
    ["back", "biceps"],
    ["quads", "hamstrings", "glutes", "calves"],
  ],
};

const DAY_LABELS: Record<string, string[]> = {
  full_body: ["Ficha de Corpo Inteiro A", "Ficha de Corpo Inteiro B", "Ficha de Corpo Inteiro C"],
  upper_lower: ["Ficha de Superiores", "Ficha de Inferiores"],
  push_pull_legs: ["Ficha de Push (Empurrar)", "Ficha de Pull (Puxar)", "Ficha de Pernas"],
};

const FREE_WEIGHT_EQUIPMENT = new Set(["dumbbells", "barbell", "kettlebell", null]);

// Exercícios de cardio com impacto articular alto (saltos). Usado só para dar preferência
// a opções mais leves quando o IMC do usuário sugere isso — não é uma restrição.
const HIGH_IMPACT_CARDIO = new Set(["burpee", "jumping-jacks", "jump-rope-cardio", "mountain-climber"]);

function pickSplitType(daysPerWeek: number): string {
  if (daysPerWeek <= 3) return "full_body";
  if (daysPerWeek === 4) return "upper_lower";
  return "push_pull_legs";
}

function weeksFromDuration(durationDays: number): number {
  return Math.max(1, Math.round(durationDays / 7));
}

function prefersLowImpact(currentWeightKg: number, heightCm: number): boolean {
  const heightM = heightCm / 100;
  const bmi = currentWeightKg / (heightM * heightM);
  return bmi >= 30;
}

function availableExercises(pool: ExerciseDef[], equipmentIds: string[]): ExerciseDef[] {
  const equipped = new Set(equipmentIds);
  return pool.filter((e) => e.equipmentId === null || equipped.has(e.equipmentId));
}

function pickForMuscle(
  pool: ExerciseDef[],
  muscle: MuscleGroup,
  prefersFreeWeights: boolean,
  used: Set<string>
): ExerciseDef | null {
  const candidates = pool.filter((e) => e.primaryMuscle === muscle && e.category === "strength");
  if (candidates.length === 0) return null;

  const score = (e: ExerciseDef) => {
    let s = 0;
    if (!used.has(e.id)) s += 10; // prioriza variedade antes de repetir exercícios
    if (e.isCompound) s += 2;
    if (FREE_WEIGHT_EQUIPMENT.has(e.equipmentId) === prefersFreeWeights) s += 1;
    return s;
  };

  return [...candidates].sort((a, b) => score(b) - score(a))[0];
}

function pickCardio(pool: ExerciseDef[], used: Set<string>, lowImpactPreferred: boolean): ExerciseDef | null {
  const candidates = pool.filter((e) => e.category === "cardio");
  if (candidates.length === 0) return null;

  const score = (e: ExerciseDef) => {
    let s = 0;
    if (!used.has(e.id)) s += 10;
    if (lowImpactPreferred && !HIGH_IMPACT_CARDIO.has(e.id)) s += 5;
    return s;
  };

  return [...candidates].sort((a, b) => score(b) - score(a))[0];
}

function setsForWeek(weekNumber: number): number {
  // Sobrecarga progressiva simples: +1 série a cada 3 semanas, até um teto de 4.
  return Math.min(4, 3 + Math.floor((weekNumber - 1) / 3));
}

function repsAndRestForWeek(weekNumber: number, isCompound: boolean) {
  // Faixas voltadas a emagrecimento (volume moderado-alto), com o descanso encurtando aos poucos.
  const reps = isCompound ? "10-12" : "12-15";
  const restSeconds = Math.max(45, 90 - Math.floor((weekNumber - 1) / 2) * 15);
  return { reps, restSeconds };
}

function buildStrengthDay(
  pool: ExerciseDef[],
  muscles: MuscleGroup[],
  weekNumber: number,
  prefersFreeWeights: boolean,
  used: Set<string>
): PlannedExercise[] {
  const exercises: PlannedExercise[] = [];
  for (const muscle of muscles) {
    const exercise = pickForMuscle(pool, muscle, prefersFreeWeights, used);
    if (!exercise) continue;
    used.add(exercise.id);
    const { reps, restSeconds } = repsAndRestForWeek(weekNumber, exercise.isCompound);
    exercises.push({
      exerciseId: exercise.id,
      sets: setsForWeek(weekNumber),
      reps,
      restSeconds,
    });
  }
  return exercises;
}

function buildCardioFinisher(
  pool: ExerciseDef[],
  cardioPreference: UserPreferences["cardioPreference"],
  used: Set<string>,
  lowImpactPreferred: boolean
): PlannedExercise[] {
  if (cardioPreference === "low") return [];
  const cardio = pickCardio(pool, used, lowImpactPreferred);
  if (!cardio) return [];
  used.add(cardio.id);
  return [{ exerciseId: cardio.id, sets: cardioPreference === "high" ? 4 : 3, reps: "60s", restSeconds: 30 }];
}

function buildCardioDay(pool: ExerciseDef[], used: Set<string>, lowImpactPreferred: boolean): PlannedExercise[] {
  const cardioPool = [...pool.filter((e) => e.category === "cardio")].sort((a, b) => {
    const score = (e: ExerciseDef) => (lowImpactPreferred && !HIGH_IMPACT_CARDIO.has(e.id) ? 1 : 0);
    return score(b) - score(a);
  });
  const chosen: ExerciseDef[] = [];
  for (const e of cardioPool) {
    if (chosen.length >= 3) break;
    if (!used.has(e.id)) chosen.push(e);
  }
  while (chosen.length < Math.min(3, cardioPool.length)) {
    const fallback = cardioPool[chosen.length % cardioPool.length];
    if (!chosen.includes(fallback)) chosen.push(fallback);
    else break;
  }
  chosen.forEach((e) => used.add(e.id));
  return chosen.map((e) => ({ exerciseId: e.id, sets: 4, reps: "45s", restSeconds: 30 }));
}

export function generateWorkoutPlan(input: UserPreferences, exercisePool: ExerciseDef[]): GeneratedPlan {
  const splitType = pickSplitType(input.daysPerWeek);
  const template = SPLIT_TEMPLATES[splitType];
  const labels = DAY_LABELS[splitType];
  const pool = availableExercises(exercisePool, input.equipmentIds);
  const used = new Set<string>();
  const weeks = weeksFromDuration(input.durationDays);
  const lowImpactPreferred = prefersLowImpact(input.currentWeightKg, input.heightCm);

  const days: PlannedDay[] = [];
  let dayNumber = 0;

  for (let week = 1; week <= weeks; week++) {
    for (let slot = 0; slot < input.daysPerWeek; slot++) {
      dayNumber++;
      const isDedicatedCardioDay = input.cardioPreference === "high" && slot === input.daysPerWeek - 1;

      if (isDedicatedCardioDay) {
        days.push({
          weekNumber: week,
          dayNumber,
          label: "Ficha de Cardio Intenso",
          exercises: buildCardioDay(pool, used, lowImpactPreferred),
        });
        continue;
      }

      const templateIndex = slot % template.length;
      const strength = buildStrengthDay(pool, template[templateIndex], week, input.prefersFreeWeights, used);
      const finisher = buildCardioFinisher(pool, input.cardioPreference, used, lowImpactPreferred);

      days.push({
        weekNumber: week,
        dayNumber,
        label: labels[templateIndex % labels.length],
        exercises: [...strength, ...finisher],
      });
    }
  }

  return {
    splitType,
    weeks,
    daysPerWeek: input.daysPerWeek,
    days,
  };
}
