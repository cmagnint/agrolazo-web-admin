import { createUser } from "@/features/users/actions";
import { UserForm } from "@/features/users/components/UserForm";
import { createInitialUserState } from "@/features/users/schemas";

export default function NewUserPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section aria-labelledby="new-user-title">
        <p className="text-sm font-semibold text-[var(--color-primary)]">Usuarios</p>
        <h1 id="new-user-title" className="mt-2 text-3xl font-bold tracking-normal">
          Nuevo usuario
        </h1>
        <p className="mt-2 text-base text-[var(--color-text-muted)]">
          Crea un usuario operativo con nombre, email y contraseña.
        </p>
      </section>

      <UserForm action={createUser} initialState={createInitialUserState()} mode="create" />
    </div>
  );
}
