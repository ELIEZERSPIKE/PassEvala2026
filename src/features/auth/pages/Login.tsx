// features/auth/pages/Login.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../../../store/authContext';
import { LoginRequest } from '../../../types';
import { LogIn, Mail, Lock, AlertCircle, Loader, ArrowLeft } from 'lucide-react';
import { useToast } from '../../../hooks/useToast';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showSuccess, showError, showLoading, dismiss } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const loadingId = showLoading(' Connexion en cours...');

    try {
      const credentials: LoginRequest = {
        username: formData.username,
        password: formData.password,
      };

      const response = await authService.login(credentials);
      
      dismiss(loadingId);
      
      // ✅ Toast de succès personnalisé
      showSuccess(`👋 Bon retour ${response.data.name || response.data.username} !`);
      
      login(response.data, response.token);
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (err: any) {
      dismiss(loadingId);
      
      const errorMessage =
        err.response?.data?.message ||
        "Identifiants incorrects";
      
      setError(errorMessage);
      showError(`❌ ${errorMessage}`);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      
      <div className="w-full max-w-md mb-4">
        <Link to="/"
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>
      </div>

      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-xl">
        <div className="flex flex-col items-center">
          <div className="bg-indigo-600 p-3 rounded-full mb-4">
            <LogIn className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Se connecter
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Connectez-vous à votre compte Evala
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Nom d'utilisateur
                </div>
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition placeholder-gray-400"
                placeholder="Votre nom d'utilisateur"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Mot de passe
                </div>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition placeholder-gray-400"
                placeholder="Votre mot de passe"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Connexion en cours...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Se connecter
              </>
            )}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-700 transition">
                S'inscrire
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;