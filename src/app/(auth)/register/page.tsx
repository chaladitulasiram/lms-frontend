'use client';

import { useState, useCallback, memo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Mail, Lock, User, Phone, Briefcase, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '@/lib/axios';
import SuccessModal from '@/components/SuccessModal';

const APPLE_EASE = [0.16, 1, 0.3, 1] as const;

// Memoized Input Component
const FormInput = memo(({
    icon: Icon,
    label,
    type = 'text',
    required = false,
    optional = false,
    value,
    onChange,
    placeholder,
    iconColor = 'text-neutral-500' // Neutral default for clean look
}: {
    icon: any;
    label: string;
    type?: string;
    required?: boolean;
    optional?: boolean;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    iconColor?: string;
}) => (
    <div>
        <label className="block text-sm font-semibold text-neutral-300 mb-2 flex items-center gap-2">
            <Icon className={`w-4 h-4 ${iconColor}`} aria-hidden="true" />
            {label}
            {optional && <span className="text-xs text-neutral-500">(Optional)</span>}
        </label>
        <input
            type={type}
            required={required}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-white/30 transition-all backdrop-blur-xl"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label={label}
        />
    </div>
));
FormInput.displayName = 'FormInput';

// Memoized Role Card Component
const RoleCard = memo(({
    role,
    selected,
    onSelect
}: {
    role: { value: string; icon: string; label: string; desc: string };
    selected: boolean;
    onSelect: () => void;
}) => (
    <motion.label
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${selected
            ? 'border-white bg-white text-black'
            : 'border-white/10 hover:bg-white/5 bg-white/5 backdrop-blur-xl text-white'
            }`}
    >
        <input
            type="radio"
            name="role"
            value={role.value}
            checked={selected}
            onChange={onSelect}
            className="sr-only"
            aria-label={`Select ${role.label} role`}
        />
        <span className="text-2xl" aria-hidden="true">{role.icon}</span>
        <div className="flex-1">
            <p className="font-semibold font-display">{role.label}</p>
            <p className={`text-xs ${selected ? "text-neutral-600" : "text-neutral-400"}`}>{role.desc}</p>
        </div>
        {selected && (
            <CheckCircle2 className="w-5 h-5 text-black" aria-hidden="true" />
        )}
    </motion.label>
));
RoleCard.displayName = 'RoleCard';

export default function RegisterPage() {
    const router = useRouter();
    const shouldReduceMotion = useReducedMotion();

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
    const [showSuccessModal, setShowSuccessModal] = useState(false);

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
                // Invalid user data, continue
            }
        }
    }, [router]);

    const handleRegister = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/auth/register', formData);
            setShowSuccessModal(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Email might already exist.');
        } finally {
            setLoading(false);
        }
    }, [formData]);

    const handleSuccessClose = useCallback(() => {
        setShowSuccessModal(false);
        router.push('/login');
    }, [router]);

    const updateFormData = useCallback((field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const roles = [
        { value: 'STUDENT', icon: '🎓', label: 'Student', desc: 'Learn from world-class courses' },
        { value: 'MENTOR', icon: '👨‍🏫', label: 'Mentor', desc: 'Share your knowledge' },
        { value: 'ADMIN', icon: '👨‍💼', label: 'Admin', desc: 'Manage the platform' }
    ];

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-black p-4 overflow-hidden font-sans">
            {/* Background Ambience - Consistent with Landing Page */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: APPLE_EASE }}
                className="w-full max-w-2xl relative z-10"
            >
                {/* Card */}
                <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl">
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
                        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Create Account</h2>
                        <p className="text-neutral-400">Join thousands of learners worldwide</p>
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
                                <div className="p-4 text-sm text-red-200 bg-red-500/20 border border-red-400/30 rounded-xl backdrop-blur-xl">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5" aria-hidden="true" />
                                        {error}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name Field */}
                            <FormInput
                                icon={User}
                                label="Full Name"
                                type="text"
                                required
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(value) => updateFormData('name', value)}
                            />

                            {/* Email Field */}
                            <FormInput
                                icon={Mail}
                                label="Email Address"
                                type="email"
                                required
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(value) => updateFormData('email', value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Phone Field */}
                            <FormInput
                                icon={Phone}
                                label="Phone Number"
                                type="tel"
                                optional
                                placeholder="+1 (555) 123-4567"
                                value={formData.phone}
                                onChange={(value) => updateFormData('phone', value)}
                            />

                            {/* Designation Field */}
                            <FormInput
                                icon={Briefcase}
                                label="Designation / Title"
                                type="text"
                                optional
                                placeholder="Software Engineer, etc."
                                value={formData.designation}
                                onChange={(value) => updateFormData('designation', value)}
                            />
                        </div>

                        {/* Password Field */}
                        <FormInput
                            icon={Lock}
                            label="Password"
                            type="password"
                            required
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(value) => updateFormData('password', value)}
                        />

                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-neutral-300 mb-4">I am a...</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {roles.map((role) => (
                                    <RoleCard
                                        key={role.value}
                                        role={role}
                                        selected={formData.role === role.value}
                                        onSelect={() => updateFormData('role', role.value)}
                                    />
                                ))}
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 bg-white text-black rounded-xl font-bold hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                                    Creating Account...
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-neutral-400">
                            Already have an account?{' '}
                            <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-8">
                    <Link href="/" className="text-sm text-neutral-500 hover:text-white transition-colors inline-flex items-center gap-2 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
                        Back to Home
                    </Link>
                </div>
            </motion.div>

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