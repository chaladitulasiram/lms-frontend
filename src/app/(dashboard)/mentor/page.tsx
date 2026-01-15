'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import Link from 'next/link';

export default function MentorCourseManager() {
    const params = useParams();
    const queryClient = useQueryClient();
    const courseId = params.id as string;

    const [newLesson, setNewLesson] = useState({ title: '', content: '' });

    // 1. Fetch Course Data
    const { data: course, isLoading } = useQuery({
        queryKey: ['course', courseId],
        queryFn: async () => {
            const res = await api.get(`/courses/${courseId}`);
            return res.data;
        },
    });

    // 2. Mutation to Add Lesson
    const addModuleMutation = useMutation({
        mutationFn: async (data: typeof newLesson) => {
            return await api.post(`/courses/${courseId}/modules`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course', courseId] });
            setNewLesson({ title: '', content: '' });
            alert('Lesson Added Successfully!');
        },
        onError: (err: any) => {
            console.error(err);
            alert('Failed to add lesson.');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLesson.title || !newLesson.content) return;
        addModuleMutation.mutate(newLesson);
    };

    if (isLoading) return <div className="p-10 text-center">Loading Course Manager...</div>;
    if (!course) return <div className="p-10 text-center">Course not found</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <Link href="/mentor" className="text-gray-500 hover:text-blue-600 mb-6 inline-flex items-center gap-2 font-medium">
                <span>←</span> Back to Dashboard
            </Link>

            {/* Header Card */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                        <p className="text-gray-600 max-w-2xl">{course.description}</p>
                    </div>
                    <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold">
                        {course.modules.length} Lessons
                    </div>
                </div>
                <div className="mt-6 flex gap-6 text-sm text-gray-500 border-t pt-4">
                    <span>📅 Created: {new Date(course.createdAt).toLocaleDateString()}</span>
                    <span>👨‍🏫 Mentor ID: {course.mentorId}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Add New Lesson Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
                        <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                            <span className="bg-green-100 p-1 rounded">➕</span> Add Content
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Lesson Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                    placeholder="e.g. 1.1 Course Introduction"
                                    value={newLesson.title}
                                    onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Content / Notes</label>
                                <textarea
                                    required
                                    rows={8}
                                    className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                    placeholder="Enter lesson details, summary, or video embed links..."
                                    value={newLesson.content}
                                    onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={addModuleMutation.isPending}
                                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-bold shadow-lg shadow-blue-200"
                            >
                                {addModuleMutation.isPending ? 'Saving...' : 'Add Lesson'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Existing Lessons List */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                            <span className="bg-blue-100 p-1 rounded">📑</span> Course Curriculum
                        </h2>

                        {course.modules.length === 0 ? (
                            <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <div className="text-4xl mb-3">📂</div>
                                <p className="text-gray-500 font-medium">This course is empty.</p>
                                <p className="text-sm text-gray-400">Use the form on the left to add your first lesson.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {course.modules.map((mod: any, idx: number) => (
                                    <div key={mod.id} className="p-5 border border-gray-100 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition duration-200 group">
                                        <div className="flex justify-between items-start">
                                            <div className="flex gap-4">
                                                <span className="flex-shrink-0 bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold shadow-sm">
                                                    {idx + 1}
                                                </span>
                                                <div>
                                                    <h3 className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition">{mod.title}</h3>
                                                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{mod.content}</p>
                                                </div>
                                            </div>
                                            {/* Placeholder for Edit/Delete buttons in future */}
                                            <button className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}