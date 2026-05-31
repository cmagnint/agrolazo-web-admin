import { AccountDetails } from "@/features/account/components/AccountDetails";
import { getCurrentAdmin } from "@/features/account/queries";

export default async function AccountPage() {
  const admin = await getCurrentAdmin();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section aria-labelledby="account-title">
        <p className="text-sm font-semibold text-[var(--color-primary)]">Mi cuenta</p>
        <h1 id="account-title" className="mt-2 text-3xl font-bold tracking-normal">
          Perfil administrador
        </h1>
        <p className="mt-2 text-base text-[var(--color-text-muted)]">
          Revisa los datos del administrador autenticado.
        </p>
      </section>

      <AccountDetails admin={admin} />
    </div>
  );
}
