'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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

    return (
        <div className="flex h-screen bg-black overflow-hidden font-sans text-white">
            {/* Ambient Background - Consistent with Landing Page */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full" />
            </div>

            {/* Sidebar */}
            <aside className="relative z-20 w-72 bg-neutral-900/40 backdrop-blur-xl border-r border-white/10 flex flex-col">
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

                {/* User Profile */}
                <div className="p-4 mx-2 mt-4 mb-2 bg-white/5 border border-white/5 rounded-xl backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-neutral-400">
                            {user.avatar ? (
                                <img src={user.avatar} alt={displayName} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <User size={18} />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate text-white">{displayName}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <config.icon size={12} className={config.color} />
                                <p className="text-xs text-neutral-400 truncate">{designation}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {/* Admin Links */}
                    {user.role === 'ADMIN' && (
                        <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-neutral-300 rounded-lg hover:bg-white/5 hover:text-white transition-colors">
                            <BarChart3 size={18} />
                            <span>Analytics</span>
                        </Link>
                    )}

                    {/* Mentor Links */}
                    {user.role === 'MENTOR' && (
                        <Link href="/mentor" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-neutral-300 rounded-lg hover:bg-white/5 hover:text-white transition-colors">
                            <BookOpen size={18} />
                            <span>My Courses</span>
                        </Link>
                    )}

                    {/* Student Links */}
                    {user.role === 'STUDENT' && (
                        <Link href="/student" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-neutral-300 rounded-lg hover:bg-white/5 hover:text-white transition-colors">
                            <LayoutDashboard size={18} />
                            <span>Overview</span>
                        </Link>
                    )}

                    {/* Common Links (Placeholder for uniformity) */}
                    <div className="pt-4 mt-4 border-t border-white/5">
                        <span className="px-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">System</span>
                    </div>

                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-neutral-400 rounded-lg hover:bg-white/5 hover:text-white transition-colors">
                        <Bell size={18} />
                        <span>Notifications</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-neutral-400 rounded-lg hover:bg-white/5 hover:text-white transition-colors">
                        <Settings size={18} />
                        <span>Settings</span>
                    </button>
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            router.push('/login');
                        }}
                        className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
                {/* Topbar */}
                <header className="h-16 border-b border-white/5 bg-black/50 backdrop-blur-xl flex items-center justify-between px-8">
                    {/* Search Bar */}
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search courses, assignments..."
                            className="w-full bg-neutral-900 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/20 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-neutral-400">
                            {user.role} View
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto bg-black p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            {/* AI Chatbot */}
            <AIChatbot userRole={user.role} />
        </div>
    );
}