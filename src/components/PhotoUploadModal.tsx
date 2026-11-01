import React, { useState } from 'react';
import type { Photo, CategoryType } from '../types';
import { CATEGORIES } from '../data/mockPhotos';
import { X, UploadCloud, Plus } from 'lucide-react';

interface PhotoUploadModalProps {
  onClose: () => void;
  onAddPhoto: (newPhoto: Photo) => void;
}

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({ onClose, onAddPhoto }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<CategoryType>('Landscape');
  const [authorName, setAuthorName] = useState('');
  const [location, setLocation] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim() || !authorName.trim()) return;

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newPhoto: Photo = {
      id: `photo-user-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'User uploaded high definition photo',
      url: url.trim(),
      category: category,
      tags: tagsArray.length > 0 ? tagsArray : ['UserUpload', category],
      author: {
        name: authorName.trim(),
        username: `@${authorName.trim().toLowerCase().replace(/\s+/g, '_')}`,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      },
      location: location.trim() || 'Global Location',
      exif: {
        makeModel: 'Custom Camera',
        lens: '50mm Prime f/1.8',
        focalLength: '50mm',
        aperture: 'f/1.8',
        shutterSpeed: '1/200s',
        iso: 100,
      },
      likes: 1,
      views: 12,
      downloads: 0,
      date: new Date().toISOString().split('T')[0],
      dimensions: '4000 x 3000',
      aspectRatio: 'landscape',
      isFavorite: false,
    };

    onAddPhoto(newPhoto);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="upload-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="upload-modal-header">
          <div className="header-title">
            <UploadCloud size={22} className="upload-icon" />
            <h2>Add New Photo</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label>Photo Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Sunset Over Golden Gate Bridge"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Image Direct URL *</label>
            <input
              type="url"
              required
              placeholder="https://images.unsplash.com/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          {url && (
            <div className="image-preview-wrapper">
              <span>Preview:</span>
              <img src={url} alt="Preview" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as CategoryType)}>
                {CATEGORIES.filter((c) => c.name !== 'All').map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Photographer Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Morgan"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                placeholder="e.g. San Francisco, USA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Tags (comma separated)</label>
              <input
                type="text"
                placeholder="e.g. Sunset, Bridge, Ocean"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              rows={3}
              placeholder="Provide context or story behind the photo..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-upload-btn">
              <Plus size={18} /> Publish Photo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
