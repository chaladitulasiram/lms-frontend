'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import Link from 'next/link';

// Types matching your Backend
interface Module {
    id: string;
    title: string;
    content: string;
}

interface CourseDetail {
    id: string;
    title: string;
    description: string;
    modules: Module[];
    mentor: { email: string };
}

export default function CoursePlayerPage() {
    const params = useParams();
    const courseId = params.id as string;
    const [activeModule, setActiveModule] = useState<Module | null>(null);

    // 1. Fetch Course Details (including modules)
    const { data: course, isLoading, error } = useQuery({
        queryKey: ['course', courseId],
        queryFn: async () => {
            const res = await api.get<CourseDetail>(`/courses/${courseId}`);
            return res.data;
        },
    });

    if (isLoading) return (
        <div className="flex h-screen items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
    );

    if (error || !course) return (
        <div className="p-10 text-center">
            <h2 className="text-2xl font-bold text-red-500">Course not found</h2>
            <Link href="/student" className="text-blue-500 hover:underline mt-4 block">← Return to Catalog</Link>
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] gap-6 p-4">

            {/* Sidebar: Module List */}
            <div className="w-full lg:w-80 glass border border-blue-100 rounded-2xl flex flex-col overflow-hidden shadow-lg bg-white">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                    <Link href="/student" className="text-xs text-gray-500 hover:text-blue-600 mb-2 block font-medium">
                        ← Back to Catalog
                    </Link>
                    <h2 className="font-bold text-lg text-gray-800 leading-tight">{course.title}</h2>
                    <p className="text-xs text-gray-500 mt-1">Mentor: {course.mentor.email}</p>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {course.modules.length === 0 && (
                        <div className="p-8 text-center text-gray-400 text-sm">
                            No lessons have been uploaded yet.
                        </div>
                    )}

                    {course.modules.map((mod, idx) => (
                        <button
                            key={mod.id}
                            onClick={() => setActiveModule(mod)}
                            className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${activeModule?.id === mod.id
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'hover:bg-blue-50 text-gray-700'
                                }`}
                        >
                            <span className={`flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${activeModule?.id === mod.id ? 'bg-white text-blue-600' : 'bg-gray-200 text-gray-500'
                                }`}>
                                {idx + 1}
                            </span>
                            <span className="font-medium text-sm truncate">{mod.title}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-8 overflow-y-auto shadow-lg">
                {activeModule ? (
                    <div className="animate-fade-in-up max-w-4xl mx-auto">
                        <div className="mb-6 border-b pb-4">
                            <h1 className="text-3xl font-bold text-gray-800">{activeModule.title}</h1>
                        </div>

                        {/* Simulated Video Player */}
                        <div className="aspect-video bg-gray-900 rounded-xl mb-8 flex items-center justify-center relative group overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 to-purple-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <div className="text-center z-10">
                                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto border border-white/20 group-hover:scale-110 transition-transform duration-300 cursor-pointer hover:bg-white/20">
                                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                </div>
                                <p className="text-gray-400 text-sm font-mono tracking-wider">PREVIEW MODE</p>
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="prose max-w-none">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Lesson Notes</h3>
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {activeModule.content}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <div className="text-6xl mb-6 opacity-30">📺</div>
                        <h2 className="text-2xl font-bold text-gray-300">Select a lesson to start learning</h2>
                        <p className="text-sm mt-2 text-gray-400">Choose a module from the sidebar list</p>
                    </div>
                )}
            </div>
        </div>
    );
}