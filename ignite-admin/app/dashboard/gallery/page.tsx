"use client";

import { Button } from "@/components/ui/Button";
import { Upload, Trash2 } from "lucide-react";

export default function GalleryManager() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Gallery Manager</h1>
                <Button>
                    <Upload className="mr-2 h-4 w-4" /> Upload Images
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="group relative bg-gray-100 dark:bg-gray-800 rounded-lg aspect-square flex items-center justify-center overflow-hidden">
                        <div className="text-xs text-muted">Image {i}</div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button variant="ghost" size="icon" className="text-white hover:text-red-400">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
