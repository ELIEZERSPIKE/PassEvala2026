export interface Short {
  id: number;
  user_id: number;
  text: string | null;
  status: 'draft' | 'published' | 'archived';
  raw_path: string | null;
  processed_path: string | null;
  thumbnail_path: string | null;
    duration: number | null; // ✅ Ajouter cette ligne

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
  video?: File | null; // ✅ Peut être null ou undefined
}