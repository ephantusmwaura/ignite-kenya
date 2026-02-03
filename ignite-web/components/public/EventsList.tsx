"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Clock, Ticket, CreditCard } from "lucide-react";
import { supabase } from "../../lib/supabase";
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

export default function EventsList() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEvents() {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('event_date', { ascending: true });

            if (!error && data) {
                setEvents(data);
            }
            setLoading(false);
        }

        fetchEvents();

        // Refresh statuses every minute
        const timer = setInterval(() => {
            setEvents(prev => [...prev]);
        }, 60000);

        return () => clearInterval(timer);
    }, []);

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

    // Sort events: upcoming first, then happening now, then past
    const sortedEvents = [...events].sort((a, b) => {
        const statusA = getEventStatus(a.event_date, a.start_time, a.end_time);
        const statusB = getEventStatus(b.event_date, b.start_time, b.end_time);

        if (statusA === "ended" && statusB !== "ended") return 1;
        if (statusA !== "ended" && statusB === "ended") return -1;

        return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-6 py-32">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary/5 via-white to-white py-20">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                            Upcoming Events
                        </h1>
                        <p className="text-xl text-muted leading-relaxed">
                            Join us for inspiring workshops, exhibitions, and community gatherings that celebrate creativity and empower young artists in Nakuru.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Events Grid */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    {sortedEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {sortedEvents.map((event, index) => {
                                const status = getEventStatus(event.event_date, event.start_time, event.end_time);

                                return (
                                    <Link href={`/events/${event.id}`} key={event.id}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                            className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                                        >
                                            {/* Event Image */}
                                            <div className="relative h-56 bg-gray-100 overflow-hidden">
                                                {event.image_url ? (
                                                    <Image
                                                        src={event.image_url}
                                                        alt={event.title}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                                                        <Calendar className="w-16 h-16 text-primary/30" />
                                                    </div>
                                                )}

                                                {/* Status Badge */}
                                                {status === "happening-now" && (
                                                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5">
                                                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                                        Happening Now
                                                    </div>
                                                )}
                                                {status === "upcoming" && (
                                                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-full shadow-lg">
                                                        Upcoming
                                                    </div>
                                                )}

                                                {/* Event Ended Overlay */}
                                                {status === "ended" && (
                                                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                                                        <div className="text-center">
                                                            <p className="text-white text-2xl font-bold">Event Ended</p>
                                                            <p className="text-white/80 text-sm mt-1">This event has concluded</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Category Badge */}
                                                <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-full">
                                                    {event.category}
                                                </div>
                                            </div>

                                            {/* Event Details */}
                                            <div className="p-6 space-y-4">
                                                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                                                    {event.title}
                                                </h3>

                                                {event.description && (
                                                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                                                        {event.description}
                                                    </p>
                                                )}

                                                <div className="space-y-2 pt-2">
                                                    <div className="flex items-center gap-2 text-gray-700">
                                                        <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                                                        <span className="text-sm font-medium">{formatDate(event.event_date)}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-gray-700">
                                                        <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                                                        <span className="text-sm">{formatTime(event.start_time)} - {formatTime(event.end_time)}</span>
                                                    </div>

                                                    <div className="flex items-start gap-2 text-gray-700">
                                                        <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm">{event.venue}</span>
                                                    </div>

                                                    {event.ticket_price && (
                                                        <div className="flex items-center gap-2 text-gray-700">
                                                            <Ticket className="w-4 h-4 text-primary flex-shrink-0" />
                                                            <span className="text-sm font-semibold">{event.ticket_price}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Purchase Methods */}
                                                {event.purchase_methods && event.purchase_methods.length > 0 && status !== "ended" && (
                                                    <div className="pt-4 border-t border-gray-100">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <CreditCard className="w-4 h-4 text-primary" />
                                                            <p className="text-sm font-semibold text-gray-900">Get Tickets:</p>
                                                        </div>
                                                        <div className="space-y-2">
                                                            {event.purchase_methods.slice(0, 2).map((pm, idx) => (
                                                                <div key={idx} className="flex items-center justify-between text-sm bg-gray-50 px-3 py-2 rounded-lg">
                                                                    <span className="font-medium text-gray-700">{pm.method}</span>
                                                                    <span className="text-gray-600 truncate ml-2">{pm.details}</span>
                                                                </div>
                                                            ))}
                                                            {event.purchase_methods.length > 2 && (
                                                                <p className="text-xs text-primary font-medium">
                                                                    +{event.purchase_methods.length - 2} more options
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Events Available</h3>
                            <p className="text-gray-600">Check back soon for upcoming workshops and exhibitions!</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
