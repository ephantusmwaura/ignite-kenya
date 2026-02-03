"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "./Button";
import { useEffect } from "react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
    isLoading?: boolean;
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Delete",
    cancelText = "Cancel",
    variant = "danger",
    isLoading = false
}: ConfirmModalProps) {
    // Lock scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-[101] overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${variant === 'danger' ? 'bg-red-50 text-red-600' :
                                        variant === 'warning' ? 'bg-orange-50 text-orange-600' :
                                            'bg-blue-50 text-blue-600'
                                    }`}>
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                            <p className="text-gray-600 leading-relaxed">{message}</p>
                        </div>

                        <div className="bg-gray-50 p-6 flex flex-col sm:flex-row gap-3">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="flex-1 rounded-xl"
                                disabled={isLoading}
                            >
                                {cancelText}
                            </Button>
                            <Button
                                variant="primary"
                                onClick={onConfirm}
                                className={`flex-1 rounded-xl shadow-lg transition-all ${variant === 'danger' ? 'bg-red-600 hover:bg-red-700 shadow-red-200' :
                                        'bg-primary shadow-primary/20'
                                    }`}
                                disabled={isLoading}
                            >
                                {isLoading ? "Processing..." : confirmText}
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
