/**
 * Fonte de mídia de demonstração por exercício.
 *
 * Não existe hoje uma base de VÍDEO real, gratuita e confiável (a que estava planejada,
 * free-exercise-db-with-videos, saiu do ar). Em vez disso, usamos duas fotos por exercício
 * (posição inicial/final) do yuhonas/free-exercise-db — domínio público (Unlicense), hospedado
 * no GitHub. Exibimos as duas imagens alternando para simular o movimento.
 *
 * Isso é preenchido sob demanda: na primeira vez que qualquer usuário abrir "Ver vídeo" de um
 * exercício sem mídia salva, buscamos aqui e gravamos permanentemente na tabela `exercises`
 * (ver ensureExerciseDemoMedia em actions.ts). Chamadas seguintes não passam mais por aqui.
 */

const RAW_BASE = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises";

// Mapeia nosso id interno (src/lib/exercises/seed.ts) para o id do exercício equivalente
// no free-exercise-db. Exercícios sem correspondência razoável ficam de fora — o usuário
// simplesmente vê "vídeo ainda não cadastrado" até uma fonte melhor existir.
const SOURCE_ID_BY_EXERCISE_ID: Record<string, string> = {
  pushup: "Pushups",
  "bodyweight-squat": "Bodyweight_Squat",
  lunge: "Bodyweight_Walking_Lunge",
  "glute-bridge": "Single_Leg_Glute_Bridge",
  plank: "Plank",
  superman: "Superman",
  "calf-raise-bodyweight": "Standing_Calf_Raises",
  "mountain-climber": "Mountain_Climbers",
  "dumbbell-floor-press": "Dumbbell_Floor_Press",
  "dumbbell-row": "One-Arm_Dumbbell_Row",
  "dumbbell-shoulder-press": "Dumbbell_Shoulder_Press",
  "dumbbell-bicep-curl": "Seated_Dumbbell_Curl",
  "dumbbell-tricep-kickback": "Tricep_Dumbbell_Kickback",
  "goblet-squat": "Goblet_Squat",
  "dumbbell-rdl": "Stiff-Legged_Dumbbell_Deadlift",
  "dumbbell-lateral-raise": "Side_Lateral_Raise",
  "dumbbell-calf-raise": "Standing_Dumbbell_Calf_Raise",
  "barbell-back-squat": "Barbell_Squat",
  "barbell-deadlift": "Barbell_Deadlift",
  "barbell-bench-press": "Barbell_Bench_Press_-_Medium_Grip",
  "barbell-row": "Bent_Over_Barbell_Row",
  "barbell-overhead-press": "Standing_Military_Press",
  "barbell-bicep-curl": "Barbell_Curl",
  "bench-dip": "Bench_Dips",
  "step-up": "Step-up_with_Knee_Raise",
  "kettlebell-swing": "One-Arm_Kettlebell_Swings",
  "kettlebell-goblet-squat": "Goblet_Squat",
  "pull-up": "Pullups",
  "chin-up": "Chin-Up",
  "hanging-leg-raise": "Hanging_Leg_Raise",
  "band-pull-apart": "Band_Pull_Apart",
  "treadmill-run": "Running_Treadmill",
  "bike-ride": "Bicycling_Stationary",
  "rowing-cardio": "Rowing_Stationary",
  "jump-rope-cardio": "Rope_Jumping",
};

export function findDemoMedia(exerciseId: string): { primary: string; secondary: string } | null {
  const sourceId = SOURCE_ID_BY_EXERCISE_ID[exerciseId];
  if (!sourceId) return null;
  return {
    primary: `${RAW_BASE}/${sourceId}/0.jpg`,
    secondary: `${RAW_BASE}/${sourceId}/1.jpg`,
  };
}
