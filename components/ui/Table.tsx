import type { ReactNode } from "react";

export type TableColumn<T> = {
  cell: (row: T) => ReactNode;
  className?: string;
  header: ReactNode;
  headerClassName?: string;
  key: string;
};

type TableProps<T> = {
  columns: readonly TableColumn<T>[];
  emptyMessage: string;
  getRowKey: (row: T) => string | number;
  rows: readonly T[];
};

export function Table<T>({ columns, emptyMessage, getRowKey, rows }: TableProps<T>) {
  return (
    <div className="overflow-hidden rounded-3xl border border-[color-mix(in_srgb,var(--color-border)_78%,white)] bg-[rgb(255_253_247_/_84%)] shadow-[0_16px_42px_rgb(38_57_41_/_8%)] backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed border-collapse text-left text-sm">
          <thead className="bg-[linear-gradient(135deg,rgb(228_241_223_/_88%),rgb(221_243_246_/_76%))] text-[var(--color-text-muted)]">
            <tr>
              {columns.map((column) => (
                <th
                  className={[
                    "h-13 whitespace-nowrap border-b border-[color-mix(in_srgb,var(--color-border)_72%,white)] px-5 text-xs font-black uppercase tracking-[0.11em]",
                    column.headerClassName ?? "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  key={column.key}
                  scope="col"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <tr
                  className="border-b border-[color-mix(in_srgb,var(--color-border)_58%,white)] transition-colors last:border-b-0 odd:bg-[rgb(255_253_247_/_52%)] even:bg-[rgb(250_247_236_/_38%)] hover:bg-[rgb(228_241_223_/_46%)]"
                  key={getRowKey(row)}
                >
                  {columns.map((column) => (
                    <td
                      className={[
                        "min-h-14 px-5 py-4 align-middle font-medium text-[var(--color-text)]",
                        column.className ?? "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      key={column.key}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="px-5 py-12 text-center text-sm font-semibold text-[var(--color-text-muted)]"
                  colSpan={columns.length}
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}