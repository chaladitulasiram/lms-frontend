'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import SuccessModal from '@/components/SuccessModal';
import Link from 'next/link';

interface Course {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    _count?: { enrollments: number };
    enrollments?: Array<{
        userId: string;
        user: {
            email: string;
            name: string | null;
        };
    }>;
}

export default function MentorDashboard() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [createdCourseName, setCreatedCourseName] = useState('');

    const { data: courses, isLoading } = useQuery({
        queryKey: ['courses'],
        queryFn: async () => {
            const res = await api.get<Course[]>('/courses');
            return res.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (newCourse: { title: string; description: string }) => {
            return await api.post('/courses', newCourse);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            setIsModalOpen(false);
            setCreatedCourseName(formData.title);
            setFormData({ title: '', description: '' });
            setShowSuccessModal(true);
        },
        onError: (err) => {
            console.error(err);
            alert('Failed to create course');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    // Calculate total students across all courses
    const totalStudents = courses?.reduce((sum, course) => sum + (course._count?.enrollments || 0), 0) || 0;

    return (
        <div className="min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-4xl font-bold gradient-text mb-2 font-display">My Courses</h1>
                    <p className="text-gray-400">Manage and create your educational content</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gradient-to-r from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)] text-white px-8 py-3 rounded-xl glow hover:scale-105 transition-cyber font-semibold group"
                >
                    <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create New Course
                    </span>
                </button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, idx) => (
                        <div key={idx} className="glass p-6 rounded-2xl animate-pulse border border-[hsl(190,95%,50%)]/20">
                            <div className="h-32 bg-[hsl(190,95%,50%)]/10 rounded-xl mb-4"></div>
                            <div className="h-6 bg-[hsl(190,95%,50%)]/10 rounded w-3/4 mb-3"></div>
                            <div className="h-4 bg-[hsl(190,95%,50%)]/10 rounded w-full mb-2"></div>
                            <div className="h-4 bg-[hsl(190,95%,50%)]/10 rounded w-5/6 mb-6"></div>
                            <div className="h-10 bg-[hsl(190,95%,50%)]/10 rounded-lg"></div>
                        </div>
                    ))}
                </div>
            ) : courses?.length === 0 ? (
                <div className="glass p-16 rounded-2xl text-center border border-[hsl(190,95%,50%)]/20 elevated">
                    <div className="text-7xl mb-6 animate-float glow-text">📚</div>
                    <h3 className="text-2xl font-bold text-white mb-3 font-display">No Courses Yet</h3>
                    <p className="text-gray-400 mb-6">Start by creating your first course!</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-gradient-to-r from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)] text-white px-8 py-3 rounded-xl glow hover:scale-105 transition-cyber font-semibold"
                    >
                        Create Your First Course
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses?.map((course, idx) => (
                        <div
                            key={course.id}
                            className="group relative card-hover"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            {/* Card Container */}
                            <div className="relative h-full glass-dark rounded-3xl overflow-hidden border-2 border-[hsl(190,95%,50%)]/20 group-hover:border-[hsl(190,95%,50%)]/50 transition-all duration-500 elevated">

                                {/* Hover Glow */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)] rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>

                                {/* Hero Section */}
                                <div className="relative h-48 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(260,80%,60%)]/30 via-[hsl(280,70%,55%)]/30 to-[hsl(190,95%,50%)]/30"></div>

                                    {/* Pattern */}
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="absolute inset-0" style={{
                                            backgroundImage: 'linear-gradient(45deg, hsl(190,95%,50%) 25%, transparent 25%), linear-gradient(-45deg, hsl(260,80%,60%) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, hsl(190,95%,50%) 75%), linear-gradient(-45deg, transparent 75%, hsl(260,80%,60%) 75%)',
                                            backgroundSize: '20px 20px',
                                            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                                        }}></div>
                                    </div>

                                    {/* Icon */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-r from-[hsl(260,80%,60%)] to-[hsl(190,95%,50%)] rounded-full blur-3xl opacity-50 animate-pulse-slow scale-150"></div>
                                            <svg className="relative w-24 h-24 text-white filter drop-shadow-2xl animate-float" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="absolute top-4 right-4 glass px-4 py-2 rounded-full backdrop-blur-md border border-green-400/30">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs font-bold text-green-400">Published</span>
                                        </div>
                                    </div>

                                    {/* Bottom Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[hsl(220,25%,10%)] to-transparent"></div>
                                </div>

                                {/* Content */}
                                <div className="relative p-6 space-y-4">
                                    {/* Title */}
                                    <h3 className="font-display font-bold text-2xl text-white group-hover:gradient-text transition-all duration-300 line-clamp-2 leading-tight">
                                        {course.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 min-h-[2.5rem]">
                                        {course.description}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex items-center gap-4 pt-2 border-t border-[hsl(190,95%,50%)]/10">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                            <svg className="w-4 h-4 text-[hsl(260,80%,60%)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                            <span>{course._count?.enrollments || 0} students</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                            <svg className="w-4 h-4 text-[hsl(190,95%,50%)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <Link
                                        href={`/mentor/courses/${course.id}`}
                                        className="block w-full relative overflow-hidden bg-gradient-to-r from-[hsl(260,80%,60%)] to-[hsl(190,95%,50%)] text-white py-3.5 px-4 rounded-xl font-bold glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group/btn mt-4"
                                    >
                                        {/* Shine Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000"></div>

                                        <span className="relative flex items-center justify-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            <span className="text-sm">Manage Content</span>
                                            <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {courses && courses.length > 0 && (
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass p-6 rounded-2xl border border-[hsl(190,95%,50%)]/20 elevated">
                        <div className="flex items-center gap-4">
                            <div className="text-4xl glow-text">📚</div>
                            <div>
                                <p className="text-sm text-gray-400">Total Courses</p>
                                <p className="text-3xl font-bold gradient-text font-display">{courses.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="glass p-6 rounded-2xl border border-[hsl(190,95%,50%)]/20 elevated">
                        <div className="flex items-center gap-4">
                            <div className="text-4xl glow-text">👥</div>
                            <div>
                                <p className="text-sm text-gray-400">Total Students</p>
                                <p className="text-3xl font-bold gradient-text font-display">{totalStudents}</p>
                            </div>
                        </div>
                    </div>
                    <div className="glass p-6 rounded-2xl border border-[hsl(190,95%,50%)]/20 elevated">
                        <div className="flex items-center gap-4">
                            <div className="text-4xl glow-text">⭐</div>
                            <div>
                                <p className="text-sm text-gray-400">Avg. Rating</p>
                                <p className="text-3xl font-bold gradient-text font-display">4.8</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="glass-dark w-full max-w-2xl rounded-2xl border border-[hsl(190,95%,50%)]/30 overflow-hidden elevated">
                        <div className="bg-gradient-to-r from-[hsl(190,95%,50%)]/20 to-[hsl(260,80%,60%)]/20 p-6 border-b border-[hsl(190,95%,50%)]/20">
                            <h2 className="text-3xl font-bold text-white mb-2 font-display">Create New Course</h2>
                            <p className="text-gray-400 text-sm">Share your knowledge with the world</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-3">
                                    Course Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 glass border border-[hsl(190,95%,50%)]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[hsl(190,95%,50%)] focus:border-transparent transition-smooth bg-black/20"
                                    placeholder="e.g., Advanced Web Development"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-3">
                                    Description
                                </label>
                                <textarea
                                    required
                                    rows={5}
                                    className="w-full px-4 py-3 glass border border-[hsl(190,95%,50%)]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[hsl(190,95%,50%)] focus:border-transparent transition-smooth resize-none bg-black/20"
                                    placeholder="Describe what students will learn in this course..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-3 text-gray-400 hover:text-white transition-smooth font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createMutation.isPending}
                                    className="px-8 py-3 bg-gradient-to-r from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)] text-white rounded-xl glow hover:scale-105 transition-cyber font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {createMutation.isPending ? (
                                        <span className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            Creating...
                                        </span>
                                    ) : (
                                        'Create Course'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="Course Created!"
                message={`"${createdCourseName}" has been successfully created and is now available to students!`}
                icon="🎉"
            />
        </div>
    );
}