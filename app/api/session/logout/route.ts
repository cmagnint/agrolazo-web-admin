import { redirect } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";

import { clearToken } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  await clearToken();

  const url = new URL("/login", request.url);

  if (request.nextUrl.searchParams.get("expired") === "1") {
    url.searchParams.set("expired", "1");
  }

  return NextResponse.redirect(url);
}

export async function POST() {
  await clearToken();
  redirect("/login");
}
