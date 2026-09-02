import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TodayWorkout, type TodayWorkoutDay } from "../TodayWorkout";

export default async function TreinoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: plan } = await supabase
    .from("workout_plans")
    .select("id")
    .eq("profile_id", user.id)
    .is("cancelled_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!plan) redirect("/onboarding");

  const { data: nextDay } = await supabase
    .from("workout_plan_days")
    .select(
      "id, week_number, day_number, label, workout_plan_exercises(id, order_index, sets, reps, rest_seconds, exercises(id, name, primary_muscle, category, video_url, thumbnail_url))"
    )
    .eq("plan_id", plan.id)
    .eq("status", "pending")
    .order("order_index", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!nextDay) redirect("/dashboard");

  const day = nextDay as unknown as TodayWorkoutDay;

  return (
    <div className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full">
      <TodayWorkout day={day} />
    </div>
  );
}
