import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../store/authContext'; // Remets ton chemin d'origine vers ton store
import Login from '../features/auth/pages/Login';
import Signup from '../features/auth/pages/Signup';
import MainLayout from '../layouts/MainLayout';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-medium">Chargement des accès...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  // 🔥 STRATÉGIE DE REDIRECTION : 
  // Si l'utilisateur a un rôle du staff, on l'envoie vers le back-office /admin
  // Si c'est un simple visiteur (rôle 'user'), on l'envoie vers l'accueil public /
  const staffRoles = ['superadmin', 'admin'];
  const isStaff = user && staffRoles.includes(user.role);
  const redirectionPath = isStaff ? '/admin' : '/';

  return (
    <Router>
      <Routes>
        {/* ============================================================ */}
        {/* ROUTES PUBLIQUES                                             */}
        {/* ============================================================ */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={redirectionPath} replace />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? (
              // Quand le visiteur vient de s'inscrire, il est connecté direct 
              // et est redirigé vers l'accueil car son rôle par défaut est 'user'
              <Navigate to={redirectionPath} replace />
            ) : (
              <Signup />
            )
          }
        />

        {/* ============================================================ */}
        {/* ROUTES PROTÉGÉES (Connexion requise)                         */}
        {/* ============================================================ */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;