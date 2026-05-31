"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

import { deletePermission } from "../actions";
import type { DeletePermissionActionState } from "../schemas";

type DeletePermissionButtonProps = {
  permissionId: number;
  permissionName: string;
};

const initialState: DeletePermissionActionState = {
  ok: false,
  fieldErrors: {},
  formError: null,
};

export function DeletePermissionButton({
  permissionId,
  permissionName,
}: DeletePermissionButtonProps) {
  const [state, formAction, pending] = useActionState(deletePermission, initialState);

  return (
    <Modal
      triggerLabel="Eliminar"
      title={`Eliminar ${permissionName}`}
      description={`Esta acción eliminará el permiso ${permissionName}.`}
    >
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="id" defaultValue={permissionId} />
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
