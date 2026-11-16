const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('birthday_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // Auth
  async login(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Invalid credentials' }));
      throw new Error(err.detail || 'Login failed');
    }
    const data = await res.json();
    localStorage.setItem('birthday_admin_token', data.access_token);
    return data;
  },

  async verifyAuth() {
    const token = localStorage.getItem('birthday_admin_token');
    if (!token) return false;
    try {
      const res = await fetch(`${API_BASE}/auth/verify`, {
        headers: getAuthHeaders()
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  logout() {
    localStorage.removeItem('birthday_admin_token');
  },

  async changePassword(oldPassword, newPassword) {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to update password' }));
      throw new Error(err.detail || 'Failed to update password');
    }
    return res.json();
  },

  // Profile
  async getProfile() {
    const res = await fetch(`${API_BASE}/profile`);
    if (!res.ok) throw new Error('Failed to fetch birthday profile');
    return res.json();
  },

  async updateProfile(profileData) {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(profileData)
    });
    if (!res.ok) throw new Error('Failed to update birthday profile');
    return res.json();
  },

  // Photos
  async getPhotos() {
    const res = await fetch(`${API_BASE}/photos`);
    if (!res.ok) throw new Error('Failed to fetch photos');
    return res.json();
  },

  async uploadPhotos(formData) {
    const res = await fetch(`${API_BASE}/photos/upload`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(err.detail || 'Upload failed');
    }
    return res.json();
  },

  async updatePhoto(photoId, data) {
    const res = await fetch(`${API_BASE}/photos/${photoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update photo');
    return res.json();
  },

  async reorderPhotos(items) {
    const res = await fetch(`${API_BASE}/photos/reorder`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(items)
    });
    if (!res.ok) throw new Error('Failed to reorder photos');
    return res.json();
  },

  async deletePhoto(photoId) {
    const res = await fetch(`${API_BASE}/photos/${photoId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete photo');
    return res.json();
  },

  // Memories
  async getMemories() {
    const res = await fetch(`${API_BASE}/memories`);
    if (!res.ok) throw new Error('Failed to fetch memories');
    return res.json();
  },

  async createMemory(formData) {
    const res = await fetch(`${API_BASE}/memories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    });
    if (!res.ok) throw new Error('Failed to create memory');
    return res.json();
  },

  async updateMemory(memoryId, formData) {
    const res = await fetch(`${API_BASE}/memories/${memoryId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: formData
    });
    if (!res.ok) throw new Error('Failed to update memory');
    return res.json();
  },

  async deleteMemory(memoryId) {
    const res = await fetch(`${API_BASE}/memories/${memoryId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete memory');
    return res.json();
  },

  // Surprises
  async getSurprises() {
    const res = await fetch(`${API_BASE}/surprises`);
    if (!res.ok) throw new Error('Failed to fetch surprises');
    return res.json();
  },

  async createSurprise(data) {
    const res = await fetch(`${API_BASE}/surprises`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create surprise item');
    return res.json();
  },

  async updateSurprise(id, data) {
    const res = await fetch(`${API_BASE}/surprises/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update surprise');
    return res.json();
  },

  async deleteSurprise(id) {
    const res = await fetch(`${API_BASE}/surprises/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete surprise');
    return res.json();
  },

  // Messages
  async getMessages() {
    const res = await fetch(`${API_BASE}/messages`);
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  },

  async postMessage(messageData) {
    const res = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageData)
    });
    if (!res.ok) throw new Error('Failed to post message');
    return res.json();
  },

  async deleteMessage(messageId) {
    const res = await fetch(`${API_BASE}/messages/${messageId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete message');
    return res.json();
  },

  // Music
  async getMusicTracks() {
    const res = await fetch(`${API_BASE}/music`);
    if (!res.ok) throw new Error('Failed to fetch music tracks');
    return res.json();
  },

  async getActiveMusic() {
    const res = await fetch(`${API_BASE}/music/active`);
    if (!res.ok) throw new Error('Failed to fetch active music');
    return res.json();
  },

  async uploadMusic(formData) {
    const res = await fetch(`${API_BASE}/music/upload`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    });
    if (!res.ok) throw new Error('Failed to upload music');
    return res.json();
  },

  async setMusicUrl(title, url) {
    const res = await fetch(`${API_BASE}/music/set-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ title, url, set_active: true })
    });
    if (!res.ok) throw new Error('Failed to set music URL');
    return res.json();
  },

  async setActiveTrack(trackId) {
    const res = await fetch(`${API_BASE}/music/active/${trackId}`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to set active track');
    return res.json();
  },

  async deleteMusic(trackId) {
    const res = await fetch(`${API_BASE}/music/${trackId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete track');
    return res.json();
  }
};
