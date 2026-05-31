import { notFound } from "next/navigation";

import { updatePermission } from "@/features/users/actions";
import { PermissionForm } from "@/features/users/components/PermissionForm";
import { getPermissionById } from "@/features/users/queries";
import { createInitialPermissionState } from "@/features/users/schemas";

type EditPermissionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPermissionPage({ params }: EditPermissionPageProps) {
  const { id } = await params;
  const permission = await getPermissionById(id);

  if (!permission) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section aria-labelledby="edit-permission-title">
        <p className="text-sm font-semibold text-[var(--color-primary)]">Permisos</p>
        <h1 id="edit-permission-title" className="mt-2 text-3xl font-bold tracking-normal">
          Editar permiso
        </h1>
        <p className="mt-2 text-base text-[var(--color-text-muted)]">
          Actualiza el nombre y la descripción del permiso.
        </p>
      </section>

      <PermissionForm
        action={updatePermission}
        initialState={createInitialPermissionState(permission)}
        mode="edit"
      />
    </div>
  );
}
