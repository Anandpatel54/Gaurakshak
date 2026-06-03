'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence, useMotionValue, useScroll, useSpring, useTransform, Variants } from 'framer-motion';
import { FiCalendar, FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Dynamic import for Three.js scene (client-side only, no SSR)
const HeroScene3D = dynamic(() => import('./HeroScene3D'), {
  ssr: false,
  loading: () => null,
});

// High-quality spiritual images representing each of Gaurakshak's core pillars
const slides = [
  {
    tagline: "Dharma Protects Those Who Protect It",
    title: "Compassionate Care & Seva for Sacred Cows",
    description: "Experience the profound divinity of Gau Seva. By feeding, sheltering, and offering medical care to abandoned cows, we invite positive cosmic energy and honor the sacred mother of earth.",
    image: "https://images.unsplash.com/photo-1596742572447-5720fc174967?auto=format&fit=crop&q=80&w=1920",
    buttonText: "Join Gau Sewa",
    buttonLink: "/booking",
    stats: [
      { value: "500+", label: "Cows Sheltered" },
      { value: "12+", label: "Gaushalas Built" },
      { value: "50+", label: "Tons Fodder Fed" }
    ],
    accentColor: "from-saffron-500 to-gold-400",
    textColor: "text-gold-400",
    glowColor: "shadow-saffron-500/30",
    gradientBg: "from-saffron-950/40 via-saffron-900/10 to-stone-950/80"
  },
  {
    tagline: "Listen to the Eternal Nectar of Truth",
    title: "Immerse in Divine Shrimad Bhagavad Katha",
    description: "Awaken your soul with the spiritual nectar of Vedic discourses. We organize majestic Shrimad Bhagavad Kathas and Ram Kathas adorned with traditional musical bhajans and deep philosophy.",
    image: "https://images.unsplash.com/photo-1608976478512-ca619a9e33ec?auto=format&fit=crop&q=80&w=1920",
    buttonText: "Book Katha Inquiry",
    buttonLink: "/booking",
    stats: [
      { value: "120+", label: "Kathas Organized" },
      { value: "100k+", label: "Devotees Blessed" },
      { value: "50+", label: "Renowned Vachaks" }
    ],
    accentColor: "from-maroon-500 to-saffron-500",
    textColor: "text-saffron-400",
    glowColor: "shadow-maroon-500/30",
    gradientBg: "from-maroon-950/40 via-maroon-900/10 to-stone-950/80"
  },
  {
    tagline: "Celebrate the Reign of Righteousness",
    title: "Vibrant & Grand Ramji Janmotsav Utsav",
    description: "Be part of the majestic Ramji Janmotsav and historic traditional Shobha Yatras. Let us join hands to celebrate the advent of Maryada Purushottam Shri Ram with cultural pride.",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&q=80&w=1920",
    buttonText: "Explore Events",
    buttonLink: "/events",
    stats: [
      { value: "25+", label: "Festivals Annually" },
      { value: "50k+", label: "Yatra Footfalls" },
      { value: "100%", label: "Dharmik Ekta" }
    ],
    accentColor: "from-gold-400 to-saffron-500",
    textColor: "text-gold-300",
    glowColor: "shadow-gold-500/30",
    gradientBg: "from-stone-900/40 via-saffron-950/10 to-stone-950/80"
  }
];

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  travelY: number;
  type: 'gold' | 'petal';
}

interface TrailParticle {
  id: number;
  x: number;
  y: number;
  color: string;
}

const seededValue = (seed: number) => {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};

const toCssNumber = (value: number) => Number(value.toFixed(4));

const backgroundParticles: Particle[] = Array.from({ length: 32 }, (_, i) => {
  const isPetal = i % 3 === 0;

  return {
    id: i,
    x: toCssNumber(seededValue(i + 1) * 100),
    y: toCssNumber(seededValue(i + 2) * 100),
    size: toCssNumber(seededValue(i + 3) * (i % 4 === 0 ? 14 : 7) + 5),
    duration: seededValue(i + 4) * 10 + 12,
    delay: seededValue(i + 5) * 4,
    travelY: isPetal
      ? -150 - seededValue(i + 6) * 250
      : -80 - seededValue(i + 7) * 120,
    type: isPetal ? 'petal' : 'gold'
  };
});

function Counter({ value }: { value: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const numberPart = parseInt(value.replace(/\D/g, '')) || 0;
  const suffix = value.replace(/[0-9]/g, '');

  useEffect(() => {
    let start = 0;
    const end = numberPart;
    if (end === 0) {
      return;
    }
    const duration = 1200; // ms
    const stepTime = 16; // ~60fps
    const steps = duration / stepTime;
    const increment = end / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      start += increment;
      if (currentStep >= steps) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [value, numberPart]);

  return <span>{displayValue > 0 ? `${displayValue}${suffix}` : value}</span>;
}

export default function HeroBanner() {
  const [activeTheme, setActiveTheme] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [trail, setTrail] = useState<TrailParticle[]>([]);
  const [showCustomCursor, setShowCustomCursor] = useState(false);
  const [mousePos3D, setMousePos3D] = useState({ x: 0, y: 0 });

  const lastTrailTime = useRef(0);

  // Mouse positions for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 28, stiffness: 100 };
  
  // Parallax spring animations for different depths
  const bgTranslateX = useSpring(useTransform(mouseX, [-400, 400], [-15, 15]), springConfig);
  const bgTranslateY = useSpring(useTransform(mouseY, [-400, 400], [-15, 15]), springConfig);
  
  const mandalaTranslateX = useSpring(useTransform(mouseX, [-400, 400], [-35, 35]), springConfig);
  const mandalaTranslateY = useSpring(useTransform(mouseY, [-400, 400], [-35, 35]), springConfig);

  // Absolute mouse coordinates for the custom trail and spotlight
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorSpringX = useSpring(cursorX, { damping: 25, stiffness: 220 });
  const cursorSpringY = useSpring(cursorY, { damping: 25, stiffness: 220 });
  
  const ringSpringX = useSpring(cursorX, { damping: 35, stiffness: 140 });
  const ringSpringY = useSpring(cursorY, { damping: 35, stiffness: 140 });

  // Pre-computed spotlight transforms (must be at top level, never inside conditionals)
  const spotlightX = useTransform(cursorSpringX, (v) => v - 225);
  const spotlightY = useTransform(cursorSpringY, (v) => v - 225);
  const { scrollY } = useScroll();
  const scrollFade = useTransform(scrollY, [0, 350], [1, 0]);
  const scrollContentY = useTransform(scrollY, [0, 350], [0, -60]);
  const scrollStatsY = useTransform(scrollY, [0, 350], [0, -36]);
  const scrollBlur = useTransform(scrollFade, (v) => (v < 0.5 ? `blur(${(1 - v) * 6}px)` : 'none'));
  const scrollPointerEvents = useTransform(scrollFade, (v) => (v < 0.15 ? 'none' : 'auto'));

  // Theme auto-changer
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveTheme((prev) => (prev + 1) % slides.length);
    }, 8500);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Trail cleaner
  useEffect(() => {
    if (trail.length === 0) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setTrail((prev) => prev.filter((p) => now - p.id < 800));
    }, 300);
    return () => clearInterval(interval);
  }, [trail]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Parallax values
    const x = e.clientX - rect.left - width / 2;
    const y = e.clientY - rect.top - height / 2;
    mouseX.set(x);
    mouseY.set(y);
    
    // Absolute position inside component
    const absoluteX = e.clientX - rect.left;
    const absoluteY = e.clientY - rect.top;
    cursorX.set(absoluteX);
    cursorY.set(absoluteY);

    if (!showCustomCursor) {
      setShowCustomCursor(true);
    }

    // Normalized mouse position for 3D scene (-1 to 1)
    setMousePos3D({
      x: (absoluteX / width) * 2 - 1,
      y: -(absoluteY / height) * 2 + 1,
    });

    // Sparkle trail generator with throttling
    const now = Date.now();
    if (now - lastTrailTime.current > 40) {
      const newParticle: TrailParticle = {
        id: now,
        x: absoluteX,
        y: absoluteY,
        color: activeTheme === 0 ? '#FFD700' : activeTheme === 1 ? '#FF6B00' : '#FF9F43'
      };
      setTrail((prev) => [...prev.slice(-15), newParticle]);
      lastTrailTime.current = now;
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setShowCustomCursor(false);
    setMousePos3D({ x: 0, y: 0 });
  };

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setActiveTheme((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setActiveTheme((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Word-by-word reveal transitions
  const textContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const wordVariants: Variants = {
    hidden: { opacity: 0, y: 25, filter: 'blur(3px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: "spring", damping: 14, stiffness: 90 }
    }
  };

  return (
    <div 
      className="relative min-h-screen flex flex-col items-center justify-between bg-stone-950 overflow-hidden pt-12 pb-20 select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Slideshow with Cinematic Ken Burns Zoom (Optimized background visibility) */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeTheme}
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ 
              opacity: 0.85, // Boosted to 85% for full clarity of cows/kathas/yatras background
              scale: 1.03,
              x: bgTranslateX.get(),
              y: bgTranslateY.get(),
              transition: { 
                opacity: { duration: 1.2, ease: "easeInOut" },
                scale: { duration: 12, ease: "easeOut" } 
              }
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.95,
              transition: { duration: 0.8, ease: "easeInOut" }
            }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${slides[activeTheme].image}')` }}
          />
        </AnimatePresence>
        
        {/* Lighter Gradient Mask to make background details extremely prominent */}
        <div className="absolute inset-0 bg-linear-to-b from-stone-950/65 via-transparent to-stone-950/80 z-0" />
        <div className={`absolute inset-0 bg-linear-to-tr ${slides[activeTheme].gradientBg} opacity-35 transition-all duration-1000 z-0`} />
      </div>

      {/* ═══ THREE.JS 3D SCENE LAYER ═══ */}
      <Suspense fallback={null}>
        <HeroScene3D activeTheme={activeTheme} mousePos={mousePos3D} />
      </Suspense>

      {/* Divine Pulsing Aura Halo (Ambient gold glow behind text) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-175 rounded-full bg-saffron-500/10 blur-[130px] pointer-events-none z-0 animate-pulse-soft" />

      {/* Interactive Cursor Spotlight Glow (Brightens background where cursor moves) */}
      <motion.div 
        className="absolute pointer-events-none rounded-full w-112.5 h-112.5 mix-blend-screen z-0 blur-[90px]"
        style={{
          x: spotlightX,
          y: spotlightY,
          opacity: showCustomCursor ? 0.75 : 0,
          background: "radial-gradient(circle, rgba(255,167,38,0.22) 0%, rgba(255,107,0,0.08) 60%, transparent 100%)"
        }}
      />

      {/* Interactive Cursor Particles Trail (Sparks) */}
      <AnimatePresence>
        {trail.map((t) => (
          <motion.div
            key={t.id}
            className="absolute pointer-events-none rounded-full z-20"
            style={{
              left: t.x,
              top: t.y,
              width: 8,
              height: 8,
              backgroundColor: t.color,
              boxShadow: `0 0 12px ${t.color}`,
              x: "-50%",
              y: "-50%",
            }}
            initial={{ opacity: 0.9, scale: 1 }}
            animate={{ opacity: 0, scale: 0.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          />
        ))}
      </AnimatePresence>

      {/* Custom Cursor Ring & Dot Follower (Desktop only) */}
      {showCustomCursor && (
        <>
          {/* Outer Ring */}
          <motion.div
            className="hidden md:block absolute pointer-events-none z-50 rounded-full border border-gold-400/80 w-10 h-10 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(255,215,0,0.2)]"
            style={{
              x: ringSpringX,
              y: ringSpringY,
            }}
          />
        </>
      )}

      {/* Floating Particles & Lotus Petals */}
      <div className="absolute inset-0 z-1 pointer-events-none overflow-hidden">
        {backgroundParticles.map((p) => {
          if (p.type === 'petal') {
            return (
              <motion.div
                key={p.id}
                className="absolute text-rose-400/40"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                }}
                animate={{
                  y: [0, p.travelY],
                  x: [0, Math.sin(p.id) * 70],
                  rotate: [0, 360],
                  opacity: [0, 0.75, 0]
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  ease: "linear",
                  delay: p.delay
                }}
              >
                {/* Spiritual Sacred Lotus Petal Shape SVG */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full filter drop-shadow-[0_2px_8px_rgba(244,63,94,0.4)]">
                  <path d="M12 2C11.3 3.6 9.6 5.8 7.3 7.8 5 9.8 2 11.6 2 14c0 3.3 2.7 6 6 6s4.8-1.5 4-2.8c-.8 1.3.7 2.8 4 2.8 3.3 0 6-2.7 6-6 0-2.4-3-4.2-5.3-6.2-2.3-2-4-4.2-4.7-5.8z"/>
                </svg>
              </motion.div>
            );
          } else {
            return (
              <motion.div
                key={p.id}
                className="absolute rounded-full bg-linear-to-br from-gold-400 to-saffron-400 shadow-[0_0_12px_rgba(255,215,0,0.6)]"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                }}
                animate={{
                  y: [0, p.travelY],
                  x: [0, Math.cos(p.id) * 35],
                  opacity: [0, 0.85, 0],
                  scale: [0.6, 1.4, 0.6]
                }}
                transition={{
                  duration: p.duration * 0.7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: p.delay
                }}
              />
            );
          }
        })}
      </div>

      {/* Traditional Rotating Mandalas with Higher Opacity & Vivid Gradients */}
      <motion.div 
        style={{ x: mandalaTranslateX, y: mandalaTranslateY }}
        className="absolute top-1/4 -left-37.5 opacity-25 w-137.5 h-137.5 border-4 border-dashed border-gold-400 rounded-full animate-[spin_180s_linear_infinite] pointer-events-none z-0 filter drop-shadow-[0_0_20px_rgba(255,215,0,0.15)]" 
      />
      <motion.div 
        style={{ x: mandalaTranslateX, y: mandalaTranslateY }}
        className="absolute bottom-1/4 -right-45 opacity-20 w-112.5 h-112.5 border-2 border-double border-saffron-500 rounded-full animate-[spin_100s_linear_infinite] pointer-events-none z-0 filter drop-shadow-[0_0_15px_rgba(255,107,0,0.1)]" 
      />

      {/* Main Content Area — fades out on scroll to reveal 3D scene */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center w-full grow flex flex-col justify-start items-center pt-2 md:pt-4 transition-[filter] duration-300"
        style={{
          opacity: scrollFade,
          y: scrollContentY,
          filter: scrollBlur,
          pointerEvents: scrollPointerEvents,
        }}
      >
        
        {/* Dynamic Spiritual Selector Tabs */}
        <div className="flex justify-center gap-3 mb-4 flex-wrap max-w-xl mx-auto px-2 relative z-20">
          {slides.map((slide, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false);
                setActiveTheme(index);
              }}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-500 cursor-pointer backdrop-blur-md border ${
                activeTheme === index
                  ? 'bg-saffron-500/30 text-white border-saffron-500/50 shadow-[0_0_25px_rgba(255,107,0,0.35)] scale-105'
                  : 'bg-black/45 text-stone-300 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  activeTheme === index ? 'bg-gold-400 animate-ping' : 'bg-stone-500'
                }`} />
                {index === 0 ? "🐮 Gau Seva" : index === 1 ? "📖 Bhagavad Katha" : "🌸 Ramji Utsav"}
              </span>
            </button>
          ))}
        </div>

        {/* Cinematic Title & Texts with Key Transitions inside readable glass panel */}
        <div className="max-w-4xl mx-auto min-h-75 md:min-h-80 flex flex-col justify-center bg-black/40 backdrop-blur-[6px] p-6 sm:p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTheme}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={textContainerVariants}
              className="flex flex-col items-center"
            >
              {/* Spiritual Top Tagline */}
              <motion.span
                variants={wordVariants}
                className={`inline-block bg-black/45 backdrop-blur-md px-6 py-2 rounded-full text-sm md:text-base font-bold border spiritual-text tracking-widest mb-6 transition-colors duration-500 ${slides[activeTheme].textColor} border-white/15`}
              >
                {slides[activeTheme].tagline}
              </motion.span>

              {/* Dynamic Header with Shadow protection for high readability */}
              <motion.h1
                variants={wordVariants}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.15] font-heading filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)]"
              >
                {slides[activeTheme].title.split(" ").map((word, wordIdx) => {
                  const isAccent = word.toLowerCase().includes("seva") || 
                                  word.toLowerCase().includes("sewa") || 
                                  word.toLowerCase().includes("bhagavad") || 
                                  word.toLowerCase().includes("katha") || 
                                  word.toLowerCase().includes("ramji") || 
                                  word.toLowerCase().includes("janmotsav");
                  
                  return (
                    <span key={wordIdx} className="inline-block mr-2 md:mr-3">
                      {isAccent ? (
                        <span className={`text-transparent bg-clip-text bg-linear-to-r ${slides[activeTheme].accentColor} font-extrabold filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]`}>
                          {word}
                        </span>
                      ) : (
                        word
                      )}
                    </span>
                  );
                })}
              </motion.h1>

              {/* Dynamic Description paragraph with shadow shield */}
              <motion.p
                variants={wordVariants}
                className="mt-6 text-stone-200 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-semibold filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
              >
                {slides[activeTheme].description}
              </motion.p>

              {/* Actions row */}
              <motion.div
                variants={wordVariants}
                className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 w-full sm:w-auto px-4"
              >
                <Link
                  href={slides[activeTheme].buttonLink}
                  className={`w-full sm:w-auto text-white font-bold px-8 py-4 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 text-base cursor-pointer relative overflow-hidden group ${
                    activeTheme === 2 ? 'maroon-gradient hover:shadow-maroon-500/40' : 'orange-gradient hover:shadow-saffron-500/40'
                  }`}
                >
                  {/* Sweep shimmer reflection */}
                  <span className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  <FiCalendar className="w-5 h-5 group-hover:rotate-12 transition-transform" /> 
                  {slides[activeTheme].buttonText}
                </Link>

                <Link
                  href="/events"
                  className="w-full sm:w-auto bg-black/45 hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-full border border-white/15 hover:border-white/30 transition-all duration-300 flex items-center justify-center gap-2 text-base backdrop-blur-md cursor-pointer group"
                >
                  Upcoming Kathas 
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Slide Left/Right Controls for Easy Navigation */}
        <div className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 hidden md:block">
          <button
            onClick={prevSlide}
            className="w-12 h-12 rounded-full bg-black/40 hover:bg-white/15 text-white flex items-center justify-center border border-white/15 hover:border-white/35 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Previous Slide"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>
        </div>
        <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 hidden md:block">
          <button
            onClick={nextSlide}
            className="w-12 h-12 rounded-full bg-black/40 hover:bg-white/15 text-white flex items-center justify-center border border-white/15 hover:border-white/35 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Next Slide"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>
        </div>
      </motion.div>

      {/* Floating Glassmorphic Stats Section — also fades out on scroll */}
      <motion.div
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-16 md:mt-24"
        style={{
          opacity: scrollFade,
          y: scrollStatsY,
          pointerEvents: scrollPointerEvents,
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <AnimatePresence mode="wait">
            {slides[activeTheme].stats.map((stat, idx) => (
              <motion.div
                key={`${activeTheme}-${idx}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: idx * 0.15, type: "spring", stiffness: 100 }
                }}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                whileHover={{ 
                  y: -8, 
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6)",
                  borderColor: "rgba(255, 107, 0, 0.35)",
                  backgroundColor: "rgba(54, 25, 6, 0.85)"
                }}
                className="glass-panel-dark backdrop-blur-2xl px-6 py-5 rounded-2xl flex flex-col justify-center items-center text-center border border-white/10 transition-all duration-300 shadow-2xl"
              >
                <span className={`text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r ${slides[activeTheme].accentColor} tracking-tight`}>
                  <Counter value={stat.value} />
                </span>
                <span className="text-stone-300 font-bold text-xs md:text-sm mt-1 uppercase tracking-widest font-heading">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Bottom Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-cream-50 z-0 pointer-events-none" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }} />
    </div>
  );
}
