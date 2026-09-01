export type CardioPreference = "low" | "moderate" | "high";

export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "quads"
  | "hamstrings"
  | "glutes"
  | "calves"
  | "core"
  | "cardio";

export interface ExerciseDef {
  id: string;
  name: string;
  /** null = bodyweight, sempre disponível */
  equipmentId: string | null;
  primaryMuscle: MuscleGroup;
  category: "strength" | "cardio";
  isCompound: boolean;
}

export interface UserPreferences {
  equipmentIds: string[];
  currentWeightKg: number;
  heightCm: number;
  weightLossTargetKg: number;
  durationDays: number;
  daysPerWeek: number;
  cardioPreference: CardioPreference;
  prefersFreeWeights: boolean;
}

export interface PlannedExercise {
  exerciseId: string;
  sets: number;
  reps: string;
  restSeconds: number;
}

export interface PlannedDay {
  weekNumber: number;
  dayNumber: number;
  label: string;
  exercises: PlannedExercise[];
}

export interface GeneratedPlan {
  splitType: string;
  weeks: number;
  daysPerWeek: number;
  days: PlannedDay[];
}
