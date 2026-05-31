import { RolePermissionsPanel } from "@/features/users/components/RolePermissionsPanel";
import { getRolePermissionRelations } from "@/features/users/queries";

export default async function RolePermissionsPage() {
  const rows = await getRolePermissionRelations();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section aria-labelledby="role-permissions-title">
        <p className="text-sm font-semibold text-[var(--color-primary)]">Usuarios</p>
        <h1 id="role-permissions-title" className="mt-2 text-3xl font-bold tracking-normal">
          Ver asignaciones de permiso
        </h1>
        <p className="mt-2 text-base text-[var(--color-text-muted)]">
          Gestiona las relaciones entre roles y permisos.
        </p>
      </section>

      <RolePermissionsPanel rows={rows} />
    </div>
  );
}
