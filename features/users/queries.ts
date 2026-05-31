import "server-only";

import { redirect } from "next/navigation";

import { organizationApi } from "@/lib/api/client";
import { SessionExpiredError } from "@/lib/api/errors";
import type {
  Permission,
  Role,
  RolePermissionRelation,
  UserListItem,
  UserRoleRelation,
} from "@/lib/api/types";
import { getToken } from "@/lib/auth/session";
import { stripPasswordHash, stripPasswordHashes } from "@/lib/sanitize";

export type UserRoleDisplayRow = {
  userId: number;
  roleId: number;
  userName: string;
  userEmail: string;
  roleName: string;
};

export type RolePermissionDisplayRow = {
  roleId: number;
  permissionId: number;
  roleName: string;
  permissionName: string;
};

export type UserDetail = {
  user: UserListItem | null;
  roles: Role[];
  inheritedPermissions: Permission[];
};

export async function getUsers(): Promise<UserListItem[]> {
  return withProtectedSession(async (token) => {
    const users = await organizationApi.listUsers(token);

    return stripPasswordHashes(users);
  });
}

export async function getUserById(id: string | number): Promise<UserListItem | null> {
  const userId = parsePositiveId(id);

  if (userId === null) {
    return null;
  }

  const users = await getUsers();

  return users.find((user) => user.id === userId) ?? null;
}

export async function getRoles(): Promise<Role[]> {
  return withProtectedSession((token) => organizationApi.listRoles(token));
}

export async function getRoleById(id: string | number): Promise<Role | null> {
  const roleId = parsePositiveId(id);

  if (roleId === null) {
    return null;
  }

  const roles = await getRoles();

  return roles.find((role) => role.id === roleId) ?? null;
}

export async function getPermissions(): Promise<Permission[]> {
  return withProtectedSession((token) => organizationApi.listPermissions(token));
}

export async function getPermissionById(id: string | number): Promise<Permission | null> {
  const permissionId = parsePositiveId(id);

  if (permissionId === null) {
    return null;
  }

  const permissions = await getPermissions();

  return permissions.find((permission) => permission.id === permissionId) ?? null;
}

export async function getUserRoleRelations(): Promise<UserRoleDisplayRow[]> {
  return withProtectedSession(async (token) => {
    const [relations, users, roles] = await Promise.all([
      organizationApi.listUserRoles(token),
      getUsers(),
      getRoles(),
    ]);
    const usersById = new Map(users.map((user) => [user.id, user]));
    const rolesById = new Map(roles.map((role) => [role.id, role]));

    return relations.map((relation) => toUserRoleDisplayRow(relation, usersById, rolesById));
  });
}

export async function getRolePermissionRelations(): Promise<RolePermissionDisplayRow[]> {
  return withProtectedSession(async (token) => {
    const [relations, roles, permissions] = await Promise.all([
      organizationApi.listRolePermissions(token),
      getRoles(),
      getPermissions(),
    ]);
    const rolesById = new Map(roles.map((role) => [role.id, role]));
    const permissionsById = new Map(permissions.map((permission) => [permission.id, permission]));

    return relations.map((relation) =>
      toRolePermissionDisplayRow(relation, rolesById, permissionsById),
    );
  });
}

/**
 * Composes server-side display data only. This is not authorization, does not
 * infer access, and only joins IDs already returned by the backend.
 */
export async function composeUserDetail(userId: string): Promise<UserDetail> {
  const parsedUserId = parsePositiveId(userId);

  if (parsedUserId === null) {
    return { user: null, roles: [], inheritedPermissions: [] };
  }

  const [user, userRoleRelations, roles, rolePermissionRelations, permissions] = await Promise.all([
    getUserById(userId),
    getUserRoleRelations(),
    getRoles(),
    getRolePermissionRelations(),
    getPermissions(),
  ]);

  if (!user) {
    return { user: null, roles: [], inheritedPermissions: [] };
  }

  const assignedRoleIds = new Set(
    userRoleRelations
      .filter((relation) => relation.userId === parsedUserId)
      .map((relation) => relation.roleId),
  );
  const assignedRoles = roles.filter((role) => assignedRoleIds.has(role.id));
  const knownRoleIds = new Set(assignedRoles.map((role) => role.id));
  const inheritedPermissionIds = new Set(
    rolePermissionRelations
      .filter((relation) => knownRoleIds.has(relation.roleId))
      .map((relation) => relation.permissionId),
  );
  const inheritedPermissions = permissions.filter((permission) =>
    inheritedPermissionIds.has(permission.id),
  );

  return { user, roles: assignedRoles, inheritedPermissions };
}

async function withProtectedSession<T>(operation: (token: string) => Promise<T>): Promise<T> {
  const token = await getToken();

  if (!token) {
    redirect("/login");
  }

  try {
    return await operation(token);
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/api/session/logout?expired=1");
    }

    throw error;
  }
}

function toUserRoleDisplayRow(
  relation: UserRoleRelation,
  usersById: Map<number, UserListItem>,
  rolesById: Map<number, Role>,
): UserRoleDisplayRow {
  const safeUser = stripPasswordHash(relation.user);
  const user = usersById.get(relation.userId);
  const role = rolesById.get(relation.roleId);

  return {
    userId: relation.userId,
    roleId: relation.roleId,
    userName: user?.name ?? safeUser.name,
    userEmail: user?.email ?? safeUser.email,
    roleName: role?.name ?? relation.role.name,
  };
}

function toRolePermissionDisplayRow(
  relation: RolePermissionRelation,
  rolesById: Map<number, Role>,
  permissionsById: Map<number, Permission>,
): RolePermissionDisplayRow {
  const safeUsers = relation.role.users.map((user) => stripPasswordHash(user));
  const safeRole = { ...relation.role, users: safeUsers };
  const role = rolesById.get(relation.roleId);
  const permission = permissionsById.get(relation.permissionId);

  return {
    roleId: relation.roleId,
    permissionId: relation.permissionId,
    roleName: role?.name ?? safeRole.name,
    permissionName: permission?.name ?? relation.permission.name,
  };
}

function parsePositiveId(id: string | number): number | null {
  const value = Number(id);

  if (!Number.isInteger(value) || value <= 0) {
    return null;
  }

  return value;
}
