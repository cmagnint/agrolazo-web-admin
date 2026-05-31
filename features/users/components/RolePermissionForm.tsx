"use client";

import { useActionState, type ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import type { Permission, Role } from "@/lib/api/types";

import type { RolePermissionActionState, RolePermissionFormValues } from "../schemas";

type RolePermissionFormProps = {
  action: (
    previousState: RolePermissionActionState,
    formData: FormData,
  ) => Promise<RolePermissionActionState>;
  initialState: RolePermissionActionState;
  permissions: Permission[];
  roles: Role[];
};

const selectClass =
  "mt-2 min-h-11 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-cream)] px-3 text-sm text-[var(--color-text)] shadow-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-primary)_20%,transparent)] disabled:cursor-not-allowed disabled:opacity-60";

export function RolePermissionForm({
  action,
  initialState,
  permissions,
  roles,
}: RolePermissionFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const hasRoles = roles.length > 0;
  const hasPermissions = permissions.length > 0;
  const submitDisabled = pending || !hasRoles || !hasPermissions;

  return (
    <section
      className="rounded-lg border border-[var(--color-border)] bg-[var(--color-cream)] p-6 shadow-[0_16px_48px_rgb(30_36_31_/_8%)]"
      aria-labelledby="role-permission-form-title"
    >
      <div className="flex flex-col gap-1">
        <h2 id="role-permission-form-title" className="text-lg font-bold tracking-normal">
          Nueva asignación de permiso
        </h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Asocia un rol existente con un permiso.
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

          <SelectField
            disabled={!hasPermissions}
            emptyMessage={hasPermissions ? null : "No hay permisos disponibles para asignar."}
            error={state.fieldErrors.permissionId}
            label="Permiso"
            name="permissionId"
            value={state.values.permissionId}
          >
            <option value="">Selecciona un permiso</option>
            {permissions.map((permission) => (
              <option key={permission.id} value={permission.id}>
                {permission.name} - {permission.id}
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
  name: keyof RolePermissionFormValues;
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
