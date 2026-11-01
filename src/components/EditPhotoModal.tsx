import React, { useState } from 'react';
import type { Photo, CategoryType } from '../types';
import { CATEGORIES } from '../data/mockPhotos';
import { X, Save, Edit3, Camera } from 'lucide-react';

interface EditPhotoModalProps {
  photo: Photo;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Photo>) => void;
}

export const EditPhotoModal: React.FC<EditPhotoModalProps> = ({ photo, onClose, onSave }) => {
  const [title, setTitle] = useState(photo.title);
  const [description, setDescription] = useState(photo.description);
  const [category, setCategory] = useState<CategoryType>(photo.category);
  const [authorName, setAuthorName] = useState(photo.author.name);
  const [location, setLocation] = useState(photo.location);
  const [tagsInput, setTagsInput] = useState(photo.tags.join(', '));

  // EXIF fields
  const [makeModel, setMakeModel] = useState(photo.exif.makeModel);
  const [lens, setLens] = useState(photo.exif.lens);
  const [focalLength, setFocalLength] = useState(photo.exif.focalLength);
  const [aperture, setAperture] = useState(photo.exif.aperture);
  const [shutterSpeed, setShutterSpeed] = useState(photo.exif.shutterSpeed);
  const [iso, setIso] = useState(photo.exif.iso);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const updates: Partial<Photo> = {
      title: title.trim(),
      description: description.trim(),
      category,
      tags: tagsArray,
      author: {
        ...photo.author,
        name: authorName.trim(),
      },
      location: location.trim(),
      exif: {
        makeModel,
        lens,
        focalLength,
        aperture,
        shutterSpeed,
        iso: Number(iso),
      },
    };

    onSave(photo.id, updates);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="upload-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="upload-modal-header">
          <div className="header-title">
            <Edit3 size={22} className="upload-icon" />
            <h2>Edit Photo Metadata (ID: {photo.id})</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as CategoryType)}>
                {CATEGORIES.filter((c) => c.name !== 'All').map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Photographer Name</label>
              <input
                type="text"
                required
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
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Tags (comma separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* EXIF Parameters Section */}
          <div className="exif-edit-section">
            <h4 className="exif-edit-title"><Camera size={16} /> Camera EXIF Parameters</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Camera Model</label>
                <input type="text" value={makeModel} onChange={(e) => setMakeModel(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Lens Spec</label>
                <input type="text" value={lens} onChange={(e) => setLens(e.target.value)} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Focal Length</label>
                <input type="text" value={focalLength} onChange={(e) => setFocalLength(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Aperture</label>
                <input type="text" value={aperture} onChange={(e) => setAperture(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Shutter Speed</label>
                <input type="text" value={shutterSpeed} onChange={(e) => setShutterSpeed(e.target.value)} />
              </div>
              <div className="form-group">
                <label>ISO Speed</label>
                <input type="number" value={iso} onChange={(e) => setIso(Number(e.target.value))} />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-upload-btn">
              <Save size={18} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
