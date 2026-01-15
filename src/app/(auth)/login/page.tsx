'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [particles, setParticles] = useState<Array<{ left: string; duration: string; delay: string }>>([]);

    useEffect(() => {
        // Generate particles on client-side only to avoid hydration mismatch
        const particleData = Array.from({ length: 10 }, () => ({
            left: `${Math.random() * 100}%`,
            duration: `${Math.random() * 8 + 12}s`,
            delay: `${Math.random() * 5}s`,
        }));
        setParticles(particleData);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await api.post('/auth/login', { email, password });
            const accessToken = res.data.access_token;
            localStorage.setItem('token', accessToken);

            const payload = JSON.parse(atob(accessToken.split('.')[1]));
            const role = payload.role;

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
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[hsl(222,47%,6%)] p-4 overflow-hidden">
            {/* Cyber Grid Background */}
            <div className="absolute inset-0 cyber-grid opacity-20"></div>

            {/* Gradient Overlays */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[hsl(190,95%,50%)] opacity-20 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[hsl(260,80%,60%)] opacity-20 blur-[120px] rounded-full"></div>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map((particle, i) => (
                    <div
                        key={i}
                        className="particle animate-particle"
                        style={{
                            left: particle.left,
                            animationDuration: particle.duration,
                            animationDelay: particle.delay,
                            bottom: '-10px'
                        }}
                    ></div>
                ))}
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Card */}
                <div className="glass-dark p-10 rounded-3xl border border-[hsl(190,95%,50%)]/30 elevated">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-3 mb-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-[hsl(190,95%,50%)] blur-lg opacity-50 rounded-full"></div>
                                <div className="relative text-4xl glow-text">⚡</div>
                            </div>
                            <h1 className="text-3xl font-bold gradient-text font-display">EduTech LMS</h1>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2 font-display">Welcome Back</h2>
                        <p className="text-gray-400">Sign in to continue your learning journey</p>
                    </div>

                    {error && (
                        <div className="p-4 mb-6 text-sm text-red-200 bg-red-500/20 border border-red-400/30 rounded-xl animate-fadeIn glass">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-3">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 glass border border-[hsl(190,95%,50%)]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[hsl(190,95%,50%)] focus:border-transparent transition-smooth bg-black/20"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-3">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 glass border border-[hsl(190,95%,50%)]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[hsl(190,95%,50%)] focus:border-transparent transition-smooth bg-black/20"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)] text-white rounded-xl font-bold glow hover:scale-[1.02] transition-cyber disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-400">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-[hsl(190,95%,50%)] hover:text-[hsl(260,80%,60%)] font-semibold hover:underline transition-smooth">
                            Create one
                        </Link>
                    </p>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <Link href="/" className="text-sm text-gray-400 hover:text-[hsl(190,95%,50%)] transition-smooth inline-flex items-center gap-2 group">
                        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}