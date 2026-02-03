"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { ArrowLeft, Loader2, Calendar, Share2 } from "lucide-react";
import Link from "next/link";

interface Resource {
    id: string;
    title: string;
    content: string;
    image_url: string | null;
    type: 'article' | 'blog';
    created_at: string;
}

export default function ResourceDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [resource, setResource] = useState<Resource | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResource = async () => {
            const { data, error } = await supabase
                .from('resources')
                .select('*')
                .eq('slug', slug)
                .eq('published', true)
                .single();

            if (!error && data) setResource(data);
            setLoading(false);
        };

        fetchResource();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!resource) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
                <h1 className="text-4xl font-bold mb-4">Resource Not Found</h1>
                <p className="text-muted-foreground mb-8">The article or blog post you&apos;re looking for doesn&apos;t exist or is no longer available.</p>
                <Link href="/" className="px-6 py-3 bg-primary text-white rounded-full font-bold">
                    Back to Homepage
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen">
            {/* Hero Header */}
            <article className="max-w-[1000px] mx-auto pt-24 pb-32 px-4 sm:px-6">
                <header className="mb-12">
                    <Link href={resource.type === 'blog' ? '/blog' : '/articles'} className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-8 group">
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Back to {resource.type === 'blog' ? 'Blog' : 'Articles'}
                    </Link>

                    <div className="flex items-center gap-3 mb-6">
                        <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest ${resource.type === 'blog' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                            {resource.type}
                        </span>
                        <div className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                            <Calendar className="w-4 h-4" />
                            {new Date(resource.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-8">
                        {resource.title}
                    </h1>

                    <div className="flex items-center justify-between border-y border-border py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                IK
                            </div>
                            <div>
                                <p className="text-sm font-bold">Ignite Kenya</p>
                                <p className="text-xs text-muted-foreground">Author</p>
                            </div>
                        </div>
                        <button className="p-2 border border-border rounded-full hover:bg-secondary transition-colors">
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                </header>

                {resource.image_url && (
                    <div className="aspect-[21/9] relative rounded-[48px] overflow-hidden mb-16 shadow-2xl">
                        <Image
                            src={resource.image_url}
                            alt={resource.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                <div className="prose prose-xl prose-primary max-w-none">
                    <div className="whitespace-pre-wrap text-lg sm:text-xl leading-relaxed text-muted-foreground/90 font-light">
                        {resource.content}
                    </div>
                </div>

                <footer className="mt-24 pt-12 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div>
                        <h3 className="text-lg font-bold mb-2">Think this is important?</h3>
                        <p className="text-muted-foreground italic">Share this story with your friends and community.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-8 py-4 bg-primary text-white rounded-full font-bold hover:shadow-xl transition-all active:scale-95">
                            Share Post
                        </button>
                    </div>
                </footer>
            </article>
        </main>
    );
}
