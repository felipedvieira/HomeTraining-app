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
  category text not null check (category in ('cardio', 'strength_machine', 'free_weight', 'bodyweight', 'accessory')),
  image_url text
);

insert into equipment_catalog (id, name, category, image_url) values
  ('treadmill', 'Esteira', 'cardio', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/62/Treadmill-gym.jpg/960px-Treadmill-gym.jpg'),
  ('bike', 'Bicicleta ergométrica', 'cardio', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/Stationary_bikes_at_a_gym.jpg/960px-Stationary_bikes_at_a_gym.jpg'),
  ('rowing_machine', 'Remo (rowing machine)', 'cardio', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/49/Rowing_Machine.jpg/960px-Rowing_Machine.jpg'),
  ('jump_rope', 'Corda de pular', 'cardio', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/Ghanaian_kid_%28skipping_rope%29_02.jpg/960px-Ghanaian_kid_%28skipping_rope%29_02.jpg'),
  ('dumbbells', 'Halteres', 'free_weight', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c4/Woman_standing_in_front_of_a_dumbbell_rack_doing_bicep_curls.jpg/960px-Woman_standing_in_front_of_a_dumbbell_rack_doing_bicep_curls.jpg'),
  ('barbell', 'Barra e anilhas', 'free_weight', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Olympic_barbell.jpg/960px-Olympic_barbell.jpg'),
  ('kettlebell', 'Kettlebell', 'free_weight', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Kettlebell_truebalance_romeike.jpg/960px-Kettlebell_truebalance_romeike.jpg'),
  ('bench', 'Banco (reto/ajustável)', 'accessory', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/71/Weight_benche_15761311874.jpg/960px-Weight_benche_15761311874.jpg'),
  ('power_rack', 'Gaiola / power rack', 'strength_machine', 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Powerrack.jpg'),
  ('pull_up_bar', 'Barra fixa', 'strength_machine', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a4/Pull_up_bar_stand.jpg/960px-Pull_up_bar_stand.jpg'),
  ('resistance_band', 'Elástico de resistência', 'accessory', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/80/Woman_exercising_with_resistance_band_in_a_gym_setting.jpg/960px-Woman_exercising_with_resistance_band_in_a_gym_setting.jpg'),
  ('trx', 'TRX / fita de suspensão', 'accessory', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/34/Suspension_training_equipment.png/960px-Suspension_training_equipment.png'),
  ('mat', 'Colchonete', 'accessory', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/Yoga_mat_and_water_bottle_in_a_living_room.jpg/960px-Yoga_mat_and_water_bottle_in_a_living_room.jpg'),
  ('leg_press', 'Leg press', 'strength_machine', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/Gym_Leg_Press_Machine.jpg/960px-Gym_Leg_Press_Machine.jpg'),
  ('leg_extension', 'Cadeira extensora', 'strength_machine', 'https://upload.wikimedia.org/wikipedia/commons/3/36/LegExtensionMachineExercise.JPG'),
  ('leg_curl', 'Mesa flexora', 'strength_machine', 'https://upload.wikimedia.org/wikipedia/commons/c/c6/LyingLegCurlMachineExercise.JPG'),
  ('hack_squat', 'Hack squat', 'strength_machine', 'https://upload.wikimedia.org/wikipedia/commons/d/dd/HackSquatMachineExercise.JPG'),
  ('hip_adductor', 'Cadeira adutora', 'strength_machine', null),
  ('hip_abductor', 'Cadeira abdutora', 'strength_machine', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f9/Hip_abductor_machine.jpg/960px-Hip_abductor_machine.jpg'),
  ('smith_machine', 'Smith (agachamento guiado)', 'strength_machine', 'https://upload.wikimedia.org/wikipedia/commons/a/ad/%D0%9F%D1%80%D0%B8%D1%81%D0%B5%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F_%D0%B2_%D1%82%D1%80%D0%B5%D0%BD%D0%B0%D0%B6%D0%B5%D1%80%D0%B5_%D0%A1%D0%BC%D0%B8%D1%82%D0%B0.jpg'),
  ('calf_raise_machine', 'Máquina de panturrilha', 'strength_machine', 'https://upload.wikimedia.org/wikipedia/commons/e/e7/SeatedCalfRaiseMachineExercise.JPG'),
  ('lat_pulldown', 'Puxador (lat pulldown)', 'strength_machine', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2a/Diverging_Lat_Pulldown_Machine.jpg/960px-Diverging_Lat_Pulldown_Machine.jpg'),
  ('seated_row', 'Remada baixa (cabo)', 'strength_machine', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0a/Woman_using_a_seated_cable_row_machine_at_the_gym.jpg/960px-Woman_using_a_seated_cable_row_machine_at_the_gym.jpg'),
  ('chest_fly_machine', 'Peck deck (voador)', 'strength_machine', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cf/Pec_deck_Fly.jpg/960px-Pec_deck_Fly.jpg'),
  ('cable_crossover', 'Cross over (polia dupla)', 'strength_machine', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/28/Chest_flies_with_cable_machine_-_cable_crossover_flies.jpg/960px-Chest_flies_with_cable_machine_-_cable_crossover_flies.jpg'),
  ('cable_tricep', 'Polia de tríceps', 'strength_machine', 'https://upload.wikimedia.org/wikipedia/commons/4/4e/CableMachinePushdown.JPG'),
  ('preacher_bench', 'Banco Scott (rosca)', 'strength_machine', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1c/Humberto_Garcia_entrenado_CURL_SCOTT_en_VINCE_GYM_1965.jpg/960px-Humberto_Garcia_entrenado_CURL_SCOTT_en_VINCE_GYM_1965.jpg'),
  ('shoulder_press_machine', 'Máquina de desenvolvimento', 'strength_machine', 'https://upload.wikimedia.org/wikipedia/commons/1/1f/ShoulderPressMachineExercise.JPG'),
  ('chest_press_machine', 'Máquina de supino', 'strength_machine', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f9/Girl_doing_chest_press_machine_exercise.jpg/960px-Girl_doing_chest_press_machine_exercise.jpg'),
  ('assisted_pullup_dip', 'Barra/paralela assistida', 'strength_machine', null),
  ('ab_crunch_machine', 'Máquina de abdômen', 'strength_machine', null),
  ('none', 'Nenhum (peso do corpo)', 'bodyweight', null)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Perfil (1:1 com auth.users)
-- ---------------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
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
-- Biblioteca de exercícios (dado compartilhado; video_url/thumbnail_url/secondary_image_url
-- começam vazios e são preenchidos sob demanda — ver src/lib/exercises/demo-media.ts)
-- ---------------------------------------------------------------------------
create table exercises (
  id text primary key,
  name text not null,
  equipment_id text references equipment_catalog (id),
  primary_muscle text not null,
  category text not null check (category in ('strength', 'cardio')),
  is_compound boolean not null default true,
  video_url text,
  thumbnail_url text,
  secondary_image_url text
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
  ('jump-rope-cardio', 'Corda de pular', 'jump_rope', 'cardio', 'cardio', true),
  ('leg-press-machine', 'Leg press', 'leg_press', 'quads', 'strength', true),
  ('leg-extension-machine', 'Cadeira extensora', 'leg_extension', 'quads', 'strength', false),
  ('lying-leg-curl-machine', 'Mesa flexora', 'leg_curl', 'hamstrings', 'strength', false),
  ('hack-squat-machine', 'Hack squat', 'hack_squat', 'quads', 'strength', true),
  ('smith-machine-squat', 'Agachamento no Smith', 'smith_machine', 'quads', 'strength', true),
  ('calf-raise-machine-ex', 'Panturrilha na máquina', 'calf_raise_machine', 'calves', 'strength', false),
  ('lat-pulldown-machine', 'Puxador (lat pulldown)', 'lat_pulldown', 'back', 'strength', true),
  ('seated-cable-row-machine', 'Remada baixa no cabo', 'seated_row', 'back', 'strength', true),
  ('pec-deck-fly-machine', 'Voador (peck deck)', 'chest_fly_machine', 'chest', 'strength', false),
  ('cable-crossover-fly', 'Cross over', 'cable_crossover', 'chest', 'strength', false),
  ('cable-tricep-pushdown', 'Tríceps na polia', 'cable_tricep', 'triceps', 'strength', false),
  ('preacher-curl-machine', 'Rosca Scott', 'preacher_bench', 'biceps', 'strength', false),
  ('machine-shoulder-press', 'Desenvolvimento na máquina', 'shoulder_press_machine', 'shoulders', 'strength', true),
  ('machine-chest-press', 'Supino na máquina', 'chest_press_machine', 'chest', 'strength', true)
on conflict (id) do nothing;

-- Leitura pública (catálogo compartilhado); sem policies de escrita para usuários comuns.
alter table exercises enable row level security;
create policy "exercises: public read" on exercises for select using (true);
create policy "exercises: authenticated can fill media" on exercises for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
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
  cancelled_at timestamptz,
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
  status text not null default 'pending' check (status in ('pending', 'completed', 'skipped')),
  completed_at timestamptz,
  skipped_at timestamptz
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

-- ---------------------------------------------------------------------------
-- Foto de perfil
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatars: owner can insert" on storage.objects for insert
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatars: owner can update" on storage.objects for update
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatars: owner can delete" on storage.objects for delete
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatars: public read" on storage.objects for select
  using (bucket_id = 'avatars');
