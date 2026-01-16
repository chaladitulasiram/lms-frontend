'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import Link from 'next/link';

interface Module {
    id: string;
    title: string;
    content: string;
    videoUrl?: string | null;
}

interface CourseDetail {
    id: string;
    title: string;
    description: string;
    modules: Module[];
    mentor: { email: string };
}

// Helper function to extract YouTube video ID from URL
function getYouTubeVideoId(url: string): string | null {
    if (!url) return null;

    // Handle different YouTube URL formats
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
        /youtube\.com\/embed\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    return null;
}

export default function CoursePlayerPage() {
    const params = useParams();
    const courseId = params.id as string;
    const [activeModule, setActiveModule] = useState<Module | null>(null);

    const { data: course, isLoading, error } = useQuery({
        queryKey: ['course', courseId],
        queryFn: async () => {
            const res = await api.get<CourseDetail>(`/courses/${courseId}`);
            return res.data;
        },
    });

    // Auto-select first module when course loads
    if (course && !activeModule && course.modules.length > 0) {
        setActiveModule(course.modules[0]);
    }

    if (isLoading) return (
        <div className="flex h-screen items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[hsl(190,95%,50%)] border-t-transparent"></div>
        </div>
    );

    if (error || !course) return (
        <div className="p-10 text-center">
            <h2 className="text-2xl font-bold text-red-500">Course not found</h2>
            <Link href="/student" className="text-[hsl(190,95%,50%)] hover:underline mt-4 block">← Return to Catalog</Link>
        </div>
    );

    const videoId = activeModule?.videoUrl ? getYouTubeVideoId(activeModule.videoUrl) : null;

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] gap-6">
            {/* Sidebar: Module List */}
            <div className="w-full lg:w-80 glass border border-[hsl(190,95%,50%)]/20 rounded-2xl flex flex-col overflow-hidden elevated">
                <div className="p-6 border-b border-[hsl(190,95%,50%)]/20">
                    <Link href="/student" className="text-xs text-gray-400 hover:text-[hsl(190,95%,50%)] mb-2 block font-medium">
                        ← Back to Catalog
                    </Link>
                    <h2 className="font-bold text-lg text-white leading-tight">{course.title}</h2>
                    <p className="text-xs text-gray-400 mt-1">Mentor: {course.mentor.email}</p>
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
                                ? 'bg-gradient-to-r from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)] text-white shadow-md glow'
                                : 'hover:bg-[hsl(190,95%,50%)]/10 text-gray-300'
                                }`}
                        >
                            <span className={`flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${activeModule?.id === mod.id ? 'bg-white text-[hsl(190,95%,50%)]' : 'bg-[hsl(190,95%,50%)]/20 text-[hsl(190,95%,50%)]'
                                }`}>
                                {idx + 1}
                            </span>
                            <span className="font-medium text-sm truncate">{mod.title}</span>
                            {mod.videoUrl && (
                                <svg className="w-4 h-4 ml-auto flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 glass border border-[hsl(190,95%,50%)]/20 rounded-2xl p-8 overflow-y-auto elevated">
                {activeModule ? (
                    <div className="animate-fadeIn max-w-4xl mx-auto">
                        <div className="mb-6 border-b border-[hsl(190,95%,50%)]/20 pb-4">
                            <h1 className="text-3xl font-bold text-white font-display">{activeModule.title}</h1>
                        </div>

                        {/* Video Player */}
                        <div className="aspect-video bg-gradient-to-br from-[hsl(190,95%,50%)]/10 to-[hsl(260,80%,60%)]/10 rounded-xl mb-8 flex items-center justify-center relative group overflow-hidden border border-[hsl(190,95%,50%)]/20">
                            {videoId ? (
                                <iframe
                                    className="absolute inset-0 w-full h-full rounded-xl"
                                    src={`https://www.youtube.com/embed/${videoId}`}
                                    title={activeModule.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : activeModule.videoUrl ? (
                                <div className="text-center z-10">
                                    <div className="text-4xl mb-4">🎥</div>
                                    <p className="text-gray-400 text-sm mb-2">Video URL provided</p>
                                    <a
                                        href={activeModule.videoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[hsl(190,95%,50%)] hover:underline text-sm"
                                    >
                                        Open Video Link
                                    </a>
                                </div>
                            ) : (
                                <>
                                    <div className="absolute inset-0 bg-gradient-to-tr from-[hsl(190,95%,50%)]/20 to-[hsl(260,80%,60%)]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                    <div className="text-center z-10">
                                        <div className="w-20 h-20 bg-[hsl(190,95%,50%)]/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto border border-[hsl(190,95%,50%)]/30 group-hover:scale-110 transition-transform duration-300 cursor-pointer hover:bg-[hsl(190,95%,50%)]/30 glow">
                                            <svg className="w-8 h-8 text-[hsl(190,95%,50%)] ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                        </div>
                                        <p className="text-gray-400 text-sm font-mono tracking-wider">NO VIDEO AVAILABLE</p>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Text Content */}
                        <div className="prose max-w-none">
                            <h3 className="text-xl font-bold text-white mb-4 font-display">Lesson Notes</h3>
                            <div className="glass p-6 rounded-xl border border-[hsl(190,95%,50%)]/20 text-gray-300 leading-relaxed whitespace-pre-wrap">
                                {activeModule.content}
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8 pt-6 border-t border-[hsl(190,95%,50%)]/20">
                            <button
                                onClick={() => {
                                    const currentIndex = course.modules.findIndex(m => m.id === activeModule.id);
                                    if (currentIndex > 0) {
                                        setActiveModule(course.modules[currentIndex - 1]);
                                    }
                                }}
                                disabled={course.modules.findIndex(m => m.id === activeModule.id) === 0}
                                className="px-6 py-3 glass rounded-xl border border-[hsl(190,95%,50%)]/30 hover:bg-[hsl(190,95%,50%)]/10 hover:border-[hsl(190,95%,50%)]/50 text-[hsl(190,95%,50%)] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Previous Lesson
                            </button>

                            <button
                                onClick={() => {
                                    const currentIndex = course.modules.findIndex(m => m.id === activeModule.id);
                                    if (currentIndex < course.modules.length - 1) {
                                        setActiveModule(course.modules[currentIndex + 1]);
                                    }
                                }}
                                disabled={course.modules.findIndex(m => m.id === activeModule.id) === course.modules.length - 1}
                                className="px-6 py-3 bg-gradient-to-r from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)] text-white rounded-xl font-bold glow hover:scale-[1.02] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                            >
                                Next Lesson
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <div className="text-6xl mb-6 opacity-30 animate-float">📺</div>
                        <h2 className="text-2xl font-bold text-gray-300 font-display">Select a lesson to start learning</h2>
                        <p className="text-sm mt-2 text-gray-400">Choose a module from the sidebar list</p>
                    </div>
                )}
            </div>
        </div>
    );
}
