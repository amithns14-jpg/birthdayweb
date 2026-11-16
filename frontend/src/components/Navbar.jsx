import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Camera, Clock, Mail, Gift, MessageSquare, Lock, Menu, X } from 'lucide-react';

export default function Navbar({ onOpenAdmin, currentSection, onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'welcome', label: 'Welcome', icon: Sparkles },
    { id: 'hero', label: 'Make a Wish', icon: Heart },
    { id: 'gallery', label: 'Moments', icon: Camera },
    { id: 'memories', label: 'Timeline', icon: Clock },
    { id: 'letter', label: 'Letter', icon: Mail },
    { id: 'surprises', label: 'Surprises', icon: Gift },
    { id: 'wishes', label: 'Wishes', icon: MessageSquare },
  ];

  const handleNavClick = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 w-[95%] max-w-5xl ${
          scrolled
            ? 'bg-black/60 backdrop-blur-xl border border-white/15 shadow-2xl py-2.5 px-4 rounded-full'
            : 'bg-white/5 backdrop-blur-md border border-white/10 py-3 px-5 rounded-full'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo / Brand */}
          <button
            onClick={() => handleNavClick('welcome')}
            className="flex items-center gap-2 text-left group"
          >
            <span className="text-2xl animate-bounce">🎂</span>
            <span className="font-serif italic font-bold text-lg bg-gradient-to-r from-pink-300 via-purple-300 to-amber-200 bg-clip-text text-transparent group-hover:opacity-90">
              Celebration
            </span>
          </button>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-500/80 to-purple-500/80 text-white shadow-md shadow-pink-500/20'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action: Admin Dashboard Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-pink-500/20 hover:border-pink-400/40 border border-white/15 text-pink-300 transition-all group shadow-sm"
              title="Admin Dashboard"
            >
              <Lock className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform text-pink-400" />
              <span className="hidden sm:inline">Admin</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-4 right-4 z-40 bg-[#170B26]/95 backdrop-blur-2xl border border-white/20 rounded-2xl p-4 shadow-2xl md:hidden"
          >
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25'
                        : 'bg-white/5 text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-pink-300" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full mt-3 flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-semibold bg-pink-500/20 border border-pink-400/30 text-pink-300 hover:bg-pink-500/30 transition-all"
            >
              <Lock className="w-4 h-4" />
              <span>Open Admin Dashboard</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
