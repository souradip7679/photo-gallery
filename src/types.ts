export type CategoryType = 
  | 'All'
  | 'Landscape'
  | 'Architecture'
  | 'Wildlife'
  | 'Street'
  | 'Portrait'
  | 'Abstract'
  | 'Cyberpunk'
  | string;

export interface CameraEXIF {
  makeModel: string;
  lens: string;
  focalLength: string;
  aperture: string;
  shutterSpeed: string;
  iso: number;
}

export interface Photo {
  id: string;
  title: string;
  description: string;
  url: string;
  category: CategoryType;
  tags: string[];
  author: {
    name: string;
    avatar: string;
    username: string;
  };
  location: string;
  exif: CameraEXIF;
  likes: number;
  views: number;
  downloads: number;
  date: string;
  dimensions: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape';
  isFavorite?: boolean;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
  createdAt?: string;
}

export type SortOption = 'date-desc' | 'date-asc' | 'likes-desc' | 'views-desc' | 'title-asc';
export type ViewMode = 'grid' | 'masonry' | 'list';
export type ActiveTab = 'gallery' | 'favorites' | 'detail' | 'admin';

export interface HTMLToJSXResult {
  jsx: string;
  transformations: string[];
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'info' | 'danger';
}

export interface AdminStats {
  totalPhotos: number;
  totalCategories: number;
  totalUsers: number;
  totalViews: number;
  totalLikes: number;
  totalDownloads: number;
  dbSizeKB: number;
  status: string;
}
