import React, { useEffect, useState, useRef, useCallback } from 'react';
import type { Photo } from '../types';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Download,
  Play,
  Pause,
  Camera,
  Info,
  ExternalLink,
  MapPin,
  Calendar,
  Eye,
  Sliders,
  Check
} from 'lucide-react';

interface LightboxModalProps {
  photo: Photo | null;
  allPhotos: Photo[];
  favorites: string[];
  userLikedPhotos: string[];
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onToggleLike: (id: string) => void;
  onSelectPhotoDetail: (photo: Photo) => void;
  onNavigatePhoto: (photo: Photo) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  photo,
  allPhotos,
  favorites,
  userLikedPhotos,
  onClose,
  onToggleFavorite,
  onToggleLike,
  onSelectPhotoDetail,
  onNavigatePhoto,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showExif, setShowExif] = useState(false);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  const currentIndex = photo ? allPhotos.findIndex((p) => p.id === photo.id) : -1;
  const isFavorite = photo ? favorites.includes(photo.id) : false;
  const isLiked = photo ? userLikedPhotos.includes(photo.id) : false;

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onNavigatePhoto(allPhotos[currentIndex - 1]);
    } else if (allPhotos.length > 0) {
      onNavigatePhoto(allPhotos[allPhotos.length - 1]);
    }
  }, [currentIndex, allPhotos, onNavigatePhoto]);

  const handleNext = useCallback(() => {
    if (currentIndex < allPhotos.length - 1) {
      onNavigatePhoto(allPhotos[currentIndex + 1]);
    } else if (allPhotos.length > 0) {
      onNavigatePhoto(allPhotos[0]);
    }
  }, [currentIndex, allPhotos, onNavigatePhoto]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!photo) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photo, onClose, handlePrev, handleNext]);

  // Slideshow auto-play timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        handleNext();
      }, 3500);
    } else if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [isPlaying, handleNext]);

  if (!photo) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = `${photo.title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="lightbox-backdrop" onClick={onClose}>
      <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
        {/* Top Control Bar */}
        <div className="lightbox-top-bar">
          <div className="top-bar-left">
            <span className="lightbox-counter">
              {currentIndex + 1} / {allPhotos.length}
            </span>
            <button
              className={`slideshow-btn ${isPlaying ? 'playing' : ''}`}
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              <span>{isPlaying ? 'Pause' : 'Slideshow'}</span>
            </button>
          </div>

          <div className="top-bar-right">
            <button
              className={`lightbox-action-btn ${showExif ? 'active' : ''}`}
              onClick={() => setShowExif(!showExif)}
              title="Camera EXIF Info"
            >
              <Camera size={18} />
              <span>EXIF</span>
            </button>

            <button
              className={`lightbox-action-btn ${isFavorite ? 'favorited' : ''}`}
              onClick={() => onToggleFavorite(photo.id)}
              title={isFavorite ? 'Remove Favorite' : 'Add Favorite'}
            >
              <Heart size={18} fill={isFavorite ? '#ff4757' : 'none'} color={isFavorite ? '#ff4757' : 'currentColor'} />
            </button>

            <button className="lightbox-action-btn" onClick={handleDownload} title="Download High-Res Image">
              <Download size={18} />
            </button>

            <button className="lightbox-close-btn" onClick={onClose} title="Close Lightbox (Esc)">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Main Viewing Area */}
        <div className="lightbox-main">
          <button className="lightbox-nav-btn prev" onClick={handlePrev} title="Previous Photo (Left Arrow)">
            <ChevronLeft size={32} />
          </button>

          <div className="lightbox-stage">
            <img src={photo.url} alt={photo.title} className="lightbox-image" />

            {/* EXIF Overlay Panel */}
            {showExif && (
              <div className="exif-popover">
                <div className="exif-header">
                  <Sliders size={16} /> <h4>Camera Metadata</h4>
                </div>
                <div className="exif-grid">
                  <div className="exif-item">
                    <span className="exif-label">Camera</span>
                    <span className="exif-val">{photo.exif.makeModel}</span>
                  </div>
                  <div className="exif-item">
                    <span className="exif-label">Lens</span>
                    <span className="exif-val">{photo.exif.lens}</span>
                  </div>
                  <div className="exif-item">
                    <span className="exif-label">Focal Length</span>
                    <span className="exif-val">{photo.exif.focalLength}</span>
                  </div>
                  <div className="exif-item">
                    <span className="exif-label">Aperture</span>
                    <span className="exif-val">{photo.exif.aperture}</span>
                  </div>
                  <div className="exif-item">
                    <span className="exif-label">Shutter Speed</span>
                    <span className="exif-val">{photo.exif.shutterSpeed}</span>
                  </div>
                  <div className="exif-item">
                    <span className="exif-label">ISO</span>
                    <span className="exif-val">{photo.exif.iso}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button className="lightbox-nav-btn next" onClick={handleNext} title="Next Photo (Right Arrow)">
            <ChevronRight size={32} />
          </button>
        </div>

        {/* Bottom Metadata Bar */}
        <div className="lightbox-bottom-bar">
          <div className="bottom-meta-left">
            <img src={photo.author.avatar} alt={photo.author.name} className="author-avatar-md" />
            <div>
              <h3 className="lightbox-title">{photo.title}</h3>
              <p className="lightbox-author">by {photo.author.name} ({photo.author.username})</p>
            </div>
          </div>

          <div className="bottom-meta-center">
            {photo.location && (
              <span className="meta-pill"><MapPin size={14} /> {photo.location}</span>
            )}
            <span className="meta-pill"><Calendar size={14} /> {photo.date}</span>
            <span className="meta-pill"><Eye size={14} /> {photo.views} views</span>
            <button
              className={`meta-pill meta-pill-btn ${isLiked ? 'liked' : ''}`}
              onClick={() => onToggleLike(photo.id)}
              title={isLiked ? 'Unlike photo (-1)' : 'Like photo (+1)'}
            >
              <Heart size={14} fill={isLiked ? '#ff4757' : 'none'} color={isLiked ? '#ff4757' : 'currentColor'} />
              <span>{photo.likes} likes</span>
            </button>
          </div>

          <div className="bottom-meta-right">
            <button className="share-btn" onClick={handleShareLink}>
              {copied ? <Check size={14} /> : <Info size={14} />}
              <span>{copied ? 'Link Copied!' : 'Share Link'}</span>
            </button>
            <button
              className="view-details-btn"
              onClick={() => {
                onClose();
                onSelectPhotoDetail(photo);
              }}
            >
              <ExternalLink size={14} />
              <span>Full Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
