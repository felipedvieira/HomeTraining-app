"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ensureExerciseDemoMedia, type ExerciseMedia } from "@/lib/exercises/actions";

function AlternatingDemo({ media }: { media: ExerciseMedia }) {
  const [showSecondary, setShowSecondary] = useState(false);

  useEffect(() => {
    if (!media.secondaryImageUrl) return;
    const id = setInterval(() => setShowSecondary((v) => !v), 900);
    return () => clearInterval(id);
  }, [media.secondaryImageUrl]);

  if (media.videoUrl) {
    return <video src={media.videoUrl} controls autoPlay playsInline className="w-full h-full object-cover" />;
  }

  const src = showSecondary && media.secondaryImageUrl ? media.secondaryImageUrl : media.thumbnailUrl;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src ?? undefined} alt="Demonstração do exercício" className="w-full h-full object-contain" />
  );
}

export function ExerciseVideoModal({
  exerciseId,
  name,
  onClose,
}: {
  exerciseId: string;
  name: string;
  onClose: () => void;
}) {
  const [media, setMedia] = useState<ExerciseMedia | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    ensureExerciseDemoMedia(exerciseId).then((result) => {
      if (!cancelled) {
        setMedia(result);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [exerciseId]);

  const hasMedia = media && (media.videoUrl || media.thumbnailUrl);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-surface border border-border rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="aspect-video bg-black flex items-center justify-center">
          {loading ? (
            <p className="text-muted text-sm">Carregando demonstração...</p>
          ) : hasMedia ? (
            <AlternatingDemo media={media} />
          ) : (
            <p className="text-muted text-sm px-6 text-center">
              Ainda não temos demonstração visual para este exercício.
            </p>
          )}
        </div>
        <div className="p-4 flex items-center justify-between">
          <p className="font-semibold">{name}</p>
          <Button variant="ghost" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
