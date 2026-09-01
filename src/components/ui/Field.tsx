import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

function Label({ children }: { children: ReactNode }) {
  return <label className="block text-sm font-medium text-muted mb-1.5">{children}</label>;
}

const fieldClasses =
  "w-full bg-surface-2 border border-border rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/60";

export function TextField({
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <input className={fieldClasses} {...props} />
    </div>
  );
}

export function SelectField({
  label,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string; children: ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      <select className={fieldClasses} {...props}>
        {children}
      </select>
    </div>
  );
}
