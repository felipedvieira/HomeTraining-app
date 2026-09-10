-- Rode este arquivo no SQL Editor do Supabase.
-- Seguro de rodar mesmo que você já tenha rodado o 0005 e/ou 0006 antes —
-- usa "on conflict...do update", então só garante que o resultado final
-- fique certo (equipamentos com os ícones locais em /equipment/*.svg).

alter table equipment_catalog add column if not exists image_url text;

insert into equipment_catalog (id, name, category, image_url) values
  ('treadmill', 'Esteira', 'cardio', '/equipment/treadmill.svg'),
  ('bike', 'Bicicleta ergométrica', 'cardio', '/equipment/bike.svg'),
  ('rowing_machine', 'Remo (rowing machine)', 'cardio', '/equipment/rowing_machine.svg'),
  ('jump_rope', 'Corda de pular', 'cardio', '/equipment/jump_rope.svg'),
  ('dumbbells', 'Halteres', 'free_weight', '/equipment/dumbbells.svg'),
  ('barbell', 'Barra e anilhas', 'free_weight', '/equipment/barbell.svg'),
  ('kettlebell', 'Kettlebell', 'free_weight', '/equipment/kettlebell.svg'),
  ('bench', 'Banco (reto/ajustável)', 'accessory', '/equipment/bench.svg'),
  ('power_rack', 'Gaiola / power rack', 'strength_machine', '/equipment/power_rack.svg'),
  ('pull_up_bar', 'Barra fixa', 'strength_machine', '/equipment/pull_up_bar.svg'),
  ('resistance_band', 'Elástico de resistência', 'accessory', '/equipment/resistance_band.svg'),
  ('trx', 'TRX / fita de suspensão', 'accessory', '/equipment/trx.svg'),
  ('mat', 'Colchonete', 'accessory', '/equipment/mat.svg'),
  ('leg_press', 'Leg press', 'strength_machine', '/equipment/leg_press.svg'),
  ('leg_extension', 'Cadeira extensora', 'strength_machine', '/equipment/leg_extension.svg'),
  ('leg_curl', 'Mesa flexora', 'strength_machine', '/equipment/leg_curl.svg'),
  ('hack_squat', 'Hack squat', 'strength_machine', '/equipment/hack_squat.svg'),
  ('hip_adductor', 'Cadeira adutora', 'strength_machine', '/equipment/hip_adductor.svg'),
  ('hip_abductor', 'Cadeira abdutora', 'strength_machine', '/equipment/hip_abductor.svg'),
  ('smith_machine', 'Smith (agachamento guiado)', 'strength_machine', '/equipment/smith_machine.svg'),
  ('calf_raise_machine', 'Máquina de panturrilha', 'strength_machine', '/equipment/calf_raise_machine.svg'),
  ('lat_pulldown', 'Puxador (lat pulldown)', 'strength_machine', '/equipment/lat_pulldown.svg'),
  ('seated_row', 'Remada baixa (cabo)', 'strength_machine', '/equipment/seated_row.svg'),
  ('chest_fly_machine', 'Peck deck (voador)', 'strength_machine', '/equipment/chest_fly_machine.svg'),
  ('cable_crossover', 'Cross over (polia dupla)', 'strength_machine', '/equipment/cable_crossover.svg'),
  ('cable_tricep', 'Polia de tríceps', 'strength_machine', '/equipment/cable_tricep.svg'),
  ('preacher_bench', 'Banco Scott (rosca)', 'strength_machine', '/equipment/preacher_bench.svg'),
  ('shoulder_press_machine', 'Máquina de desenvolvimento', 'strength_machine', '/equipment/shoulder_press_machine.svg'),
  ('chest_press_machine', 'Máquina de supino', 'strength_machine', '/equipment/chest_press_machine.svg'),
  ('assisted_pullup_dip', 'Barra/paralela assistida', 'strength_machine', '/equipment/assisted_pullup_dip.svg'),
  ('ab_crunch_machine', 'Máquina de abdômen', 'strength_machine', '/equipment/ab_crunch_machine.svg'),
  ('none', 'Nenhum (peso do corpo)', 'bodyweight', null)
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  image_url = excluded.image_url;

insert into exercises (id, name, equipment_id, primary_muscle, category, is_compound) values
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
