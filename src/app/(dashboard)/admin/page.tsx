'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Stats {
    totalStudents: number;
    totalMentors: number;
    totalAdmins: number;
    activeCourses: number;
    totalEnrollments: number;
    recentEnrollments: number;
    completionRate: number;
    averageProgress: number;
    revenue: number;
}

interface Analytics {
    userGrowth: {
        date: string;
        students: number;
        mentors: number;
    }[];
    courseStats: {
        courseId: string;
        title: string;
        enrollments: number;
        completionRate: number;
    }[];
}

const COLORS = ['hsl(190, 95%, 50%)', 'hsl(260, 80%, 60%)', 'hsl(280, 70%, 55%)', 'hsl(310, 65%, 50%)'];

export default function AdminDashboard() {
    const [aiInsights, setAiInsights] = useState<string>('');

    // Fetch real stats from backend
    const { data: stats, isLoading: statsLoading } = useQuery<Stats>({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const res = await api.get<Stats>('/admin/stats');
            return res.data;
        },
        refetchInterval: 30000, // Refresh every 30 seconds
    });

    // Fetch analytics data
    const { data: analytics, isLoading: analyticsLoading } = useQuery<Analytics>({
        queryKey: ['admin-analytics'],
        queryFn: async () => {
            const res = await api.get<Analytics>('/admin/analytics');
            return res.data;
        },
    });

    // AI Analysis Mutation
    const aiMutation = useMutation({
        mutationFn: async () => {
            if (!stats) throw new Error('No stats available');

            const studentData = {
                enrollments: stats.totalEnrollments,
                completedCourses: Math.round(stats.totalEnrollments * (stats.completionRate / 100)),
                averageProgress: stats.averageProgress,
                assignmentsSubmitted: 0, // Placeholder
                averageScore: 85, // Placeholder
            };

            const res = await api.post('/ai/analyze-performance', { studentData });
            return res.data.insights;
        },
        onSuccess: (data) => {
            setAiInsights(data);
        },
    });

    // Prepare data for completion rate pie chart
    const completionData = stats ? [
        { name: 'Completed', value: stats.completionRate },
        { name: 'In Progress', value: 100 - stats.completionRate },
    ] : [];

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
                        <StatCard
                            title="Total Students"
                            value={stats?.totalStudents || 0}
                            icon="👥"
                            trend="Active learners"
                        />
                        <StatCard
                            title="Active Courses"
                            value={stats?.activeCourses || 0}
                            icon="📚"
                            trend="Live courses"
                        />
                        <StatCard
                            title="Enrollments"
                            value={stats?.recentEnrollments || 0}
                            icon="📈"
                            trend="This month"
                        />
                        <StatCard
                            title="Completion Rate"
                            value={`${stats?.completionRate.toFixed(1) || 0}%`}
                            icon="✅"
                            trend="Overall"
                        />
                    </>
                )}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* User Growth Chart */}
                <div className="glass p-8 rounded-2xl border border-[hsl(190,95%,50%)]/20 elevated">
                    <h3 className="font-bold text-xl text-white font-display mb-6">User Growth Trends</h3>
                    {analyticsLoading ? (
                        <div className="h-64 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[hsl(190,95%,50%)] border-t-transparent"></div>
                        </div>
                    ) : analytics?.userGrowth && analytics.userGrowth.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={analytics.userGrowth}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="date" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(10, 22, 40, 0.9)',
                                        border: '1px solid hsl(190, 95%, 50%)',
                                        borderRadius: '8px',
                                    }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="students" stroke="hsl(190, 95%, 50%)" strokeWidth={2} />
                                <Line type="monotone" dataKey="mentors" stroke="hsl(260, 80%, 60%)" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-gray-400">
                            <div className="text-center">
                                <div className="text-6xl mb-4 opacity-50">📊</div>
                                <span>No growth data available yet</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Completion Rate Pie Chart */}
                <div className="glass p-8 rounded-2xl border border-[hsl(190,95%,50%)]/20 elevated">
                    <h3 className="font-bold text-xl text-white font-display mb-6">Course Completion</h3>
                    {statsLoading ? (
                        <div className="h-64 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[hsl(190,95%,50%)] border-t-transparent"></div>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={completionData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {completionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(10, 22, 40, 0.9)',
                                        border: '1px solid hsl(190, 95%, 50%)',
                                        borderRadius: '8px',
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Course Performance Bar Chart */}
            {analytics?.courseStats && analytics.courseStats.length > 0 && (
                <div className="glass p-8 rounded-2xl border border-[hsl(190,95%,50%)]/20 elevated mb-8">
                    <h3 className="font-bold text-xl text-white font-display mb-6">Top Courses by Enrollment</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics.courseStats.slice(0, 5)}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="title" stroke="#888" />
                            <YAxis stroke="#888" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(10, 22, 40, 0.9)',
                                    border: '1px solid hsl(190, 95%, 50%)',
                                    borderRadius: '8px',
                                }}
                            />
                            <Legend />
                            <Bar dataKey="enrollments" fill="hsl(190, 95%, 50%)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* AI Insights Panel */}
            <div className="relative overflow-hidden glass-dark p-8 rounded-2xl border border-[hsl(190,95%,50%)]/30 group elevated">
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
                                <p className="text-xs text-red-400 mt-2">AI service may not be available. Please ensure Ollama is running.</p>
                            </div>
                        ) : aiInsights ? (
                            <div className="glass p-6 rounded-xl border border-[hsl(190,95%,50%)]/20">
                                <div className="flex gap-3">
                                    <span className="text-2xl">💡</span>
                                    <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">{aiInsights}</div>
                                </div>
                            </div>
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
                                    Generate AI Analysis
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
    );
}

// Stat Card Component
function StatCard({ title, value, icon, trend }: { title: string; value: number | string; icon: string; trend: string }) {
    return (
        <div className="card-hover glass p-6 rounded-2xl group elevated">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wide">{title}</h3>
                <div className="text-3xl opacity-50 group-hover:scale-110 transition-cyber">{icon}</div>
            </div>
            <p className="text-4xl font-bold gradient-text font-display">{value}</p>
            <div className="mt-2 text-xs text-gray-500">
                <span className="text-green-400">↑ {trend}</span>
            </div>
        </div>
    );
}