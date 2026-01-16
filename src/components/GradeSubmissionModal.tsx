'use client';

import { useState } from 'react';
import api from '@/lib/axios';

interface GradeSubmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    submission: {
        id: string;
        content: string;
        fileUrl?: string;
        student: {
            name: string;
            email: string;
        };
        assignment: {
            title: string;
            maxScore: number;
        };
        submittedAt: string;
        score?: number;
        feedback?: string;
    };
    onSuccess: () => void;
}

export default function GradeSubmissionModal({ isOpen, onClose, submission, onSuccess }: GradeSubmissionModalProps) {
    const [formData, setFormData] = useState({
        score: submission.score || 0,
        feedback: submission.feedback || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.put(`/assignments/submissions/${submission.id}/grade`, formData);
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to grade submission');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const scorePercentage = (formData.score / submission.assignment.maxScore) * 100;
    const getGradeColor = () => {
        if (scorePercentage >= 90) return 'text-green-400';
        if (scorePercentage >= 75) return 'text-blue-400';
        if (scorePercentage >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getGrade = () => {
        if (scorePercentage >= 90) return 'A';
        if (scorePercentage >= 80) return 'B';
        if (scorePercentage >= 70) return 'C';
        if (scorePercentage >= 60) return 'D';
        return 'F';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
            <div className="w-full max-w-4xl glass-dark rounded-3xl border-2 border-[hsl(190,95%,50%)]/30 p-8 elevated animate-scaleIn my-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white font-display flex items-center gap-3">
                            <span className="text-3xl">✍️</span>
                            Grade Submission
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">{submission.assignment.title}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full glass hover:bg-red-500/20 transition-colors flex items-center justify-center group"
                    >
                        <svg className="w-6 h-6 text-gray-400 group-hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Student Info */}
                <div className="glass p-4 rounded-xl mb-6 border border-[hsl(190,95%,50%)]/20">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)] flex items-center justify-center text-white font-bold text-xl">
                            {submission.student.name?.charAt(0).toUpperCase() || 'S'}
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-semibold">{submission.student.name || 'Student'}</p>
                            <p className="text-gray-400 text-sm">{submission.student.email}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400">Submitted</p>
                            <p className="text-sm text-white">
                                {new Date(submission.submittedAt).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Submission Content */}
                <div className="glass p-6 rounded-xl mb-6 border border-[hsl(190,95%,50%)]/20">
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <span>📄</span>
                        Student's Answer
                    </h3>
                    <div className="bg-black/30 p-4 rounded-lg border border-[hsl(190,95%,50%)]/10">
                        <p className="text-gray-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                            {submission.content}
                        </p>
                    </div>
                    {submission.fileUrl && (
                        <div className="mt-4">
                            <a
                                href={submission.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-[hsl(190,95%,50%)] hover:text-[hsl(260,80%,60%)] transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                </svg>
                                View Attachment
                            </a>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="p-4 mb-6 text-sm text-red-200 bg-red-500/20 border border-red-400/30 rounded-xl animate-fadeIn">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Score Input */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-3">
                            Score *
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="0"
                                max={submission.assignment.maxScore}
                                value={formData.score}
                                onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) })}
                                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[hsl(190,95%,50%)]"
                            />
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="0"
                                    max={submission.assignment.maxScore}
                                    value={formData.score}
                                    onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) })}
                                    className="w-20 px-3 py-2 glass border border-[hsl(190,95%,50%)]/30 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-[hsl(190,95%,50%)] bg-black/20"
                                />
                                <span className="text-gray-400">/ {submission.assignment.maxScore}</span>
                            </div>
                        </div>
                        <div className="mt-3 flex items-center gap-3">
                            <div className={`text-2xl font-bold ${getGradeColor()}`}>
                                Grade: {getGrade()}
                            </div>
                            <div className="text-sm text-gray-400">
                                ({scorePercentage.toFixed(1)}%)
                            </div>
                        </div>
                    </div>

                    {/* Feedback */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Feedback (Optional)
                        </label>
                        <textarea
                            rows={5}
                            value={formData.feedback}
                            onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                            className="w-full px-4 py-3 glass border border-[hsl(190,95%,50%)]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[hsl(190,95%,50%)] focus:border-transparent transition-smooth bg-black/20 resize-none"
                            placeholder="Provide constructive feedback to help the student improve..."
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 glass border border-[hsl(190,95%,50%)]/30 rounded-xl text-gray-300 hover:bg-white/5 transition-smooth font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)] text-white rounded-xl font-bold glow-sm hover:scale-105 transition-cyber disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                    Saving Grade...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Save Grade
                                </span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
