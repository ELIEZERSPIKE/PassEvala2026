// utils/imageUtils.ts

const BACKEND_URL = 'http://localhost:8000';

export const getImageUrl = (
  path: string | null | undefined,
  placeholder = 'https://placehold.co/400x400?text=Avatar'
): string => {
  if (!path) return placeholder;

  if (path.startsWith('http://localhost/') || path.startsWith('http://localhost:')) {
    return path.replace('http://localhost/', 'http://localhost:8000/');
  }

  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/storage/')) return `${BACKEND_URL}${path}`;

  return `${BACKEND_URL}/storage/${path}`;
};

export default getImageUrl;