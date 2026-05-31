import { InterceptedModal } from "@/components/ui/InterceptedModal";
import { UserDetailView } from "@/features/users/components/UserDetailView";
import { composeUserDetail } from "@/features/users/queries";

type UserDetailModalPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UserDetailModalPage({ params }: UserDetailModalPageProps) {
  const { id } = await params;
  const detail = await composeUserDetail(id);

  return (
    <InterceptedModal title="Detalle de usuario">
      <div className="mx-auto max-w-5xl space-y-6">
        <section aria-labelledby="user-detail-modal-title">
          <p className="text-sm font-semibold text-[var(--color-primary)]">Usuarios</p>
          <h1 id="user-detail-modal-title" className="mt-2 text-3xl font-bold tracking-normal">
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
    </InterceptedModal>
  );
}
