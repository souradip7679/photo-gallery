import React, { useState } from 'react';
import type { Photo, ViewMode } from '../types';
import { Heart, Eye, MapPin, Maximize2, Calendar } from 'lucide-react';

interface PhotoCardProps {
  photo: Photo;
  isFavorite: boolean;
  isLiked: boolean;
  onToggleFavorite: (id: string, e?: React.MouseEvent) => void;
  onToggleLike: (id: string, e?: React.MouseEvent) => void;
  onOpenLightbox: (photo: Photo) => void;
  onSelectPhotoDetail: (photo: Photo) => void;
  onSelectTag: (tag: string) => void;
  viewMode: ViewMode;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  isFavorite,
  isLiked,
  onToggleFavorite,
  onToggleLike,
  onOpenLightbox,
  onSelectPhotoDetail,
  onSelectTag,
  viewMode,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(photo.id, e);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleLike(photo.id, e);
  };

  if (viewMode === 'list') {
    return (
      <div className="photo-card-list" onClick={() => onSelectPhotoDetail(photo)}>
        <div className="list-img-wrapper">
          {!isLoaded && <div className="img-skeleton" />}
          <img
            src={photo.url}
            alt={photo.title}
            className={`list-img ${isLoaded ? 'loaded' : ''}`}
            onLoad={() => setIsLoaded(true)}
            loading="lazy"
          />
          <button
            className={`favorite-btn-floating ${isFavorite ? 'favorited' : ''}`}
            onClick={handleFavoriteClick}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={16} fill={isFavorite ? '#ff4757' : 'none'} color={isFavorite ? '#ff4757' : 'currentColor'} />
          </button>
        </div>

        <div className="list-content">
          <div className="list-header">
            <span className="category-tag">{photo.category}</span>
            <h3 className="photo-title">{photo.title}</h3>
          </div>

          <p className="list-description">{photo.description}</p>

          <div className="tags-row">
            {photo.tags.slice(0, 4).map((tag) => (
              <button
                key={tag}
                className="tag-pill"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTag(tag);
                }}
              >
                #{tag}
              </button>
            ))}
          </div>

          <div className="list-footer">
            <div className="author-info">
              <img src={photo.author.avatar} alt={photo.author.name} className="author-avatar" />
              <span>{photo.author.name}</span>
            </div>
            <div className="metrics-info">
              <button className={`stat-like-btn ${isLiked ? 'liked' : ''}`} onClick={handleLikeClick} title={isLiked ? 'Unlike (-1)' : 'Like (+1)'}>
                <Heart size={14} fill={isLiked ? '#ff4757' : 'none'} color={isLiked ? '#ff4757' : 'currentColor'} />
                <span>{photo.likes}</span>
              </button>
              <span className="metric"><Eye size={14} /> {photo.views}</span>
              <span className="metric"><Calendar size={14} /> {photo.date}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`photo-card ${viewMode === 'masonry' ? 'masonry-card' : ''}`}>
      <div className="card-image-container" onClick={() => onOpenLightbox(photo)}>
        {!isLoaded && <div className="img-skeleton" />}
        <img
          src={photo.url}
          alt={photo.title}
          className={`card-image ${isLoaded ? 'loaded' : ''}`}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
        />

        {/* Hover Overlay */}
        <div className="card-hover-overlay">
          <div className="top-overlay-actions">
            <span className="category-badge">{photo.category}</span>
            <button
              className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
              onClick={handleFavoriteClick}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart size={18} fill={isFavorite ? '#ff4757' : 'none'} color={isFavorite ? '#ff4757' : '#ffffff'} />
            </button>
          </div>

          <div className="center-overlay-action">
            <button
              className="quick-view-btn"
              onClick={(e) => {
                e.stopPropagation();
                onOpenLightbox(photo);
              }}
            >
              <Maximize2 size={16} /> Quick View
            </button>
          </div>

          <div className="bottom-overlay-info">
            <h3 className="card-title" onClick={(e) => { e.stopPropagation(); onSelectPhotoDetail(photo); }}>
              {photo.title}
            </h3>
            {photo.location && (
              <span className="card-location">
                <MapPin size={12} /> {photo.location}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Metadata Footer */}
      <div className="card-body">
        <div className="card-author-row" onClick={() => onSelectPhotoDetail(photo)}>
          <img src={photo.author.avatar} alt={photo.author.name} className="author-avatar-sm" />
          <div className="author-names">
            <span className="author-name">{photo.author.name}</span>
            <span className="author-user">{photo.author.username}</span>
          </div>
        </div>

        <div className="card-tags-list">
          {photo.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="tag-chip"
              onClick={(e) => {
                e.stopPropagation();
                onSelectTag(tag);
              }}
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="card-stats-row">
          <button className={`stat-like-btn ${isLiked ? 'liked' : ''}`} onClick={handleLikeClick} title={isLiked ? 'Unlike (-1)' : 'Like (+1)'}>
            <Heart size={13} className="heart-icon" fill={isLiked ? '#ff4757' : 'none'} color={isLiked ? '#ff4757' : 'currentColor'} />
            <span>{photo.likes}</span>
          </button>
          <span className="stat-item"><Eye size={13} /> {photo.views}</span>
        </div>
      </div>
    </div>
  );
};
