"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight, Smile } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function BentoHero() {
    const [settings, setSettings] = useState({
        hero_title: "Youth on Fire for Social Change",
        hero_subtitle: "Empowering young people through art to actively engage and influence decision-making processes in their communities.",
        hero_image_url: null as string | null,
        gallery_hero_image_url: null as string | null
    });

    useEffect(() => {
        let isMounted = true;

        const loadSettings = async () => {
            const { data } = await supabase
                .from('profiles')
                .select('hero_title, hero_subtitle, hero_image_url, gallery_hero_image_url')
                .limit(1)
                .single();

            if (isMounted && data) {
                setSettings({
                    hero_title: data.hero_title || "Youth on Fire for Social Change",
                    hero_subtitle: data.hero_subtitle || "Empowering young people through art to actively engage and influence decision-making processes in their communities.",
                    hero_image_url: data.hero_image_url || null,
                    gallery_hero_image_url: data.gallery_hero_image_url || null
                });
            }
        };

        loadSettings();

        const channel = supabase
            .channel('public:profiles')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, () => {
                loadSettings();
            })
            .subscribe();

        return () => {
            isMounted = false;
            supabase.removeChannel(channel);
        };
    }, []);

    const renderTitle = (title: string) => {
        if (title.includes('<br />')) {
            return title.split('<br />').map((part, i) => (
                <span key={i}>
                    {part.trim()}
                    {i === 0 && <br />}
                </span>
            ));
        }
        return title;
    };

    return (
        <section className="pt-10 pb-32 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto perspective-1000">

            {/* 1. Header Section */}
            <div className="text-center mb-24 max-w-4xl mx-auto">
                <motion.h1
                    key={settings.hero_title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-medium tracking-tight text-foreground mb-6 leading-[1.1]"
                >
                    {renderTitle(settings.hero_title)}
                </motion.h1>
                <motion.p
                    key={settings.hero_subtitle}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light"
                >
                    {settings.hero_subtitle}
                </motion.p>
            </div>

            {/* 2. Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">

                {/* COLUMN 1: 95% Stat (TALL - Start High) */}
                <Link href="/web/impact" className="block h-full">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.05, rotateY: -2, zIndex: 10 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="h-[520px] bg-white text-foreground rounded-[32px] p-8 flex flex-col justify-between relative overflow-hidden group border border-border hover:shadow-2xl transition-all cursor-pointer"
                    >
                        <div className="relative z-10">
                            <div className="text-6xl font-bold mb-2">95%</div>
                            <p className="text-sm opacity-80 leading-relaxed text-muted-foreground">
                                of youth participants report increased confidence in civic engagement after our workshops.
                            </p>
                        </div>
                        <div className="relative z-10 mt-8">
                            <Button className="w-full justify-between bg-black hover:bg-black/80 text-white h-14 rounded-full px-6 transition-all">
                                Learn More <ArrowUpRight className="ml-2 w-5 h-5 text-[#D2F05D]" />
                            </Button>
                        </div>
                    </motion.div>
                </Link>

                {/* COLUMN 2: Image Card (SHORTER - Pushed DOWN for U-Shape) */}
                <div className="mt-24">
                    <Link href="/programs" className="block h-full">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.05, zIndex: 10 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                            className="h-[420px] relative rounded-[32px] overflow-hidden border border-border group hover:shadow-2xl transition-all cursor-pointer bg-white"
                        >
                            <div className="absolute inset-0 bg-gray-50">
                                {settings.hero_image_url ? (
                                    <Image
                                        src={settings.hero_image_url}
                                        alt="Youth Art"
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground font-medium relative group-hover:scale-105 transition-transform duration-700">
                                        <span className="sr-only">Youth Art Image</span>
                                        [Image: Youth Art]
                                    </div>
                                )}

                                <div className="absolute bottom-6 left-6 right-6 text-white z-20">
                                    <h3 className="text-2xl font-bold leading-tight drop-shadow-lg group-hover:text-primary transition-colors">
                                        Free Art <br /> Education
                                    </h3>
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                </div>

                {/* COLUMN 3: Stacked Cards */}
                <div className="flex flex-col gap-6 h-[420px] mt-24">
                    <Link href="/donate" className="block flex-1">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.05, zIndex: 10 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                            className="h-full bg-white rounded-[32px] p-6 flex flex-col justify-center items-center text-center relative overflow-hidden border border-border hover:shadow-2xl transition-all cursor-pointer"
                        >
                            <h3 className="text-3xl font-serif mb-1 text-foreground">Join 1000+ people</h3>
                            <p className="text-muted-foreground font-medium mb-4 text-sm">People creating change</p>

                            <div className="flex -space-x-2 mb-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white" />
                                ))}
                            </div>

                            <Button className="rounded-full bg-secondary text-foreground hover:bg-secondary/80 px-6 h-10 w-full justify-between shadow-sm border border-border">
                                Donate <ArrowUpRight className="w-4 h-4 bg-black text-white rounded-full p-0.5" />
                            </Button>
                        </motion.div>
                    </Link>

                    <Link href="/contact" className="block h-1/3 min-h-[140px]">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.05, zIndex: 10 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
                            className="h-full bg-white rounded-[32px] p-6 flex items-center justify-between text-foreground border border-border hover:shadow-2xl transition-all cursor-pointer"
                        >
                            <Smile className="w-10 h-10 text-foreground" />
                            <div className="text-right">
                                <div className="font-bold text-lg uppercase leading-none">Spread<br />Love</div>
                            </div>
                        </motion.div>
                    </Link>
                </div>

                {/* COLUMN 4: Gallery */}
                <Link href="/gallery" className="block h-full">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.05, rotateY: 2, zIndex: 10 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.4 }}
                        className="h-[520px] bg-[#D2F05D] rounded-[32px] p-6 relative overflow-hidden flex flex-col border border-border/10 hover:shadow-2xl transition-all cursor-pointer group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-3xl font-serif text-[#052C22]">Gallery</h3>
                        </div>

                        <div className="flex-1 relative mt-4 group-hover:-translate-y-4 transition-transform duration-500 ease-out">
                            <div className="absolute top-0 left-0 right-0 h-40 bg-white/40 rounded-xl rotate-[-6deg] scale-90 backdrop-blur-sm transition-transform group-hover:rotate-[-8deg]" />
                            <div className="absolute top-4 left-0 right-0 h-40 bg-white/60 rounded-xl rotate-[3deg] scale-95 backdrop-blur-sm transition-transform group-hover:rotate-[6deg]" />
                            <div className="absolute top-8 left-0 right-0 bottom-0 bg-white/80 rounded-xl overflow-hidden backdrop-blur-md border border-white/20 transition-transform group-hover:-translate-y-2">
                                {settings.gallery_hero_image_url ? (
                                    <Image
                                        src={settings.gallery_hero_image_url}
                                        alt="Gallery Preview"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[#052C22]/50 font-bold">
                                        Snapshot
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 relative z-10">
                            <Button className="w-full bg-[#052C22] text-[#D2F05D] hover:bg-[#08382b] rounded-full h-14 justify-between px-6">
                                See our moments <ArrowUpRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </motion.div>
                </Link>
            </div>
        </section>
    );
}
