import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Music, Disc3, ListMusic } from 'lucide-react';

export default function MusicPlayer({ activeTrack, tracks = [], autoPlayTrigger }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showTrackList, setShowTrackList] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [hasError, setHasError] = useState(false);

  // Load custom audio from localStorage or activeTrack
  const syncActiveTrack = () => {
    try {
      const saved = localStorage.getItem('custom_birthday_audio');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.file_path) {
          setCurrentTrack(parsed);
          return;
        }
      }
    } catch (e) {
      console.warn("Could not parse saved custom audio", e);
    }

    if (activeTrack) {
      setCurrentTrack(activeTrack);
    } else {
      setCurrentTrack({
        id: 'default',
        title: 'Joyful Music Box - Happy Birthday',
        file_path: '/uploads/music/birthday_melody.wav',
        duration: '1:15'
      });
    }
  };

  useEffect(() => {
    syncActiveTrack();
  }, [activeTrack]);

  // Listen for real-time audio update events from Admin Studio
  useEffect(() => {
    const handleAudioUpdate = (e) => {
      if (e.detail) {
        setCurrentTrack(e.detail);
        setIsPlaying(true);
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.load();
            audioRef.current.play().catch(() => {});
          }
        }, 150);
      } else {
        syncActiveTrack();
      }
    };
    window.addEventListener('custom-audio-updated', handleAudioUpdate);
    return () => window.removeEventListener('custom-audio-updated', handleAudioUpdate);
  }, []);

  const audioSrc = currentTrack?.file_path || '/uploads/music/birthday_melody.wav';

  // Whenever audioSrc changes, explicitly reload audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.log("Audio play interrupted:", err);
        });
      }
    }
    setHasError(false);
  }, [audioSrc]);

  // When autoPlayTrigger changes (e.g. user clicked "Open Your Surprise"), trigger play
  useEffect(() => {
    if (autoPlayTrigger && audioRef.current && !isPlaying) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.log("Audio autoplay prevented by browser:", e);
      });
    }
  }, [autoPlayTrigger]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error("Playback error:", err);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioRef.current.muted = nextMuted;
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const selectTrack = (track) => {
    setCurrentTrack(track);
    try {
      localStorage.setItem('custom_birthday_audio', JSON.stringify(track));
    } catch {}
    setShowTrackList(false);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }, 100);
  };

  const handleAudioError = (e) => {
    console.warn("Audio failed to load from:", audioSrc, e);
    setHasError(true);
    // If custom audio fails to load, gracefully fallback to default melody
    if (audioSrc !== '/uploads/music/birthday_melody.wav') {
      setCurrentTrack({
        id: 'default',
        title: 'Joyful Music Box (Fallback)',
        file_path: '/uploads/music/birthday_melody.wav',
        duration: '1:15'
      });
    }
  };

  return (
    <>
      <audio
        key={audioSrc}
        ref={audioRef}
        src={audioSrc}
        loop
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onError={handleAudioError}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Floating Dock Music Player */}
      <div className="fixed bottom-4 right-4 sm:right-6 z-40 max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-pink-400/30 shadow-2xl backdrop-blur-2xl flex items-center gap-3 sm:gap-4"
        >
          {/* Animated Vinyl Icon */}
          <div
            onClick={togglePlay}
            className="cursor-pointer relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-lg group flex-shrink-0"
          >
            <Disc3
              className={`w-6 h-6 sm:w-7 sm:h-7 text-white transition-transform ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '3.5s' }}
            />
            {/* Play/Pause overlay */}
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
              )}
            </div>
          </div>

          {/* Track Details & Controls */}
          <div className="flex-1 min-w-[130px] sm:min-w-[170px]">
            <div className="flex items-center justify-between">
              <div className="truncate">
                <span className="text-xs font-bold text-white block truncate">
                  {currentTrack?.title || "Happy Birthday Melody"}
                </span>
                <span className="text-[10px] text-pink-300 block">
                  {hasError ? 'Using fallback melody' : isPlaying ? 'Playing joyful melody 🎶' : 'Paused (Click to play)'}
                </span>
              </div>

              {/* Visualizer bars */}
              {isPlaying && (
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-1 bg-pink-400 rounded-full animate-bounce h-2" style={{ animationDuration: '0.4s' }} />
                  <span className="w-1 bg-purple-400 rounded-full animate-bounce h-3" style={{ animationDuration: '0.6s' }} />
                  <span className="w-1 bg-amber-400 rounded-full animate-bounce h-1.5" style={{ animationDuration: '0.5s' }} />
                  <span className="w-1 bg-pink-300 rounded-full animate-bounce h-3" style={{ animationDuration: '0.7s' }} />
                </div>
              )}
            </div>

            {/* Time progress bar */}
            <div className="flex items-center gap-2 mt-1.5">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-pink-400"
              />
              <span className="text-[9px] text-white/50 font-mono w-7 text-right">
                {formatTime(currentTime)}
              </span>
            </div>
          </div>

          {/* Volume & Playlist controls */}
          <div className="flex items-center gap-1.5 border-l border-white/10 pl-2">
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-pink-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            {tracks.length > 0 && (
              <button
                onClick={() => setShowTrackList(!showTrackList)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                title="Song List"
              >
                <ListMusic className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Playlist Popup */}
        <AnimatePresence>
          {showTrackList && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-20 right-0 w-64 glass-card p-3 rounded-2xl border border-white/20 shadow-2xl"
            >
              <h5 className="text-xs font-bold text-pink-300 uppercase tracking-wider mb-2 px-1">
                Celebration Tracks
              </h5>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {tracks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => selectTrack(t)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      currentTrack?.id === t.id || currentTrack?.file_path === t.file_path
                        ? 'bg-pink-500/30 text-white font-semibold'
                        : 'text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <span className="truncate">{t.title}</span>
                    <span className="text-[10px] text-white/40">{t.duration}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
