"use server";

import { createClient } from "@/lib/supabase/server";
import { findDemoMedia } from "./demo-media";

export interface ExerciseMedia {
  videoUrl: string | null;
  thumbnailUrl: string | null;
  secondaryImageUrl: string | null;
}

/**
 * Retorna a mídia de demonstração de um exercício, importando-a na primeira vez que for
 * pedida (o registro em `exercises` é compartilhado, então usuários seguintes já pegam
 * pronto). Ver src/lib/exercises/demo-media.ts para a fonte usada.
 */
export async function ensureExerciseDemoMedia(exerciseId: string): Promise<ExerciseMedia> {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("exercises")
    .select("video_url, thumbnail_url, secondary_image_url")
    .eq("id", exerciseId)
    .single();

  if (existing?.video_url || existing?.thumbnail_url) {
    return {
      videoUrl: existing.video_url,
      thumbnailUrl: existing.thumbnail_url,
      secondaryImageUrl: existing.secondary_image_url,
    };
  }

  const media = findDemoMedia(exerciseId);
  if (!media) {
    return { videoUrl: null, thumbnailUrl: null, secondaryImageUrl: null };
  }

  const { data: updated } = await supabase
    .from("exercises")
    .update({ thumbnail_url: media.primary, secondary_image_url: media.secondary })
    .eq("id", exerciseId)
    .select("video_url, thumbnail_url, secondary_image_url")
    .single();

  return {
    videoUrl: updated?.video_url ?? null,
    thumbnailUrl: updated?.thumbnail_url ?? media.primary,
    secondaryImageUrl: updated?.secondary_image_url ?? media.secondary,
  };
}
