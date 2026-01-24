'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import SuccessModal from '@/components/SuccessModal';
import Link from 'next/link';
import { Plus, BookOpen, Users, Star, Loader2, ArrowRight } from 'lucide-react';

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
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">My Courses</h1>
                    <p className="text-neutral-400">Manage and create your educational content</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-white text-black px-6 py-2.5 rounded-xl font-semibold hover:bg-neutral-200 transition-colors flex items-center gap-2"
                >
                    <Plus size={20} />
                    Create New Course
                </button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, idx) => (
                        <div key={idx} className="bg-neutral-900/40 p-6 rounded-2xl animate-pulse border border-white/5">
                            <div className="h-32 bg-white/5 rounded-xl mb-4"></div>
                            <div className="h-6 bg-white/5 rounded w-3/4 mb-3"></div>
                            <div className="h-4 bg-white/5 rounded w-full mb-2"></div>
                            <div className="h-4 bg-white/5 rounded w-5/6 mb-6"></div>
                            <div className="h-10 bg-white/5 rounded-lg"></div>
                        </div>
                    ))}
                </div>
            ) : courses?.length === 0 ? (
                <div className="bg-neutral-900/40 p-16 rounded-2xl text-center border border-white/5">
                    <div className="mx-auto w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <BookOpen size={32} className="text-neutral-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Courses Yet</h3>
                    <p className="text-neutral-400 mb-6">Start by creating your first course!</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-white text-black px-6 py-2.5 rounded-xl font-semibold hover:bg-neutral-200 transition-colors inline-flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Create Your First Course
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses?.map((course) => (
                        <div
                            key={course.id}
                            className="group relative bg-neutral-900/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 hover:bg-neutral-900/60 transition-all duration-300 flex flex-col"
                        >
                            {/* Blue Accent Top */}
                            <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 w-full" />

                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{course.title}</h3>
                                <p className="text-sm text-neutral-400 line-clamp-2 mb-4 flex-1">
                                    {course.description}
                                </p>

                                {/* Stats */}
                                <div className="flex items-center gap-4 py-4 border-t border-white/5 text-xs text-neutral-400">
                                    <div className="flex items-center gap-1.5">
                                        <Users size={14} />
                                        <span>{course._count?.enrollments || 0} students</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <BookOpen size={14} />
                                        <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <Link
                                    href={`/mentor/courses/${course.id}`}
                                    className="flex items-center justify-center gap-2 w-full bg-white/5 border border-white/10 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-white/10 transition-colors group"
                                >
                                    <span>Manage Content</span>
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {courses && courses.length > 0 && (
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-neutral-900/40 p-6 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-neutral-400">Total Courses</p>
                                <p className="text-2xl font-bold text-white">{courses.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-neutral-900/40 p-6 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                                <Users size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-neutral-400">Total Students</p>
                                <p className="text-2xl font-bold text-white">{totalStudents}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-neutral-900/40 p-6 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
                                <Star size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-neutral-400">Avg. Rating</p>
                                <p className="text-2xl font-bold text-white">4.8</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="w-full max-w-lg bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-white/5">
                            <h2 className="text-xl font-bold text-white mb-1">Create New Course</h2>
                            <p className="text-neutral-400 text-sm">Share your knowledge with the world</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-neutral-300 mb-2">
                                    Course Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                    placeholder="e.g., Advanced Web Development"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-neutral-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
                                    placeholder="Describe what students will learn in this course..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-neutral-400 hover:text-white transition-colors text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createMutation.isPending}
                                    className="px-6 py-2 bg-white text-black rounded-lg text-sm font-semibold hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {createMutation.isPending && (
                                        <Loader2 size={14} className="animate-spin" />
                                    )}
                                    {createMutation.isPending ? 'Creating...' : 'Create Course'}
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