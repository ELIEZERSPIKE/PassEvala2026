// components/Modal/ArticleModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Heart, Share2, Facebook, Twitter, Link2, Check, User, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Article } from '../../types';
import { getImageUrl } from '../../utils/imageUtils';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../store/authContext';
import { likeService } from '../../services/likeService';
import LikeButton from '../LikeButton';
import CommentSection from '../CommentSection';

interface ArticleModalProps {
  article: Article;
  onClose: () => void;
  onLikeUpdate?: (articleId: number, isLiked: boolean, count: number) => void;
}

export default function ArticleModal({ article, onClose, onLikeUpdate }: ArticleModalProps) {
  const [likesCount, setLikesCount] = useState(article.likes_count);
  const [isLiked, setIsLiked] = useState(article.is_liked_by_user);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();

  // ✅ Mettre à jour quand l'article change
  useEffect(() => {
    setLikesCount(article.likes_count);
    setIsLiked(article.is_liked_by_user);
  }, [article]);

  const handleLikeChange = (liked: boolean, count: number) => {
    setIsLiked(liked);
    setLikesCount(count);
    if (onLikeUpdate) {
      onLikeUpdate(article.id, liked, count);
    }
    window.dispatchEvent(new CustomEvent('article-like-updated', {
      detail: { articleId: article.id, isLiked: liked, likesCount: count }
    }));
  };

  // ===== FONCTIONS DE PARTAGE =====
  const getCurrentUrl = () => window.location.href;

  const getShareText = () => 
    `📰 ${article.title} - Découvrez cet article sur Pass Evala 2026`;

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getCurrentUrl())}`,
      '_blank',
      'width=600,height=400'
    );
    showSuccess('Partagé sur Facebook !');
  };

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText())}&url=${encodeURIComponent(getCurrentUrl())}`,
      '_blank',
      'width=600,height=400'
    );
    showSuccess('Partagé sur Twitter !');
  };

  const shareOnWhatsApp = () => {
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(getShareText() + ' ' + getCurrentUrl())}`,
      '_blank'
    );
    showSuccess('Partagé sur WhatsApp !');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getCurrentUrl());
      setCopied(true);
      showSuccess('Lien copié !');
      setTimeout(() => setCopied(false), 3000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = getCurrentUrl();
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      showSuccess('Lien copié !');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: getShareText(),
          url: getCurrentUrl(),
        });
        showSuccess('Article partagé !');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          showError('Erreur lors du partage');
        }
      }
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.8, y: 50, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 400 }}
        className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900 line-clamp-1">
            {article.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Image */}
          {article.image_path && (
            <img
              src={getImageUrl(article.image_path)}
              alt={article.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
          )}
          
          {/* Métadonnées */}
          <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {article.user?.name || 'Auteur anonyme'}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(article.created_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
            <span className="flex items-center gap-2">
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              {likesCount}
            </span>
          </div>

          {/* Contenu */}
          <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
            {article.content || article.summary}
          </div>

          {/* Actions sociales */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-4">
              <LikeButton
                articleId={article.id}
                initialLikesCount={likesCount}
                initialIsLiked={isLiked}
                onLikeChange={handleLikeChange}
              />

              <div className="relative">
                <button
                  onClick={shareNative}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <Share2 className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">Partager</span>
                </button>

                <AnimatePresence>
                  {showShareMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 p-2 min-w-[200px] z-20"
                    >
                      <button
                        onClick={shareOnFacebook}
                        className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                      >
                        <Facebook className="w-4 h-4 text-blue-600" />
                        Facebook
                      </button>
                      <button
                        onClick={shareOnTwitter}
                        className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                      >
                        <Twitter className="w-4 h-4 text-sky-500" />
                        Twitter
                      </button>
                      <button
                        onClick={shareOnWhatsApp}
                        className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                      >
                        <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        WhatsApp
                      </button>
                      <button
                        onClick={copyLink}
                        className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 text-green-500" />
                            <span className="text-green-500">Copié !</span>
                          </>
                        ) : (
                          <>
                            <Link2 className="w-4 h-4 text-gray-600" />
                            Copier le lien
                          </>
                        )}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ✅ Commentaires - On laisse CommentSection gérer le chargement */}
          <div className="mt-6">
            <CommentSection
              articleId={article.id}
              initialComments={[]} // ✅ On passe un tableau vide pour forcer le chargement
              onCommentChange={(newComments) => {
                // Optionnel : mettre à jour l'état local si besoin
                console.log('Commentaires mis à jour:', newComments);
              }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}





// import React, { useState, useEffect } from 'react';
// import { X, Heart, Share2, Facebook, Twitter, Link2, Check, User, Calendar } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Article } from '../../types';
// import { getImageUrl } from '../../utils/imageUtils';
// import { useToast } from '../../hooks/useToast';
// import { useAuth } from '../../store/authContext';
// import { likeService } from '../../services/likeService';
// import { commentService } from '../../services/commentService';
// import LikeButton from '../LikeButton';

// import CommentSection from '../CommentSection';

// interface ArticleModalProps {
//   article: Article;
//   onClose: () => void;
//   onLikeUpdate?: (articleId: number, isLiked: boolean, count: number) => void;
// }

// export default function ArticleModal({ article, onClose, onLikeUpdate }: ArticleModalProps) {
//   const [likesCount, setLikesCount] = useState(article.likes_count);
//   const [isLiked, setIsLiked] = useState(article.is_liked_by_user);
//   const [showShareMenu, setShowShareMenu] = useState(false);
//   const [copied, setCopied] = useState(false);
//   const { isAuthenticated } = useAuth();
//   const { showSuccess, showError } = useToast();

//   useEffect(() => {
//     setLikesCount(article.likes_count);
//     setIsLiked(article.is_liked_by_user);
//   }, [article]);

//   const handleLikeChange = (liked: boolean, count: number) => {
//     setIsLiked(liked);
//     setLikesCount(count);
//     if (onLikeUpdate) {
//       onLikeUpdate(article.id, liked, count);
//     }
//     window.dispatchEvent(new CustomEvent('article-like-updated', {
//       detail: { articleId: article.id, isLiked: liked, likesCount: count }
//     }));
//   };

//   // ===== FONCTIONS DE PARTAGE =====
//   const getCurrentUrl = () => window.location.href;

//   const getShareText = () => 
//     `📰 ${article.title} - Découvrez cet article sur Pass Evala 2026`;

//   const shareOnFacebook = () => {
//     window.open(
//       `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getCurrentUrl())}`,
//       '_blank',
//       'width=600,height=400'
//     );
//     showSuccess('Partagé sur Facebook !');
//   };

//   const shareOnTwitter = () => {
//     window.open(
//       `https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText())}&url=${encodeURIComponent(getCurrentUrl())}`,
//       '_blank',
//       'width=600,height=400'
//     );
//     showSuccess('Partagé sur Twitter !');
//   };

//   const shareOnWhatsApp = () => {
//     window.open(
//       `https://api.whatsapp.com/send?text=${encodeURIComponent(getShareText() + ' ' + getCurrentUrl())}`,
//       '_blank'
//     );
//     showSuccess('Partagé sur WhatsApp !');
//   };

//   const copyLink = async () => {
//     try {
//       await navigator.clipboard.writeText(getCurrentUrl());
//       setCopied(true);
//       showSuccess('Lien copié !');
//       setTimeout(() => setCopied(false), 3000);
//     } catch {
//       // Fallback
//       const textarea = document.createElement('textarea');
//       textarea.value = getCurrentUrl();
//       document.body.appendChild(textarea);
//       textarea.select();
//       document.execCommand('copy');
//       document.body.removeChild(textarea);
//       setCopied(true);
//       showSuccess('Lien copié !');
//       setTimeout(() => setCopied(false), 3000);
//     }
//   };

//   const shareNative = async () => {
//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: article.title,
//           text: getShareText(),
//           url: getCurrentUrl(),
//         });
//         showSuccess('Article partagé !');
//       } catch (error) {
//         if ((error as Error).name !== 'AbortError') {
//           showError('Erreur lors du partage');
//         }
//       }
//     } else {
//       setShowShareMenu(!showShareMenu);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//       onClick={onClose}
//     >
//       <motion.div
//         initial={{ scale: 0.8, y: 50, opacity: 0 }}
//         animate={{ scale: 1, y: 0, opacity: 1 }}
//         exit={{ scale: 0.8, y: 50, opacity: 0 }}
//         transition={{ type: 'spring', damping: 25, stiffness: 400 }}
//         className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
//           <h2 className="text-xl font-bold text-gray-900 line-clamp-1">
//             {article.title}
//           </h2>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//           >
//             <X className="w-6 h-6 text-gray-500" />
//           </button>
//         </div>

//         <div className="p-6">
//           {/* Image */}
//           {article.image_path && (
//             <img
//               src={getImageUrl(article.image_path)}
//               alt={article.title}
//               className="w-full h-64 object-cover rounded-lg mb-4"
//             />
//           )}
          
//           {/* Métadonnées */}
//           <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-500">
//             <span className="flex items-center gap-2">
//               <User className="w-4 h-4" />
//               {article.user?.name || 'Auteur anonyme'}
//             </span>
//             <span className="flex items-center gap-2">
//               <Calendar className="w-4 h-4" />
//               {new Date(article.created_at).toLocaleDateString('fr-FR', {
//                 day: 'numeric',
//                 month: 'long',
//                 year: 'numeric'
//               })}
//             </span>
//             <span className="flex items-center gap-2">
//               <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
//               {likesCount}
//             </span>
//           </div>

//           {/* Contenu */}
//           <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
//             {article.content || article.summary}
//           </div>

//           {/* Actions sociales */}
//           <div className="mt-6 pt-6 border-t border-gray-100">
//             <div className="flex flex-wrap items-center gap-4">
//               {/* Like Button */}
//               <LikeButton
//                 articleId={article.id}
//                 initialLikesCount={likesCount}
//                 initialIsLiked={isLiked}
//                 onLikeChange={handleLikeChange}
//               />

//               {/* Partager */}
//               <div className="relative">
//                 <button
//                   onClick={shareNative}
//                   className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
//                 >
//                   <Share2 className="w-4 h-4 text-gray-600" />
//                   <span className="text-sm font-medium text-gray-600">Partager</span>
//                 </button>

//                 <AnimatePresence>
//                   {showShareMenu && (
//                     <motion.div
//                       initial={{ opacity: 0, y: -10, scale: 0.95 }}
//                       animate={{ opacity: 1, y: 0, scale: 1 }}
//                       exit={{ opacity: 0, y: -10, scale: 0.95 }}
//                       className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 p-2 min-w-[200px] z-20"
//                     >
//                       <button
//                         onClick={shareOnFacebook}
//                         className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-sm"
//                       >
//                         <Facebook className="w-4 h-4 text-blue-600" />
//                         Facebook
//                       </button>
//                       <button
//                         onClick={shareOnTwitter}
//                         className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-sm"
//                       >
//                         <Twitter className="w-4 h-4 text-sky-500" />
//                         Twitter
//                       </button>
//                       <button
//                         onClick={shareOnWhatsApp}
//                         className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-sm"
//                       >
//                         <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
//                           <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
//                         </svg>
//                         WhatsApp
//                       </button>
//                       <button
//                         onClick={copyLink}
//                         className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-sm"
//                       >
//                         {copied ? (
//                           <>
//                             <Check className="w-4 h-4 text-green-500" />
//                             <span className="text-green-500">Copié !</span>
//                           </>
//                         ) : (
//                           <>
//                             <Link2 className="w-4 h-4 text-gray-600" />
//                             Copier le lien
//                           </>
//                         )}
//                       </button>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>

//             </div>
//           </div>

//           {/* Commentaires */}
//           <div className="mt-6">
//             <CommentSection
//               articleId={article.id}
//               initialComments={article.comments || []}
//             />
//           </div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// }