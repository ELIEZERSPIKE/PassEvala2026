export type ShortStatus = 'draft' | 'published' | 'archived';

export interface ShortUser {
  id: number;
  name: string;
  username: string;
}

export interface Short {
  id: number;
  user_id: number;
  text?: string | null;
  status: ShortStatus;
  raw_path?: string | null;
  processed_path?: string | null;
  thumbnail_path?: string | null;
  user?: ShortUser;
  created_at: string;
  updated_at: string;
}

export interface ShortPayload {
  text?: string | null;
  video: File;
}

export interface ShortUpdatePayload {
  text?: string | null;
  status?: ShortStatus;
  video?: File | null; 
}