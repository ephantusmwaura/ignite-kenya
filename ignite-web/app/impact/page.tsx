"use client";

import { ImpactSnapshot } from "../../components/public/ImpactSnapshot";
import { motion } from "framer-motion";

export default function ImpactPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">Our Impact</h1>
                <p className="text-xl text-muted max-w-3xl mx-auto">
                    Measuring the change we create in the lives of young people and our community.
                </p>
            </div>

            <ImpactSnapshot />

            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold mb-12 text-center">Stories of Change</h2>
                <div className="grid md:grid-cols-2 gap-12">
                    {[1, 2].map((i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="flex flex-col md:flex-row gap-6 bg-surface p-6 rounded-2xl border border-border"
                        >
                            <div className="w-full md:w-48 h-48 bg-secondary rounded-xl flex-shrink-0" />
                            <div>
                                <h3 className="text-xl font-bold mb-2">Success Story Title {i}</h3>
                                <p className="text-muted mb-4">
                                    &quot;Ignite Kenya gave me the tools to speak up...&quot; - A brief testimonial or story summary.
                                </p>
                                <button className="text-primary font-medium hover:underline">Read full story</button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
