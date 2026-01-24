'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import SuccessModal from '@/components/SuccessModal';
import ErrorModal from '@/components/ErrorModal';
import Link from 'next/link';
import { BookOpen, Download, Play, CheckCircle, ExternalLink, Loader2, Award } from 'lucide-react';
import { PageHeader } from '@/components/ui/glass/PageHeader';
import { SpotlightCard } from '@/components/ui/glass/SpotlightCard';
import { GlassButton } from '@/components/ui/glass/GlassButton';
import { CinematicLoader } from '@/components/ui/CinematicLoader';

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
        <div className="min-h-screen pb-20">
            <PageHeader
                title="Course Catalog"
                description="Explore and enroll in courses to advance your skills"
            />

            {isLoading ? (
                <CinematicLoader text="Loading Courses..." />
            ) : courses?.length === 0 ? (
                <div className="bg-neutral-900/40 p-16 rounded-3xl text-center border border-white/5 backdrop-blur-xl">
                    <div className="mx-auto w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <BookOpen size={32} className="text-neutral-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Courses Available</h3>
                    <p className="text-neutral-400">Check back soon for new content.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
                    {courses?.map((course, idx) => {
                        const isEnrolled = enrollmentStatuses[course.id] || false;

                        return (
                            <SpotlightCard key={course.id} className="h-full flex flex-col">
                                <div className="flex flex-col h-full">
                                    {/* Thumbnail Area */}
                                    <div className="h-48 bg-gradient-to-br from-neutral-800 to-black relative overflow-hidden">
                                        {/* Abstract Gradient Art */}
                                        <div className={`absolute inset-0 bg-gradient-to-br opacity-50 
                                            ${idx % 3 === 0 ? 'from-blue-500/20 to-purple-500/20' :
                                                idx % 3 === 1 ? 'from-emerald-500/20 to-teal-500/20' :
                                                    'from-orange-500/20 to-red-500/20'}`}
                                        />

                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Award className={`w-16 h-16 opacity-30 text-white`} />
                                        </div>

                                        {isEnrolled && (
                                            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full flex items-center gap-1.5 z-10">
                                                <CheckCircle size={12} className="text-green-400" />
                                                <span className="text-xs font-medium text-white">Enrolled</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 tracking-tight">{course.title}</h3>
                                        <p className="text-sm text-neutral-400 line-clamp-2 mb-6 flex-1 leading-relaxed">
                                            {course.description}
                                        </p>

                                        {/* Meta */}
                                        <div className="flex items-center gap-4 text-xs text-neutral-500 mb-6 font-medium uppercase tracking-wider">
                                            <div className="flex items-center gap-1.5">
                                                <BookOpen size={14} />
                                                <span>{course.modules?.length || 0} Modules</span>
                                            </div>
                                            <div className="w-1 h-1 bg-neutral-700 rounded-full" />
                                            <span>{course.mentor?.email?.split('@')[0]}</span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-3 mt-auto pt-4 border-t border-white/5">
                                            {!isEnrolled ? (
                                                <GlassButton
                                                    variant="primary"
                                                    onClick={() => enrollMutation.mutate({ courseId: course.id, courseName: course.title })}
                                                    isLoading={enrollMutation.isPending}
                                                    className="flex-1 w-full"
                                                >
                                                    Enroll Now
                                                </GlassButton>
                                            ) : (
                                                <Link href={`/student/courses/${course.id}`} className="flex-1">
                                                    <GlassButton variant="primary" className="w-full">
                                                        <Play size={16} fill="currentColor" className="mr-2" />
                                                        Continue
                                                    </GlassButton>
                                                </Link>
                                            )}

                                            <Link href={`/student/courses/${course.id}`}>
                                                <GlassButton variant="secondary" className="px-3">
                                                    <ExternalLink size={18} />
                                                </GlassButton>
                                            </Link>

                                            {isEnrolled && (
                                                <GlassButton
                                                    variant="secondary"
                                                    className="px-3"
                                                    disabled={downloadingId === course.id}
                                                    onClick={() => handleDownload(course.title, course.id)}
                                                >
                                                    {downloadingId === course.id ? (
                                                        <Loader2 size={18} className="animate-spin" />
                                                    ) : (
                                                        <Download size={18} />
                                                    )}
                                                </GlassButton>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </SpotlightCard>
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