"use server";

import { redirect } from "next/navigation";

import { organizationApi } from "@/lib/api/client";
import { ApiError, ForbiddenError, UnauthorizedError } from "@/lib/api/errors";
import { decodeAdmin } from "@/lib/auth/jwt";
import { setToken } from "@/lib/auth/session";

import { loginSchema, type LoginActionState, type LoginFormValues } from "./schemas";

const invalidCredentialsMessage = "Email o contraseña incorrectos.";
const unavailableMessage = "Servicio no disponible. Intenta más tarde.";

export async function login(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const values = readLoginValues(formData);
  const parsed = loginSchema.safeParse(values);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;

    return {
      ok: false,
      values,
      fieldErrors: {
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      },
      formError: null,
    };
  }

  try {
    const { token } = await organizationApi.authenticate(parsed.data);

    decodeAdmin(token);
    await setToken(token);
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof ForbiddenError) {
      return createFormErrorState(values, invalidCredentialsMessage);
    }

    if (error instanceof ApiError) {
      return createFormErrorState(values, unavailableMessage);
    }

    console.error("Unexpected login error", error);

    return createFormErrorState(values, unavailableMessage);
  }

  redirect("/account");
}

function readLoginValues(formData: FormData): LoginFormValues {
  return {
    email: readFormString(formData, "email"),
    password: readFormString(formData, "password"),
  };
}

function readFormString(formData: FormData, key: keyof LoginFormValues): string {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function createFormErrorState(values: LoginFormValues, formError: string): LoginActionState {
  return {
    ok: false,
    values,
    fieldErrors: {},
    formError,
  };
}
