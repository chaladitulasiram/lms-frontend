'use client';

import { useState, useCallback, memo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Mail, Lock, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import api from '@/lib/axios';
import { GlassCard } from '@/components/ui/glass/GlassCard';
import { GlassButton } from '@/components/ui/glass/GlassButton';

const APPLE_EASE = [0.16, 1, 0.3, 1] as const;

// Memoized Input Component
const FormInput = memo(({
    icon: Icon,
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false
}: {
    icon: any;
    label: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    required?: boolean;
}) => (
    <div>
        <label htmlFor={label.toLowerCase().replace(' ', '-')} className="block text-sm font-semibold text-neutral-300 mb-2">
            {label}
        </label>
        <div className="relative">
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" aria-hidden="true" />
            <input
                id={label.toLowerCase().replace(' ', '-')}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-neutral-900/50 border border-white/5 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-white/20 transition-all backdrop-blur-md"
                placeholder={placeholder}
                required={required}
                aria-label={label}
            />
        </div>
    </div>
));
FormInput.displayName = 'FormInput';

export default function LoginPage() {
    const router = useRouter();
    const shouldReduceMotion = useReducedMotion();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.role === 'ADMIN') router.push('/admin');
                else if (user.role === 'MENTOR') router.push('/mentor');
                else if (user.role === 'STUDENT') router.push('/student');
                else router.push('/');
            } catch (e) {
                // Invalid user data, continue to login
            }
        }
    }, [router]);

    const handleLogin = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await api.post('/auth/login', { email, password });
            const accessToken = res.data.access_token;
            const user = res.data.user;

            // Store both token and user info
            localStorage.setItem('token', accessToken);
            localStorage.setItem('user', JSON.stringify(user));

            const role = user.role;

            if (role === 'ADMIN') router.push('/admin');
            else if (role === 'MENTOR') router.push('/mentor');
            else if (role === 'STUDENT') router.push('/student');
            else router.push('/');

        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    }, [email, password, router]);

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-black p-4 overflow-hidden font-sans">
            <div className="bg-noise" />

            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: APPLE_EASE }}
                className="w-full max-w-sm relative z-10"
            >
                {/* Card */}
                <GlassCard className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, ease: APPLE_EASE, delay: 0.2 }}
                            className="inline-flex items-center gap-3 mb-4"
                        >
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                <span className="text-black text-xs font-bold">L</span>
                            </div>
                            <h1 className="text-xl font-bold text-white tracking-tight">LMS Pro</h1>
                        </motion.div>
                        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Welcome Back</h2>
                        <p className="text-neutral-400">Sign in to continue your learning journey</p>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: APPLE_EASE }}
                                className="mb-6"
                            >
                                <div className="p-4 text-sm text-red-200 bg-red-500/10 border border-red-400/20 rounded-xl backdrop-blur-xl">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5" aria-hidden="true" />
                                        {error}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <FormInput
                            icon={Mail}
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={setEmail}
                            placeholder="you@example.com"
                            required
                        />

                        <FormInput
                            icon={Lock}
                            label="Password"
                            type="password"
                            value={password}
                            onChange={setPassword}
                            placeholder="••••••••"
                            required
                        />

                        <GlassButton
                            type="submit"
                            disabled={loading}
                            isLoading={loading}
                            className="w-full py-3"
                        >
                            Sign In
                        </GlassButton>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-neutral-400">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                                Create one
                            </Link>
                        </p>
                    </div>
                </GlassCard>

                {/* Back to Home */}
                <div className="text-center mt-8">
                    <Link href="/" className="text-sm text-neutral-500 hover:text-white transition-colors inline-flex items-center gap-2 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
                        Back to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}