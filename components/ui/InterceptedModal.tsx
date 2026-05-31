"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

type InterceptedModalProps = {
  children: ReactNode;
  title?: string;
};

export function InterceptedModal({ children, title }: InterceptedModalProps) {
  const router = useRouter();

  function close() {
    router.back();
  }

  function closeOnBackdrop(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      close();
    }
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[rgb(23_33_26_/_48%)] px-4 py-6 backdrop-blur-sm sm:py-10"
      onClick={closeOnBackdrop}
      role="dialog"
    >
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-[color-mix(in_srgb,var(--color-border)_72%,white)] bg-[rgb(255_253_247_/_98%)] text-[var(--color-text)] shadow-[0_24px_80px_rgb(23_33_26_/_24%)]">
        <div className="flex items-center justify-between gap-4 border-b border-[color-mix(in_srgb,var(--color-border)_72%,white)] bg-[linear-gradient(135deg,rgb(228_241_223_/_84%),rgb(221_243_246_/_68%))] px-5 py-4">
          {title ? (
            <h2 className="text-lg font-black tracking-normal">{title}</h2>
          ) : (
            <span aria-hidden="true" />
          )}

          <button
            aria-label="Cerrar"
            className="inline-flex size-10 items-center justify-center rounded-2xl border border-[color-mix(in_srgb,var(--color-border)_82%,white)] bg-[rgb(255_253_247_/_78%)] text-[var(--color-text)] transition hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            onClick={close}
            type="button"
          >
            <X aria-hidden="true" size={18} strokeWidth={2.5} />
          </button>
        </div>

        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
