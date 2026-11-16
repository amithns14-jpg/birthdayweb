import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Gift, ArrowDown } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WelcomeScreen({ profile, onOpenSurprise }) {
  const handleOpenClick = () => {
    // Trigger celebratory burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f472b6', '#c084fc', '#fbbf24', '#ffffff', '#fb7185']
    });
    onOpenSurprise();
  };

  return (
    <section id="welcome" className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden pt-20 pb-16">
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Glowing badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-card border border-pink-400/30 text-pink-300 text-sm font-medium mb-8 shadow-lg shadow-pink-500/10"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
          <span>A Magical Celebration Awaits</span>
          <Sparkles className="w-4 h-4 text-pink-300 animate-spin" style={{ animationDuration: '4s' }} />
        </motion.div>

        {/* Big Greeting Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-tight"
        >
          <span className="block text-white/90">Hey!</span>
          <span className="block bg-gradient-to-r from-pink-300 via-rose-300 to-amber-200 bg-clip-text text-transparent text-glow">
            {profile?.welcome_headline || "Someone Special Has a Birthday Today!"}
          </span>
        </motion.h1>

        {/* Emotional Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="text-lg sm:text-2xl text-purple-200/80 max-w-2xl font-light mb-12 leading-relaxed"
        >
          A tiny corner of the universe crafted with love, memories, smiles, and heartfelt surprises just for you.
        </motion.p>

        {/* Glowing "Open Your Surprise" Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative group"
        >
          {/* Pulsing glow aura */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition duration-500 group-hover:scale-105 animate-pulse" />

          <button
            onClick={handleOpenClick}
            className="relative flex items-center gap-3 px-8 sm:px-12 py-4 sm:py-5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-semibold text-lg sm:text-xl shadow-2xl shadow-pink-500/50 hover:shadow-pink-500/80 transform hover:-translate-y-0.5 active:translate-y-0 transition-all border border-white/25"
          >
            <Gift className="w-6 h-6 text-amber-200 animate-bounce" />
            <span>Open Your Surprise</span>
            <Sparkles className="w-5 h-5 text-amber-200" />
          </button>
        </motion.div>

        {/* Little prompt to scroll or click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-16 flex flex-col items-center gap-2 text-white/40 text-xs font-light"
        >
          <span>Tap the button or scroll down to begin</span>
          <ArrowDown className="w-4 h-4 animate-bounce text-pink-400" />
        </motion.div>
      </div>
    </section>
  );
}
