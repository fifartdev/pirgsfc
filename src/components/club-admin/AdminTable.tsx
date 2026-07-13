import Link from "next/link";
import { Edit, Plus } from "lucide-react";

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface AdminTableProps<T extends { id: string | number }> {
  title: string;
  rows: T[];
  columns: Column<T>[];
  newHref: string;
  editHref: (row: T) => string;
  emptyMessage?: string;
  /** Optional filter controls rendered between the header and the table. */
  filters?: React.ReactNode;
}

export function AdminTable<T extends { id: string | number }>({
  title,
  rows,
  columns,
  newHref,
  editHref,
  emptyMessage = "Δεν βρέθηκαν εγγραφές.",
  filters,
}: AdminTableProps<T>) {
  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <Link
          href={newHref}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          <Plus className="h-4 w-4" />
          Δημιουργία
        </Link>
      </div>

      {filters && <div className="mb-4">{filters}</div>}

      {/* Table */}
      {rows.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-16 text-center text-gray-400">
          {emptyMessage}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Ενέργειες
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-white/[0.02]">
              {rows.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-white/5">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-gray-300">
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key] ?? "—")}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={editHref(row)}
                        className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        <Edit className="h-3 w-3" />
                        Επεξεργασία
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
