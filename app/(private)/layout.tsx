import type { ReactNode } from "react";

import { AppShell } from "@/components/shell/AppShell";
import { getCurrentAdmin } from "@/features/account/queries";

export const dynamic = "force-dynamic";

type PrivateLayoutProps = {
  children: ReactNode;
};

export default async function PrivateLayout({ children }: PrivateLayoutProps) {
  const admin = await getCurrentAdmin();

  return <AppShell admin={{ email: admin.email, name: admin.name }}>{children}</AppShell>;
}