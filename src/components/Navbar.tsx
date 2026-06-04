import { useAuth } from '../store/authContext';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-blue-600">EVALA</h1>
            <span className="text-xs text-gray-500">2026</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-gray-700 hover:text-blue-600 transition">
              Accueil
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition">
              Actualités
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition">
              Calendrier
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition">
              À Propos
            </a>
          </div>

          {/* User Menu */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {user.username}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <a
                href="/login"
                className="px-4 py-2 text-blue-600 hover:text-blue-700 transition font-medium"
              >
                Connexion
              </a>
              <a
                href="/signup"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                S'inscrire
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
