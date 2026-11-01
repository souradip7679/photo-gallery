import React from 'react';
import type { Photo, ViewMode } from '../types';
import { PhotoCard } from './PhotoCard';
import { ImageOff, Sparkles } from 'lucide-react';

interface PhotoGridProps {
  photos: Photo[];
  favorites: string[];
  userLikedPhotos: string[];
  onToggleFavorite: (id: string, e?: React.MouseEvent) => void;
  onToggleLike: (id: string, e?: React.MouseEvent) => void;
  onOpenLightbox: (photo: Photo) => void;
  onSelectPhotoDetail: (photo: Photo) => void;
  onSelectTag: (tag: string) => void;
  viewMode: ViewMode;
  onResetFilters?: () => void;
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({
  photos,
  favorites,
  userLikedPhotos,
  onToggleFavorite,
  onToggleLike,
  onOpenLightbox,
  onSelectPhotoDetail,
  onSelectTag,
  viewMode,
  onResetFilters,
}) => {
  if (photos.length === 0) {
    return (
      <div className="empty-gallery-state">
        <div className="empty-icon-wrapper">
          <ImageOff size={48} className="empty-icon" />
        </div>
        <h3>No Photos Match Your Criteria</h3>
        <p>Try adjusting your search query, clearing tag filters, or selecting another category.</p>
        {onResetFilters && (
          <button className="reset-empty-btn" onClick={onResetFilters}>
            <Sparkles size={16} /> Reset All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`gallery-grid-wrapper view-${viewMode}`}>
      {photos.map((photo) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          isFavorite={favorites.includes(photo.id)}
          isLiked={userLikedPhotos.includes(photo.id)}
          onToggleFavorite={onToggleFavorite}
          onToggleLike={onToggleLike}
          onOpenLightbox={onOpenLightbox}
          onSelectPhotoDetail={onSelectPhotoDetail}
          onSelectTag={onSelectTag}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
};
