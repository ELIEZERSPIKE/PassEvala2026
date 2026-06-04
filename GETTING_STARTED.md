# PassEvala 2026 - Guide de Mise en Route

## Structure Réorganisée ✅

Votre projet est maintenant organisé selon une architecture moderne et scalable avec :

- **Features modulaires** : Chaque fonctionnalité (auth, users, events) est isolée
- **Services centralisés** : API axios avec intercepteurs automatiques
- **Contexte d'authentification** : Gestion globale de l'état utilisateur
- **Routes protégées** : Redirection automatique vers login si non connecté
- **Composants réutilisables** : Navbar, Footer, Layouts centralisés

## Démarrage Rapide

### 1. Backend Laravel (BackEvala)

```bash
cd BackEvala

# Installer les dépendances
composer install

# Copier le fichier env
cp .env.example .env

# Générer la clé d'application
php artisan key:generate

# Configurer la base de données dans .env
# Puis exécuter les migrations
php artisan migrate

# Lancer le serveur
php artisan serve
```

Le backend sera disponible sur: `http://127.0.0.1:8000`

### 2. Frontend React (PassEvala2026)

```bash
cd PassEvala2026

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le frontend sera disponible sur: `http://localhost:5173` (ou le port affiché)

## Architecture en Action

### Flux d'Authentification

```
1. Utilisateur visite /login ou /signup
2. Remplit le formulaire
3. Frontend → POST /api/login ou /api/register
4. Backend Laravel retourne {user, token}
5. Frontend stocke le token dans localStorage
6. AuthProvider met à jour l'état global
7. Redirection vers la page d'accueil
```

### Protection des Routes

```typescript
// Automatique dans routes/index.tsx
// Si non connecté → redirection vers /login
// Si connecté → accès à MainLayout
```

### Utilisation du Contexte d'Authentification

```typescript
import { useAuth } from '@/store';

function MyComponent() {
  const { user, token, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <p>Veuillez vous connecter</p>;
  }

  return (
    <div>
      <p>Bienvenue, {user.username}!</p>
      <button onClick={logout}>Déconnexion</button>
    </div>
  );
}
```

## Fichiers Importants

| Fichier | Rôle |
|---------|------|
| `src/main.tsx` | Point d'entrée avec AuthProvider |
| `src/routes/index.tsx` | Configuration des routes avec protection |
| `src/store/authContext.tsx` | Contexte d'authentification global |
| `src/features/auth/services/authService.ts` | Appels API d'authentification |
| `src/api/axios.ts` | Configuration axios avec intercepteurs |
| `src/layouts/MainLayout.tsx` | Layout principal avec Navbar/Footer |

## Ajouter une Nouvelle Feature

### Exemple : Ajouter les utilisateurs

```bash
# 1. Créer la structure
mkdir -p src/features/users/{pages,services,components}

# 2. Créer le service
# src/features/users/services/userService.ts
export const userService = {
  getProfile: async () => { /* ... */ },
  updateProfile: async (data) => { /* ... */ },
};

# 3. Créer la page
# src/features/users/pages/Profile.tsx
import { userService } from '../services/userService';

# 4. Ajouter la route
# src/routes/index.tsx
<Route path="/profile" element={<Profile />} />
```

## Variables d'Environnement

Créez un fichier `.env` à la racine du projet:

```env
VITE_API_URL=http://127.0.0.1:8000/api
VITE_APP_NAME=PassEvala2026
```

Utilisez-les dans le code:

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Commandes Utiles

```bash
# Développement
npm run dev

# Build production
npm run build

# Vérifier les types TypeScript
npm run lint

# Nettoyer les fichiers compilés
npm run clean
```

## Accès aux Données

Depuis n'importe quel composant protégé:

```typescript
import { useAuth } from '@/store';

const { user } = useAuth();
console.log(user.id, user.username, user.avatar_url);
```

Les données sont automatiquement synchronisées avec Laravel via:
- Token JWT Sanctum stocké dans localStorage
- Automatiquement inclus dans les en-têtes de chaque requête
- Actualisé après chaque action (login, signup)

## Erreurs Communes

### "useAuth must be used within AuthProvider"
✅ Solution: Assurez-vous que le composant est dans la structure protégée (routes/index.tsx)

### "Cannot find module 'react-router-dom'"
✅ Solution: `npm install react-router-dom`

### CORS errors
✅ Solution: Vérifiez que le backend Laravel a CORS configuré dans `config/cors.php`

## Support

Pour plus d'informations:
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Laravel API Documentation](https://laravel.com/docs/11/api)
