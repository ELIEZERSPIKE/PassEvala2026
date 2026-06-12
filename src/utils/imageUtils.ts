/**
 * Retourne l'URL complète d'une image.
 * Si le chemin est relatif, il est préfixé par l'URL du backend.
 * Si le chemin est null/undefined, une image de remplacement est fournie.
 */
import api from '../api/axios';

/**
 * Déduit l'URL du backend depuis la baseURL d'axios.
 * Si axios utilise `http://127.0.0.1:8000/api`, on retire "/api" pour obtenir
 * l'URL racine `http://127.0.0.1:8000` utilisée pour servir les fichiers (storage).
 */
export const BACKEND_URL = (() => {
  const base = (api && api.defaults && api.defaults.baseURL) ? String(api.defaults.baseURL) : 'http://127.0.0.1:8000';
  // Retire un suffixe `/api` ou `/api/` si présent
  const withoutApi = base.replace(/\/api\/?$/i, '');
  // Retire slash final
  return withoutApi.replace(/\/$/, '');
})();

/**
 * Génère une URL d'image valide pour le frontend.
 * Gère les URLs absolues du serveur, les chemins relatifs et les placeholders.
 * * @param path - Le chemin ou l'URL de l'image reçue du backend
 * @param placeholder - L'image par défaut si aucune image n'est disponible
 */
export const getImageUrl = (
  path: string | null | undefined, 
  placeholder: string = 'https://placehold.co/800x400?text=Image+Non+Trouvee'
): string => {
  
  // 1. Si le chemin est invalide, nul ou vide, on renvoie le placeholder
  if (!path || path.trim() === '') {
    return placeholder;
  }
  
  // 2. Si c'est déjà une URL complète (générée par Laravel Medialibrary, ou un blob/data de preview)
  // On compare de manière insensible à la casse pour éviter les surprises (HTTP vs http)
  const lowerPath = path.toLowerCase();
  if (
    lowerPath.startsWith('http://') || 
    lowerPath.startsWith('https://') || 
    lowerPath.startsWith('data:') || 
    lowerPath.startsWith('blob:')
  ) {
    return path;
  }
  
  // 3. Sécurité pour les environnements de dev (ex: si Laravel renvoie avec 127.0.0.1 et que ton React est sur localhost)
  // Si l'URL contient l'un ou l'autre mais que l'image bloque, le point 2 a déjà retourné la chaîne.
  
  // 4. Si c'est un chemin relatif (ex: 'bonplans/image.jpg'), on s'assure qu'il commence par '/storage/'
  let cleanPath = path;
  if (!cleanPath.startsWith('/') && !cleanPath.startsWith('storage/')) {
    cleanPath = `storage/${cleanPath}`;
  } else if (cleanPath.startsWith('/') && !cleanPath.startsWith('/storage/')) {
    cleanPath = `/storage${cleanPath}`;
  }
  
  const formattedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  
  return `${BACKEND_URL}${formattedPath}`;
};