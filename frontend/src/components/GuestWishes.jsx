import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Heart, Send, Sparkles, User } from 'lucide-react';
import { api } from '../services/api';

export default function GuestWishes({ messages = [], onMessageAdded }) {
  const [formOpen, setFormOpen] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [relationship, setRelationship] = useState('Friend');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!senderName.trim() || !message.trim()) return;

    setLoading(true);
    try {
      const colors = [
        'from-pink-500 to-rose-500',
        'from-purple-500 to-indigo-500',
        'from-amber-400 to-orange-500',
        'from-emerald-400 to-teal-500',
        'from-fuchsia-500 to-pink-500'
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const newMsg = await api.postMessage({
        sender_name: senderName,
        relationship,
        message,
        avatar_color: randomColor
      });

      onMessageAdded(newMsg);
      setSenderName('');
      setMessage('');
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFormOpen(false);
      }, 1500);
    } catch (err) {
      alert(err.message || 'Failed to submit birthday wish');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="wishes" className="py-24 px-4 relative z-10">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-pink-400/30 text-pink-300 text-xs font-semibold mb-4">
            <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
            <span>Community of Love</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-300 via-purple-200 to-rose-200 bg-clip-text text-transparent">
            Heartfelt Birthday Wishes
          </h2>
          <p className="text-purple-200/70 text-base sm:text-lg max-w-xl mx-auto mt-3">
            Words of cheer, warm hugs, and pure joy sent by friends and loved ones.
          </p>

          <button
            onClick={() => setFormOpen(!formOpen)}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-pink-500/25 hover:scale-105 transition-transform"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>{formOpen ? "Close Wish Form" : "Leave a Birthday Wish"}</span>
          </button>
        </div>

        {/* Leave a Wish Form Accordion */}
        <AnimatePresence>
          {formOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-xl mx-auto mb-16 overflow-hidden"
            >
              <form
                onSubmit={handleSubmit}
                className="glass-card p-6 sm:p-8 rounded-3xl border border-pink-400/30 shadow-2xl relative"
              >
                <h3 className="font-serif text-2xl font-bold text-white mb-4">
                  Send Your Warmest Blessing
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-purple-200/80 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-pink-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-purple-200/80 mb-1">Relationship</label>
                    <select
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#1D0C33] border border-white/20 text-white text-sm focus:outline-none focus:border-pink-400"
                    >
                      <option value="Best Friend">Best Friend</option>
                      <option value="Friend">Friend</option>
                      <option value="Family">Family</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Partner">Partner</option>
                      <option value="Well Wisher">Well Wisher</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs text-purple-200/80 mb-1">Your Birthday Message</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Write a sweet, unforgettable message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-pink-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || success}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
                >
                  {success ? (
                    <>
                      <Sparkles className="w-4 h-4 text-yellow-300" />
                      <span>Wish Posted Beautifully!</span>
                    </>
                  ) : loading ? (
                    <span>Posting your wish...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Publish Birthday Wish</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wishes Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {messages.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (index % 6) * 0.1 }}
              className="glass-card p-6 rounded-3xl border border-white/10 hover:border-pink-400/30 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                {/* Author row */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${item.avatar_color || 'from-pink-500 to-rose-400'} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                    {item.sender_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-white text-base">
                      {item.sender_name}
                    </h4>
                    <span className="text-xs text-pink-300/80 font-sans">
                      {item.relationship}
                    </span>
                  </div>
                </div>

                {/* Message body */}
                <p className="text-purple-100/90 text-sm sm:text-base leading-relaxed italic">
                  "{item.message}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
                <span>With Love</span>
                <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400/40" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
