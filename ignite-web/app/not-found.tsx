"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/components/assets/logo.png";
import error404 from "@/components/assets/404.png";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto flex flex-col">
            {/* Top Header with Logo */}
            <header className="flex justify-center py-8">
                <div className="relative w-40 h-40">
                    <Image
                        src={logo}
                        alt="Ignite Kenya Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-20">
                <div className="relative w-full max-w-lg aspect-video mb-8">
                    <Image
                        src={error404}
                        alt="404 Page Not Found"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>

                <div className="text-center max-w-md mx-auto space-y-4">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        404 Error
                    </h1>
                    <p className="text-gray-500 text-lg">
                        The page you are looking for might have been removed, had its name changed, or your internet connectivity might be temporarily unavailable.
                    </p>

                    <div className="pt-6">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 bg-[#f97316] text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-all hover:gap-3 shadow-lg hover:shadow-xl"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Home
                        </Link>
                    </div>
                </div>
            </main>

            {/* Simple Footer */}
            <footer className="py-8 text-center text-gray-400 text-sm border-t border-gray-100">
                <p>&copy; {new Date().getFullYear()} Ignite Kenya. All rights reserved.</p>
                <div className="flex justify-center gap-6 mt-2">
                    <Link href="/contact" className="hover:text-[#f97316] transition-colors">Contact Support</Link>
                    <Link href="/" className="hover:text-[#f97316] transition-colors">Home</Link>
                </div>
            </footer>
        </div>
    );
}
