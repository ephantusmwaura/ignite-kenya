import type { Metadata } from "next";
import EventsList from "../../components/public/EventsList";

export const metadata: Metadata = {
    title: "Events | Ignite Kenya",
    description: "Discover upcoming workshops, exhibitions, and community events from Ignite Kenya.",
};

export default function EventsPage() {
    return <EventsList />;
}
