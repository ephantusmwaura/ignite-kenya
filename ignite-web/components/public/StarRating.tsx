"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

interface StarRatingProps {
    targetId: string;
    targetType: "project" | "program";
}

export default function StarRating({ targetId, targetType }: StarRatingProps) {
    const [rating, setRating] = useState<number | null>(null);
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const [average, setAverage] = useState<number>(0);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [hasRated, setHasRated] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const fetchRatings = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("ratings")
            .select("rating")
            .eq("target_id", targetId);

        if (!error && data) {
            const total = data.reduce((acc, curr) => acc + curr.rating, 0);
            const avg = data.length > 0 ? total / data.length : 0;
            setAverage(parseFloat(avg.toFixed(1)));
            setCount(data.length);
        }
        setLoading(false);
    }, [targetId]);

    useEffect(() => {
        // Check local storage
        const ratedItems = JSON.parse(localStorage.getItem("rated_items") || "[]");
        if (ratedItems.includes(targetId)) {
            setHasRated(true);
        }

        fetchRatings();
    }, [targetId, fetchRatings]);

    const handleRate = async (value: number) => {
        if (hasRated || submitting) return;
        setSubmitting(true);

        try {
            const { error } = await supabase
                .from("ratings")
                .insert([{ target_id: targetId, target_type: targetType, rating: value }]);

            if (error) throw error;

            // Update local storage
            const ratedItems = JSON.parse(localStorage.getItem("rated_items") || "[]");
            localStorage.setItem("rated_items", JSON.stringify([...ratedItems, targetId]));

            setHasRated(true);
            setRating(value);
            fetchRatings(); // Refresh stats
        } catch (error) {
            console.error("Error submitting rating:", error);
            alert("Failed to submit rating");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm max-w-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Rate this {targetType}</h3>
            <div className="flex items-center gap-4 mb-4">
                <div className="flex gap-1" onMouseLeave={() => setHoverRating(null)}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => handleRate(star)}
                            onMouseEnter={() => !hasRated && setHoverRating(star)}
                            disabled={hasRated || submitting}
                            className={`transition-transform duration-200 ${!hasRated && "hover:scale-110"}`}
                        >
                            <Star
                                className={`w-8 h-8 ${(hoverRating || rating || 0) >= star
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "fill-gray-100 text-gray-300"
                                    }`}
                            />
                        </button>
                    ))}
                </div>
                {(submitting || loading) && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="font-bold text-gray-900 text-lg">{average}</span>
                <div className="flex">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-3 h-3 ${i < Math.round(average) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                        />
                    ))}
                </div>
                <span>({count} votes)</span>
            </div>

            {hasRated && (
                <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-primary text-sm font-medium mt-3"
                >
                    Thank you for your feedback!
                </motion.p>
            )}
        </div>
    );
}
