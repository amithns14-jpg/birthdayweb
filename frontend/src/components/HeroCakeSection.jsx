import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Wand2, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HeroCakeSection({ profile }) {
  const [candlesLit, setCandlesLit] = useState(true);
  const [wishMade, setWishMade] = useState(false);
  const [showWishModal, setShowWishModal] = useState(false);

  const handleMakeWish = () => {
    // Blow out candles
    setCandlesLit(false);
    setWishMade(true);
    setShowWishModal(true);

    // Multi-stage confetti celebration
    const end = Date.now() + 2.5 * 1000;
    const colors = ['#f472b6', '#c084fc', '#fbbf24', '#f43f5e', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const handleRelight = () => {
    setCandlesLit(true);
    setWishMade(false);
    setShowWishModal(false);
  };

  return (
    <section id="hero" className="min-h-screen relative flex items-center justify-center px-4 py-24">
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Person Name Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-4"
        >
          <span className="font-cursive text-3xl sm:text-5xl text-pink-300 drop-shadow-md">
            Wishing the Happiest Day to
          </span>
          <h2 className="font-serif text-5xl sm:text-7xl md:text-8xl font-black tracking-tight mt-2 bg-gradient-to-r from-pink-400 via-purple-300 to-amber-200 bg-clip-text text-transparent text-glow uppercase">
            {profile?.person_name || "Precious One"}
          </h2>
        </motion.div>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-2xl text-purple-200/90 max-w-2xl font-light mb-10 leading-relaxed"
        >
          {profile?.hero_subtitle || "Today is all about you. May your life always be filled with happiness, love, and unforgettable memories."}
        </motion.p>

        {/* Interactive Birthday Cake Illustration */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="relative my-6 select-none cursor-pointer"
          onClick={candlesLit ? handleMakeWish : handleRelight}
          title={candlesLit ? "Click the cake to blow out candles!" : "Click to relight candles"}
        >
          {/* Cake Platform Glow */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-64 h-12 bg-pink-500/30 rounded-full blur-xl pointer-events-none" />

          {/* SVG Birthday Cake */}
          <div className="relative w-72 h-64 sm:w-80 sm:h-72 flex flex-col items-center justify-end">
            {/* Candles Layer */}
            <div className="flex justify-center items-end gap-6 sm:gap-8 mb-[-4px] z-20">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex flex-col items-center relative">
                  {/* Candle Flame / Smoke */}
                  <div className="h-10 flex items-center justify-center">
                    <AnimatePresence>
                      {candlesLit ? (
                        <motion.div
                          key="flame"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="candle-flame w-4 h-7 rounded-[50%_50%_20%_20%] bg-gradient-to-t from-red-500 via-amber-400 to-yellow-200 shadow-[0_0_15px_#f59e0b] relative"
                        >
                          <div className="absolute top-1 left-1.5 w-1.5 h-3 bg-white/80 rounded-full blur-[0.5px]" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="smoke"
                          initial={{ opacity: 0.8, y: 0, scale: 0.8 }}
                          animate={{ opacity: 0, y: -25, scale: 1.6 }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="w-2.5 h-6 bg-white/40 rounded-full blur-sm"
                        />
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Wick */}
                  <div className="w-0.5 h-2 bg-gray-300" />

                  {/* Candle Body */}
                  <div className={`w-3.5 h-12 rounded-t-sm shadow-md ${
                    i === 0
                      ? 'bg-gradient-to-b from-pink-300 to-pink-500'
                      : i === 1
                      ? 'bg-gradient-to-b from-amber-200 to-amber-400'
                      : 'bg-gradient-to-b from-purple-300 to-purple-500'
                  }`}>
                    {/* Candle stripes */}
                    <div className="w-full h-1 bg-white/40 mt-2" />
                    <div className="w-full h-1 bg-white/40 mt-2" />
                  </div>
                </div>
              ))}
            </div>

            {/* Cake Top Tier */}
            <div className="w-48 sm:w-56 h-20 rounded-2xl bg-gradient-to-b from-pink-200 to-pink-300 shadow-inner relative z-10 border border-pink-100/40 flex flex-col justify-between overflow-hidden">
              {/* Dripping Frosting */}
              <div className="w-full flex justify-between px-1">
                {Array.from({ length: 8 }).map((_, j) => (
                  <div
                    key={j}
                    className="w-5 h-5 bg-white rounded-b-full shadow-sm"
                    style={{ height: `${12 + (j % 3) * 6}px` }}
                  />
                ))}
              </div>
              {/* Sprinkles on top tier */}
              <div className="absolute inset-0 flex flex-wrap gap-3 p-4 opacity-70 pointer-events-none">
                <span className="w-2 h-1 bg-amber-400 rounded-full rotate-45" />
                <span className="w-2 h-1 bg-purple-500 rounded-full -rotate-12" />
                <span className="w-2 h-1 bg-rose-500 rounded-full rotate-90" />
                <span className="w-2 h-1 bg-indigo-500 rounded-full rotate-30" />
              </div>
              {/* Ribbon line */}
              <div className="w-full h-2 bg-pink-400/30 mb-2" />
            </div>

            {/* Cake Bottom Tier */}
            <div className="w-64 sm:w-72 h-24 rounded-2xl bg-gradient-to-b from-purple-300 to-purple-400 shadow-xl relative border border-purple-200/40 flex flex-col justify-between overflow-hidden">
              {/* Dripping Frosting */}
              <div className="w-full flex justify-between px-1">
                {Array.from({ length: 11 }).map((_, j) => (
                  <div
                    key={j}
                    className="w-5 h-6 bg-pink-100 rounded-b-full shadow-sm"
                    style={{ height: `${14 + (j % 4) * 5}px` }}
                  />
                ))}
              </div>
              {/* Decorative Pearls & Swirls */}
              <div className="flex justify-around items-center px-4 mb-3">
                {Array.from({ length: 7 }).map((_, p) => (
                  <div key={p} className="w-3 h-3 rounded-full bg-white shadow-sm" />
                ))}
              </div>
            </div>

            {/* Serving Plate */}
            <div className="w-72 sm:w-80 h-4 bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 rounded-full shadow-2xl border border-white/50" />
          </div>
        </motion.div>

        {/* Action Button: Make a Wish / Relight */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
          {candlesLit ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMakeWish}
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 text-white font-bold text-lg shadow-xl shadow-amber-500/25 border border-white/30 hover:shadow-pink-500/40 transition-all"
            >
              <Wand2 className="w-5 h-5 text-yellow-200" />
              <span>Make a Wish & Blow Candles</span>
              <Sparkles className="w-5 h-5 text-yellow-200" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRelight}
              className="flex items-center gap-2 px-6 py-3 rounded-full glass-card hover:bg-white/15 text-pink-300 font-medium text-sm border border-pink-400/40 transition-all shadow-md"
            >
              <RefreshCw className="w-4 h-4 text-pink-400" />
              <span>Relight Candles</span>
            </motion.button>
          )}
        </div>

        {/* Wish Revealed Card */}
        <AnimatePresence>
          {wishMade && showWishModal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="mt-8 p-6 sm:p-8 rounded-3xl glass-card border-2 border-amber-300/40 shadow-2xl max-w-lg text-center relative overflow-hidden"
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
              <div className="text-4xl mb-3">✨💫✨</div>
              <h3 className="font-serif text-2xl font-bold text-amber-200 mb-2">
                Your Birthday Wish is Sent to the Stars!
              </h3>
              <p className="text-purple-100/90 text-sm sm:text-base leading-relaxed">
                {profile?.cake_wish_message || "May every single wish you whispered into the wind tonight come true tenfold with health, joy, and wonderful surprises!"}
              </p>
              <button
                onClick={() => setShowWishModal(false)}
                className="mt-4 text-xs text-pink-300/80 hover:text-pink-200 underline"
              >
                Close wish card
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
