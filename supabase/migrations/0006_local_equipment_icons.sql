-- Rode no SQL Editor do Supabase, depois das migrações anteriores.
-- Troca as fotos externas por ícones ilustrados próprios (public/equipment/*.svg),
-- todos no mesmo estilo visual — resolve a falta de padronização das fotos.

update equipment_catalog set image_url = '/equipment/' || id || '.svg'
where id in (
  'treadmill','bike','rowing_machine','jump_rope','dumbbells','barbell','kettlebell',
  'bench','power_rack','pull_up_bar','resistance_band','trx','mat',
  'leg_press','leg_extension','leg_curl','hack_squat','hip_adductor','hip_abductor',
  'smith_machine','calf_raise_machine','lat_pulldown','seated_row','chest_fly_machine',
  'cable_crossover','cable_tricep','preacher_bench','shoulder_press_machine',
  'chest_press_machine','assisted_pullup_dip','ab_crunch_machine'
);
