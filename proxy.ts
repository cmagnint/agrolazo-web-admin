import { type NextRequest, NextResponse } from "next/server";

import { decodeAdmin } from "@/lib/auth/jwt";
import { getConfig } from "@/lib/env";

type AdminSessionPayload = {
  exp?: number;
  [key: string]: unknown;
};

export async function proxy(request: NextRequest) {
  const sessionCookieName = getConfig().session.cookie.name;
  const token = request.cookies.get(sessionCookieName)?.value;

  if (!token) {
    return redirectToLogin(request);
  }

  try {
    const admin = (await decodeAdmin(token)) as AdminSessionPayload | null;
    const now = Math.floor(Date.now() / 1000);

    if (!admin || typeof admin.exp !== "number" || admin.exp <= now) {
      return redirectToExpiredLogin(request);
    }
  } catch {
    return redirectToExpiredLogin(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*",
    "/users/:path*",
  ],
};

function redirectToLogin(request: NextRequest) {
  return NextResponse.redirect(new URL("/login", request.url));
}

function redirectToExpiredLogin(request: NextRequest) {
  const { name, secure } = getConfig().session.cookie;
  const response = NextResponse.redirect(new URL("/login?expired=1", request.url));

  response.cookies.set(name, "", {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
