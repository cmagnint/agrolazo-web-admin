import { notFound } from "next/navigation";

import { updateUser } from "@/features/users/actions";
import { UserForm } from "@/features/users/components/UserForm";
import { getUserById } from "@/features/users/queries";
import { createInitialUserState } from "@/features/users/schemas";

type EditUserPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section aria-labelledby="edit-user-title">
        <p className="text-sm font-semibold text-[var(--color-primary)]">Usuarios</p>
        <h1 id="edit-user-title" className="mt-2 text-3xl font-bold tracking-normal">
          Editar usuario
        </h1>
        <p className="mt-2 text-base text-[var(--color-text-muted)]">
          Actualiza nombre, email y contraseña del usuario operativo.
        </p>
      </section>

      <UserForm
        action={updateUser}
        initialState={createInitialUserState(user)}
        mode="edit"
      />
    </div>
  );
}
