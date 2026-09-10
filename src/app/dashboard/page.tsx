import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ConfirmButton } from "@/components/ConfirmButton";
import { Calendar, type CalendarMark } from "@/components/Calendar";
import { AvatarUploader } from "@/components/AvatarUploader";
import { skipWorkoutDay, logCardioOnly, cancelPlan } from "./actions";
import { signOut } from "@/lib/auth/actions";
import { emojiForWorkoutLabel, CARDIO_ONLY_EMOJI } from "@/lib/workout-engine/emoji";

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

  const { data: profile } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", user.id)
    .single();

  const { data: goal } = await supabase
    .from("goals")
    .select("duration_days, weight_loss_target_kg")
    .eq("id", plan.goal_id)
    .single();

  const { data: dayRows } = await supabase
    .from("workout_plan_days")
    .select("id, order_index, label, status, completed_at, skipped_at, cardio_only_at")
    .eq("plan_id", plan.id)
    .order("order_index", { ascending: true });

  const days = dayRows ?? [];
  const totalDays = plan.weeks * plan.days_per_week;
  const completedCount = days.filter((d) => d.status === "completed").length;
  const skippedCount = days.filter((d) => d.status === "skipped").length;
  const cardioOnlyCount = days.filter((d) => d.status === "cardio_only").length;
  const pendingCount = totalDays - completedCount - skippedCount - cardioOnlyCount;
  const nextDay = days.find((d) => d.status === "pending") ?? null;

  const daysRemaining = daysRemainingUntil(plan.created_at, goal?.duration_days ?? 0);

  const marks: CalendarMark[] = days
    .filter((d) => d.status !== "pending")
    .map((d) => {
      const date = d.completed_at ?? d.skipped_at ?? d.cardio_only_at;
      const status = d.status as "completed" | "skipped" | "cardio_only";
      return {
        date: date as string,
        status,
        emoji: status === "cardio_only" ? CARDIO_ONLY_EMOJI : emojiForWorkoutLabel(d.label),
        label: d.label,
      };
    })
    .filter((m) => m.date);

  return (
    <div className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <AvatarUploader userId={user.id} initialUrl={profile?.avatar_url ?? null} />
          <div>
            <h1 className="text-xl font-bold">Home Training</h1>
            <p className="text-muted text-sm">
              Meta de {goal?.weight_loss_target_kg}kg em {goal?.duration_days} dias
            </p>
          </div>
        </div>
        <form action={signOut}>
          <Button type="submit" variant="ghost">
            Sair
          </Button>
        </form>
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
        <div className="space-y-2">
          <Link
            href="/dashboard/treino"
            className="block text-center px-4 py-2.5 rounded-xl font-semibold text-sm bg-primary text-primary-foreground hover:brightness-110 transition"
          >
            {emojiForWorkoutLabel(nextDay.label)} Iniciar treino ({nextDay.label})
          </Link>
          <div className="flex gap-2">
            <form action={logCardioOnly.bind(null, nextDay.id)} className="flex-1">
              <ConfirmButton
                type="submit"
                variant="secondary"
                className="w-full"
                confirmText="Registrar que você fez só cardio hoje, no lugar dessa ficha?"
              >
                {CARDIO_ONLY_EMOJI} Só cardio hoje
              </ConfirmButton>
            </form>
            <form action={skipWorkoutDay.bind(null, nextDay.id)} className="flex-1">
              <ConfirmButton
                type="submit"
                variant="secondary"
                className="w-full"
                confirmText="Pular o treino de hoje?"
              >
                Pular hoje
              </ConfirmButton>
            </form>
          </div>
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
