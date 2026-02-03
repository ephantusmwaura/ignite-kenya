"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Briefcase } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Project {
    id: string;
    title: string;
    description: string;
    status: string;
    image_url: string;
    slug: string;
    created_at: string;
}

export default function ProjectsList() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("All");

    const fetchProjects = useCallback(async () => {
        const { data } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setProjects(data as Project[]);
        setLoading(false);
    }, []);

    useEffect(() => {
        let isMounted = true;
        const init = async () => {
            if (isMounted) await fetchProjects();
        };
        init();

        const channel = supabase
            .channel('public:projects')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
                fetchProjects();
            })
            .subscribe();

        return () => {
            isMounted = false;
            supabase.removeChannel(channel);
        };
    }, [fetchProjects]);

    const filteredProjects = activeFilter === "All"
        ? projects
        : projects.filter(p => p.status === activeFilter);

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
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold mb-4"
                    >
                        Our Projects
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground text-lg max-w-2xl mx-auto"
                    >
                        Showcasing the creative output and community initiatives led by our youth.
                    </motion.p>
                </div>

                {/* Status Filters */}
                <div className="flex justify-center gap-4 mb-12 flex-wrap">
                    {["All", "Ongoing", "Completed"].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-6 py-2 rounded-full border transition-all text-sm font-medium ${activeFilter === filter
                                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                : "border-border bg-white hover:border-primary/50 hover:bg-primary/5"
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project, index) => (
                            <Link key={project.id} href={`/projects/${project.id}`} className="h-full">
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileHover={{ y: -10 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-border/50 transition-all duration-500 h-full flex flex-col"
                                >
                                    <div className="aspect-[4/3] bg-muted overflow-hidden relative">
                                        {project.image_url ? (
                                            <Image
                                                src={project.image_url}
                                                alt={project.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-secondary/30">
                                                <Briefcase className="w-12 h-12 text-muted-foreground/20" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                        <div className="absolute top-4 right-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md bg-white/20 text-white border border-white/20`}>
                                                {project.status}
                                            </span>
                                        </div>

                                        <div className="absolute bottom-6 left-6 right-6 text-white">
                                            <p className="text-[10px] font-medium uppercase tracking-[0.2em] mb-2 text-white/70">
                                                Nakuru • {new Date(project.created_at).getFullYear()}
                                            </p>
                                            <h3 className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
                                                {project.title}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-muted-foreground text-sm line-clamp-2">
                                            {project.description}
                                        </p>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredProjects.length === 0 && (
                    <div className="text-center py-24 text-muted-foreground italic border-2 border-dashed border-border rounded-3xl">
                        No projects found matching your selection.
                    </div>
                )}
            </div>
        </div>
    );
}
