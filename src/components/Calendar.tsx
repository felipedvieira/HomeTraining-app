"use client";

import { useMemo, useState } from "react";

export interface CalendarMark {
  date: string; // ISO timestamp
  status: "completed" | "skipped";
  emoji: string;
}

const WEEKDAY_LABELS = ["D", "S", "T", "Q", "Q", "S", "S"];
const MONTH_LABELS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function dateKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function Calendar({ marks }: { marks: CalendarMark[] }) {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const markByDay = useMemo(() => {
    const map = new Map<string, CalendarMark>();
    for (const mark of marks) {
      const d = new Date(mark.date);
      const key = dateKey(d);
      // completed tem prioridade visual se por algum motivo houver dois registros no mesmo dia
      if (mark.status === "completed" || !map.has(key)) map.set(key, mark);
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

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => setCursor(new Date(year, month - 1, 1))}
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
          onClick={() => setCursor(new Date(year, month + 1, 1))}
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
          const mark = markByDay.get(key);
          const isToday = dateKey(today) === key;
          return (
            <div
              key={i}
              className={`relative aspect-square flex items-center justify-center rounded-lg text-xs ${
                mark?.status === "completed"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : mark?.status === "skipped"
                    ? "bg-danger/25 text-danger"
                    : "bg-surface-2 text-muted"
              } ${isToday ? "ring-1 ring-primary" : ""}`}
            >
              {day}
              {mark && (
                <span className="absolute -top-1.5 -right-1.5 text-[11px] leading-none">
                  {mark.emoji}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-3 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-primary inline-block" /> Concluído
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-danger/25 inline-block" /> Pulado
        </span>
      </div>
    </div>
  );
}
