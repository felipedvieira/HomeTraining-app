"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function completeWorkoutDay(planDayId: string, durationSeconds: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  await supabase
    .from("workout_plan_days")
    .update({ completed_at: new Date().toISOString() })
    .eq("id", planDayId)
    .eq("profile_id", user.id);

  await supabase.from("workout_logs").insert({
    plan_day_id: planDayId,
    profile_id: user.id,
    duration_seconds: durationSeconds,
  });

  revalidatePath("/dashboard");
}
