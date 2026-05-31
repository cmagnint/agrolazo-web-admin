import type { Permission, Role, UserListItem } from "@/lib/api/types";

type UserDetailViewProps = {
  inheritedPermissions: Permission[];
  roles: Role[];
  user: UserListItem | null;
};

const emptyValue = "No informado";

export function UserDetailView({ inheritedPermissions, roles, user }: UserDetailViewProps) {
  return (
    <section className="space-y-6" aria-labelledby="user-detail-title">
      <div>
        <h2 id="user-detail-title" className="text-xl font-black tracking-normal">
          Detalle de usuario
        </h2>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Roles asignados y permisos heredados por rol.
        </p>
      </div>

      <dl className="grid gap-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-cream)] p-6 sm:grid-cols-3">
        <DetailItem label="ID" value={user ? String(user.id) : emptyValue} />
        <DetailItem label="Nombre" value={user?.name ?? emptyValue} />
        <DetailItem label="Email" value={user?.email ?? emptyValue} />
      </dl>

      <ListSection
        emptyMessage="Sin roles asignados."
        items={roles}
        title="Roles asignados"
      />
      <ListSection
        emptyMessage="Sin permisos heredados."
        items={inheritedPermissions}
        title="Permisos heredados"
      />
    </section>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-[var(--color-border)] pt-3">
      <dt className="text-sm font-semibold text-[var(--color-text-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-base font-semibold">{value}</dd>
    </div>
  );
}

function ListSection<T extends Role | Permission>({
  emptyMessage,
  items,
  title,
}: {
  emptyMessage: string;
  items: T[];
  title: string;
}) {
  return (
    <section aria-labelledby={`${title}-title`} className="space-y-3">
      <h3 id={`${title}-title`} className="text-base font-black tracking-normal">
        {title}
      </h3>
      {items.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <li
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-cream)] p-4"
              key={item.id}
            >
              <p className="font-black">{item.name}</p>
              <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
                {item.description ?? "Sin descripción"}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-lg border border-[var(--color-border)] bg-[var(--color-cream)] p-4 text-sm font-semibold text-[var(--color-text-muted)]">
          {emptyMessage}
        </p>
      )}
    </section>
  );
}
