// Lightweight, zero-dependency IndexedDB storage for custom user audio files
// Bypasses the 5MB browser localStorage limit so any song (even 50MB+) saves and plays smoothly!

const DB_NAME = 'BirthdayAudioDB';
const DB_VERSION = 1;
const STORE_NAME = 'custom_audio';
const KEY_NAME = 'active_song';

function openAudioDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save custom audio file or URL to IndexedDB & emit update event
 */
export async function saveCustomAudioTrack(trackInfo, fileOrBlob) {
  try {
    const db = await openAudioDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    const record = {
      id: trackInfo.id || 'custom-' + Date.now(),
      title: trackInfo.title || 'My Birthday Song',
      duration: trackInfo.duration || 'Custom',
      is_active: true,
      updated_at: Date.now(),
      blob: fileOrBlob instanceof Blob ? fileOrBlob : null,
      url: typeof fileOrBlob === 'string' ? fileOrBlob : (trackInfo.file_path || '')
    };

    store.put(record, KEY_NAME);

    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });

    // Also mirror basic metadata (without massive base64) to localStorage for quick sync
    try {
      localStorage.setItem('custom_birthday_audio_meta', JSON.stringify({
        id: record.id,
        title: record.title,
        duration: record.duration,
        has_blob: !!record.blob,
        url: record.url
      }));
    } catch (e) {
      console.warn('localStorage meta sync skipped', e);
    }

    return record;
  } catch (err) {
    console.warn('IndexedDB save failed, falling back to basic state', err);
    return null;
  }
}

/**
 * Load custom audio track from IndexedDB
 */
export async function loadCustomAudioTrack() {
  try {
    const db = await openAudioDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(KEY_NAME);

    const record = await new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    if (!record) return null;

    let playableSrc = record.url;
    if (record.blob) {
      playableSrc = URL.createObjectURL(record.blob);
    }

    return {
      id: record.id,
      title: record.title,
      file_path: playableSrc,
      duration: record.duration,
      is_active: true
    };
  } catch (err) {
    console.warn('IndexedDB load failed', err);
    return null;
  }
}

/**
 * Remove custom audio from IndexedDB and localStorage
 */
export async function clearCustomAudioTrack() {
  try {
    const db = await openAudioDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(KEY_NAME);
  } catch (e) {
    console.warn('IndexedDB clear error', e);
  }

  try {
    localStorage.removeItem('custom_birthday_audio');
    localStorage.removeItem('custom_birthday_audio_meta');
  } catch (e) {
    // Ignore
  }
}
