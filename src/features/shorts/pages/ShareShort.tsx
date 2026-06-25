// features/shorts/pages/ShareShort.tsx
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/store';
import { ShortPayload, ShortUpdatePayload } from '../types/short';
import ShortForm from '@/features/shorts/components/ShortForm';
import shortService from '@/features/shorts/services/shortService';

export default function ShareShort() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [submitting, setSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login?redirect=/partager/short');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (data: ShortPayload | ShortUpdatePayload) => {
    setSubmitting(true);
    setSuccess(null);
    
    try {
      if ('video' in data && data.video instanceof File) {
        await shortService.create(data as ShortPayload);
        setSuccess('✅ Votre short a été publié avec succès !');
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (error: any) {
      console.error('Erreur publication:', error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Partager un short</h1>
            <p className="text-sm text-gray-500">Publiez votre vidéo sur Fil Evala</p>
          </div>
        </div>

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center gap-2">
            <span>✅</span>
            <span>{success}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <ShortForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/')}
            loading={submitting}
          />
        </div>

        <div className="mt-4 text-center text-xs text-gray-400">
          <p> La vidéo sera automatiquement traitée et optimisée</p>
          <p> Elle apparaîtra dans le Fil Evala après traitement</p>
          <p className="mt-1 text-gray-300">
            Publié en tant que <span className="font-medium text-gray-500">@{user?.username}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// import React, { useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { ArrowLeft } from 'lucide-react';
// import { useAuth } from '@/store';
// import { ShortPayload, ShortUpdatePayload } from '../types/short';
// import ShortForm from '@/features/shorts/components/ShortForm';
// // import { shortService } from '@/features/shorts/services/shortService';
// import shortService from '@/features/shorts/services/shortService';

// export default function ShareShort() {
//   const navigate = useNavigate();
//   const { user, isAuthenticated, isLoading } = useAuth();
//   const [submitting, setSubmitting] = React.useState(false);
//   const [success, setSuccess] = React.useState<string | null>(null);

//   // ✅ Rediriger si non connecté
//   useEffect(() => {
//     if (!isLoading && !isAuthenticated) {
//       navigate('/login?redirect=/partager/short');
//     }
//   }, [isAuthenticated, isLoading, navigate]);

//   // ✅ Gestion de la soumission
//   const handleSubmit = async (data: ShortPayload | ShortUpdatePayload) => {
//     setSubmitting(true);
//     setSuccess(null);
    
//     try {
//       // Vérifier que c'est bien un ShortPayload (création)
//       if ('video' in data && data.video instanceof File) {
//         await shortService.create(data as ShortPayload);
//         setSuccess('✅ Votre short a été publié avec succès !');
        
//         // Rediriger après 2 secondes
//         setTimeout(() => {
//           navigate('/');
//         }, 2000);
//       }
//     } catch (error: any) {
//       console.error('Erreur publication:', error);
//       throw error; // Le ShortForm gérera l'affichage des erreurs
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // ✅ Affichage du chargement
//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
//       </div>
//     );
//   }

//   // ✅ Si non connecté (redirection en cours)
//   if (!isAuthenticated) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-2xl mx-auto">
//         {/* ✅ Header */}
//         <div className="flex items-center gap-4 mb-6">
//           <Link
//             to="/"
//             className="p-2 hover:bg-gray-200 rounded-full transition-colors"
//           >
//             <ArrowLeft size={24} />
//           </Link>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Partager un short</h1>
//             <p className="text-sm text-gray-500">
//               Publiez votre vidéo sur Fil Evala
//             </p>
//           </div>
//         </div>

//         {/* ✅ Message de succès */}
//         {success && (
//           <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center gap-2">
//             <span>✅</span>
//             <span>{success}</span>
//           </div>
//         )}

//         {/* ✅ Formulaire réutilisé */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//           <ShortForm
//             onSubmit={handleSubmit}
//             onCancel={() => navigate('/')}
//             loading={submitting}
//           />
//         </div>

//         {/* ✅ Informations */}
//         <div className="mt-4 text-center text-xs text-gray-400">
//           <p>⏳ La vidéo sera automatiquement traitée et optimisée</p>
//           <p>📱 Elle apparaîtra dans le Fil Evala après traitement</p>
//           <p className="mt-1 text-gray-300">
//             Publié en tant que <span className="font-medium text-gray-500">@{user?.username}</span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }