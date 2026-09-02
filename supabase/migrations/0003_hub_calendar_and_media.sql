-- Rode no SQL Editor do Supabase, depois das migrações anteriores.
-- Adiciona: status de dia (pendente/concluído/pulado), cancelamento de plano,
-- e uma segunda imagem de demonstração por exercício.

alter table workout_plan_days
  add column status text not null default 'pending' check (status in ('pending', 'completed', 'skipped')),
  add column skipped_at timestamptz;

update workout_plan_days set status = 'completed' where completed_at is not null;

alter table workout_plans
  add column cancelled_at timestamptz;

alter table exercises
  add column secondary_image_url text;

-- Permite que o app grave a mídia de demonstração importada sob demanda (a tabela é
-- compartilhada entre todos os usuários; leitura já era pública, faltava a escrita).
create policy "exercises: authenticated can fill media" on exercises for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
