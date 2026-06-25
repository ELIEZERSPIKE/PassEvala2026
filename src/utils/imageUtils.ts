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
// export const BACKEND_URL = (() => {
//   const base = (api && api.defaults && api.defaults.baseURL) ? String(api.defaults.baseURL) : 'http://127.0.0.1:8000';
//   // Retire un suffixe `/api` ou `/api/` si présent
//   const withoutApi = base.replace(/\/api\/?$/i, '');
//   // Retire slash final
//   return withoutApi.replace(/\/$/, '');
// })();

/**
 * Génère une URL d'image valide pour le frontend.
 * Gère les URLs absolues du serveur, les chemins relatifs et les placeholders.
 * * @param path - Le chemin ou l'URL de l'image reçue du backend
 * @param placeholder - L'image par défaut si aucune image n'est disponible
 */
// utils/imageUtils.ts
/**
 * Retourne l'URL complète d'une image.
 * Maintenant que le backend retourne déjà des URLs complètes,
 * on a juste à gérer le cas null.
 */
export const getImageUrl = (
  path: string | null | undefined,
  placeholder: string = 'https://placehold.co/800x400?text=Image+Non+Trouvee'
): string => {
  // ✅ Si pas d'image, placeholder
  if (!path) {
    return placeholder;
  }

  // ✅ Si c'est déjà une URL complète (ce que le backend renvoie maintenant)
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // ✅ Si c'est un chemin relatif (fallback)
  if (path.startsWith('/storage/')) {
    return `${BACKEND_URL}${path}`;
  }

  // ✅ Sinon, on construit l'URL
  return `${BACKEND_URL}/storage/${path}`;
};

// ✅ BACKEND_URL simplifié
export const BACKEND_URL = (() => {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  return base.replace(/\/api\/?$/, '').replace(/\/$/, '');
})();

export default getImageUrl;