"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationGroups = [
  {
    title: "Principal",
    items: [
      { href: "/account", label: "Mi cuenta", marker: "M" },
      { href: "/users", label: "Usuarios", marker: "U" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-[color-mix(in_srgb,var(--color-border)_72%,white)] bg-[rgb(255_253_247_/_86%)] px-4 py-4 shadow-[0_14px_40px_rgb(38_57_41_/_7%)] backdrop-blur-xl md:sticky md:top-0 md:min-h-screen md:w-72 md:border-b-0 md:border-r md:px-5 md:py-6">
      <div className="mb-5 rounded-2xl border border-[color-mix(in_srgb,var(--color-border)_70%,white)] bg-[linear-gradient(135deg,rgb(228_241_223_/_88%),rgb(221_243_246_/_72%))] p-4 shadow-[0_12px_26px_rgb(38_57_41_/_8%)]">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--color-primary),var(--color-aqua))] text-sm font-black text-[var(--color-primary-foreground)] shadow-[0_12px_24px_rgb(60_113_63_/_22%)]">
            A
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-black tracking-[-0.02em] text-[var(--color-primary)]">
              Agrolazo Admin
            </p>
            <p className="mt-0.5 text-xs font-semibold text-[var(--color-text-muted)]">
              Panel de administración
            </p>
          </div>
        </div>
      </div>

      <nav aria-label="Navegación principal" className="overflow-x-auto md:overflow-visible">
        <div className="flex min-w-max gap-3 md:min-w-0 md:flex-col md:gap-5">
          {navigationGroups.map((group) => (
            <section key={group.title} className="min-w-48 md:min-w-0">
              <p className="mb-2 px-3 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
                {group.title}
              </p>

              <ul className="space-y-1.5">
                {group.items.map((item) => {
                  const active = isActivePath(pathname, item.href);

                  return (
                    <li key={item.href}>
                      <Link
                        aria-current={active ? "page" : undefined}
                        className={[
                          "group relative flex min-h-11 items-center gap-3 rounded-2xl px-3 text-sm font800 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]",
                          active
                            ? "bg-[linear-gradient(135deg,var(--color-primary-soft),rgb(221_243_246_/_82%))] text-[var(--color-primary)] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-primary)_24%,white),0_12px_24px_rgb(60_113_63_/_10%)]"
                            : "text-[var(--color-text)] hover:bg-[rgb(255_253_247_/_72%)] hover:text-[var(--color-primary)] hover:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-border)_72%,white)]",
                        ].join(" ")}
                        href={item.href}
                      >
                        <span
                          className={[
                            "flex size-7 shrink-0 items-center justify-center rounded-xl text-[11px] font-black transition",
                            active
                              ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                              : "bg-[color-mix(in_srgb,var(--color-aqua-muted)_42%,white)] text-[var(--color-primary)] group-hover:bg-[var(--color-primary-soft)]",
                          ].join(" ")}
                        >
                          {item.marker}
                        </span>

                        <span className="truncate font-bold">{item.label}</span>

                        {active ? (
                          <span className="ml-auto size-2 rounded-full bg-[var(--color-aqua)] shadow-[0_0_0_4px_rgb(80_180_206_/_14%)]" />
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </nav>
    </aside>
  );
}

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/account") {
    return pathname === "/account";
  }

  if (href === "/users") {
    return matchesPathBase(pathname, "/users");
  }

  return matchesPathBase(pathname, href);
}

function matchesPathBase(pathname: string, base: string): boolean {
  return pathname === base || pathname.startsWith(`${base}/`);
}
