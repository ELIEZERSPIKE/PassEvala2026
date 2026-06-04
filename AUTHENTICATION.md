# Interfaces et Pages d'Authentification

Ce document décrit les interfaces et pages d'authentification créées basées sur l'AuthController Laravel.

## Interfaces d'Authentification (`src/types.ts`)

### `LoginRequest`
Données requises pour la connexion:
```typescript
{
  username: string;      // Requis
  password: string;      // Requis
}
```

### `SignupRequest`
Données requises pour l'inscription:
```typescript
{
  name?: string;                    // Optionnel
  username: string;                 // Requis, doit être unique
  phone?: string;                   // Optionnel, doit être unique
  password: string;                 // Requis, min 6 caractères
  password_confirmation: string;    // Requis, doit matcher password
}
```

### `AuthResponse`
Réponse retournée après login/signup:
```typescript
{
  message: string;      // Message de confirmation
  data: User;          // Objet utilisateur
  token: string;       // Token d'authentification Bearer
}
```

## Pages

### Page de Connexion (`src/pages/Login.tsx`)
- Formulaire avec username et password
- Gestion des erreurs
- Redirection après succès
- Lien vers la page d'inscription

**Utilisation:**
```tsx
import { Login } from './pages';

<Route path="/login" element={<Login />} />
```

### Page d'Inscription (`src/pages/Signup.tsx`)
- Formulaire complet avec nom, username, téléphone et mot de passe
- Validation locale (confirmation mot de passe, longueur minimum)
- Gestion des erreurs du serveur
- Redirection après succès
- Lien vers la page de connexion

**Utilisation:**
```tsx
import { Signup } from './pages';

<Route path="/signup" element={<Signup />} />
```

## Service d'Authentification (`src/services/authService.ts`)

Fournit les méthodes suivantes:

### `login(credentials: LoginRequest): Promise<AuthResponse>`
Connexion d'un utilisateur.

### `signup(userData: SignupRequest): Promise<AuthResponse>`
Inscription d'un nouvel utilisateur.

### `logout(token: string): Promise<void>`
Déconnexion de l'utilisateur.

### `getCurrentUser(token: string): Promise<any>`
Récupère les informations de l'utilisateur actuellement connecté.

## Contexte d'Authentification (`src/context/AuthContext.tsx`)

Fournit un contexte global pour gérer l'état d'authentification:

### `useAuth()` Hook
```typescript
const { user, token, isAuthenticated, login, logout, isLoading } = useAuth();
```

**Propriétés:**
- `user`: L'utilisateur actuel ou null
- `token`: Le token d'authentification ou null
- `isAuthenticated`: Booléen indiquant si l'utilisateur est connecté
- `login(user, token)`: Fonction pour se connecter
- `logout()`: Fonction pour se déconnecter
- `isLoading`: Booléen indiquant si le contexte charge

### Setup du Provider
Enveloppez votre application avec le provider:
```tsx
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      {/* Votre application */}
    </AuthProvider>
  );
}
```

## Composant Route Protégée (`src/components/ProtectedRoute.tsx`)

Composant pour protéger les routes qui nécessitent une authentification:

```tsx
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';

<Route 
  path="/profile" 
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  } 
/>
```

## Configuration Router

Pour utiliser les pages d'authentification, vous devez configurer react-router-dom (à ajouter à package.json):

```bash
npm install react-router-dom
```

### Exemple de configuration complète:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import { Login, Signup } from './pages';
import ProtectedRoute from './components/ProtectedRoute';

function Router() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* Routes protégées */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default Router;
```

## Utilisation du Token dans les Requêtes API

Pour les requêtes authentifiées, utilisez le token:

```tsx
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function MyComponent() {
  const { token } = useAuth();

  const fetchData = async () => {
    const response = await api.get('/protected-endpoint', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  return <div>...</div>;
}
```

## Notes Importantes

1. Les tokens et données utilisateur sont stockés dans `localStorage`
2. Le contexte d'authentification se réinitialise automatiquement depuis le localStorage au chargement de l'app
3. Les routes de login/signup utilisent react-router-dom et nécessitent un BrowserRouter
4. Les validations côté client sont effectuées avant d'envoyer au serveur
5. Les erreurs du serveur sont affichées en rouge dans les formulaires
