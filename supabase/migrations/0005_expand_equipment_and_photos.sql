-- Rode no SQL Editor do Supabase, depois das migrações anteriores.
-- Expande o catálogo de equipamentos com os principais aparelhos de academia,
-- adiciona foto de referência por equipamento (botão de dúvida), e complementa
-- a biblioteca de exercícios pra usar os novos aparelhos.

alter table equipment_catalog add column image_url text;

-- Fotos dos equipamentos que já existiam (Wikimedia Commons, licença livre).
update equipment_catalog set image_url = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/62/Treadmill-gym.jpg/960px-Treadmill-gym.jpg' where id = 'treadmill';
update equipment_catalog set image_url = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/Stationary_bikes_at_a_gym.jpg/960px-Stationary_bikes_at_a_gym.jpg' where id = 'bike';
update equipment_catalog set image_url = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/49/Rowing_Machine.jpg/960px-Rowing_Machine.jpg' where id = 'rowing_machine';
update equipment_catalog set image_url = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/Ghanaian_kid_%28skipping_rope%29_02.jpg/960px-Ghanaian_kid_%28skipping_rope%29_02.jpg' where id = 'jump_rope';
update equipment_catalog set image_url = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c4/Woman_standing_in_front_of_a_dumbbell_rack_doing_bicep_curls.jpg/960px-Woman_standing_in_front_of_a_dumbbell_rack_doing_bicep_curls.jpg' where id = 'dumbbells';
update equipment_catalog set image_url = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Olympic_barbell.jpg/960px-Olympic_barbell.jpg' where id = 'barbell';
update equipment_catalog set image_url = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Kettlebell_truebalance_romeike.jpg/960px-Kettlebell_truebalance_romeike.jpg' where id = 'kettlebell';
update equipment_catalog set image_url = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/71/Weight_benche_15761311874.jpg/960px-Weight_benche_15761311874.jpg' where id = 'bench';
update equipment_catalog set image_url = 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Powerrack.jpg' where id = 'power_rack';
update equipment_catalog set image_url = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a4/Pull_up_bar_stand.jpg/960px-Pull_up_bar_stand.jpg' where id = 'pull_up_bar';
update equipment_catalog set image_url = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/80/Woman_exercising_with_resistance_band_in_a_gym_setting.jpg/960px-Woman_exercising_with_resistance_band_in_a_gym_setting.jpg' where id = 'resistance_band';
update equipment_catalog set image_url = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/34/Suspension_training_equipment.png/960px-Suspension_training_equipment.png' where id = 'trx';
update equipment_catalog set image_url = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/Yoga_mat_and_water_bottle_in_a_living_room.jpg/960px-Yoga_mat_and_water_bottle_in_a_living_room.jpg' where id = 'mat';

-- Novos aparelhos (principais máquinas de academia).
insert into equipment_catalog (id, name, category, image_url) values
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
  ('ab_crunch_machine', 'Máquina de abdômen', 'strength_machine', null)
on conflict (id) do nothing;

-- Novos exercícios que usam os aparelhos acima (a ficha passa a poder escalá-los).
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
