import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, Sparkles, Heart } from 'lucide-react';

export default function MemoriesTimeline({ memories = [] }) {
  return (
    <section id="memories" className="py-24 px-4 relative z-10">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-purple-400/30 text-purple-300 text-xs font-semibold mb-4">
            <Clock className="w-3.5 h-3.5 text-purple-300" />
            <span>Our Unforgettable Journey</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-300 via-pink-200 to-amber-200 bg-clip-text text-transparent">
            Beautiful Memories Timeline
          </h2>
          <p className="text-purple-200/70 text-base sm:text-lg max-w-xl mx-auto mt-3">
            Moments frozen in time, laughter echoed through years, and memories treasured forever.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Central Glowing Line */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-0.5 bg-gradient-to-b from-pink-500/50 via-purple-500/50 to-amber-400/40 shadow-[0_0_12px_rgba(244,114,182,0.4)]" />

          {/* Timeline Items */}
          <div className="space-y-12 sm:space-y-16">
            {memories.map((memory, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={memory.id}
                  className={`relative flex flex-col md:flex-row items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Center Node */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#170B26] border-2 border-pink-400 items-center justify-center shadow-lg shadow-pink-500/30 z-20">
                    <Heart className="w-4 h-4 text-pink-400 fill-pink-400/30 animate-pulse" />
                  </div>

                  {/* Content Card (Left or Right) */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.7, delay: index * 0.15 }}
                    className="w-full md:w-[45%] glass-card p-6 sm:p-7 rounded-3xl border border-white/15 hover:border-pink-400/40 transition-all duration-300 group shadow-xl hover:shadow-pink-500/10"
                  >
                    {/* Optional Memory Image */}
                    {memory.image_path && (
                      <div className="w-full h-48 sm:h-56 rounded-2xl overflow-hidden mb-5 bg-black/40 relative">
                        <img
                          src={memory.image_path}
                          alt={memory.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </div>
                    )}

                    {/* Date Badge */}
                    {memory.date_str && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-semibold mb-3 border border-pink-400/30">
                        <Calendar className="w-3 h-3 text-pink-400" />
                        <span>{memory.date_str}</span>
                      </div>
                    )}

                    {/* Memory Title */}
                    <h3 className="font-serif text-2xl font-bold text-white group-hover:text-pink-300 transition-colors mb-3">
                      {memory.title}
                    </h3>

                    {/* Description */}
                    <p className="text-purple-200/80 text-sm sm:text-base leading-relaxed font-light">
                      {memory.description}
                    </p>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {memories.length === 0 && (
            <div className="text-center py-16 p-8 glass-card rounded-3xl max-w-md mx-auto">
              <Sparkles className="w-10 h-10 text-purple-400 mx-auto mb-3 opacity-60" />
              <p className="text-purple-200">No timeline memories added yet.</p>
              <p className="text-xs text-purple-300/60 mt-1">Add special milestones in the Admin Dashboard!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
