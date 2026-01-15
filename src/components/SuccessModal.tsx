'use client';

import { useEffect, useState } from 'react';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    icon?: string;
    autoClose?: boolean;
    autoCloseDelay?: number;
}

export default function SuccessModal({
    isOpen,
    onClose,
    title,
    message,
    icon = '🎉',
    autoClose = false,
    autoCloseDelay = 3000
}: SuccessModalProps) {
    const [particles, setParticles] = useState<Array<{ left: string; delay: string }>>([]);

    useEffect(() => {
        if (isOpen) {
            // Generate celebration particles
            const particleData = Array.from({ length: 30 }, () => ({
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

            {/* Celebration Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map((particle, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)] animate-confetti"
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
                <div className="glass-dark rounded-3xl border-2 border-[hsl(190,95%,50%)]/50 overflow-hidden elevated">
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(190,95%,50%)]/20 via-[hsl(260,80%,60%)]/20 to-[hsl(280,70%,55%)]/20 opacity-50" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[hsl(190,95%,50%)]/20 rounded-full blur-3xl animate-pulse-slow" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[hsl(260,80%,60%)]/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

                    {/* Content */}
                    <div className="relative z-10 p-8 text-center">
                        {/* Icon */}
                        <div className="mb-6 relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-24 h-24 bg-gradient-to-br from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)] rounded-full blur-2xl opacity-50 animate-pulse-slow" />
                            </div>
                            <div className="relative text-7xl animate-bounce-slow glow-text">
                                {icon}
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-3xl font-bold text-white mb-3 font-display gradient-text">
                            {title}
                        </h2>

                        {/* Message */}
                        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                            {message}
                        </p>

                        {/* Success Indicator */}
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <div className="flex gap-1">
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-2 h-2 rounded-full bg-[hsl(190,95%,50%)] animate-pulse"
                                        style={{ animationDelay: `${i * 200}ms` }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="w-full bg-gradient-to-r from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)] text-white py-4 rounded-xl font-bold glow hover:scale-[1.02] transition-cyber group"
                        >
                            <span className="flex items-center justify-center gap-2">
                                Continue
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
