'use client';

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<Array<{ left: string; duration: string; delay: string }>>([]);

  useEffect(() => {
    setIsVisible(true);

    // Generate subtle particles
    const particleData = Array.from({ length: 8 }, () => ({
      left: `${Math.random() * 100}%`,
      duration: `${Math.random() * 15 + 20}s`,
      delay: `${Math.random() * 5}s`,
    }));
    setParticles(particleData);
  }, []);

  return (
    <div className="relative min-h-screen bg-[hsl(222,47%,6%)] overflow-hidden">
      {/* Subtle Cyber Grid Background */}
      <div className="fixed inset-0 cyber-grid opacity-10"></div>

      {/* Minimal Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="particle animate-particle opacity-30"
            style={{
              left: particle.left,
              animationDuration: particle.duration,
              animationDelay: particle.delay,
              bottom: '-10px'
            }}
          ></div>
        ))}
      </div>

      {/* Subtle Gradient Overlays */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[hsl(190,95%,50%)] opacity-10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[hsl(260,80%,60%)] opacity-10 blur-[150px] rounded-full"></div>
      </div>

      {/* Clean Navigation */}
      <header className="sticky top-0 z-50 glass border-b border-[hsl(190,95%,50%)]/10 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-[hsl(190,95%,50%)] blur-md opacity-40 rounded-full"></div>
              <div className="relative text-2xl">⚡</div>
            </div>
            <h1 className="text-xl font-bold gradient-text font-display">
              EduTech LMS
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-gray-300 hover:text-white font-medium transition-smooth text-sm"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-gradient-to-r from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)] text-white px-6 py-2.5 rounded-lg hover:scale-105 transition-cyber font-semibold text-sm glow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Centered & Minimal */}
      <main className="relative z-10">
        <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-center px-6">
          <div className={`max-w-4xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

            {/* Minimal Badge */}
            <div className="inline-flex items-center gap-2 glass text-[hsl(190,95%,50%)] px-4 py-2 rounded-full text-xs font-semibold mb-8 border border-[hsl(190,95%,50%)]/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(190,95%,50%)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[hsl(190,95%,50%)]"></span>
              </span>
              AI-Powered Learning
            </div>

            {/* Clean Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight font-display">
              Learn Smarter with{" "}
              <span className="gradient-text">AI Insights</span>
            </h1>

            {/* Simple Subheading */}
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Transform your learning journey with personalized AI recommendations,
              real-time analytics, and verified certifications.
            </p>

            {/* Clean CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/register"
                className="group bg-gradient-to-r from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)] text-white px-8 py-4 rounded-xl font-bold glow-sm hover:scale-105 transition-cyber"
              >
                <span className="flex items-center justify-center gap-2">
                  Start Learning
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              <Link
                href="/register"
                className="group glass text-gray-300 hover:text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-cyber border border-[hsl(190,95%,50%)]/20 hover:border-[hsl(190,95%,50%)]/40"
              >
                <span className="flex items-center justify-center gap-2">
                  Become a Mentor
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Minimal Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  icon: "🤖",
                  title: "AI Insights",
                  desc: "Personalized learning paths"
                },
                {
                  icon: "📊",
                  title: "Live Analytics",
                  desc: "Track progress in real-time"
                },
                {
                  icon: "🏆",
                  title: "Certificates",
                  desc: "Verified credentials"
                }
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="glass p-6 rounded-xl border border-[hsl(190,95%,50%)]/10 hover:border-[hsl(190,95%,50%)]/30 transition-all duration-300 group"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-white mb-2 font-display">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Minimal Stats Section */}
        <div className="relative py-20 px-6 border-t border-[hsl(190,95%,50%)]/10">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "10K+", label: "Students" },
                { value: "500+", label: "Courses" },
                { value: "100+", label: "Mentors" },
                { value: "95%", label: "Success Rate" }
              ].map((stat, idx) => (
                <div key={idx} className="group">
                  <div className="text-3xl md:text-4xl font-bold gradient-text mb-2 font-display group-hover:scale-110 transition-transform">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Simple CTA Section */}
        <div className="relative py-24 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">
              Ready to Start?
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Join thousands of learners advancing their careers
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)] text-white px-10 py-4 rounded-full font-bold glow-sm hover:scale-105 transition-cyber"
            >
              Get Started Free
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 glass border-t border-[hsl(190,95%,50%)]/10 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <span className="font-bold gradient-text font-display">EduTech LMS</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link href="/register" className="hover:text-[hsl(190,95%,50%)] transition-smooth">Courses</Link>
              <Link href="/register" className="hover:text-[hsl(190,95%,50%)] transition-smooth">Mentors</Link>
              <a href="#" className="hover:text-[hsl(190,95%,50%)] transition-smooth">About</a>
              <a href="#" className="hover:text-[hsl(190,95%,50%)] transition-smooth">Contact</a>
            </div>
            <p className="text-xs text-gray-500">© 2026 EduTech LMS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}