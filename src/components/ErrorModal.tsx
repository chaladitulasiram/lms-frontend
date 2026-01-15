'use client';

import { useEffect, useState } from 'react';

interface ErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    icon?: string;
    autoClose?: boolean;
    autoCloseDelay?: number;
}

export default function ErrorModal({
    isOpen,
    onClose,
    title,
    message,
    icon = '⚠️',
    autoClose = false,
    autoCloseDelay = 3000
}: ErrorModalProps) {
    const [particles, setParticles] = useState<Array<{ left: string; delay: string }>>([]);

    useEffect(() => {
        if (isOpen) {
            // Generate warning particles
            const particleData = Array.from({ length: 20 }, () => ({
                left: `${Math.random() * 100}%`,
                delay: `${Math.random() * 0.5}s`,
            }));
            setParticles(particleData);

            // Auto close if enabled
            if (autoClose) {
                const timer = setTimeout(() => {
                    onClose();
                }, autoCloseDelay);
                return () => clearTimeout(timer);
            }
        }
    }, [isOpen, autoClose, autoCloseDelay, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Warning Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map((particle, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 animate-confetti opacity-60"
                        style={{
                            left: particle.left,
                            animationDelay: particle.delay,
                            top: '-20px'
                        }}
                    />
                ))}
            </div>

            {/* Modal Content */}
            <div className="relative z-10 w-full max-w-md animate-scaleIn">
                <div className="glass-dark rounded-3xl border-2 border-red-500/50 overflow-hidden elevated">
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-orange-500/20 to-yellow-500/20 opacity-50" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/20 rounded-full blur-3xl animate-pulse-slow" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

                    {/* Content */}
                    <div className="relative z-10 p-8 text-center">
                        {/* Icon */}
                        <div className="mb-6 relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-full blur-2xl opacity-50 animate-pulse-slow" />
                            </div>
                            <div className="relative text-7xl animate-bounce-slow glow-text">
                                {icon}
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-3xl font-bold text-white mb-3 font-display">
                            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                                {title}
                            </span>
                        </h2>

                        {/* Message */}
                        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                            {message}
                        </p>

                        {/* Error Indicator */}
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <div className="flex gap-1">
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-2 h-2 rounded-full bg-red-500 animate-pulse"
                                        style={{ animationDelay: `${i * 200}ms` }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group relative overflow-hidden"
                        >
                            {/* Button Shine Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>

                            <span className="relative flex items-center justify-center gap-2">
                                Understood
                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
