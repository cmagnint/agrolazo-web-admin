import { redirect } from "next/navigation";

import { organizationApi } from "@/lib/api/client";
import { SessionExpiredError } from "@/lib/api/errors";
import type { AdminProfile } from "@/lib/api/types";
import { getToken } from "@/lib/auth/session";

export async function getCurrentAdmin(): Promise<AdminProfile> {
  const token = await getToken();

  if (!token) {
    redirect("/login");
  }

  try {
    return await organizationApi.getAdmin(token);
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect("/api/session/logout?expired=1");
    }

    throw error;
  }
}
