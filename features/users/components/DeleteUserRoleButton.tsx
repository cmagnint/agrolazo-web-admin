"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

import { deleteUserRole } from "../actions";
import type { DeleteUserRoleActionState } from "../schemas";

type DeleteUserRoleButtonProps = {
  roleId: number;
  roleName: string;
  userId: number;
  userName: string;
};

const initialState: DeleteUserRoleActionState = {
  ok: false,
  fieldErrors: {},
  formError: null,
};

export function DeleteUserRoleButton({
  roleId,
  roleName,
  userId,
  userName,
}: DeleteUserRoleButtonProps) {
  const [state, formAction, pending] = useActionState(deleteUserRole, initialState);

  return (
    <Modal
      triggerLabel="Eliminar"
      title="Eliminar asignación de rol"
      description={`Esta acción eliminará la asignación de ${roleName} para ${userName}.`}
    >
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="userId" defaultValue={userId} />
        <input type="hidden" name="roleId" defaultValue={roleId} />
        {state.fieldErrors.userId ? (
          <p className="text-sm text-[var(--color-error)]">{state.fieldErrors.userId}</p>
        ) : null}
        {state.fieldErrors.roleId ? (
          <p className="text-sm text-[var(--color-error)]">{state.fieldErrors.roleId}</p>
        ) : null}
        {state.formError ? (
          <p className="text-sm font-medium text-[var(--color-error)]" role="alert">
            {state.formError}
          </p>
        ) : null}
        <div className="flex justify-end">
          <Button type="submit" variant="danger" disabled={pending}>
            {pending ? "Eliminando..." : "Eliminar definitivamente"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
