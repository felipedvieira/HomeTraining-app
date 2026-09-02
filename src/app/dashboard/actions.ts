"use server";

import { redirect } from "next/navigation";
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
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", planDayId)
    .eq("profile_id", user.id);

  await supabase.from("workout_logs").insert({
    plan_day_id: planDayId,
    profile_id: user.id,
    duration_seconds: durationSeconds,
  });

  revalidatePath("/dashboard");
}

export async function skipWorkoutDay(planDayId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  await supabase
    .from("workout_plan_days")
    .update({ status: "skipped", skipped_at: new Date().toISOString() })
    .eq("id", planDayId)
    .eq("profile_id", user.id);

  revalidatePath("/dashboard");
}

export async function cancelPlan(planId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  await supabase
    .from("workout_plans")
    .update({ cancelled_at: new Date().toISOString() })
    .eq("id", planId)
    .eq("profile_id", user.id);

  redirect("/onboarding");
}
