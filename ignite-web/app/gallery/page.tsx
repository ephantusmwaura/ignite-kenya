"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "../../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryImage {
    id: string;
    image_url: string;
    alt_text: string;
    created_at: string;
}

export default function GalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGallery = async () => {
            const { data } = await supabase
                .from('gallery')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) setImages(data);
            setLoading(false);
        };

        fetchGallery();

        const channel = supabase
            .channel('public:gallery')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery' }, () => {
                fetchGallery();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-background py-20 px-4">
                <div className="max-w-7xl mx-auto text-center mb-12">
                    <div className="h-10 w-48 bg-gray-200 rounded-lg mx-auto animate-pulse mb-4" />
                    <div className="h-6 w-64 bg-gray-100 rounded-lg mx-auto animate-pulse" />
                </div>
                <div className="columns-1 md:columns-3 gap-4 space-y-4 max-w-7xl mx-auto animate-pulse">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className={`w-full bg-gray-100 rounded-xl ${i % 2 === 0 ? 'h-64' : 'h-48'}`} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-20 px-4">
            <div className="max-w-7xl mx-auto text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Gallery</h1>
                <p className="text-muted text-lg">Moments of impact captured in frame.</p>
            </div>

            <div className="columns-1 md:columns-3 gap-4 space-y-4 max-w-7xl mx-auto">
                <AnimatePresence mode="popLayout">
                    {images.map((img, i) => (
                        <motion.div
                            key={img.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: i * 0.05 }}
                            className="break-inside-avoid rounded-xl overflow-hidden bg-surface group relative cursor-pointer"
                        >
                            <Image
                                src={img.image_url}
                                alt={img.alt_text}
                                width={800}
                                height={600}
                                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                <p className="text-white font-medium text-sm">{img.alt_text}</p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {images.length === 0 && (
                    <div className="col-span-full py-24 text-center text-gray-400 italic">
                        No images in the gallery yet.
                    </div>
                )}
            </div>
        </div>
    );
}
