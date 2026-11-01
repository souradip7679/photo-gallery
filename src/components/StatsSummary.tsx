import React, { useMemo } from 'react';
import type { Photo } from '../types';
import { Image, Heart, Eye, ThumbsUp, Layers } from 'lucide-react';

interface StatsSummaryProps {
  photos: Photo[];
  favoritesCount: number;
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({ photos, favoritesCount }) => {
  // Array reduce operations for stats
  const metrics = useMemo(() => {
    const totalViews = photos.reduce((acc, p) => acc + p.views, 0);
    const totalLikes = photos.reduce((acc, p) => acc + p.likes, 0);
    const uniqueCategories = new Set(photos.map((p) => p.category)).size;

    return {
      totalViews,
      totalLikes,
      uniqueCategories,
    };
  }, [photos]);

  return (
    <div className="stats-summary-banner">
      <div className="stat-pill">
        <div className="stat-icon-bg photo">
          <Image size={18} />
        </div>
        <div className="stat-text">
          <span className="stat-num">{photos.length}</span>
          <span className="stat-lbl">Total Photos</span>
        </div>
      </div>

      <div className="stat-pill">
        <div className="stat-icon-bg heart">
          <Heart size={18} />
        </div>
        <div className="stat-text">
          <span className="stat-num">{favoritesCount}</span>
          <span className="stat-lbl">Favorites</span>
        </div>
      </div>

      <div className="stat-pill">
        <div className="stat-icon-bg views">
          <Eye size={18} />
        </div>
        <div className="stat-text">
          <span className="stat-num">{metrics.totalViews.toLocaleString()}</span>
          <span className="stat-lbl">Total Views</span>
        </div>
      </div>

      <div className="stat-pill">
        <div className="stat-icon-bg likes">
          <ThumbsUp size={18} />
        </div>
        <div className="stat-text">
          <span className="stat-num">{metrics.totalLikes.toLocaleString()}</span>
          <span className="stat-lbl">Total Likes</span>
        </div>
      </div>

      <div className="stat-pill">
        <div className="stat-icon-bg categories">
          <Layers size={18} />
        </div>
        <div className="stat-text">
          <span className="stat-num">{metrics.uniqueCategories}</span>
          <span className="stat-lbl">Categories</span>
        </div>
      </div>
    </div>
  );
};
