import React from 'react';
import { CATEGORIES } from '../data/mockPhotos';
import type { CategoryType, Photo } from '../types';
import { Layers, Compass, Building2, Flame, Eye, User, Sparkles, Zap } from 'lucide-react';

interface CategoryFilterProps {
  activeCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  photos: Photo[];
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'All':
      return <Layers size={16} />;
    case 'Landscape':
      return <Compass size={16} />;
    case 'Architecture':
      return <Building2 size={16} />;
    case 'Wildlife':
      return <Flame size={16} />;
    case 'Street':
      return <Eye size={16} />;
    case 'Portrait':
      return <User size={16} />;
    case 'Abstract':
      return <Sparkles size={16} />;
    case 'Cyberpunk':
      return <Zap size={16} />;
    default:
      return <Layers size={16} />;
  }
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onSelectCategory,
  photos,
}) => {
  const categoryCounts = React.useMemo(() => {
    return photos.reduce((acc, photo) => {
      acc[photo.category] = (acc[photo.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [photos]);

  return (
    <div className="category-filter-wrapper">
      <div className="category-scroll-container">
        {CATEGORIES.map((cat) => {
          const count = cat.name === 'All' ? photos.length : categoryCounts[cat.name] || 0;
          const isActive = activeCategory === cat.name;

          return (
            <button
              key={cat.name}
              className={`category-chip ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.name as CategoryType)}
              title={cat.description}
            >
              <span className="chip-icon">{getCategoryIcon(cat.name)}</span>
              <span className="chip-name">{cat.name}</span>
              <span className="chip-count">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
