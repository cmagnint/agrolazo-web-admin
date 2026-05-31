import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const baseClass =
  "mt-2 min-h-11 w-full rounded-2xl border border-[color-mix(in_srgb,var(--color-border)_82%,white)] bg-[rgb(255_253_247_/_82%)] px-4 text-base font-medium text-[var(--color-text)] shadow-[inset_0_1px_0_rgb(255_255_255_/_72%)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-soft)] hover:border-[color-mix(in_srgb,var(--color-primary)_22%,white)] focus:border-[color-mix(in_srgb,var(--color-primary)_58%,white)] focus:bg-[var(--color-cream)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-sky)_22%,transparent)]";

export function Input({ className, ...props }: InputProps) {
  const classes = [baseClass, className ?? ""].filter(Boolean).join(" ");

  return <input className={classes} {...props} />;
}