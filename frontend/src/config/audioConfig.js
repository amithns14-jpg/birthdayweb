// =========================================================================
// 🎵 BIRTHDAY WEBSITE - CUSTOM MUSIC CONFIGURATION 🎵
// =========================================================================
// This file lets you configure your custom birthday music directly in GitHub!
//
// 📌 HOW TO USE YOUR OWN AUDIO IN GITHUB:
//
// 1. ADD AUDIO FILE TO GITHUB:
//    - Put your audio file (.mp3, .wav, or .m4a) in the folder:
//      frontend/public/audio/birthday_song.mp3
//    - Then set `src: "/audio/birthday_song.mp3"` below.
//
// 2. OR USE A DIRECT ONLINE AUDIO LINK:
//    - Paste any direct mp3 link (Dropbox direct download, Google Drive, CDN):
//      `src: "https://your-domain.com/path-to-song.mp3"`
//
// 3. EDIT THE TITLE & ARTIST:
//    - Change `title` and `artist` below to whatever you like!
// =========================================================================

export const DEFAULT_AUDIO_CONFIG = {
  // Title shown on the floating player & vinyl record
  title: "Happy Birthday Celebration Melody",

  // Artist or subtitle shown in player
  artist: "Birthday Special Edition",

  // Audio source:
  // - Local public file: "/audio/birthday_song.mp3" or "/uploads/music/birthday_melody.wav"
  // - Direct online link: "https://example.com/song.mp3"
  src: "/audio/birthday_song.mp3",

  // Safe fallback if the primary file or URL cannot be loaded
  fallbackSrc: "/uploads/music/birthday_melody.wav",

  // Approximate duration or label
  duration: "Celebration",

  // Whether music automatically starts when visitor clicks "Open Your Surprise"
  autoPlayOnSurpriseClick: true,
};

export default DEFAULT_AUDIO_CONFIG;
