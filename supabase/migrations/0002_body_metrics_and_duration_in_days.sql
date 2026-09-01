-- Rode este arquivo no SQL Editor do seu projeto Supabase (adicional ao schema.sql já rodado).
-- Adiciona peso atual e altura à meta, e troca o prazo de semanas para dias.

alter table goals rename column duration_weeks to duration_days;

alter table goals
  add column current_weight_kg numeric(5, 2) check (current_weight_kg > 0),
  add column height_cm numeric(5, 1) check (height_cm > 0);
