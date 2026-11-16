import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function BackgroundEffects() {
  // Generate random positions for stars
  const stars = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2
    }));
  }, []);

  // Floating balloons
  const balloons = useMemo(() => {
    const colors = [
      'from-pink-500/30 to-rose-400/20',
      'from-purple-500/30 to-indigo-400/20',
      'from-amber-400/30 to-yellow-300/20',
      'from-rose-400/30 to-pink-300/20',
      'from-fuchsia-500/30 to-pink-400/20'
    ];
    return Array.from({ length: 9 }).map((_, i) => ({
      id: i,
      left: 5 + i * 11,
      size: 40 + (i % 3) * 15,
      color: colors[i % colors.length],
      duration: 18 + (i % 5) * 4,
      delay: i * 2.5
    }));
  }, []);

  // Drifting hearts
  const hearts = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      left: Math.random() * 95,
      duration: 14 + Math.random() * 10,
      delay: Math.random() * 12,
      size: 14 + Math.random() * 14,
      opacity: 0.15 + Math.random() * 0.25
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Ambient gradient meshes */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px]" />
      <div className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] bg-pink-600/15 rounded-full blur-[140px]" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[130px]" />

      {/* Twinkling Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{
            opacity: [0.1, 0.9, 0.1],
            scale: [0.8, 1.25, 0.8],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Floating gentle balloons */}
      {balloons.map((b) => (
        <motion.div
          key={b.id}
          className="absolute"
          style={{
            left: `${b.left}%`,
            bottom: '-120px',
            width: `${b.size}px`,
            height: `${b.size * 1.25}px`,
          }}
          animate={{
            y: ['0vh', '-120vh'],
            x: [0, Math.sin(b.id) * 35, 0],
            rotate: [-6, 6, -6],
          }}
          transition={{
            y: { duration: b.duration, repeat: Infinity, delay: b.delay, ease: "linear" },
            x: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <div className={`w-full h-full rounded-[50%_50%_50%_50%_/_40%_40%_60%_60%] bg-gradient-to-t ${b.color} backdrop-blur-sm border border-white/20 shadow-lg relative`}>
            {/* Balloon knot and string */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white/40 rounded-full" />
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[1px] h-8 bg-white/20" />
            {/* Balloon light reflection */}
            <div className="absolute top-2 left-2 w-2 h-4 bg-white/30 rounded-full -rotate-45" />
          </div>
        </motion.div>
      ))}

      {/* Drifting soft hearts */}
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute text-pink-400"
          style={{
            left: `${h.left}%`,
            bottom: '-50px',
            fontSize: `${h.size}px`,
            opacity: h.opacity
          }}
          animate={{
            y: ['0vh', '-110vh'],
            x: [0, (h.id % 2 === 0 ? 30 : -30), 0],
            rotate: [0, 20, -20, 0]
          }}
          transition={{
            y: { duration: h.duration, repeat: Infinity, delay: h.delay, ease: "linear" },
            x: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          ♥
        </motion.div>
      ))}
    </div>
  );
}
