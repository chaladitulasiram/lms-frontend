'use client';

import { motion } from 'framer-motion';
import { Monitor } from 'lucide-react';

export const CinematicLoader = ({ text = "Processing..." }: { text?: string }) => {
    return (
        <div className="flex items-center justify-center min-h-[50vh] w-full">
            <div className="flex flex-col items-center gap-6 p-8 rounded-3xl bg-black/40 backdrop-blur-md border border-white/5">
                <div className="relative">
                    <Monitor className="w-12 h-12 text-blue-500/80 animate-pulse relative z-10" />
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl animate-pulse" />
                </div>

                <div className="w-48 h-[2px] bg-neutral-800 rounded-full overflow-hidden relative">
                    <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent w-1/2"
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                <p className="text-xs font-semibold text-blue-400 tracking-[0.2em] uppercase animate-pulse">
                    {text}
                </p>
            </div>
        </div>
    );
};
