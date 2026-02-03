"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

interface Program {
    id: string;
    title: string;
    description: string;
    image_url: string | null;
}

export function FeaturedPrograms() {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadPrograms = async () => {
            const { data } = await supabase
                .from('programs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(3);

            if (isMounted && data) {
                setPrograms(data as Program[]);
                setLoading(false);
            }
        };

        loadPrograms();

        const channel = supabase
            .channel('public:programs')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'programs' }, () => {
                loadPrograms();
            })
            .subscribe();

        return () => {
            isMounted = false;
            supabase.removeChannel(channel);
        };
    }, []);

    if (loading) {
        return (
            <section className="py-24 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex animate-pulse flex-col md:flex-row md:items-end justify-between mb-12">
                        <div className="space-y-2">
                            <div className="h-10 w-48 bg-gray-200 rounded-lg" />
                            <div className="h-6 w-32 bg-gray-100 rounded-lg" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="aspect-[4/3] bg-gray-100 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Programs</h2>
                        <p className="text-muted text-lg">See how we are making a difference.</p>
                    </div>
                    <Link href="/programs" className="text-primary font-medium flex items-center hover:underline mt-4 md:mt-0">
                        View all programs <ArrowRight className="ml-1 w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {programs.map((program, index) => (
                        <motion.div
                            key={program.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            transition={{ delay: index * 0.1, duration: 0.5, type: "spring", stiffness: 300 }}
                            viewport={{ once: true }}
                            className="group cursor-pointer bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl border border-transparent hover:border-border transition-all"
                        >
                            <div className="aspect-[4/3] bg-surface rounded-2xl overflow-hidden mb-4 relative">
                                {program.image_url ? (
                                    <Image
                                        src={program.image_url}
                                        alt={program.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-secondary flex items-center justify-center text-muted">
                                        [Image: {program.title}]
                                    </div>
                                )}
                            </div>
                            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                                {program.title}
                            </h3>
                            <p className="text-muted line-clamp-2">{program.description}</p>
                        </motion.div>
                    ))}
                    {programs.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-400 italic">
                            No programs found.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
