import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Video, BarChart3, RefreshCw, Filter, LayoutDashboard, Users, Clock, CheckCircle, Archive } from 'lucide-react';
import { useAuth } from '@/store';
import ShortList from '../../features/shorts/pages/ShortList';

export const AdminShorts: React.FC = () => {
  const { user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ✅ Fonction de rafraîchissement
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Sécurité : Vérification du rôle admin
  if (user?.role !== 'admin' && user?.role !== 'superadmin') {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <div className="text-4xl mb-3">⛔</div>
          <p className="text-red-600 font-medium text-lg">Accès refusé</p>
          <p className="text-red-500 text-sm mt-1">Réservé aux administrateurs.</p>
          <Link 
            to="/"
            className="mt-4 inline-block text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  // ✅ Statistiques fictives (à connecter avec des données réelles)
  const stats = {
    total: 0,
    draft: 0,
    published: 0,
    archived: 0,
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* ✅ En-tête avec gradient et design moderne */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Navigation et titre */}
            <div>
              <Link 
                to="/admin" 
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium mb-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour au tableau de bord
              </Link>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Video className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Gestion des Shorts
                  </h1>
                  <p className="text-white/80 text-sm mt-0.5">
                    Gérez, publiez et optimisez vos vidéos courtes
                  </p>
                </div>
              </div>
            </div>

            {/* Badge et actions */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span className="font-medium">
                  {user?.role === 'superadmin' ? '👑 Super Admin' : '🛡️ Admin'}
                </span>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                {isRefreshing ? 'Actualisation...' : 'Actualiser'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Stats rapides */}
      

      {/* ✅ Contenu principal avec fond */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
          {/* ✅ Indicateur de mise à jour automatique */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <span>Mise à jour automatique</span>
              </div>
              <span className="text-gray-300">|</span>
              <span>Les vidéos sont traitées en arrière-plan</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">
                FFmpeg ⚡
              </span>
            </div>
          </div>

          {/* ✅ Liste des shorts */}
          <ShortList />
        </div>
      </div>
    </div>
  );
};

export default AdminShorts;










// import React from 'react';
// import { Link } from 'react-router-dom';
// import { ArrowLeft, Video } from 'lucide-react';
// import { useAuth } from '@/store';
// import ShortList from '../../features/shorts/pages/ShortList';

// export const AdminShorts: React.FC = () => {
//   const { user } = useAuth();

//   // Sécurité : Vérification du rôle admin
//   if (user?.role !== 'admin' && user?.role !== 'superadmin') {
//     return (
//       <div className="p-8 max-w-7xl mx-auto">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
//           <p className="text-red-600 font-medium">⛔ Accès refusé</p>
//           <p className="text-red-500 text-sm mt-1">Réservé aux administrateurs.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       {/* En-tête avec navigation */}
//       <div className="mb-6">
//         <Link 
//           to="/admin" 
//           className="text-blue-600 hover:text-blue-700 flex items-center gap-1 mb-4 text-sm font-bold uppercase tracking-wider transition-colors"
//         >
//           <ArrowLeft className="w-4 h-4" /> Retour au tableau de bord
//         </Link>
        
//         <div className="flex justify-between items-center flex-wrap gap-4">
//           <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
//             <Video className="w-8 h-8 text-indigo-600" />
//             Gestion des Shorts
//           </h1>
          
//           {/* Badge d'information */}
//           <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
//             <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
//             {user?.role === 'superadmin' ? 'Super Admin' : 'Admin'}
//           </div>
//         </div>
        
//         {/* Description */}
//         <p className="text-sm text-gray-500 mt-1">
//           Gérez tous les shorts publiés sur la plateforme. 
//           Les vidéos sont automatiquement traitées et optimisées.
//         </p>
//       </div>

//       {/* Contenu principal : Liste des shorts avec filtres et gestion */}
//       <ShortList />
//     </div>
//   );
// };

// export default AdminShorts;