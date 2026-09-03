"use client";

import { Button } from "@/components/ui/Button";

export function EquipmentPhotoModal({
  name,
  imageUrl,
  onClose,
}: {
  name: string;
  imageUrl: string | null;
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
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={name} className="w-full h-full object-contain" />
          ) : (
            <p className="text-muted text-sm px-6 text-center">
              Ainda não temos uma foto de referência pra este equipamento.
            </p>
          )}
        </div>
        <div className="p-4 flex items-center justify-between">
          <p className="font-semibold">{name}</p>
          <Button type="button" variant="ghost" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
