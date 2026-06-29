import { Link } from 'react-router-dom';
import { FileText, Zap, Video, Award, Tag, PhoneCall, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';
import { useAuth } from '@/store';

const ALL_MODULES = [
  {
    id: 'articles', title: 'Articles', description: 'Actualités, à la une, fil info.',
    icon: <FileText className="w-6 h-6" />, link: '/admin/articles',
    bg: 'bg-blue-50', color: 'text-blue-600', permission: 'manage articles',
  },
  {
    id: 'flash-info', title: 'Flash infos', description: 'Infos diffusées en temps réel.',
    icon: <Zap className="w-6 h-6" />, link: '/admin/flash-info',
    bg: 'bg-orange-50', color: 'text-orange-600', permission: 'manage flash-infos',
  },
  {
    id: 'shorts', title: 'Shorts', description: 'Vidéos courtes du fil Evala.',
    icon: <Video className="w-6 h-6" />, link: '/admin/shorts',
    bg: 'bg-pink-50', color: 'text-pink-600', permission: 'manage shorts',
  },
  {
    id: 'sponsors', title: 'Sponsors', description: 'Bannières et partenaires.',
    icon: <Award className="w-6 h-6" />, link: '/admin/sponsors',
    bg: 'bg-amber-50', color: 'text-amber-600', permission: 'manage sponsors',
  },
  {
    id: 'bons-plans', title: 'Bons plans', description: 'Offres et commerces de Kara.',
    icon: <Tag className="w-6 h-6" />, link: '/admin/bons-plans',
    bg: 'bg-emerald-50', color: 'text-emerald-600', permission: 'manage bons-plans',
  },
  {
    id: 'numeros', title: 'Numéros utiles', description: "Contacts d'urgence et services.",
    icon: <PhoneCall className="w-6 h-6" />, link: '/admin/useful-numbers',
    bg: 'bg-indigo-50', color: 'text-purple-600', permission: 'manage numeros-utiles',
  },
];

const STAFF_MODULE = {
  id: 'staff', title: 'Utilisateurs & rôles', description: 'Gérez reporters, admins et accès.',
  icon: <ShieldCheck className="w-6 h-6" />, link: '/admin/settings/roles',
  bg: 'bg-red-50', color: 'text-red-600', permission: 'manage staff',
};

export const AdminHome = () => {
  const { user, hasPermission } = useAuth();

  // 🔍 Debug temporaire — à supprimer après vérification
 

  if (!['admin', 'superadmin'].includes(user?.role ?? '')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès restreint</h2>
          <p className="text-gray-600 mb-6">Vous n'avez pas les permissions nécessaires.</p>
          <Link to="/" className="inline-flex items-center px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
            Retourner à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const visibleModules = ALL_MODULES.filter(m => hasPermission(m.permission));
  const canManageStaff = hasPermission(STAFF_MODULE.permission);
  const isSuperAdmin = user?.role === 'superadmin';
  const greeting = isSuperAdmin ? 'Espace Zeus' : 'Espace administration';

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="max-w-7xl mx-auto px-6 py-12">

        {/* En-tête avec lien site public */}
        <div className="mb-10 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">{greeting}</h1>
            <p className="text-gray-500 mt-2 text-lg font-medium">
              {isSuperAdmin
                ? 'Accès total — avec grands pouvoirs viennent grandes responsabilités.'
                : "Contrôlez l'ensemble du contenu de l'application PASS EVALA 2026."}
            </p>
          </div>
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm shrink-0"
          >
            <ExternalLink className="w-4 h-4" />
            Voir le site
          </Link>
        </div>

        {visibleModules.length > 0 && (
          <>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Contenu</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
              {visibleModules.map(mod => (
                <Link key={mod.id} to={mod.link}
                  className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className={`${mod.bg} ${mod.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                    {mod.icon}
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">{mod.title}</h3>
                  <p className="text-sm text-gray-500 mb-6 leading-relaxed">{mod.description}</p>
                  <div className="flex items-center text-xs font-black text-blue-600 uppercase tracking-widest">
                    Accéder <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {canManageStaff && (
          <>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Gestion du staff</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              <Link to={STAFF_MODULE.link}
                className="group bg-white p-6 rounded-2xl shadow-sm border-2 border-red-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="bg-red-50 text-red-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-gray-900">{STAFF_MODULE.title}</h3>
                  {isSuperAdmin && (
                    <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-bold uppercase">Zeus</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-6">{STAFF_MODULE.description}</p>
                <div className="flex items-center text-xs font-black text-red-600 uppercase tracking-widest">
                  Configurer <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
};