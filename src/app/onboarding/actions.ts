"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { generateWorkoutPlan } from "@/lib/workout-engine/generate";
import { EXERCISE_SEED } from "@/lib/exercises/seed";
import type { CardioPreference } from "@/lib/workout-engine/types";

export async function createPlanFromOnboarding(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const equipmentIds = formData.getAll("equipment") as string[];
  const currentWeightKg = Number(formData.get("currentWeightKg"));
  const heightCm = Number(formData.get("heightCm"));
  const weightLossTargetKg = Number(formData.get("weightLossTargetKg"));
  const durationDays = Number(formData.get("durationDays"));
  const daysPerWeek = Number(formData.get("daysPerWeek"));
  const cardioPreference = formData.get("cardioPreference") as CardioPreference;
  const prefersFreeWeights = formData.get("prefersFreeWeights") === "on";

  await supabase.from("profiles").upsert({ id: user.id });

  await supabase.from("profile_equipment").delete().eq("profile_id", user.id);
  if (equipmentIds.length > 0) {
    await supabase
      .from("profile_equipment")
      .insert(equipmentIds.map((equipment_id) => ({ profile_id: user.id, equipment_id })));
  }

  const { data: goal, error: goalError } = await supabase
    .from("goals")
    .insert({
      profile_id: user.id,
      current_weight_kg: currentWeightKg,
      height_cm: heightCm,
      weight_loss_target_kg: weightLossTargetKg,
      duration_days: durationDays,
      days_per_week: daysPerWeek,
      cardio_preference: cardioPreference,
      prefers_free_weights: prefersFreeWeights,
    })
    .select("id")
    .single();
  if (goalError || !goal) throw new Error(goalError?.message ?? "Falha ao salvar a meta");

  const plan = generateWorkoutPlan(
    {
      equipmentIds,
      currentWeightKg,
      heightCm,
      weightLossTargetKg,
      durationDays,
      daysPerWeek,
      cardioPreference,
      prefersFreeWeights,
    },
    EXERCISE_SEED
  );

  const { data: workoutPlan, error: planError } = await supabase
    .from("workout_plans")
    .insert({
      profile_id: user.id,
      goal_id: goal.id,
      split_type: plan.splitType,
      weeks: plan.weeks,
      days_per_week: plan.daysPerWeek,
    })
    .select("id")
    .single();
  if (planError || !workoutPlan) throw new Error(planError?.message ?? "Falha ao salvar o plano");

  const { data: insertedDays, error: daysError } = await supabase
    .from("workout_plan_days")
    .insert(
      plan.days.map((day) => ({
        plan_id: workoutPlan.id,
        profile_id: user.id,
        week_number: day.weekNumber,
        day_number: day.dayNumber,
        label: day.label,
        order_index: day.dayNumber - 1,
      }))
    )
    .select("id, day_number");
  if (daysError || !insertedDays) throw new Error(daysError?.message ?? "Falha ao salvar os dias");

  const dayIdByNumber = new Map(insertedDays.map((d) => [d.day_number, d.id]));

  const exerciseRows = plan.days.flatMap((day) => {
    const planDayId = dayIdByNumber.get(day.dayNumber);
    if (!planDayId) return [];
    return day.exercises.map((ex, index) => ({
      plan_day_id: planDayId,
      exercise_id: ex.exerciseId,
      order_index: index,
      sets: ex.sets,
      reps: ex.reps,
      rest_seconds: ex.restSeconds,
    }));
  });

  if (exerciseRows.length > 0) {
    const { error: exercisesError } = await supabase
      .from("workout_plan_exercises")
      .insert(exerciseRows);
    if (exercisesError) throw new Error(exercisesError.message);
  }

  redirect("/dashboard");
}
