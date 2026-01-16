'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import SuccessModal from '@/components/SuccessModal';
import ErrorModal from '@/components/ErrorModal';
import Link from 'next/link';

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

    // Fetch enrollment statuses for all courses
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
                <h1 className="text-4xl font-bold gradient-text mb-2 font-display">Course Catalog</h1>
                <p className="text-gray-400">Explore and enroll in courses to advance your skills</p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, idx) => (
                        <div key={idx} className="glass p-6 rounded-2xl animate-pulse border border-[hsl(190,95%,50%)]/20">
                            <div className="h-40 bg-[hsl(190,95%,50%)]/10 rounded-xl mb-4"></div>
                            <div className="h-6 bg-[hsl(190,95%,50%)]/10 rounded w-3/4 mb-3"></div>
                            <div className="h-4 bg-[hsl(190,95%,50%)]/10 rounded w-1/2 mb-4"></div>
                            <div className="h-3 bg-[hsl(190,95%,50%)]/10 rounded w-full mb-2"></div>
                            <div className="h-3 bg-[hsl(190,95%,50%)]/10 rounded w-5/6 mb-6"></div>
                            <div className="h-12 bg-[hsl(190,95%,50%)]/10 rounded-xl"></div>
                        </div>
                    ))}
                </div>
            ) : courses?.length === 0 ? (
                <div className="glass p-16 rounded-2xl text-center border border-[hsl(190,95%,50%)]/20 elevated">
                    <div className="text-7xl mb-6 animate-float glow-text">📚</div>
                    <h3 className="text-2xl font-bold text-white mb-3 font-display">No Courses Available Yet</h3>
                    <p className="text-gray-400">Check back soon for new learning opportunities!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses?.map((course, idx) => {
                        const isEnrolled = enrollmentStatuses[course.id] || false;

                        return (
                            <div
                                key={course.id}
                                className="group relative card-hover"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                {/* Card Container with Premium Glass Effect */}
                                <div className="relative h-full glass-dark rounded-3xl overflow-hidden border-2 border-[hsl(190,95%,50%)]/20 group-hover:border-[hsl(190,95%,50%)]/50 transition-all duration-500 elevated">

                                    {/* Animated Background Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(190,95%,50%)]/5 via-[hsl(260,80%,60%)]/5 to-[hsl(280,70%,55%)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    {/* Glow Effect on Hover */}
                                    <div className="absolute -inset-1 bg-gradient-to-r from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)] rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>

                                    {/* Course Thumbnail/Hero Section */}
                                    <div className="relative h-56 overflow-hidden">
                                        {/* Dynamic Gradient Background */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(190,95%,50%)]/30 via-[hsl(260,80%,60%)]/30 to-[hsl(280,70%,55%)]/30"></div>

                                        {/* Animated Mesh Pattern */}
                                        <div className="absolute inset-0 opacity-20">
                                            <div className="absolute inset-0" style={{
                                                backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(190,95%,50%) 1px, transparent 0)',
                                                backgroundSize: '40px 40px'
                                            }}></div>
                                        </div>

                                        {/* Course Icon with Animation */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="relative">
                                                {/* Pulsing Glow Behind Icon */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)] rounded-full blur-3xl opacity-50 animate-pulse-slow scale-150"></div>

                                                {/* Icon */}
                                                <div className="relative text-8xl animate-float filter drop-shadow-2xl">
                                                    {idx % 3 === 0 ? '🎓' : idx % 3 === 1 ? '💻' : '🚀'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Top Right Badge */}
                                        <div className="absolute top-4 right-4 glass px-4 py-2 rounded-full backdrop-blur-md border border-[hsl(190,95%,50%)]/30 glow-sm">
                                            {isEnrolled ? (
                                                <span className="text-xs font-bold text-green-400">✓ Enrolled</span>
                                            ) : (
                                                <span className="text-xs font-bold gradient-text">Featured</span>
                                            )}
                                        </div>

                                        {/* Bottom Gradient Overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[hsl(220,25%,10%)] to-transparent"></div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="relative p-6 space-y-4">
                                        {/* Course Title */}
                                        <h3 className="font-display font-bold text-2xl text-white group-hover:gradient-text transition-all duration-300 line-clamp-2 leading-tight">
                                            {course.title}
                                        </h3>

                                        {/* Mentor Info */}
                                        <div className="flex items-center gap-3">
                                            {/* Mentor Avatar */}
                                            <div className="relative">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)] flex items-center justify-center text-white font-bold text-sm glow-sm ring-2 ring-[hsl(190,95%,50%)]/20 ring-offset-2 ring-offset-[hsl(220,25%,10%)]">
                                                    {course.mentor?.email?.charAt(0).toUpperCase() || 'M'}
                                                </div>
                                                {/* Online Indicator */}
                                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[hsl(220,25%,10%)] animate-pulse"></div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-500 font-medium">Instructor</p>
                                                <p className="text-sm text-gray-300 font-semibold truncate">
                                                    {course.mentor?.email?.split('@')[0] || 'Expert Mentor'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 min-h-[2.5rem]">
                                            {course.description}
                                        </p>

                                        {/* Stats Row */}
                                        <div className="flex items-center gap-4 pt-2 border-t border-[hsl(190,95%,50%)]/10">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                                <svg className="w-4 h-4 text-[hsl(190,95%,50%)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                                <span>{course.modules?.length || 0} Lessons</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                </svg>
                                                <span>4.8</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                                <svg className="w-4 h-4 text-[hsl(260,80%,60%)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                                <span>{course._count?.enrollments || 0}</span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2 pt-4">
                                            {/* Primary Enroll/Enrolled Button */}
                                            {isEnrolled ? (
                                                <Link
                                                    href={`/student/courses/${course.id}`}
                                                    className="flex-1 relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3.5 px-4 rounded-xl font-bold glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group/btn"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000"></div>
                                                    <span className="relative flex items-center justify-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        <span className="text-sm">Continue Learning</span>
                                                        <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                        </svg>
                                                    </span>
                                                </Link>
                                            ) : (
                                                <button
                                                    onClick={() => enrollMutation.mutate({ courseId: course.id, courseName: course.title })}
                                                    disabled={enrollMutation.isPending}
                                                    className="flex-1 relative overflow-hidden bg-gradient-to-r from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)] text-white py-3.5 px-4 rounded-xl font-bold glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group/btn"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000"></div>
                                                    <span className="relative flex items-center justify-center gap-2">
                                                        {enrollMutation.isPending ? (
                                                            <>
                                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                                <span className="text-sm">Enrolling...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className="text-sm">Enroll Now</span>
                                                                <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                                </svg>
                                                            </>
                                                        )}
                                                    </span>
                                                </button>
                                            )}

                                            {/* View Course Button */}
                                            <Link
                                                href={`/student/courses/${course.id}`}
                                                className="px-4 py-3.5 glass rounded-xl border border-[hsl(190,95%,50%)]/30 hover:bg-[hsl(190,95%,50%)]/10 hover:border-[hsl(190,95%,50%)]/50 text-[hsl(190,95%,50%)] transition-all duration-200 flex items-center justify-center group/view"
                                                title="View Course"
                                            >
                                                <svg className="w-5 h-5 group-hover/view:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </Link>

                                            {/* Certificate Button - Only show if enrolled */}
                                            {isEnrolled && (
                                                <button
                                                    onClick={() => handleDownload(course.title, course.id)}
                                                    disabled={downloadingId === course.id}
                                                    className="px-4 py-3.5 glass rounded-xl border border-[hsl(190,95%,50%)]/30 hover:bg-[hsl(190,95%,50%)]/10 hover:border-[hsl(190,95%,50%)]/50 text-[hsl(190,95%,50%)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group/cert"
                                                    title="Download Certificate"
                                                >
                                                    {downloadingId === course.id ? (
                                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-[hsl(190,95%,50%)] border-t-transparent"></div>
                                                    ) : (
                                                        <svg className="w-5 h-5 group-hover/cert:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    )}
                                                </button>
                                            )}
                                        </div>
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