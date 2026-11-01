import type { Photo, ActivityLog, AdminStats, User } from '../types';
import { INITIAL_PHOTOS } from '../data/mockPhotos';

const API_BASE_URL = 'http://localhost:5000/api';

export const apiService = {
  // Check Backend Health
  async checkHealth(): Promise<{ status: string; database?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      if (!res.ok) throw new Error('Backend health check failed');
      return await res.json();
    } catch {
      return { status: 'offline', database: 'Local Storage Fallback' };
    }
  },

  // Auth: Login User
  async loginUser(identifier: string, password: string): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Invalid credentials');
    }
    return await res.json();
  },

  // Auth: Register User
  async registerUser(name: string, username: string, email: string, password: string, role: 'admin' | 'user' = 'user'): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, username, email, password, role }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    return await res.json();
  },

  // Auth: Get All Users (Admin)
  async getUsers(): Promise<User[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/users`);
      if (!res.ok) throw new Error('Failed to fetch users');
      return await res.json();
    } catch {
      return [];
    }
  },

  // Auth: Update User Profile
  async updateUserProfile(id: string, updates: Partial<{ name: string; username: string; email: string; avatar: string; password?: string }>): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/auth/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update profile');
    }
    return await res.json();
  },

  // Auth: Delete User (Admin)
  async deleteUser(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/auth/users/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete user');
  },

  // Per-User Favorites: Get User Favorites
  async getUserFavorites(userId: string): Promise<string[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}/favorites`);
      if (!res.ok) throw new Error('Failed to fetch user favorites');
      return await res.json();
    } catch {
      return [];
    }
  },

  // Per-User Favorites: Toggle Favorite
  async toggleUserFavorite(userId: string, photoId: string): Promise<{ favorites: string[]; isFavorite: boolean } | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}/favorites/${photoId}`, {
        method: 'POST',
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // Per-User Likes: Get User Likes
  async getUserLikes(userId: string): Promise<string[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}/likes`);
      if (!res.ok) throw new Error('Failed to fetch user likes');
      return await res.json();
    } catch {
      return [];
    }
  },

  // Per-User Likes: Toggle Like
  async toggleUserLike(userId: string, photoId: string, action: 'like' | 'unlike'): Promise<{ likes: number; userLikedPhotos: string[] } | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}/likes/${photoId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // Fetch All Photos
  async getPhotos(): Promise<Photo[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/photos`);
      if (!res.ok) throw new Error('Failed to fetch photos from SQLite API');
      const photos = await res.json();
      localStorage.setItem('aether_photos_v1', JSON.stringify(photos));
      return photos;
    } catch (err) {
      console.warn('Backend API offline, falling back to local storage:', err);
      const local = localStorage.getItem('aether_photos_v1');
      return local ? JSON.parse(local) : INITIAL_PHOTOS;
    }
  },

  // Create Photo
  async createPhoto(photo: Photo): Promise<Photo> {
    try {
      const res = await fetch(`${API_BASE_URL}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(photo),
      });
      if (!res.ok) throw new Error('Failed to create photo in SQLite API');
      return await res.json();
    } catch (err) {
      console.warn('API error creating photo, storing locally:', err);
      return photo;
    }
  },

  // Update Photo
  async updatePhoto(id: string, updates: Partial<Photo>): Promise<void> {
    try {
      const res = await fetch(`${API_BASE_URL}/photos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update photo in SQLite API');
    } catch (err) {
      console.warn('API error updating photo:', err);
    }
  },

  // Delete Photo
  async deletePhoto(id: string): Promise<void> {
    try {
      const res = await fetch(`${API_BASE_URL}/photos/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete photo from SQLite API');
    } catch (err) {
      console.warn('API error deleting photo:', err);
    }
  },

  // Like / Unlike Photo
  async likePhoto(id: string, action: 'like' | 'unlike' = 'like'): Promise<number | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/photos/${id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.likes;
    } catch {
      return null;
    }
  },

  // View Photo
  async incrementView(id: string): Promise<number | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/photos/${id}/view`, { method: 'POST' });
      if (!res.ok) return null;
      const data = await res.json();
      return data.views;
    } catch {
      return null;
    }
  },

  // Admin Stats
  async getAdminStats(): Promise<AdminStats> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/stats`);
      if (!res.ok) throw new Error('Failed to fetch admin stats');
      return await res.json();
    } catch {
      return {
        totalPhotos: 12,
        totalCategories: 7,
        totalUsers: 2,
        totalViews: 134260,
        totalLikes: 21600,
        totalDownloads: 5410,
        dbSizeKB: 64,
        status: 'Offline (Local Cache Active)',
      };
    }
  },

  // Admin Activity Logs
  async getActivityLogs(): Promise<ActivityLog[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/logs`);
      if (!res.ok) throw new Error('Failed to fetch activity logs');
      return await res.json();
    } catch {
      return [
        {
          id: 'log-local-1',
          action: 'CLIENT_CACHE',
          details: 'Loaded photo gallery from browser local cache',
          status: 'info',
          timestamp: new Date().toISOString(),
        },
      ];
    }
  },

  // Admin Seed DB
  async seedDatabase(): Promise<void> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/seed`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to re-seed database');
    } catch (err) {
      console.warn('Failed to seed backend database:', err);
    }
  },
};
