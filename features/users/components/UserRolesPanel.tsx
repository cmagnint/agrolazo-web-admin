import Link from "next/link";

import { Table, type TableColumn } from "@/components/ui/Table";

import type { UserRoleDisplayRow } from "../queries";
import { DeleteUserRoleButton } from "./DeleteUserRoleButton";

type UserRolesPanelProps = {
  rows: UserRoleDisplayRow[];
};

const linkClass =
  "inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-cream)] px-3 text-sm font-bold text-[var(--color-text)] transition hover:bg-[var(--color-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]";

export function UserRolesPanel({ rows }: UserRolesPanelProps) {
  const columns: TableColumn<UserRoleDisplayRow>[] = [
    {
      key: "user",
      header: "Usuario",
      cell: (row) => (
        <div>
          <p className="font-semibold">{row.userName}</p>
          <p className="mt-1 break-words text-xs text-[var(--color-text-muted)]">
            {row.userEmail}
          </p>
        </div>
      ),
    },
    {
      key: "role",
      header: "Rol",
      cell: (row) => <span className="font-semibold">{row.roleName}</span>,
    },
    {
      key: "actions",
      header: "Acciones",
      className: "w-40",
      cell: (row) => (
        <DeleteUserRoleButton
          roleId={row.roleId}
          roleName={row.roleName}
          userId={row.userId}
          userName={row.userName}
        />
      ),
    },
  ];

  return (
    <section className="space-y-5" aria-labelledby="user-roles-panel-title">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="user-roles-panel-title" className="text-xl font-black tracking-normal">
            Asignaciones de rol
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Relaciones entre usuarios operativos y roles.
          </p>
        </div>
        <Link className={linkClass} href="/users/asignar-roles/new">
          Crear asignación
        </Link>
      </div>

      <Table
        columns={columns}
        emptyMessage="Sin asignaciones de roles registradas."
        getRowKey={(row) => `${row.userId}-${row.roleId}`}
        rows={rows}
      />
    </section>
  );
}
