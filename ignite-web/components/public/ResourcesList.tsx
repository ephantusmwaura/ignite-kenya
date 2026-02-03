"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen, Newspaper } from "lucide-react";

interface Resource {
    id: string;
    title: string;
    slug: string;
    image_url: string | null;
    type: 'article' | 'blog';
    created_at: string;
}

export function ResourcesList() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecentResources = async () => {
            const { data, error } = await supabase
                .from('resources')
                .select('id, title, slug, image_url, type, created_at')
                .eq('published', true)
                .order('created_at', { ascending: false })
                .limit(3);

            if (!error && data) setResources(data);
            setLoading(false);
        };

        fetchRecentResources();
    }, []);

    if (loading) return null;
    if (resources.length === 0) return null;

    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-12">
                <div>
                    <h2 className="text-4xl font-bold tracking-tight text-foreground mb-4">Latest Resources</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        Insights, stories, and updates from our community and the world of youth-led art and activism.
                    </p>
                </div>
                <div className="hidden sm:flex items-center gap-4">
                    <Link href="/blog" className="text-sm font-semibold hover:text-primary transition-colors flex items-center gap-1">
                        View Blog <ArrowUpRight className="w-4 h-4" />
                    </Link>
                    <Link href="/articles" className="text-sm font-semibold hover:text-primary transition-colors flex items-center gap-1">
                        Read Articles <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {resources.map((resource, index) => (
                    <motion.div
                        key={resource.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link href={`/resources/${resource.slug}`} className="group block h-full">
                            <article className="h-full bg-white rounded-3xl border border-border overflow-hidden flex flex-col transition-all hover:shadow-2xl hover:-translate-y-1">
                                <div className="aspect-[16/9] relative bg-secondary overflow-hidden">
                                    {resource.image_url ? (
                                        <Image
                                            src={resource.image_url}
                                            alt={resource.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground opacity-20">
                                            {resource.type === 'blog' ? <BookOpen className="w-12 h-12" /> : <Newspaper className="w-12 h-12" />}
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${resource.type === 'blog' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {resource.type}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-1">
                                    <h3 className="text-xl font-bold leading-tight mb-4 group-hover:text-primary transition-colors">
                                        {resource.title}
                                    </h3>
                                    <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground font-medium pt-4 border-t border-border/50">
                                        <span>{new Date(resource.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                        <span className="flex items-center gap-1 text-primary">
                                            Read More <ArrowUpRight className="w-3 h-3" />
                                        </span>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    </motion.div>
                ))}
            </div>

            <div className="sm:hidden mt-12 flex flex-col gap-4">
                <Link href="/blog" className="w-full py-4 text-center rounded-2xl bg-secondary text-sm font-bold flex items-center justify-center gap-2">
                    View our Blog <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link href="/articles" className="w-full py-4 text-center rounded-2xl bg-primary text-white text-sm font-bold flex items-center justify-center gap-2">
                    Read Articles <ArrowUpRight className="w-4 h-4" />
                </Link>
            </div>
        </section>
    );
}
