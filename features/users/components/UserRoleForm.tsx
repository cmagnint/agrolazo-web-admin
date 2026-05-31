"use client";

import { useActionState, type ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import type { Role, UserListItem } from "@/lib/api/types";

import type { UserRoleActionState, UserRoleFormValues } from "../schemas";

type UserRoleFormProps = {
  action: (previousState: UserRoleActionState, formData: FormData) => Promise<UserRoleActionState>;
  initialState: UserRoleActionState;
  roles: Role[];
  users: UserListItem[];
};

const selectClass =
  "mt-2 min-h-11 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-cream)] px-3 text-sm text-[var(--color-text)] shadow-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-primary)_20%,transparent)] disabled:cursor-not-allowed disabled:opacity-60";

export function UserRoleForm({ action, initialState, roles, users }: UserRoleFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const hasUsers = users.length > 0;
  const hasRoles = roles.length > 0;
  const submitDisabled = pending || !hasUsers || !hasRoles;

  return (
    <section
      className="rounded-lg border border-[var(--color-border)] bg-[var(--color-cream)] p-6 shadow-[0_16px_48px_rgb(30_36_31_/_8%)]"
      aria-labelledby="user-role-form-title"
    >
      <div className="flex flex-col gap-1">
        <h2 id="user-role-form-title" className="text-lg font-bold tracking-normal">
          Nueva asignación de rol
        </h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Asocia un usuario operativo con un rol existente.
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
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField
            disabled={!hasUsers}
            emptyMessage={hasUsers ? null : "No hay usuarios disponibles para asignar."}
            error={state.fieldErrors.userId}
            label="Usuario"
            name="userId"
            value={state.values.userId}
          >
            <option value="">Selecciona un usuario</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} - {user.email} - {user.id}
              </option>
            ))}
          </SelectField>

          <SelectField
            disabled={!hasRoles}
            emptyMessage={hasRoles ? null : "No hay roles disponibles para asignar."}
            error={state.fieldErrors.roleId}
            label="Rol"
            name="roleId"
            value={state.values.roleId}
          >
            <option value="">Selecciona un rol</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name} - {role.id}
              </option>
            ))}
          </SelectField>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={submitDisabled}>
            {pending ? "Guardando..." : "Crear asignación"}
          </Button>
        </div>
      </form>
    </section>
  );
}

function SelectField({
  children,
  disabled,
  emptyMessage,
  error,
  label,
  name,
  value,
}: {
  children: ReactNode;
  disabled: boolean;
  emptyMessage: string | null;
  error?: string;
  label: string;
  name: keyof UserRoleFormValues;
  value: string;
}) {
  const errorId = `${name}-error`;
  const emptyId = `${name}-empty`;
  const describedBy = [error ? errorId : null, emptyMessage ? emptyId : null]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div>
      <label className="block text-sm font-semibold" htmlFor={name}>
        {label}
      </label>
      <select
        aria-describedby={describedBy}
        aria-invalid={error ? "true" : "false"}
        className={selectClass}
        defaultValue={value}
        disabled={disabled}
        id={name}
        name={name}
      >
        {children}
      </select>
      {emptyMessage ? (
        <p className="mt-2 text-sm text-[var(--color-text-muted)]" id={emptyId}>
          {emptyMessage}
        </p>
      ) : null}
      {error ? (
        <p className="mt-2 text-sm text-[var(--color-error)]" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
