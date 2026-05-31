import { UserRolesPanel } from "@/features/users/components/UserRolesPanel";
import { getUserRoleRelations } from "@/features/users/queries";

export default async function UserRolesPage() {
  const rows = await getUserRoleRelations();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section aria-labelledby="user-roles-title">
        <p className="text-sm font-semibold text-[var(--color-primary)]">Usuarios</p>
        <h1 id="user-roles-title" className="mt-2 text-3xl font-bold tracking-normal">
          Ver asignaciones de rol
        </h1>
        <p className="mt-2 text-base text-[var(--color-text-muted)]">
          Gestiona las relaciones entre usuarios operativos y roles.
        </p>
      </section>

      <UserRolesPanel rows={rows} />
    </div>
  );
}
