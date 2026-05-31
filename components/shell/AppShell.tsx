import type { ReactNode } from "react";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

type AppShellProps = {
  admin: {
    email: string;
    name: string;
  };
  children: ReactNode;
};

export function AppShell({ admin, children }: AppShellProps) {
  return (
    <div className="min-h-screen text-[var(--color-text)] md:flex">
      <Sidebar />

      <div className="relative min-w-0 flex-1">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_72%_8%,rgb(102_192_217_/_18%),transparent_26%),radial-gradient(circle_at_22%_92%,rgb(141_203_174_/_18%),transparent_30%)]" />

        <Topbar admin={admin} />

        <main className="mx-auto w-full max-w-7xl px-5 py-6 md:px-8 md:py-8 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
