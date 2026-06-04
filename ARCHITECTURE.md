# Nouvelle Architecture du Projet

Votre projet est maintenant organisé selon une architecture modulaire et professionnelle :

```
src/
├── api/                          # Configuration des appels API
│   ├── axios.ts                  # Instance axios configurée
│   └── index.ts                  # Exports
│
├── assets/                       # Images, fonts, etc.
│
├── components/                   # Composants réutilisables
│   ├── Button/
│   ├── Modal/
│   └── Navbar/
│
├── features/                     # Features métier
│   ├── auth/
│   │   ├── pages/               # Pages Login, Signup
│   │   ├── services/            # Services d'authentification
│   │   ├── hooks/               # Hooks custom (useAuth)
│   │   └── components/          # Composants spécifiques à auth
│   │
│   ├── users/                   # Feature utilisateurs (futur)
│   │   ├── pages/
│   │   ├── services/
│   │   └── components/
│   │
│   ├── events/                  # Feature événements (futur)
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── components/
│   │
│   └── index.ts                 # Exports centralisés
│
├── hooks/                       # Hooks custom globaux
│
├── layouts/                     # Layouts réutilisables
│   └── MainLayout.tsx           # Layout principal
│
├── pages/                       # Pages de l'application
│   └── Home.tsx                 # Page d'accueil
│
├── routes/                      # Configuration des routes
│   └── index.tsx                # Router avec protection des routes
│
├── store/                       # Gestion d'état
│   ├── authContext.tsx          # Contexte d'authentification
│   └── index.ts                 # Exports
│
├── utils/                       # Fonctions utilitaires
│
├── types.ts                     # Types TypeScript globaux
├── data.ts                      # Données statiques
├── App.tsx                      # Composant racine
├── main.tsx                     # Point d'entrée
└── index.css                    # Styles globaux
```

## Avantages de cette architecture:

✅ **Séparation des responsabilités** - Chaque dossier a un rôle clair
✅ **Scalabilité** - Facile d'ajouter des nouvelles features (users, events, etc.)
✅ **Maintenabilité** - Code organisé et facile à trouver
✅ **Réutilisabilité** - Composants et services isolés
✅ **Testabilité** - Chaque élément peut être testé indépendamment

## Flux de données:

```
main.tsx
  ↓
AuthProvider (store/authContext.tsx)
  ↓
AppRoutes (routes/index.tsx)
  ↓
Protected Routes → MainLayout
  ↓
HomePage / Features
```

## Utilisation des imports:

```typescript
// Au lieu de chemins relatifs longs
import authService from '../../features/auth/services/authService';

// Vous pouvez utiliser les exports centralisés
import { authService } from '@/features';
import { useAuth } from '@/store';
```

Pour activer les alias d'imports, mettez à jour votre `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

Et votre `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```
