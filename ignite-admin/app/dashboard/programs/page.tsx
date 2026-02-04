"use client";

import { DataTable } from "../../../components/admin/DataTable";
import { Button } from "../../../components/ui/Button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ConfirmModal } from "../../../components/ui/ConfirmModal";

// Mock data
const initialData = [
    { id: "1", title: "Art for Change Workshops", status: "Active", participants: 120 },
    { id: "2", title: "Youth Leadership Labs", status: "Active", participants: 85 },
    { id: "3", title: "Public Exhibition Series", status: "Upcoming", participants: 0 },
];

export default function ProgramsManager() {
    const [data, setData] = useState(initialData);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, id: string }>({ isOpen: false, id: '' });

    const handleEdit = (item: Record<string, unknown>) => {
        alert(`Edit program ${item.id}`);
    };

    const handleDelete = () => {
        setData(data.filter(i => i.id !== deleteModal.id));
        setDeleteModal({ isOpen: false, id: '' });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Programs</h1>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Program
                </Button>
            </div>

            <DataTable
                columns={[
                    { key: "title", header: "Title" },
                    { key: "status", header: "Status" },
                    { key: "participants", header: "Participants" },
                ]}
                data={data}
                onEdit={handleEdit}
                onDelete={(id: string) => setDeleteModal({ isOpen: true, id })}
            />

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: '' })}
                onConfirm={handleDelete}
                title="Delete Program"
                message="Are you sure you want to delete this program? This action cannot be undone."
                confirmText="Delete"
            />
        </div>
    );
}
