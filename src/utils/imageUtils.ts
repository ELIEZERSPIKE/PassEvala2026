/**
 * Retourne l'URL complète d'une image.
 * Si le chemin est relatif, il est préfixé par l'URL du backend.
 * Si le chemin est null/undefined, une image de remplacement est fournie.
 */
export const BACKEND_URL = 'http://localhost:8000';

export const getImageUrl = (path: string | null | undefined, placeholder: string = 'https://via.placeholder.com/800'): string => {
  if (!path) return placeholder;
  if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) return path; // Gère les URLs absolues, data URIs ou blobs locaux
  const formattedPath = path.startsWith('/') ? path : `/${path}`; // S'assure que le chemin commence par un slash
  return `${BACKEND_URL}${formattedPath}`;
};