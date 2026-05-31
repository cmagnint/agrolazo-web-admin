import type { AdminProfile } from "@/lib/api/types";
import { formatBirthday, formatRut } from "@/lib/format";

const emptyValue = "No informado";
const emptyPropertiesValue = "Sin propiedades registradas";

type AccountDetailsProps = {
  admin: AdminProfile;
};

type DetailItemProps = {
  label: string;
  value: string;
};

export function AccountDetails({ admin }: AccountDetailsProps) {
  const propertiesText = formatProperties(admin.properties);

  return (
    <section
      className="rounded-lg border border-[var(--color-border)] bg-[var(--color-cream)] p-6 shadow-[0_16px_48px_rgb(30_36_31_/_8%)]"
      aria-labelledby="account-details-title"
    >
      <div className="flex flex-col gap-1">
        <h2 id="account-details-title" className="text-lg font-bold tracking-normal">
          Datos del perfil
        </h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Información del administrador autenticado.
        </p>
      </div>

      <dl className="mt-6 grid gap-5 sm:grid-cols-2">
        <DetailItem label="Nombre" value={formatNullable(admin.name)} />
        <DetailItem label="RUT/TIN" value={formatRut(admin.tin)} />
        <DetailItem label="Email" value={formatNullable(admin.email)} />
        <DetailItem label="Teléfono" value={String(admin.phone)} />
        <DetailItem label="Nacionalidad" value={formatNullable(admin.nationality)} />
        <DetailItem label="Fecha de nacimiento" value={formatBirthday(admin.birthday)} />
        <DetailItem label="Dirección" value={formatNullable(admin.address)} />
      </dl>

      <div className="mt-5 border-t border-[var(--color-border)] pt-3">
        <p className="text-sm font-semibold text-[var(--color-text-muted)]">Propiedades</p>
        {propertiesText === emptyPropertiesValue ? (
          <p className="mt-1 text-base font-semibold">{propertiesText}</p>
        ) : (
          <pre className="mt-2 max-h-48 overflow-auto rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-sm leading-6 text-[var(--color-text)]">
            {propertiesText}
          </pre>
        )}
      </div>
    </section>
  );
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="border-t border-[var(--color-border)] pt-3">
      <dt className="text-sm font-semibold text-[var(--color-text-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-base font-semibold">{value}</dd>
    </div>
  );
}

function formatNullable(value: string | null): string {
  if (!value) {
    return emptyValue;
  }

  return value;
}

function formatProperties(properties: Record<string, unknown>): string {
  if (Object.keys(properties).length === 0) {
    return emptyPropertiesValue;
  }

  return JSON.stringify(properties, null, 2);
}
