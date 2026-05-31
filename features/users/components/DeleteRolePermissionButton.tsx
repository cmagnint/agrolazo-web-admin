"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

import { deleteRolePermission } from "../actions";
import type { DeleteRolePermissionActionState } from "../schemas";

type DeleteRolePermissionButtonProps = {
  permissionId: number;
  permissionName: string;
  roleId: number;
  roleName: string;
};

const initialState: DeleteRolePermissionActionState = {
  ok: false,
  fieldErrors: {},
  formError: null,
};

export function DeleteRolePermissionButton({
  permissionId,
  permissionName,
  roleId,
  roleName,
}: DeleteRolePermissionButtonProps) {
  const [state, formAction, pending] = useActionState(deleteRolePermission, initialState);

  return (
    <Modal
      triggerLabel="Eliminar"
      title="Eliminar asignación de permiso"
      description={`Esta acción eliminará la asignación de ${permissionName} para ${roleName}.`}
    >
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="roleId" defaultValue={roleId} />
        <input type="hidden" name="permissionId" defaultValue={permissionId} />
        {state.fieldErrors.roleId ? (
          <p className="text-sm text-[var(--color-error)]">{state.fieldErrors.roleId}</p>
        ) : null}
        {state.fieldErrors.permissionId ? (
          <p className="text-sm text-[var(--color-error)]">
            {state.fieldErrors.permissionId}
          </p>
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
