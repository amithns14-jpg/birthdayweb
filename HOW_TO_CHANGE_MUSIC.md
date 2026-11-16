# 🎵 How to Apply Your Own Audio / Song in this Birthday Website

This repository makes it super easy to personalize the birthday background music. You can do it directly on GitHub without running any code!

---

## 🌟 Method 1: Upload Your Song Directly to GitHub (Easiest & Recommended)

1. Open your repository on GitHub: [github.com/amithns14-jpg/birthdayweb](https://github.com/amithns14-jpg/birthdayweb)
2. Navigate to: `frontend/public/audio/`
3. Click the **"Add file"** button at the top right, then select **"Upload files"**.
4. Drag and drop your audio file (`.mp3`, `.wav`, or `.m4a`) from your phone or computer.
5. **Name the file:** `birthday_song.mp3` *(this replaces the placeholder song)*.
6. Scroll down and click **"Commit changes"**.
7. 🎉 That's it! When Vercel or your hosting deploys, **everyone opening your website will automatically hear your custom birthday song!**

---

## 🌐 Method 2: Use Any Online Audio Link (YouTube / Drive / Dropbox / CDN)

If you have a link to your audio file hosted online:

1. Open the file: `frontend/src/config/audioConfig.js` on GitHub.
2. Click the ✏️ **Edit this file** pencil icon.
3. Update the `src` and `title`:
   ```javascript
   export const DEFAULT_AUDIO_CONFIG = {
     title: "Sophia's Favorite Song",
     src: "https://your-domain.com/my-song.mp3", // Paste direct audio link here
     fallbackSrc: "/uploads/music/birthday_melody.wav",
     artist: "Special Edition",
     duration: "Celebration",
     autoPlayOnSurpriseClick: true,
   };
   ```
4. Click **"Commit changes"**.

---

## 🛠️ Method 3: Live Upload in Admin Studio (On the Website)

1. Open your birthday website in your browser.
2. Click the **Admin Studio (lock icon)** in the navigation dock.
3. Login using your admin password (default: `admin` / `birthday2025`).
4. Go to the **Music Player** tab on the left.
5. Choose **"📁 Audio File"** to select any song from your computer or phone, or **"🌐 Audio Link (URL)"** to paste an MP3 link.
6. Preview the audio right in the dashboard, then click **"Set as Active Birthday Song"**.
7. It immediately syncs across all pages of your celebration!
