"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { organizationApi } from "@/lib/api/client";
import { ApiError, SessionExpiredError } from "@/lib/api/errors";
import type {
  CreatePermissionPayload,
  CreateRolePayload,
  CreateRolePermissionPayload,
  CreateUserPayload,
  CreateUserRolePayload,
  DeletePermissionPayload,
  DeleteRolePayload,
  DeleteRolePermissionPayload,
  DeleteUserPayload,
  DeleteUserRolePayload,
  Permission,
  Role,
  RolePermissionRelation,
  UpdatePermissionPayload,
  UpdateRolePayload,
  UpdateUserPayload,
  UserRoleRelation,
} from "@/lib/api/types";
import { getToken } from "@/lib/auth/session";

import {
  createRolePermissionSchema,
  createUserRoleSchema,
  deletePermissionSchema,
  deleteRolePermissionSchema,
  deleteRoleSchema,
  deleteUserRoleSchema,
  deleteUserSchema,
  permissionCreateSchema,
  permissionUpdateSchema,
  roleCreateSchema,
  roleUpdateSchema,
  type DeletePermissionActionState,
  type DeleteRoleActionState,
  type DeleteRolePermissionActionState,
  type DeleteUserActionState,
  type DeleteUserRoleActionState,
  type PermissionActionState,
  type PermissionFieldErrors,
  type PermissionFormValues,
  type RoleActionState,
  type RoleFieldErrors,
  type RoleFormValues,
  type RolePermissionActionState,
  type RolePermissionFieldErrors,
  type RolePermissionFormValues,
  type UserActionState,
  type UserFieldErrors,
  type UserFormValues,
  type UserRoleActionState,
  type UserRoleFieldErrors,
  type UserRoleFormValues,
  userCreateSchema,
  userUpdateSchema,
} from "./schemas";

const usersPath = "/users";
const rolesPath = "/users/roles";
const permissionsPath = "/users/permissions";
const userRolesPath = "/users/asignar-roles";
const rolePermissionsPath = "/users/asignar-permisos";
const unexpectedErrorMessage = "Algo salió mal. Intenta de nuevo.";
const emailConflictMessage = "Email ya registrado.";
const roleConflictMessage = "Ya existe un rol con ese nombre.";
const permissionConflictMessage = "Ya existe un permiso con ese nombre.";
const duplicateRelationMessage = "Esta relación ya existe.";

export async function createUser(
  _previousState: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const values = readUserFormValues(formData);
  const parsed = userCreateSchema.safeParse(values);

  if (!parsed.success) {
    return invalidUserState(values, mapUserFieldErrors(parsed.error.flatten().fieldErrors));
  }

  const token = await requireToken();

  try {
    const payload: CreateUserPayload = parsed.data;

    await organizationApi.createUser(token, payload);
    revalidatePath(usersPath);
  } catch (error) {
    return handleUserMutationError(error, values, "User create failed");
  }

  redirect(usersPath);
}

export async function updateUser(
  _previousState: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const values = readUserFormValues(formData);
  const parsed = userUpdateSchema.safeParse(values);

  if (!parsed.success) {
    return invalidUserState(values, mapUserFieldErrors(parsed.error.flatten().fieldErrors));
  }

  const token = await requireToken();

  try {
    const payload: UpdateUserPayload = parsed.data;

    await organizationApi.updateUser(token, payload);
    revalidatePath(usersPath);
  } catch (error) {
    return handleUserMutationError(error, values, "User update failed");
  }

  redirect(usersPath);
}

export async function deleteUser(
  _previousState: DeleteUserActionState,
  formData: FormData,
): Promise<DeleteUserActionState> {
  const values = { id: readFormString(formData, "id") };
  const parsed = deleteUserSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: {
        id: parsed.error.flatten().fieldErrors.id?.[0],
      },
      formError: null,
    };
  }

  const token = await requireToken();

  try {
    const payload: DeleteUserPayload = parsed.data;

    await organizationApi.deleteUser(token, payload);
    revalidatePath(usersPath);
  } catch (error) {
    return handleDeleteError(error, "User delete failed");
  }

  redirect(usersPath);
}

export async function createRole(
  _previousState: RoleActionState,
  formData: FormData,
): Promise<RoleActionState> {
  const values = readRoleFormValues(formData);
  const parsed = roleCreateSchema.safeParse(values);

  if (!parsed.success) {
    return invalidRoleState(values, mapRoleFieldErrors(parsed.error.flatten().fieldErrors));
  }

  const token = await requireToken();

  try {
    const duplicate = await findRoleByName(token, parsed.data.name);

    if (duplicate) {
      return invalidRoleState(values, { name: roleConflictMessage });
    }

    const payload: CreateRolePayload = parsed.data;

    await organizationApi.createRole(token, payload);
    revalidatePath(usersPath);
  } catch (error) {
    return handleRoleMutationError(error, values, "Role create failed");
  }

  redirect(rolesPath);
}

export async function updateRole(
  _previousState: RoleActionState,
  formData: FormData,
): Promise<RoleActionState> {
  const values = readRoleFormValues(formData);
  const parsed = roleUpdateSchema.safeParse(values);

  if (!parsed.success) {
    return invalidRoleState(values, mapRoleFieldErrors(parsed.error.flatten().fieldErrors));
  }

  const token = await requireToken();

  try {
    const duplicate = await findRoleByName(token, parsed.data.name);

    if (duplicate && duplicate.id !== parsed.data.id) {
      return invalidRoleState(values, { name: roleConflictMessage });
    }

    const payload: UpdateRolePayload = parsed.data;

    await organizationApi.updateRole(token, payload);
    revalidatePath(usersPath);
  } catch (error) {
    return handleRoleMutationError(error, values, "Role update failed");
  }

  redirect(rolesPath);
}

export async function deleteRole(
  _previousState: DeleteRoleActionState,
  formData: FormData,
): Promise<DeleteRoleActionState> {
  const values = { id: readFormString(formData, "id") };
  const parsed = deleteRoleSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: {
        id: parsed.error.flatten().fieldErrors.id?.[0],
      },
      formError: null,
    };
  }

  const token = await requireToken();

  try {
    const payload: DeleteRolePayload = parsed.data;

    await organizationApi.deleteRole(token, payload);
    revalidatePath(usersPath);
  } catch (error) {
    return handleDeleteError(error, "Role delete failed");
  }

  redirect(rolesPath);
}

export async function createPermission(
  _previousState: PermissionActionState,
  formData: FormData,
): Promise<PermissionActionState> {
  const values = readPermissionFormValues(formData);
  const parsed = permissionCreateSchema.safeParse(values);

  if (!parsed.success) {
    return invalidPermissionState(values, mapPermissionFieldErrors(parsed.error.flatten().fieldErrors));
  }

  const token = await requireToken();

  try {
    const duplicate = await findPermissionByName(token, parsed.data.name);

    if (duplicate) {
      return invalidPermissionState(values, { name: permissionConflictMessage });
    }

    const payload: CreatePermissionPayload = parsed.data;

    await organizationApi.createPermission(token, payload);
    revalidatePath(usersPath);
  } catch (error) {
    return handlePermissionMutationError(error, values, "Permission create failed");
  }

  redirect(permissionsPath);
}

export async function updatePermission(
  _previousState: PermissionActionState,
  formData: FormData,
): Promise<PermissionActionState> {
  const values = readPermissionFormValues(formData);
  const parsed = permissionUpdateSchema.safeParse(values);

  if (!parsed.success) {
    return invalidPermissionState(values, mapPermissionFieldErrors(parsed.error.flatten().fieldErrors));
  }

  const token = await requireToken();

  try {
    const duplicate = await findPermissionByName(token, parsed.data.name);

    if (duplicate && duplicate.id !== parsed.data.id) {
      return invalidPermissionState(values, { name: permissionConflictMessage });
    }

    const payload: UpdatePermissionPayload = parsed.data;

    await organizationApi.updatePermission(token, payload);
    revalidatePath(usersPath);
  } catch (error) {
    return handlePermissionMutationError(error, values, "Permission update failed");
  }

  redirect(permissionsPath);
}

export async function deletePermission(
  _previousState: DeletePermissionActionState,
  formData: FormData,
): Promise<DeletePermissionActionState> {
  const values = { id: readFormString(formData, "id") };
  const parsed = deletePermissionSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: {
        id: parsed.error.flatten().fieldErrors.id?.[0],
      },
      formError: null,
    };
  }

  const token = await requireToken();

  try {
    const payload: DeletePermissionPayload = parsed.data;

    await organizationApi.deletePermission(token, payload);
    revalidatePath(usersPath);
  } catch (error) {
    return handleDeleteError(error, "Permission delete failed");
  }

  redirect(permissionsPath);
}

export async function createUserRole(
  _previousState: UserRoleActionState,
  formData: FormData,
): Promise<UserRoleActionState> {
  const values = readUserRoleFormValues(formData);
  const parsed = createUserRoleSchema.safeParse(values);

  if (!parsed.success) {
    return invalidUserRoleState(values, mapUserRoleFieldErrors(parsed.error.flatten().fieldErrors));
  }

  const token = await requireToken();

  try {
    const payload: CreateUserRolePayload = parsed.data;
    const relations = await organizationApi.listUserRoles(token);

    if (hasUserRole(relations, payload)) {
      return { ok: false, values, fieldErrors: {}, formError: duplicateRelationMessage };
    }

    await organizationApi.createUserRole(token, payload);
    revalidatePath(usersPath);
  } catch (error) {
    return handleUserRoleMutationError(error, values, "User role create failed");
  }

  redirect(userRolesPath);
}

export async function deleteUserRole(
  _previousState: DeleteUserRoleActionState,
  formData: FormData,
): Promise<DeleteUserRoleActionState> {
  const values = readUserRoleFormValues(formData);
  const parsed = deleteUserRoleSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: mapUserRoleFieldErrors(parsed.error.flatten().fieldErrors),
      formError: null,
    };
  }

  const token = await requireToken();

  try {
    const payload: DeleteUserRolePayload = parsed.data;

    await organizationApi.deleteUserRole(token, payload);
    revalidatePath(usersPath);
  } catch (error) {
    return handleDeleteRelationError(error, "User role delete failed");
  }

  redirect(userRolesPath);
}

export async function createRolePermission(
  _previousState: RolePermissionActionState,
  formData: FormData,
): Promise<RolePermissionActionState> {
  const values = readRolePermissionFormValues(formData);
  const parsed = createRolePermissionSchema.safeParse(values);

  if (!parsed.success) {
    return invalidRolePermissionState(values, mapRolePermissionFieldErrors(parsed.error.flatten().fieldErrors));
  }

  const token = await requireToken();

  try {
    const payload: CreateRolePermissionPayload = parsed.data;
    const relations = await organizationApi.listRolePermissions(token);

    if (hasRolePermission(relations, payload)) {
      return { ok: false, values, fieldErrors: {}, formError: duplicateRelationMessage };
    }

    await organizationApi.createRolePermission(token, payload);
    revalidatePath(usersPath);
  } catch (error) {
    return handleRolePermissionMutationError(error, values, "Role permission create failed");
  }

  redirect(rolePermissionsPath);
}

export async function deleteRolePermission(
  _previousState: DeleteRolePermissionActionState,
  formData: FormData,
): Promise<DeleteRolePermissionActionState> {
  const values = readRolePermissionFormValues(formData);
  const parsed = deleteRolePermissionSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: mapRolePermissionFieldErrors(parsed.error.flatten().fieldErrors),
      formError: null,
    };
  }

  const token = await requireToken();

  try {
    const payload: DeleteRolePermissionPayload = parsed.data;

    await organizationApi.deleteRolePermission(token, payload);
    revalidatePath(usersPath);
  } catch (error) {
    return handleDeleteRelationError(error, "Role permission delete failed");
  }

  redirect(rolePermissionsPath);
}

async function requireToken(): Promise<string> {
  const token = await getToken();

  if (!token) {
    redirect("/login");
  }

  return token;
}

async function findRoleByName(token: string, name: string): Promise<Role | null> {
  const roles = await organizationApi.listRoles(token);
  const normalizedName = normalizeName(name);

  return roles.find((role) => normalizeName(role.name) === normalizedName) ?? null;
}

async function findPermissionByName(token: string, name: string): Promise<Permission | null> {
  const permissions = await organizationApi.listPermissions(token);
  const normalizedName = normalizeName(name);

  return permissions.find((permission) => normalizeName(permission.name) === normalizedName) ?? null;
}

function normalizeName(name: string): string {
  return name.trim().toLocaleLowerCase("es-CL");
}

function hasUserRole(relations: UserRoleRelation[], payload: CreateUserRolePayload): boolean {
  const userId = Number(payload.userId);
  const roleId = Number(payload.roleId);

  return relations.some((relation) => relation.userId === userId && relation.roleId === roleId);
}

function hasRolePermission(
  relations: RolePermissionRelation[],
  payload: CreateRolePermissionPayload,
): boolean {
  const roleId = Number(payload.roleId);
  const permissionId = Number(payload.permissionId);

  return relations.some((relation) => relation.roleId === roleId && relation.permissionId === permissionId);
}

function readUserFormValues(formData: FormData): UserFormValues {
  return {
    id: readFormString(formData, "id"),
    name: readFormString(formData, "name"),
    email: readFormString(formData, "email"),
    password: readFormString(formData, "password"),
  };
}

function readRoleFormValues(formData: FormData): RoleFormValues {
  return {
    id: readFormString(formData, "id"),
    name: readFormString(formData, "name"),
    description: readFormString(formData, "description"),
  };
}

function readPermissionFormValues(formData: FormData): PermissionFormValues {
  return {
    id: readFormString(formData, "id"),
    name: readFormString(formData, "name"),
    description: readFormString(formData, "description"),
  };
}

function readUserRoleFormValues(formData: FormData): UserRoleFormValues {
  return {
    userId: readFormString(formData, "userId"),
    roleId: readFormString(formData, "roleId"),
  };
}

function readRolePermissionFormValues(formData: FormData): RolePermissionFormValues {
  return {
    roleId: readFormString(formData, "roleId"),
    permissionId: readFormString(formData, "permissionId"),
  };
}

function readFormString(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function invalidUserState(values: UserFormValues, fieldErrors: UserFieldErrors): UserActionState {
  return { ok: false, values, fieldErrors, formError: null };
}

function invalidRoleState(values: RoleFormValues, fieldErrors: RoleFieldErrors): RoleActionState {
  return { ok: false, values, fieldErrors, formError: null };
}

function invalidPermissionState(
  values: PermissionFormValues,
  fieldErrors: PermissionFieldErrors,
): PermissionActionState {
  return { ok: false, values, fieldErrors, formError: null };
}

function invalidUserRoleState(
  values: UserRoleFormValues,
  fieldErrors: UserRoleFieldErrors,
): UserRoleActionState {
  return { ok: false, values, fieldErrors, formError: null };
}

function invalidRolePermissionState(
  values: RolePermissionFormValues,
  fieldErrors: RolePermissionFieldErrors,
): RolePermissionActionState {
  return { ok: false, values, fieldErrors, formError: null };
}

function mapUserFieldErrors(
  errors: Partial<Record<keyof UserFormValues, string[]>>,
): UserFieldErrors {
  return {
    id: errors.id?.[0],
    name: errors.name?.[0],
    email: errors.email?.[0],
    password: errors.password?.[0],
  };
}

function mapRoleFieldErrors(
  errors: Partial<Record<keyof RoleFormValues, string[]>>,
): RoleFieldErrors {
  return {
    id: errors.id?.[0],
    name: errors.name?.[0],
    description: errors.description?.[0],
  };
}

function mapPermissionFieldErrors(
  errors: Partial<Record<keyof PermissionFormValues, string[]>>,
): PermissionFieldErrors {
  return {
    id: errors.id?.[0],
    name: errors.name?.[0],
    description: errors.description?.[0],
  };
}

function mapUserRoleFieldErrors(
  errors: Partial<Record<keyof UserRoleFormValues, string[]>>,
): UserRoleFieldErrors {
  return {
    userId: errors.userId?.[0],
    roleId: errors.roleId?.[0],
  };
}

function mapRolePermissionFieldErrors(
  errors: Partial<Record<keyof RolePermissionFormValues, string[]>>,
): RolePermissionFieldErrors {
  return {
    roleId: errors.roleId?.[0],
    permissionId: errors.permissionId?.[0],
  };
}

function handleUserMutationError(
  error: unknown,
  values: UserFormValues,
  logMessage: string,
): UserActionState {
  if (error instanceof SessionExpiredError) {
    redirect("/api/session/logout?expired=1");
  }

  if (error instanceof ApiError && error.message === "SequelizeUniqueConstraintError") {
    return invalidUserState(values, { email: emailConflictMessage });
  }

  logMutationError(error, logMessage);

  return { ok: false, values, fieldErrors: {}, formError: unexpectedErrorMessage };
}

function handleRoleMutationError(
  error: unknown,
  values: RoleFormValues,
  logMessage: string,
): RoleActionState {
  logMutationError(error, logMessage);

  return { ok: false, values, fieldErrors: {}, formError: unexpectedErrorMessage };
}

function handlePermissionMutationError(
  error: unknown,
  values: PermissionFormValues,
  logMessage: string,
): PermissionActionState {
  logMutationError(error, logMessage);

  return { ok: false, values, fieldErrors: {}, formError: unexpectedErrorMessage };
}

function handleUserRoleMutationError(
  error: unknown,
  values: UserRoleFormValues,
  logMessage: string,
): UserRoleActionState {
  logMutationError(error, logMessage);

  return { ok: false, values, fieldErrors: {}, formError: unexpectedErrorMessage };
}

function handleRolePermissionMutationError(
  error: unknown,
  values: RolePermissionFormValues,
  logMessage: string,
): RolePermissionActionState {
  logMutationError(error, logMessage);

  return { ok: false, values, fieldErrors: {}, formError: unexpectedErrorMessage };
}

function handleDeleteError(error: unknown, logMessage: string): DeleteUserActionState {
  logMutationError(error, logMessage);

  return { ok: false, fieldErrors: {}, formError: unexpectedErrorMessage };
}

function handleDeleteRelationError(
  error: unknown,
  logMessage: string,
): DeleteUserRoleActionState {
  logMutationError(error, logMessage);

  return { ok: false, fieldErrors: {}, formError: unexpectedErrorMessage };
}

function logMutationError(error: unknown, logMessage: string) {
  if (error instanceof SessionExpiredError) {
    redirect("/api/session/logout?expired=1");
  }

  if (error instanceof ApiError) {
    console.error(logMessage, {
      status: error.status,
      details: error.details,
    });
  } else {
    console.error(`Unexpected ${logMessage}`, error);
  }
}
