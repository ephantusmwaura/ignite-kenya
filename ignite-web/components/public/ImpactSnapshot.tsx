"use client";

import { motion } from "framer-motion";

const stats = [
    { value: "5000+", label: "Youth Engaged" },
    { value: "15+", label: "Communities Reached" },
    { value: "100+", label: "Art Projects" },
    { value: "50+", label: "Policy Changes Influenced" },
];

export function ImpactSnapshot() {
    return (
        <section className="py-24 bg-orange-50 text-foreground border-y border-orange-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4 text-orange-600">Our Impact</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Tangible results from our commitment to youth empowerment.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <div className="text-4xl md:text-5xl font-bold mb-2 text-foreground">{stat.value}</div>
                            <div className="text-lg font-medium text-muted-foreground">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
