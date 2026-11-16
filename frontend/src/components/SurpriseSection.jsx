import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, Heart, Eye, CheckCircle2, Star, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SurpriseSection({ surprises = [] }) {
  const [openedBox, setOpenedBox] = useState(false);
  const [unlockedItems, setUnlockedItems] = useState({});

  const handleOpenGiftBox = () => {
    if (!openedBox) {
      // Fire confetti burst
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#a855f7', '#fbbf24', '#38bdf8']
      });
      setOpenedBox(true);
    }
  };

  const toggleUnlockItem = (id) => {
    setUnlockedItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section id="surprises" className="py-24 px-4 relative z-10">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-amber-400/30 text-amber-300 text-xs font-semibold mb-4">
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Surprises</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-300 via-pink-300 to-purple-200 bg-clip-text text-transparent">
            A Box of Hidden Birthday Surprises
          </h2>
          <p className="text-purple-200/70 text-base sm:text-lg max-w-xl mx-auto mt-3">
            Every layer unwraps another reason why today is extraordinary. Tap the gift to begin!
          </p>
        </div>

        {/* 3D / Animated Gift Box */}
        <div className="flex flex-col items-center justify-center mb-16">
          <motion.div
            initial={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenGiftBox}
            className="cursor-pointer relative flex flex-col items-center group select-none"
          >
            {/* Ambient gift glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/40 via-amber-400/30 to-purple-600/40 rounded-full blur-2xl group-hover:opacity-100 opacity-60 transition duration-500 pointer-events-none" />

            {/* Gift Box Graphics */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex flex-col items-center justify-end">
              {/* Lid with Ribbon Bow */}
              <motion.div
                animate={openedBox ? { y: -70, rotate: -15, opacity: 0.9 } : { y: 0, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="relative z-20 flex flex-col items-center"
              >
                {/* Ribbon Bow */}
                <div className="flex items-center justify-center -mb-2">
                  <div className="w-7 h-7 border-4 border-amber-300 rounded-full bg-amber-400 -mr-2 shadow-md" />
                  <div className="w-5 h-5 bg-amber-300 rounded-full z-10 shadow-sm" />
                  <div className="w-7 h-7 border-4 border-amber-300 rounded-full bg-amber-400 -ml-2 shadow-md" />
                </div>
                {/* Lid top bar */}
                <div className="w-48 sm:w-56 h-10 rounded-xl bg-gradient-to-r from-rose-600 via-pink-500 to-rose-600 border border-white/30 shadow-xl flex items-center justify-center relative overflow-hidden">
                  {/* Vertical ribbon on lid */}
                  <div className="w-8 h-full bg-amber-400 shadow-sm" />
                </div>
              </motion.div>

              {/* Box Body */}
              <div className="w-44 sm:w-52 h-36 sm:h-40 rounded-b-2xl bg-gradient-to-br from-pink-600 via-rose-600 to-purple-800 border border-white/20 shadow-2xl relative flex items-center justify-center overflow-hidden">
                {/* Vertical Ribbon */}
                <div className="w-8 h-full bg-amber-400 shadow-md" />
                {/* Horizontal Ribbon */}
                <div className="absolute inset-x-0 h-8 bg-amber-400 shadow-md" />

                {/* Sparkling sparkles inside if opened */}
                {openedBox && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <Sparkles className="w-16 h-16 text-yellow-200 animate-spin" style={{ animationDuration: '6s' }} />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Prompt under gift */}
            <div className="mt-6 text-center">
              <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                openedBox
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                  : 'bg-gradient-to-r from-amber-400/20 to-pink-500/20 text-amber-300 border border-amber-400/40 group-hover:scale-105'
              }`}>
                {openedBox ? (
                  <>
                    <PartyPopper className="w-4 h-4 text-emerald-400" />
                    <span>Surprises Unwrapped! Scroll Below 👇</span>
                  </>
                ) : (
                  <>
                    <Gift className="w-4 h-4 text-amber-400 animate-bounce" />
                    <span>Tap Gift Box to Unwrap Surprises!</span>
                  </>
                )}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Revealed Surprises Cards */}
        <AnimatePresence>
          {openedBox && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
            >
              {surprises.map((item, index) => {
                const isUnlocked = unlockedItems[item.id];

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    className="glass-card rounded-3xl p-6 sm:p-7 border border-white/15 hover:border-amber-400/40 transition-all flex flex-col justify-between relative overflow-hidden shadow-xl"
                  >
                    {/* Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                        {item.badge || "Special Secret"}
                      </span>
                      {isUnlocked && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-3">
                      {item.title}
                    </h3>

                    {/* Content / Mystery State */}
                    <div className="my-4 min-h-[90px] flex items-center justify-center">
                      {isUnlocked ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="w-full p-4 rounded-2xl bg-white/10 border border-white/20 text-sm sm:text-base text-purple-100 leading-relaxed whitespace-pre-line"
                        >
                          {item.secret_content}
                        </motion.div>
                      ) : (
                        <div className="w-full p-5 rounded-2xl bg-black/30 border border-dashed border-white/20 text-center flex flex-col items-center justify-center">
                          <Eye className="w-6 h-6 text-pink-400 mb-2 opacity-60" />
                          <p className="text-xs text-purple-200/70">
                            {item.preview_hint || "Tap to reveal this hidden secret!"}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => toggleUnlockItem(item.id)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                        isUnlocked
                          ? 'bg-white/10 text-white/70 hover:bg-white/20'
                          : 'bg-gradient-to-r from-amber-400 to-pink-500 text-white shadow-lg shadow-pink-500/20 hover:scale-[1.02]'
                      }`}
                    >
                      {isUnlocked ? "Hide Secret" : "Reveal Mystery ✨"}
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
