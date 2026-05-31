import { InterceptedModal } from "@/components/ui/InterceptedModal";
import { UserRolesPanel } from "@/features/users/components/UserRolesPanel";
import { getUserRoleRelations } from "@/features/users/queries";

export default async function UserRolesModalPage() {
  const rows = await getUserRoleRelations();

  return (
    <InterceptedModal title="Asignaciones de rol">
      <div className="mx-auto max-w-6xl space-y-6">
        <section aria-labelledby="user-roles-modal-title">
          <p className="text-sm font-semibold text-[var(--color-primary)]">Usuarios</p>
          <h1 id="user-roles-modal-title" className="mt-2 text-3xl font-bold tracking-normal">
            Ver asignaciones de rol
          </h1>
          <p className="mt-2 text-base text-[var(--color-text-muted)]">
            Gestiona las relaciones entre usuarios operativos y roles.
          </p>
        </section>

        <UserRolesPanel rows={rows} />
      </div>
    </InterceptedModal>
  );
}
