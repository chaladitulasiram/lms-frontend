'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import Link from 'next/link';
import SuccessModal from '@/components/SuccessModal';
import ErrorModal from '@/components/ErrorModal';

export default function MentorCourseManager() {
    const params = useParams();
    const queryClient = useQueryClient();
    const courseId = params.id as string;

    const [newLesson, setNewLesson] = useState({ title: '', content: '', videoUrl: '' });
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { data: course, isLoading } = useQuery({
        queryKey: ['course', courseId],
        queryFn: async () => {
            const res = await api.get(`/courses/${courseId}`);
            return res.data;
        },
    });

    const addModuleMutation = useMutation({
        mutationFn: async (data: typeof newLesson) => {
            return await api.post(`/courses/${courseId}/modules`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course', courseId] });
            setNewLesson({ title: '', content: '', videoUrl: '' });
            setShowSuccessModal(true);
        },
        onError: (err: any) => {
            console.error(err);
            setErrorMessage(err.response?.data?.message || 'Failed to add lesson. Please try again.');
            setShowErrorModal(true);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLesson.title || !newLesson.content) return;
        addModuleMutation.mutate(newLesson);
    };

    if (isLoading) return (
        <div className="flex h-screen items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-[hsl(190,95%,50%)] border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-400 text-lg">Loading Course Manager...</p>
            </div>
        </div>
    );

    if (!course) return (
        <div className="p-10 text-center">
            <div className="text-6xl mb-4 animate-float">❌</div>
            <h2 className="text-2xl font-bold text-red-500 mb-4">Course not found</h2>
            <Link href="/mentor" className="text-[hsl(190,95%,50%)] hover:underline font-medium">← Return to Dashboard</Link>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto pb-12">
            <Link href="/mentor" className="text-gray-400 hover:text-[hsl(190,95%,50%)] mb-6 inline-flex items-center gap-2 font-medium transition-smooth group">
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
            </Link>

            {/* Enhanced Header Card */}
            <div className="glass-dark p-8 rounded-3xl border-2 border-[hsl(190,95%,50%)]/30 mb-8 elevated relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[hsl(190,95%,50%)]/10 to-[hsl(260,80%,60%)]/10 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)] flex items-center justify-center glow">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold text-white font-display gradient-text">{course.title}</h1>
                                    <p className="text-sm text-gray-500 mt-1">Course Management</p>
                                </div>
                            </div>
                            <p className="text-gray-400 max-w-2xl leading-relaxed">{course.description}</p>
                        </div>

                        <div className="glass px-6 py-3 rounded-xl border border-[hsl(190,95%,50%)]/30 text-center">
                            <div className="text-3xl font-bold gradient-text">{course.modules.length}</div>
                            <div className="text-xs text-gray-400 mt-1">Total Lessons</div>
                        </div>
                    </div>

                    <div className="flex gap-6 text-sm text-gray-400 border-t border-[hsl(190,95%,50%)]/10 pt-4">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[hsl(190,95%,50%)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Created: {new Date(course.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[hsl(260,80%,60%)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>Mentor ID: {course.mentorId.slice(0, 8)}...</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Enhanced Add Lesson Form */}
                <div className="lg:col-span-1">
                    <div className="glass-dark p-6 rounded-3xl border-2 border-[hsl(190,95%,50%)]/20 sticky top-6 elevated">
                        <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3 font-display">
                            <div className="bg-gradient-to-r from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)] p-3 rounded-xl glow-sm">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <span className="gradient-text">Add Lesson</span>
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Lesson Title */}
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-[hsl(190,95%,50%)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                    </svg>
                                    Lesson Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-3.5 glass border border-[hsl(190,95%,50%)]/30 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-[hsl(190,95%,50%)] focus:border-transparent outline-none transition-smooth bg-black/30"
                                    placeholder="e.g. 1.1 Introduction to React"
                                    value={newLesson.title}
                                    onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                                />
                            </div>

                            {/* Video URL */}
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-[hsl(260,80%,60%)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Video URL (Optional)
                                </label>
                                <input
                                    type="url"
                                    className="w-full p-3.5 glass border border-[hsl(190,95%,50%)]/30 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-[hsl(260,80%,60%)] focus:border-transparent outline-none transition-smooth bg-black/30"
                                    placeholder="https://youtube.com/watch?v=..."
                                    value={newLesson.videoUrl}
                                    onChange={(e) => setNewLesson({ ...newLesson, videoUrl: e.target.value })}
                                />
                                <p className="text-xs text-gray-500 mt-2">Supports YouTube, Vimeo, or direct video links</p>
                            </div>

                            {/* Content/Notes */}
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-[hsl(190,95%,50%)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Lesson Notes
                                </label>
                                <textarea
                                    required
                                    rows={6}
                                    className="w-full p-3.5 glass border border-[hsl(190,95%,50%)]/30 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-[hsl(190,95%,50%)] focus:border-transparent outline-none transition-smooth resize-none bg-black/30"
                                    placeholder="Enter lesson description, key points, resources, etc..."
                                    value={newLesson.content}
                                    onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={addModuleMutation.isPending}
                                className="w-full relative overflow-hidden bg-gradient-to-r from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)] text-white py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 font-bold glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
                            >
                                {/* Button Shine */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>

                                <span className="relative flex items-center justify-center gap-2">
                                    {addModuleMutation.isPending ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                            <span>Saving Lesson...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            <span>Add Lesson</span>
                                        </>
                                    )}
                                </span>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Enhanced Lessons List */}
                <div className="lg:col-span-2">
                    <div className="glass-dark p-6 rounded-3xl border-2 border-[hsl(190,95%,50%)]/20 elevated">
                        <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3 font-display">
                            <div className="bg-gradient-to-r from-[hsl(260,80%,60%)] to-[hsl(190,95%,50%)] p-3 rounded-xl glow-sm">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <span className="gradient-text">Course Curriculum</span>
                        </h2>

                        {course.modules.length === 0 ? (
                            <div className="text-center py-20 glass rounded-2xl border-2 border-dashed border-[hsl(190,95%,50%)]/30 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(190,95%,50%)]/5 to-[hsl(260,80%,60%)]/5"></div>
                                <div className="relative z-10">
                                    <div className="text-7xl mb-4 animate-float">📚</div>
                                    <p className="text-gray-300 font-bold text-lg mb-2">No Lessons Yet</p>
                                    <p className="text-sm text-gray-400">Use the form to add your first lesson</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {course.modules.map((mod: any, idx: number) => (
                                    <div key={mod.id} className="group relative">
                                        {/* Card */}
                                        <div className="p-6 glass border-2 border-[hsl(190,95%,50%)]/20 rounded-2xl hover:border-[hsl(190,95%,50%)]/50 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                                            {/* Hover Glow */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-[hsl(190,95%,50%)]/5 to-[hsl(260,80%,60%)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                            <div className="relative z-10 flex gap-4">
                                                {/* Lesson Number */}
                                                <div className="flex-shrink-0">
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)] flex items-center justify-center text-white font-bold text-lg glow shadow-lg">
                                                        {idx + 1}
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-white text-xl mb-2 group-hover:gradient-text transition-all duration-300">
                                                        {mod.title}
                                                    </h3>
                                                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-3">
                                                        {mod.content}
                                                    </p>

                                                    {/* Video Badge */}
                                                    {mod.videoUrl && (
                                                        <div className="inline-flex items-center gap-2 glass px-3 py-1.5 rounded-lg border border-[hsl(260,80%,60%)]/30 text-xs">
                                                            <svg className="w-4 h-4 text-[hsl(260,80%,60%)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <span className="text-gray-300 font-medium">Video Included</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Delete Button */}
                                                <button className="flex-shrink-0 w-10 h-10 rounded-xl glass border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="Lesson Added!"
                message={`"${newLesson.title}" has been successfully added to your course.`}
                icon="✅"
            />

            <ErrorModal
                isOpen={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                title="Failed to Add Lesson"
                message={errorMessage}
                icon="⚠️"
            />
        </div>
    );
}
