import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, Phone, AlertCircle, Loader, User } from 'lucide-react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { SignupRequest } from '../types';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    phone: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: typeof formData) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation locale
    if (formData.password !== formData.password_confirmation) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    try {
      const userData: SignupRequest = {
        name: formData.name || undefined,
        username: formData.username,
        phone: formData.phone || undefined,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      };

      const response = await authService.signup(userData);

      // Utiliser la fonction login du contexte pour mettre à jour l'état global
      login(response.data, response.token);

      // Rediriger vers la page d'accueil
      navigate('/');
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.[Object.keys(err.response?.data?.errors || {})[0]]?.[0] ||
        err.message ||
        'Erreur lors de l\'inscription';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-xl">
        {/* Header avec icône */}
        <div className="flex flex-col items-center">
          <div className="bg-green-600 p-3 rounded-full mb-4">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Créer un compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Rejoignez la communauté Evala
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Nom */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nom (optionnel)
                </div>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition placeholder-gray-400"
                placeholder="Votre nom complet"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Nom d'utilisateur */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Nom d'utilisateur *
                </div>
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition placeholder-gray-400"
                placeholder="Votre nom d'utilisateur"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            {/* Téléphone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Téléphone (optionnel)
                </div>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition placeholder-gray-400"
                placeholder="Votre numéro de téléphone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Mot de passe *
                </div>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition placeholder-gray-400"
                placeholder="Au moins 6 caractères"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Confirmation mot de passe */}
            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Confirmer le mot de passe *
                </div>
              </label>
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition placeholder-gray-400"
                placeholder="Confirmez votre mot de passe"
                value={formData.password_confirmation}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Inscription en cours...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                S'inscrire
              </>
            )}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte ?{' '}
              <a
                href="/login"
                className="font-medium text-green-600 hover:text-green-700 transition"
              >
                Se connecter
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
