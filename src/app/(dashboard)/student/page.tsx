'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import SuccessModal from '@/components/SuccessModal';
import ErrorModal from '@/components/ErrorModal';
import Link from 'next/link';
import { BookOpen, Download, Play, CheckCircle, ExternalLink, Loader2, Award } from 'lucide-react';

interface Course {
    id: string;
    title: string;
    description: string;
    mentor: { email: string };
    modules?: { id: string; title: string }[];
    _count?: { enrollments: number };
}

interface EnrollmentStatus {
    isEnrolled: boolean;
    enrollment: any | null;
}

export default function StudentDashboard() {
    const queryClient = useQueryClient();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [enrolledCourseName, setEnrolledCourseName] = useState('');
    const [downloadingId, setDownloadingId] = useState<string | null>(null);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [enrollmentStatuses, setEnrollmentStatuses] = useState<Record<string, boolean>>({});

    const { data: courses, isLoading } = useQuery({
        queryKey: ['courses'],
        queryFn: async () => {
            const res = await api.get<Course[]>('/courses');
            return res.data;
        },
    });

    // Fetch enrollment statuses
    useEffect(() => {
        const fetchEnrollmentStatuses = async () => {
            if (!courses) return;

            const statuses: Record<string, boolean> = {};
            await Promise.all(
                courses.map(async (course) => {
                    try {
                        const res = await api.get<EnrollmentStatus>(`/courses/${course.id}/enrollment-status`);
                        statuses[course.id] = res.data.isEnrolled;
                    } catch (err) {
                        statuses[course.id] = false;
                    }
                })
            );
            setEnrollmentStatuses(statuses);
        };

        fetchEnrollmentStatuses();
    }, [courses]);

    const enrollMutation = useMutation({
        mutationFn: async ({ courseId, courseName }: { courseId: string; courseName: string }) => {
            setEnrolledCourseName(courseName);
            return await api.post(`/courses/${courseId}/enroll`);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            setEnrollmentStatuses(prev => ({ ...prev, [variables.courseId]: true }));
            setShowSuccessModal(true);
        },
        onError: (err: any) => {
            setErrorMessage(err.response?.data?.message || 'Enrollment failed. Please try again.');
            setShowErrorModal(true);
        },
    });

    const handleDownload = async (courseTitle: string, courseId: string) => {
        setDownloadingId(courseId);
        try {
            const response = await api.post('/documents/certificate',
                { studentName: 'Student User', courseName: courseTitle },
                { responseType: 'blob' }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${courseTitle.replace(/\\s+/g, '_')}_Certificate.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            setErrorMessage('Failed to download certificate. Ensure backend is running.');
            setShowErrorModal(true);
        } finally {
            setDownloadingId(null);
        }
    };

    return (
        <div className="min-h-screen">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Course Catalog</h1>
                <p className="text-neutral-400">Explore and enroll in courses to advance your skills</p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, idx) => (
                        <div key={idx} className="bg-neutral-900/40 p-6 rounded-2xl animate-pulse border border-white/5">
                            <div className="h-40 bg-white/5 rounded-xl mb-4"></div>
                            <div className="h-6 bg-white/5 rounded w-3/4 mb-3"></div>
                            <div className="h-4 bg-white/5 rounded w-1/2 mb-4"></div>
                        </div>
                    ))}
                </div>
            ) : courses?.length === 0 ? (
                <div className="bg-neutral-900/40 p-16 rounded-2xl text-center border border-white/5">
                    <div className="mx-auto w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <BookOpen size={32} className="text-neutral-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Courses Available</h3>
                    <p className="text-neutral-400">Check back soon for new content.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses?.map((course, idx) => {
                        const isEnrolled = enrollmentStatuses[course.id] || false;

                        return (
                            <div
                                key={course.id}
                                className="group relative bg-neutral-900/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 hover:bg-neutral-900/60 transition-all duration-300 flex flex-col"
                            >
                                {/* Thumbnail */}
                                <div className="h-48 bg-gradient-to-br from-neutral-800 to-neutral-900 relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                                    <div className="absolute inset-0 bg-black/20" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Award className={`w-12 h-12 ${idx % 2 === 0 ? "text-blue-400" : "text-purple-400"} opacity-80`} />
                                    </div>
                                    {isEnrolled && (
                                        <div className="absolute top-4 right-4 bg-green-500/20 backdrop-blur-md border border-green-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                                            <CheckCircle size={12} className="text-green-400" />
                                            <span className="text-xs font-medium text-green-400">Enrolled</span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{course.title}</h3>
                                    <p className="text-sm text-neutral-400 line-clamp-2 mb-4 flex-1">
                                        {course.description}
                                    </p>

                                    <div className="flex items-center gap-3 text-xs text-neutral-500 mb-6">
                                        <div className="flex items-center gap-1">
                                            <BookOpen size={14} />
                                            <span>{course.modules?.length || 0} Modules</span>
                                        </div>
                                        <div className="w-1 h-1 bg-neutral-700 rounded-full" />
                                        <span>{course.mentor?.email?.split('@')[0]}</span>
                                    </div>

                                    <div className="flex gap-3 mt-auto">
                                        {!isEnrolled ? (
                                            <button
                                                onClick={() => enrollMutation.mutate({ courseId: course.id, courseName: course.title })}
                                                disabled={enrollMutation.isPending}
                                                className="flex-1 bg-white text-black py-2.5 rounded-lg text-sm font-semibold hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {enrollMutation.isPending && (
                                                    <Loader2 size={16} className="animate-spin" />
                                                )}
                                                Enroll Now
                                            </button>
                                        ) : (
                                            <Link
                                                href={`/student/courses/${course.id}`}
                                                className="flex-1 bg-white/10 border border-white/10 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Play size={16} fill="currentColor" />
                                                Continue
                                            </Link>
                                        )}

                                        <Link
                                            href={`/student/courses/${course.id}`}
                                            className="p-2.5 bg-neutral-800 border border-white/5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-700 transition-all"
                                            title="View Details"
                                        >
                                            <ExternalLink size={18} />
                                        </Link>

                                        {isEnrolled && (
                                            <button
                                                onClick={() => handleDownload(course.title, course.id)}
                                                disabled={downloadingId === course.id}
                                                className="p-2.5 bg-neutral-800 border border-white/5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-700 transition-all disabled:opacity-50"
                                                title="Download Certificate"
                                            >
                                                {downloadingId === course.id ? (
                                                    <Loader2 size={18} className="animate-spin" />
                                                ) : (
                                                    <Download size={18} />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="Successfully Enrolled!"
                message={`You've been enrolled in "${enrolledCourseName}". Start learning now!`}
                icon="🎓"
            />

            <ErrorModal
                isOpen={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                title="Oops!"
                message={errorMessage}
                icon="⚠️"
            />
        </div>
    );
}