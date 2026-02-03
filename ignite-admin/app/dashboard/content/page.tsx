"use client";

import { Button } from "@/components/ui/Button";

export default function ContentEditor() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Content Editor</h1>
                <Button>Save Changes</Button>
            </div>

            <div className="grid gap-8">
                {/* Hero Section Edit */}
                <section className="p-6 border rounded-xl bg-white dark:bg-black">
                    <h2 className="text-lg font-semibold mb-4">Hero Section</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Taglines (One per line)</label>
                            <textarea
                                className="w-full p-2 border rounded-md h-32 bg-background"
                                defaultValue={"Youth on fire for change\nSpark your potential\nIgniting hope, building tomorrow"}
                            />
                        </div>
                    </div>
                </section>

                {/* Mission Edit */}
                <section className="p-6 border rounded-xl bg-white dark:bg-black">
                    <h2 className="text-lg font-semibold mb-4">Mission Statement</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Text</label>
                            <textarea
                                className="w-full p-2 border rounded-md h-24 bg-background"
                                defaultValue={"Empowering young people through art to actively engage and influence decision-making processes in their communities."}
                            />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
