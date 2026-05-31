import { createPermission } from "@/features/users/actions";
import { PermissionForm } from "@/features/users/components/PermissionForm";
import { createInitialPermissionState } from "@/features/users/schemas";

export default function NewPermissionPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section aria-labelledby="new-permission-title">
        <p className="text-sm font-semibold text-[var(--color-primary)]">Permisos</p>
        <h1 id="new-permission-title" className="mt-2 text-3xl font-bold tracking-normal">
          Nuevo permiso
        </h1>
        <p className="mt-2 text-base text-[var(--color-text-muted)]">
          Crea un permiso con nombre y descripción opcional.
        </p>
      </section>

      <PermissionForm
        action={createPermission}
        initialState={createInitialPermissionState()}
        mode="create"
      />
    </div>
  );
}
