// pages/profile/ProfileShorts.tsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Loader, Play, Eye, Heart, AlertCircle, Trash2, Edit3, X } from 'lucide-react';
import { profileService, Short } from '../../services/profilService';
import ShortPlayer from '@/features/shorts/components/ShortPlayer';
import getImageUrl from '@/utils/imageUtils';

const STYLE = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #0A1628 0%, #1A2A4A 100%)',
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(59,130,246,0.15)',
    borderRadius: '1rem',
    backdropFilter: 'blur(12px)',
  },
};

export default function ProfileShorts() {
  const [shorts, setShorts] = useState<Short[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [activeShort, setActiveShort] = useState<Short | null>(null);

  useEffect(() => {
    fetchShorts();
  }, []);

  const fetchShorts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileService.getMyShorts();
      if (Array.isArray(data)) {
        setShorts(data);
      } else {
        console.error("La réponse n'est pas un tableau:", data);
        setShorts([]);
        setError('Format de données invalide');
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement des shorts:', err);
      setError(err.response?.data?.message || 'Impossible de charger vos shorts');
      setShorts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShort = async (e: React.MouseEvent, shortId: number) => {
    e.stopPropagation();
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce short ?')) return;
    try {
      setDeleting(shortId);
      const result = await profileService.deleteShort(shortId);
      if (result.success) {
        setShorts((prev) => prev.filter((s) => s.id !== shortId));
        if (activeShort?.id === shortId) setActiveShort(null);
      } else {
        alert(result.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Une erreur est survenue');
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (e: React.MouseEvent, shortId: number) => {
    e.stopPropagation();
    window.location.href = `/edit-short/${shortId}`;
  };

  if (error) {
    return (
      <div style={STYLE.page} className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={STYLE.card}
            className="p-12 flex flex-col items-center gap-4 text-center"
          >
            <AlertCircle className="w-10 h-10" style={{ color: '#EF4444', opacity: 0.6 }} />
            <p className="font-semibold" style={{ color: '#F0F7FF' }}>{error}</p>
            <button
              onClick={fetchShorts}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
              style={{
                background: 'rgba(59,130,246,0.2)',
                color: '#60A5FA',
                border: '1px solid rgba(59,130,246,0.3)',
              }}
            >
              Réessayer
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div style={STYLE.page} className="py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#60A5FA' }}>
            Profil
          </p>
          <h1 className="text-3xl font-black flex items-center gap-3" style={{ color: '#F0F7FF' }}>
            <Video className="w-7 h-7" style={{ color: '#60A5FA' }} />
            Mes shorts
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#93A8C9' }}>
            {shorts.length} vidéo{shorts.length !== 1 ? 's' : ''} publiée{shorts.length !== 1 ? 's' : ''}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader className="w-6 h-6 animate-spin" style={{ color: '#60A5FA' }} />
          </div>
        ) : shorts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={STYLE.card}
            className="p-12 flex flex-col items-center gap-4 text-center"
          >
            <Video className="w-10 h-10" style={{ color: '#60A5FA', opacity: 0.4 }} />
            <p className="font-semibold" style={{ color: '#93A8C9' }}>
              Vous n'avez encore publié aucun short
            </p>
            <p className="text-sm" style={{ color: '#6B7FA3' }}>
              Commencez à créer votre première vidéo dès maintenant !
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {shorts.map((item, i) => {
              const thumbUrl = getImageUrl(item.thumbnail_path, '');

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={STYLE.card}
                  className="p-4 flex items-start gap-4 hover:bg-white/5 transition-all duration-200 group cursor-pointer"
                  onClick={() => setActiveShort(item)}
                >
                  {/* Thumbnail */}
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden"
                    style={{
                      background: 'rgba(37,99,235,0.15)',
                      border: '1px solid rgba(59,130,246,0.2)',
                    }}
                  >
                    {thumbUrl ? (
                      <img
                        src={thumbUrl}
                        alt={`Miniature du short #${item.id}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Play className="w-5 h-5" style={{ color: '#60A5FA' }} />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-all duration-300">
                      <Play className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 fill-current" />
                    </div>
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        {item.text && (
                          <p className="text-sm font-medium truncate" style={{ color: '#F0F7FF' }}>
                            {item.text}
                          </p>
                        )}
                        {item.created_at && (
                          <p className="text-[11px] mt-0.5" style={{ color: '#60A5FA' }}>
                            {new Date(item.created_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <button
                          onClick={(e) => handleEdit(e, item.id)}
                          className="p-1.5 rounded-lg hover:bg-blue-500/20 transition-colors"
                          style={{ color: '#60A5FA' }}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteShort(e, item.id)}
                          disabled={deleting === item.id}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
                          style={{ color: '#EF4444' }}
                        >
                          {deleting === item.id ? (
                            <Loader className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      {item.views_count !== undefined && (
                        <span className="flex items-center gap-1 text-[11px]" style={{ color: '#93A8C9' }}>
                          <Eye className="w-3 h-3" /> {item.views_count.toLocaleString()}
                        </span>
                      )}
                      {item.likes_count !== undefined && (
                        <span className="flex items-center gap-1 text-[11px]" style={{ color: '#93A8C9' }}>
                          <Heart className="w-3 h-3" /> {item.likes_count.toLocaleString()}
                        </span>
                      )}
                      {item.comments_count !== undefined && (
                        <span className="flex items-center gap-1 text-[11px]" style={{ color: '#93A8C9' }}>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          {item.comments_count.toLocaleString()}
                        </span>
                      )}
                      {item.status && (
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase"
                          style={{
                            background:
                              item.status === 'published'
                                ? 'rgba(52,211,153,0.12)'
                                : item.status === 'draft'
                                ? 'rgba(251,191,36,0.12)'
                                : 'rgba(59,130,246,0.12)',
                            color:
                              item.status === 'published'
                                ? '#34D399'
                                : item.status === 'draft'
                                ? '#FBBF24'
                                : '#60A5FA',
                            border: `1px solid ${
                              item.status === 'published'
                                ? 'rgba(52,211,153,0.25)'
                                : item.status === 'draft'
                                ? 'rgba(251,191,36,0.25)'
                                : 'rgba(59,130,246,0.25)'
                            }`,
                          }}
                        >
                          {item.status === 'published'
                            ? 'Publié'
                            : item.status === 'draft'
                            ? 'Brouillon'
                            : 'Archivé'}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Modal Vidéo ── */}
      <AnimatePresence>
        {activeShort && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
            onClick={() => setActiveShort(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative w-full max-w-sm"
              style={{ aspectRatio: '9/16', borderRadius: '1.25rem', overflow: 'hidden' }}
              onClick={(e) => e.stopPropagation()}
            >
              <ShortPlayer short={activeShort} isActive={true} />

              <button
                onClick={() => setActiveShort(null)}
                className="absolute top-3 left-3 z-20 p-2 rounded-full"
                style={{
                  background: 'rgba(0,0,0,0.6)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}















































// // pages/profile/ProfileShorts.tsx
// import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import { Video, Loader, Play, Eye, Heart, AlertCircle, Trash2, Edit3 } from 'lucide-react';
// import { profileService, Short } from '../../services/profilService';

// const STYLE = {
//   page: { 
//     minHeight: '100vh', 
//     background: 'linear-gradient(160deg, #0A1628 0%, #1A2A4A 100%)' 
//   },
//   card: {
//     background: 'rgba(255,255,255,0.04)',
//     border: '1px solid rgba(59,130,246,0.15)',
//     borderRadius: '1rem',
//     backdropFilter: 'blur(12px)',
//   },
// };

// export default function ProfileShorts() {
//   const [shorts, setShorts] = useState<Short[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [deleting, setDeleting] = useState<number | null>(null);

//   useEffect(() => {
//     fetchShorts();
//   }, []);

//   const fetchShorts = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       // ✅ Utilisation du service refactorisé
//       const data = await profileService.getMyShorts();
      
//       // ✅ S'assurer que c'est bien un tableau (double sécurité)
//       if (Array.isArray(data)) {
//         setShorts(data);
//       } else {
//         console.error('La réponse n\'est pas un tableau:', data);
//         setShorts([]);
//         setError('Format de données invalide');
//       }
//     } catch (err: any) {
//       console.error('Erreur lors du chargement des shorts:', err);
//       setError(err.response?.data?.message || 'Impossible de charger vos shorts');
//       setShorts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteShort = async (shortId: number) => {
//     if (!confirm('Êtes-vous sûr de vouloir supprimer ce short ?')) return;
    
//     try {
//       setDeleting(shortId);
//       const result = await profileService.deleteShort(shortId);
      
//       if (result.success) {
//         // ✅ Mettre à jour la liste localement
//         setShorts(prev => prev.filter(s => s.id !== shortId));
//       } else {
//         alert(result.message || 'Erreur lors de la suppression');
//       }
//     } catch (error) {
//       console.error('Erreur suppression:', error);
//       alert('Une erreur est survenue');
//     } finally {
//       setDeleting(null);
//     }
//   };

//   // Afficher l'erreur si présente
//   if (error) {
//     return (
//       <div style={STYLE.page} className="py-12 px-4">
//         <div className="max-w-2xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             style={STYLE.card}
//             className="p-12 flex flex-col items-center gap-4 text-center"
//           >
//             <AlertCircle className="w-10 h-10" style={{ color: '#EF4444', opacity: 0.6 }} />
//             <p className="font-semibold" style={{ color: '#F0F7FF' }}>{error}</p>
//             <button
//               onClick={fetchShorts}
//               className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
//               style={{ 
//                 background: 'rgba(59,130,246,0.2)', 
//                 color: '#60A5FA',
//                 border: '1px solid rgba(59,130,246,0.3)'
//               }}
//             >
//               Réessayer
//             </button>
//           </motion.div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={STYLE.page} className="py-12 px-4">
//       <div className="max-w-2xl mx-auto">

//         {/* Header */}
//         <motion.div 
//           initial={{ opacity: 0, y: -20 }} 
//           animate={{ opacity: 1, y: 0 }} 
//           className="mb-8"
//         >
//           <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#60A5FA' }}>
//             Profil
//           </p>
//           <h1 className="text-3xl font-black flex items-center gap-3" style={{ color: '#F0F7FF' }}>
//             <Video className="w-7 h-7" style={{ color: '#60A5FA' }} />
//             Mes shorts
//           </h1>
//           <p className="mt-1 text-sm" style={{ color: '#93A8C9' }}>
//             {shorts.length} vidéo{shorts.length !== 1 ? 's' : ''} publiée{shorts.length !== 1 ? 's' : ''}
//           </p>
//         </motion.div>

//         {loading ? (
//           <div className="flex justify-center py-20">
//             <Loader className="w-6 h-6 animate-spin" style={{ color: '#60A5FA' }} />
//           </div>
//         ) : shorts.length === 0 ? (
//           <motion.div
//             initial={{ opacity: 0 }} 
//             animate={{ opacity: 1 }}
//             style={STYLE.card}
//             className="p-12 flex flex-col items-center gap-4 text-center"
//           >
//             <Video className="w-10 h-10" style={{ color: '#60A5FA', opacity: 0.4 }} />
//             <p className="font-semibold" style={{ color: '#93A8C9' }}>
//               Vous n'avez encore publié aucun short
//             </p>
//             <p className="text-sm" style={{ color: '#6B7FA3' }}>
//               Commencez à créer votre première vidéo dès maintenant !
//             </p>
//           </motion.div>
//         ) : (
//           <div className="space-y-3">
//             {shorts.map((item, i) => (
//               <motion.div
//                 key={item.id}
//                 initial={{ opacity: 0, y: 16 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: i * 0.05 }}
//                 style={STYLE.card}
//                 className="p-4 flex items-start gap-4 hover:bg-white/5 transition-all duration-200 group"
//               >
//                 {/* Thumbnail / Video Preview */}
//                 <div
//                   className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden cursor-pointer"
//                   style={{ 
//                     background: 'rgba(37,99,235,0.15)', 
//                     border: '1px solid rgba(59,130,246,0.2)' 
//                   }}
//                   onClick={() => window.location.href = `/short/${item.id}`}
//                 >
//                   {item.thumbnail_url ? (
//                     <img 
//                       src={item.thumbnail_url} 
//                       alt={`Miniature du short #${item.id}`}
//                       className="w-full h-full object-cover"
//                       onError={(e) => {
//                         // En cas d'erreur, cacher l'image et afficher l'icône Play
//                         const target = e.currentTarget;
//                         target.style.display = 'none';
//                         const parent = target.parentElement;
//                         if (parent) {
//                           const icon = document.createElement('div');
//                           icon.className = 'w-5 h-5';
//                           icon.style.color = '#60A5FA';
//                           icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
//                           parent.appendChild(icon);
//                         }
//                       }}
//                     />
//                   ) : (
//                     <Play className="w-5 h-5" style={{ color: '#60A5FA' }} />
//                   )}
                  
//                   {/* Icône lecture en overlay */}
//                   <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-300">
//                     <Play className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
//                   </div>
//                 </div>

//                 {/* Infos du short */}
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-start justify-between gap-2">
//                     <div 
//                       className="flex-1 cursor-pointer"
//                       onClick={() => window.location.href = `/short/${item.id}`}
//                     >
                      
//                       {item.created_at && (
//                         <p className="text-[11px] mt-0.5" style={{ color: '#60A5FA' }}>
//                           {new Date(item.created_at).toLocaleDateString('fr-FR', { 
//                             day: 'numeric', 
//                             month: 'long', 
//                             year: 'numeric' 
//                           })}
//                         </p>
//                       )}
//                     </div>
                    
//                     {/* Actions */}
//                     <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
//                       <button
//                         onClick={() => window.location.href = `/edit-short/${item.id}`}
//                         className="p-1.5 rounded-lg hover:bg-blue-500/20 transition-colors"
//                         style={{ color: '#60A5FA' }}
//                       >
//                         <Edit3 className="w-3.5 h-3.5" />
//                       </button>
//                       <button
//                         onClick={() => handleDeleteShort(item.id)}
//                         disabled={deleting === item.id}
//                         className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
//                         style={{ color: '#EF4444' }}
//                       >
//                         {deleting === item.id ? (
//                           <Loader className="w-3.5 h-3.5 animate-spin" />
//                         ) : (
//                           <Trash2 className="w-3.5 h-3.5" />
//                         )}
//                       </button>
//                     </div>
//                   </div>
                  
//                   {/* Stats */}
//                   <div className="flex items-center gap-4 mt-2 flex-wrap">
//                     {item.views_count !== undefined && (
//                       <span className="flex items-center gap-1 text-[11px]" style={{ color: '#93A8C9' }}>
//                         <Eye className="w-3 h-3" /> {item.views_count.toLocaleString()}
//                       </span>
//                     )}
//                     {item.likes_count !== undefined && (
//                       <span className="flex items-center gap-1 text-[11px]" style={{ color: '#93A8C9' }}>
//                         <Heart className="w-3 h-3" /> {item.likes_count.toLocaleString()}
//                       </span>
//                     )}
//                     {item.comments_count !== undefined && (
//                       <span className="flex items-center gap-1 text-[11px]" style={{ color: '#93A8C9' }}>
//                         <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//                         </svg>
//                         {item.comments_count.toLocaleString()}
//                       </span>
//                     )}
//                     {item.status && (
//                       <span
//                         className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase"
//                         style={{
//                           background: item.status === 'published' 
//                             ? 'rgba(52,211,153,0.12)' 
//                             : item.status === 'draft'
//                             ? 'rgba(251,191,36,0.12)'
//                             : 'rgba(59,130,246,0.12)',
//                           color: item.status === 'published' 
//                             ? '#34D399' 
//                             : item.status === 'draft'
//                             ? '#FBBF24'
//                             : '#60A5FA',
//                           border: `1px solid ${item.status === 'published' 
//                             ? 'rgba(52,211,153,0.25)' 
//                             : item.status === 'draft'
//                             ? 'rgba(251,191,36,0.25)'
//                             : 'rgba(59,130,246,0.25)'}`,
//                         }}
//                       >
//                         {item.status === 'published' ? 'Publié' : item.status === 'draft' ? 'Brouillon' : 'En attente'}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }