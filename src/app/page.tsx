'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  AnimatePresence,
} from 'framer-motion';
import {
  Layers, Zap, Shield, Globe,
  BarChart3, Users,
  CheckCircle2, User, Sparkles, Cpu, Radio
} from 'lucide-react';

// --- VISUAL CONSTANTS ---
const APPLE_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// --- COMPONENTS ---

// 1. Cinematic Preloader
const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [status, setStatus] = useState("Initializing Core...");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const sequence = [
      { text: "Initializing Core...", time: 0, prog: 10 },
      { text: "Loading Modules...", time: 800, prog: 45 },
      { text: "Verifying Integrity...", time: 1600, prog: 80 },
      { text: "Welcome", time: 2400, prog: 100 },
    ];

    sequence.forEach((step) => {
      setTimeout(() => {
        setStatus(step.text);
        setProgress(step.prog);
      }, step.time);
    });

    const completionTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(completionTimer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: APPLE_EASE }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4 font-mono"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)] pointer-events-none" />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center w-full max-w-xs relative z-10"
      >
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-blue-500/30 blur-2xl rounded-full" />
          <Layers className="w-16 h-16 text-white relative z-10" />
        </div>

        {/* Progress Bar */}
        <div className="w-full h-[2px] bg-neutral-800 rounded-full overflow-hidden mb-6">
          <motion.div
            className="h-full bg-white shadow-[0_0_20px_white]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        <div className="flex justify-between w-full text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
          <motion.span
            key={status}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {status}
          </motion.span>
          <span>{progress}%</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

// 2. Dynamic Island Navbar
const Navbar = () => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useTransform(scrollY, (value) => {
    const scrolled = value > 50;
    if (scrolled !== isScrolled) setIsScrolled(scrolled);
    return value;
  });

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none">
      <motion.header
        layout
        className={`pointer-events-auto flex items-center justify-between px-6 
          ${isScrolled
            ? "bg-black/60 backdrop-blur-2xl border border-white/10 rounded-full py-3 h-14 min-w-[320px] shadow-2xl shadow-black/80"
            : "bg-transparent w-full max-w-7xl py-4"
          }`}
        transition={{ duration: 0.5, ease: APPLE_EASE }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mr-8">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg shadow-white/20">
            <span className="text-black text-xs font-black tracking-tighter">LMS</span>
          </div>
          <span className={`font-semibold tracking-tight transition-colors ${isScrolled ? "text-white hidden sm:block" : "text-white"}`}>
            LMS Pro
          </span>
        </div>

        {/* Links */}
        {!isScrolled && (
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#performance" className="hover:text-white transition-colors">Performance</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>
        )}

        {/* Auth Actions */}
        <div className="flex items-center gap-2 ml-auto">
          {!isScrolled && (
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white transition-colors"
            >
              Log in
            </Link>
          )}

          <Link
            href="/register"
            className={`text-sm font-bold bg-white text-black rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]
              ${isScrolled ? "px-5 py-2" : "px-6 py-2.5"}`}
          >
            Get Started
          </Link>
        </div>
      </motion.header>
    </div>
  );
};

// 3. 3D Parallax Hero
const Hero = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { damping: 25, stiffness: 150 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { damping: 25, stiffness: 150 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden perspective-1000"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-[10%] right-[20%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: APPLE_EASE }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-medium text-neutral-300 mb-8"
        >
          <Sparkles size={12} className="text-yellow-400" />
          <span>Reimagining Education</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: APPLE_EASE, delay: 0.1 }}
          className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-8"
        >
          Learning.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-white to-purple-400">
            Spatialized.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: APPLE_EASE, delay: 0.2 }}
          className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Experience the next generation of Learning Management Systems.
          Designed for focus, engineered for speed, and crafted with precision.
        </motion.p>
      </div>

      {/* 3D Dashboard Construction */}
      <div className="relative w-full max-w-5xl px-6 h-[400px] md:h-[600px] perspective-1000">
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative w-full h-full"
        >
          {/* Base Glass Layer */}
          <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
            style={{ transform: "translateZ(0px)" }}>

            {/* Fake UI Header */}
            <div className="h-16 border-b border-white/5 flex items-center px-6 gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
              </div>
              <div className="w-48 h-2 bg-white/10 rounded-full ml-8" />
            </div>

            {/* Fake Content Grid */}
            <div className="p-8 grid grid-cols-3 gap-6 opacity-50">
              <div className="col-span-2 h-48 bg-white/5 rounded-2xl border border-white/5" />
              <div className="col-span-1 h-48 bg-white/5 rounded-2xl border border-white/5" />
              <div className="col-span-1 h-48 bg-white/5 rounded-2xl border border-white/5" />
              <div className="col-span-2 h-48 bg-white/5 rounded-2xl border border-white/5" />
            </div>
          </div>

          {/* Floating Widget 1 */}
          <motion.div
            className="absolute top-24 right-12 bg-black/60 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4 w-64"
            style={{ transform: "translateZ(40px)" }}
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Course Completed</div>
              <div className="text-neutral-400 text-xs">Advanced Architecture</div>
            </div>
          </motion.div>

          {/* Floating Widget 2 */}
          <motion.div
            className="absolute bottom-32 left-12 bg-black/60 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            style={{ transform: "translateZ(60px)" }}
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <div className="flex items-center justify-between mb-2 w-48">
              <span className="text-xs text-neutral-400 font-medium uppercase tracking-widest">Active Users</span>
              <span className="text-green-400 text-xs">● Live</span>
            </div>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-neutral-800 flex items-center justify-center text-white">
                  <User size={14} />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-black bg-neutral-700 flex items-center justify-center text-xs text-white font-bold">
                +2k
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

// 4. Bento Grid
const BentoGrid = () => {
  return (
    <section id="features" className="py-32 px-6 bg-black relative">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Tools for thought.
          </h2>
          <p className="text-neutral-400 max-w-xl text-lg">
            Everything you need to master your craft, detailed with an obsession for quality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-3 gap-6 h-[1000px] md:h-[700px]">
          {/* Card 1 - Large */}
          <div className="col-span-1 md:col-span-2 row-span-2 group relative rounded-3xl overflow-hidden border border-white/10 bg-neutral-900/30">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1074&auto=format&fit=crop')] bg-cover bg-center opacity-60 group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mb-4 text-white">
                <Zap size={20} fill="currentColor" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Active Recall</h3>
              <p className="text-neutral-300 text-sm max-w-sm">AI-powered spaced repetition systems that adapt to your unique forgetting curve.</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="col-span-1 row-span-1 group relative rounded-3xl overflow-hidden border border-white/10 bg-neutral-900/30 p-6 flex flex-col justify-between hover:bg-neutral-800/50 transition-colors">
            <div className="w-10 h-10 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center">
              <Users size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Collaboration</h3>
              <p className="text-neutral-400 text-xs">Real-time multiplayer learning.</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="col-span-1 row-span-1 group relative rounded-3xl overflow-hidden border border-white/10 bg-neutral-900/30 p-6 flex flex-col justify-between hover:bg-neutral-800/50 transition-colors">
            <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-xl flex items-center justify-center">
              <Globe size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Global edge</h3>
              <p className="text-neutral-400 text-xs">Content caching in 350+ cities.</p>
            </div>
          </div>

          {/* Card 4 - Long */}
          <div className="col-span-1 md:col-span-2 row-span-1 group relative rounded-3xl overflow-hidden border border-white/10 bg-neutral-900/30 flex items-center">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-8 flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center border border-white/10">
                <BarChart3 className="text-white" size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Analytics</h3>
                <p className="text-neutral-400 text-sm">Deep insights into your learning velocity and retention rates.</p>
              </div>
            </div>
          </div>

          {/* Card 5 */}
          <div className="col-span-1 md:col-span-2 row-span-1 group relative rounded-3xl overflow-hidden border border-white/10 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="border border-white/30 rounded-full px-6 py-2 backdrop-blur-md bg-white/10 text-white font-medium flex items-center gap-2">
                <Shield size={16} />
                Enterprise Security
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// 5. Performance Section
const PerformanceStats = () => {
  return (
    <section id="performance" className="py-32 px-6 border-t border-white/5 bg-black">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full border border-blue-500/30 bg-blue-500/10 text-xs text-blue-400 font-bold mb-8 uppercase tracking-widest">
          <Cpu size={12} />
          Under the hood
        </div>
        <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter">
          Engineered for speed.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-left mt-24">
          <div>
            <div className="flex items-end gap-2 mb-4">
              <div className="text-7xl font-bold text-white tracking-tighter">12</div>
              <div className="text-xl text-neutral-500 font-medium mb-2">ms</div>
            </div>
            <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden mb-6">
              <motion.div
                whileInView={{ width: "15%" }}
                initial={{ width: "0%" }}
                transition={{ duration: 1.5, ease: APPLE_EASE }}
                className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
              />
            </div>
            <h3 className="text-white font-semibold mb-2">Ultra-low Latency</h3>
            <p className="text-sm text-neutral-500 leading-relaxed">Global edge network ensures instant interactions regardless of user location. We pre-fetch content before you even click.</p>
          </div>

          <div>
            <div className="flex items-end gap-2 mb-4">
              <div className="text-7xl font-bold text-white tracking-tighter">99.9</div>
              <div className="text-xl text-neutral-500 font-medium mb-2">%</div>
            </div>
            <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden mb-6">
              <motion.div
                whileInView={{ width: "99.9%" }}
                initial={{ width: "0%" }}
                transition={{ duration: 1.5, ease: APPLE_EASE }}
                className="h-full bg-purple-500 shadow-[0_0_10px_#a855f7]"
              />
            </div>
            <h3 className="text-white font-semibold mb-2">Uptime Guarantee</h3>
            <p className="text-sm text-neutral-500 leading-relaxed">Redundant infrastructure spread across 3 continents ensures your learning never stops.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- MAIN PAGE COMPONENT ---

export default function Home() {
  const [loading, setLoading] = useState(true);

  // In a real app, you might use a cookie to skip this on subsequent visits
  // For this demo, we run it on mount
  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 font-sans overflow-x-hidden">
      <AnimatePresence mode="wait">
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <Navbar />

          <Hero />

          <BentoGrid />

          <PerformanceStats />

          <footer className="py-12 border-t border-white/5 text-center">
            <div className="flex justify-center gap-8 mb-8 text-sm text-neutral-500">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
            </div>
            <div className="flex items-center justify-center gap-2 text-neutral-600 text-xs">
              <Radio size={12} className="animate-pulse text-green-500" />
              <span>All Systems Operational</span>
            </div>
            <p className="text-neutral-700 text-xs mt-4">&copy; 2026 LMS Pro. Crafted for the future.</p>
          </footer>
        </motion.main>
      )}
    </div>
  );
}