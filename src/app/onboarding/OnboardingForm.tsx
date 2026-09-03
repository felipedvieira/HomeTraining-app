"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { createPlanFromOnboarding } from "./actions";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextField, SelectField } from "@/components/ui/Field";
import { EquipmentPhotoModal } from "@/components/EquipmentPhotoModal";

type EquipmentRow = { id: string; name: string; category: string; image_url: string | null };

const CATEGORY_LABELS: Record<string, string> = {
  cardio: "Cardio",
  free_weight: "Pesos livres",
  strength_machine: "Máquinas / estruturas",
  accessory: "Acessórios",
  bodyweight: "Peso do corpo",
};

function groupByCategory(items: EquipmentRow[]) {
  const groups = new Map<string, EquipmentRow[]>();
  for (const item of items) {
    if (!groups.has(item.category)) groups.set(item.category, []);
    groups.get(item.category)!.push(item);
  }
  return groups;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Gerando sua ficha..." : "Gerar minha ficha de treino"}
    </Button>
  );
}

export function OnboardingForm({ equipmentCatalog }: { equipmentCatalog: EquipmentRow[] }) {
  const groups = groupByCategory(equipmentCatalog.filter((e) => e.id !== "none"));
  const [photoItem, setPhotoItem] = useState<EquipmentRow | null>(null);

  return (
    <form action={createPlanFromOnboarding} className="space-y-6">
      <Card className="space-y-4">
        <h2 className="font-semibold">Você e sua meta</h2>
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Seu peso atual (kg)"
            name="currentWeightKg"
            type="number"
            step="0.1"
            min="1"
            required
            placeholder="ex: 78"
          />
          <TextField
            label="Sua altura (cm)"
            name="heightCm"
            type="number"
            step="1"
            min="1"
            required
            placeholder="ex: 170"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Meta de perda de peso (kg)"
            name="weightLossTargetKg"
            type="number"
            step="0.5"
            min="0.5"
            required
            defaultValue={5}
          />
          <TextField
            label="Prazo (dias)"
            name="durationDays"
            type="number"
            min="7"
            max="365"
            required
            defaultValue={30}
            placeholder="ex: 20, 30, 40"
          />
        </div>
        <SelectField label="Dias de treino por semana" name="daysPerWeek" defaultValue="4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n}x por semana
            </option>
          ))}
        </SelectField>
        <SelectField label="Preferência de cardio" name="cardioPreference" defaultValue="moderate">
          <option value="low">Pouco cardio</option>
          <option value="moderate">Cardio moderado</option>
          <option value="high">Bastante cardio</option>
        </SelectField>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="prefersFreeWeights" defaultChecked className="accent-primary" />
          Prefiro exercícios livres a máquinas guiadas, quando possível
        </label>
      </Card>

      <Card>
        <h2 className="font-semibold mb-3">Quais equipamentos você tem?</h2>
        <div className="space-y-4">
          {[...groups.entries()].map(([category, items]) => (
            <div key={category}>
              <p className="text-xs uppercase tracking-wide text-muted mb-2">
                {CATEGORY_LABELS[category] ?? category}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-1 bg-surface-2 border border-border rounded-lg pl-3 pr-1.5 py-2 text-sm has-[:checked]:border-primary has-[:checked]:text-primary"
                  >
                    <label className="flex items-center gap-2 flex-1 cursor-pointer min-w-0">
                      <input type="checkbox" name="equipment" value={item.id} className="accent-primary shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setPhotoItem(item)}
                      aria-label={`O que é ${item.name}?`}
                      className="shrink-0 w-5 h-5 rounded-full bg-surface border border-border text-muted text-xs flex items-center justify-center hover:text-primary hover:border-primary"
                    >
                      ?
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <SubmitButton />

      {photoItem && (
        <EquipmentPhotoModal
          name={photoItem.name}
          imageUrl={photoItem.image_url}
          onClose={() => setPhotoItem(null)}
        />
      )}
    </form>
  );
}
