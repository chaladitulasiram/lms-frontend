'use client';

import { useState } from 'react';
import api from '@/lib/axios';

interface CreateAssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    moduleId: string;
    onSuccess: () => void;
}

export default function CreateAssignmentModal({ isOpen, onClose, moduleId, onSuccess }: CreateAssignmentModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        maxScore: 100,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post(`/assignments/module/${moduleId}`, formData);
            onSuccess();
            onClose();
            // Reset form
            setFormData({
                title: '',
                description: '',
                dueDate: '',
                maxScore: 100,
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create assignment');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-2xl glass-dark rounded-3xl border-2 border-[hsl(190,95%,50%)]/30 p-8 elevated animate-scaleIn">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white font-display flex items-center gap-3">
                            <span className="text-3xl">📝</span>
                            Create Assignment
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">Add a new assignment to this module</p>
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

                {error && (
                    <div className="p-4 mb-6 text-sm text-red-200 bg-red-500/20 border border-red-400/30 rounded-xl animate-fadeIn">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Assignment Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 glass border border-[hsl(190,95%,50%)]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[hsl(190,95%,50%)] focus:border-transparent transition-smooth bg-black/20"
                            placeholder="e.g., React Hooks Quiz"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Description *
                        </label>
                        <textarea
                            required
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 glass border border-[hsl(190,95%,50%)]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[hsl(190,95%,50%)] focus:border-transparent transition-smooth bg-black/20 resize-none"
                            placeholder="Describe the assignment requirements..."
                        />
                    </div>

                    {/* Due Date and Max Score */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Due Date (Optional)
                            </label>
                            <input
                                type="datetime-local"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                className="w-full px-4 py-3 glass border border-[hsl(190,95%,50%)]/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[hsl(190,95%,50%)] focus:border-transparent transition-smooth bg-black/20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Max Score
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="1000"
                                value={formData.maxScore}
                                onChange={(e) => setFormData({ ...formData, maxScore: parseInt(e.target.value) })}
                                className="w-full px-4 py-3 glass border border-[hsl(190,95%,50%)]/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[hsl(190,95%,50%)] focus:border-transparent transition-smooth bg-black/20"
                            />
                        </div>
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
                                    Creating...
                                </span>
                            ) : (
                                'Create Assignment'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
