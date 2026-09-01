-- Treino em Casa — schema inicial
-- Rode este arquivo no SQL editor do seu projeto Supabase (Database > SQL Editor).

create extension if not exists "pgcrypto";

create type cardio_preference as enum ('low', 'moderate', 'high');

-- ---------------------------------------------------------------------------
-- Catálogo de equipamentos (dado compartilhado, não pertence a um usuário)
-- ---------------------------------------------------------------------------
create table equipment_catalog (
  id text primary key,
  name text not null,
  category text not null check (category in ('cardio', 'strength_machine', 'free_weight', 'bodyweight', 'accessory'))
);

insert into equipment_catalog (id, name, category) values
  ('treadmill', 'Esteira', 'cardio'),
  ('bike', 'Bicicleta ergométrica', 'cardio'),
  ('rowing_machine', 'Remo (rowing machine)', 'cardio'),
  ('jump_rope', 'Corda de pular', 'cardio'),
  ('dumbbells', 'Halteres', 'free_weight'),
  ('barbell', 'Barra e anilhas', 'free_weight'),
  ('kettlebell', 'Kettlebell', 'free_weight'),
  ('bench', 'Banco (reto/ajustável)', 'accessory'),
  ('power_rack', 'Gaiola / power rack', 'strength_machine'),
  ('pull_up_bar', 'Barra fixa', 'strength_machine'),
  ('resistance_band', 'Elástico de resistência', 'accessory'),
  ('trx', 'TRX / fita de suspensão', 'accessory'),
  ('mat', 'Colchonete', 'accessory'),
  ('none', 'Nenhum (peso do corpo)', 'bodyweight')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Perfil (1:1 com auth.users)
-- ---------------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "profiles: select own" on profiles for select using (auth.uid() = id);
create policy "profiles: insert own" on profiles for insert with check (auth.uid() = id);
create policy "profiles: update own" on profiles for update using (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- Equipamentos que o usuário tem disponível
-- ---------------------------------------------------------------------------
create table profile_equipment (
  profile_id uuid not null references profiles (id) on delete cascade,
  equipment_id text not null references equipment_catalog (id) on delete cascade,
  primary key (profile_id, equipment_id)
);

alter table profile_equipment enable row level security;

create policy "profile_equipment: owner all" on profile_equipment for all
  using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- ---------------------------------------------------------------------------
-- Metas de perda de peso
-- ---------------------------------------------------------------------------
create table goals (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles (id) on delete cascade,
  current_weight_kg numeric(5, 2) not null check (current_weight_kg > 0),
  height_cm numeric(5, 1) not null check (height_cm > 0),
  weight_loss_target_kg numeric(5, 2) not null check (weight_loss_target_kg > 0),
  duration_days int not null check (duration_days > 0),
  days_per_week int not null check (days_per_week between 1 and 7),
  cardio_preference cardio_preference not null default 'moderate',
  prefers_free_weights boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table goals enable row level security;

create policy "goals: owner all" on goals for all
  using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- ---------------------------------------------------------------------------
-- Biblioteca de exercícios (dado compartilhado, mapeado do free-exercise-db-with-videos)
-- ---------------------------------------------------------------------------
create table exercises (
  id text primary key,
  name text not null,
  equipment_id text references equipment_catalog (id),
  primary_muscle text not null,
  category text not null check (category in ('strength', 'cardio')),
  is_compound boolean not null default true,
  video_url text,
  thumbnail_url text
);

-- Precisa espelhar src/lib/exercises/seed.ts — o motor de geração referencia esses IDs.
insert into exercises (id, name, equipment_id, primary_muscle, category, is_compound) values
  ('pushup', 'Flexão de braço', null, 'chest', 'strength', true),
  ('bodyweight-squat', 'Agachamento livre', null, 'quads', 'strength', true),
  ('lunge', 'Afundo (avanço)', null, 'quads', 'strength', true),
  ('glute-bridge', 'Elevação de quadril', null, 'glutes', 'strength', true),
  ('plank', 'Prancha', null, 'core', 'strength', false),
  ('superman', 'Superman', null, 'back', 'strength', false),
  ('pike-pushup', 'Flexão pike (ombros)', null, 'shoulders', 'strength', true),
  ('calf-raise-bodyweight', 'Elevação de panturrilha', null, 'calves', 'strength', false),
  ('burpee', 'Burpee', null, 'cardio', 'cardio', true),
  ('mountain-climber', 'Mountain climber', null, 'cardio', 'cardio', true),
  ('jumping-jacks', 'Polichinelo', null, 'cardio', 'cardio', true),
  ('dumbbell-floor-press', 'Supino com halteres no chão', 'dumbbells', 'chest', 'strength', true),
  ('dumbbell-row', 'Remada unilateral com halter', 'dumbbells', 'back', 'strength', true),
  ('dumbbell-shoulder-press', 'Desenvolvimento com halteres', 'dumbbells', 'shoulders', 'strength', true),
  ('dumbbell-bicep-curl', 'Rosca direta com halteres', 'dumbbells', 'biceps', 'strength', false),
  ('dumbbell-tricep-kickback', 'Tríceps coice com halter', 'dumbbells', 'triceps', 'strength', false),
  ('goblet-squat', 'Agachamento goblet', 'dumbbells', 'quads', 'strength', true),
  ('dumbbell-rdl', 'Levantamento terra romeno com halteres', 'dumbbells', 'hamstrings', 'strength', true),
  ('dumbbell-lateral-raise', 'Elevação lateral com halteres', 'dumbbells', 'shoulders', 'strength', false),
  ('dumbbell-calf-raise', 'Panturrilha em pé com halteres', 'dumbbells', 'calves', 'strength', false),
  ('barbell-back-squat', 'Agachamento livre com barra', 'barbell', 'quads', 'strength', true),
  ('barbell-deadlift', 'Levantamento terra', 'barbell', 'hamstrings', 'strength', true),
  ('barbell-bench-press', 'Supino reto com barra', 'barbell', 'chest', 'strength', true),
  ('barbell-row', 'Remada curvada com barra', 'barbell', 'back', 'strength', true),
  ('barbell-overhead-press', 'Desenvolvimento militar com barra', 'barbell', 'shoulders', 'strength', true),
  ('barbell-bicep-curl', 'Rosca direta com barra', 'barbell', 'biceps', 'strength', false),
  ('bench-dip', 'Mergulho no banco (tríceps)', 'bench', 'triceps', 'strength', true),
  ('step-up', 'Subida no banco (step-up)', 'bench', 'quads', 'strength', true),
  ('kettlebell-swing', 'Kettlebell swing', 'kettlebell', 'cardio', 'cardio', true),
  ('kettlebell-goblet-squat', 'Agachamento goblet com kettlebell', 'kettlebell', 'quads', 'strength', true),
  ('pull-up', 'Barra fixa (pull-up)', 'pull_up_bar', 'back', 'strength', true),
  ('chin-up', 'Barra fixa supinada (chin-up)', 'pull_up_bar', 'biceps', 'strength', true),
  ('hanging-leg-raise', 'Elevação de pernas na barra', 'pull_up_bar', 'core', 'strength', false),
  ('band-row', 'Remada com elástico', 'resistance_band', 'back', 'strength', true),
  ('band-pull-apart', 'Pull-apart com elástico', 'resistance_band', 'shoulders', 'strength', false),
  ('band-squat', 'Agachamento com elástico', 'resistance_band', 'quads', 'strength', true),
  ('trx-row', 'Remada no TRX', 'trx', 'back', 'strength', true),
  ('trx-chest-press', 'Supino no TRX', 'trx', 'chest', 'strength', true),
  ('treadmill-run', 'Corrida na esteira', 'treadmill', 'cardio', 'cardio', true),
  ('bike-ride', 'Bicicleta ergométrica', 'bike', 'cardio', 'cardio', true),
  ('rowing-cardio', 'Remo (rowing machine)', 'rowing_machine', 'cardio', 'cardio', true),
  ('jump-rope-cardio', 'Corda de pular', 'jump_rope', 'cardio', 'cardio', true)
on conflict (id) do nothing;

-- Leitura pública (catálogo compartilhado); sem policies de escrita para usuários comuns.
alter table exercises enable row level security;
create policy "exercises: public read" on exercises for select using (true);
alter table equipment_catalog enable row level security;
create policy "equipment_catalog: public read" on equipment_catalog for select using (true);

-- ---------------------------------------------------------------------------
-- Planos de treino gerados
-- ---------------------------------------------------------------------------
create table workout_plans (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles (id) on delete cascade,
  goal_id uuid not null references goals (id) on delete cascade,
  split_type text not null,
  weeks int not null,
  days_per_week int not null,
  created_at timestamptz not null default now()
);

alter table workout_plans enable row level security;

create policy "workout_plans: owner all" on workout_plans for all
  using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create table workout_plan_days (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references workout_plans (id) on delete cascade,
  profile_id uuid not null references profiles (id) on delete cascade,
  week_number int not null,
  day_number int not null,
  label text not null,
  order_index int not null,
  completed_at timestamptz
);

alter table workout_plan_days enable row level security;

create policy "workout_plan_days: owner all" on workout_plan_days for all
  using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create table workout_plan_exercises (
  id uuid primary key default gen_random_uuid(),
  plan_day_id uuid not null references workout_plan_days (id) on delete cascade,
  exercise_id text not null references exercises (id),
  order_index int not null,
  sets int not null,
  reps text not null,
  rest_seconds int not null
);

alter table workout_plan_exercises enable row level security;

create policy "workout_plan_exercises: owner all" on workout_plan_exercises for all
  using (
    exists (
      select 1 from workout_plan_days d
      where d.id = workout_plan_exercises.plan_day_id and d.profile_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from workout_plan_days d
      where d.id = workout_plan_exercises.plan_day_id and d.profile_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- Registro de treinos concluídos
-- ---------------------------------------------------------------------------
create table workout_logs (
  id uuid primary key default gen_random_uuid(),
  plan_day_id uuid not null references workout_plan_days (id) on delete cascade,
  profile_id uuid not null references profiles (id) on delete cascade,
  duration_seconds int not null,
  completed_at timestamptz not null default now()
);

alter table workout_logs enable row level security;

create policy "workout_logs: owner all" on workout_logs for all
  using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create index on profile_equipment (profile_id);
create index on goals (profile_id) where is_active;
create index on workout_plan_days (plan_id, order_index);
create index on workout_plan_exercises (plan_day_id, order_index);
create index on workout_logs (profile_id);
