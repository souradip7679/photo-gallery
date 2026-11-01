import React, { useState, useEffect } from 'react';
import type { Photo, ActivityLog, AdminStats, User } from '../types';
import { apiService } from '../services/api';
import { EditPhotoModal } from './EditPhotoModal';
import {
  Lock,
  Database,
  RefreshCw,
  Trash2,
  Edit,
  Plus,
  Search,
  Eye,
  Heart,
  Server,
  Activity,
  Layers,
  Users,
  UserX,
  LogIn
} from 'lucide-react';

interface AdminDashboardProps {
  photos: Photo[];
  currentUser: User | null;
  onRefreshPhotos: () => void;
  onOpenLightbox: (photo: Photo) => void;
  onOpenAuth: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  photos,
  currentUser,
  onRefreshPhotos,
  onOpenLightbox,
  onOpenAuth,
}) => {
  // Admin Data state
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  
  // New Category State
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [categoryMsg, setCategoryMsg] = useState('');

  const isAdmin = currentUser?.role === 'admin';

  // Fetch admin stats, logs & registered users
  const fetchAdminData = async () => {
    const statsData = await apiService.getAdminStats();
    const logsData = await apiService.getActivityLogs();
    const usersData = await apiService.getUsers();
    setStats(statsData);
    setLogs(logsData);
    setUsersList(usersData);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  // Delete Photo Action
  const handleDeletePhoto = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}" from the SQLite database?`)) {
      await apiService.deletePhoto(id);
      onRefreshPhotos();
      fetchAdminData();
    }
  };

  // Batch Delete Action
  const handleBatchDelete = async () => {
    if (selectedPhotoIds.length === 0) return;
    if (window.confirm(`Delete ${selectedPhotoIds.length} selected photos permanently?`)) {
      for (const id of selectedPhotoIds) {
        await apiService.deletePhoto(id);
      }
      setSelectedPhotoIds([]);
      onRefreshPhotos();
      fetchAdminData();
    }
  };

  // Edit Save Handler
  const handleSaveEdit = async (id: string, updates: Partial<Photo>) => {
    await apiService.updatePhoto(id, updates);
    onRefreshPhotos();
    fetchAdminData();
  };

  // Delete User Handler
  const handleDeleteUser = async (id: string, name: string) => {
    if (window.confirm(`Delete user "${name}" from SQLite database?`)) {
      await apiService.deleteUser(id);
      fetchAdminData();
    }
  };

  // Database Seed Action
  const handleReseedDb = async () => {
    if (window.confirm('Re-seed database with default records? Custom uploads will be reset.')) {
      await apiService.seedDatabase();
      onRefreshPhotos();
      fetchAdminData();
    }
  };

  // Add Category Handler
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      await apiService.createPhoto({
        id: `cat-${Date.now()}`,
        title: newCatName,
        category: newCatName as any,
        url: '',
        description: newCatDesc,
        tags: [],
        author: { name: 'Admin', avatar: '', username: '@admin' },
        location: '',
        exif: { makeModel: '', lens: '', focalLength: '', aperture: '', shutterSpeed: '', iso: 100 },
        likes: 0,
        views: 0,
        downloads: 0,
        date: '',
        dimensions: '',
      });
      setNewCatName('');
      setNewCatDesc('');
      setCategoryMsg(`Category "${newCatName}" added successfully!`);
      setTimeout(() => setCategoryMsg(''), 3000);
      fetchAdminData();
    } catch {
      setCategoryMsg('Error adding category');
    }
  };

  // Filter photos in datatable
  const filteredPhotos = photos.filter((p) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.author.name.toLowerCase().includes(q)
    );
  });

  // Select all checkbox handler
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedPhotoIds(filteredPhotos.map((p) => p.id));
    } else {
      setSelectedPhotoIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedPhotoIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // If NOT Admin -> Show Auth Restriction Notice
  if (!isAdmin) {
    return (
      <div className="admin-lock-screen">
        <div className="lock-card">
          <div className="lock-icon-wrapper">
            <Lock size={36} />
          </div>
          <h2>Administrator Access Required</h2>
          <p>
            You are currently {currentUser ? `signed in as "${currentUser.name}" (Standard User)` : 'not signed in'}.
            Access to the SQLite Database & Admin Dashboard is restricted to Admin accounts.
          </p>

          <button className="unlock-btn" onClick={onOpenAuth}>
            <LogIn size={18} /> Sign In as Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      {/* Top Header */}
      <div className="admin-header">
        <div className="admin-title-group">
          <Server size={28} className="admin-icon" />
          <div>
            <h1>SQLite Database & Admin Management Console</h1>
            <p>Welcome back, <strong>{currentUser.name}</strong>! Managed records, users, and audit logs.</p>
          </div>
        </div>
      </div>

      {/* Database Health & Metrics Card */}
      <div className="admin-db-status-card">
        <div className="db-status-header">
          <div className="status-indicator">
            <span className="live-dot" />
            <span className="status-label">{stats?.status || 'Connected to SQLite Database'}</span>
          </div>

          <button className="reseed-btn" onClick={handleReseedDb}>
            <RefreshCw size={14} /> Re-seed SQLite DB
          </button>
        </div>

        <div className="admin-stats-grid">
          <div className="admin-stat-box">
            <Database size={20} className="stat-ic photo" />
            <div>
              <span className="stat-val">{stats?.totalPhotos || photos.length}</span>
              <span className="stat-lbl">Photos in SQLite DB</span>
            </div>
          </div>

          <div className="admin-stat-box">
            <Users size={20} className="stat-ic cat" />
            <div>
              <span className="stat-val">{stats?.totalUsers || usersList.length || 2}</span>
              <span className="stat-lbl">Registered Users</span>
            </div>
          </div>

          <div className="admin-stat-box">
            <Eye size={20} className="stat-ic views" />
            <div>
              <span className="stat-val">{(stats?.totalViews || 0).toLocaleString()}</span>
              <span className="stat-lbl">Total API Views</span>
            </div>
          </div>

          <div className="admin-stat-box">
            <Heart size={20} className="stat-ic likes" />
            <div>
              <span className="stat-val">{(stats?.totalLikes || 0).toLocaleString()}</span>
              <span className="stat-lbl">Total DB Likes</span>
            </div>
          </div>

          <div className="admin-stat-box">
            <Server size={20} className="stat-ic storage" />
            <div>
              <span className="stat-val">{stats?.dbSizeKB || 64} KB</span>
              <span className="stat-lbl">Database File Size</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Photo Datatable Section */}
      <div className="admin-section-card">
        <div className="section-card-header">
          <div className="header-left">
            <h2>Photo Records Manager</h2>
            <span className="record-count-badge">{filteredPhotos.length} Records</span>
          </div>

          <div className="header-actions">
            {selectedPhotoIds.length > 0 && (
              <button className="batch-delete-btn" onClick={handleBatchDelete}>
                <Trash2 size={16} /> Delete Selected ({selectedPhotoIds.length})
              </button>
            )}

            <div className="table-search-wrapper">
              <Search size={16} className="search-ic" />
              <input
                type="text"
                placeholder="Filter by title, ID, category..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Datatable */}
        <div className="datatable-scroll-wrapper">
          <table className="admin-datatable">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    checked={selectedPhotoIds.length === filteredPhotos.length && filteredPhotos.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th style={{ width: '80px' }}>Preview</th>
                <th>Photo ID & Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Likes / Views</th>
                <th>Date</th>
                <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPhotos.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-table-cell">
                    No photo records found in SQLite database.
                  </td>
                </tr>
              ) : (
                filteredPhotos.map((photo) => {
                  const isSelected = selectedPhotoIds.includes(photo.id);
                  return (
                    <tr key={photo.id} className={isSelected ? 'row-selected' : ''}>
                      <td>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(photo.id)}
                        />
                      </td>
                      <td>
                        <img
                          src={photo.url}
                          alt={photo.title}
                          className="table-thumb"
                          onClick={() => onOpenLightbox(photo)}
                        />
                      </td>
                      <td>
                        <div className="table-photo-meta">
                          <span className="photo-title-text">{photo.title}</span>
                          <span className="photo-id-text">ID: {photo.id}</span>
                        </div>
                      </td>
                      <td>
                        <span className="table-cat-badge">{photo.category}</span>
                      </td>
                      <td>
                        <span className="author-text">{photo.author.name}</span>
                      </td>
                      <td>
                        <div className="stats-inline">
                          <span className="stat-pill-like" title="Total DB Likes"><Heart size={14} fill="#ff4757" color="#ff4757" /> {photo.likes.toLocaleString()}</span>
                          <span className="stat-pill-view" title="Total Views"><Eye size={14} color="#94a3b8" /> {photo.views.toLocaleString()}</span>
                        </div>
                      </td>
                      <td>
                        <span className="date-text">{photo.date}</span>
                      </td>
                      <td>
                        <div className="table-actions-cell">
                          <button
                            className="action-btn edit"
                            onClick={() => setEditingPhoto(photo)}
                            title="Edit Record"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => handleDeletePhoto(photo.id, photo.title)}
                            title="Delete Record"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Users Management Section */}
      <div className="admin-section-card">
        <div className="section-card-header">
          <div className="header-left">
            <h2><Users size={20} /> User Accounts Manager</h2>
            <span className="record-count-badge">{usersList.length} Registered Users</span>
          </div>
        </div>

        <div className="datatable-scroll-wrapper">
          <table className="admin-datatable">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Avatar</th>
                <th>Full Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created Date</th>
                <th style={{ width: '80px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((usr) => (
                <tr key={usr.id}>
                  <td>
                    <img src={usr.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} alt={usr.name} className="table-thumb" />
                  </td>
                  <td><strong>{usr.name}</strong></td>
                  <td><code>@{usr.username}</code></td>
                  <td>{usr.email}</td>
                  <td>
                    <span className={`role-tag role-${usr.role}`}>
                      {usr.role.toUpperCase()}
                    </span>
                  </td>
                  <td>{usr.createdAt ? new Date(usr.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    {usr.username !== 'admin' && (
                      <button
                        className="action-btn delete"
                        onClick={() => handleDeleteUser(usr.id, usr.name)}
                        title="Delete User"
                      >
                        <UserX size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Manager & Audit Log Row */}
      <div className="admin-bottom-grid">
        {/* Category Manager */}
        <div className="admin-card category-manager">
          <h3><Layers size={18} /> Category Manager</h3>
          <p className="card-subtext">Add custom photo categories into SQLite database.</p>

          <form onSubmit={handleAddCategory} className="cat-form">
            <div className="form-group">
              <label>Category Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Vintage, Wildlife Macro"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                placeholder="Short description..."
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
              />
            </div>
            <button type="submit" className="add-cat-btn">
              <Plus size={16} /> Add Category
            </button>
            {categoryMsg && <span className="cat-msg">{categoryMsg}</span>}
          </form>
        </div>

        {/* Activity Audit Logs */}
        <div className="admin-card activity-logs">
          <h3><Activity size={18} /> Live Database Activity Logs</h3>
          <p className="card-subtext">Audit trail of API operations & SQLite DB events.</p>

          <div className="logs-scroll-container">
            {logs.length === 0 ? (
              <p className="no-logs">No activity logs recorded yet.</p>
            ) : (
              <div className="logs-list">
                {logs.map((log) => (
                  <div key={log.id} className={`log-item status-${log.status || 'info'}`}>
                    <div className="log-top">
                      <span className="log-action">{log.action}</span>
                      <span className="log-time">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="log-details">{log.details}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingPhoto && (
        <EditPhotoModal
          photo={editingPhoto}
          onClose={() => setEditingPhoto(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};
