'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';

interface Certificate {
    id: string;
    certificateNumber: string;
    certificateUrl?: string;
    issuedAt: string;
    course: {
        title: string;
        description: string;
        thumbnail?: string;
    };
}

export default function CertificateGallery() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            const response = await api.get('/certificates/student/my-certificates');
            setCertificates(response.data);
        } catch (error) {
            console.error('Failed to fetch certificates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (cert: Certificate) => {
        // In a real app, this would download the PDF
        window.open(cert.certificateUrl || '#', '_blank');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[hsl(190,95%,50%)]/30 border-t-[hsl(190,95%,50%)] rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading certificates...</p>
                </div>
            </div>
        );
    }

    if (certificates.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="text-6xl mb-4 animate-float">🏆</div>
                <h3 className="text-2xl font-bold text-white mb-2 font-display">No Certificates Yet</h3>
                <p className="text-gray-400">Complete courses to earn certificates!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white font-display flex items-center gap-3">
                        <span className="text-4xl">🏆</span>
                        My Certificates
                    </h2>
                    <p className="text-gray-400 mt-1">{certificates.length} certificate{certificates.length !== 1 ? 's' : ''} earned</p>
                </div>
            </div>

            {/* Certificate Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map((cert, index) => (
                    <div
                        key={cert.id}
                        className="group glass-dark p-6 rounded-2xl border-2 border-[hsl(190,95%,50%)]/20 hover:border-[hsl(190,95%,50%)]/50 transition-all duration-300 elevated hover-lift cursor-pointer"
                        style={{ animationDelay: `${index * 100}ms` }}
                        onClick={() => setSelectedCert(cert)}
                    >
                        {/* Certificate Icon */}
                        <div className="relative mb-4">
                            <div className="w-full h-40 bg-gradient-to-br from-[hsl(190,95%,50%)]/20 to-[hsl(260,80%,60%)]/20 rounded-xl flex items-center justify-center border border-[hsl(190,95%,50%)]/30 group-hover:scale-105 transition-transform">
                                <div className="text-6xl animate-float">🎓</div>
                            </div>
                            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Verified
                            </div>
                        </div>

                        {/* Course Title */}
                        <h3 className="text-white font-bold text-lg mb-2 font-display line-clamp-2 group-hover:text-[hsl(190,95%,50%)] transition-colors">
                            {cert.course.title}
                        </h3>

                        {/* Certificate Number */}
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs text-gray-500">Certificate #</span>
                            <code className="text-xs text-[hsl(190,95%,50%)] font-mono bg-[hsl(190,95%,50%)]/10 px-2 py-1 rounded">
                                {cert.certificateNumber}
                            </code>
                        </div>

                        {/* Issue Date */}
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(cert.issuedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>

                        {/* Download Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(cert);
                            }}
                            className="w-full py-2 bg-gradient-to-r from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)] text-white rounded-lg font-semibold text-sm hover:scale-105 transition-cyber glow-sm flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download PDF
                        </button>
                    </div>
                ))}
            </div>

            {/* Certificate Detail Modal */}
            {selectedCert && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
                    onClick={() => setSelectedCert(null)}
                >
                    <div
                        className="w-full max-w-2xl glass-dark rounded-3xl border-2 border-[hsl(190,95%,50%)]/30 p-8 elevated animate-scaleIn"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedCert(null)}
                            className="absolute top-4 right-4 w-10 h-10 rounded-full glass hover:bg-red-500/20 transition-colors flex items-center justify-center group"
                        >
                            <svg className="w-6 h-6 text-gray-400 group-hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Certificate Preview */}
                        <div className="text-center mb-6">
                            <div className="text-6xl mb-4 animate-bounce-slow">🏆</div>
                            <h2 className="text-3xl font-bold gradient-text mb-2 font-display">Certificate of Completion</h2>
                            <p className="text-gray-400">This certifies that you have successfully completed</p>
                        </div>

                        <div className="glass p-6 rounded-xl border border-[hsl(190,95%,50%)]/20 mb-6">
                            <h3 className="text-2xl font-bold text-white text-center mb-4 font-display">
                                {selectedCert.course.title}
                            </h3>
                            <div className="space-y-3 text-center">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Certificate Number</p>
                                    <code className="text-sm text-[hsl(190,95%,50%)] font-mono bg-[hsl(190,95%,50%)]/10 px-3 py-1 rounded">
                                        {selectedCert.certificateNumber}
                                    </code>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Issued On</p>
                                    <p className="text-white font-semibold">
                                        {new Date(selectedCert.issuedAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => handleDownload(selectedCert)}
                            className="w-full py-4 bg-gradient-to-r from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)] text-white rounded-xl font-bold text-lg hover:scale-105 transition-cyber glow flex items-center justify-center gap-3"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download Certificate
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
