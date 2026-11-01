import React from 'react';
import { LayoutGrid, Grid2X2, ListFilter, ArrowUpDown, X, Tag } from 'lucide-react';
import type { SortOption, ViewMode } from '../types';

interface FilterBarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  sortOption: SortOption;
  setSortOption: (sort: SortOption) => void;
  selectedTag: string | null;
  onClearTag: () => void;
  filteredCount: number;
  totalCount: number;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  viewMode,
  setViewMode,
  sortOption,
  setSortOption,
  selectedTag,
  onClearTag,
  filteredCount,
  totalCount,
  onResetFilters,
}) => {
  const isFiltered = filteredCount !== totalCount || selectedTag !== null;

  return (
    <div className="filter-bar-container">
      <div className="filter-left-section">
        <span className="results-counter">
          Showing <strong>{filteredCount}</strong> of {totalCount} photos
        </span>

        {selectedTag && (
          <div className="active-tag-badge">
            <Tag size={13} />
            <span>Tag: #{selectedTag}</span>
            <button onClick={onClearTag} className="remove-tag-btn" title="Remove tag filter">
              <X size={12} />
            </button>
          </div>
        )}

        {isFiltered && (
          <button className="reset-filters-btn" onClick={onResetFilters}>
            Reset All Filters
          </button>
        )}
      </div>

      <div className="filter-right-section">
        {/* Sort selector */}
        <div className="sort-dropdown-wrapper">
          <ArrowUpDown size={16} className="sort-icon" />
          <select
            className="sort-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="likes-desc">Most Liked ❤️</option>
            <option value="views-desc">Most Viewed 👁️</option>
            <option value="title-asc">Title (A-Z)</option>
          </select>
        </div>

        {/* View Mode Switcher */}
        <div className="view-mode-toggle">
          <button
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid View"
          >
            <LayoutGrid size={18} />
          </button>
          <button
            className={`view-btn ${viewMode === 'masonry' ? 'active' : ''}`}
            onClick={() => setViewMode('masonry')}
            title="Masonry View"
          >
            <Grid2X2 size={18} />
          </button>
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="Compact List View"
          >
            <ListFilter size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
