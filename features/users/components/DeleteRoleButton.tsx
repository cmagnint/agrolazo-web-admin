"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

import { deleteRole } from "../actions";
import type { DeleteRoleActionState } from "../schemas";

type DeleteRoleButtonProps = {
  roleId: number;
  roleName: string;
};

const initialState: DeleteRoleActionState = {
  ok: false,
  fieldErrors: {},
  formError: null,
};

export function DeleteRoleButton({ roleId, roleName }: DeleteRoleButtonProps) {
  const [state, formAction, pending] = useActionState(deleteRole, initialState);

  return (
    <Modal
      triggerLabel="Eliminar"
      title={`Eliminar ${roleName}`}
      description={`Esta acción eliminará el rol ${roleName}.`}
    >
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="id" defaultValue={roleId} />
        {state.fieldErrors.id ? (
          <p className="text-sm text-[var(--color-error)]">{state.fieldErrors.id}</p>
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
