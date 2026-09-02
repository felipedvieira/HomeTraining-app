import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { ConfirmButton } from "@/components/ConfirmButton";
import { Calendar, type CalendarMark } from "@/components/Calendar";
import { skipWorkoutDay, cancelPlan } from "./actions";

function daysRemainingUntil(startIso: string, durationDays: number): number {
  const start = new Date(startIso);
  const end = new Date(start.getTime() + durationDays * 86400000);
  return Math.max(0, Math.ceil((end.getTime() - Date.now()) / 86400000));
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: plan } = await supabase
    .from("workout_plans")
    .select("id, weeks, days_per_week, split_type, created_at, goal_id")
    .eq("profile_id", user.id)
    .is("cancelled_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!plan) redirect("/onboarding");

  const { data: goal } = await supabase
    .from("goals")
    .select("duration_days, weight_loss_target_kg")
    .eq("id", plan.goal_id)
    .single();

  const { data: dayRows } = await supabase
    .from("workout_plan_days")
    .select("id, order_index, label, status, completed_at, skipped_at")
    .eq("plan_id", plan.id)
    .order("order_index", { ascending: true });

  const days = dayRows ?? [];
  const totalDays = plan.weeks * plan.days_per_week;
  const completedCount = days.filter((d) => d.status === "completed").length;
  const skippedCount = days.filter((d) => d.status === "skipped").length;
  const pendingCount = totalDays - completedCount - skippedCount;
  const nextDay = days.find((d) => d.status === "pending") ?? null;

  const daysRemaining = daysRemainingUntil(plan.created_at, goal?.duration_days ?? 0);

  const marks: CalendarMark[] = days
    .filter((d) => d.status !== "pending" && (d.completed_at || d.skipped_at))
    .map((d) => ({
      date: (d.status === "completed" ? d.completed_at : d.skipped_at) as string,
      status: d.status as "completed" | "skipped",
    }));

  return (
    <div className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Seu treino</h1>
        <p className="text-muted text-sm">
          Meta de {goal?.weight_loss_target_kg}kg em {goal?.duration_days} dias
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <p className="text-3xl font-bold text-primary">{pendingCount}</p>
          <p className="text-sm text-muted">treinos restantes</p>
        </Card>
        <Card>
          <p className="text-3xl font-bold text-primary">{daysRemaining}</p>
          <p className="text-sm text-muted">dias até o fim do período</p>
        </Card>
      </div>

      {nextDay ? (
        <div className="flex gap-3">
          <Link
            href="/dashboard/treino"
            className="flex-1 text-center px-4 py-2.5 rounded-xl font-semibold text-sm bg-primary text-primary-foreground hover:brightness-110 transition"
          >
            Iniciar treino ({nextDay.label})
          </Link>
          <form action={skipWorkoutDay.bind(null, nextDay.id)}>
            <ConfirmButton type="submit" variant="secondary" confirmText="Pular o treino de hoje?">
              Pular hoje
            </ConfirmButton>
          </form>
        </div>
      ) : (
        <Card className="text-center py-6">
          <p className="text-lg font-semibold text-primary">Plano concluído! 🎉</p>
        </Card>
      )}

      <Card>
        <h2 className="font-semibold mb-3">Calendário</h2>
        <Calendar marks={marks} />
      </Card>

      <form action={cancelPlan.bind(null, plan.id)} className="pt-2">
        <ConfirmButton
          type="submit"
          variant="danger"
          className="w-full"
          confirmText="Isso cancela seu plano atual (o histórico continua salvo) e te leva pra criar um novo do zero. Continuar?"
        >
          Cancelar plano e criar um novo
        </ConfirmButton>
      </form>
    </div>
  );
}
