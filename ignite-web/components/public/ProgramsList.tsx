"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Paintbrush, Users, GraduationCap, Loader2, LucideIcon } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface Program {
    id: string;
    title: string;
    description: string;
    category: string;
    slug: string;
    image_url?: string;
}

const iconMap: Record<string, LucideIcon> = {
    "School Programs": GraduationCap,
    "Community Programs": Users,
    "Workshop Series": Paintbrush,
};

export default function ProgramsList() {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPrograms = useCallback(async () => {
        const { data } = await supabase
            .from('programs')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setPrograms(data as Program[]);
        setLoading(false);
    }, []);

    useEffect(() => {
        let isMounted = true;
        const init = async () => {
            if (isMounted) await fetchPrograms();
        };
        init();

        const channel = supabase
            .channel('public:programs')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'programs' }, () => {
                fetchPrograms();
            })
            .subscribe();

        return () => {
            isMounted = false;
            supabase.removeChannel(channel);
        };
    }, [fetchPrograms]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background py-20 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl sm:text-5xl font-bold tracking-tight mb-4"
                    >
                        Our Programs
                    </motion.h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        We drive impact through structured initiatives designed to empower, educate, and elevate youth voices.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {programs.map((program, index) => {
                            const Icon = iconMap[program.category] || GraduationCap;
                            return (
                                <Link key={program.id} href={`/programs/${program.id}`}>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        whileHover={{ y: -10, scale: 1.02 }}
                                        transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
                                        className="group h-full bg-white rounded-2xl p-8 border border-border hover:shadow-xl transition-all cursor-pointer flex flex-col items-start"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                                            <Icon className="w-7 h-7 text-foreground group-hover:text-primary transition-colors" strokeWidth={1.5} />
                                        </div>
                                        <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                                            {program.title}
                                        </h2>
                                        <p className="text-muted-foreground mb-6 flex-grow">
                                            {program.description}
                                        </p>
                                        <span className="flex items-center text-sm font-medium text-primary mt-auto group-hover:underline">
                                            Learn more <ArrowRight className="ml-1 w-4 h-4" />
                                        </span>
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </AnimatePresence>
                    {programs.length === 0 && (
                        <div className="col-span-full py-24 text-center text-gray-400 italic">
                            No programs available yet.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
