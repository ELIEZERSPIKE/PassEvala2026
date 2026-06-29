import { Link } from 'react-router-dom';
import { FileText, Zap, Video, ArrowRight, ExternalLink } from 'lucide-react';
import { useAuth } from '@/store/authContext';

const MODULES = [
  {
    id: 'articles',
    title: 'Mes articles',
    description: 'Rédigez et publiez vos articles et actualités.',
    icon: <FileText className="w-6 h-6" />,
    link: '/reporter/articles',
    bg: 'bg-blue-50',
    color: 'text-blue-600',
  },
  {
    id: 'flash-info',
    title: 'Flash infos',
    description: 'Publiez des informations flash en temps réel.',
    icon: <Zap className="w-6 h-6" />,
    link: '/reporter/flash-info',
    bg: 'bg-orange-50',
    color: 'text-orange-600',
  },
  {
    id: 'shorts',
    title: 'Shorts',
    description: 'Partagez vos vidéos courtes du fil Evala.',
    icon: <Video className="w-6 h-6" />,
    link: '/reporter/shorts',
    bg: 'bg-pink-50',
    color: 'text-pink-600',
  },
];

export const ReporterHome = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="max-w-4xl mx-auto px-6 py-12">

        {/* En-tête avec lien site public */}
        <div className="mb-10 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900">
              Bonjour, {user?.name?.split(' ')[0] || user?.username} 👋
            </h1>
            <p className="text-gray-500 mt-2">Publiez vos contenus pour le festival Evala 2026.</p>
          </div>
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:text-green-600 hover:border-green-200 transition-colors shadow-sm shrink-0"
          >
            <ExternalLink className="w-4 h-4" />
            Voir le site
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {MODULES.map(mod => (
            <Link key={mod.id} to={mod.link}
              className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className={`${mod.bg} ${mod.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                {mod.icon}
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">{mod.title}</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">{mod.description}</p>
              <div className="flex items-center text-xs font-black text-green-600 uppercase tracking-widest">
                Accéder
                <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 p-6 bg-green-50 border border-green-100 rounded-2xl flex items-start gap-4">
          <div className="bg-green-100 text-green-700 p-2 rounded-lg flex-shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-green-800 mb-1">Espace reporter</p>
            <p className="text-sm text-green-700 leading-relaxed">
              Vous pouvez publier des articles, flash infos et shorts.
              Pour toute demande de modification de vos droits, contactez un administrateur.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
};