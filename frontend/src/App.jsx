import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BackgroundEffects from './components/BackgroundEffects';
import WelcomeScreen from './components/WelcomeScreen';
import HeroCakeSection from './components/HeroCakeSection';
import PhotoGallery from './components/PhotoGallery';
import MemoriesTimeline from './components/MemoriesTimeline';
import BirthdayLetter from './components/BirthdayLetter';
import SurpriseSection from './components/SurpriseSection';
import GuestWishes from './components/GuestWishes';
import FinalCelebration from './components/FinalCelebration';
import MusicPlayer from './components/MusicPlayer';
import AdminDashboard from './components/AdminDashboard';
import { api } from './services/api';
import confetti from 'canvas-confetti';
import {
  DEFAULT_PROFILE,
  DEFAULT_PHOTOS,
  DEFAULT_MEMORIES,
  DEFAULT_SURPRISES,
  DEFAULT_MESSAGES
} from './data/defaultData';

export default function App() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [photos, setPhotos] = useState(DEFAULT_PHOTOS);
  const [memories, setMemories] = useState(DEFAULT_MEMORIES);
  const [surprises, setSurprises] = useState(DEFAULT_SURPRISES);
  const [messages, setMessages] = useState(DEFAULT_MESSAGES);
  const [tracks, setTracks] = useState([]);
  const [activeTrack, setActiveTrack] = useState(null);

  const [loading, setLoading] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('welcome');
  const [musicAutoPlayTrigger, setMusicAutoPlayTrigger] = useState(false);

  // Load all initial data from backend API
  const loadData = async () => {
    try {
      const [profileData, photosData, memoriesData, surprisesData, messagesData, tracksData] = await Promise.allSettled([
        api.getProfile(),
        api.getPhotos(),
        api.getMemories(),
        api.getSurprises(),
        api.getMessages(),
        api.getMusicTracks(),
      ]);

      if (profileData.status === 'fulfilled') setProfile(profileData.value);
      if (photosData.status === 'fulfilled') setPhotos(photosData.value);
      if (memoriesData.status === 'fulfilled') setMemories(memoriesData.value);
      if (surprisesData.status === 'fulfilled') setSurprises(surprisesData.value);
      if (messagesData.status === 'fulfilled') setMessages(messagesData.value);
      if (tracksData.status === 'fulfilled') {
        setTracks(tracksData.value);
        const active = tracksData.value.find((t) => t.is_active) || tracksData.value[0];
        setActiveTrack(active);
      }
    } catch (err) {
      console.error('Error fetching celebration data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Smooth navigation handler
  const handleNavigate = (sectionId) => {
    setCurrentSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Triggered when visitor clicks "Open Your Surprise" on Welcome screen
  const handleOpenSurprise = () => {
    // Start music playback safely after user gesture
    setMusicAutoPlayTrigger(true);

    // Scroll to hero section
    handleNavigate('hero');
  };

  // Replay celebration from final screen
  const handleReplay = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMessageAdded = (newMsg) => {
    setMessages((prev) => [newMsg, ...prev]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0714] flex flex-col items-center justify-center text-white">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-pink-500/30 border-t-pink-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-xl">🎂</div>
        </div>
        <p className="mt-4 font-serif text-pink-300 text-lg animate-pulse">
          Crafting your magical birthday celebration...
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0D0714] text-white selection:bg-pink-500 selection:text-white">
      {/* Dynamic Background: Balloons, Hearts, Sparkling Stars, Ambient Gradients */}
      <BackgroundEffects />

      {/* Floating Navigation Dock */}
      <Navbar
        onOpenAdmin={() => setAdminOpen(true)}
        currentSection={currentSection}
        onNavigate={handleNavigate}
      />

      {/* Main Pages & Modules */}
      <main className="relative z-10">
        {/* PAGE 1: Welcome Screen */}
        <WelcomeScreen
          profile={profile}
          onOpenSurprise={handleOpenSurprise}
        />

        {/* PAGE 2: Birthday Hero Section & Interactive Cake */}
        <HeroCakeSection
          profile={profile}
        />

        {/* PAGE 3: Selected Photo Gallery (Polaroid Cards & Lightbox) */}
        <PhotoGallery
          photos={photos}
        />

        {/* PAGE 4: Beautiful Memories Timeline */}
        <MemoriesTimeline
          memories={memories}
        />

        {/* PAGE 5: Personalized Birthday Letter (Wax Seal / Unfolding) */}
        <BirthdayLetter
          profile={profile}
        />

        {/* PAGE 6: Surprise Experience (Interactive 3D Gift Box) */}
        <SurpriseSection
          surprises={surprises}
        />

        {/* Guestbook Birthday Wishes */}
        <GuestWishes
          messages={messages}
          onMessageAdded={handleMessageAdded}
        />

        {/* PAGE 8: Final Celebration (Fireworks, Confetti, Cake, Replay) */}
        <FinalCelebration
          profile={profile}
          onReplay={handleReplay}
        />
      </main>

      {/* PAGE 7: Persistent Floating Birthday Music Player */}
      <MusicPlayer
        activeTrack={activeTrack}
        tracks={tracks}
        autoPlayTrigger={musicAutoPlayTrigger}
      />

      {/* Admin Management Dashboard Studio */}
      <AdminDashboard
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        onRefreshData={loadData}
        profile={profile}
        photos={photos}
        memories={memories}
        surprises={surprises}
        tracks={tracks}
      />
    </div>
  );
}
