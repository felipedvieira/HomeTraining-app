/**
 * Emoji que identifica visualmente o tipo de ficha, a partir do label salvo em
 * workout_plan_days.label (ver DAY_LABELS em generate.ts). Usado na tela de treino
 * e no calendário do hub.
 */
export function emojiForWorkoutLabel(label: string): string {
  const lower = label.toLowerCase();

  if (lower.includes("cardio")) return "🏃";
  if (lower.includes("corpo inteiro")) return "🧍";
  if (lower.includes("perna")) return "🦵";
  if (lower.includes("inferior")) return "🦵";
  if (lower.includes("superior")) return "💪";
  if (lower.includes("push") || lower.includes("empurrar")) return "💪";
  if (lower.includes("pull") || lower.includes("puxar")) return "💪";

  return "🏋️";
}

/** Emoji fixo pra quando a pessoa pula a ficha do dia e faz só cardio no lugar. */
export const CARDIO_ONLY_EMOJI = "🚶";
