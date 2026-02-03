"use client";

import { DataTable } from "../../../components/admin/DataTable";
import { Button } from "../../../components/ui/Button";
import { Plus } from "lucide-react";

const initialData = [
    { id: "1", title: "Nakuru Mural Project", year: "2024", category: "Public Art" },
    { id: "2", title: "Civic Ed Campaign", year: "2025", category: "Advocacy" },
];

export default function ProjectsManager() {
    // Logic same as Programs... reusing for brevity in this step
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Project
                </Button>
            </div>

            <DataTable
                columns={[
                    { key: "title", header: "Title" },
                    { key: "category", header: "Category" },
                    { key: "year", header: "Year" },
                ]}
                data={initialData}
                onEdit={() => { }}
                onDelete={() => { }}
            />
        </div>
    );
}
