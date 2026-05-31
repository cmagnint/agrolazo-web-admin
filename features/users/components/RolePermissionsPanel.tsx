import Link from "next/link";

import { Table, type TableColumn } from "@/components/ui/Table";

import type { RolePermissionDisplayRow } from "../queries";
import { DeleteRolePermissionButton } from "./DeleteRolePermissionButton";

type RolePermissionsPanelProps = {
  rows: RolePermissionDisplayRow[];
};

const linkClass =
  "inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-cream)] px-3 text-sm font-bold text-[var(--color-text)] transition hover:bg-[var(--color-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]";

export function RolePermissionsPanel({ rows }: RolePermissionsPanelProps) {
  const columns: TableColumn<RolePermissionDisplayRow>[] = [
    {
      key: "role",
      header: "Rol",
      cell: (row) => <span className="font-semibold">{row.roleName}</span>,
    },
    {
      key: "permission",
      header: "Permiso",
      cell: (row) => <span className="font-semibold">{row.permissionName}</span>,
    },
    {
      key: "actions",
      header: "Acciones",
      className: "w-40",
      cell: (row) => (
        <DeleteRolePermissionButton
          permissionId={row.permissionId}
          permissionName={row.permissionName}
          roleId={row.roleId}
          roleName={row.roleName}
        />
      ),
    },
  ];

  return (
    <section className="space-y-5" aria-labelledby="role-permissions-panel-title">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="role-permissions-panel-title" className="text-xl font-black tracking-normal">
            Asignaciones de permiso
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Relaciones entre roles y permisos.
          </p>
        </div>
        <Link className={linkClass} href="/users/asignar-permisos/new">
          Crear asignación
        </Link>
      </div>

      <Table
        columns={columns}
        emptyMessage="Sin asignaciones de permisos registradas."
        getRowKey={(row) => `${row.roleId}-${row.permissionId}`}
        rows={rows}
      />
    </section>
  );
}
