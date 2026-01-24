import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export const GlassCard = ({ children, className = "", hoverEffect = false }: GlassCardProps) => {
    return (
        <motion.div
            whileHover={hoverEffect ? { y: -5, scale: 1.01 } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`
                relative overflow-hidden
                bg-neutral-900/40 backdrop-blur-xl 
                border border-white/10 rounded-3xl 
                shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]
                ${className}
            `}
        >
            {/* Inner Glint */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />

            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
};
