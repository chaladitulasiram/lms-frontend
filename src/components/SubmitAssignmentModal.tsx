'use client';

import { useState } from 'react';
import api from '@/lib/axios';

interface SubmitAssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    assignment: {
        id: string;
        title: string;
        description: string;
        dueDate?: string;
        maxScore: number;
    };
    onSuccess: () => void;
}

export default function SubmitAssignmentModal({ isOpen, onClose, assignment, onSuccess }: SubmitAssignmentModalProps) {
    const [formData, setFormData] = useState({
        content: '',
        fileUrl: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post(`/assignments/${assignment.id}/submit`, formData);
            onSuccess();
            onClose();
            setFormData({ content: '', fileUrl: '' });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit assignment');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const isDueSoon = assignment.dueDate && new Date(assignment.dueDate) < new Date(Date.now() + 24 * 60 * 60 * 1000);
    const isOverdue = assignment.dueDate && new Date(assignment.dueDate) < new Date();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-2xl glass-dark rounded-3xl border-2 border-[hsl(190,95%,50%)]/30 p-8 elevated animate-scaleIn">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white font-display flex items-center gap-3">
                            <span className="text-3xl">📤</span>
                            Submit Assignment
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">{assignment.title}</p>
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

                {/* Assignment Info */}
                <div className="glass p-4 rounded-xl mb-6 border border-[hsl(190,95%,50%)]/20">
                    <p className="text-gray-300 text-sm mb-3">{assignment.description}</p>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-2 text-xs">
                            <span className="text-[hsl(190,95%,50%)]">🎯</span>
                            <span className="text-gray-400">Max Score:</span>
                            <span className="text-white font-semibold">{assignment.maxScore}</span>
                        </div>
                        {assignment.dueDate && (
                            <div className={`flex items-center gap-2 text-xs ${isOverdue ? 'text-red-400' : isDueSoon ? 'text-yellow-400' : 'text-gray-400'}`}>
                                <span>{isOverdue ? '⚠️' : '📅'}</span>
                                <span>Due:</span>
                                <span className="font-semibold">
                                    {new Date(assignment.dueDate).toLocaleString()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="p-4 mb-6 text-sm text-red-200 bg-red-500/20 border border-red-400/30 rounded-xl animate-fadeIn">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Answer/Content */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Your Answer *
                        </label>
                        <textarea
                            required
                            rows={8}
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full px-4 py-3 glass border border-[hsl(190,95%,50%)]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[hsl(190,95%,50%)] focus:border-transparent transition-smooth bg-black/20 resize-none font-mono text-sm"
                            placeholder="Type your answer here..."
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            {formData.content.length} characters
                        </p>
                    </div>

                    {/* File URL (Optional) */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Attachment URL (Optional)
                        </label>
                        <input
                            type="url"
                            value={formData.fileUrl}
                            onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                            className="w-full px-4 py-3 glass border border-[hsl(190,95%,50%)]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[hsl(190,95%,50%)] focus:border-transparent transition-smooth bg-black/20"
                            placeholder="https://example.com/your-file.pdf"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            📎 Paste a link to your Google Drive, Dropbox, or any file hosting service
                        </p>
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
                                    Submitting...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    Submit Assignment
                                </span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
