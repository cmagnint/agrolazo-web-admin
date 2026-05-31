import "server-only";

import { z } from "zod";

import { getConfig } from "@/lib/env";

import { ApiError, ForbiddenError, SessionExpiredError, UnauthorizedError } from "./errors";
import type {
  AdminProfile,
  CreateRolePermissionPayload,
  CreatePermissionPayload,
  CreateRolePayload,
  CreateUserRolePayload,
  CreateUserPayload,
  DeleteRolePermissionPayload,
  DeletePermissionPayload,
  DeleteRolePayload,
  DeleteUserRolePayload,
  DeleteUserPayload,
  Permission,
  Role,
  RolePermissionRelation,
  UpdatePermissionPayload,
  UpdateRolePayload,
  UpdateAdministratorPayload,
  UpdateUserPayload,
  User,
  UserListItem,
  UserRoleRelation,
} from "./types";

type RequestContext = "login" | "protected";

type OrganizationRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  token?: string;
  context: RequestContext;
};

type ApiEnvelope = {
  status: number;
  send: string;
  data?: unknown;
};

const authenticateDataSchema = z.object({
  token: z.string().min(1),
});

const adminProfileSchema: z.ZodType<AdminProfile> = z.object({
  id: z.number(),
  name: z.string(),
  tin: z.string(),
  nationality: z.string().nullable(),
  birthday: z.string().nullable(),
  email: z.string(),
  phone: z.number(),
  address: z.string().nullable(),
  properties: z.record(z.unknown()),
});

type UserWithPassword = User & {
  password: string;
};

const userWithPasswordSchema: z.ZodType<UserWithPassword> = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  isActive: z.boolean(),
  administratorId: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const userListItemPermissionSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
});

const userListItemRoleSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  permissions: z.array(userListItemPermissionSchema),
});

const userListItemSchema: z.ZodType<UserListItem> = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  roles: z.array(userListItemRoleSchema),
});

const roleSchema: z.ZodType<Role> = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  administratorId: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const permissionSchema: z.ZodType<Permission> = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  administratorId: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const roleWithPermissionsSchema: z.ZodType<Role & { permissions: Permission[] }> = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  administratorId: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  permissions: z.array(permissionSchema),
});

const userRoleBridgeSchema = z.object({
  userId: z.number(),
  roleId: z.number(),
  administratorId: z.number(),
});

const userWithRoleBridgeSchema: z.ZodType<UserWithPassword & { UserRole?: z.infer<typeof userRoleBridgeSchema> }> =
  z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    password: z.string(),
    isActive: z.boolean(),
    administratorId: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    UserRole: userRoleBridgeSchema.optional(),
  });

const roleWithUsersSchema: z.ZodType<Role & { users: Array<UserWithPassword & { UserRole?: z.infer<typeof userRoleBridgeSchema> }> }> =
  z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable(),
    administratorId: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    users: z.array(userWithRoleBridgeSchema),
  });

const userRoleRelationSchema: z.ZodType<UserRoleRelation> = z.object({
  userId: z.number(),
  roleId: z.number(),
  administratorId: z.number(),
  user: userWithPasswordSchema,
  role: roleWithPermissionsSchema,
});

const rolePermissionRelationSchema: z.ZodType<RolePermissionRelation> = z.object({
  roleId: z.number(),
  permissionId: z.number(),
  administratorId: z.number(),
  role: roleWithUsersSchema,
  permission: permissionSchema,
});

export const organizationApi = {
  async authenticate(input: { email: string; password: string }) {
    const data = await requestOrganization("/administrators/authenticate", {
      method: "POST",
      body: input,
      context: "login",
    });

    const parsed = authenticateDataSchema.safeParse(data);

    if (!parsed.success) {
      throw new ApiError("Invalid authenticate response", { details: data });
    }

    return parsed.data;
  },

  async getAdmin(token: string): Promise<AdminProfile> {
    const data = await requestOrganization("/administrators/get", {
      method: "GET",
      token,
      context: "protected",
    });

    const parsed = adminProfileSchema.safeParse(data);

    if (!parsed.success) {
      throw new ApiError("Invalid administrator response", { details: data });
    }

    return parsed.data;
  },

  async updateAdmin(token: string, payload: UpdateAdministratorPayload): Promise<void> {
    await requestOrganization("/administrators/update", {
      method: "PUT",
      body: payload,
      token,
      context: "protected",
    });
  },

  async listUsers(token: string): Promise<UserListItem[]> {
    const data = await requestOrganization("/users/get", {
      method: "GET",
      token,
      context: "protected",
    });

    const parsed = z.array(userListItemSchema).safeParse(data);

    if (!parsed.success) {
      throw new ApiError("Invalid users response", { details: data });
    }

    return parsed.data;
  },

  async createUser(token: string, payload: CreateUserPayload): Promise<void> {
    await requestOrganization("/users/create", {
      method: "POST",
      body: payload,
      token,
      context: "protected",
    });
  },

  async updateUser(token: string, payload: UpdateUserPayload): Promise<void> {
    await requestOrganization("/users/update", {
      method: "PUT",
      body: payload,
      token,
      context: "protected",
    });
  },

  async deleteUser(token: string, payload: DeleteUserPayload): Promise<void> {
    await requestOrganization("/users/delete", {
      method: "DELETE",
      body: payload,
      token,
      context: "protected",
    });
  },

  async listRoles(token: string): Promise<Role[]> {
    const data = await requestOrganization("/roles/get", {
      method: "GET",
      token,
      context: "protected",
    });

    const parsed = z.array(roleSchema).safeParse(data);

    if (!parsed.success) {
      throw new ApiError("Invalid roles response", { details: data });
    }

    return parsed.data;
  },

  async createRole(token: string, payload: CreateRolePayload): Promise<void> {
    await requestOrganization("/roles/create", {
      method: "POST",
      body: payload,
      token,
      context: "protected",
    });
  },

  async updateRole(token: string, payload: UpdateRolePayload): Promise<void> {
    await requestOrganization("/roles/update", {
      method: "PUT",
      body: payload,
      token,
      context: "protected",
    });
  },

  async deleteRole(token: string, payload: DeleteRolePayload): Promise<void> {
    await requestOrganization("/roles/delete", {
      method: "DELETE",
      body: payload,
      token,
      context: "protected",
    });
  },

  async listPermissions(token: string): Promise<Permission[]> {
    const data = await requestOrganization("/permissions/get", {
      method: "GET",
      token,
      context: "protected",
    });

    const parsed = z.array(permissionSchema).safeParse(data);

    if (!parsed.success) {
      throw new ApiError("Invalid permissions response", { details: data });
    }

    return parsed.data;
  },

  async createPermission(token: string, payload: CreatePermissionPayload): Promise<void> {
    await requestOrganization("/permissions/create", {
      method: "POST",
      body: payload,
      token,
      context: "protected",
    });
  },

  async updatePermission(token: string, payload: UpdatePermissionPayload): Promise<void> {
    await requestOrganization("/permissions/update", {
      method: "PUT",
      body: payload,
      token,
      context: "protected",
    });
  },

  async deletePermission(token: string, payload: DeletePermissionPayload): Promise<void> {
    await requestOrganization("/permissions/delete", {
      method: "DELETE",
      body: payload,
      token,
      context: "protected",
    });
  },

  async listUserRoles(token: string): Promise<UserRoleRelation[]> {
    const data = await requestOrganization("/relations/get/user-role", {
      method: "GET",
      token,
      context: "protected",
    });

    const parsed = z.array(userRoleRelationSchema).safeParse(data);

    if (!parsed.success) {
      throw new ApiError("Invalid user-role relations response", { details: data });
    }

    return parsed.data;
  },

  async createUserRole(token: string, payload: CreateUserRolePayload): Promise<void> {
    await requestOrganization("/relations/create/user-role", {
      method: "POST",
      body: payload,
      token,
      context: "protected",
    });
  },

  async deleteUserRole(token: string, payload: DeleteUserRolePayload): Promise<void> {
    await requestOrganization("/relations/delete/user-role", {
      method: "DELETE",
      body: payload,
      token,
      context: "protected",
    });
  },

  async listRolePermissions(token: string): Promise<RolePermissionRelation[]> {
    const data = await requestOrganization("/relations/get/role-permission", {
      method: "GET",
      token,
      context: "protected",
    });

    const parsed = z.array(rolePermissionRelationSchema).safeParse(data);

    if (!parsed.success) {
      throw new ApiError("Invalid role-permission relations response", { details: data });
    }

    return parsed.data;
  },

  async createRolePermission(token: string, payload: CreateRolePermissionPayload): Promise<void> {
    await requestOrganization("/relations/create/role-permission", {
      method: "POST",
      body: payload,
      token,
      context: "protected",
    });
  },

  async deleteRolePermission(token: string, payload: DeleteRolePermissionPayload): Promise<void> {
    await requestOrganization("/relations/delete/role-permission", {
      method: "DELETE",
      body: payload,
      token,
      context: "protected",
    });
  },
};

async function requestOrganization(
  path: string,
  options: OrganizationRequestOptions,
): Promise<unknown> {
  const response = await fetch(`${getConfig().api.organization.url}${path}`, {
    method: options.method ?? "GET",
    headers: buildHeaders(options),
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: "no-store",
  }).catch((error: unknown) => {
    throw new ApiError("Error inesperado", { details: error });
  });

  const body = await readJson(response);
  const envelope = parseEnvelope(body);

  if (!envelope) {
    if (options.context === "protected" && response.status === 401) {
      throw new SessionExpiredError("Missing or invalid Authorization header", {
        status: response.status,
        details: body,
      });
    }

    console.error("Invalid api-organization response", {
      httpStatus: response.status,
      body,
      requestPath: path,
    });

    throw new ApiError("Error inesperado", { status: response.status, details: body });
  }

  if (response.ok && (envelope.status === 200 || envelope.status === 201)) {
    return envelope.data;
  }

  if (response.ok && envelope.status === 410) {
    return null;
  }

  throw mapApiError(envelope, response.status, options.context);
}

function buildHeaders(options: OrganizationRequestOptions): HeadersInit {
  const headers = new Headers({
    Accept: "application/json",
  });

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  return headers;
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function parseEnvelope(body: unknown): ApiEnvelope | null {
  if (!isRecord(body)) {
    return null;
  }

  const { status, send, data } = body;

  if (typeof status !== "number" || typeof send !== "string") {
    return null;
  }

  return { status, send, data };
}

function mapApiError(envelope: ApiEnvelope, httpStatus: number, context: RequestContext): ApiError {
  const status = envelope.status || httpStatus;
  const message = extractApiMessage(envelope);
  const details = { httpStatus, body: envelope };

  if (context === "login" && status === 401) {
    return new UnauthorizedError(message, { status, details });
  }

  if (context === "login" && status === 403) {
    return new ForbiddenError(message, { status, details });
  }

  if (context === "protected" && status === 401) {
    return new SessionExpiredError(message, { status, details });
  }

  if (status >= 500) {
    console.error("api-organization error", {
      httpStatus,
      body: envelope,
    });
  }

  return new ApiError(message, { status, details });
}

function extractApiMessage(envelope: ApiEnvelope): string {
  if (isRecord(envelope.data) && typeof envelope.data.message === "string") {
    return envelope.data.message;
  }

  return envelope.send || "Error inesperado";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}