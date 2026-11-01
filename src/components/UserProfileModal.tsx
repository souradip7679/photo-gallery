import React, { useState, useRef } from 'react';
import type { User, Photo } from '../types';
import { apiService } from '../services/api';
import { X, User as UserIcon, AtSign, Mail, Lock, Image, Shield, Check, Heart, Camera, Save, Loader2, UploadCloud } from 'lucide-react';

interface UserProfileModalProps {
  currentUser: User;
  photos: Photo[];
  favoritesCount: number;
  likedCount: number;
  onClose: () => void;
  onUpdateSuccess: (updatedUser: User) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  currentUser,
  photos,
  favoritesCount,
  likedCount,
  onClose,
  onUpdateSuccess,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [email, setEmail] = useState(currentUser.email);
  const [avatar, setAvatar] = useState(currentUser.avatar || '');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatar(event.target.result as string);
        setErrorMsg('');
      }
    };
    reader.readAsDataURL(file);
  };

  // Calculate uploaded photos count by this user
  const userUploadedCount = photos.filter(
    (p) => p.author.username === `@${currentUser.username}` || p.author.name === currentUser.name
  ).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const updates: any = {
        name: name.trim(),
        username: username.trim(),
        email: email.trim(),
        avatar: avatar.trim(),
      };
      if (password.trim()) {
        updates.password = password.trim();
      }

      const updatedUser = await apiService.updateUserProfile(currentUser.id, updates);
      onUpdateSuccess(updatedUser);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="profile-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="profile-modal-header">
          <div className="profile-header-title">
            <UserIcon size={22} className="profile-icon" />
            <h2>User Profile & Settings</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* User Card Overview */}
        <div className="profile-banner-card">
          <div
            className="avatar-preview-wrapper interactive-avatar-trigger"
            onClick={() => fileInputRef.current?.click()}
            title="Click or tap to upload a new profile photo"
          >
            <img
              src={avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
              alt={name}
              className="profile-avatar-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
              }}
            />
            <div className="avatar-edit-overlay">
              <Camera size={20} className="avatar-camera-icon" />
              <span>Change</span>
            </div>
          </div>

          <div className="profile-banner-info">
            <div className="name-role-row">
              <h3>{name || currentUser.name}</h3>
              <span className={`role-tag role-${currentUser.role}`}>
                <Shield size={12} /> {currentUser.role.toUpperCase()}
              </span>
            </div>
            <p className="profile-user-handle">@{username || currentUser.username}</p>
            <p className="profile-user-email">{email || currentUser.email}</p>
            <button
              type="button"
              className="avatar-tap-change-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud size={13} /> Tap to Change Photo
            </button>
          </div>
        </div>

        {/* User Quick Metrics */}
        <div className="profile-stats-row">
          <div className="profile-stat-pill">
            <Camera size={16} className="ic photo" />
            <div>
              <span className="num">{userUploadedCount}</span>
              <span className="lbl">Uploaded Photos</span>
            </div>
          </div>

          <div className="profile-stat-pill">
            <Heart size={16} className="ic heart" />
            <div>
              <span className="num">{favoritesCount}</span>
              <span className="lbl">Favorites</span>
            </div>
          </div>

          <div className="profile-stat-pill">
            <Image size={16} className="ic liked" />
            <div>
              <span className="num">{likedCount}</span>
              <span className="lbl">Liked Photos</span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        {errorMsg && <div className="auth-error-banner">{errorMsg}</div>}
        {successMsg && (
          <div className="auth-notice-banner" style={{ background: 'rgba(16, 185, 129, 0.12)', borderColor: '#10b981', color: '#10b981' }}>
            <Check size={16} /> {successMsg}
          </div>
        )}

        {/* Edit Profile Form */}
        <form onSubmit={handleSubmit} className="profile-edit-form">
          <h4 className="form-section-title">Edit Account Details</h4>

          <div className="form-row">
            <div className="form-group">
              <label><UserIcon size={14} /> Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
              />
            </div>

            <div className="form-group">
              <label><AtSign size={14} /> Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
              />
            </div>
          </div>

          <div className="form-group">
            <label><Mail size={14} /> Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
            />
          </div>

          <div className="form-group">
            <label><Image size={14} /> Profile Picture / Avatar</label>
            <div className="avatar-upload-control-row">
              <button
                type="button"
                className="upload-avatar-file-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud size={16} /> Upload Photo from PC
              </button>
              <span className="avatar-or-divider">OR Paste URL</span>
              <input
                type="url"
                className="avatar-url-input"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://images.unsplash.com/..."
              />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>

          <div className="form-group">
            <label><Lock size={14} /> New Password (leave blank to keep current)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password..."
            />
          </div>

          <div className="form-actions" style={{ marginTop: '10px' }}>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-upload-btn" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={16} className="captcha-spinner" /> Saving...
                </>
              ) : (
                <>
                  <Save size={16} /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
