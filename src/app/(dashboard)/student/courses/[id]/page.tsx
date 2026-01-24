'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import Link from 'next/link';
import { Play, FileText, ChevronLeft, ChevronRight, Lock, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass/GlassCard';
import { GlassButton } from '@/components/ui/glass/GlassButton';
import { PageHeader } from '@/components/ui/glass/PageHeader';

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
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white"></div>
        </div>
    );

    if (error || !course) return (
        <div className="p-10 text-center">
            <h2 className="text-2xl font-bold text-red-500">Course not found</h2>
            <Link href="/student" className="text-blue-400 hover:text-white mt-4 block">← Return to Catalog</Link>
        </div>
    );

    const videoId = activeModule?.videoUrl ? getYouTubeVideoId(activeModule.videoUrl) : null;

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] py-4">
            {/* Header / Nav */}
            <div className="mb-6 flex items-center gap-4">
                <Link href="/student" className="p-2 rounded-full hover:bg-white/10 transition-colors text-neutral-400 hover:text-white">
                    <ChevronLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight leading-none">{course.title}</h1>
                    <p className="text-sm text-neutral-500 mt-1">By {course.mentor.email}</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                {/* Main Content: Video & Text */}
                <div className="flex-1 flex flex-col min-h-0 overflow-y-auto pr-2">
                    {activeModule ? (
                        <div className="animate-fadeIn space-y-6">
                            {/* Video Player */}
                            <div className="aspect-video bg-black rounded-3xl overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 group">
                                {videoId ? (
                                    <iframe
                                        className="absolute inset-0 w-full h-full"
                                        src={`https://www.youtube.com/embed/${videoId}`}
                                        title={activeModule.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : activeModule.videoUrl ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900">
                                        <Play size={48} className="text-neutral-700 mb-4" />
                                        <p className="text-neutral-500 text-sm mb-4">Video available at external link</p>
                                        <a
                                            href={activeModule.videoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300 hover:underline"
                                        >
                                            Open Video
                                        </a>
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900 border border-white/5">
                                        <FileText size={48} className="text-neutral-700 mb-4" />
                                        <p className="text-neutral-500 text-sm font-medium tracking-wide">TEXT-ONLY LESSON</p>
                                    </div>
                                )}
                            </div>

                            {/* Content & Navigation */}
                            <div className="space-y-6 pb-12">
                                <div className="flex items-start justify-between">
                                    <h2 className="text-3xl font-bold text-white tracking-tight">{activeModule.title}</h2>

                                    {/* Nav Buttons */}
                                    <div className="flex gap-2">
                                        <GlassButton
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => {
                                                const currentIndex = course.modules.findIndex(m => m.id === activeModule.id);
                                                if (currentIndex > 0) {
                                                    setActiveModule(course.modules[currentIndex - 1]);
                                                }
                                            }}
                                            disabled={course.modules.findIndex(m => m.id === activeModule.id) === 0}
                                        >
                                            <ChevronLeft size={16} />
                                            Prev
                                        </GlassButton>
                                        <GlassButton
                                            variant="primary"
                                            size="sm"
                                            onClick={() => {
                                                const currentIndex = course.modules.findIndex(m => m.id === activeModule.id);
                                                if (currentIndex < course.modules.length - 1) {
                                                    setActiveModule(course.modules[currentIndex + 1]);
                                                }
                                            }}
                                            disabled={course.modules.findIndex(m => m.id === activeModule.id) === course.modules.length - 1}
                                        >
                                            Next
                                            <ChevronRight size={16} />
                                        </GlassButton>
                                    </div>
                                </div>

                                <GlassCard className="p-8 text-neutral-300 leading-relaxed whitespace-pre-wrap">
                                    {activeModule.content}
                                </GlassCard>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-neutral-500">
                            <Play size={48} className="mb-4 opacity-20" />
                            <p>Select a module to begin</p>
                        </div>
                    )}
                </div>

                {/* Sidebar: Module List (Playlist) */}
                <div className="w-full lg:w-96 flex flex-col h-full bg-neutral-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                    <div className="p-6 border-b border-white/5 bg-white/5 backdrop-blur-md">
                        <h3 className="font-bold text-white">Course Content</h3>
                        <p className="text-xs text-neutral-400 mt-1">{course.modules.length} Lessons • {course.modules.reduce((acc, m) => acc + (m.videoUrl ? 1 : 0), 0)} Videos</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {course.modules.map((mod, idx) => {
                            const isActive = activeModule?.id === mod.id;
                            return (
                                <button
                                    key={mod.id}
                                    onClick={() => setActiveModule(mod)}
                                    className={`
                                        w-full text-left p-4 rounded-2xl transition-all duration-200 flex items-center gap-4 group
                                        ${isActive
                                            ? 'bg-white text-black shadow-lg scale-[1.02]'
                                            : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'}
                                    `}
                                >
                                    <span className={`
                                        flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-colors
                                        ${isActive ? 'bg-black text-white' : 'bg-white/10 text-neutral-500 group-hover:bg-white/20 group-hover:text-white'}
                                    `}>
                                        {idx + 1}
                                    </span>

                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium truncate ${isActive ? 'text-black' : 'text-neutral-300 group-hover:text-white'}`}>
                                            {mod.title}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            {mod.videoUrl ? (
                                                <span className={`text-[10px] flex items-center gap-1 ${isActive ? 'text-neutral-600' : 'text-neutral-500'}`}>
                                                    <Play size={10} fill="currentColor" /> Video
                                                </span>
                                            ) : (
                                                <span className={`text-[10px] flex items-center gap-1 ${isActive ? 'text-neutral-600' : 'text-neutral-500'}`}>
                                                    <FileText size={10} /> Reading
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {isActive && <Play size={16} fill="currentColor" className="text-black" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
