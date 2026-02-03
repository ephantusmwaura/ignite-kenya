"use client";

import { motion } from "framer-motion";
import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Loader2, Calendar, MapPin, ExternalLink, Briefcase } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/components/assets/logo.png";
import StarRating from "@/components/public/StarRating";

const MchangaLogo = ({ className = "w-32" }: { className?: string }) => (
    <svg viewBox="0 0 320 60" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="42" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="32" fill="currentColor">M</text>
        <path d="M32 28 H38" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <text x="42" y="42" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="32" fill="currentColor">Changa</text>
        <text x="175" y="42" fontFamily="Arial, sans-serif" fontWeight="300" fontSize="32" fill="currentColor" opacity="0.9">Africa</text>
    </svg>
);
// ... [MchangaLogo and GoFundMeLogo code can remain if I don't touch them, but I need to make sure I don't delete them]
// Actually, I can just target the import section and the main section separately.

// Let's use replace_file_content for the whole file to be safe or just the affected chunks.
// The file is small enough.

const GoFundMeLogo = ({ className = "w-32" }: { className?: string }) => (
    <svg viewBox="0 0 300 60" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25 30 C 25 18, 40 18, 40 30 C 40 42, 25 42, 25 30" fill="currentColor" />
        <text x="48" y="40" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="30" fill="currentColor" letterSpacing="-0.5">gofundme</text>
    </svg>
);

interface Project {
    id: string;
    title: string;
    description: string;
    status: string;
    image_url: string;
    created_at: string;
}

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            const { data } = await supabase
                .from('projects')
                .select('*')
                .eq('id', id)
                .single();

            if (data) setProject(data as Project);
            setLoading(false);
        };

        fetchProject();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">Project not found</h1>
                <Link href="/projects" className="text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Projects
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header / Back Navigation */}
            <div className="pt-32 pb-6 px-8 lg:px-24">
                <Link href="/projects" className="group inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-gray-600" />
                    <span className="text-sm font-medium text-gray-600 group-hover:text-primary transition-colors">Back to Projects</span>
                </Link>
            </div>

            {/* Hero Section - Split Layout */}
            <section className="relative min-h-[70vh] flex flex-col md:flex-row items-stretch overflow-hidden">
                {/* Left side: branding and info */}
                <div className="w-full md:w-1/2 flex flex-col justify-center px-8 lg:px-24 bg-white relative z-10 py-12">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <div className="relative w-32 h-32 md:w-48 md:h-48 -ml-8 md:-ml-12">
                            <Image
                                src={logo}
                                alt="Ignite Kenya Logo"
                                fill
                                className="object-contain grayscale opacity-20 hover:opacity-100 transition-opacity duration-500"
                            />
                        </div>
                        <div className="space-y-4">
                            <span className="inline-block px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] bg-primary/10 text-primary border border-primary/20">
                                {project.status}
                            </span>
                            <h1 className="text-5xl lg:text-8xl font-black tracking-tighter text-black leading-[0.85] uppercase">
                                {project.title}
                            </h1>
                        </div>
                        <div className="flex flex-wrap gap-8 text-sm text-muted-foreground border-t border-gray-100 pt-8">
                            <div className="flex items-center gap-2.5">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span className="font-medium">{new Date(project.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span className="font-medium">Nakuru, Kenya</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right side: Image Preview with Smooth Fade */}
                <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[60%] pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5 }}
                        className="relative w-full h-full"
                        style={{
                            maskImage: 'linear-gradient(to right, transparent, black 40%, black)',
                            WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%, black)'
                        }}
                    >
                        {project.image_url ? (
                            <Image
                                src={project.image_url}
                                alt={project.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full bg-neutral-50 flex items-center justify-center">
                                <Briefcase className="w-24 h-24 text-muted-foreground/5" />
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Mobile Hero Image */}
            <div className="md:hidden w-full aspect-video relative">
                {project.image_url && (
                    <Image
                        src={project.image_url}
                        alt={project.title}
                        fill
                        className="object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
            </div>

            {/* Body Content */}
            <main className="max-w-7xl mx-auto px-8 lg:px-24 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            viewport={{ once: true }}
                            className="prose prose-2xl max-w-none text-gray-800 leading-relaxed font-light"
                        >
                            {project.description}
                        </motion.div>
                    </div>

                    <div className="lg:col-span-4 lg:start-9 mt-12 lg:mt-0">
                        <div className="sticky top-32">
                            <StarRating targetId={project.id} targetType="project" />
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer with Donation Buttons */}
            <footer className="border-t border-gray-100 bg-neutral-50 py-20">
                <div className="max-w-7xl mx-auto px-8 lg:px-24">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                        <div className="max-w-md">
                            <h3 className="text-2xl font-bold mb-4">Support this vision</h3>
                            <p className="text-gray-500">
                                Your contribution directly impacts the success of projects like <strong>{project.title}</strong> and helps us continue our mission in Nakuru.
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-end gap-4 w-full md:w-auto">
                            <Link
                                href="https://www.mchanga.africa/fundraiser/126676?_gl=1*bd4v6q*_gcl_au*NzE1NTUwMTA3LjE3NjM2MzkzNDMuODgxNzM1MTUxLjE3NjQwNzAxMzguMTc2NDA3MDEzOA"
                                target="_blank"
                                className="group flex items-center gap-4 bg-white border border-gray-200 px-6 py-4 rounded-3xl hover:border-primary hover:shadow-xl transition-all shadow-sm"
                            >
                                <div className="text-[#009fe3]">
                                    <MchangaLogo className="w-32" />
                                </div>
                                <div className="bg-[#009fe3] p-2 rounded-full text-white">
                                    <ExternalLink className="w-4 h-4" />
                                </div>
                            </Link>

                            <Link
                                href="https://gofund.me/6b49bfb99"
                                target="_blank"
                                className="group flex items-center gap-4 bg-white border border-gray-200 px-6 py-4 rounded-3xl hover:border-[#02a95c] hover:shadow-xl transition-all shadow-sm"
                            >
                                <div className="text-[#02a95c]">
                                    <GoFundMeLogo className="w-32" />
                                </div>
                                <div className="bg-[#02a95c] p-2 rounded-full text-white">
                                    <ExternalLink className="w-4 h-4" />
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
