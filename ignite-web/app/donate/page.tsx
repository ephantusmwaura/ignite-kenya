"use client";

import { motion } from "framer-motion";
import { Check, Wallet, Globe, Heart } from "lucide-react";
import Link from "next/link";

// --- Custom Brand Assets ---

// Updated: "M-Changa Africa" - No underline, smaller font
const MchangaLogo = ({ className = "w-48" }: { className?: string }) => (
    <svg viewBox="0 0 320 60" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="42" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="32" fill="white">M</text>
        <path d="M32 28 H38" stroke="white" strokeWidth="4" strokeLinecap="round" />
        <text x="42" y="42" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="32" fill="white">Changa</text>
        <text x="175" y="42" fontFamily="Arial, sans-serif" fontWeight="300" fontSize="32" fill="white" opacity="0.9">Africa</text>
        <circle cx="280" cy="15" r="5" fill="#ffffff" />
    </svg>
);

// Updated: "GoFundMe Global" - No underline, matches style
const GoFundMeLogo = ({ className = "w-40" }: { className?: string }) => (
    <svg viewBox="0 0 300 60" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25 30 C 25 18, 40 18, 40 30 C 40 42, 25 42, 25 30" fill="white" />
        <text x="48" y="40" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="30" fill="white" letterSpacing="-0.5">gofundme</text>
        <text x="200" y="40" fontFamily="Arial, sans-serif" fontWeight="300" fontSize="30" fill="white" opacity="0.9">Global</text>
    </svg>
);

// --- Content Data ---

const impactItems = [
    { amount: "KES 1,500", label: "Art Supplies Kit", desc: "Provides paints, brushes, and canvas for one student for a month." },
    { amount: "KES 5,000", label: "Workshop Session", desc: "Sponsors a full day community art workshop for 20 youths." },
    { amount: "KES 10,000", label: "Exhibition Space", desc: "Helps rent space to showcase youth artwork to the public." },
];

export default function DonatePage() {
    return (
        <div className="min-h-screen bg-white">

            {/* 1. Hero Section */}
            <section className="pt-24 pb-12 px-6 lg:px-8 max-w-7xl mx-auto text-center perspective-1000">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto space-y-6"
                >
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-black mb-4">
                        Invest in <br /><span className="text-primary italic font-serif">Future Leaders</span>
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed font-light">
                        Every shilling goes directly towards materials, mentorship, and spaces that allow young creatives in Nakuru to thrive.
                    </p>
                </motion.div>
            </section>

            {/* 2. Donation Cards (Circle to Rectangle Genie Effect) */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">

                    {/* Mchanga Card */}
                    <Link href="https://www.mchanga.africa/fundraiser/126676?_gl=1*bd4v6q*_gcl_au*NzE1NTUwMTA3LjE3NjM2MzkzNDMuODgxNzM1MTUxLjE3NjQwNzAxMzguMTc2NDA3MDEzOA" target="_blank" rel="noopener noreferrer" className="block outline-none mx-auto">
                        <motion.div
                            initial="circle"
                            whileHover="rectangle"
                            variants={{
                                circle: {
                                    width: "400px",
                                    height: "400px",
                                    borderRadius: "50%",
                                    transition: { type: "spring" as const, stiffness: 100, damping: 20, mass: 1 }
                                },
                                rectangle: {
                                    width: "100%",
                                    height: "480px",
                                    borderRadius: "24px",
                                    transition: { type: "spring" as const, stiffness: 100, damping: 20, mass: 1 }
                                }
                            }}
                            className="bg-[#009fe3] relative overflow-hidden flex flex-col justify-center items-center shadow-2xl shadow-blue-100 cursor-pointer group border-4 border-white ring-1 ring-gray-100"
                        >
                            {/* Bg Pattern */}
                            <div className="absolute inset-0 bg-blue-500/10 pointer-events-none" />
                            <div className="absolute top-0 right-0 p-12 opacity-5 transform translate-x-12 -translate-y-12">
                                <Globe className="w-64 h-64 text-white" />
                            </div>

                            {/* Logo - Always visible, scales slightly on hover */}
                            <motion.div
                                variants={{
                                    circle: { y: 0, scale: 1 },
                                    rectangle: { y: -60, scale: 0.9 }
                                }}
                                transition={{ type: "spring" as const, stiffness: 150, damping: 20 }}
                                className="relative z-10 p-8"
                            >
                                <MchangaLogo className="w-72 drop-shadow-sm" />
                            </motion.div>

                            {/* Hidden Content - Fades in and slides up on hover */}
                            <motion.div
                                variants={{
                                    circle: { opacity: 0, y: 100, scale: 0.8 },
                                    rectangle: { opacity: 1, y: 0, scale: 1 }
                                }}
                                transition={{ type: "spring" as const, stiffness: 150, damping: 20 }}
                                className="absolute bottom-0 left-0 right-0 p-12 text-center flex flex-col items-center bg-gradient-to-t from-[#008bc7] via-[#009fe3] to-transparent w-full"
                            >
                                <p className="text-white text-lg font-medium mb-8 leading-relaxed max-w-sm">
                                    Instant support via M-PESA, Airtel Money, and local cards. The Kenyan way to give.
                                </p>
                                <div className="h-14 w-full max-w-[200px] bg-white text-[#009fe3] rounded-full flex items-center justify-center font-bold text-base hover:bg-blue-50 transition-colors shadow-lg">
                                    Donate Now
                                </div>
                            </motion.div>
                        </motion.div>
                    </Link>

                    {/* GoFundMe Card */}
                    <Link href="https://gofund.me/6b49bfb99" target="_blank" rel="noopener noreferrer" className="block outline-none mx-auto">
                        <motion.div
                            initial="circle"
                            whileHover="rectangle"
                            variants={{
                                circle: {
                                    width: "400px",
                                    height: "400px",
                                    borderRadius: "50%",
                                    transition: { type: "spring" as const, stiffness: 100, damping: 20, mass: 1 }
                                },
                                rectangle: {
                                    width: "100%",
                                    height: "480px",
                                    borderRadius: "24px",
                                    transition: { type: "spring" as const, stiffness: 100, damping: 20, mass: 1 }
                                }
                            }}
                            className="bg-[#02a95c] relative overflow-hidden flex flex-col justify-center items-center shadow-2xl shadow-green-100 cursor-pointer group border-4 border-white ring-1 ring-gray-100"
                        >
                            {/* Bg Pattern */}
                            <div className="absolute inset-0 bg-green-600/10 pointer-events-none" />
                            <div className="absolute top-0 right-0 p-12 opacity-5 transform translate-x-12 -translate-y-12">
                                <Heart className="w-64 h-64 text-white" />
                            </div>

                            {/* Logo - Always visible, scales slightly on hover */}
                            <motion.div
                                variants={{
                                    circle: { y: 0, scale: 1 },
                                    rectangle: { y: -60, scale: 0.9 }
                                }}
                                transition={{ type: "spring" as const, stiffness: 150, damping: 20 }}
                                className="relative z-10 p-8"
                            >
                                <GoFundMeLogo className="w-64 drop-shadow-sm" />
                            </motion.div>

                            {/* Hidden Content - Fades in and slides up on hover */}
                            <motion.div
                                variants={{
                                    circle: { opacity: 0, y: 100, scale: 0.8 },
                                    rectangle: { opacity: 1, y: 0, scale: 1 }
                                }}
                                transition={{ type: "spring" as const, stiffness: 150, damping: 20 }}
                                className="absolute bottom-0 left-0 right-0 p-12 text-center flex flex-col items-center bg-gradient-to-t from-[#028e4d] via-[#02a95c] to-transparent w-full"
                            >
                                <p className="text-white text-lg font-medium mb-8 leading-relaxed max-w-sm">
                                    Join our international community. Secure donations from anywhere in the world.
                                </p>
                                <div className="h-14 w-full max-w-[200px] bg-white text-[#02a95c] rounded-full flex items-center justify-center font-bold text-base hover:bg-green-50 transition-colors shadow-lg">
                                    Support Us
                                </div>
                            </motion.div>
                        </motion.div>
                    </Link>

                </div>
            </section>

            {/* 3. Impact Grid (Content Density) */}
            <section className="py-20 bg-neutral-50 border-t border-neutral-100 mt-12">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Your Impact Realized</h2>
                        <p className="text-gray-500 max-w-xl mx-auto">
                            We believe in radical transparency. Here is exactly what your contribution achieves on the ground.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {impactItems.map((item, i) => (
                            <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                                <div className="text-primary font-bold text-3xl mb-2">{item.amount}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.label}</h3>
                                <p className="text-gray-500 leading-relaxed text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-8 opacity-70 grayscale hover:grayscale-0 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                <Wallet className="w-6 h-6 text-gray-600" />
                            </div>
                            <div className="text-sm font-medium">
                                <div className="text-gray-900">100% Secure</div>
                                <div className="text-gray-500">Encrypted Payments</div>
                            </div>
                        </div>
                        <div className="w-px h-12 bg-gray-200 hidden md:block" />
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                <Check className="w-6 h-6 text-gray-600" />
                            </div>
                            <div className="text-sm font-medium">
                                <div className="text-gray-900">Verified NGO</div>
                                <div className="text-gray-500">Registered in Kenya</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
