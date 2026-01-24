'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    BarChart3,
    BookOpen,
    GraduationCap,
    LogOut,
    User,
    Settings,
    Bell,
    Search,
    LayoutDashboard
} from 'lucide-react';
import AIChatbot from '@/components/AIChatbot';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
    id: string;
    email: string;
    name: string | null;
    phone: string | null;
    designation: string | null;
    role: string;
    avatar: string | null;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                setUser(JSON.parse(userStr));
            } else {
                // Fallback to JWT payload
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser({
                    id: payload.sub,
                    email: payload.email,
                    name: payload.name || null,
                    phone: null,
                    designation: null,
                    role: payload.role,
                    avatar: null,
                });
            }
        } catch (e) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/login');
        }
    }, [router]);

    if (!user) return (
        <div className="flex items-center justify-center h-screen bg-black">
            <div className="text-center">
                <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin mx-auto mb-4" />
                <p className="text-neutral-500 font-medium text-sm">Loading workspace...</p>
            </div>
        </div>
    );

    const roleConfig = {
        ADMIN: { icon: BarChart3, label: 'Admin', color: 'text-purple-400' },
        MENTOR: { icon: BookOpen, label: 'Mentor', color: 'text-blue-400' },
        STUDENT: { icon: GraduationCap, label: 'Student', color: 'text-green-400' }
    };

    const config = roleConfig[user.role as keyof typeof roleConfig] || roleConfig.STUDENT;
    const displayName = user.name || user.email.split('@')[0];
    const designation = user.designation || config.label;

    const navLinks = [
        {
            role: 'ADMIN',
            href: '/admin',
            label: 'Analytics',
            icon: BarChart3
        },
        {
            role: 'MENTOR',
            href: '/mentor',
            label: 'My Courses',
            icon: BookOpen
        },
        {
            role: 'STUDENT',
            href: '/student',
            label: 'Overview',
            icon: LayoutDashboard
        }
    ];

    return (
        <div className="flex h-screen bg-black overflow-hidden font-sans text-white">
            {/* Ambient Background Noise */}
            <div className="bg-noise" />

            {/* Ambient Blobs */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full" />
            </div>

            {/* Sidebar - Floating Glass Pane */}
            <motion.aside
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-20 w-72 m-4 bg-neutral-900/40 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col shadow-2xl"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold text-xs">
                            L
                        </div>
                        <div>
                            <h1 className="font-bold text-lg tracking-tight">LMS Pro</h1>
                            <p className="text-xs text-neutral-500">Workspace</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navLinks.filter(link => link.role === user.role).map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`
                                flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-200
                                ${pathname === link.href
                                    ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                                    : 'text-neutral-400 hover:text-white hover:bg-white/5'}
                            `}
                        >
                            <link.icon size={18} className={pathname === link.href ? 'text-white' : ''} />
                            <span>{link.label}</span>
                        </Link>
                    ))}

                    <div className="pt-6 mt-2 border-t border-white/5">
                        <span className="px-4 text-[10px] font-semibold text-neutral-600 uppercase tracking-widest">System</span>
                    </div>

                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-neutral-400 rounded-2xl hover:bg-white/5 hover:text-white transition-colors">
                        <Bell size={18} />
                        <span>Notifications</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-neutral-400 rounded-2xl hover:bg-white/5 hover:text-white transition-colors">
                        <Settings size={18} />
                        <span>Settings</span>
                    </button>
                </nav>

                {/* User Profile - Bottom */}
                <div className="p-4 border-t border-white/5 bg-black/20 rounded-b-3xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-neutral-400 relative">
                            {user.avatar ? (
                                <img src={user.avatar} alt={displayName} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <User size={18} />
                            )}
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-black rounded-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate text-white">{displayName}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <config.icon size={10} className={config.color} />
                                <p className="text-xs text-neutral-400 truncate">{designation}</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            router.push('/login');
                        }}
                        className="flex items-center justify-center gap-2 w-full px-3 py-2 text-xs font-medium text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors"
                    >
                        <LogOut size={14} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
                {/* Topbar - Floating Dynamic Island Style */}
                <header className="h-20 flex items-center justify-between px-8 py-4">
                    {/* Search Bar */}
                    <div className="relative w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-hover:text-neutral-300 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-neutral-900/50 backdrop-blur-md border border-white/5 rounded-full pl-12 pr-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:bg-neutral-900/80 focus:border-white/20 transition-all shadow-lg"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="px-4 py-1.5 bg-neutral-900/50 backdrop-blur-md border border-white/5 rounded-full text-xs font-medium text-neutral-400 shadow-lg capitalize">
                            {user.role} Workspace
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-4 sm:p-8 pt-0">
                    <div className="max-w-7xl mx-auto h-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={pathname}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="h-full"
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>

            {/* AI Chatbot */}
            <AIChatbot userRole={user.role} />
        </div>
    );
}