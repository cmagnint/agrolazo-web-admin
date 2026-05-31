import { InterceptedModal } from "@/components/ui/InterceptedModal";
import { PermissionsPanel } from "@/features/users/components/PermissionsPanel";
import { getPermissions } from "@/features/users/queries";

export default async function PermissionsModalPage() {
  const permissions = await getPermissions();

  return (
    <InterceptedModal title="Gestionar permisos">
      <div className="mx-auto max-w-6xl space-y-6">
        <section aria-labelledby="permissions-modal-title">
          <p className="text-sm font-semibold text-[var(--color-primary)]">Usuarios</p>
          <h1 id="permissions-modal-title" className="mt-2 text-3xl font-bold tracking-normal">
            Gestionar permisos
          </h1>
          <p className="mt-2 text-base text-[var(--color-text-muted)]">
            Administra los permisos disponibles para asociar a roles.
          </p>
        </section>

        <PermissionsPanel permissions={permissions} />
      </div>
    </InterceptedModal>
  );
}
