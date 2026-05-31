import { z } from "zod";

import type { Permission, Role, UserListItem } from "@/lib/api/types";

const requiredNameMessage = "Ingresa el nombre.";
const requiredEmailMessage = "Ingresa el email.";
const invalidEmailMessage = "Ingresa un email válido.";
const passwordLengthMessage = "La contraseña debe tener al menos 8 caracteres.";
const invalidUserIdMessage = "Usuario inválido.";
const requiredRoleNameMessage = "Ingresa el nombre del rol.";
const invalidRoleIdMessage = "Rol inválido.";
const requiredPermissionNameMessage = "Ingresa el nombre del permiso.";
const invalidPermissionIdMessage = "Permiso inválido.";
const invalidSelectionMessage = "Selección inválida.";

const userNameSchema = z.string().trim().min(1, requiredNameMessage);
const emailSchema = z.string().trim().min(1, requiredEmailMessage).email(invalidEmailMessage);
const passwordSchema = z.string().min(8, passwordLengthMessage);
const userIdSchema = z.coerce.number().int(invalidUserIdMessage).positive(invalidUserIdMessage);
const roleNameSchema = z.string().trim().min(1, requiredRoleNameMessage);
const permissionNameSchema = z.string().trim().min(1, requiredPermissionNameMessage);
const descriptionSchema = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null));
const roleIdSchema = z.coerce
  .number({
    invalid_type_error: invalidRoleIdMessage,
    required_error: invalidRoleIdMessage,
  })
  .int(invalidRoleIdMessage)
  .positive(invalidRoleIdMessage);
const permissionIdSchema = z.coerce
  .number({
    invalid_type_error: invalidPermissionIdMessage,
    required_error: invalidPermissionIdMessage,
  })
  .int(invalidPermissionIdMessage)
  .positive(invalidPermissionIdMessage);
const relationIdStringSchema = z
  .string({
    invalid_type_error: invalidSelectionMessage,
    required_error: invalidSelectionMessage,
  })
  .trim()
  .min(1, invalidSelectionMessage)
  .refine((value) => /^[1-9]\d*$/.test(value), invalidSelectionMessage);

export const userCreateSchema = z.object({
  name: userNameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const userUpdateSchema = z.object({
  id: userIdSchema,
  name: userNameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const deleteUserSchema = z.object({
  id: userIdSchema,
});

export const roleCreateSchema = z.object({
  name: roleNameSchema,
  description: descriptionSchema,
});

export const roleUpdateSchema = z.object({
  id: roleIdSchema,
  name: roleNameSchema,
  description: descriptionSchema,
});

export const deleteRoleSchema = z.object({
  id: roleIdSchema,
});

export const permissionCreateSchema = z.object({
  name: permissionNameSchema,
  description: descriptionSchema,
});

export const permissionUpdateSchema = z.object({
  id: permissionIdSchema,
  name: permissionNameSchema,
  description: descriptionSchema,
});

export const deletePermissionSchema = z.object({
  id: permissionIdSchema,
});

export const createUserRoleSchema = z.object({
  userId: relationIdStringSchema,
  roleId: relationIdStringSchema,
});

export const deleteUserRoleSchema = createUserRoleSchema;

export const createRolePermissionSchema = z.object({
  roleId: relationIdStringSchema,
  permissionId: relationIdStringSchema,
});

export const deleteRolePermissionSchema = createRolePermissionSchema;

export type CreateUserInput = z.infer<typeof userCreateSchema>;
export type UpdateUserInput = z.infer<typeof userUpdateSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
export type CreateRoleInput = z.infer<typeof roleCreateSchema>;
export type UpdateRoleInput = z.infer<typeof roleUpdateSchema>;
export type DeleteRoleInput = z.infer<typeof deleteRoleSchema>;
export type CreatePermissionInput = z.infer<typeof permissionCreateSchema>;
export type UpdatePermissionInput = z.infer<typeof permissionUpdateSchema>;
export type DeletePermissionInput = z.infer<typeof deletePermissionSchema>;
export type CreateUserRoleInput = z.infer<typeof createUserRoleSchema>;
export type DeleteUserRoleInput = z.infer<typeof deleteUserRoleSchema>;
export type CreateRolePermissionInput = z.infer<typeof createRolePermissionSchema>;
export type DeleteRolePermissionInput = z.infer<typeof deleteRolePermissionSchema>;

export type UserFormValues = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type UserFieldErrors = Partial<Record<keyof UserFormValues, string>>;

export type UserActionState = {
  ok: boolean;
  values: UserFormValues;
  fieldErrors: UserFieldErrors;
  formError: string | null;
};

export type DeleteUserActionState = {
  ok: boolean;
  fieldErrors: Partial<Record<keyof DeleteUserInput, string>>;
  formError: string | null;
};

export type RoleFormValues = {
  id: string;
  name: string;
  description: string;
};

export type RoleFieldErrors = Partial<Record<keyof RoleFormValues, string>>;

export type RoleActionState = {
  ok: boolean;
  values: RoleFormValues;
  fieldErrors: RoleFieldErrors;
  formError: string | null;
};

export type DeleteRoleActionState = {
  ok: boolean;
  fieldErrors: Partial<Record<keyof DeleteRoleInput, string>>;
  formError: string | null;
};

export type PermissionFormValues = {
  id: string;
  name: string;
  description: string;
};

export type PermissionFieldErrors = Partial<Record<keyof PermissionFormValues, string>>;

export type PermissionActionState = {
  ok: boolean;
  values: PermissionFormValues;
  fieldErrors: PermissionFieldErrors;
  formError: string | null;
};

export type DeletePermissionActionState = {
  ok: boolean;
  fieldErrors: Partial<Record<keyof DeletePermissionInput, string>>;
  formError: string | null;
};

export type UserRoleFormValues = {
  userId: string;
  roleId: string;
};

export type UserRoleFieldErrors = Partial<Record<keyof UserRoleFormValues, string>>;

export type UserRoleActionState = {
  ok: boolean;
  values: UserRoleFormValues;
  fieldErrors: UserRoleFieldErrors;
  formError: string | null;
};

export type DeleteUserRoleActionState = {
  ok: boolean;
  fieldErrors: UserRoleFieldErrors;
  formError: string | null;
};

export type RolePermissionFormValues = {
  roleId: string;
  permissionId: string;
};

export type RolePermissionFieldErrors = Partial<Record<keyof RolePermissionFormValues, string>>;

export type RolePermissionActionState = {
  ok: boolean;
  values: RolePermissionFormValues;
  fieldErrors: RolePermissionFieldErrors;
  formError: string | null;
};

export type DeleteRolePermissionActionState = {
  ok: boolean;
  fieldErrors: RolePermissionFieldErrors;
  formError: string | null;
};

export function createInitialUserState(user?: UserListItem): UserActionState {
  return {
    ok: false,
    values: {
      id: user ? String(user.id) : "",
      name: user?.name ?? "",
      email: user?.email ?? "",
      password: "",
    },
    fieldErrors: {},
    formError: null,
  };
}

export function createInitialDeleteUserState(): DeleteUserActionState {
  return {
    ok: false,
    fieldErrors: {},
    formError: null,
  };
}

export function userInputToFormValues(input: CreateUserInput | UpdateUserInput): UserFormValues {
  return {
    id: "id" in input ? String(input.id) : "",
    name: input.name,
    email: input.email,
    password: input.password,
  };
}

export function createInitialRoleState(role?: Role): RoleActionState {
  return {
    ok: false,
    values: {
      id: role ? String(role.id) : "",
      name: role?.name ?? "",
      description: role?.description ?? "",
    },
    fieldErrors: {},
    formError: null,
  };
}

export function createInitialDeleteRoleState(): DeleteRoleActionState {
  return {
    ok: false,
    fieldErrors: {},
    formError: null,
  };
}

export function roleInputToFormValues(input: CreateRoleInput | UpdateRoleInput): RoleFormValues {
  return {
    id: "id" in input ? String(input.id) : "",
    name: input.name,
    description: input.description ?? "",
  };
}

export function createInitialPermissionState(permission?: Permission): PermissionActionState {
  return {
    ok: false,
    values: {
      id: permission ? String(permission.id) : "",
      name: permission?.name ?? "",
      description: permission?.description ?? "",
    },
    fieldErrors: {},
    formError: null,
  };
}

export function createInitialDeletePermissionState(): DeletePermissionActionState {
  return {
    ok: false,
    fieldErrors: {},
    formError: null,
  };
}

export function permissionInputToFormValues(
  input: CreatePermissionInput | UpdatePermissionInput,
): PermissionFormValues {
  return {
    id: "id" in input ? String(input.id) : "",
    name: input.name,
    description: input.description ?? "",
  };
}

export function createInitialUserRoleState(): UserRoleActionState {
  return {
    ok: false,
    values: {
      userId: "",
      roleId: "",
    },
    fieldErrors: {},
    formError: null,
  };
}

export function createInitialDeleteUserRoleState(): DeleteUserRoleActionState {
  return {
    ok: false,
    fieldErrors: {},
    formError: null,
  };
}

export function createInitialRolePermissionState(): RolePermissionActionState {
  return {
    ok: false,
    values: {
      roleId: "",
      permissionId: "",
    },
    fieldErrors: {},
    formError: null,
  };
}

export function createInitialDeleteRolePermissionState(): DeleteRolePermissionActionState {
  return {
    ok: false,
    fieldErrors: {},
    formError: null,
  };
}
