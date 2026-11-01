import React from 'react';
import { Camera, Heart, PlusCircle, Search, Sun, Moon, Sparkles, X, ShieldCheck, LogIn, LogOut } from 'lucide-react';
import type { ActiveTab, User } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  favoriteCount: number;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  onOpenUpload: () => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenProfile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  favoriteCount,
  darkMode,
  setDarkMode,
  onOpenUpload,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenProfile,
}) => {
  return (
    <header className="navbar-container">
      <div className="navbar-content">
        {/* Brand Logo */}
        <div className="navbar-brand" onClick={() => setActiveTab('gallery')}>
          <div className="logo-icon-wrapper">
            <Camera className="logo-icon" />
            <Sparkles className="logo-sparkle" />
          </div>
          <div className="brand-text">
            <span className="brand-name">AetherLens</span>
            <span className="brand-tagline">Photo Gallery</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-bar-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by title, author, category, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              title="Clear search"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Navigation & Controls */}
        <nav className="nav-links">
          <button
            className={`nav-btn ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            <Camera size={18} />
            <span>Gallery</span>
          </button>

          <button
            className={`nav-btn ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <Heart size={18} className={favoriteCount > 0 ? 'heart-filled' : ''} />
            <span>Favorites</span>
            {favoriteCount > 0 && <span className="nav-badge">{favoriteCount}</span>}
          </button>

          {/* Admin DB Link (Visible to all, but requires Admin login) */}
          <button
            className={`nav-btn admin-nav-btn ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
            title="Database & Admin Dashboard"
          >
            <ShieldCheck size={18} className="shield-icon" />
            <span>Admin DB</span>
          </button>

          <button className="upload-cta-btn" onClick={onOpenUpload}>
            <PlusCircle size={18} />
            <span>Add Photo</span>
          </button>

          {/* User Auth Profile / Login Button */}
          {currentUser ? (
            <div
              className="user-profile-badge"
              onClick={onOpenProfile}
              title="Click to view & edit profile"
              style={{ cursor: 'pointer' }}
            >
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                alt={currentUser.name}
                className="user-avatar"
              />
              <div className="user-meta">
                <span className="user-name">{currentUser.name}</span>
                <span className={`role-tag role-${currentUser.role}`}>
                  {currentUser.role.toUpperCase()}
                </span>
              </div>
              <button
                className="logout-icon-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onLogout();
                }}
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button className="auth-login-btn" onClick={onOpenAuth}>
              <LogIn size={16} />
              <span>Sign In</span>
            </button>
          )}

          <button
            className="theme-toggle-btn"
            onClick={() => setDarkMode((prev) => !prev)}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={20} className="sun-icon" /> : <Moon size={20} className="moon-icon" />}
          </button>
        </nav>
      </div>
    </header>
  );
};
