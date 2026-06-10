// components/layout/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedRoute = ({ requiredPermission }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Chargement...</div>;
    if (!user) return <Navigate to="/login" replace />;
    
    // Si la page demande une permission spécifique (ex: 'manage staff' pour l'Alpha)
    if (requiredPermission && !user.permissions.includes(requiredPermission)) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <Outlet />;
};