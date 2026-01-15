'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useState, useEffect } from 'react';

interface Stats {
    totalStudents: number;
    activeCourses: number;
    recentEnrollments: number;
    revenue: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);

    // Fetch real stats from backend
    const { data: statsData, isLoading: statsLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const res = await api.get<Stats>('/admin/stats');
            return res.data;
        },
    });

    useEffect(() => {
        if (statsData) {
            setStats(statsData);
        }
    }, [statsData]);

    // Mutation to trigger AI Analysis
    const aiMutation = useMutation({
        mutationFn: async () => {
            if (!stats) throw new Error('No stats available');
            const res = await api.post('/ai-insights/analyze', stats);
            return res.data;
        },
    });

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold gradient-text mb-2 font-display">Platform Analytics</h1>
                <p className="text-gray-400">Monitor your platform's performance in real-time</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsLoading ? (
                    [...Array(4)].map((_, idx) => (
                        <div key={idx} className="glass p-6 rounded-2xl animate-pulse border border-[hsl(190,95%,50%)]/20">
                            <div className="h-4 bg-[hsl(190,95%,50%)]/20 rounded w-1/2 mb-4"></div>
                            <div className="h-8 bg-[hsl(190,95%,50%)]/20 rounded w-3/4"></div>
                        </div>
                    ))
                ) : (
                    <>
                        <div className="card-hover glass p-6 rounded-2xl group elevated">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wide">Total Students</h3>
                                <div className="text-3xl opacity-50 group-hover:scale-110 transition-cyber">👥</div>
                            </div>
                            <p className="text-4xl font-bold gradient-text font-display">
                                {stats?.totalStudents || 0}
                            </p>
                            <div className="mt-2 text-xs text-gray-500">
                                <span className="text-green-400">↑ Active learners</span>
                            </div>
                        </div>

                        <div className="card-hover glass p-6 rounded-2xl group elevated">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wide">Active Courses</h3>
                                <div className="text-3xl opacity-50 group-hover:scale-110 transition-cyber">📚</div>
                            </div>
                            <p className="text-4xl font-bold gradient-text font-display">
                                {stats?.activeCourses || 0}
                            </p>
                            <div className="mt-2 text-xs text-gray-500">
                                <span className="text-green-400">↑ Live courses</span>
                            </div>
                        </div>

                        <div className="card-hover glass p-6 rounded-2xl group elevated">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wide">Enrollments</h3>
                                <div className="text-3xl opacity-50 group-hover:scale-110 transition-cyber">📈</div>
                            </div>
                            <p className="text-4xl font-bold gradient-text font-display">
                                {stats?.recentEnrollments || 0}
                            </p>
                            <div className="mt-2 text-xs text-gray-500">
                                <span className="text-green-400">↑ This month</span>
                            </div>
                        </div>

                        <div className="card-hover glass p-6 rounded-2xl group elevated">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wide">Total Revenue</h3>
                                <div className="text-3xl opacity-50 group-hover:scale-110 transition-cyber">💰</div>
                            </div>
                            <p className="text-4xl font-bold gradient-text font-display">
                                ${stats?.revenue || 0}
                            </p>
                            <div className="mt-2 text-xs text-gray-500">
                                <span className="text-green-400">↑ All time</span>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* User Growth Chart Placeholder */}
                <div className="glass p-8 rounded-2xl border border-[hsl(190,95%,50%)]/20 elevated">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-xl text-white font-display">User Growth Trends</h3>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 text-xs rounded-lg glass text-gray-400 hover:text-[hsl(190,95%,50%)] transition-smooth">
                                Week
                            </button>
                            <button className="px-3 py-1 text-xs rounded-lg glass text-gray-400 hover:text-[hsl(190,95%,50%)] transition-smooth">
                                Month
                            </button>
                            <button className="px-3 py-1 text-xs rounded-lg bg-gradient-to-r from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)] text-white transition-smooth">
                                Year
                            </button>
                        </div>
                    </div>
                    <div className="h-64 glass rounded-xl flex items-center justify-center border-2 border-dashed border-[hsl(190,95%,50%)]/30">
                        <div className="text-center">
                            <div className="text-6xl mb-4 opacity-50">📊</div>
                            <span className="text-gray-400 font-medium">Chart Integration Ready</span>
                            <p className="text-xs text-gray-500 mt-2">Connect your analytics data here</p>
                        </div>
                    </div>
                </div>

                {/* AI Insights Panel */}
                <div className="relative overflow-hidden glass-dark p-8 rounded-2xl border border-[hsl(190,95%,50%)]/30 group elevated">
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(190,95%,50%)]/10 via-[hsl(260,80%,60%)]/10 to-[hsl(280,70%,55%)]/10 opacity-50"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[hsl(190,95%,50%)]/10 rounded-full blur-3xl animate-pulse-slow"></div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="text-3xl animate-float glow-text">✨</div>
                                <h3 className="font-bold text-xl text-white font-display">AI Smart Insights</h3>
                            </div>
                            <span className="glass text-xs px-3 py-1.5 rounded-full text-[hsl(190,95%,50%)] font-medium border border-[hsl(190,95%,50%)]/30">
                                Powered by AI
                            </span>
                        </div>

                        <div className="space-y-3 min-h-[200px] mb-6">
                            {aiMutation.isPending ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-gray-300">
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-[hsl(190,95%,50%)] border-t-transparent"></div>
                                        <span>Analyzing platform data with AI...</span>
                                    </div>
                                    {[...Array(3)].map((_, idx) => (
                                        <div key={idx} className="glass p-4 rounded-lg animate-pulse border border-[hsl(190,95%,50%)]/20">
                                            <div className="h-3 bg-[hsl(190,95%,50%)]/20 rounded w-full mb-2"></div>
                                            <div className="h-3 bg-[hsl(190,95%,50%)]/20 rounded w-3/4"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : aiMutation.isError ? (
                                <div className="glass p-6 rounded-xl border border-red-400/30 text-center">
                                    <div className="text-4xl mb-3">⚠️</div>
                                    <p className="text-red-300">Failed to generate insights.</p>
                                    <p className="text-xs text-red-400 mt-2">Please check your connection and try again</p>
                                </div>
                            ) : aiMutation.data ? (
                                <ul className="space-y-3">
                                    {aiMutation.data.insights?.map((insight: string, idx: number) => (
                                        <li
                                            key={idx}
                                            className="glass p-4 rounded-xl text-sm border border-[hsl(190,95%,50%)]/20 hover:border-[hsl(190,95%,50%)]/40 transition-smooth group/item"
                                        >
                                            <div className="flex gap-3">
                                                <span className="text-xl group-hover/item:scale-110 transition-cyber">💡</span>
                                                <span className="text-gray-300 leading-relaxed">{insight}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="glass p-8 rounded-xl text-center border border-[hsl(190,95%,50%)]/20">
                                    <div className="text-5xl mb-4 animate-float glow-text">🤖</div>
                                    <p className="text-gray-300 mb-2">Ready to analyze your data</p>
                                    <p className="text-xs text-gray-500">Click the button below to generate insights</p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => aiMutation.mutate()}
                            disabled={aiMutation.isPending || !stats}
                            className="w-full bg-gradient-to-r from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)] text-white py-4 rounded-xl font-bold glow hover:scale-[1.02] transition-cyber disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group/btn"
                        >
                            <span className="flex items-center justify-center gap-2">
                                {aiMutation.isPending ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Generate Full Report
                                        <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                )}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}