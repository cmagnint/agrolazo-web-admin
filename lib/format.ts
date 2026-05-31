const emptyValue = "No informado";

export function formatRut(raw: string | null | undefined): string {
  if (!raw) {
    return emptyValue;
  }

  const normalized = raw.replace(/[.\-\s]/g, "").toUpperCase();

  if (!/^\d{7,8}[\dK]$/.test(normalized)) {
    return raw;
  }

  const body = normalized.slice(0, -1);
  const checkDigit = normalized.slice(-1);
  const formattedBody = formatRutBody(body);

  // ej.: 17851821 -> 1.785.182-1
  return `${formattedBody}-${checkDigit}`;
}

export function formatBirthday(raw: string | null | undefined): string {
  if (!raw) {
    return emptyValue;
  }

  const date = new Date(raw);

  if (Number.isNaN(date.getTime())) {
    return emptyValue;
  }

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = String(date.getUTCFullYear());

  // ej.: 1785-10-15T04:42:45.000Z -> 15-10-1785
  return `${day}-${month}-${year}`;
}

function formatRutBody(body: string): string {
  return body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
