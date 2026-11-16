import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, X, LogOut, Save, Upload, Trash2, Edit3, Image,
  Clock, Mail, Gift, Music, Star, ArrowUp, ArrowDown, Check,
  KeyRound, Eye, Plus, Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import DEFAULT_AUDIO_CONFIG from '../config/audioConfig';
import { saveCustomAudioTrack, clearCustomAudioTrack } from '../utils/audioStorage';

export default function AdminDashboard({ isOpen, onClose, onRefreshData, profile, photos, memories, surprises, tracks }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Login form state
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Profile edit state
  const [profileForm, setProfileForm] = useState({});
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Photo management state
  const [selectedUploadFiles, setSelectedUploadFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [uploadCaptions, setUploadCaptions] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [editingPhotoId, setEditingPhotoId] = useState(null);
  const [editPhotoCaption, setEditPhotoCaption] = useState('');

  // Memory form state
  const [memoryForm, setMemoryForm] = useState({ title: '', date_str: '', description: '' });
  const [memoryFile, setMemoryFile] = useState(null);
  const [memoryLoading, setMemoryLoading] = useState(false);
  const [editingMemoryId, setEditingMemoryId] = useState(null);

  // Surprise form state
  const [surpriseForm, setSurpriseForm] = useState({ title: '', preview_hint: '', secret_content: '', badge: 'Surprise' });
  const [surpriseLoading, setSurpriseLoading] = useState(false);

  // Music state
  const [musicSourceType, setMusicSourceType] = useState('file'); // 'file' | 'url'
  const [musicTitle, setMusicTitle] = useState('');
  const [musicFile, setMusicFile] = useState(null);
  const [musicUrl, setMusicUrl] = useState('');
  const [musicPreviewUrl, setMusicPreviewUrl] = useState('');
  const [musicLoading, setMusicLoading] = useState(false);
  const [musicSuccessMsg, setMusicSuccessMsg] = useState('');

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  // Check auth on open
  useEffect(() => {
    if (isOpen) {
      api.verifyAuth().then((valid) => {
        setIsAuthenticated(valid);
      });
      if (profile) {
        setProfileForm(profile);
      }
    }
  }, [isOpen, profile]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      await api.login(username, password);
      setIsAuthenticated(true);
      setPassword('');
    } catch (err) {
      setLoginError(err.message || 'Login failed. Check your password.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    setIsAuthenticated(false);
  };

  // Profile Save
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      await api.updateProfile(profileForm);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
      onRefreshData();
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  // Photo Selection
  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedUploadFiles(files);
    setUploadCaptions(files.map(() => ''));

    const previews = files.map((file) => URL.createObjectURL(file));
    setFilePreviews(previews);
  };

  const handleUploadPhotos = async (e) => {
    e.preventDefault();
    if (!selectedUploadFiles.length) return;

    setUploadLoading(true);
    try {
      const formData = new FormData();
      selectedUploadFiles.forEach((file) => formData.append('files', file));
      uploadCaptions.forEach((cap) => formData.append('captions', cap));

      await api.uploadPhotos(formData);
      setSelectedUploadFiles([]);
      setFilePreviews([]);
      setUploadCaptions([]);
      onRefreshData();
    } catch (err) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeletePhoto = async (id) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;
    try {
      await api.deletePhoto(id);
      onRefreshData();
    } catch (err) {
      alert(err.message || 'Failed to delete photo');
    }
  };

  const handleToggleFeatured = async (photo) => {
    try {
      await api.updatePhoto(photo.id, { is_featured: !photo.is_featured });
      onRefreshData();
    } catch (err) {
      alert(err.message || 'Failed to update photo');
    }
  };

  const handleSavePhotoCaption = async (id) => {
    try {
      await api.updatePhoto(id, { caption: editPhotoCaption });
      setEditingPhotoId(null);
      onRefreshData();
    } catch (err) {
      alert(err.message || 'Failed to update caption');
    }
  };

  const handleMovePhoto = async (index, direction) => {
    const newPhotos = [...photos];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newPhotos.length) return;

    const temp = newPhotos[index];
    newPhotos[index] = newPhotos[targetIndex];
    newPhotos[targetIndex] = temp;

    const items = newPhotos.map((p, idx) => ({ id: p.id, order_index: idx + 1 }));
    try {
      await api.reorderPhotos(items);
      onRefreshData();
    } catch (err) {
      alert(err.message || 'Reorder failed');
    }
  };

  // Memory management
  const handleSaveMemory = async (e) => {
    e.preventDefault();
    setMemoryLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', memoryForm.title);
      formData.append('date_str', memoryForm.date_str || '');
      formData.append('description', memoryForm.description);
      if (memoryFile) {
        formData.append('image', memoryFile);
      }

      if (editingMemoryId) {
        await api.updateMemory(editingMemoryId, formData);
        setEditingMemoryId(null);
      } else {
        await api.createMemory(formData);
      }
      setMemoryForm({ title: '', date_str: '', description: '' });
      setMemoryFile(null);
      onRefreshData();
    } catch (err) {
      alert(err.message || 'Failed to save memory');
    } finally {
      setMemoryLoading(false);
    }
  };

  const handleDeleteMemory = async (id) => {
    if (!confirm('Delete this memory timeline item?')) return;
    try {
      await api.deleteMemory(id);
      onRefreshData();
    } catch (err) {
      alert(err.message || 'Failed to delete memory');
    }
  };

  // Surprise management
  const handleSaveSurprise = async (e) => {
    e.preventDefault();
    setSurpriseLoading(true);
    try {
      await api.createSurprise(surpriseForm);
      setSurpriseForm({ title: '', preview_hint: '', secret_content: '', badge: 'Surprise' });
      onRefreshData();
    } catch (err) {
      alert(err.message || 'Failed to create surprise');
    } finally {
      setSurpriseLoading(false);
    }
  };

  const handleDeleteSurprise = async (id) => {
    if (!confirm('Delete this surprise?')) return;
    try {
      await api.deleteSurprise(id);
      onRefreshData();
    } catch (err) {
      alert(err.message || 'Failed to delete surprise');
    }
  };

  // Music management
  const handleMusicFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMusicFile(file);
      if (!musicTitle) {
        const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setMusicTitle(baseName.charAt(0).toUpperCase() + baseName.slice(1));
      }
      try {
        const preview = URL.createObjectURL(file);
        setMusicPreviewUrl(preview);
      } catch (err) {
        console.warn("Could not create object URL", err);
      }
    }
  };

  const handleApplyMusic = async (e) => {
    e.preventDefault();
    setMusicLoading(true);
    setMusicSuccessMsg('');

    try {
      const chosenTitle = musicTitle.trim() || 'Custom Birthday Melody';
      let appliedPath = '';

      if (musicSourceType === 'file') {
        if (!musicFile) {
          alert('Please select an audio file first.');
          setMusicLoading(false);
          return;
        }

        // Try backend upload if backend is accessible
        try {
          const formData = new FormData();
          formData.append('title', chosenTitle);
          formData.append('file', musicFile);
          formData.append('set_active', 'true');
          const res = await api.uploadMusic(formData);
          appliedPath = res.file_path;
        } catch (apiErr) {
          console.warn('Backend music upload failed, using local browser audio', apiErr);
          appliedPath = musicPreviewUrl || URL.createObjectURL(musicFile);
        }

        const playableUrl = musicPreviewUrl || (appliedPath && appliedPath.startsWith('blob:') ? appliedPath : URL.createObjectURL(musicFile));

        const trackObj = {
          id: 'custom-' + Date.now(),
          title: chosenTitle,
          file_path: playableUrl,
          duration: 'Custom',
          is_active: true
        };

        // Save into IndexedDB (supports any file size without 5MB quota errors)
        await saveCustomAudioTrack(trackObj, musicFile);

        // Safe localStorage update (non-blocking, won't throw QuotaExceeded error)
        try {
          localStorage.setItem('custom_birthday_audio', JSON.stringify({
            id: trackObj.id,
            title: trackObj.title,
            file_path: appliedPath,
            duration: trackObj.duration,
            is_active: true
          }));
        } catch (e) {
          console.warn('localStorage quota reached, IndexedDB used', e);
        }

        window.dispatchEvent(new CustomEvent('custom-audio-updated', { detail: trackObj }));
      } else {
        // Direct URL
        if (!musicUrl.trim()) {
          alert('Please enter a valid audio URL.');
          setMusicLoading(false);
          return;
        }

        try {
          await api.setMusicUrl(chosenTitle, musicUrl.trim());
        } catch (err) {
          console.warn('Backend set-url warning:', err);
        }

        const trackObj = {
          id: 'url-' + Date.now(),
          title: chosenTitle,
          file_path: musicUrl.trim(),
          duration: 'Custom',
          is_active: true
        };

        await saveCustomAudioTrack(trackObj, musicUrl.trim());

        try {
          localStorage.setItem('custom_birthday_audio', JSON.stringify(trackObj));
        } catch (e) {
          // ignore
        }

        window.dispatchEvent(new CustomEvent('custom-audio-updated', { detail: trackObj }));
      }

      setMusicSuccessMsg(`🎉 "${chosenTitle}" applied as the active birthday music!`);
      setTimeout(() => setMusicSuccessMsg(''), 5000);
      onRefreshData();
    } catch (err) {
      alert(err.message || 'Failed to apply audio');
    } finally {
      setMusicLoading(false);
    }
  };

  const handleResetDefaultMusic = async () => {
    await clearCustomAudioTrack();
    const defaultTrack = {
      id: 'default',
      title: DEFAULT_AUDIO_CONFIG.title || 'Happy Birthday Melody',
      file_path: DEFAULT_AUDIO_CONFIG.src || '/audio/birthday_song.mp3',
      duration: DEFAULT_AUDIO_CONFIG.duration || 'Celebration',
      is_active: true
    };
    window.dispatchEvent(new CustomEvent('custom-audio-updated', { detail: defaultTrack }));
    setMusicSuccessMsg('Restored celebration music! 🎶');
    setTimeout(() => setMusicSuccessMsg(''), 4000);
    onRefreshData();
  };

  const handleSetActiveMusic = async (track) => {
    try {
      localStorage.setItem('custom_birthday_audio', JSON.stringify({
        ...track,
        is_active: true
      }));
      window.dispatchEvent(new CustomEvent('custom-audio-updated', { detail: track }));
      if (track.id && typeof track.id === 'number') {
        await api.setActiveTrack(track.id);
      }
      setMusicSuccessMsg(`Switched active track to "${track.title}"!`);
      setTimeout(() => setMusicSuccessMsg(''), 4000);
      onRefreshData();
    } catch (err) {
      alert(err.message || 'Failed to set active track');
    }
  };

  const handleDeleteMusic = async (id) => {
    if (!confirm('Delete this audio track?')) return;
    try {
      await api.deleteMusic(id);
      onRefreshData();
    } catch (err) {
      alert(err.message || 'Failed to delete track');
    }
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await api.changePassword(oldPassword, newPassword);
      setPasswordMsg('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setTimeout(() => setPasswordMsg(''), 3000);
    } catch (err) {
      setPasswordMsg(`Error: ${err.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-4xl bg-[#170B26] border border-white/20 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-400/30">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Admin Studio & Management
              </h3>
              <p className="text-xs text-purple-200/60">
                Personalize every photo, memory, wish, and surprise
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-300 hover:bg-red-500/20 border border-red-400/30 transition-all"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Not Authenticated: Login View */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto w-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-pink-500/20">
              <KeyRound className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-serif text-2xl font-bold text-white mb-2">
              Admin Access
            </h4>
            <p className="text-sm text-purple-200/70 mb-6">
              Enter your admin credentials to customize the celebration website. Default: <code className="bg-white/10 px-1.5 py-0.5 rounded text-pink-300">admin</code> / <code className="bg-white/10 px-1.5 py-0.5 rounded text-pink-300">birthday2025</code>
            </p>

            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-400/30 text-xs text-red-200">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs text-purple-200/80 mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-pink-400"
                />
              </div>

              <div>
                <label className="block text-xs text-purple-200/80 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-pink-400"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-sm shadow-lg shadow-pink-500/25 hover:opacity-90 disabled:opacity-50 transition-all mt-4"
              >
                {loginLoading ? "Authenticating..." : "Unlock Admin Studio"}
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Studio */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="w-full md:w-56 p-3 sm:p-4 border-b md:border-b-0 md:border-r border-white/10 flex md:flex-col gap-1.5 overflow-x-auto bg-black/20">
              {[
                { id: 'profile', label: 'Birthday Profile', icon: Sparkles },
                { id: 'photos', label: 'Photos Gallery', icon: Image },
                { id: 'memories', label: 'Memories Timeline', icon: Clock },
                { id: 'letter', label: 'Heartfelt Letter', icon: Mail },
                { id: 'surprises', label: 'Surprise Items', icon: Gift },
                { id: 'music', label: 'Music Player', icon: Music },
                { id: 'security', label: 'Security & Auth', icon: KeyRound },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-gradient-to-r from-pink-500/80 to-purple-600/80 text-white shadow-md'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-pink-300 flex-shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content Area */}
            <div className="flex-1 p-5 sm:p-8 overflow-y-auto max-h-[75vh]">
              {/* TAB 1: Profile Settings */}
              {activeTab === 'profile' && (
                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <h4 className="font-serif text-xl font-bold text-white">
                      Celebration Profile Details
                    </h4>
                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold shadow-md transition-all"
                    >
                      {profileSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
                      <span>{profileSaved ? "Saved!" : profileSaving ? "Saving..." : "Save Changes"}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-purple-200/80 mb-1">Birthday Person's Name</label>
                      <input
                        type="text"
                        value={profileForm.person_name || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, person_name: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-pink-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-purple-200/80 mb-1">Birthday Date / Milestone</label>
                      <input
                        type="text"
                        value={profileForm.birthday_date || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, birthday_date: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-pink-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-purple-200/80 mb-1">Welcome Headline (Page 1)</label>
                    <input
                      type="text"
                      value={profileForm.welcome_headline || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, welcome_headline: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-pink-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-purple-200/80 mb-1">Hero Subtitle (Page 2)</label>
                    <textarea
                      rows="2"
                      value={profileForm.hero_subtitle || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, hero_subtitle: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-pink-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-purple-200/80 mb-1">Cake Wish Message (When Candles are Blown)</label>
                    <textarea
                      rows="2"
                      value={profileForm.cake_wish_message || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, cake_wish_message: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-pink-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-purple-200/80 mb-1">Closing Headline (Page 8)</label>
                      <input
                        type="text"
                        value={profileForm.closing_headline || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, closing_headline: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-pink-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-purple-200/80 mb-1">Closing Final Message</label>
                      <input
                        type="text"
                        value={profileForm.closing_message || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, closing_message: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-pink-400"
                      />
                    </div>
                  </div>
                </form>
              )}

              {/* TAB 2: Photos Gallery */}
              {activeTab === 'photos' && (
                <div className="space-y-6">
                  <div className="pb-2 border-b border-white/10">
                    <h4 className="font-serif text-xl font-bold text-white mb-1">
                      Manage Selected Photographs
                    </h4>
                    <p className="text-xs text-purple-200/60">
                      Upload actual photos, adjust captions, mark featured, and reorder.
                    </p>
                  </div>

                  {/* Multi-Photo Upload Box */}
                  <form onSubmit={handleUploadPhotos} className="p-5 rounded-2xl glass-card border border-pink-400/30">
                    <label className="block text-xs font-semibold text-pink-300 mb-2">
                      Upload Photographs (JPG, PNG, WEBP)
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePhotoSelect}
                      className="w-full text-xs text-purple-200 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-pink-500/20 file:text-pink-300 hover:file:bg-pink-500/30 cursor-pointer"
                    />

                    {/* Previews before upload */}
                    {filePreviews.length > 0 && (
                      <div className="mt-4 space-y-3">
                        <span className="text-xs text-purple-200/80 font-medium">Add captions before uploading:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                          {filePreviews.map((preview, i) => (
                            <div key={i} className="flex items-center gap-3 p-2 bg-white/5 rounded-xl border border-white/10">
                              <img src={preview} alt="preview" className="w-12 h-12 rounded-lg object-cover" />
                              <input
                                type="text"
                                placeholder="Caption for this photo..."
                                value={uploadCaptions[i] || ''}
                                onChange={(e) => {
                                  const updated = [...uploadCaptions];
                                  updated[i] = e.target.value;
                                  setUploadCaptions(updated);
                                }}
                                className="flex-1 px-2.5 py-1.5 rounded-lg bg-black/40 text-xs text-white border border-white/15 focus:outline-none focus:border-pink-400"
                              />
                            </div>
                          ))}
                        </div>
                        <button
                          type="submit"
                          disabled={uploadLoading}
                          className="mt-2 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-semibold shadow-md hover:opacity-90 disabled:opacity-50"
                        >
                          <Upload className="w-4 h-4" />
                          <span>{uploadLoading ? "Uploading photos..." : `Upload ${selectedUploadFiles.length} Photos`}</span>
                        </button>
                      </div>
                    )}
                  </form>

                  {/* Existing Photos List */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-purple-200 uppercase tracking-wider">
                      Current Gallery Photographs ({photos.length})
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {photos.map((photo, index) => (
                        <div key={photo.id} className="p-3 rounded-2xl glass-card border border-white/10 flex items-center gap-3 group">
                          <img
                            src={photo.file_path}
                            alt={photo.caption}
                            className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                          />

                          <div className="flex-1 min-w-0">
                            {editingPhotoId === photo.id ? (
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  value={editPhotoCaption}
                                  onChange={(e) => setEditPhotoCaption(e.target.value)}
                                  className="w-full px-2 py-1 rounded bg-black/50 text-xs text-white border border-pink-400"
                                />
                                <button
                                  onClick={() => handleSavePhotoCaption(photo.id)}
                                  className="p-1 rounded bg-pink-500 text-white text-xs"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <p className="text-xs text-white font-medium truncate">
                                {photo.caption || "No caption"}
                              </p>
                            )}

                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() => handleToggleFeatured(photo)}
                                className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                  photo.is_featured
                                    ? 'bg-amber-400 text-black font-bold'
                                    : 'bg-white/10 text-white/60 hover:text-white'
                                }`}
                              >
                                <Star className="w-2.5 h-2.5" />
                                <span>{photo.is_featured ? 'Featured' : 'Make Featured'}</span>
                              </button>

                              <button
                                onClick={() => {
                                  setEditingPhotoId(photo.id);
                                  setEditPhotoCaption(photo.caption || '');
                                }}
                                className="text-[10px] text-pink-300 hover:text-pink-200 flex items-center gap-1"
                              >
                                <Edit3 className="w-2.5 h-2.5" />
                                <span>Edit</span>
                              </button>
                            </div>
                          </div>

                          {/* Reorder and Delete */}
                          <div className="flex flex-col gap-1 items-center border-l border-white/10 pl-2">
                            <button
                              onClick={() => handleMovePhoto(index, -1)}
                              disabled={index === 0}
                              className="p-1 text-white/50 hover:text-white disabled:opacity-20"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleMovePhoto(index, 1)}
                              disabled={index === photos.length - 1}
                              className="p-1 text-white/50 hover:text-white disabled:opacity-20"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeletePhoto(photo.id)}
                              className="p-1 text-red-400 hover:text-red-300"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Memories Timeline */}
              {activeTab === 'memories' && (
                <div className="space-y-6">
                  <div className="pb-2 border-b border-white/10">
                    <h4 className="font-serif text-xl font-bold text-white mb-1">
                      Manage Memories Timeline
                    </h4>
                    <p className="text-xs text-purple-200/60">
                      Create milestone cards with photo, date, and storytelling description.
                    </p>
                  </div>

                  {/* Add / Edit Memory Form */}
                  <form onSubmit={handleSaveMemory} className="p-5 rounded-2xl glass-card border border-purple-400/30 space-y-4">
                    <h5 className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                      {editingMemoryId ? "Edit Memory Item" : "Add New Memory Milestone"}
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-purple-200/80 mb-1">Title</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Summer Roadtrip"
                          value={memoryForm.title}
                          onChange={(e) => setMemoryForm({ ...memoryForm, title: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-purple-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-purple-200/80 mb-1">Date / Season</label>
                        <input
                          type="text"
                          placeholder="e.g. July 2024"
                          value={memoryForm.date_str}
                          onChange={(e) => setMemoryForm({ ...memoryForm, date_str: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-purple-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-purple-200/80 mb-1">Memory Description</label>
                      <textarea
                        required
                        rows="3"
                        placeholder="Tell the unforgettable story behind this memory..."
                        value={memoryForm.description}
                        onChange={(e) => setMemoryForm({ ...memoryForm, description: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-purple-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-purple-200/80 mb-1">Memory Photograph (Optional)</label>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => setMemoryFile(e.target.files[0])}
                        className="w-full text-xs text-purple-200 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-500/20 file:text-purple-300 hover:file:bg-purple-500/30 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="submit"
                        disabled={memoryLoading}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{editingMemoryId ? "Update Memory" : "Save Memory to Timeline"}</span>
                      </button>
                      {editingMemoryId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingMemoryId(null);
                            setMemoryForm({ title: '', date_str: '', description: '' });
                          }}
                          className="text-xs text-white/50 hover:text-white"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>

                  {/* Existing Memories List */}
                  <div className="space-y-3">
                    {memories.map((m) => (
                      <div key={m.id} className="p-4 rounded-2xl glass-card border border-white/10 flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          {m.image_path && (
                            <img src={m.image_path} alt={m.title} className="w-16 h-16 rounded-xl object-cover" />
                          )}
                          <div>
                            <span className="text-[10px] text-pink-300 font-semibold">{m.date_str}</span>
                            <h5 className="font-serif font-bold text-white text-sm">{m.title}</h5>
                            <p className="text-xs text-purple-200/70 mt-1 line-clamp-2">{m.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingMemoryId(m.id);
                              setMemoryForm({
                                title: m.title,
                                date_str: m.date_str || '',
                                description: m.description
                              });
                            }}
                            className="p-1.5 rounded-lg bg-white/10 text-pink-300 hover:bg-white/20"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMemory(m.id)}
                            className="p-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: Birthday Letter */}
              {activeTab === 'letter' && (
                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <h4 className="font-serif text-xl font-bold text-white mb-1">
                      Personalized Birthday Letter (Page 5)
                    </h4>
                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold shadow-md transition-all"
                    >
                      {profileSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
                      <span>{profileSaved ? "Saved!" : "Save Letter"}</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs text-purple-200/80 mb-1">Letter Title</label>
                    <input
                      type="text"
                      value={profileForm.letter_title || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, letter_title: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-pink-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-purple-200/80 mb-1">Letter Content / Emotional Message</label>
                    <textarea
                      rows="8"
                      value={profileForm.letter_content || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, letter_content: e.target.value })}
                      className="w-full px-3.5 py-3 rounded-xl bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-pink-400 font-serif leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-purple-200/80 mb-1">Letter Signature / Closing</label>
                    <input
                      type="text"
                      value={profileForm.letter_signature || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, letter_signature: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-pink-400"
                    />
                  </div>
                </form>
              )}

              {/* TAB 5: Surprises */}
              {activeTab === 'surprises' && (
                <div className="space-y-6">
                  <div className="pb-2 border-b border-white/10">
                    <h4 className="font-serif text-xl font-bold text-white mb-1">
                      Manage Surprise Cards & Secret Messages
                    </h4>
                    <p className="text-xs text-purple-200/60">
                      Hidden gifts revealed when the visitor unwraps the gift box on Page 6.
                    </p>
                  </div>

                  <form onSubmit={handleSaveSurprise} className="p-5 rounded-2xl glass-card border border-amber-400/30 space-y-4">
                    <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Add New Surprise
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-purple-200/80 mb-1">Surprise Title</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Surprise #4: Secret Voucher"
                          value={surpriseForm.title}
                          onChange={(e) => setSurpriseForm({ ...surpriseForm, title: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-purple-200/80 mb-1">Badge Tag</label>
                        <input
                          type="text"
                          placeholder="e.g. VIP Gift, Truth, Token"
                          value={surpriseForm.badge}
                          onChange={(e) => setSurpriseForm({ ...surpriseForm, badge: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-purple-200/80 mb-1">Preview Hint (Before clicking reveal)</label>
                      <input
                        type="text"
                        placeholder="e.g. Tap to peek into your destiny..."
                        value={surpriseForm.preview_hint}
                        onChange={(e) => setSurpriseForm({ ...surpriseForm, preview_hint: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-purple-200/80 mb-1">Secret Content (Revealed Message)</label>
                      <textarea
                        required
                        rows="3"
                        placeholder="Write the sweet secret, voucher, or message..."
                        value={surpriseForm.secret_content}
                        onChange={(e) => setSurpriseForm({ ...surpriseForm, secret_content: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={surpriseLoading}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs shadow-md transition-all flex items-center gap-2"
                    >
                      <Gift className="w-4 h-4" />
                      <span>Add Surprise Item</span>
                    </button>
                  </form>

                  {/* List of existing surprises */}
                  <div className="space-y-3">
                    {surprises.map((s) => (
                      <div key={s.id} className="p-4 rounded-2xl glass-card border border-white/10 flex items-start justify-between gap-4">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-amber-300 px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30">
                            {s.badge}
                          </span>
                          <h5 className="font-serif font-bold text-white text-sm mt-1">{s.title}</h5>
                          <p className="text-xs text-purple-200/70 mt-1 whitespace-pre-line">{s.secret_content}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteSurprise(s.id)}
                          className="p-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: Music Management */}
              {activeTab === 'music' && (
                <div className="space-y-6">
                  <div className="pb-2 border-b border-white/10">
                    <h4 className="font-serif text-xl font-bold text-white mb-1">
                      Background Birthday Music
                    </h4>
                    <p className="text-xs text-purple-200/60">
                      Apply any song from your device, upload an audio file (.mp3, .wav, .m4a), or use an audio URL.
                    </p>
                  </div>

                  {musicSuccessMsg && (
                    <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 shadow-md">
                      <Sparkles className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                      <span>{musicSuccessMsg}</span>
                    </div>
                  )}

                  {/* Mode Selector: File vs URL */}
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-400/30 text-xs text-purple-200">
                    <p className="font-semibold text-white mb-0.5">🚀 Permanent Song on GitHub & Vercel:</p>
                    <p className="text-[11px] text-purple-200/80">
                      You can drop your <code className="bg-black/40 px-1 py-0.5 rounded text-pink-300">birthday_song.mp3</code> into <code className="bg-black/40 px-1 py-0.5 rounded text-pink-300">frontend/public/audio/</code> on GitHub, or paste any audio web URL below!
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-black/30 p-1.5 rounded-2xl border border-white/10 max-w-sm">
                    <button
                      type="button"
                      onClick={() => setMusicSourceType('file')}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                        musicSourceType === 'file'
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      📁 Audio File
                    </button>
                    <button
                      type="button"
                      onClick={() => setMusicSourceType('url')}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                        musicSourceType === 'url'
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      🌐 Audio Link (URL)
                    </button>
                  </div>

                  {/* Music Form */}
                  <form onSubmit={handleApplyMusic} className="p-5 sm:p-6 rounded-2xl glass-card border border-pink-400/30 space-y-4">
                    <h5 className="text-xs font-bold text-pink-300 uppercase tracking-wider">
                      {musicSourceType === 'file' ? 'Apply Audio File from Computer / Phone' : 'Apply Direct Audio Web Link'}
                    </h5>

                    <div>
                      <label className="block text-xs text-purple-200/80 mb-1">Song / Track Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Favorite Birthday Song"
                        value={musicTitle}
                        onChange={(e) => setMusicTitle(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-pink-400"
                      />
                    </div>

                    {musicSourceType === 'file' ? (
                      <div>
                        <label className="block text-xs text-purple-200/80 mb-1">
                          Select Audio File (.mp3, .wav, .m4a, .aac, .ogg)
                        </label>
                        <input
                          type="file"
                          required
                          accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac"
                          onChange={handleMusicFileChange}
                          className="w-full text-xs text-purple-200 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-pink-500/20 file:text-pink-300 hover:file:bg-pink-500/30 cursor-pointer border border-white/10 rounded-xl p-2 bg-black/20"
                        />
                        <p className="text-[11px] text-purple-300/60 mt-1.5">
                          💡 Tip: Works with MP3, WAV, M4A, AAC, OGG. Plays instantly across your website!
                        </p>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs text-purple-200/80 mb-1">
                          Direct Audio Link (MP3 / WAV URL)
                        </label>
                        <input
                          type="url"
                          required
                          placeholder="https://example.com/audio/song.mp3"
                          value={musicUrl}
                          onChange={(e) => {
                            setMusicUrl(e.target.value);
                            setMusicPreviewUrl(e.target.value);
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-pink-400 font-mono text-xs"
                        />
                        <p className="text-[11px] text-purple-300/60 mt-1.5">
                          Paste any direct audio link from a hosting provider, Dropbox direct link, or CDN.
                        </p>
                      </div>
                    )}

                    {/* Audio Preview Player */}
                    {musicPreviewUrl && (
                      <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex flex-col gap-1.5">
                        <span className="text-[11px] text-pink-300 font-semibold flex items-center gap-1.5">
                          <Music className="w-3.5 h-3.5" />
                          <span>Preview Audio Before Applying:</span>
                        </span>
                        <audio
                          controls
                          src={musicPreviewUrl}
                          className="w-full h-8 mt-1 accent-pink-500"
                        />
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={musicLoading}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-xs shadow-lg shadow-pink-500/30 hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        <span>{musicLoading ? "Applying Audio..." : "Set as Active Birthday Song"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleResetDefaultMusic}
                        className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-pink-200 text-xs font-semibold transition-all"
                      >
                        Reset to Default Chime
                      </button>
                    </div>
                  </form>

                  {/* Available Tracks List */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-purple-200 uppercase tracking-wider">
                      Celebration Playlist ({tracks.length})
                    </h5>

                    <div className="space-y-2">
                      {tracks.map((t) => (
                        <div key={t.id} className="p-3.5 rounded-2xl glass-card border border-white/10 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl ${t.is_active ? 'bg-pink-500 text-white shadow-md shadow-pink-500/30' : 'bg-white/10 text-white/60'}`}>
                              <Music className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-xs sm:text-sm font-semibold text-white block">{t.title}</span>
                              <span className="text-[10px] text-purple-300/70 block">
                                {t.duration} • {t.is_active ? '✨ Active on Website' : 'Inactive'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {!t.is_active && (
                              <button
                                onClick={() => handleSetActiveMusic(t)}
                                className="px-3 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/40 text-pink-300 text-xs font-semibold transition-all border border-pink-400/30"
                              >
                                Set Active
                              </button>
                            )}
                            {t.id !== 'default' && (
                              <button
                                onClick={() => handleDeleteMusic(t.id)}
                                className="p-1.5 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-all"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: Security & Password */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="pb-2 border-b border-white/10">
                    <h4 className="font-serif text-xl font-bold text-white mb-1">
                      Security & Admin Password
                    </h4>
                    <p className="text-xs text-purple-200/60">
                      Update your administrator password for this website.
                    </p>
                  </div>

                  {passwordMsg && (
                    <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-400/30 text-xs text-purple-200">
                      {passwordMsg}
                    </div>
                  )}

                  <form onSubmit={handleChangePassword} className="p-5 rounded-2xl glass-card border border-white/15 space-y-4 max-w-md">
                    <div>
                      <label className="block text-xs text-purple-200/80 mb-1">Current Password</label>
                      <input
                        type="password"
                        required
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-pink-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-purple-200/80 mb-1">New Password (min 6 characters)</label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-pink-400"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-semibold shadow-md transition-all"
                    >
                      Update Password
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer info bar */}
        <div className="p-3 bg-black/40 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50 px-6">
          <span>Antigravity Birthday Website Studio</span>
          <button
            onClick={onClose}
            className="text-pink-300 hover:text-pink-200 font-semibold"
          >
            Close & View Website
          </button>
        </div>
      </motion.div>
    </div>
  );
}
