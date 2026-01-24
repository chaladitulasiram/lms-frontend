'use client';

import { motion } from "framer-motion";
import { ButtonHTMLAttributes } from "react";

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const GlassButton = ({
    children,
    className = "",
    variant = 'primary',
    size = 'md',
    isLoading = false,
    ...props
}: GlassButtonProps) => {

    const variants = {
        primary: "bg-white text-black hover:bg-neutral-200 border-transparent",
        secondary: "bg-neutral-800/50 text-white border-white/10 hover:bg-neutral-800",
        ghost: "bg-transparent text-neutral-400 hover:text-white border-transparent hover:bg-white/5",
        danger: "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-5 py-2.5 text-sm",
        lg: "px-8 py-4 text-base"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
                relative rounded-xl font-medium transition-all duration-200
                flex items-center justify-center gap-2
                border backdrop-blur-md
                disabled:opacity-50 disabled:cursor-not-allowed
                ${variants[variant]}
                ${sizes[size]}
                ${className}
            `}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && (
                <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin mr-2" />
            )}
            {children}
        </motion.button>
    );
};
