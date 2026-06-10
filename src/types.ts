export interface User {
  id: number;
  name: string;
  username: string;
  avatar_url?: string | null;
  role:string;
  permissions: string[]; // Permissions Spatie envoyées par le backend
  created_at: string;
  updated_at: string;
  
}

export interface Article {
  id: number;
  user_id: number;
  title: string;
  slug: string;
  summary: string | null;
  content: string | null;
  image_path: string | null;
  is_hero: boolean;
  created_at: string;
  updated_at: string;
  user?: User; // via Eager Loading
}

export interface Short {
  id: number;
  user_id: number;
  text: string | null;
  status: 'draft' | 'published' | 'archived';
  raw_path: string | null;
  processed_path: string | null;
  thumbnail_path: string | null;
  duration: number | null;
  created_at: string;
  updated_at: string;
  user?: User;
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

// Authentication Interfaces
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

export interface AuthResponse {
  message: string;
  data: User;
  token: string;
}
