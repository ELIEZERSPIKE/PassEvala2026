export interface Short {
  id: number;
  user_id: number;
  text: string | null;
  status: 'draft' | 'published' | 'archived';
  raw_path: string | null;
  processed_path: string | null;
  thumbnail_path: string | null;
  duration: number | null;
  likes_count: number;
  comments_count: number;
  reactions: Record<string, number> | null;
  is_liked?: boolean; //  retourné par likeStatus
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    username: string;
  };
}

// ✅ Nouveau
export interface ShortComment {
  id: number;
  short_id: number;
  user_id: number;
  body: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    username: string;
  };
}

export interface ShortPayload {
  text?: string;
  video: File;
}

export interface ShortUpdatePayload {
  text?: string;
  status?: 'draft' | 'published' | 'archived';
  video?: File | null;
}