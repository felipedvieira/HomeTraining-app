"use client";

import { Button } from "@/components/ui/Button";

export function ExerciseVideoModal({
  name,
  videoUrl,
  onClose,
}: {
  name: string;
  videoUrl: string | null;
  onClose: () => void;
}) {
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
          {videoUrl ? (
            <video src={videoUrl} controls autoPlay playsInline className="w-full h-full object-cover" />
          ) : (
            <p className="text-muted text-sm px-6 text-center">
              Vídeo de demonstração ainda não cadastrado para este exercício.
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
