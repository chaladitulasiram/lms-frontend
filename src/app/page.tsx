'use client';

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [particles, setParticles] = useState<Array<{ left: string; duration: string; delay: string }>>([]);

  useEffect(() => {
    setIsVisible(true);

    // Generate particles on client-side only to avoid hydration mismatch
    const particleData = Array.from({ length: 20 }, () => ({
      left: `${Math.random() * 100}%`,
      duration: `${Math.random() * 10 + 15}s`,
      delay: `${Math.random() * 5}s`,
    }));
    setParticles(particleData);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-[hsl(222,47%,6%)] overflow-hidden">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 cyber-grid opacity-30"></div>

      {/* Animated Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="particle animate-particle"
            style={{
              left: particle.left,
              animationDuration: particle.duration,
              animationDelay: particle.delay,
              bottom: '-10px'
            }}
          ></div>
        ))}
      </div>

      {/* Gradient Overlays */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[hsl(190,95%,50%)] opacity-20 blur-[120px] rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[hsl(260,80%,60%)] opacity-20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-[hsl(280,70%,55%)] opacity-15 blur-[120px] rounded-full"></div>
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 glass border-b border-[hsl(190,95%,50%)]/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-[hsl(190,95%,50%)] blur-lg opacity-50 rounded-full"></div>
              <div className="relative text-3xl glow-text">⚡</div>
            </div>
            <h1 className="text-2xl font-bold gradient-text font-display">
              EduTech LMS
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-gray-300 hover:text-[hsl(190,95%,50%)] font-medium transition-smooth"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="bg-gradient-to-r from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)] text-white px-6 py-2.5 rounded-lg glow hover:scale-105 transition-cyber font-semibold"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <div
          className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-20"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        >
          <div className={`max-w-6xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Floating Badge */}
            <div className="inline-flex items-center gap-2 glass text-[hsl(190,95%,50%)] px-5 py-3 rounded-full text-sm font-semibold mb-8 animate-float border border-[hsl(190,95%,50%)]/30">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(190,95%,50%)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[hsl(190,95%,50%)]"></span>
              </span>
              AI-Powered Learning Platform
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-6 leading-tight font-display">
              Master Skills with{" "}
              <span className="relative inline-block">
                <span className="gradient-text glow-text">AI Power</span>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)] rounded-full glow"></div>
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Navigate the future of education with cutting-edge AI insights,
              real-time analytics, and automated certifications.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
              <Link
                href="/register"
                className="group relative bg-gradient-to-r from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)] text-white px-12 py-5 rounded-xl text-lg font-bold glow hover:scale-105 transition-cyber overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[hsl(260,80%,60%)] to-[hsl(190,95%,50%)] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span className="relative z-10 flex items-center gap-3">
                  <span className="text-2xl">🎓</span>
                  Start Learning
                  <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              <Link
                href="/register"
                className="group glass text-[hsl(190,95%,50%)] px-12 py-5 rounded-xl text-lg font-bold hover:glow hover:scale-105 transition-cyber border-2 border-[hsl(190,95%,50%)]/30"
              >
                <span className="flex items-center gap-3">
                  <span className="text-2xl">👨‍🏫</span>
                  Become a Mentor
                  <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Feature Cards */}
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
              style={{ transform: `translateY(${scrollY * -0.1}px)` }}
            >
              {[
                {
                  icon: "🤖",
                  title: "AI-Powered Insights",
                  desc: "Get personalized recommendations powered by advanced AI analytics",
                  color: "hsl(190,95%,50%)"
                },
                {
                  icon: "📊",
                  title: "Real-Time Tracking",
                  desc: "Monitor your learning journey with live progress dashboards",
                  color: "hsl(260,80%,60%)"
                },
                {
                  icon: "🏆",
                  title: "Smart Certificates",
                  desc: "Earn verified credentials with blockchain-backed certification",
                  color: "hsl(280,70%,55%)"
                }
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="card-hover glass p-8 rounded-2xl group elevated"
                  style={{
                    animationDelay: `${idx * 150}ms`,
                    transform: `translateY(${scrollY * 0.05 * (idx + 1)}px)`
                  }}
                >
                  <div className="relative mb-6">
                    <div className={`absolute inset-0 blur-2xl opacity-50 group-hover:opacity-100 transition-opacity`} style={{ background: feature.color }}></div>
                    <div className="relative text-6xl animate-float" style={{ animationDelay: `${idx * 0.5}s` }}>
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="font-bold text-xl text-white mb-3 font-display">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative py-32 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-bold text-white mb-6 font-display">
              Ready to Transform Your Future?
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Join thousands of learners advancing their careers with AI-powered education
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[hsl(190,95%,50%)] to-[hsl(260,80%,60%)] text-white px-16 py-6 rounded-full text-xl font-bold glow hover:scale-105 transition-cyber"
            >
              Launch Your Journey
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 glass border-t border-[hsl(190,95%,50%)]/20 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl glow-text">⚡</span>
                <span className="text-xl font-bold gradient-text font-display">EduTech LMS</span>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering learners worldwide with AI-driven education
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 font-display">Platform</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/register" className="hover:text-[hsl(190,95%,50%)] transition-smooth">Courses</Link></li>
                <li><Link href="/register" className="hover:text-[hsl(190,95%,50%)] transition-smooth">Mentors</Link></li>
                <li><Link href="/register" className="hover:text-[hsl(190,95%,50%)] transition-smooth">Certificates</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 font-display">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-[hsl(190,95%,50%)] transition-smooth">About</a></li>
                <li><a href="#" className="hover:text-[hsl(190,95%,50%)] transition-smooth">Careers</a></li>
                <li><a href="#" className="hover:text-[hsl(190,95%,50%)] transition-smooth">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 font-display">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-[hsl(190,95%,50%)] transition-smooth">Privacy</a></li>
                <li><a href="#" className="hover:text-[hsl(190,95%,50%)] transition-smooth">Terms</a></li>
                <li><a href="#" className="hover:text-[hsl(190,95%,50%)] transition-smooth">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[hsl(190,95%,50%)]/20 pt-8 text-center text-gray-500 text-sm">
            <p>© 2026 EduTech LMS. Powered by AI, Built with Next.js & TypeScript.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}