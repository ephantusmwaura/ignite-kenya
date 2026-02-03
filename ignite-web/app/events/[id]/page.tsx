"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Calendar, MapPin, Ticket, CreditCard, ArrowLeft, Share2 } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { motion } from "framer-motion";

interface Event {
    id: string;
    title: string;
    description: string;
    image_url: string | null;
    venue: string;
    event_date: string;
    start_time: string;
    end_time: string;
    ticket_price: string;
    purchase_methods: { method: string; details: string }[] | null;
    category: string;
    created_at: string;
}

export default function EventDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        async function fetchEvent() {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('id', params.id)
                .single();

            if (error || !data) {
                setNotFound(true);
            } else {
                setEvent(data);
            }
            setLoading(false);
        }

        if (params.id) {
            fetchEvent();
        }

        // Live status update: Refresh the status every minute
        const timer = setInterval(() => {
            // This empty setState forces a re-render to recalculate the status
            setEvent(prev => prev ? { ...prev } : null);
        }, 60000);

        return () => clearInterval(timer);
    }, [params.id]);

    const getEventStatus = (eventDate: string, startTime: string, endTime: string) => {
        const now = new Date();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const eventDateObj = new Date(eventDate);
        eventDateObj.setHours(0, 0, 0, 0);

        // Parse start and end times
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);

        const eventStartDateTime = new Date(eventDate);
        eventStartDateTime.setHours(startHours, startMinutes, 0, 0);

        const eventEndDateTime = new Date(eventDate);
        eventEndDateTime.setHours(endHours, endMinutes, 0, 0);

        // Check if event has ended (past end time)
        if (now > eventEndDateTime) {
            return "ended";
        }
        // Check if event is happening now (between start and end time)
        else if (now >= eventStartDateTime && now <= eventEndDateTime) {
            return "happening-now";
        }
        // Event is upcoming
        else {
            return "upcoming";
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString: string) => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: event?.title,
                text: event?.description,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (notFound || !event) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Event Not Found</h1>
                    <p className="text-gray-600 mb-8">The event you&apos;re looking for doesn&apos;t exist.</p>
                    <button
                        onClick={() => router.push('/events')}
                        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        Back to Events
                    </button>
                </div>
            </div>
        );
    }

    const status = getEventStatus(event.event_date, event.start_time, event.end_time);

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section with Event Image */}
            <section className="relative h-[60vh] min-h-[400px] bg-gray-900">
                {event.image_url ? (
                    <div className="absolute inset-0">
                        <Image
                            src={event.image_url}
                            alt={event.title}
                            fill
                            className="object-cover opacity-60"
                            priority
                        />
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5"></div>
                )}

                {/* Event Ended Overlay */}
                {status === "ended" && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-10">
                        <div className="text-center">
                            <p className="text-white text-4xl font-bold">Event Ended</p>
                            <p className="text-white/80 text-lg mt-2">This event has concluded</p>
                        </div>
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                <div className="container mx-auto px-6 h-full relative z-20">
                    <div className="h-full flex flex-col justify-end pb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <button
                                onClick={() => router.push('/events')}
                                className="flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Back to Events
                            </button>

                            {/* Status Badge */}
                            <div className="mb-4">
                                {status === "happening-now" && (
                                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-full shadow-lg">
                                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                        Happening Now
                                    </span>
                                )}
                                {status === "upcoming" && (
                                    <span className="inline-block px-4 py-2 bg-primary text-white text-sm font-bold rounded-full shadow-lg">
                                        Upcoming Event
                                    </span>
                                )}
                            </div>

                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                                {event.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 text-white/90">
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                                    {event.category}
                                </span>
                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium transition-colors"
                                >
                                    <Share2 className="w-4 h-4" />
                                    Share Event
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Event Details */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            {/* Date & Time */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-2xl border border-primary/20"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 rounded-xl">
                                        <Calendar className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Date & Time</h3>
                                        <p className="text-gray-700 font-medium">{formatDate(event.event_date)}</p>
                                        <p className="text-gray-600">{formatTime(event.start_time)} - {formatTime(event.end_time)}</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Venue */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-100 rounded-xl">
                                        <MapPin className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Venue</h3>
                                        <p className="text-gray-700">{event.venue}</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Ticket Price */}
                            {event.ticket_price && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-green-100 rounded-xl">
                                            <Ticket className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">Ticket Price</h3>
                                            <p className="text-gray-700 font-bold text-xl">{event.ticket_price}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Description */}
                        {event.description && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="mb-12"
                            >
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">About This Event</h2>
                                <div className="prose prose-lg max-w-none">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {event.description}
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Purchase Methods */}
                        {event.purchase_methods && event.purchase_methods.length > 0 && status !== "ended" && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl border border-purple-200"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-purple-100 rounded-xl">
                                        <CreditCard className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">Get Your Tickets</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {event.purchase_methods.map((pm, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-white p-4 rounded-xl border border-purple-200 hover:border-purple-400 transition-colors"
                                        >
                                            <p className="font-bold text-gray-900 mb-1">{pm.method}</p>
                                            <p className="text-gray-600">{pm.details}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>

        </div>
    );
}
