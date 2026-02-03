"use client";

import { Pencil, Trash2 } from "lucide-react";

interface Column {
    key: string;
    header: string;
    render?: (item: Record<string, unknown>) => React.ReactNode;
}

interface DataTableProps {
    columns: Column[];
    data: Record<string, unknown>[];
    onEdit?: (item: Record<string, unknown>) => void;
    onDelete?: (id: string) => void;
}

export function DataTable({ columns, data, onEdit, onDelete }: DataTableProps) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                        {columns.map((col) => (
                            <th key={col.key} className="px-6 py-4 text-sm font-semibold text-gray-700">
                                {col.header}
                            </th>
                        ))}
                        {(onEdit || onDelete) && (
                            <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-right">Actions</th>
                        )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {data.map((item, idx) => (
                        <tr key={(item.id as string) || idx} className="hover:bg-gray-50 transition-colors group">
                            {columns.map((col) => (
                                <td key={col.key} className="px-6 py-4">
                                    {col.render ? col.render(item) : (
                                        <span className="text-gray-900 font-medium">
                                            {String(item[col.key] ?? '-')}
                                        </span>
                                    )}
                                </td>
                            ))}
                            {(onEdit || onDelete) && (
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {onEdit && (
                                            <button
                                                onClick={() => onEdit(item)}
                                                className="p-2 text-gray-400 hover:text-primary transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                onClick={() => onDelete(item.id as string)}
                                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-6 py-12 text-center text-gray-500 italic">
                                No data found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
