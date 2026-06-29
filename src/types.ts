
// types/index.ts

export interface User {
  id: number;
  name: string | null;
  username: string;
  phone: string | null;
  role: string;
  permissions: string[];
  is_active: boolean;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  message: string;
  data: User;      // ← correspond au retour Laravel { message, data, token }
  token: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  name?: string;
  username: string;
  phone?: string;
  password: string;
  password_confirmation: string;
}

export interface Article {
  id: number;
  title: string;
  slug?: string;
  summary: string | null;
  content: string;
  image_path: string;
  is_hero: boolean;
  category?: string | null;
  user_id: number;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
  
  likes_count: number;
  comments_count: number;
  is_liked_by_user: boolean;
  
  // Relations
  user?: {
    id: number;
    name: string;
    username: string;
    role?: string;
  };
  comments?: Comment[];
  likes?: Like[];
}

export interface Comment {
  id: number;
  user_id: number;
  article_id: number;
  parent_id: number | null;
  content: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    username: string;
  };
  replies?: Comment[];
}

export interface Like {
  id: number;
  user_id: number;
  article_id: number;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    username: string;
  };
}

// ✅ Response standard de l'API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}


interface Short {
  id: number;
  text: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  duration: number | null;
  likes_count: number;        // 
  comments_count: number;     // 
  reactions: Record<string, number> | null; // 
  user: { id: number; name: string; username: string };
}

export interface ShortPayload {
  text?: string;
  video: File;
}

export interface ShortUpdatePayload {
  text?: string;
  status?: 'draft' | 'published' | 'archived';
  video?: File | null; // ✅ Peut être null ou undefined
}
export interface FlashInfo {
  id: number;
  title: string;
  link: string | null;
  created_at: string;
  updated_at: string;
}

export interface BonPlan {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  image_path: string | null;
  created_at: string;
  updated_at: string;
}

export interface UsefulNumber {
  id: number;
  name: string;
  phone_number: string;
  color_tag: string | null;
  created_at: string;
  updated_at: string;
}

export interface Sponsor {
  id: number;
  name: string;
  company_location: string | null;
  address: string | null;
  email: string | null;
  phone: string | null;
  website_url: string | null;
  is_active: boolean;
  banner_url?: string | null; // Spatie Media
  created_at: string;
  updated_at: string;
}

// Keep the hardcoded calendar as requested by previous implementations or keep it for now if no model exists for it
export interface CalendarEvent {
  id: string;
  date: string;
  time: string;
  title: string;
  location: string;
  type: 'Wrestling' | 'Culture' | 'Official';
}


