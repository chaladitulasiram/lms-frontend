'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    icon?: string;
    autoClose?: boolean;
    autoCloseDelay?: number;
}

const APPLE_EASE = [0.16, 1, 0.3, 1];

export default function ErrorModal({
    isOpen,
    onClose,
    title,
    message,
    icon = '⚠️',
    autoClose = false,
    autoCloseDelay = 3000
}: ErrorModalProps) {
    const [particles, setParticles] = useState<Array<{ left: string; delay: number }>>([]);

    useEffect(() => {
        if (isOpen) {
            // Generate warning particles
            const particleData = Array.from({ length: 15 }, () => ({
                left: `${Math.random() * 100}%`,
                delay: Math.random() * 0.5,
            }));
            setParticles(particleData);

            if (autoClose) {
                const timer = setTimeout(onClose, autoCloseDelay);
                return () => clearTimeout(timer);
            }
        }
    }, [isOpen, autoClose, autoCloseDelay, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: APPLE_EASE }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        onClick={onClose}
                    />

                    {/* Warning Particles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {particles.map((particle, i) => (
                            <motion.div
                                key={i}
                                initial={{ y: -20, opacity: 1 }}
                                animate={{ y: "100vh", opacity: 0 }}
                                transition={{ duration: 2.5, delay: particle.delay, ease: "easeOut" }}
                                className="absolute w-2 h-2 rounded-full bg-red-500/50"
                                style={{ left: particle.left }}
                            />
                        ))}
                    </div>

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.4, ease: APPLE_EASE }}
                        className="relative z-10 w-full max-w-sm bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                    >
                        {/* Ambient Glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[50px] rounded-full" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/10 blur-[50px] rounded-full" />

                        <div className="relative z-10 p-8 text-center">
                            <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6 text-4xl border border-white/10 shadow-inner">
                                <AlertTriangle className="w-8 h-8 text-red-400" />
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
                                {title}
                            </h2>

                            <p className="text-neutral-400 text-sm leading-relaxed mb-8">
                                {message}
                            </p>

                            <button
                                onClick={onClose}
                                className="w-full bg-white text-black py-3.5 rounded-xl font-semibold hover:bg-neutral-200 transition-colors shadow-lg shadow-white/5 active:scale-[0.98]"
                            >
                                Dismiss
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
