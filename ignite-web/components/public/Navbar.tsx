"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Menu, X, Facebook, Twitter, Instagram } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/components/assets/logo.png";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About us" },
    { href: "/programs", label: "Programs" },
    { href: "/projects", label: "Projects" },
    { href: "/events", label: "Events" },
    { href: "/donate", label: "Donate" },
    { href: "/gallery", label: "Gallery" },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Collapse if scrolled more than 100px
            const shouldCollapse = window.scrollY > 100;
            setIsCollapsed(shouldCollapse);
        };

        window.addEventListener("scroll", handleScroll);
        // Trigger once on mount to set initial state
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Animation variants for the "Genie" morph effect
    // Tweaked for smoother, silkier Feel (lower stiffness, optimized damping)
    const containerVariants = {
        expanded: {
            width: "95%",
            maxWidth: "1600px",
            // Responsive height: h-16 (64px) on mobile, h-24 (96px) on desktop
            height: typeof window !== 'undefined' && window.innerWidth < 768 ? "64px" : "96px",
            borderRadius: "9999px", // rounded-full
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(20px)",
            top: typeof window !== 'undefined' && window.innerWidth < 768 ? "12px" : "24px",
            // Smooth natural spring
            transition: { type: "spring" as const, stiffness: 100, damping: 20, mass: 1 },
        },
        collapsed: {
            width: "60px", // Button size
            maxWidth: "60px",
            height: "60px",
            borderRadius: "50%", // Circle
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(12px)",
            top: typeof window !== 'undefined' && window.innerWidth < 768 ? "12px" : "24px",
            // slightly snappier collapse but still smooth
            transition: { type: "spring" as const, stiffness: 100, damping: 20, mass: 1 },
        },
    };

    return (
        <>
            <motion.nav
                initial="expanded"
                animate={isCollapsed ? "collapsed" : "expanded"}
                variants={containerVariants}
                className="fixed left-0 right-0 mx-auto z-50 border border-white/20 shadow-xl overflow-hidden"
            >
                <AnimatePresence mode="wait">
                    {!isCollapsed ? (
                        // --- EXPANDED VIEW ---
                        <motion.div
                            key="expanded-content"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
                            className="w-full h-full px-6 lg:px-10 flex items-center justify-between"
                        >
                            {/* Left: Navigation Links */}
                            <div className="hidden md:flex items-center space-x-8">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="text-sm font-medium text-gray-900 hover:text-primary transition-colors tracking-wide"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>

                            {/* Center: Logo */}
                            <div className="flex-shrink-0 flex items-center justify-center absolute left-1/2 -translate-x-1/2">
                                <Link href="/" className="group">
                                    <div className="relative w-24 h-24 md:w-32 md:h-32 mt-2 md:mt-4 flex items-center justify-center transition-transform group-hover:scale-105">
                                        <Image
                                            src={logo}
                                            alt="Ignite Kenya Logo"
                                            width={150}
                                            height={150}
                                            className="object-contain w-full h-full drop-shadow-sm"
                                            priority
                                        />
                                    </div>
                                </Link>
                            </div>

                            {/* Right: Socials + CTA */}
                            <div className="hidden md:flex items-center space-x-6">
                                <div className="flex items-center space-x-4 text-muted-foreground">
                                    <Link href="#" className="hover:text-primary transition-colors"><Twitter className="w-4 h-4" /></Link>
                                    <Link href="https://www.facebook.com/share/1GpKus1v1g/?mibextid=wwXlfr" className="hover:text-primary transition-colors"><Facebook className="w-4 h-4" /></Link>
                                    <Link href="https://www.instagram.com/ignite_kenya?igsh=MXVkMWlyZXkyeWhsNw==" className="hover:text-primary transition-colors"><Instagram className="w-4 h-4" /></Link>
                                </div>
                                <Link href="/contact">
                                    {/* Updated to use Brand Orange (primary) */}
                                    <Button className="rounded-full bg-primary text-white hover:bg-orange-600 font-bold px-6 h-10 text-sm shadow-md hover:shadow-lg transition-all">
                                        Contact us →
                                    </Button>
                                </Link>
                            </div>

                            {/* Mobile Menu Button (Expanded) */}
                            <div className="md:hidden flex items-center w-full justify-between">
                                <div />{/* Spacer to keep hamburger on right if logo is center */}
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="text-foreground p-2 focus:outline-none z-50 ml-auto"
                                >
                                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                                </button>
                            </div>

                        </motion.div>
                    ) : (
                        // --- COLLAPSED VIEW (SLEEK BUTTON) ---
                        <motion.div
                            key="collapsed-content"
                            initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.5, rotate: 180, transition: { duration: 0.3 } }}
                            className="w-full h-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} // Click to scroll top
                            title="Back to Top"
                        >
                            {/* Small Logo Icon */}
                            <div className="relative w-10 h-10">
                                <Image
                                    src={logo}
                                    alt="Ignite Kenya Logo"
                                    width={40}
                                    height={40}
                                    className="object-contain w-full h-full"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Mobile Nav Overlay - Moved outside to prevent clipping */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 top-20 md:top-24 bg-white/95 z-40 p-6 flex flex-col md:hidden"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-xl font-bold py-4 border-b border-gray-100"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="mt-8 flex space-x-6 justify-center">
                            <Link href="#" className="hover:text-primary transition-colors"><Twitter className="w-6 h-6 text-gray-600" /></Link>
                            <Link href="https://www.facebook.com/share/1GpKus1v1g/?mibextid=wwXlfr" className="hover:text-primary transition-colors"><Facebook className="w-6 h-6 text-gray-600" /></Link>
                            <Link href="https://www.instagram.com/ignite_kenya?igsh=MXVkMWlyZXkyeWhsNw==" className="hover:text-primary transition-colors"><Instagram className="w-6 h-6 text-gray-600" /></Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
