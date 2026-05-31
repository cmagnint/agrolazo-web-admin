import { notFound } from "next/navigation";

import { InterceptedModal } from "@/components/ui/InterceptedModal";
import { updateRole } from "@/features/users/actions";
import { RoleForm } from "@/features/users/components/RoleForm";
import { getRoleById } from "@/features/users/queries";
import { createInitialRoleState } from "@/features/users/schemas";

type EditRoleModalPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditRoleModalPage({ params }: EditRoleModalPageProps) {
  const { id } = await params;
  const role = await getRoleById(id);

  if (!role) {
    notFound();
  }

  return (
    <InterceptedModal title="Editar rol">
      <div className="mx-auto max-w-4xl space-y-6">
        <section aria-labelledby="edit-role-modal-title">
          <p className="text-sm font-semibold text-[var(--color-primary)]">Roles</p>
          <h1 id="edit-role-modal-title" className="mt-2 text-3xl font-bold tracking-normal">
            Editar rol
          </h1>
          <p className="mt-2 text-base text-[var(--color-text-muted)]">
            Actualiza el nombre y la descripción del rol.
          </p>
        </section>

        <RoleForm action={updateRole} initialState={createInitialRoleState(role)} mode="edit" />
      </div>
    </InterceptedModal>
  );
}
