import { UserDetailView } from "@/features/users/components/UserDetailView";
import { composeUserDetail } from "@/features/users/queries";

type UserDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;
  const detail = await composeUserDetail(id);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section aria-labelledby="user-detail-page-title">
        <p className="text-sm font-semibold text-[var(--color-primary)]">Usuarios</p>
        <h1 id="user-detail-page-title" className="mt-2 text-3xl font-bold tracking-normal">
          Detalle de usuario
        </h1>
        <p className="mt-2 text-base text-[var(--color-text-muted)]">
          Revisa roles asignados y permisos heredados.
        </p>
      </section>

      <UserDetailView
        inheritedPermissions={detail.inheritedPermissions}
        roles={detail.roles}
        user={detail.user}
      />
    </div>
  );
}
