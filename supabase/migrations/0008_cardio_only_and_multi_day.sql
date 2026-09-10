-- Rode no SQL Editor do Supabase, depois das migrações anteriores.
-- Adiciona um terceiro resultado pro dia de treino: "só fiz cardio" (em vez de
-- pular totalmente ou concluir a ficha completa).

-- Remove a constraint antiga de status (o nome exato pode variar, então buscamos
-- dinamicamente em vez de arriscar um DROP CONSTRAINT com nome errado).
do $$
declare
  con_name text;
begin
  select con.conname into con_name
  from pg_constraint con
  join pg_class rel on rel.oid = con.conrelid
  where rel.relname = 'workout_plan_days'
    and con.contype = 'c'
    and pg_get_constraintdef(con.oid) like '%status%pending%';

  if con_name is not null then
    execute format('alter table workout_plan_days drop constraint %I', con_name);
  end if;
end $$;

alter table workout_plan_days
  add constraint workout_plan_days_status_check check (status in ('pending', 'completed', 'skipped', 'cardio_only'));

alter table workout_plan_days add column if not exists cardio_only_at timestamptz;
