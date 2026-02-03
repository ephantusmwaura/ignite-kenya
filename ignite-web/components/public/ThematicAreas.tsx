"use client";

import { motion } from "framer-motion";
import { Sparkles, Scale, Heart } from "lucide-react";

const themes = [
    {
        icon: Sparkles,
        title: "Youth Empowerment",
        description: "Equipping young minds with the skills and confidence to lead.",
        color: "text-orange-500",
        bg: "bg-orange-500/10",
    },
    {
        icon: Scale,
        title: "Social Justice",
        description: "Advocating for fairness and equity through creative expression.",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        icon: Heart,
        title: "Wellness",
        description: "Fostering mental and physical well-being in our communities.",
        color: "text-green-500",
        bg: "bg-green-500/10",
    },
];

export function ThematicAreas() {
    return (
        <section className="py-24 bg-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Our Core Pillars</h2>
                    <p className="text-muted text-lg max-w-2xl mx-auto">
                        We focus our efforts on three key areas to drive sustainable change.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {themes.map((theme, index) => (
                        <motion.div
                            key={theme.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="bg-background rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-border"
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${theme.bg}`}>
                                <theme.icon className={`w-6 h-6 ${theme.color}`} />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{theme.title}</h3>
                            <p className="text-muted leading-relaxed">{theme.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
