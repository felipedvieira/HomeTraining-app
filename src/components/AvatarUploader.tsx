"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export function AvatarUploader({
  userId,
  initialUrl,
}: {
  userId: string;
  initialUrl: string | null;
}) {
  const [url, setUrl] = useState(initialUrl);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setBusy(true);
    const supabase = createClient();
    const path = `${userId}/avatar`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });

    if (!uploadError) {
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      const bustUrl = `${data.publicUrl}?t=${Date.now()}`;
      await supabase.from("profiles").update({ avatar_url: bustUrl }).eq("id", userId);
      setUrl(bustUrl);
    }

    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleDelete() {
    setBusy(true);
    const supabase = createClient();
    await supabase.storage.from("avatars").remove([`${userId}/avatar`]);
    await supabase.from("profiles").update({ avatar_url: null }).eq("id", userId);
    setUrl(null);
    setBusy(false);
  }

  return (
    <div className="relative w-14 h-14 shrink-0">
      <label
        htmlFor="avatar-input"
        className="w-14 h-14 rounded-full overflow-hidden bg-surface-2 border border-border flex items-center justify-center cursor-pointer"
        title={url ? "Trocar foto" : "Adicionar foto"}
      >
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="Sua foto" className="w-full h-full object-cover" />
        ) : (
          <span className="text-muted text-[10px] text-center leading-tight px-1">
            Adicionar foto
          </span>
        )}
      </label>

      <input
        ref={inputRef}
        id="avatar-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
        disabled={busy}
      />

      {url && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={busy}
          aria-label="Excluir foto"
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-danger text-primary-foreground text-xs leading-none flex items-center justify-center"
        >
          ×
        </button>
      )}
    </div>
  );
}
