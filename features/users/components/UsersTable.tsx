import Link from "next/link";

import { Table, type TableColumn } from "@/components/ui/Table";
import type { UserListItem, UserListItemRole } from "@/lib/api/types";

import { DeleteUserButton } from "./DeleteUserButton";

type UsersTableProps = {
  users: UserListItem[];
};

const maxVisibleRoles = 3;
const linkClass =
  "inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-cream)] px-3 text-sm font-bold text-[var(--color-text)] transition hover:bg-[var(--color-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]";

export function UsersTable({ users }: UsersTableProps) {
  const columns: TableColumn<UserListItem>[] = [
    {
      key: "name",
      header: "Nombre",
      cell: (user) => <span className="font-semibold">{user.name}</span>,
    },
    {
      key: "email",
      header: "Email",
      cell: (user) => user.email,
    },
    {
      key: "roles",
      header: "Roles",
      cell: (user) => <RoleBadges roles={user.roles} />,
    },
    {
      key: "actions",
      header: "Acciones",
      className: "w-72",
      cell: (user) => (
        <div className="flex flex-wrap items-center gap-2">
          <Link className={linkClass} href={`/users/${user.id}/detalle`}>
            Detalle
          </Link>
          <Link className={linkClass} href={`/users/${user.id}/edit`}>
            Editar
          </Link>
          <DeleteUserButton userEmail={user.email} userId={user.id} userName={user.name} />
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      emptyMessage="Sin usuarios registrados."
      getRowKey={(user) => user.id}
      rows={users}
    />
  );
}

function RoleBadges({ roles }: { roles: UserListItemRole[] }) {
  if (roles.length === 0) {
    return <span className="text-sm font-semibold text-[var(--color-text-muted)]">Sin roles</span>;
  }

  const visibleRoles = roles.slice(0, maxVisibleRoles);
  const hiddenCount = roles.length - visibleRoles.length;

  return (
    <div className="flex flex-wrap gap-2">
      {visibleRoles.map((role) => (
        <span
          className="inline-flex min-h-8 items-center rounded-full border border-[color-mix(in_srgb,var(--color-primary)_24%,white)] bg-[var(--color-primary-soft)] px-3 text-xs font-black text-[var(--color-primary)]"
          key={role.id}
        >
          {role.name}
        </span>
      ))}
      {hiddenCount > 0 ? (
        <span className="inline-flex min-h-8 items-center rounded-full border border-[color-mix(in_srgb,var(--color-border)_82%,white)] bg-[rgb(255_253_247_/_78%)] px-3 text-xs font-black text-[var(--color-text-muted)]">
          +{hiddenCount}
        </span>
      ) : null}
    </div>
  );
}
