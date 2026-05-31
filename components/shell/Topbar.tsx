import { Button } from "@/components/ui/Button";

type TopbarProps = {
  admin: {
    email: string;
    name: string;
  };
};

export function Topbar({ admin }: TopbarProps) {
  const initials = getInitials(admin.name);

  return (
    <header className="sticky top-0 z-20 border-b border-[color-mix(in_srgb,var(--color-border)_72%,white)] bg-[rgb(255_253_247_/_78%)] px-5 py-4 shadow-[0_10px_28px_rgb(38_57_41_/_6%)] backdrop-blur-xl md:px-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-[color-mix(in_srgb,var(--color-primary)_24%,white)] bg-[linear-gradient(135deg,var(--color-primary-soft),var(--color-sky-soft))] text-sm font-black text-[var(--color-primary)]">
            {initials}
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
              Sesión de administrador
            </p>
            <p className="mt-1 truncate text-base font-black tracking-[-0.02em] text-[var(--color-text)]">
              {admin.name}
            </p>
            <p className="truncate text-sm font-medium text-[var(--color-text-muted)]">
              {admin.email}
            </p>
          </div>
        </div>

        <form action="/api/session/logout" method="post">
          <Button type="submit" variant="secondary">
            Cerrar sesión
          </Button>
        </form>
      </div>
    </header>
  );
}

function getInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) {
    return "A";
  }

  return parts.map((part) => part[0]?.toUpperCase()).join("");
}