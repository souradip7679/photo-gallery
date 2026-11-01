import React from 'react';
import type { Photo } from '../types';
import {
  ArrowLeft,
  Heart,
  Eye,
  Download,
  Camera,
  Layers,
  Sparkles,
  Maximize2
} from 'lucide-react';

interface PhotoDetailViewProps {
  photo: Photo;
  allPhotos: Photo[];
  favorites: string[];
  userLikedPhotos: string[];
  onBack: () => void;
  onToggleFavorite: (id: string) => void;
  onToggleLike: (id: string) => void;
  onSelectPhotoDetail: (photo: Photo) => void;
  onOpenLightbox: (photo: Photo) => void;
  onSelectTag: (tag: string) => void;
}

export const PhotoDetailView: React.FC<PhotoDetailViewProps> = ({
  photo,
  allPhotos,
  favorites,
  userLikedPhotos,
  onBack,
  onToggleFavorite,
  onToggleLike,
  onSelectPhotoDetail,
  onOpenLightbox,
  onSelectTag,
}) => {
  const isFavorite = favorites.includes(photo.id);
  const isLiked = userLikedPhotos.includes(photo.id);

  // Compute related photos by matching category or tags using JS array filter & slice
  const relatedPhotos = React.useMemo(() => {
    return allPhotos
      .filter((p) => p.id !== photo.id && (p.category === photo.category || p.tags.some((t) => photo.tags.includes(t))))
      .slice(0, 3);
  }, [photo, allPhotos]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = `${photo.title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="photo-detail-page">
      {/* Back Navigation Bar */}
      <div className="detail-top-nav">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={18} /> <span>Back to Gallery</span>
        </button>

        <div className="detail-actions">
          <button
            className={`detail-fav-btn ${isFavorite ? 'favorited' : ''}`}
            onClick={() => onToggleFavorite(photo.id)}
          >
            <Heart size={18} fill={isFavorite ? '#ff4757' : 'none'} color={isFavorite ? '#ff4757' : 'currentColor'} />
            <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
          </button>
          <button className="detail-download-btn" onClick={handleDownload}>
            <Download size={18} />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="detail-grid-layout">
        {/* Left Column - Large Image */}
        <div className="detail-image-section">
          <div className="detail-image-wrapper">
            <img src={photo.url} alt={photo.title} className="detail-main-img" />
            <button className="detail-expand-btn" onClick={() => onOpenLightbox(photo)}>
              <Maximize2 size={18} /> Expand Lightbox
            </button>
          </div>
        </div>

        {/* Right Column - Comprehensive Info */}
        <div className="detail-info-section">
          <div className="detail-header-card">
            <div className="detail-category-pill">{photo.category}</div>
            <h1 className="detail-title">{photo.title}</h1>
            <p className="detail-description">{photo.description}</p>
          </div>

          {/* Author Banner */}
          <div className="detail-author-card">
            <img src={photo.author.avatar} alt={photo.author.name} className="detail-author-avatar" />
            <div className="detail-author-text">
              <h3>{photo.author.name}</h3>
              <p>{photo.author.username}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="detail-stats-grid">
            <div
              className={`stat-card stat-card-interactive ${isLiked ? 'liked' : ''}`}
              onClick={() => onToggleLike(photo.id)}
              title={isLiked ? 'Unlike photo (-1)' : 'Like photo (+1)'}
            >
              <Heart size={20} className="stat-icon heart" fill={isLiked ? '#ff4757' : 'none'} color={isLiked ? '#ff4757' : 'currentColor'} />
              <div>
                <span className="stat-value">{photo.likes}</span>
                <span className="stat-label">{isLiked ? 'Liked (+1)' : 'Likes'}</span>
              </div>
            </div>
            <div className="stat-card">
              <Eye size={20} className="stat-icon views" />
              <div>
                <span className="stat-value">{photo.views}</span>
                <span className="stat-label">Views</span>
              </div>
            </div>
            <div className="stat-card">
              <Download size={20} className="stat-icon downloads" />
              <div>
                <span className="stat-value">{photo.downloads}</span>
                <span className="stat-label">Downloads</span>
              </div>
            </div>
          </div>

          {/* Technical Metadata & EXIF */}
          <div className="detail-exif-card">
            <div className="card-section-title">
              <Camera size={18} /> <h3>Camera & Shot Specs</h3>
            </div>
            <div className="exif-spec-grid">
              <div className="spec-item">
                <span className="spec-label">Camera</span>
                <span className="spec-val">{photo.exif.makeModel}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Lens</span>
                <span className="spec-val">{photo.exif.lens}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Focal Length</span>
                <span className="spec-val">{photo.exif.focalLength}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Aperture</span>
                <span className="spec-val">{photo.exif.aperture}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Shutter Speed</span>
                <span className="spec-val">{photo.exif.shutterSpeed}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">ISO</span>
                <span className="spec-val">{photo.exif.iso}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Dimensions</span>
                <span className="spec-val">{photo.dimensions}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Date Taken</span>
                <span className="spec-val">{photo.date}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="detail-tags-card">
            <div className="card-section-title">
              <Layers size={18} /> <h3>Tags & Keywords</h3>
            </div>
            <div className="detail-tags-wrapper">
              {photo.tags.map((tag) => (
                <button
                  key={tag}
                  className="detail-tag-chip"
                  onClick={() => {
                    onBack();
                    onSelectTag(tag);
                  }}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Recommendation Carousel */}
      {relatedPhotos.length > 0 && (
        <div className="related-photos-section">
          <div className="related-header">
            <Sparkles size={20} /> <h2>More Like This in {photo.category}</h2>
          </div>
          <div className="related-grid">
            {relatedPhotos.map((rel) => (
              <div
                key={rel.id}
                className="related-card"
                onClick={() => onSelectPhotoDetail(rel)}
              >
                <img src={rel.url} alt={rel.title} className="related-img" />
                <div className="related-overlay">
                  <h4>{rel.title}</h4>
                  <p>by {rel.author.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
