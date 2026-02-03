"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/components/assets/logo.png";
import { Mail, Lock, AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Security States
    const [isLocked, setIsLocked] = useState(false);
    const [lockoutTime, setLockoutTime] = useState(0);

    // Check Lockout on Mount
    // Check Lockout on Mount
    useEffect(() => {
        const lockedUntil = localStorage.getItem('lockoutUntil');
        if (lockedUntil) {
            const timeLeft = parseInt(lockedUntil) - Date.now();
            if (timeLeft > 0) {
                setIsLocked(true);
                setLockoutTime(Math.ceil(timeLeft / 1000));
            } else {
                localStorage.removeItem('lockoutUntil');
                localStorage.removeItem('failedAttempts');
            }
        }
    }, []);

    // Countdown Timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isLocked) {
            interval = setInterval(() => {
                setLockoutTime((prev) => {
                    if (prev <= 1) {
                        setIsLocked(false);
                        localStorage.removeItem('lockoutUntil');
                        localStorage.removeItem('failedAttempts');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isLocked]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (isLocked) return;

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            // Success: Clear security tracking
            localStorage.removeItem('failedAttempts');
            localStorage.removeItem('lockoutUntil');
            setIsSuccess(true);

            setTimeout(() => {
                router.push("/dashboard");
            }, 1800);
        } catch (err: unknown) {
            // Failure: Increment attempts
            const currentAttempts = parseInt(localStorage.getItem('failedAttempts') || '0') + 1;
            localStorage.setItem('failedAttempts', currentAttempts.toString());

            if (currentAttempts >= 4) {
                const lockoutEnd = Date.now() + 2 * 60 * 1000; // 2 minutes
                localStorage.setItem('lockoutUntil', lockoutEnd.toString());
                setIsLocked(true);
                setLockoutTime(120);
                setError("Too many failed attempts. Login disabled for 2 minutes.");
            } else {
                setError(err instanceof Error ? err.message : "An error occurred during login");
            }
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white relative overflow-hidden">
            <AnimatePresence mode="wait">
                {!isSuccess ? (
                    <motion.div
                        key="login-form"
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5 }}
                        className="min-h-screen flex flex-col md:flex-row relative"
                    >
                        {/* Massive Middle Logo (Desktop Only) */}
                        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
                            <motion.div
                                initial={{ scale: 0.2, opacity: 0, rotate: -10 }}
                                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: [
                                        "0 20px 40px -15px rgba(255, 85, 0, 0.1)",
                                        "0 25px 60px -10px rgba(255, 85, 0, 0.4)",
                                        "0 20px 40px -15px rgba(255, 85, 0, 0.1)"
                                    ]
                                }}
                                transition={{
                                    boxShadow: {
                                        repeat: Infinity,
                                        duration: 2,
                                        ease: "easeInOut"
                                    },
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20
                                }}
                                className="bg-white/80 backdrop-blur-md p-8 rounded-[3rem] shadow-2xl shadow-black/5 ring-1 ring-white transition-colors hover:bg-white pointer-events-auto cursor-pointer"
                            >
                                <Image
                                    src={logo}
                                    alt="Ignite Kenya"
                                    width={240}
                                    height={240}
                                    className="object-contain"
                                />
                            </motion.div>
                        </div>

                        {/* Left Side: Branding/Welcome Section */}
                        <div className="hidden md:flex w-1/2 bg-gray-900 relative items-center justify-center p-12 overflow-hidden border-r border-white/5">
                            {/* Abstract Background Decoration */}
                            <div className="absolute top-0 left-0 w-full h-full">
                                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] opacity-50" />
                                <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] opacity-30" />
                            </div>

                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="relative z-10 max-w-lg md:pr-24"
                            >
                                <h1 className="text-5xl font-black text-white tracking-tighter leading-[1] mb-8">
                                    Ignite Kenya
                                </h1>
                                <p className="text-base text-gray-400 mb-12 font-medium leading-relaxed max-w-sm">
                                    Access your dashboard and manage your organization with ease. Trusted by leading companies.
                                </p>

                                <div className="space-y-5">
                                    <div className="flex items-center gap-4 text-white/80 group">
                                        <div className="p-2 bg-white/5 rounded-lg ring-1 ring-white/10 group-hover:bg-primary/20 transition-colors">
                                            <CheckCircle2 className="w-5 h-5 text-primary" />
                                        </div>
                                        <span className="font-bold tracking-wide text-base">Secure Admin Environment</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-white/80 group">
                                        <div className="p-2 bg-white/5 rounded-lg ring-1 ring-white/10 group-hover:bg-primary/20 transition-colors">
                                            <CheckCircle2 className="w-5 h-5 text-primary" />
                                        </div>
                                        <span className="font-bold tracking-wide text-base">Real-time Data Sync</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Side: Login Form Section */}
                        <div className="flex-1 flex items-center justify-center p-8 bg-white relative">
                            {/* Mobile Background Decoration */}
                            <div className="md:hidden absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
                                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]" />
                            </div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="w-full max-w-md md:pl-24"
                            >
                                {/* Mobile Logo Only */}
                                <div className="md:hidden mb-12 flex justify-center">
                                    <Image src={logo} alt="Ignite Kenya" width={100} height={100} className="object-contain" />
                                </div>

                                <div className="mb-12">
                                    <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                                        Sign In
                                    </h2>
                                    <p className="text-gray-500 font-medium text-base">
                                        Enter your credentials to access your account
                                    </p>
                                </div>

                                <form onSubmit={handleLogin} className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-xs font-semibold text-gray-500 ml-1 uppercase tracking-wide">Email Address</label>
                                        <div className="group relative">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="email"
                                                placeholder="ignitekenya@gmail.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full pl-14 pr-4 py-5 bg-gray-50 border border-gray-100 rounded-[2rem] focus:bg-white focus:border-primary/20 focus:ring-8 focus:ring-primary/5 transition-all outline-none font-medium text-gray-900 text-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                required
                                                disabled={loading || isLocked}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between ml-1">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Password</label>
                                        </div>
                                        <div className="group relative">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                                <Lock className="w-5 h-5" />
                                            </div>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full pl-14 pr-14 py-5 bg-gray-50 border border-gray-100 rounded-[2rem] focus:bg-white focus:border-primary/20 focus:ring-8 focus:ring-primary/5 transition-all outline-none font-medium text-gray-900 text-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                required
                                                disabled={loading || isLocked}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors p-2 disabled:opacity-50"
                                                disabled={loading || isLocked}
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center gap-3 text-red-600 bg-red-50 p-5 rounded-2xl border border-red-100 text-sm font-medium"
                                        >
                                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                            <span>
                                                {error}
                                                {isLocked && <span className="block mt-1 font-bold">Try again in {lockoutTime} seconds</span>}
                                            </span>
                                        </motion.div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading || isLocked}
                                        className="w-full relative group bg-gray-900 text-white py-5 rounded-[2rem] font-bold flex items-center justify-center gap-3 hover:bg-gray-800 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none shadow-2xl shadow-black/5 text-lg"
                                    >
                                        {loading ? (
                                            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <span>Sign In</span>
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>

                                <div className="mt-16 flex items-center justify-between pt-10 border-t border-gray-100">

                                    <span className="text-[10px] font-medium text-gray-300 uppercase tracking-[0.3em]">
                                        v1.1.10
                                    </span>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success-transition"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-[100] bg-white flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: [0.5, 1.2, 8], opacity: [0, 1, 1] }}
                            transition={{
                                duration: 1.5,
                                times: [0, 0.4, 1],
                                ease: "easeInOut"
                            }}
                            className="relative"
                        >
                            <Image
                                src={logo}
                                alt="Success"
                                width={240}
                                height={240}
                                className="object-contain"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

