"use client";

import { useActionState } from "react";
import type { InputHTMLAttributes } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import type { RoleActionState, RoleFormValues } from "../schemas";

type RoleFormMode = "create" | "edit";

type RoleFormProps = {
  action: (previousState: RoleActionState, formData: FormData) => Promise<RoleActionState>;
  initialState: RoleActionState;
  mode: RoleFormMode;
};

export function RoleForm({ action, initialState, mode }: RoleFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const values = state.values;
  const isEdit = mode === "edit";

  return (
    <section
      className="rounded-lg border border-[var(--color-border)] bg-[var(--color-cream)] p-6 shadow-[0_16px_48px_rgb(30_36_31_/_8%)]"
      aria-labelledby="role-form-title"
    >
      <div className="flex flex-col gap-1">
        <h2 id="role-form-title" className="text-lg font-bold tracking-normal">
          {isEdit ? "Editar rol" : "Nuevo rol"}
        </h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          {isEdit ? "Actualiza los datos del rol." : "Crea un rol para el administrador autenticado."}
        </p>
      </div>

      {state.formError ? (
        <div
          className="mt-5 rounded-md border border-[var(--color-error)] bg-[color-mix(in_srgb,var(--color-error)_10%,white)] px-4 py-3 text-sm font-medium text-[var(--color-error)]"
          role="alert"
        >
          {state.formError}
        </div>
      ) : null}

      <form action={formAction} className="mt-6 space-y-5" noValidate>
        {isEdit ? <input type="hidden" name="id" defaultValue={values.id} /> : null}

        {isEdit ? <ReadOnlyField label="ID" value={values.id} /> : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            autoComplete="off"
            error={state.fieldErrors.name}
            label="Nombre"
            name="name"
            value={values.name}
          />
          <TextField
            autoComplete="off"
            error={state.fieldErrors.description}
            label="Descripción"
            name="description"
            value={values.description}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={pending}>
            {pending ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear rol"}
          </Button>
        </div>
      </form>
    </section>
  );
}

function TextField({
  error,
  label,
  name,
  value,
  ...props
}: {
  error?: string;
  label: string;
  name: keyof Pick<RoleFormValues, "description" | "name">;
  value: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "defaultValue" | "id" | "name">) {
  const errorId = `${name}-error`;

  return (
    <div>
      <label className="block text-sm font-semibold" htmlFor={name}>
        {label}
      </label>
      <Input
        id={name}
        name={name}
        defaultValue={value}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? "true" : "false"}
        {...props}
      />
      {error ? (
        <p className="mt-2 text-sm text-[var(--color-error)]" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-[var(--color-border)] pt-3">
      <p className="text-sm font-semibold text-[var(--color-text-muted)]">{label}</p>
      <p className="mt-1 break-words text-base font-semibold">{value}</p>
    </div>
  );
}
