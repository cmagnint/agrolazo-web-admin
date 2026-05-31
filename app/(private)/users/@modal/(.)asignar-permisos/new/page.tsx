import { InterceptedModal } from "@/components/ui/InterceptedModal";
import { createRolePermission } from "@/features/users/actions";
import { RolePermissionForm } from "@/features/users/components/RolePermissionForm";
import { getPermissions, getRoles } from "@/features/users/queries";
import { createInitialRolePermissionState } from "@/features/users/schemas";

export default async function NewRolePermissionModalPage() {
  const [roles, permissions] = await Promise.all([getRoles(), getPermissions()]);

  return (
    <InterceptedModal title="Nueva asignación de permiso">
      <div className="mx-auto max-w-4xl space-y-6">
        <section aria-labelledby="new-role-permission-modal-title">
          <p className="text-sm font-semibold text-[var(--color-primary)]">Asignaciones</p>
          <h1
            id="new-role-permission-modal-title"
            className="mt-2 text-3xl font-bold tracking-normal"
          >
            Nueva asignación de permiso
          </h1>
          <p className="mt-2 text-base text-[var(--color-text-muted)]">
            Selecciona un rol y un permiso existente.
          </p>
        </section>

        <RolePermissionForm
          action={createRolePermission}
          initialState={createInitialRolePermissionState()}
          permissions={permissions}
          roles={roles}
        />
      </div>
    </InterceptedModal>
  );
}
