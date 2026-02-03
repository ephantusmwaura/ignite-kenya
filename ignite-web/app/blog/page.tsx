"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen, Loader2 } from "lucide-react";

interface Resource {
    id: string;
    title: string;
    slug: string;
    image_url: string | null;
    created_at: string;
}

export default function BlogListing() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogPosts = async () => {
            const { data, error } = await supabase
                .from('resources')
                .select('id, title, slug, image_url, created_at')
                .eq('published', true)
                .eq('type', 'blog')
                .order('created_at', { ascending: false });

            if (!error && data) setResources(data);
            setLoading(false);
        };

        fetchBlogPosts();
    }, []);

    return (
        <main className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <header className="mb-24 text-center max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-20 h-20 bg-purple-100 text-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8"
                >
                    <BookOpen className="w-10 h-10" />
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6"
                >
                    Our Blog
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-muted-foreground font-light"
                >
                    Stories, reflections, and deep dives from our community of artists and changemakers.
                </motion.p>
            </header>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                </div>
            ) : resources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {resources.map((resource, index) => (
                        <motion.div
                            key={resource.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={`/resources/${resource.slug}`} className="group block h-full">
                                <article className="bg-white rounded-[40px] border border-border overflow-hidden flex flex-col h-full transition-all hover:shadow-2xl hover:-translate-y-2">
                                    <div className="aspect-[4/3] relative bg-secondary overflow-hidden">
                                        {resource.image_url ? (
                                            <Image
                                                src={resource.image_url}
                                                alt={resource.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground opacity-20">
                                                <BookOpen className="w-16 h-16" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-10 flex flex-col flex-1">
                                        <h3 className="text-2xl font-bold leading-tight mb-6 group-hover:text-primary transition-colors">
                                            {resource.title}
                                        </h3>
                                        <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground font-bold tracking-wider uppercase pt-6 border-t border-border/50">
                                            <span>{new Date(resource.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                            <span className="flex items-center gap-2 text-primary">
                                                Read Article <ArrowUpRight className="w-4 h-4" />
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-40 bg-secondary/30 rounded-[64px] border border-dashed border-border">
                    <BookOpen className="w-20 h-20 text-muted-foreground opacity-20 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-foreground mb-2">No blog posts yet</h2>
                    <p className="text-muted-foreground">Check back soon for inspiring stories!</p>
                </div>
            )}
        </main>
    );
}
