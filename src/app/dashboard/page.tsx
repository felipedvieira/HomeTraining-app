import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TodayWorkout, type TodayWorkoutDay } from "./TodayWorkout";
import { Card } from "@/components/ui/Card";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: plan } = await supabase
    .from("workout_plans")
    .select("id, weeks, days_per_week, split_type")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!plan) redirect("/onboarding");

  const totalDays = plan.weeks * plan.days_per_week;

  const { count: completedCount } = await supabase
    .from("workout_plan_days")
    .select("id", { count: "exact", head: true })
    .eq("plan_id", plan.id)
    .not("completed_at", "is", null);

  const { data: nextDay } = await supabase
    .from("workout_plan_days")
    .select(
      "id, week_number, day_number, label, workout_plan_exercises(id, order_index, sets, reps, rest_seconds, exercises(id, name, primary_muscle, category, video_url, thumbnail_url))"
    )
    .eq("plan_id", plan.id)
    .is("completed_at", null)
    .order("order_index", { ascending: true })
    .limit(1)
    .maybeSingle();

  const day = nextDay as unknown as TodayWorkoutDay | null;

  return (
    <div className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full">
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="text-2xl font-bold">Seu treino</h1>
        <span className="text-sm text-muted">
          {completedCount ?? 0}/{totalDays} treinos concluídos
        </span>
      </div>

      {day ? (
        <TodayWorkout key={day.id} day={day} />
      ) : (
        <Card className="text-center py-10">
          <p className="text-xl font-semibold text-primary mb-1">Plano concluído! 🎉</p>
          <p className="text-muted">Você terminou todos os treinos desta ficha.</p>
        </Card>
      )}
    </div>
  );
}
