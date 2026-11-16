import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, RotateCcw, Share2, Check, Cake } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FinalCelebration({ profile, onReplay }) {
  const [copied, setCopied] = useState(false);

  const triggerGrandFireworks = () => {
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Multiple fireworks bursts
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.4), y: Math.random() - 0.2 },
        colors: ['#f43f5e', '#ec4899', '#fef08a', '#38bdf8', '#c084fc']
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.6, 0.9), y: Math.random() - 0.2 },
        colors: ['#fbbf24', '#f472b6', '#a855f7', '#34d399', '#ffffff']
      });
    }, 250);

    if (onReplay) {
      onReplay();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="min-h-screen relative flex items-center justify-center px-4 py-24 overflow-hidden">
      {/* Ambient center illumination */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] bg-gradient-to-r from-pink-600/20 via-purple-600/20 to-amber-500/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Floating Crown / Cake Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 p-[3px] shadow-2xl shadow-pink-500/40 mb-8"
        >
          <div className="w-full h-full rounded-full bg-[#170B26] flex items-center justify-center">
            <span className="text-4xl animate-bounce">🎂</span>
          </div>
        </motion.div>

        {/* Closing Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-serif text-5xl sm:text-7xl md:text-8xl font-black tracking-tight mb-6 bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text text-transparent text-glow"
        >
          {profile?.closing_headline || "Once Again, Happy Birthday! 🎂"}
        </motion.h2>

        {/* Closing Wish Quote */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif italic text-xl sm:text-3xl text-purple-100 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          "{profile?.closing_message || "May your smile never fade, your dreams never stop, and your happiness never end."}"
        </motion.p>

        {/* Buttons: Replay Celebration & Share */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
        >
          <button
            onClick={triggerGrandFireworks}
            className="flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-amber-400 text-white font-bold text-lg shadow-xl shadow-pink-500/30 hover:shadow-pink-500/60 transform hover:-translate-y-1 active:translate-y-0 transition-all border border-white/20 group"
          >
            <RotateCcw className="w-5 h-5 group-hover:-rotate-90 transition-transform" />
            <span>Replay Grand Celebration</span>
            <Sparkles className="w-5 h-5 text-amber-200" />
          </button>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2.5 px-6 py-4 rounded-full glass-card hover:bg-white/15 text-pink-200 font-semibold text-base border border-white/20 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-300">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-5 h-5 text-pink-400" />
                <span>Share Celebration</span>
              </>
            )}
          </button>
        </motion.div>

        {/* Delicate Heart Footer */}
        <div className="mt-20 flex items-center gap-2 text-white/40 text-xs font-light">
          <span>Crafted with infinite love for {profile?.person_name || "Someone Special"}</span>
          <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
        </div>
      </div>
    </section>
  );
}
