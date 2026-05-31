"use client";

import { useRef, useState } from "react";
import type { ReactNode } from "react";

type ModalStep = "review" | "confirm";

type ModalProps = {
  children: ReactNode;
  description: string;
  title: string;
  triggerLabel: string;
};

const secondaryButtonClass =
  "inline-flex min-h-11 items-center justify-center rounded-2xl border border-[color-mix(in_srgb,var(--color-border)_82%,white)] bg-[rgb(255_253_247_/_82%)] px-4 text-sm font-black text-[var(--color-text)] shadow-[0_8px_20px_rgb(38_57_41_/_6%)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]";

const dangerButtonClass =
  "inline-flex min-h-10 items-center justify-center rounded-2xl border border-[color-mix(in_srgb,var(--color-error)_52%,white)] bg-[var(--color-error-soft)] px-3 text-sm font-black text-[var(--color-error)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--color-error)] hover:bg-[color-mix(in_srgb,var(--color-error)_14%,white)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-error)]";

export function Modal({ children, description, title, triggerLabel }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState<ModalStep>("review");

  function openDialog() {
    setStep("review");
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
    setStep("review");
  }

  return (
    <>
      <button className={dangerButtonClass} type="button" onClick={openDialog}>
        {triggerLabel}
      </button>

      <dialog
        ref={dialogRef}
        className="w-[min(92vw,480px)] overflow-hidden rounded-3xl border border-[color-mix(in_srgb,var(--color-border)_72%,white)] bg-[rgb(255_253_247_/_94%)] p-0 text-[var(--color-text)] shadow-[0_24px_80px_rgb(23_33_26_/_22%)] backdrop:bg-[rgb(23_33_26_/_46%)] backdrop:backdrop-blur-sm"
        onClose={() => setStep("review")}
      >
        <div className="bg-[linear-gradient(135deg,rgb(228_241_223_/_72%),rgb(221_243_246_/_58%))] px-6 py-5">
          <p className="text-xs font-black uppercase tracking-[0.13em] text-[var(--color-text-soft)]">
            Confirmación
          </p>

          <h2 className="mt-1 text-xl font-black tracking-[-0.03em]">
            {title}
          </h2>
        </div>

        <div className="p-6">
          <p className="text-sm leading-6 text-[var(--color-text-muted)]">
            {description}
          </p>

          {step === "review" ? (
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button className={secondaryButtonClass} type="button" onClick={closeDialog}>
                Cancelar
              </button>

              <button className={dangerButtonClass} type="button" onClick={() => setStep("confirm")}>
                Continuar
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <p className="rounded-2xl border border-[color-mix(in_srgb,var(--color-error)_42%,white)] bg-[var(--color-error-soft)] px-4 py-3 text-sm font-bold leading-6 text-[var(--color-error)]">
                Confirma definitivamente esta eliminación.
              </p>

              {children}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button className={secondaryButtonClass} type="button" onClick={closeDialog}>
                  Cancelar
                </button>

                <button className={secondaryButtonClass} type="button" onClick={() => setStep("review")}>
                  Volver
                </button>
              </div>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}