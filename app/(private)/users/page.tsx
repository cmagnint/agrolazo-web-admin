import Link from "next/link";

import { UsersTable } from "@/features/users/components/UsersTable";
import { getUsers } from "@/features/users/queries";

const primaryLinkClass =
  "inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--color-primary)] px-4 text-sm font-bold text-[var(--color-primary-foreground)] transition hover:bg-[var(--color-primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]";
const secondaryLinkClass =
  "inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-cream)] px-4 text-sm font-bold text-[var(--color-text)] transition hover:bg-[var(--color-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section
        className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
        aria-labelledby="users-title"
      >
        <div>
          <p className="text-sm font-semibold text-[var(--color-primary)]">Usuarios</p>
          <h1 id="users-title" className="mt-2 text-3xl font-bold tracking-normal">
            Usuarios
          </h1>
          <p className="mt-2 text-base text-[var(--color-text-muted)]">
            Gestiona usuarios, roles, permisos y asignaciones desde una sola vista.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <div className="flex flex-wrap gap-2">
            <Link className={primaryLinkClass} href="/users/new">
              Nuevo usuario
            </Link>
            <Link className={secondaryLinkClass} href="/users/roles">
              Gestionar roles
            </Link>
            <Link className={secondaryLinkClass} href="/users/permissions">
              Gestionar permisos
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link className={secondaryLinkClass} href="/users/asignar-roles">
              Ver asignaciones de rol
            </Link>
            <Link className={secondaryLinkClass} href="/users/asignar-permisos">
              Ver asignaciones de permiso
            </Link>
          </div>
        </div>
      </section>

      <UsersTable users={users} />
    </div>
  );
}
