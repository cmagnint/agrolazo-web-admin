import { createUserRole } from "@/features/users/actions";
import { UserRoleForm } from "@/features/users/components/UserRoleForm";
import { getRoles, getUsers } from "@/features/users/queries";
import { createInitialUserRoleState } from "@/features/users/schemas";

export default async function NewUserRolePage() {
  const [users, roles] = await Promise.all([getUsers(), getRoles()]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section aria-labelledby="new-user-role-title">
        <p className="text-sm font-semibold text-[var(--color-primary)]">Asignaciones</p>
        <h1 id="new-user-role-title" className="mt-2 text-3xl font-bold tracking-normal">
          Nueva asignación de rol
        </h1>
        <p className="mt-2 text-base text-[var(--color-text-muted)]">
          Selecciona un usuario operativo y un rol existente.
        </p>
      </section>

      <UserRoleForm
        action={createUserRole}
        initialState={createInitialUserRoleState()}
        roles={roles}
        users={users}
      />
    </div>
  );
}
