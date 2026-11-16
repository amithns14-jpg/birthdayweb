import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Heart, Sparkles, Feather, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BirthdayLetter({ profile }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenLetter = () => {
    if (!isOpen) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f472b6', '#fda4af', '#fef08a']
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <section id="letter" className="py-24 px-4 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-rose-400/30 text-rose-300 text-xs font-semibold mb-4">
            <Feather className="w-3.5 h-3.5 text-rose-400" />
            <span>Words From The Heart</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-rose-300 via-pink-200 to-amber-100 bg-clip-text text-transparent">
            {profile?.letter_title || "A Heartfelt Letter For Your Special Day"}
          </h2>
          <p className="text-purple-200/70 text-base sm:text-lg max-w-lg mx-auto mt-3">
            An intimate message written especially for you on this milestone day.
          </p>
        </div>

        {/* Envelope & Letter Container */}
        <div className="relative flex justify-center">
          <div className="w-full max-w-2xl">
            {/* Sealed Envelope Graphic */}
            {!isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                onClick={handleOpenLetter}
                className="cursor-pointer relative bg-gradient-to-br from-[#2A163B] to-[#1A0B2A] p-8 sm:p-12 rounded-3xl border-2 border-rose-300/30 shadow-2xl flex flex-col items-center text-center group overflow-hidden"
              >
                {/* Envelope Flap Lines */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-white/5 clip-path-triangle pointer-events-none" />
                <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 p-[3px] shadow-xl mb-6 relative">
                  <div className="w-full h-full rounded-full bg-[#1A0B2A] flex items-center justify-center">
                    {/* Wax seal graphic */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-red-600 to-rose-700 border-2 border-amber-300 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                      <Heart className="w-7 h-7 text-amber-200 fill-amber-200/40" />
                    </div>
                  </div>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
                  To: <span className="text-pink-300 font-cursive text-3xl sm:text-4xl">{profile?.person_name || "You"}</span>
                </h3>
                <p className="text-purple-200/70 text-sm sm:text-base max-w-md">
                  Click the wax seal to open and unfold your personalized birthday letter.
                </p>

                <div className="mt-8 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 font-semibold text-sm group-hover:bg-rose-500/30 transition-all">
                  <Mail className="w-4 h-4 text-rose-400" />
                  <span>Break Wax Seal & Read</span>
                </div>
              </motion.div>
            )}

            {/* Unfolded Letter Parchment */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F5EFE0] text-neutral-900 p-8 sm:p-14 rounded-3xl shadow-2xl border-4 border-amber-200/60 overflow-hidden"
                >
                  {/* Parchment decorative stamp & corners */}
                  <div className="absolute top-6 right-6 w-16 h-20 border-2 border-dashed border-rose-300/60 rounded-md p-1 flex flex-col items-center justify-center text-center opacity-80">
                    <span className="text-[10px] text-rose-500 font-serif font-bold tracking-widest">LOVE</span>
                    <Heart className="w-4 h-4 text-rose-400 fill-rose-300 my-0.5" />
                    <span className="text-[9px] text-neutral-400">AIRMAIL</span>
                  </div>

                  {/* Letter Header */}
                  <div className="mb-8 border-b border-amber-900/10 pb-6 pr-20">
                    <span className="font-serif text-xs uppercase tracking-widest text-amber-800/60 block mb-1">
                      {profile?.birthday_date || "Special Birthday Edition"}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
                      Dearest {profile?.person_name || "Special One"},
                    </h3>
                  </div>

                  {/* Letter Body */}
                  <div className="font-serif text-neutral-800 text-base sm:text-lg leading-relaxed sm:leading-loose whitespace-pre-line space-y-4 font-normal">
                    {profile?.letter_content || (
                      "On your special day, I just want to remind you how amazing you are. May every dream you carry become a beautiful reality. Keep smiling, keep shining, and never stop being the wonderful person you are.\n\nYou bring a rare warmth and brightness to everyone around you. Having you in this world makes everything so much better, happier, and more colorful. May this upcoming year unfold with boundless laughter, cozy moments, great achievements, and peace in your heart."
                    )}
                  </div>

                  {/* Letter Signature */}
                  <div className="mt-10 pt-6 border-t border-amber-900/10 flex flex-col items-end">
                    <span className="text-xs uppercase tracking-wider text-neutral-500 font-sans mb-1">
                      Forever & Always,
                    </span>
                    <span className="font-cursive text-3xl sm:text-4xl text-rose-700 font-bold">
                      {profile?.letter_signature || "With all my love and warmest hugs ❤️"}
                    </span>
                  </div>

                  {/* Fold back up button */}
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-xs text-neutral-500 hover:text-neutral-800 underline font-sans"
                    >
                      Fold letter back up
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
