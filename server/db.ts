import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { INITIAL_PHOTOS, CATEGORIES } from '../src/data/mockPhotos';
import type { Photo, ActivityLog, AdminStats, User } from '../src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'photos.db');
const db = new sqlite3.Database(dbPath);

export const initDb = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create Photos Table
      db.run(`
        CREATE TABLE IF NOT EXISTS photos (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          url TEXT NOT NULL,
          category TEXT NOT NULL,
          tags TEXT NOT NULL,
          author_name TEXT NOT NULL,
          author_username TEXT NOT NULL,
          author_avatar TEXT,
          location TEXT,
          exif_make_model TEXT,
          exif_lens TEXT,
          exif_focal_length TEXT,
          exif_aperture TEXT,
          exif_shutter_speed TEXT,
          exif_iso INTEGER,
          likes INTEGER DEFAULT 0,
          views INTEGER DEFAULT 0,
          downloads INTEGER DEFAULT 0,
          date TEXT NOT NULL,
          dimensions TEXT,
          aspect_ratio TEXT,
          is_favorite INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create Categories Table
      db.run(`
        CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY,
          name TEXT UNIQUE NOT NULL,
          description TEXT
        )
      `);

      // Create Users Table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'user',
          avatar TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create Activity Logs Table
      db.run(`
        CREATE TABLE IF NOT EXISTS activity_logs (
          id TEXT PRIMARY KEY,
          action TEXT NOT NULL,
          details TEXT NOT NULL,
          status TEXT DEFAULT 'info',
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create Per-User Favorites Table
      db.run(`
        CREATE TABLE IF NOT EXISTS user_favorites (
          user_id TEXT NOT NULL,
          photo_id TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (user_id, photo_id)
        )
      `);

      // Create Per-User Likes Table
      db.run(`
        CREATE TABLE IF NOT EXISTS user_likes (
          user_id TEXT NOT NULL,
          photo_id TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (user_id, photo_id)
        )
      `, (err) => {
        if (err) {
          console.error('Error creating database tables:', err);
          return reject(err);
        }

        // Auto-seed if empty
        db.get('SELECT COUNT(*) as count FROM photos', (countErr, row: any) => {
          if (!countErr && row.count === 0) {
            seedDatabaseInternal()
              .then(() => resolve())
              .catch(reject);
          } else {
            // Check if default admin exists
            db.get('SELECT COUNT(*) as uCount FROM users', (uErr, uRow: any) => {
              if (!uErr && uRow.uCount === 0) {
                seedUsersInternal();
              }
              resolve();
            });
          }
        });
      });
    });
  });
};

const seedUsersInternal = () => {
  const userStmt = db.prepare('INSERT OR IGNORE INTO users (id, name, username, email, password, role, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)');
  
  // Default Admin Account
  userStmt.run(
    'user-admin-1',
    'Aether Admin',
    'admin',
    'admin@gallery.com',
    'password123',
    'admin',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  );

  // Default Standard User Account
  userStmt.run(
    'user-standard-1',
    'John Doe',
    'john_doe',
    'user@gallery.com',
    'user123',
    'user',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
  );

  userStmt.finalize();
};

const seedDatabaseInternal = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('DELETE FROM photos');
      db.run('DELETE FROM categories');
      db.run('DELETE FROM users');
      db.run('DELETE FROM activity_logs');

      // Insert Initial Categories
      const catStmt = db.prepare('INSERT INTO categories (id, name, description) VALUES (?, ?, ?)');
      CATEGORIES.forEach((cat, index) => {
        catStmt.run(`cat-${index + 1}`, cat.name, cat.description);
      });
      catStmt.finalize();

      // Insert Initial Users
      seedUsersInternal();

      // Insert Initial Photos
      const photoStmt = db.prepare(`
        INSERT INTO photos (
          id, title, description, url, category, tags,
          author_name, author_username, author_avatar, location,
          exif_make_model, exif_lens, exif_focal_length, exif_aperture,
          exif_shutter_speed, exif_iso, likes, views, downloads, date,
          dimensions, aspect_ratio, is_favorite
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      INITIAL_PHOTOS.forEach((photo) => {
        photoStmt.run(
          photo.id,
          photo.title,
          photo.description,
          photo.url,
          photo.category,
          JSON.stringify(photo.tags),
          photo.author.name,
          photo.author.username,
          photo.author.avatar,
          photo.location,
          photo.exif.makeModel,
          photo.exif.lens,
          photo.exif.focalLength,
          photo.exif.aperture,
          photo.exif.shutterSpeed,
          photo.exif.iso,
          photo.likes,
          photo.views,
          photo.downloads,
          photo.date,
          photo.dimensions,
          photo.aspectRatio || 'landscape',
          photo.isFavorite ? 1 : 0
        );
      });
      photoStmt.finalize();

      // Initial Log
      db.run(
        'INSERT INTO activity_logs (id, action, details, status) VALUES (?, ?, ?, ?)',
        [`log-${Date.now()}`, 'SYSTEM_INIT', 'Database seeded with default photos, categories, and users (admin & standard)', 'success']
      );

      resolve();
    });
  });
};

export const seedDatabase = (): Promise<void> => {
  return seedDatabaseInternal();
};

export const getAllPhotos = (): Promise<Photo[]> => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM photos ORDER BY created_at DESC', (err, rows: any[]) => {
      if (err) return reject(err);
      
      const photos: Photo[] = rows.map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description || '',
        url: row.url,
        category: row.category,
        tags: JSON.parse(row.tags || '[]'),
        author: {
          name: row.author_name,
          username: row.author_username,
          avatar: row.author_avatar,
        },
        location: row.location || '',
        exif: {
          makeModel: row.exif_make_model || 'Unknown',
          lens: row.exif_lens || 'Standard',
          focalLength: row.exif_focal_length || '50mm',
          aperture: row.exif_aperture || 'f/2.8',
          shutterSpeed: row.exif_shutter_speed || '1/250s',
          iso: row.exif_iso || 100,
        },
        likes: row.likes || 0,
        views: row.views || 0,
        downloads: row.downloads || 0,
        date: row.date,
        dimensions: row.dimensions || '4000 x 3000',
        aspectRatio: row.aspect_ratio || 'landscape',
        isFavorite: Boolean(row.is_favorite),
      }));

      resolve(photos);
    });
  });
};

export const createPhoto = (photo: Photo): Promise<Photo> => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      INSERT INTO photos (
        id, title, description, url, category, tags,
        author_name, author_username, author_avatar, location,
        exif_make_model, exif_lens, exif_focal_length, exif_aperture,
        exif_shutter_speed, exif_iso, likes, views, downloads, date,
        dimensions, aspect_ratio, is_favorite
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      photo.id,
      photo.title,
      photo.description,
      photo.url,
      photo.category,
      JSON.stringify(photo.tags),
      photo.author.name,
      photo.author.username,
      photo.author.avatar,
      photo.location,
      photo.exif.makeModel,
      photo.exif.lens,
      photo.exif.focalLength,
      photo.exif.aperture,
      photo.exif.shutterSpeed,
      photo.exif.iso,
      photo.likes || 0,
      photo.views || 0,
      photo.downloads || 0,
      photo.date || new Date().toISOString().split('T')[0],
      photo.dimensions || '4000 x 3000',
      photo.aspectRatio || 'landscape',
      photo.isFavorite ? 1 : 0,
      function (err) {
        if (err) return reject(err);
        addLog('PHOTO_CREATE', `Created photo "${photo.title}" (ID: ${photo.id})`, 'success');
        resolve(photo);
      }
    );
  });
};

export const updatePhoto = (id: string, updates: Partial<Photo>): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM photos WHERE id = ?', [id], (err, existingRow: any) => {
      if (err || !existingRow) return reject(err || new Error('Photo not found'));

      const title = updates.title !== undefined ? updates.title : existingRow.title;
      const description = updates.description !== undefined ? updates.description : existingRow.description;
      const category = updates.category !== undefined ? updates.category : existingRow.category;
      const tags = updates.tags !== undefined ? JSON.stringify(updates.tags) : existingRow.tags;
      const authorName = updates.author?.name !== undefined ? updates.author.name : existingRow.author_name;
      const authorUsername = updates.author?.username !== undefined ? updates.author.username : existingRow.author_username;
      const location = updates.location !== undefined ? updates.location : existingRow.location;
      
      const exifMakeModel = updates.exif?.makeModel !== undefined ? updates.exif.makeModel : existingRow.exif_make_model;
      const exifLens = updates.exif?.lens !== undefined ? updates.exif.lens : existingRow.exif_lens;
      const exifFocalLength = updates.exif?.focalLength !== undefined ? updates.exif.focalLength : existingRow.exif_focal_length;
      const exifAperture = updates.exif?.aperture !== undefined ? updates.exif.aperture : existingRow.exif_aperture;
      const exifShutterSpeed = updates.exif?.shutterSpeed !== undefined ? updates.exif.shutterSpeed : existingRow.exif_shutter_speed;
      const exifIso = updates.exif?.iso !== undefined ? updates.exif.iso : existingRow.exif_iso;
      const isFavorite = updates.isFavorite !== undefined ? (updates.isFavorite ? 1 : 0) : existingRow.is_favorite;

      db.run(
        `UPDATE photos SET 
          title = ?, description = ?, category = ?, tags = ?,
          author_name = ?, author_username = ?, location = ?,
          exif_make_model = ?, exif_lens = ?, exif_focal_length = ?,
          exif_aperture = ?, exif_shutter_speed = ?, exif_iso = ?,
          is_favorite = ?
         WHERE id = ?`,
        [
          title, description, category, tags,
          authorName, authorUsername, location,
          exifMakeModel, exifLens, exifFocalLength,
          exifAperture, exifShutterSpeed, exifIso,
          isFavorite, id
        ],
        function (updateErr) {
          if (updateErr) return reject(updateErr);
          addLog('PHOTO_UPDATE', `Updated metadata for "${title}" (ID: ${id})`, 'info');
          resolve();
        }
      );
    });
  });
};

export const deletePhoto = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM photos WHERE id = ?', [id], function (err) {
      if (err) return reject(err);
      addLog('PHOTO_DELETE', `Deleted photo ID ${id} from SQLite database`, 'danger');
      resolve();
    });
  });
};

export const incrementLikes = (id: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.run('UPDATE photos SET likes = likes + 1 WHERE id = ?', [id], function (err) {
      if (err) return reject(err);
      db.get('SELECT title, likes FROM photos WHERE id = ?', [id], (getErr, row: any) => {
        if (getErr) return reject(getErr);
        const newLikes = row ? row.likes : 0;
        addLog('PHOTO_LIKE', `Photo "${row?.title || id}" received a like (+1). Total likes: ${newLikes}`, 'info');
        resolve(newLikes);
      });
    });
  });
};

export const decrementLikes = (id: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.run('UPDATE photos SET likes = MAX(0, likes - 1) WHERE id = ?', [id], function (err) {
      if (err) return reject(err);
      db.get('SELECT title, likes FROM photos WHERE id = ?', [id], (getErr, row: any) => {
        if (getErr) return reject(getErr);
        const newLikes = row ? row.likes : 0;
        addLog('PHOTO_UNLIKE', `Photo "${row?.title || id}" unliked (-1). Total likes: ${newLikes}`, 'info');
        resolve(newLikes);
      });
    });
  });
};

export const incrementViews = (id: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.run('UPDATE photos SET views = views + 1 WHERE id = ?', [id], function (err) {
      if (err) return reject(err);
      db.get('SELECT views FROM photos WHERE id = ?', [id], (getErr, row: any) => {
        if (getErr) return reject(getErr);
        resolve(row ? row.views : 0);
      });
    });
  });
};

// USER AUTHENTICATION & MANAGEMENT
export const getAllUsers = (): Promise<User[]> => {
  return new Promise((resolve, reject) => {
    db.all('SELECT id, name, username, email, role, avatar, created_at FROM users ORDER BY created_at DESC', (err, rows: any[]) => {
      if (err) return reject(err);
      const users: User[] = rows.map((r) => ({
        id: r.id,
        name: r.name,
        username: r.username,
        email: r.email,
        role: r.role,
        avatar: r.avatar,
        createdAt: r.created_at,
      }));
      resolve(users);
    });
  });
};

export const createUser = (name: string, username: string, email: string, password: string, role: 'admin' | 'user' = 'user'): Promise<User> => {
  return new Promise((resolve, reject) => {
    const id = `user-${Date.now()}`;
    const avatar = `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`;

    db.run(
      'INSERT INTO users (id, name, username, email, password, role, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, name, username, email, password, role, avatar],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return reject(new Error('Username or email already registered'));
          }
          return reject(err);
        }

        const newUser: User = { id, name, username, email, role, avatar };
        addLog('USER_REGISTER', `Registered new user "${name}" (@${username}) as ${role.toUpperCase()}`, 'success');
        resolve(newUser);
      }
    );
  });
};

export const authenticateUser = (identifier: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM users WHERE (email = ? OR username = ?) AND password = ?',
      [identifier, identifier, password],
      (err, row: any) => {
        if (err) return reject(err);
        if (!row) return reject(new Error('Invalid email/username or password'));

        const user: User = {
          id: row.id,
          name: row.name,
          username: row.username,
          email: row.email,
          role: row.role,
          avatar: row.avatar,
          createdAt: row.created_at,
        };

        addLog('USER_LOGIN', `User "${user.name}" (@${user.username}) logged in`, 'info');
        resolve(user);
      }
    );
  });
};

export const updateUser = (
  id: string,
  updates: Partial<{ name: string; username: string; email: string; avatar: string; password?: string }>
): Promise<User> => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, existingRow: any) => {
      if (err || !existingRow) return reject(err || new Error('User not found'));

      const name = updates.name !== undefined ? updates.name : existingRow.name;
      const username = updates.username !== undefined ? updates.username : existingRow.username;
      const email = updates.email !== undefined ? updates.email : existingRow.email;
      const avatar = updates.avatar !== undefined ? updates.avatar : existingRow.avatar;
      const password = updates.password ? updates.password : existingRow.password;

      db.run(
        `UPDATE users SET name = ?, username = ?, email = ?, avatar = ?, password = ? WHERE id = ?`,
        [name, username, email, avatar, password, id],
        function (updateErr) {
          if (updateErr) {
            if (updateErr.message.includes('UNIQUE')) {
              return reject(new Error('Username or email is already taken by another user'));
            }
            return reject(updateErr);
          }

          const updatedUser: User = {
            id,
            name,
            username,
            email,
            role: existingRow.role,
            avatar,
            createdAt: existingRow.created_at,
          };

          addLog('USER_UPDATE', `User "${name}" (@${username}) updated their profile details`, 'success');
          resolve(updatedUser);
        }
      );
    });
  });
};

export const deleteUser = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
      if (err) return reject(err);
      addLog('USER_DELETE', `Deleted user ID ${id}`, 'danger');
      resolve();
    });
  });
};

export const getAllCategories = (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM categories', (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

export const createCategory = (name: string, description: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const id = `cat-${Date.now()}`;
    db.run('INSERT INTO categories (id, name, description) VALUES (?, ?, ?)', [id, name, description], function (err) {
      if (err) return reject(err);
      addLog('CATEGORY_CREATE', `Created category "${name}"`, 'success');
      resolve({ id, name, description });
    });
  });
};

export const deleteCategory = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM categories WHERE id = ?', [id], function (err) {
      if (err) return reject(err);
      addLog('CATEGORY_DELETE', `Deleted category ID ${id}`, 'warning');
      resolve();
    });
  });
};

export const getActivityLogs = (): Promise<ActivityLog[]> => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM activity_logs ORDER BY timestamp DESC LIMIT 50', (err, rows: any[]) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

export const addLog = (action: string, details: string, status: 'success' | 'warning' | 'info' | 'danger' = 'info'): void => {
  const id = `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  db.run('INSERT INTO activity_logs (id, action, details, status) VALUES (?, ?, ?, ?)', [id, action, details, status]);
};

export const getAdminStats = (): Promise<AdminStats> => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      let stats: Partial<AdminStats> = { status: 'Connected to SQLite Database' };
      
      let dbSizeKB = 0;
      if (fs.existsSync(dbPath)) {
        dbSizeKB = Math.round(fs.statSync(dbPath).size / 1024);
      }
      stats.dbSizeKB = dbSizeKB;

      db.get(`
        SELECT 
          COUNT(*) as totalPhotos,
          SUM(views) as totalViews,
          SUM(likes) as totalLikes,
          SUM(downloads) as totalDownloads
        FROM photos
      `, (err, row: any) => {
        if (err) return reject(err);
        stats.totalPhotos = row.totalPhotos || 0;
        stats.totalViews = row.totalViews || 0;
        stats.totalLikes = row.totalLikes || 0;
        stats.totalDownloads = row.totalDownloads || 0;

        db.get('SELECT COUNT(*) as totalCategories FROM categories', (catErr, catRow: any) => {
          if (catErr) return reject(catErr);
          stats.totalCategories = catRow.totalCategories || 0;

          db.get('SELECT COUNT(*) as totalUsers FROM users', (uErr, uRow: any) => {
            if (uErr) return reject(uErr);
            stats.totalUsers = uRow.totalUsers || 0;
            resolve(stats as AdminStats);
          });
        });
      });
    });
  });
};

export const getUserFavorites = (userId: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    db.all('SELECT photo_id FROM user_favorites WHERE user_id = ?', [userId], (err, rows: any[]) => {
      if (err) return reject(err);
      const photoIds = (rows || []).map((r) => r.photo_id);
      resolve(photoIds);
    });
  });
};

export const toggleUserFavorite = (
  userId: string,
  photoId: string
): Promise<{ favorites: string[]; isFavorite: boolean }> => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT 1 FROM user_favorites WHERE user_id = ? AND photo_id = ?',
      [userId, photoId],
      (err, row: any) => {
        if (err) return reject(err);

        if (row) {
          db.run('DELETE FROM user_favorites WHERE user_id = ? AND photo_id = ?', [userId, photoId], (delErr) => {
            if (delErr) return reject(delErr);
            getUserFavorites(userId)
              .then((favs) => resolve({ favorites: favs, isFavorite: false }))
              .catch(reject);
          });
        } else {
          db.run('INSERT INTO user_favorites (user_id, photo_id) VALUES (?, ?)', [userId, photoId], (insErr) => {
            if (insErr) return reject(insErr);
            getUserFavorites(userId)
              .then((favs) => resolve({ favorites: favs, isFavorite: true }))
              .catch(reject);
          });
        }
      }
    );
  });
};

export const getUserLikes = (userId: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    db.all('SELECT photo_id FROM user_likes WHERE user_id = ?', [userId], (err, rows: any[]) => {
      if (err) return reject(err);
      resolve((rows || []).map((r) => r.photo_id));
    });
  });
};

export const toggleUserLike = (
  userId: string,
  photoId: string,
  action: 'like' | 'unlike'
): Promise<{ likes: number; userLikedPhotos: string[] }> => {
  return new Promise((resolve, reject) => {
    if (action === 'like') {
      db.run('INSERT OR IGNORE INTO user_likes (user_id, photo_id) VALUES (?, ?)', [userId, photoId], (err) => {
        if (err) return reject(err);
        incrementLikes(photoId)
          .then((newLikes) => {
            getUserLikes(userId)
              .then((userLikes) => resolve({ likes: newLikes, userLikedPhotos: userLikes }))
              .catch(reject);
          })
          .catch(reject);
      });
    } else {
      db.run('DELETE FROM user_likes WHERE user_id = ? AND photo_id = ?', [userId, photoId], (err) => {
        if (err) return reject(err);
        decrementLikes(photoId)
          .then((newLikes) => {
            getUserLikes(userId)
              .then((userLikes) => resolve({ likes: newLikes, userLikedPhotos: userLikes }))
              .catch(reject);
          })
          .catch(reject);
      });
    }
  });
};

