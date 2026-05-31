"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

import { deleteUser } from "../actions";
import type { DeleteUserActionState } from "../schemas";

type DeleteUserButtonProps = {
  userEmail: string;
  userId: number;
  userName: string;
};

const initialState: DeleteUserActionState = {
  ok: false,
  fieldErrors: {},
  formError: null,
};

export function DeleteUserButton({ userEmail, userId, userName }: DeleteUserButtonProps) {
  const [state, formAction, pending] = useActionState(deleteUser, initialState);

  return (
    <Modal
      triggerLabel="Eliminar"
      title={`Eliminar ${userName}`}
      description={`Esta acción eliminará al usuario ${userEmail}.`}
    >
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="id" defaultValue={userId} />
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
