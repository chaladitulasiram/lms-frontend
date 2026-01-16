'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import SuccessModal from '@/components/SuccessModal';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        phone: '',
        designation: '',
        role: 'STUDENT',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [particles, setParticles] = useState<Array<{ left: string; duration: string; delay: string }>>([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        // Generate particles on client-side only to avoid hydration mismatch
        const particleData = Array.from({ length: 12 }, () => ({
            left: `${Math.random() * 100}%`,
            duration: `${Math.random() * 8 + 12}s`,
            delay: `${Math.random() * 5}s`,
        }));
        setParticles(particleData);
    }, []);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/auth/register', formData);
            setShowSuccessModal(true);
        } catch (err: any) {
            setError('Registration failed. Email might already exist.');
        } finally {
            setLoading(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        router.push('/login');
    };

    const roles = [
        { value: 'STUDENT', icon: '🎓', label: 'Student', desc: 'Learn from world-class courses' },
        { value: 'MENTOR', icon: '👨‍🏫', label: 'Mentor', desc: 'Share your knowledge' },
        { value: 'ADMIN', icon: '👨‍💼', label: 'Admin', desc: 'Manage the platform' }
    ];

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[hsl(222,47%,6%)] p-4 overflow-hidden">
            {/* Cyber Grid Background */}
            <div className="absolute inset-0 cyber-grid opacity-20"></div>

            {/* Gradient Overlays */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[hsl(190,95%,50%)] opacity-20 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[hsl(260,80%,60%)] opacity-20 blur-[120px] rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[hsl(280,70%,55%)] opacity-15 blur-[120px] rounded-full"></div>
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

            <div className="w-full max-w-2xl relative z-10">
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
                        <h2 className="text-2xl font-bold text-white mb-2 font-display">Create Account</h2>
                        <p className="text-gray-400">Join thousands of learners worldwide</p>
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

                    <form onSubmit={handleRegister} className="space-y-5">
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                                <svg className="w-4 h-4 text-[hsl(190,95%,50%)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 glass border border-[hsl(190,95%,50%)]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[hsl(190,95%,50%)] focus:border-transparent transition-smooth bg-black/20"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                                <svg className="w-4 h-4 text-[hsl(190,95%,50%)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 glass border border-[hsl(190,95%,50%)]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[hsl(190,95%,50%)] focus:border-transparent transition-smooth bg-black/20"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        {/* Phone Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                                <svg className="w-4 h-4 text-[hsl(260,80%,60%)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                Phone Number
                                <span className="text-xs text-gray-500">(Optional)</span>
                            </label>
                            <input
                                type="tel"
                                className="w-full px-4 py-3 glass border border-[hsl(190,95%,50%)]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[hsl(260,80%,60%)] focus:border-transparent transition-smooth bg-black/20"
                                placeholder="+1 (555) 123-4567"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        {/* Designation Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                                <svg className="w-4 h-4 text-[hsl(280,70%,55%)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Designation / Title
                                <span className="text-xs text-gray-500">(Optional)</span>
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 glass border border-[hsl(190,95%,50%)]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[hsl(280,70%,55%)] focus:border-transparent transition-smooth bg-black/20"
                                placeholder="Software Engineer, Student, etc."
                                value={formData.designation}
                                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                                <svg className="w-4 h-4 text-[hsl(190,95%,50%)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 glass border border-[hsl(190,95%,50%)]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[hsl(190,95%,50%)] focus:border-transparent transition-smooth bg-black/20"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-4">I am a...</label>
                            <div className="grid grid-cols-1 gap-3">
                                {roles.map((role) => (
                                    <label
                                        key={role.value}
                                        className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-cyber group ${formData.role === role.value
                                            ? 'border-[hsl(190,95%,50%)] bg-[hsl(190,95%,50%)]/10 glow'
                                            : 'border-[hsl(190,95%,50%)]/30 hover:border-[hsl(190,95%,50%)]/60 hover:bg-[hsl(190,95%,50%)]/5 glass'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="role"
                                            value={role.value}
                                            checked={formData.role === role.value}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="sr-only"
                                        />
                                        <span className="text-3xl group-hover:scale-110 transition-cyber">{role.icon}</span>
                                        <div className="flex-1">
                                            <p className="font-semibold text-white font-display">{role.label}</p>
                                            <p className="text-xs text-gray-400">{role.desc}</p>
                                        </div>
                                        {formData.role === role.value && (
                                            <svg className="w-6 h-6 text-[hsl(190,95%,50%)]" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)] text-white rounded-xl font-bold glow hover:scale-[1.02] transition-cyber disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                    Creating Account...
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link href="/login" className="text-[hsl(190,95%,50%)] hover:text-[hsl(260,80%,60%)] font-semibold hover:underline transition-smooth">
                            Sign in
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

            {/* Success Modal */}
            <SuccessModal
                isOpen={showSuccessModal}
                onClose={handleSuccessClose}
                title="Welcome Aboard!"
                message="Your account has been created successfully. Let's get you logged in!"
                icon="🎉"
            />
        </div>
    );
}