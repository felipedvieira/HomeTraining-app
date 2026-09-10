"use client";

import { useMemo, useState } from "react";

export interface CalendarMark {
  date: string; // ISO timestamp
  status: "completed" | "skipped" | "cardio_only";
  emoji: string;
  label: string;
}

const STATUS_TEXT: Record<CalendarMark["status"], string> = {
  completed: "Concluído",
  skipped: "Pulado",
  cardio_only: "Só cardio (no lugar da ficha)",
};

const WEEKDAY_LABELS = ["D", "S", "T", "Q", "Q", "S", "S"];
const MONTH_LABELS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function dateKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function cellTint(marks: CalendarMark[]): string {
  if (marks.some((m) => m.status === "completed")) return "bg-primary text-primary-foreground font-semibold";
  if (marks.some((m) => m.status === "cardio_only")) return "bg-accent/25 text-accent";
  if (marks.some((m) => m.status === "skipped")) return "bg-danger/25 text-danger";
  return "bg-surface-2 text-muted";
}

export function Calendar({ marks }: { marks: CalendarMark[] }) {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const markByDay = useMemo(() => {
    const map = new Map<string, CalendarMark[]>();
    for (const mark of marks) {
      const key = dateKey(new Date(mark.date));
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(mark);
    }
    return map;
  }, [marks]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const selectedMarks = selectedKey ? (markByDay.get(selectedKey) ?? []) : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => {
            setCursor(new Date(year, month - 1, 1));
            setSelectedKey(null);
          }}
          className="text-muted hover:text-foreground px-2"
          aria-label="Mês anterior"
        >
          ‹
        </button>
        <p className="font-semibold text-sm">
          {MONTH_LABELS[month]} {year}
        </p>
        <button
          type="button"
          onClick={() => {
            setCursor(new Date(year, month + 1, 1));
            setSelectedKey(null);
          }}
          className="text-muted hover:text-foreground px-2"
          aria-label="Próximo mês"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAY_LABELS.map((w, i) => (
          <div key={i} className="text-[11px] text-muted py-1">
            {w}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;
          const key = `${year}-${month}-${day}`;
          const dayMarks = markByDay.get(key) ?? [];
          const isToday = dateKey(today) === key;
          const isSelected = selectedKey === key;
          return (
            <button
              type="button"
              key={i}
              onClick={() => dayMarks.length > 0 && setSelectedKey(isSelected ? null : key)}
              className={`relative aspect-square flex flex-col items-center justify-center rounded-lg text-xs ${cellTint(dayMarks)} ${
                isToday ? "ring-1 ring-primary" : ""
              } ${isSelected ? "ring-2 ring-foreground" : ""} ${dayMarks.length > 0 ? "cursor-pointer" : "cursor-default"}`}
            >
              {day}
              {dayMarks.length > 0 && (
                <span className="flex gap-0.5 leading-none mt-0.5">
                  {dayMarks.slice(0, 3).map((m, mi) => (
                    <span key={mi} className="text-[9px]">
                      {m.emoji}
                    </span>
                  ))}
                  {dayMarks.length > 3 && <span className="text-[9px]">+{dayMarks.length - 3}</span>}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-3 text-xs text-muted flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-primary inline-block" /> Concluído
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-accent/25 inline-block" /> Só cardio
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-danger/25 inline-block" /> Pulado
        </span>
      </div>

      {selectedKey && (
        <div className="mt-4 bg-surface-2 border border-border rounded-xl p-3 space-y-2">
          <p className="text-xs uppercase tracking-wide text-muted">
            {(() => {
              const [selYear, selMonth, selDay] = selectedKey.split("-").map(Number);
              return `${String(selDay).padStart(2, "0")}/${String(selMonth + 1).padStart(2, "0")}/${selYear}`;
            })()}
          </p>
          {selectedMarks.map((m, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span>{m.emoji}</span>
              <span className="flex-1">{m.label}</span>
              <span className="text-xs text-muted">{STATUS_TEXT[m.status]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
