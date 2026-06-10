import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Award, 
  Tag, 
  PhoneCall, 
  LayoutDashboard,
  ArrowRight,
  Globe,
  Settings,
  ShieldCheck,
  Users
} from 'lucide-react';
import { useAuth } from '@/store';

export const AdminHome: React.FC = () => {
  const { user } = useAuth();

  // Sécurité supplémentaire : Vérification du rôle admin
  if (user?.role !== 'admin' && user?.role !== 'superadmin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <LayoutDashboard className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès restreint</h2>
          <p className="text-gray-600 mb-6">Désolé, vous n'avez pas les permissions nécessaires pour accéder à l'espace d'administration.</p>
          <Link 
            to="/" 
            className="inline-flex items-center justify-center px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retourner à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const modules = [
    {
      id: 'articles',
      title: 'Gestion des Articles',
      description: 'Publiez et gérez les actualités, le fil info et les articles à la une.',
      icon: <FileText className="w-6 h-6" />,
      link: '/admin/articles',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      id: 'sponsors',
      title: 'Gestion des Sponsors',
      description: 'Configurez les bannières publicitaires et les partenaires de l\'événement.',
      icon: <Award className="w-6 h-6" />,
      link: '/admin/sponsors',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      id: 'bons-plans',
      title: 'Gestion des Bons Plans',
      description: 'Administrez les offres locales, commerces et bons plans de la Kara.',
      icon: <Tag className="w-6 h-6" />,
      link: '/admin/bons-plans',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      id: 'useful-numbers',
      title: 'Numéros Utiles',
      description: 'Mettez à jour les contacts d\'urgence et les numéros de services utiles.',
      icon: <PhoneCall className="w-6 h-6" />,
      link: '/admin/useful-numbers',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ];

  // Modules réservés exclusivement au Superadmin
  const superAdminModules = [
    {
      id: 'users-management',
      title: 'Utilisateurs & Rôles',
      description: 'Gérez les administrateurs, les permissions et contrôlez les accès.',
      icon: <ShieldCheck className="w-6 h-6" />,
      link: '/admin/settings/roles',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl text-gray-900">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span>Evala Admin</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-500 hidden sm:inline italic">Connecté : <strong>{user?.username}</strong></span>
            <Link to="/" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              Voir le site
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Espace Administration</h1>
          <p className="text-gray-500 mt-2 text-lg font-medium">Contrôlez l'ensemble du contenu de l'application PASS EVALA 2026.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {modules.map((module) => (
            <Link
              key={module.id}
              to={module.link}
              className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl hover:border-blue-100 hover:-translate-y-2 transition-all duration-300"
            >
              <div className={`${module.bgColor} ${module.iconColor} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform`}>
                {module.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{module.title}</h3>
              <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                {module.description}
              </p>
              <div className="flex items-center text-sm font-black text-blue-600 uppercase tracking-widest">
                Accéder
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          ))}

          {/* Affichage conditionnel des modules Superadmin */}
          {(user?.role === 'superadmin' || user?.role === 'admin') && superAdminModules.map((module) => (
            <Link
              key={module.id}
              to={module.link}
              className="group bg-white p-8 rounded-3xl shadow-sm border-2 border-red-50 hover:shadow-2xl hover:border-red-100 hover:-translate-y-2 transition-all duration-300"
            >
              <div className={`${module.bgColor} ${module.iconColor} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
                {module.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{module.title} <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded ml-2">SUPERADMIN</span></h3>
              <p className="text-sm text-gray-500 mb-8 leading-relaxed">{module.description}</p>
              <div className="flex items-center text-sm font-black text-red-600 uppercase tracking-widest">
                Configurer
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 p-10 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-blue-200">
          <div>
            <h2 className="text-3xl font-black mb-3">Besoin d'aide ?</h2>
            <p className="text-blue-100 text-lg">Consultez le guide utilisateur ou contactez le support technique pour toute question sur la gestion du contenu.</p>
          </div>
          <button className="whitespace-nowrap px-8 py-4 bg-white text-blue-700 font-black rounded-2xl hover:bg-blue-50 transition-all active:scale-95">
            Documentation
          </button>
        </div>
      </main>
    </div>
  );
};