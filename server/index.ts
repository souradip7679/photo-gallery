import express, { Request, Response } from 'express';
import cors from 'cors';
import {
  initDb,
  getAllPhotos,
  createPhoto,
  updatePhoto,
  deletePhoto,
  incrementLikes,
  decrementLikes,
  incrementViews,
  getAllCategories,
  createCategory,
  deleteCategory,
  getAllUsers,
  createUser,
  authenticateUser,
  updateUser,
  deleteUser,
  getUserFavorites,
  toggleUserFavorite,
  getUserLikes,
  toggleUserLike,
  getActivityLogs,
  getAdminStats,
  seedDatabase,
  addLog,
} from './db';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize SQLite database
initDb()
  .then(() => console.log('SQLite Database Initialized Successfully'))
  .catch((err) => console.error('Failed to initialize SQLite DB:', err));

// 1. Health Check
app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    const stats = await getAdminStats();
    res.json({ status: 'ok', database: 'SQLite', stats });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// 2. Authentication REST API
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, username, email, password, role } = req.body;
    if (!name || !username || !email || !password) {
      return res.status(400).json({ error: 'Name, username, email, and password are required' });
    }

    const user = await createUser(name, username, email, password, role || 'user');
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Email/username and password are required' });
    }

    const user = await authenticateUser(identifier, password);
    res.json(user);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
});

app.get('/api/auth/users', async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/auth/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedUser = await updateUser(id, req.body);
    res.json(updatedUser);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/auth/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteUser(id);
    res.json({ message: 'User deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2.5 User Favorites API
app.get('/api/users/:userId/favorites', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const favorites = await getUserFavorites(userId);
    res.json(favorites);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users/:userId/favorites/:photoId', async (req: Request, res: Response) => {
  try {
    const { userId, photoId } = req.params;
    const result = await toggleUserFavorite(userId, photoId);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2.6 User Likes API
app.get('/api/users/:userId/likes', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const userLikes = await getUserLikes(userId);
    res.json(userLikes);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users/:userId/likes/:photoId', async (req: Request, res: Response) => {
  try {
    const { userId, photoId } = req.params;
    const { action } = req.body || {};
    const result = await toggleUserLike(userId, photoId, action || 'like');
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Photos REST API
app.get('/api/photos', async (_req: Request, res: Response) => {
  try {
    const photos = await getAllPhotos();
    res.json(photos);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/photos', async (req: Request, res: Response) => {
  try {
    const newPhoto = req.body;
    if (!newPhoto.title || !newPhoto.url) {
      return res.status(400).json({ error: 'Title and URL are required' });
    }
    const created = await createPhoto(newPhoto);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/photos/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await updatePhoto(id, req.body);
    res.json({ message: 'Photo updated successfully', id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/photos/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deletePhoto(id);
    res.json({ message: 'Photo deleted successfully', id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/photos/:id/like', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { action } = req.body || {};
    const likes = action === 'unlike' ? await decrementLikes(id) : await incrementLikes(id);
    res.json({ likes });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/photos/:id/view', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const views = await incrementViews(id);
    res.json({ views });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Categories REST API
app.get('/api/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await getAllCategories();
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/categories', async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name is required' });
    const category = await createCategory(name, description || '');
    res.status(201).json(category);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/categories/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteCategory(id);
    res.json({ message: 'Category deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Admin REST API
app.get('/api/admin/stats', async (_req: Request, res: Response) => {
  try {
    const stats = await getAdminStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/logs', async (_req: Request, res: Response) => {
  try {
    const logs = await getActivityLogs();
    res.json(logs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/seed', async (_req: Request, res: Response) => {
  try {
    await seedDatabase();
    addLog('DATABASE_RESET', 'Database reset and re-seeded with original records', 'warning');
    res.json({ message: 'Database re-seeded successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
