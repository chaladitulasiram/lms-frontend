'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [role, setRole] = useState<string | null>(null);
    const [email, setEmail] = useState<string>('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setRole(payload.role);
            setEmail(payload.email || 'User');
        } catch (e) {
            localStorage.removeItem('token');
            router.push('/login');
        }
    }, [router]);

    if (!role) return (
        <div className="flex items-center justify-center h-screen bg-[hsl(222,47%,6%)]">
            <div className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="absolute inset-0 border-4 border-[hsl(190,95%,50%)]/30 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-[hsl(190,95%,50%)] border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-400 font-medium">Loading Dashboard...</p>
            </div>
        </div>
    );

    const roleConfig = {
        ADMIN: { icon: '👨‍💼', label: 'Admin', gradient: 'from-[hsl(280,70%,55%)] to-[hsl(260,80%,60%)]' },
        MENTOR: { icon: '👨‍🏫', label: 'Mentor', gradient: 'from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)]' },
        STUDENT: { icon: '🎓', label: 'Student', gradient: 'from-[hsl(190,95%,50%)] to-[hsl(280,70%,55%)]' }
    };

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.STUDENT;

    return (
        <div className="flex h-screen bg-[hsl(222,47%,6%)] overflow-hidden">
            {/* Cyber Grid Background */}
            <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none"></div>

            {/* Gradient Overlays */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-[hsl(190,95%,50%)] opacity-10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-[hsl(260,80%,60%)] opacity-10 blur-[120px] rounded-full"></div>
            </div>

            {/* Sidebar */}
            <aside className="relative z-10 w-80 glass-dark border-r border-[hsl(190,95%,50%)]/20 p-6 elevated flex flex-col">
                {/* Logo */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="relative">
                            <div className="absolute inset-0 bg-[hsl(190,95%,50%)] blur-lg opacity-50 rounded-full"></div>
                            <div className="relative text-3xl glow-text">⚡</div>
                        </div>
                        <h1 className="text-2xl font-bold gradient-text font-display">
                            EduTech LMS
                        </h1>
                    </div>
                    <p className="text-xs text-gray-500 ml-12">Learning Management System</p>
                </div>

                {/* User Profile */}
                <div className={`relative overflow-hidden bg-gradient-to-r ${config.gradient} p-5 rounded-2xl mb-8 glow group`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-2xl border-2 border-white/30">
                            {config.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{email}</p>
                            <p className="text-xs text-white/80">{config.label} Account</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-2 flex-1">
                    {/* Admin Links */}
                    {role === 'ADMIN' && (
                        <>
                            <Link
                                href="/admin"
                                className="flex items-center gap-4 p-4 glass hover:bg-[hsl(190,95%,50%)]/10 rounded-xl transition-cyber group border border-[hsl(190,95%,50%)]/20 hover:glow"
                            >
                                <span className="text-2xl group-hover:scale-110 transition-cyber">📊</span>
                                <span className="font-medium text-gray-300 group-hover:text-white transition-colors">Analytics Dashboard</span>
                            </Link>
                        </>
                    )}

                    {/* Mentor Links */}
                    {role === 'MENTOR' && (
                        <>
                            <Link
                                href="/mentor"
                                className="flex items-center gap-4 p-4 glass hover:bg-[hsl(190,95%,50%)]/10 rounded-xl transition-cyber group border border-[hsl(190,95%,50%)]/20 hover:glow"
                            >
                                <span className="text-2xl group-hover:scale-110 transition-cyber">📚</span>
                                <span className="font-medium text-gray-300 group-hover:text-white transition-colors">My Courses</span>
                            </Link>
                        </>
                    )}

                    {/* Student Links */}
                    {role === 'STUDENT' && (
                        <>
                            <Link
                                href="/student"
                                className="flex items-center gap-4 p-4 glass hover:bg-[hsl(190,95%,50%)]/10 rounded-xl transition-cyber group border border-[hsl(190,95%,50%)]/20 hover:glow"
                            >
                                <span className="text-2xl group-hover:scale-110 transition-cyber">🎯</span>
                                <span className="font-medium text-gray-300 group-hover:text-white transition-colors">Course Catalog</span>
                            </Link>
                        </>
                    )}
                </nav>

                {/* Logout Button */}
                <button
                    onClick={() => { localStorage.removeItem('token'); router.push('/login'); }}
                    className="flex items-center gap-4 w-full p-4 glass hover:bg-red-500/10 rounded-xl transition-cyber mt-auto group border border-red-400/30 hover:border-red-400/50"
                >
                    <span className="text-2xl group-hover:scale-110 transition-cyber">🚪</span>
                    <span className="font-medium text-red-400 group-hover:text-red-300">Log Out</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="relative z-10 flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto p-10 animate-fadeIn">
                    {children}
                </div>
            </main>
        </div>
    );
}