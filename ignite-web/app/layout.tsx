import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";

const inter = Inter({
    variable: "--font-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Ignite Kenya | Youth on fire for change",
    description: "Empowering youth through art to influence decision-making and social change in Nakuru County, Kenya.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={clsx(inter.variable, "antialiased bg-background text-foreground font-sans")}
            >
                <Navbar />
                <main className="pt-32 md:pt-44">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}
