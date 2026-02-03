import type { Metadata } from "next";
import AboutContent from "@/components/public/AboutContent";

export const metadata: Metadata = {
    title: "About Us | Ignite Kenya",
    description: "Learn about our mission, vision, and the team driving youth empowerment in Nakuru.",
};

export default function AboutPage() {
    return <AboutContent />;
}
