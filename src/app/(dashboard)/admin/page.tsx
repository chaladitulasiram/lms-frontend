'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, TrendingUp, CheckCircle, BarChart3, PieChart as PieIcon, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/ui/glass/PageHeader';
import { GlassCard } from '@/components/ui/glass/GlassCard';
import { GlassButton } from '@/components/ui/glass/GlassButton';
import { CinematicLoader } from '@/components/ui/CinematicLoader';

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

const COLORS = ['#3B82F6', '#A855F7', '#10B981', '#F59E0B'];

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
        <div className="min-h-screen pb-20">
            <PageHeader
                title="Platform Analytics"
                description="Monitor your platform's performance in real-time"
            />

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsLoading ? (
                    <div className="col-span-full flex justify-center py-20">
                        <CinematicLoader text="Analyzing Platform Data..." />
                    </div>
                ) : (
                    <>
                        <StatCard
                            title="Total Students"
                            value={stats?.totalStudents || 0}
                            icon={<Users className="text-blue-400" size={24} />}
                            trend="Active learners"
                        />
                        <StatCard
                            title="Active Courses"
                            value={stats?.activeCourses || 0}
                            icon={<BookOpen className="text-purple-400" size={24} />}
                            trend="Live courses"
                        />
                        <StatCard
                            title="Enrollments"
                            value={stats?.recentEnrollments || 0}
                            icon={<TrendingUp className="text-green-400" size={24} />}
                            trend="This month"
                        />
                        <StatCard
                            title="Completion Rate"
                            value={`${stats?.completionRate.toFixed(1) || 0}%`}
                            icon={<CheckCircle className="text-yellow-400" size={24} />}
                            trend="Overall"
                        />
                    </>
                )}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* User Growth Chart */}
                <GlassCard className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <BarChart3 className="text-blue-400" size={20} />
                        <h3 className="font-bold text-lg text-white">User Growth Trends</h3>
                    </div>
                    {analyticsLoading ? (
                        <div className="h-64 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white"></div>
                        </div>
                    ) : analytics?.userGrowth && analytics.userGrowth.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={analytics.userGrowth}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="date" stroke="#525252" tick={{ fill: '#737373', fontSize: 12 }} />
                                <YAxis stroke="#525252" tick={{ fill: '#737373', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#171717',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        color: '#fff'
                                    }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="students" stroke="#3B82F6" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="mentors" stroke="#A855F7" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-neutral-500">
                            <div className="text-center">
                                <BarChart3 className="mx-auto mb-2 opacity-20" size={48} />
                                <span>No growth data available yet</span>
                            </div>
                        </div>
                    )}
                </GlassCard>

                {/* Completion Rate Pie Chart */}
                <GlassCard className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <PieIcon className="text-purple-400" size={20} />
                        <h3 className="font-bold text-lg text-white">Course Completion</h3>
                    </div>
                    {statsLoading ? (
                        <div className="h-64 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white"></div>
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
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.5)" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#171717',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        color: '#fff'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </GlassCard>
            </div>

            {/* Course Performance Bar Chart */}
            {analytics?.courseStats && analytics.courseStats.length > 0 && (
                <GlassCard className="p-8 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <BarChart3 className="text-green-400" size={20} />
                        <h3 className="font-bold text-lg text-white">Top Courses by Enrollment</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics.courseStats.slice(0, 5)}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="title" stroke="#525252" tick={{ fill: '#737373', fontSize: 12 }} />
                            <YAxis stroke="#525252" tick={{ fill: '#737373', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#171717',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    color: '#fff'
                                }}
                            />
                            <Legend />
                            <Bar dataKey="enrollments" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </GlassCard>
            )}

            {/* AI Insights Panel */}
            <div className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-black to-neutral-900 p-8 rounded-3xl border border-white/10 group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Sparkles className="text-yellow-400" size={24} />
                            <h3 className="font-bold text-xl text-white">AI Smart Insights</h3>
                        </div>
                        <span className="bg-white/5 text-xs px-3 py-1.5 rounded-full text-blue-400 font-medium border border-blue-500/20">
                            Powered by Gemini
                        </span>
                    </div>

                    <div className="space-y-3 min-h-[150px] mb-6">
                        {aiMutation.isPending ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-neutral-400">
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white"></div>
                                    <span>Analyzing platform data...</span>
                                </div>
                                {[...Array(2)].map((_, idx) => (
                                    <div key={idx} className="bg-white/5 p-4 rounded-lg animate-pulse border border-white/5">
                                        <div className="h-3 bg-white/5 rounded w-full mb-2"></div>
                                        <div className="h-3 bg-white/5 rounded w-3/4"></div>
                                    </div>
                                ))}
                            </div>
                        ) : aiMutation.isError ? (
                            <div className="bg-red-500/10 p-6 rounded-xl border border-red-500/20 text-center">
                                <p className="text-red-300 font-medium">Failed to generate insights.</p>
                                <p className="text-xs text-red-400 mt-2">Please ensure the AI service is available.</p>
                            </div>
                        ) : aiInsights ? (
                            <GlassCard className="p-6">
                                <div className="flex gap-4">
                                    <span className="text-2xl pt-1">💡</span>
                                    <div className="text-neutral-300 leading-relaxed whitespace-pre-wrap text-sm">{aiInsights}</div>
                                </div>
                            </GlassCard>
                        ) : (
                            <div className="bg-white/5 p-8 rounded-xl text-center border border-white/5 border-dashed">
                                <Sparkles className="mx-auto mb-3 text-neutral-500" size={32} />
                                <p className="text-neutral-300 mb-2 font-medium">Ready to analyze your data</p>
                                <p className="text-xs text-neutral-500">Click the button below to generate actionable insights</p>
                            </div>
                        )}
                    </div>

                    <GlassButton
                        onClick={() => aiMutation.mutate()}
                        disabled={aiMutation.isPending || !stats}
                        variant="primary"
                        className="w-full py-4 text-base"
                    >
                        {aiMutation.isPending ? 'Processing...' : 'Generate AI Analysis'}
                        {!aiMutation.isPending && <Sparkles size={18} />}
                    </GlassButton>
                </div>
            </div>
        </div>
    );
}

// Stat Card Component
function StatCard({ title, value, icon, trend }: { title: string; value: number | string; icon: React.ReactNode; trend: string }) {
    return (
        <GlassCard className="p-6 group hover:border-white/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-neutral-400 text-sm font-medium uppercase tracking-wide">{title}</h3>
                <div className="opacity-70 group-hover:opacity-100 transition-opacity bg-white/5 p-2 rounded-lg">{icon}</div>
            </div>
            <p className="text-3xl font-bold text-white mb-2 tracking-tight">{value}</p>
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                <span className="text-green-400 font-medium">↑ {trend}</span>
            </div>
        </GlassCard>
    );
}