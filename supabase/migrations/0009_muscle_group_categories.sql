-- Rode no SQL Editor do Supabase, depois das migrações anteriores.
-- Adiciona um agrupamento por grupo muscular pro onboarding (separado da
-- coluna `category`, que continua existindo e é usada em outras partes do app).

alter table equipment_catalog add column if not exists muscle_group text;

update equipment_catalog set muscle_group = 'cardio' where id in
  ('treadmill', 'bike', 'rowing_machine', 'jump_rope');

update equipment_catalog set muscle_group = 'full_body' where id in
  ('dumbbells', 'barbell', 'kettlebell', 'bench', 'power_rack', 'resistance_band', 'trx', 'mat');

update equipment_catalog set muscle_group = 'legs' where id in
  ('leg_press', 'leg_extension', 'leg_curl', 'hack_squat', 'hip_adductor', 'hip_abductor',
   'smith_machine', 'calf_raise_machine');

update equipment_catalog set muscle_group = 'back' where id in
  ('pull_up_bar', 'lat_pulldown', 'seated_row', 'assisted_pullup_dip');

update equipment_catalog set muscle_group = 'chest' where id in
  ('chest_fly_machine', 'cable_crossover', 'chest_press_machine');

update equipment_catalog set muscle_group = 'shoulders' where id in
  ('shoulder_press_machine');

update equipment_catalog set muscle_group = 'arms' where id in
  ('cable_tricep', 'preacher_bench');

update equipment_catalog set muscle_group = 'core' where id in
  ('ab_crunch_machine');
