"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const taglines = [
    "Youth on fire for change",
    "Spark your potential",
    "Igniting hope, building tomorrow",
    "Unleash your inner flame",
];

export function Hero() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % taglines.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-background text-center px-4">
            {/* Background Gradients/Elements for "High End" feel */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-400/20 rounded-full blur-[96px]" />
            </div>

            <div className="z-10 max-w-4xl mx-auto space-y-8">

                {/* Rotating Tagline */}
                <div className="h-20 sm:h-24 md:h-32 flex items-center justify-center overflow-hidden mb-4">
                    <AnimatePresence mode="wait">
                        <motion.h1
                            key={index}
                            initial={{ y: 20, opacity: 0, filter: "blur(10px)" }}
                            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                            exit={{ y: -20, opacity: 0, filter: "blur(10px)" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-foreground"
                        >
                            {taglines[index]}
                        </motion.h1>
                    </AnimatePresence>
                </div>

                {/* Mission Statement */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-lg sm:text-xl md:text-2xl text-muted max-w-2xl mx-auto"
                >
                    Empowering young people through art to actively engage and influence decision-making processes in their communities.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
                >
                    <Link href="/programs">
                        <Button size="lg" className="rounded-full px-8 h-12 text-base">
                            Our Programs
                        </Button>
                    </Link>
                    <Link href="/get-involved">
                        <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base group">
                            Get Involved
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
            >
                <div className="w-6 h-10 border-2 border-muted rounded-full p-1">
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="w-full h-2 bg-muted rounded-full"
                    />
                </div>
            </motion.div>

        </section>
    );
}
