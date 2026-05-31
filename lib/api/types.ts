// Source: inferred from live api-organization administrator responses confirmed on 2026-05-21.
export type AdminProfile = {
  id: number;
  name: string;
  tin: string;
  nationality: string | null;
  birthday: string | null;
  email: string;
  phone: number;
  address: string | null;
  properties: Record<string, unknown>;
};

export type UpdateAdministratorPayload = {
  name: string;
  tin: string;
  nationality: string | null;
  birthday: string | null;
  email: string;
  phone: number;
  address: string | null;
  properties: Record<string, unknown>;
};

// Source: inferred from live GET /users/get response confirmed on 2026-05-23.
// /users/get returns a list-only shape with nested roles and lite permissions,
// without password, isActive, administratorId, createdAt, updatedAt.
export type UserListItemPermission = {
  id: number;
  name: string;
  description: string | null;
};

export type UserListItemRole = {
  id: number;
  name: string;
  description: string | null;
  permissions: UserListItemPermission[];
};

export type UserListItem = {
  id: number;
  name: string;
  email: string;
  roles: UserListItemRole[];
};

// Source: inferred from users returned by live GET /relations/get/* responses.
// Users do not have tin or phone in the real backend contract.
export type User = {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  administratorId: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
};

export type UpdateUserPayload = {
  id: number;
  name: string;
  email: string;
  password: string;
};

export type DeleteUserPayload = {
  id: number;
};

// Source: inferred from roles DTOs/model and live GET /roles/get response confirmed on 2026-05-21.
// Role descriptions are nullable, and roles contain no secrets that require sanitization.
export type Role = {
  id: number;
  name: string;
  description: string | null;
  administratorId: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateRolePayload = {
  name: string;
  description: string | null;
};

export type UpdateRolePayload = {
  id: number;
  name: string;
  description: string | null;
};

export type DeleteRolePayload = {
  id: number;
};

// Source: inferred from permissions DTOs/model and live GET /permissions/get response confirmed on 2026-05-21.
// Permission descriptions are nullable, and permissions contain no secrets that require sanitization.
export type Permission = {
  id: number;
  name: string;
  description: string | null;
  administratorId: number;
  createdAt: string;
  updatedAt: string;
};

export type CreatePermissionPayload = {
  name: string;
  description: string | null;
};

export type UpdatePermissionPayload = {
  id: number;
  name: string;
  description: string | null;
};

export type DeletePermissionPayload = {
  id: number;
};

// Source: inferred from relation DTOs/models, OpenAPI and live GET /relations/* responses on 2026-05-21.
// Relation payload IDs stay as strings because the DTOs declare strings and native selects submit strings.
export type UserRoleRelation = {
  userId: number;
  roleId: number;
  administratorId: number;
  user: User & { password: string };
  role: Role & { permissions: Permission[] };
};

export type RolePermissionRelation = {
  roleId: number;
  permissionId: number;
  administratorId: number;
  role: Role & {
    users: Array<
      User & {
        password: string;
        UserRole?: {
          userId: number;
          roleId: number;
          administratorId: number;
        };
      }
    >;
  };
  permission: Permission;
};

export type CreateUserRolePayload = {
  userId: string;
  roleId: string;
};

export type DeleteUserRolePayload = {
  userId: string;
  roleId: string;
};

export type CreateRolePermissionPayload = {
  roleId: string;
  permissionId: string;
};

export type DeleteRolePermissionPayload = {
  roleId: string;
  permissionId: string;
};
