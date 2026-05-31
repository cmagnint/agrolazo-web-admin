import { createRole } from "@/features/users/actions";
import { RoleForm } from "@/features/users/components/RoleForm";
import { createInitialRoleState } from "@/features/users/schemas";

export default function NewRolePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section aria-labelledby="new-role-title">
        <p className="text-sm font-semibold text-[var(--color-primary)]">Roles</p>
        <h1 id="new-role-title" className="mt-2 text-3xl font-bold tracking-normal">
          Nuevo rol
        </h1>
        <p className="mt-2 text-base text-[var(--color-text-muted)]">
          Crea un rol con nombre y descripción opcional.
        </p>
      </section>

      <RoleForm action={createRole} initialState={createInitialRoleState()} mode="create" />
    </div>
  );
}
