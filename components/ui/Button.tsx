import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "danger" | "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  fullWidth?: boolean;
  variant?: ButtonVariant;
};

const baseClass =
  "inline-flex min-h-11 items-center justify-center rounded-2xl px-4 text-sm font-black tracking-[-0.01em] transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const variantClasses: Record<ButtonVariant, string> = {
  danger:
    "border border-[var(--color-error)] bg-[var(--color-error)] text-[var(--color-primary-foreground)] shadow-[0_12px_24px_rgb(181_82_67_/_18%)] hover:-translate-y-0.5 hover:bg-[color-mix(in_srgb,var(--color-error)_88%,black)] hover:shadow-[0_16px_30px_rgb(181_82_67_/_22%)] focus-visible:outline-[var(--color-error)]",
  primary:
    "border border-[color-mix(in_srgb,var(--color-primary)_82%,black)] bg-[linear-gradient(135deg,var(--color-primary),color-mix(in_srgb,var(--color-primary)_82%,var(--color-aqua)))] text-[var(--color-primary-foreground)] shadow-[0_12px_26px_rgb(60_113_63_/_20%)] hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgb(60_113_63_/_24%)] focus-visible:outline-[var(--color-primary)]",
  secondary:
    "border border-[color-mix(in_srgb,var(--color-border)_82%,white)] bg-[rgb(255_253_247_/_76%)] text-[var(--color-text)] shadow-[0_8px_20px_rgb(38_57_41_/_6%)] hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--color-primary)_26%,white)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)] focus-visible:outline-[var(--color-primary)]",
};

export function Button({
  className,
  fullWidth = false,
  variant = "primary",
  ...props
}: ButtonProps) {
  const classes = [
    baseClass,
    variantClasses[variant],
    fullWidth ? "w-full" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return <button className={classes} {...props} />;
}