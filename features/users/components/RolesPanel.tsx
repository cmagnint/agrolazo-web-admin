import Link from "next/link";

import { Table, type TableColumn } from "@/components/ui/Table";
import type { Role } from "@/lib/api/types";

import { DeleteRoleButton } from "./DeleteRoleButton";

type RolesPanelProps = {
  roles: Role[];
};

const linkClass =
  "inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-cream)] px-3 text-sm font-bold text-[var(--color-text)] transition hover:bg-[var(--color-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]";

export function RolesPanel({ roles }: RolesPanelProps) {
  const columns: TableColumn<Role>[] = [
    {
      key: "name",
      header: "Nombre",
      cell: (role) => <span className="font-semibold">{role.name}</span>,
    },
    {
      key: "description",
      header: "Descripción",
      cell: (role) => role.description ?? "Sin descripción",
    },
    {
      key: "actions",
      header: "Acciones",
      className: "w-56",
      cell: (role) => (
        <div className="flex flex-wrap items-center gap-2">
          <Link className={linkClass} href={`/users/roles/${role.id}/edit`}>
            Editar
          </Link>
          <DeleteRoleButton roleId={role.id} roleName={role.name} />
        </div>
      ),
    },
  ];

  return (
    <section className="space-y-5" aria-labelledby="roles-panel-title">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="roles-panel-title" className="text-xl font-black tracking-normal">
            Roles
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Roles disponibles para usuarios operativos.
          </p>
        </div>
        <Link className={linkClass} href="/users/roles/new">
          Crear rol
        </Link>
      </div>

      <Table
        columns={columns}
        emptyMessage="Sin roles registrados."
        getRowKey={(role) => role.id}
        rows={roles}
      />
    </section>
  );
}
