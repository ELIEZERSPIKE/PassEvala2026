export interface UsefulNumber {
  id: number;
  name: string;
  phone_number: string;
  color_tag?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UsefulNumberPayload {
  name: string;
  phone_number: string;
  color_tag?: string | null;
}