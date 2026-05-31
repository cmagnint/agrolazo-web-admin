import Link from "next/link";

import { Table, type TableColumn } from "@/components/ui/Table";
import type { Permission } from "@/lib/api/types";

import { DeletePermissionButton } from "./DeletePermissionButton";

type PermissionsPanelProps = {
  permissions: Permission[];
};

const linkClass =
  "inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-cream)] px-3 text-sm font-bold text-[var(--color-text)] transition hover:bg-[var(--color-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]";

export function PermissionsPanel({ permissions }: PermissionsPanelProps) {
  const columns: TableColumn<Permission>[] = [
    {
      key: "name",
      header: "Nombre",
      cell: (permission) => <span className="font-semibold">{permission.name}</span>,
    },
    {
      key: "description",
      header: "Descripción",
      cell: (permission) => permission.description ?? "Sin descripción",
    },
    {
      key: "actions",
      header: "Acciones",
      className: "w-56",
      cell: (permission) => (
        <div className="flex flex-wrap items-center gap-2">
          <Link className={linkClass} href={`/users/permissions/${permission.id}/edit`}>
            Editar
          </Link>
          <DeletePermissionButton
            permissionId={permission.id}
            permissionName={permission.name}
          />
        </div>
      ),
    },
  ];

  return (
    <section className="space-y-5" aria-labelledby="permissions-panel-title">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="permissions-panel-title" className="text-xl font-black tracking-normal">
            Permisos
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Permisos disponibles para asociar a roles.
          </p>
        </div>
        <Link className={linkClass} href="/users/permissions/new">
          Crear permiso
        </Link>
      </div>

      <Table
        columns={columns}
        emptyMessage="Sin permisos registrados."
        getRowKey={(permission) => permission.id}
        rows={permissions}
      />
    </section>
  );
}
