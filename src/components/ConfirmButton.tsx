"use client";

import type { ButtonHTMLAttributes } from "react";
import { Button } from "@/components/ui/Button";

export function ConfirmButton({
  confirmText,
  onClick,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  confirmText: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  return (
    <Button
      {...props}
      onClick={(e) => {
        if (!window.confirm(confirmText)) {
          e.preventDefault();
          return;
        }
        onClick?.(e);
      }}
    />
  );
}
