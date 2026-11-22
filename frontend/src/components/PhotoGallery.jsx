import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, ChevronLeft, ChevronRight, X, ZoomIn, Star, Sparkles, Heart } from 'lucide-react';

export default function PhotoGallery({ photos = [] }) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === 'ArrowRight') {
        setSelectedPhotoIndex((prev) => (prev + 1) % photos.length);
      } else if (e.key === 'ArrowLeft') {
        setSelectedPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
      } else if (e.key === 'Escape') {
        setSelectedPhotoIndex(null);
        setIsZoomed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, photos.length]);

  const activePhoto = selectedPhotoIndex !== null ? photos[selectedPhotoIndex] : null;

  return (
    <section id="gallery" className="py-24 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-pink-400/30 text-pink-300 text-xs font-semibold mb-4">
            <Camera className="w-3.5 h-3.5 text-pink-400" />
            <span>Captured With Love</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text text-transparent">
            Selected Memories & Smiles
          </h2>
          <p className="text-purple-200/70 text-base sm:text-lg max-w-xl mx-auto mt-3">
            Every snapshot holds a story, a laugh, and a piece of your golden journey.
          </p>
        </div>

        {/* Polaroid Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {photos.map((photo, index) => {
            // Subtle random tilt angle for polaroid aesthetic
            const tilts = [-2, 1.5, -1, 2, -1.8, 1.2];
            const tilt = tilts[index % tilts.length];

            return (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, rotate: 0, zIndex: 20 }}
                style={{ transform: `rotate(${tilt}deg)` }}
                onClick={() => setSelectedPhotoIndex(index)}
                className="group cursor-pointer relative bg-gradient-to-b from-[#FFFDF9] to-[#F7F3E9] p-4 sm:p-5 rounded-2xl polaroid-shadow transition-all duration-300 border border-white/60"
              >
                {/* Washi tape graphic on top */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-pink-200/70 backdrop-blur-sm border-t border-b border-white/40 shadow-sm rotate-1 z-10" />

                {/* Featured Badge */}
                {photo.is_featured && (
                  <div className="absolute top-6 right-6 z-10 flex items-center gap-1 bg-amber-400 text-purple-950 font-bold text-[10px] uppercase px-2.5 py-1 rounded-full shadow-md">
                    <Star className="w-3 h-3 fill-purple-950" />
                    <span>Featured</span>
                  </div>
                )}

                {/* Photo container */}
                <div className="aspect-square w-full rounded-xl overflow-hidden bg-neutral-900 relative shadow-inner">
                  <img
                    src={photo.file_path}
                    alt={photo.caption || "Birthday Memory"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      if (!e.target.dataset.tried) {
                        e.target.dataset.tried = "true";
                        e.target.src = '/uploads/photos/photo_1.jpg';
                      }
                    }}
                  />
                  {/* Subtle dark vignette on hover */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white shadow-lg">
                      <ZoomIn className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Polaroid Caption bottom */}
                <div className="pt-4 pb-2 text-center">
                  <p className="font-serif italic text-neutral-800 text-sm sm:text-base font-medium line-clamp-2 px-1">
                    {photo.caption || "Unforgettable moment ✨"}
                  </p>
                  <div className="mt-1 flex items-center justify-center gap-1 text-[11px] text-neutral-500 font-sans">
                    <Heart className="w-3 h-3 text-pink-400 fill-pink-400/40" />
                    <span>Cherished Memory</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty state if no photos */}
        {photos.length === 0 && (
          <div className="text-center py-16 p-8 glass-card rounded-3xl max-w-md mx-auto">
            <Camera className="w-12 h-12 text-pink-400 mx-auto mb-3 opacity-60" />
            <p className="text-purple-200">No photographs added yet.</p>
            <p className="text-xs text-purple-300/60 mt-1">Upload photographs in the Admin Dashboard!</p>
          </div>
        )}
      </div>

        {/* Lightbox Modal */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8"
            onClick={() => {
              setSelectedPhotoIndex(null);
              setIsZoomed(false);
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setSelectedPhotoIndex(null);
                setIsZoomed(false);
              }}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-50"
              title="Close (Esc)"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Previous Navigation Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
                setIsZoomed(false);
              }}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all z-50 backdrop-blur-md"
              title="Previous Photo (Left Arrow)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Navigation Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPhotoIndex((prev) => (prev + 1) % photos.length);
                setIsZoomed(false);
              }}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all z-50 backdrop-blur-md"
              title="Next Photo (Right Arrow)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Main Lightbox Content */}
            <div
              className="relative max-w-4xl max-h-[85vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                key={activePhoto.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-3 sm:p-4 rounded-2xl shadow-2xl flex flex-col items-center max-h-[80vh]"
              >
                <div
                  className={`overflow-hidden rounded-xl cursor-zoom-in transition-transform duration-300 ${
                    isZoomed ? 'scale-125 cursor-zoom-out' : ''
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                >
                  <img
                    src={activePhoto.file_path}
                    alt={activePhoto.caption || "Birthday Memory"}
                    className="max-h-[60vh] max-w-[85vw] object-contain rounded-lg"
                    onError={(e) => {
                      if (!e.target.dataset.tried) {
                        e.target.dataset.tried = "true";
                        e.target.src = '/uploads/photos/photo_1.jpg';
                      }
                    }}
                  />
                </div>

                {/* Caption Bar */}
                <div className="mt-3 text-center px-4 max-w-lg">
                  <p className="font-serif italic text-neutral-800 text-base sm:text-lg font-semibold">
                    {activePhoto.caption || "A beautiful memory"}
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Photo {selectedPhotoIndex + 1} of {photos.length}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
