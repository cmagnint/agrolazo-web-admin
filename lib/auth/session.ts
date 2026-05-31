import { cookies } from "next/headers";

import { getConfig } from "@/lib/env";

const sameSite = "lax" as const;

export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();

  return cookieStore.get(getConfig().session.cookie.name)?.value ?? null;
}

export async function setToken(token: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(getConfig().session.cookie.name, token, {
    ...sessionCookieOptions(),
    maxAge: getConfig().session.cookie.maxAgeSeconds,
  });
}

export async function clearToken(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(getConfig().session.cookie.name, "", {
    ...sessionCookieOptions(),
    maxAge: 0,
  });
}

function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: getConfig().session.cookie.secure,
    sameSite,
    path: "/",
  };
}