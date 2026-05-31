import { RolesPanel } from "@/features/users/components/RolesPanel";
import { getRoles } from "@/features/users/queries";

export default async function RolesPage() {
  const roles = await getRoles();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section aria-labelledby="roles-title">
        <p className="text-sm font-semibold text-[var(--color-primary)]">Usuarios</p>
        <h1 id="roles-title" className="mt-2 text-3xl font-bold tracking-normal">
          Gestionar roles
        </h1>
        <p className="mt-2 text-base text-[var(--color-text-muted)]">
          Administra los roles disponibles para usuarios operativos.
        </p>
      </section>

      <RolesPanel roles={roles} />
    </div>
  );
}
