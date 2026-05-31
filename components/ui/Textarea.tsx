import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

const baseClass =
  "mt-2 min-h-28 w-full resize-y rounded-2xl border border-[color-mix(in_srgb,var(--color-border)_82%,white)] bg-[rgb(255_253_247_/_82%)] px-4 py-3 text-base font-medium text-[var(--color-text)] shadow-[inset_0_1px_0_rgb(255_255_255_/_72%)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-soft)] hover:border-[color-mix(in_srgb,var(--color-primary)_22%,white)] focus:border-[color-mix(in_srgb,var(--color-primary)_58%,white)] focus:bg-[var(--color-cream)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-sky)_22%,transparent)]";

export function Textarea({ className, ...props }: TextareaProps) {
  const classes = [baseClass, className ?? ""].filter(Boolean).join(" ");

  return <textarea className={classes} {...props} />;
}