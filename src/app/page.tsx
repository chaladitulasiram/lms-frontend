'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  AnimatePresence,
  LayoutGroup
} from 'framer-motion';
import {
  Menu, ChevronRight, Play,
  Layers, Zap, Shield, Globe,
  BarChart3, Users, Mail, Lock,
  ArrowRight, CheckCircle2, User
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
      { text: "Loading Assets...", time: 800, prog: 45 },
      { text: "Optimizing 3D Engine...", time: 1600, prog: 80 },
      { text: "Ready", time: 2400, prog: 100 },
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
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center w-full max-w-xs"
      >
        <Layers className="w-12 h-12 text-white mb-8" />

        {/* Progress Bar */}
        <div className="w-full h-[2px] bg-neutral-800 rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full bg-white"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        <motion.p
          key={status}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-xs text-neutral-500 font-medium tracking-wide uppercase"
        >
          {status}
        </motion.p>
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
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 sm:pt-6 px-4 pointer-events-none">
      <motion.header
        layout
        className={`pointer-events-auto flex items-center justify-between px-6 
          ${isScrolled
            ? "bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-full py-3 w-auto min-w-[320px] shadow-2xl shadow-black/50"
            : "bg-transparent w-full max-w-7xl py-4"
          }`}
        transition={{ duration: 0.5, ease: APPLE_EASE }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mr-8">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <span className="text-black text-xs font-bold">L</span>
          </div>
          <span className={`font-semibold tracking-tight transition-colors ${isScrolled ? "text-white" : "text-white"}`}>
            LMS Pro
          </span>
        </div>

        {/* Links (Hidden on small screens when scrolled to save space, or adjusted) */}
        {!isScrolled && (
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#performance" className="hover:text-white transition-colors">Speed</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>
        )}

        {/* Auth Actions */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Only show Login text if not scrolled to keep pill small */}
          {!isScrolled && (
            <Link
              href="/login"
              className="text-sm font-medium text-white hover:text-neutral-300 transition-colors"
            >
              Log in
            </Link>
          )}

          <Link
            href="/register"
            className={`text-sm font-medium bg-white text-black rounded-full transition-all hover:scale-105 active:scale-95
              ${isScrolled ? "px-4 py-1.5" : "px-5 py-2"}`}
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
  const damping = 25;
  const stiffness = 150;

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { damping, stiffness });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { damping, stiffness });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden perspective-1000"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: APPLE_EASE, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6"
        >
          Learning. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Reimagined.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: APPLE_EASE, delay: 0.4 }}
          className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10"
        >
          An immersive learning experience designed for the spatial computing era.
          Focus deeper, learn faster, and achieve more.
        </motion.p>
      </div>

      {/* 3D Dashboard Construction (CSS Only) */}
      <div className="relative w-full max-w-4xl px-4 h-[400px] md:h-[500px] perspective-1000">
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative w-full h-full"
        >
          {/* Layer 1: Base Glass */}
          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl"
            style={{ transform: "translateZ(0px)" }}>
            {/* Grid Lines Pattern */}
            <div className="w-full h-full opacity-20"
              style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          </div>

          {/* Layer 2: UI Elements (Charts & Sidebar) */}
          <div className="absolute top-8 left-8 bottom-8 w-64 bg-white/5 backdrop-blur-sm rounded-xl border border-white/5 p-4 flex flex-col gap-4"
            style={{ transform: "translateZ(30px)" }}>
            <div className="w-full h-8 bg-white/10 rounded-md" />
            <div className="w-3/4 h-4 bg-white/5 rounded-md" />
            <div className="w-full h-32 bg-gradient-to-b from-blue-500/20 to-transparent rounded-lg mt-auto border border-blue-500/20" />
          </div>

          <div className="absolute top-8 right-8 bottom-8 left-80 bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 p-6"
            style={{ transform: "translateZ(20px)" }}>
            <div className="flex justify-between items-end h-full gap-4">
              {[40, 70, 50, 90, 60, 80].map((h, i) => (
                <div key={i} className="w-full bg-neutral-800 rounded-t-sm relative group">
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 bg-white rounded-t-sm"
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 1.5, ease: APPLE_EASE, delay: 0.8 + (i * 0.1) }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Layer 3: Floating Widgets (High Depth) */}
          <motion.div
            className="absolute -top-10 -right-10 bg-neutral-800/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-4"
            style={{ transform: "translateZ(80px)" }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">Course Completed</div>
              <div className="text-neutral-400 text-xs">Advanced React Patterns</div>
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-10 -left-10 bg-neutral-800/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl"
            style={{ transform: "translateZ(60px)" }}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-neutral-800 bg-neutral-600 flex items-center justify-center text-[10px] text-white">
                  <User size={12} />
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-neutral-800 bg-neutral-900 flex items-center justify-center text-[10px] text-white">
                +4
              </div>
            </div>
            <div className="mt-2 text-xs text-neutral-400 font-medium center">Active Learners</div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

// 4. Bento Grid Features
const BentoGrid = () => {
  const cards = [
    {
      title: "Active Recollection",
      desc: "AI-powered spaced repetition that adapts to your unique forgetting curve.",
      size: "col-span-1 md:col-span-2 row-span-2",
      bg: "bg-gradient-to-br from-blue-900/20 to-black",
      icon: <Zap className="w-8 h-8 text-blue-400" />
    },
    {
      title: "Spatial Audio",
      desc: "Immersive soundscapes for deep focus.",
      size: "col-span-1 row-span-1",
      bg: "bg-neutral-900/40",
      icon: <Users className="w-6 h-6 text-purple-400" />
    },
    {
      title: "Real-time Sync",
      desc: "Seamlessly switch between devices.",
      size: "col-span-1 row-span-1",
      bg: "bg-neutral-900/40",
      icon: <Globe className="w-6 h-6 text-green-400" />
    },
    {
      title: "Performance Analytics",
      desc: "Deep insights into your learning velocity.",
      size: "col-span-1 md:col-span-2 row-span-1",
      bg: "bg-neutral-900/40",
      icon: <BarChart3 className="w-6 h-6 text-orange-400" />
    }
  ];

  return (
    <section id="features" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-16 text-center tracking-tight">
          Tools for thought.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-3 gap-4 h-[800px] md:h-[600px]">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: APPLE_EASE }}
              className={`${card.size} group relative overflow-hidden rounded-3xl border border-white/10 p-8 flex flex-col justify-between hover:border-white/20 transition-colors ${card.bg} backdrop-blur-xl`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="mb-4 p-3 bg-white/5 w-fit rounded-xl backdrop-blur-md border border-white/5">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{card.title}</h3>
                <p className="text-neutral-400 leading-relaxed">{card.desc}</p>
              </div>

              {/* Decorative Elements */}
              {i === 0 && (
                <div className="absolute right-0 bottom-0 w-64 h-64 bg-blue-500/20 blur-[80px]" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 5. Performance Stats
const PerformanceStats = () => {
  return (
    <section id="performance" className="py-24 px-6 border-t border-white/5 bg-black">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block py-1 px-3 rounded-full border border-white/10 bg-white/5 text-xs text-blue-400 font-medium mb-8">
          Under the hood
        </div>
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
          Engineered for speed.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left mt-20">
          <div>
            <div className="text-neutral-500 text-lg mb-2">Latency</div>
            <div className="text-5xl font-bold text-white mb-6">12ms</div>
            {/* Visual Bar */}
            <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
              <motion.div
                whileInView={{ width: "15%" }}
                initial={{ width: "0%" }}
                transition={{ duration: 1.5, ease: APPLE_EASE }}
                className="h-full bg-blue-500"
              />
            </div>
            <p className="mt-4 text-sm text-neutral-500">Global edge network ensures instant interactions.</p>
          </div>

          <div>
            <div className="text-neutral-500 text-lg mb-2">Throughput</div>
            <div className="text-5xl font-bold text-white mb-6">4x Faster</div>
            {/* Visual Bar - Comparative */}
            <div className="space-y-2">
              <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden relative">
                <motion.div
                  whileInView={{ width: "100%" }}
                  initial={{ width: "0%" }}
                  transition={{ duration: 1.5, ease: APPLE_EASE }}
                  className="h-full bg-purple-500"
                />
              </div>
              <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden opacity-50">
                <div className="h-full bg-neutral-600 w-[25%]" />
              </div>
            </div>
            <p className="mt-4 text-sm text-neutral-500">Compared to traditional LMS architectures.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- MAIN PAGE COMPONENT ---

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 font-sans">
      <AnimatePresence mode="wait">
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Navbar />

          <Hero />

          <BentoGrid />

          <PerformanceStats />

          <footer className="py-12 border-t border-white/5 text-center text-neutral-500 text-sm">
            <div className="flex justify-center gap-8 mb-8">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p>&copy; 2026 LMS Pro. Crafted for the future.</p>
          </footer>
        </motion.main>
      )}
    </div>
  );
}