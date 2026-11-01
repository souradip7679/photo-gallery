import { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { INITIAL_PHOTOS } from './data/mockPhotos';
import type { Photo, CategoryType, SortOption, ViewMode, ActiveTab, User } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { apiService } from './services/api';

import { Navbar } from './components/Navbar';
import { CategoryFilter } from './components/CategoryFilter';
import { FilterBar } from './components/FilterBar';
import { PhotoGrid } from './components/PhotoGrid';
import { LightboxModal } from './components/LightboxModal';
import { PhotoDetailView } from './components/PhotoDetailView';
import { PhotoUploadModal } from './components/PhotoUploadModal';
import { StatsSummary } from './components/StatsSummary';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';

function App() {
  // User Authentication state (defaults to unauthenticated / null)
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('aether_user_v1', null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [authNoticeMsg, setAuthNoticeMsg] = useState<string>('');

  // Photos state (initializes from cached backup or initial data, synced with SQLite DB)
  const [photos, setPhotos] = useState<Photo[]>(() => {
    const cached = localStorage.getItem('aether_photos_v1');
    return cached ? JSON.parse(cached) : INITIAL_PHOTOS;
  });
  // User-specific storage keys
  const userFavsKey = currentUser ? `aether_favs_user_${currentUser.id}` : 'aether_favs_guest';
  const userLikesKey = currentUser ? `aether_user_likes_${currentUser.id}` : 'aether_user_likes_guest';

  const [favorites, setFavorites] = useLocalStorage<string[]>(userFavsKey, []);
  const [userLikedPhotos, setUserLikedPhotos] = useLocalStorage<string[]>(userLikesKey, []);
  const [darkMode, setDarkMode] = useLocalStorage<boolean>('aether_dark_theme', true);

  // Gallery Navigation & Filter states
  const [activeTab, setActiveTab] = useState<ActiveTab>('gallery');
  const [activeCategory, setActiveCategory] = useState<CategoryType>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('date-desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Modal & View States
  const [selectedPhotoDetail, setSelectedPhotoDetail] = useState<Photo | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  // Load photos from SQLite API on mount
  const loadPhotosFromApi = useCallback(async () => {
    const fetchedPhotos = await apiService.getPhotos();
    if (fetchedPhotos && fetchedPhotos.length > 0) {
      setPhotos(fetchedPhotos);
    }
  }, []);

  useEffect(() => {
    loadPhotosFromApi();
  }, [loadPhotosFromApi]);

  // Load per-user favorites and per-user likes from SQLite API when user logs in
  useEffect(() => {
    if (currentUser) {
      apiService.getUserFavorites(currentUser.id).then((userFavs) => {
        if (Array.isArray(userFavs)) {
          setFavorites(userFavs);
        }
      });
      apiService.getUserLikes(currentUser.id).then((userLikes) => {
        if (Array.isArray(userLikes)) {
          setUserLikedPhotos(userLikes);
        }
      });
    } else {
      // Clear active user favorites and likes when signed out so guest session shows clean un-highlighted state
      setFavorites([]);
      setUserLikedPhotos([]);
    }
  }, [currentUser?.id, setFavorites, setUserLikedPhotos]);

  // Apply dark/light theme class to root HTML
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Handle incrementing photo views in DB + state
  const handleIncrementView = useCallback(async (photoId: string) => {
    const newViews = await apiService.incrementView(photoId);
    if (newViews !== null) {
      setPhotos((prev) =>
        prev.map((p) => (p.id === photoId ? { ...p, views: newViews } : p))
      );
      setSelectedPhotoDetail((prev) => (prev && prev.id === photoId ? { ...prev, views: newViews } : prev));
      setLightboxPhoto((prev) => (prev && prev.id === photoId ? { ...prev, views: newViews } : prev));
    }
  }, []);

  // Open Auth Modal with custom notice
  const handleOpenAuth = useCallback((notice = '') => {
    setAuthNoticeMsg(notice);
    setIsAuthOpen(true);
  }, []);

  // 1. Handle Toggle Favorites (Isolated Per-User in SQLite DB)
  const handleToggleFavorite = useCallback(async (id: string, _e?: React.MouseEvent) => {
    if (!currentUser) {
      handleOpenAuth('Please Sign In or Create an Account to favorite photos!');
      return;
    }

    const isCurrentlyFav = favorites.includes(id);
    const updatedFavs = isCurrentlyFav
      ? favorites.filter((favId) => favId !== id)
      : [...favorites, id];

    setFavorites(updatedFavs);

    const res = await apiService.toggleUserFavorite(currentUser.id, id);
    if (res && Array.isArray(res.favorites)) {
      setFavorites(res.favorites);
    }
  }, [currentUser, favorites, setFavorites, handleOpenAuth]);

  // 2. Handle Toggle Likes ONLY (Isolated Per-User in SQLite DB)
  const handleToggleLike = useCallback(async (id: string, e?: React.MouseEvent) => {
    if (!currentUser) {
      handleOpenAuth('Please Sign In or Create an Account to like photos!');
      return;
    }

    const isCurrentlyLiked = userLikedPhotos.includes(id);
    const action = isCurrentlyLiked ? 'unlike' : 'like';

    if (!isCurrentlyLiked && e) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
      });
    }

    const updatedLikes = isCurrentlyLiked
      ? userLikedPhotos.filter((item) => item !== id)
      : [...userLikedPhotos, id];

    setUserLikedPhotos(updatedLikes);

    const res = await apiService.toggleUserLike(currentUser.id, id, action);
    if (res) {
      if (Array.isArray(res.userLikedPhotos)) {
        setUserLikedPhotos(res.userLikedPhotos);
      }
      if (typeof res.likes === 'number') {
        setPhotos((prev) =>
          prev.map((p) => (p.id === id ? { ...p, likes: res.likes } : p))
        );
        setSelectedPhotoDetail((prev) => (prev && prev.id === id ? { ...prev, likes: res.likes } : prev));
        setLightboxPhoto((prev) => (prev && prev.id === id ? { ...prev, likes: res.likes } : prev));
      }
    }
  }, [currentUser, userLikedPhotos, setUserLikedPhotos, handleOpenAuth]);

  // Handle adding new custom photo
  const handleAddPhoto = useCallback(async (newPhoto: Photo) => {
    if (!currentUser) {
      handleOpenAuth('Please Sign In or Create an Account to upload photos!');
      return;
    }

    newPhoto.author = {
      name: currentUser.name,
      username: `@${currentUser.username}`,
      avatar: currentUser.avatar || newPhoto.author.avatar,
    };

    await apiService.createPhoto(newPhoto);
    await loadPhotosFromApi();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, [currentUser, loadPhotosFromApi, handleOpenAuth]);

  // Reset all active filters
  const handleResetFilters = useCallback(() => {
    setActiveCategory('All');
    setSearchQuery('');
    setSelectedTag(null);
    setSortOption('date-desc');
  }, []);

  // Filter & Sort Pipeline
  const filteredAndSortedPhotos = useMemo(() => {
    return photos
      .filter((photo) => {
        if (activeTab === 'favorites' && !favorites.includes(photo.id)) {
          return false;
        }

        if (activeCategory !== 'All' && photo.category !== activeCategory) {
          return false;
        }

        if (selectedTag && !photo.tags.includes(selectedTag)) {
          return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = photo.title.toLowerCase().includes(q);
          const matchAuthor = photo.author.name.toLowerCase().includes(q) || photo.author.username.toLowerCase().includes(q);
          const matchCategory = photo.category.toLowerCase().includes(q);
          const matchLocation = photo.location?.toLowerCase().includes(q) || false;
          const matchTags = photo.tags.some((t) => t.toLowerCase().includes(q));

          return matchTitle || matchAuthor || matchCategory || matchLocation || matchTags;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case 'date-desc':
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          case 'date-asc':
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          case 'likes-desc':
            return b.likes - a.likes;
          case 'views-desc':
            return b.views - a.views;
          case 'title-asc':
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
  }, [photos, favorites, activeTab, activeCategory, selectedTag, searchQuery, sortOption]);

  const handleSelectPhotoDetail = (photo: Photo) => {
    if (!currentUser) {
      handleOpenAuth('Please Sign In or Create an Account to view photo details!');
      return;
    }
    setSelectedPhotoDetail(photo);
    setActiveTab('detail');
    handleIncrementView(photo.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLightbox = (photo: Photo) => {
    if (!currentUser) {
      handleOpenAuth('Please Sign In or Create an Account to view full photos!');
      return;
    }
    setLightboxPhoto(photo);
    handleIncrementView(photo.id);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setFavorites([]);
    setUserLikedPhotos([]);
    if (activeTab === 'admin' || activeTab === 'favorites') setActiveTab('gallery');
  };

  return (
    <div className="app-container">
      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'detail') setSelectedPhotoDetail(null);
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        favoriteCount={favorites.length}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenUpload={() => {
          if (!currentUser) {
            handleOpenAuth('Please Sign In or Create an Account to upload photos!');
          } else {
            setIsUploadOpen(true);
          }
        }}
        currentUser={currentUser}
        onOpenAuth={() => handleOpenAuth('')}
        onLogout={handleLogout}
        onOpenProfile={() => {
          if (currentUser) {
            setIsProfileOpen(true);
          }
        }}
      />

      {/* Main Container */}
      <main className="main-content-wrapper">
        {activeTab === 'admin' ? (
          /* Admin & Database Management Dashboard */
          <AdminDashboard
            photos={photos}
            currentUser={currentUser}
            onRefreshPhotos={loadPhotosFromApi}
            onOpenLightbox={handleOpenLightbox}
            onOpenAuth={() => handleOpenAuth('Administrator sign in required to access database console.')}
          />
        ) : activeTab === 'detail' && selectedPhotoDetail ? (
          /* Single Photo Detail Page */
          <PhotoDetailView
            photo={selectedPhotoDetail}
            allPhotos={photos}
            favorites={favorites}
            userLikedPhotos={userLikedPhotos}
            onBack={() => setActiveTab('gallery')}
            onToggleFavorite={handleToggleFavorite}
            onToggleLike={handleToggleLike}
            onSelectPhotoDetail={handleSelectPhotoDetail}
            onOpenLightbox={handleOpenLightbox}
            onSelectTag={(tag) => {
              setSelectedTag(tag);
              setActiveTab('gallery');
            }}
          />
        ) : (
          /* Main Gallery / Favorites View */
          <>
            {/* Stats Summary Banner */}
            <StatsSummary photos={photos} favoritesCount={favorites.length} />

            {/* Category Filter Pills */}
            <CategoryFilter
              activeCategory={activeCategory}
              onSelectCategory={(cat) => setActiveCategory(cat)}
              photos={photos}
            />

            {/* Sorting & Layout Control Bar */}
            <FilterBar
              viewMode={viewMode}
              setViewMode={setViewMode}
              sortOption={sortOption}
              setSortOption={setSortOption}
              selectedTag={selectedTag}
              onClearTag={() => setSelectedTag(null)}
              filteredCount={filteredAndSortedPhotos.length}
              totalCount={photos.length}
              onResetFilters={handleResetFilters}
            />

            {/* Photo Cards Grid */}
            <PhotoGrid
              photos={filteredAndSortedPhotos}
              favorites={favorites}
              userLikedPhotos={userLikedPhotos}
              onToggleFavorite={handleToggleFavorite}
              onToggleLike={handleToggleLike}
              onOpenLightbox={handleOpenLightbox}
              onSelectPhotoDetail={handleSelectPhotoDetail}
              onSelectTag={(tag) => setSelectedTag(tag)}
              viewMode={viewMode}
              onResetFilters={handleResetFilters}
            />
          </>
        )}
      </main>

      {/* Lightbox Modal */}
      {lightboxPhoto && (
        <LightboxModal
          photo={lightboxPhoto}
          allPhotos={filteredAndSortedPhotos}
          favorites={favorites}
          userLikedPhotos={userLikedPhotos}
          onClose={() => setLightboxPhoto(null)}
          onToggleFavorite={handleToggleFavorite}
          onToggleLike={handleToggleLike}
          onSelectPhotoDetail={handleSelectPhotoDetail}
          onNavigatePhoto={(p) => handleOpenLightbox(p)}
        />
      )}

      {/* Upload Photo Modal */}
      {isUploadOpen && (
        <PhotoUploadModal
          onClose={() => setIsUploadOpen(false)}
          onAddPhoto={handleAddPhoto}
        />
      )}

      {/* Auth Modal (Login / Register) */}
      {isAuthOpen && (
        <AuthModal
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={(user) => setCurrentUser(user)}
          noticeMsg={authNoticeMsg}
        />
      )}

      {/* Profile & Edit Modal */}
      {isProfileOpen && currentUser && (
        <UserProfileModal
          currentUser={currentUser}
          photos={photos}
          favoritesCount={favorites.length}
          likedCount={userLikedPhotos.length}
          onClose={() => setIsProfileOpen(false)}
          onUpdateSuccess={(updatedUser) => {
            setCurrentUser(updatedUser);
            loadPhotosFromApi();
          }}
        />
      )}
    </div>
  );
}

export default App;
