import type { Metadata } from "next";
import ProgramsList from "@/components/public/ProgramsList";

export const metadata: Metadata = {
    title: "Our Programs | Ignite Kenya",
    description: "Explore our youth programs including Art for Change, Leadership Labs, and Advocacy Campaigns.",
};

export default function ProgramsPage() {
    return <ProgramsList />;
}
