"use client";

import { motion } from "framer-motion";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AboutContent() {
    const [content, setContent] = useState({
        about: "A youth-led organization empowering young people through art to actively engage and influence decision-making processes in their communities.",
        mission: "Empowering young people through art to actively engage and influence decision-making processes in their communities."
    });

    useEffect(() => {
        let isMounted = true;

        const loadContent = async () => {
            const { data } = await supabase
                .from('profiles')
                .select('about_content, mission_statement')
                .limit(1)
                .single();

            if (isMounted && data) {
                setContent(prev => ({
                    about: data.about_content || prev.about,
                    mission: data.mission_statement || prev.mission
                }));
            }
        };

        loadContent();

        const channel = supabase
            .channel('public:profiles')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, () => {
                loadContent();
            })
            .subscribe();

        return () => {
            isMounted = false;
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <div className="bg-background min-h-screen">

            {/* Hero */}
            <section className="pt-10 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl sm:text-6xl font-bold tracking-tight mb-6"
                >
                    We Are <span className="text-primary">Ignite Kenya</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-muted max-w-3xl mx-auto"
                >
                    {content.about}
                </motion.p>
            </section>

            {/* Mission & Vision */}
            <section className="py-16 bg-surface">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-background p-8 rounded-2xl shadow-sm border border-border"
                    >
                        <h2 className="text-2xl font-bold mb-4 text-primary">Our Mission</h2>
                        <p className="text-lg leading-relaxed">
                            {content.mission}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-background p-8 rounded-2xl shadow-sm border border-border"
                    >
                        <h2 className="text-2xl font-bold mb-4 text-primary">Our Vision</h2>
                        <p className="text-lg leading-relaxed">
                            A society where creativity shapes policies and social change, fostering inclusive, transparent, and effective governance.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-12">Core Values</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-center">
                    {["Creativity", "Empowerment", "Social Impact", "Collaboration", "Integrity"].map((value, idx) => (
                        <motion.div
                            key={value}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="p-6 rounded-xl bg-surface hover:bg-primary/5 transition-colors"
                        >
                            <h3 className="font-semibold text-lg">{value}</h3>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Target Audience */}
            <section className="py-16 bg-secondary text-secondary-foreground text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-6">Who We Serve</h2>
                    <p className="text-lg opacity-90 leading-relaxed">
                        We focus on youth aged <span className="font-bold text-primary">5–29 years</span>,
                        especially those from informal settlements in <span className="font-bold text-primary">Nakuru County</span>.
                        We believe that every young person deserves a platform to spark their potential.
                    </p>
                </div>
            </section>

        </div>
    );
}
