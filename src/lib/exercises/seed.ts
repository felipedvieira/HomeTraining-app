import type { ExerciseDef } from "@/lib/workout-engine/types";

/**
 * Conjunto inicial de exercícios para o motor de geração de treino funcionar
 * de ponta a ponta sem depender de uma fonte externa configurada.
 *
 * Para produção, isso deve ser substituído/complementado pelos ~317 exercícios
 * com vídeo do free-exercise-db-with-videos (MIT) — ver README.md, seção
 * "Biblioteca de exercícios com vídeo".
 */
export const EXERCISE_SEED: ExerciseDef[] = [
  // Peso do corpo — sempre disponível
  { id: "pushup", name: "Flexão de braço", equipmentId: null, primaryMuscle: "chest", category: "strength", isCompound: true },
  { id: "bodyweight-squat", name: "Agachamento livre", equipmentId: null, primaryMuscle: "quads", category: "strength", isCompound: true },
  { id: "lunge", name: "Afundo (avanço)", equipmentId: null, primaryMuscle: "quads", category: "strength", isCompound: true },
  { id: "glute-bridge", name: "Elevação de quadril", equipmentId: null, primaryMuscle: "glutes", category: "strength", isCompound: true },
  { id: "plank", name: "Prancha", equipmentId: null, primaryMuscle: "core", category: "strength", isCompound: false },
  { id: "superman", name: "Superman", equipmentId: null, primaryMuscle: "back", category: "strength", isCompound: false },
  { id: "pike-pushup", name: "Flexão pike (ombros)", equipmentId: null, primaryMuscle: "shoulders", category: "strength", isCompound: true },
  { id: "calf-raise-bodyweight", name: "Elevação de panturrilha", equipmentId: null, primaryMuscle: "calves", category: "strength", isCompound: false },
  { id: "burpee", name: "Burpee", equipmentId: null, primaryMuscle: "cardio", category: "cardio", isCompound: true },
  { id: "mountain-climber", name: "Mountain climber", equipmentId: null, primaryMuscle: "cardio", category: "cardio", isCompound: true },
  { id: "jumping-jacks", name: "Polichinelo", equipmentId: null, primaryMuscle: "cardio", category: "cardio", isCompound: true },

  // Halteres
  { id: "dumbbell-floor-press", name: "Supino com halteres no chão", equipmentId: "dumbbells", primaryMuscle: "chest", category: "strength", isCompound: true },
  { id: "dumbbell-row", name: "Remada unilateral com halter", equipmentId: "dumbbells", primaryMuscle: "back", category: "strength", isCompound: true },
  { id: "dumbbell-shoulder-press", name: "Desenvolvimento com halteres", equipmentId: "dumbbells", primaryMuscle: "shoulders", category: "strength", isCompound: true },
  { id: "dumbbell-bicep-curl", name: "Rosca direta com halteres", equipmentId: "dumbbells", primaryMuscle: "biceps", category: "strength", isCompound: false },
  { id: "dumbbell-tricep-kickback", name: "Tríceps coice com halter", equipmentId: "dumbbells", primaryMuscle: "triceps", category: "strength", isCompound: false },
  { id: "goblet-squat", name: "Agachamento goblet", equipmentId: "dumbbells", primaryMuscle: "quads", category: "strength", isCompound: true },
  { id: "dumbbell-rdl", name: "Levantamento terra romeno com halteres", equipmentId: "dumbbells", primaryMuscle: "hamstrings", category: "strength", isCompound: true },
  { id: "dumbbell-lateral-raise", name: "Elevação lateral com halteres", equipmentId: "dumbbells", primaryMuscle: "shoulders", category: "strength", isCompound: false },
  { id: "dumbbell-calf-raise", name: "Panturrilha em pé com halteres", equipmentId: "dumbbells", primaryMuscle: "calves", category: "strength", isCompound: false },

  // Barra e anilhas
  { id: "barbell-back-squat", name: "Agachamento livre com barra", equipmentId: "barbell", primaryMuscle: "quads", category: "strength", isCompound: true },
  { id: "barbell-deadlift", name: "Levantamento terra", equipmentId: "barbell", primaryMuscle: "hamstrings", category: "strength", isCompound: true },
  { id: "barbell-bench-press", name: "Supino reto com barra", equipmentId: "barbell", primaryMuscle: "chest", category: "strength", isCompound: true },
  { id: "barbell-row", name: "Remada curvada com barra", equipmentId: "barbell", primaryMuscle: "back", category: "strength", isCompound: true },
  { id: "barbell-overhead-press", name: "Desenvolvimento militar com barra", equipmentId: "barbell", primaryMuscle: "shoulders", category: "strength", isCompound: true },
  { id: "barbell-bicep-curl", name: "Rosca direta com barra", equipmentId: "barbell", primaryMuscle: "biceps", category: "strength", isCompound: false },

  // Banco
  { id: "bench-dip", name: "Mergulho no banco (tríceps)", equipmentId: "bench", primaryMuscle: "triceps", category: "strength", isCompound: true },
  { id: "step-up", name: "Subida no banco (step-up)", equipmentId: "bench", primaryMuscle: "quads", category: "strength", isCompound: true },

  // Kettlebell
  { id: "kettlebell-swing", name: "Kettlebell swing", equipmentId: "kettlebell", primaryMuscle: "cardio", category: "cardio", isCompound: true },
  { id: "kettlebell-goblet-squat", name: "Agachamento goblet com kettlebell", equipmentId: "kettlebell", primaryMuscle: "quads", category: "strength", isCompound: true },

  // Barra fixa
  { id: "pull-up", name: "Barra fixa (pull-up)", equipmentId: "pull_up_bar", primaryMuscle: "back", category: "strength", isCompound: true },
  { id: "chin-up", name: "Barra fixa supinada (chin-up)", equipmentId: "pull_up_bar", primaryMuscle: "biceps", category: "strength", isCompound: true },
  { id: "hanging-leg-raise", name: "Elevação de pernas na barra", equipmentId: "pull_up_bar", primaryMuscle: "core", category: "strength", isCompound: false },

  // Elástico
  { id: "band-row", name: "Remada com elástico", equipmentId: "resistance_band", primaryMuscle: "back", category: "strength", isCompound: true },
  { id: "band-pull-apart", name: "Pull-apart com elástico", equipmentId: "resistance_band", primaryMuscle: "shoulders", category: "strength", isCompound: false },
  { id: "band-squat", name: "Agachamento com elástico", equipmentId: "resistance_band", primaryMuscle: "quads", category: "strength", isCompound: true },

  // TRX
  { id: "trx-row", name: "Remada no TRX", equipmentId: "trx", primaryMuscle: "back", category: "strength", isCompound: true },
  { id: "trx-chest-press", name: "Supino no TRX", equipmentId: "trx", primaryMuscle: "chest", category: "strength", isCompound: true },

  // Cardio dedicado
  { id: "treadmill-run", name: "Corrida na esteira", equipmentId: "treadmill", primaryMuscle: "cardio", category: "cardio", isCompound: true },
  { id: "bike-ride", name: "Bicicleta ergométrica", equipmentId: "bike", primaryMuscle: "cardio", category: "cardio", isCompound: true },
  { id: "rowing-cardio", name: "Remo (rowing machine)", equipmentId: "rowing_machine", primaryMuscle: "cardio", category: "cardio", isCompound: true },
  { id: "jump-rope-cardio", name: "Corda de pular", equipmentId: "jump_rope", primaryMuscle: "cardio", category: "cardio", isCompound: true },

  // Máquinas de academia
  { id: "leg-press-machine", name: "Leg press", equipmentId: "leg_press", primaryMuscle: "quads", category: "strength", isCompound: true },
  { id: "leg-extension-machine", name: "Cadeira extensora", equipmentId: "leg_extension", primaryMuscle: "quads", category: "strength", isCompound: false },
  { id: "lying-leg-curl-machine", name: "Mesa flexora", equipmentId: "leg_curl", primaryMuscle: "hamstrings", category: "strength", isCompound: false },
  { id: "hack-squat-machine", name: "Hack squat", equipmentId: "hack_squat", primaryMuscle: "quads", category: "strength", isCompound: true },
  { id: "smith-machine-squat", name: "Agachamento no Smith", equipmentId: "smith_machine", primaryMuscle: "quads", category: "strength", isCompound: true },
  { id: "calf-raise-machine-ex", name: "Panturrilha na máquina", equipmentId: "calf_raise_machine", primaryMuscle: "calves", category: "strength", isCompound: false },
  { id: "lat-pulldown-machine", name: "Puxador (lat pulldown)", equipmentId: "lat_pulldown", primaryMuscle: "back", category: "strength", isCompound: true },
  { id: "seated-cable-row-machine", name: "Remada baixa no cabo", equipmentId: "seated_row", primaryMuscle: "back", category: "strength", isCompound: true },
  { id: "pec-deck-fly-machine", name: "Voador (peck deck)", equipmentId: "chest_fly_machine", primaryMuscle: "chest", category: "strength", isCompound: false },
  { id: "cable-crossover-fly", name: "Cross over", equipmentId: "cable_crossover", primaryMuscle: "chest", category: "strength", isCompound: false },
  { id: "cable-tricep-pushdown", name: "Tríceps na polia", equipmentId: "cable_tricep", primaryMuscle: "triceps", category: "strength", isCompound: false },
  { id: "preacher-curl-machine", name: "Rosca Scott", equipmentId: "preacher_bench", primaryMuscle: "biceps", category: "strength", isCompound: false },
  { id: "machine-shoulder-press", name: "Desenvolvimento na máquina", equipmentId: "shoulder_press_machine", primaryMuscle: "shoulders", category: "strength", isCompound: true },
  { id: "machine-chest-press", name: "Supino na máquina", equipmentId: "chest_press_machine", primaryMuscle: "chest", category: "strength", isCompound: true },
];
