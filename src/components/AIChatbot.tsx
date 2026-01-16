'use client';

import { useState, useRef, useEffect } from 'react';
import api from '@/lib/axios';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface AIChatbotProps {
    userRole?: string;
}

export default function AIChatbot({ userRole = 'STUDENT' }: AIChatbotProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: `Hi! I'm your Patthi Ginja. How can I help you today?`,
            timestamp: new Date(),
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Call AI endpoint based on user role
            const endpoint = userRole === 'STUDENT'
                ? '/ai/learning-path'
                : userRole === 'MENTOR'
                    ? '/ai/course-insights'
                    : '/ai/analyze-performance';

            const response = await api.post(endpoint, {
                query: input,
                context: { role: userRole }
            });

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.data.response || response.data,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I'm having trouble connecting right now. Please try again in a moment!",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const quickActions = [
        { icon: '📚', text: 'Recommend courses', query: 'What courses should I take next?' },
        { icon: '📊', text: 'My progress', query: 'How am I doing in my courses?' },
        { icon: '💡', text: 'Study tips', query: 'Give me some study tips' },
        { icon: '🎯', text: 'Set goals', query: 'Help me set learning goals' },
    ];

    return (
        <>
            {/* Floating Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)] text-white shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center group ${isOpen ? 'rotate-180' : ''}`}
                style={{ boxShadow: '0 0 30px rgba(0, 255, 255, 0.5)' }}
            >
                {isOpen ? (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <div className="relative">
                        <svg className="w-8 h-8 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        {/* Notification Dot */}
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                    </div>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 w-96 h-[600px] rounded-3xl border-2 border-[hsl(190,95%,50%)]/30 shadow-2xl flex flex-col overflow-hidden animate-slideUp elevated" style={{ background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(20px)' }}>
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)] p-5 flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl animate-float">
                                🤖
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-white font-display">Patthi Ginja</h3>
                            <p className="text-xs text-white/80">Em Kavalo Adukko</p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-8 h-8 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center"
                        >
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[hsl(222,47%,6%)]/50">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl ${message.role === 'user'
                                        ? 'bg-gradient-to-r from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)] text-white'
                                        : 'glass border border-[hsl(190,95%,50%)]/20 text-gray-200'
                                        }`}
                                >
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                    <p className="text-xs opacity-60 mt-1">
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start animate-fadeIn">
                                <div className="glass border border-[hsl(190,95%,50%)]/20 p-3 rounded-2xl">
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 bg-[hsl(190,95%,50%)] rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-[hsl(190,95%,50%)] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-[hsl(190,95%,50%)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions */}
                    {messages.length === 1 && (
                        <div className="p-4 border-t border-[hsl(190,95%,50%)]/10">
                            <p className="text-xs text-gray-400 mb-2">Quick actions:</p>
                            <div className="grid grid-cols-2 gap-2">
                                {quickActions.map((action, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setInput(action.query);
                                            setTimeout(() => handleSend(), 100);
                                        }}
                                        className="glass p-2 rounded-lg text-xs text-gray-300 hover:bg-[hsl(190,95%,50%)]/10 hover:border-[hsl(190,95%,50%)]/30 transition-all border border-[hsl(190,95%,50%)]/10 flex items-center gap-2"
                                    >
                                        <span>{action.icon}</span>
                                        <span className="truncate">{action.text}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-4 border-t border-[hsl(190,95%,50%)]/20 bg-[hsl(222,47%,6%)]/80">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask me anything..."
                                className="flex-1 px-4 py-3 glass border border-[hsl(190,95%,50%)]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[hsl(190,95%,50%)] focus:border-transparent transition-smooth bg-black/20 text-sm"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="px-4 py-3 bg-gradient-to-r from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)] text-white rounded-xl hover:scale-105 transition-cyber disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 glow-sm"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
