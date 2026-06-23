// components/CommentSection.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { commentService } from '../services/commentService';
import { useAuth } from '../store/authContext';
import { useToast } from '../hooks/useToast';
import { Send, User, MessageSquare, Loader2, AlertCircle } from 'lucide-react';
import { Comment } from '../types';
import NotificationBadge from './Animations/NotificationBadge';
import CommentItem from './CommentItem';

interface CommentSectionProps {
  articleId: number;
  initialComments?: Comment[];
  onCommentChange?: (comments: Comment[]) => void;
}

export default function CommentSection({ 
  articleId, 
  initialComments = [],
  onCommentChange 
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError, showWarning } = useToast();

  // ✅ LOG: Vérifier les props reçues
  console.log('🔍 CommentSection - Props:', {
    articleId,
    initialCommentsLength: initialComments?.length || 0,
    initialComments: initialComments
  });

  // Charger les commentaires au montage
  useEffect(() => {
    console.log('🔄 CommentSection - useEffect articleId:', articleId);
    if (initialComments.length === 0) {
      console.log('📡 CommentSection - Chargement des commentaires...');
      loadComments();
    } else {
      console.log('✅ CommentSection - Utilisation des commentaires initiaux:', initialComments.length);
    }
  }, [articleId]);

  // Auto-resize du textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [newComment]);

  const loadComments = async () => {
    console.log('⏳ loadComments - Début pour article:', articleId);
    setIsLoading(true);
    setError(null);
    try {
      const data = await commentService.getComments(articleId);
      console.log('✅ loadComments - Données reçues:', data);
      console.log('📊 loadComments - Nombre:', data?.length || 0);
      
      // ✅ S'assurer que data est bien un tableau
      const commentsData = Array.isArray(data) ? data : [];
      setComments(commentsData);
      
      if (commentsData.length === 0) {
        console.log('ℹ️ loadComments - Aucun commentaire trouvé');
      }
    } catch (error) {
      console.error('❌ loadComments - Erreur:', error);
      setError('Impossible de charger les commentaires.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      showWarning('Connectez-vous pour commenter');
      return;
    }

    const trimmedComment = newComment.trim();
    if (!trimmedComment) {
      showWarning('Écrivez un commentaire');
      return;
    }

    if (trimmedComment.length > 1000) {
      showWarning('Le commentaire ne peut pas dépasser 1000 caractères');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    // Création du commentaire optimiste
    const optimisticComment: Comment = {
      id: Date.now(),
      user_id: user!.id,
      article_id: articleId,
      parent_id: null,
      content: trimmedComment,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: {
        id: user!.id,
        name: user!.name || 'Utilisateur',
        username: user!.username,
      },
    };

    // Ajout immédiat du commentaire
    const newComments = [optimisticComment, ...comments];
    setComments(newComments);
    setNewComment('');
    if (onCommentChange) onCommentChange(newComments);

    try {
      const response = await commentService.create(articleId, trimmedComment);
      console.log('✅ handleSubmit - Réponse create:', response);
      
      if (response && response.id) {
        // Remplacement du commentaire temporaire par le vrai
        const finalComments = newComments.map(c => 
          c.id === optimisticComment.id ? response : c
        );
        setComments(finalComments);
        if (onCommentChange) onCommentChange(finalComments);
        showSuccess('Commentaire ajouté !');
      } else {
        // Échec : on revient en arrière
        setComments(comments);
        showError('Erreur lors de l\'ajout du commentaire');
      }
    } catch (error) {
      console.error('❌ handleSubmit - Erreur:', error);
      setComments(comments);
      showError('Erreur lors de l\'ajout du commentaire');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!isAuthenticated) return;
    
    const comment = comments.find(c => c.id === commentId);
    if (comment?.user_id !== user?.id) {
      showWarning('Vous ne pouvez pas supprimer ce commentaire');
      return;
    }

    if (!confirm('Supprimer ce commentaire ?')) return;

    const updatedComments = comments.filter(c => c.id !== commentId);
    setComments(updatedComments);

    try {
      await commentService.delete(commentId);
      showSuccess('Commentaire supprimé');
      if (onCommentChange) onCommentChange(updatedComments);
    } catch (error) {
      setComments(comments);
      showError('Erreur lors de la suppression');
    }
  };

  const handleEdit = async (commentId: number, content: string) => {
    if (!isAuthenticated) return;

    const comment = comments.find(c => c.id === commentId);
    if (comment?.user_id !== user?.id) {
      showWarning('Vous ne pouvez pas modifier ce commentaire');
      return;
    }

    const previousComments = [...comments];
    const updatedComments = comments.map(c => c.id === commentId ? { ...c, content } : c);
    setComments(updatedComments);

    try {
      await commentService.update(commentId, content);
      showSuccess('Commentaire modifié');
      if (onCommentChange) onCommentChange(updatedComments);
    } catch (error) {
      setComments(previousComments);
      showError('Erreur lors de la modification');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="mt-8 border-t border-gray-200 pt-8">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          <h3 className="font-display font-bold text-xl text-[#222222]">
            Commentaires
          </h3>
          {comments.length > 0 && (
            <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
              {comments.length}
            </span>
          )}
        </div>
        {isLoading && <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />}
      </div>

      {/* Formulaire d'ajout */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex flex-col gap-2">
            <div className="relative">
              <div className="absolute left-3 top-3">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <textarea
                ref={textareaRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Écrire un commentaire..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none min-h-[60px] max-h-[150px] bg-gray-50 hover:bg-white focus:bg-white"
                rows={2}
                disabled={isSubmitting}
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                {newComment.length}/1000
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-2">
              {newComment.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setNewComment('')}
                  className="text-sm text-gray-400 hover:text-gray-600 transition-colors px-3 py-1"
                >
                  Effacer
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-medium"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Commenter
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 text-center mb-6">
          <p className="text-gray-600">
            <button 
              onClick={() => showWarning('Connectez-vous pour commenter')}
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-all"
            >
              Connectez-vous
            </button> pour rejoindre la discussion
          </p>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
          <button 
            onClick={loadComments}
            className="ml-auto text-sm font-medium hover:underline"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Liste des commentaires */}
      {!isLoading && (
        <AnimatePresence>
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-400 font-medium">
                  Aucun commentaire pour le moment
                </p>
                <p className="text-sm text-gray-300">
                  Soyez le premier à partager votre avis !
                </p>
              </div>
            ) : (
              comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}







// components/CommentSection.tsx
// import { motion, AnimatePresence } from 'framer-motion';
// import { useState, useEffect, useRef } from 'react';
// import { commentService } from '../services/commentService';
// import { useAuth } from '../store/authContext';
// import { useToast } from '../hooks/useToast';
// import { Send, User, MessageSquare, Loader2, AlertCircle } from 'lucide-react';
// import { Comment } from '../types';
// import NotificationBadge from './Animations/NotificationBadge';
// import CommentItem from './CommentItem';

// interface CommentSectionProps {
//   articleId: number;
//   initialComments?: Comment[];
//   onCommentChange?: (comments: Comment[]) => void;
// }

// export default function CommentSection({ 
//   articleId, 
//   initialComments = [],
//   onCommentChange 
// }: CommentSectionProps) {
//   const [comments, setComments] = useState<Comment[]>(initialComments);
//   const [newComment, setNewComment] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const textareaRef = useRef<HTMLTextAreaElement>(null);
//   const { user, isAuthenticated } = useAuth();
//   const { showSuccess, showError, showWarning } = useToast();

//   // Charger les commentaires au montage
//   useEffect(() => {
//     if (initialComments.length === 0) {
//       loadComments();
//     }
//   }, [articleId]);

//   // Auto-resize du textarea
//   useEffect(() => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = 'auto';
//       textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
//     }
//   }, [newComment]);

//   const loadComments = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const data = await commentService.getComments(articleId);
//       setComments(data || []);
//     } catch (error) {
//       console.error('Erreur chargement commentaires:', error);
//       setError('Impossible de charger les commentaires.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!isAuthenticated) {
//       showWarning('Connectez-vous pour commenter');
//       return;
//     }

//     const trimmedComment = newComment.trim();
//     if (!trimmedComment) {
//       showWarning('Écrivez un commentaire');
//       return;
//     }

//     if (trimmedComment.length > 1000) {
//       showWarning('Le commentaire ne peut pas dépasser 1000 caractères');
//       return;
//     }

//     setIsSubmitting(true);
//     setError(null);
    
//     // Création du commentaire optimiste
//     const optimisticComment: Comment = {
//       id: Date.now(),
//       user_id: user!.id,
//       article_id: articleId,
//       parent_id: null,
//       content: trimmedComment,
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString(),
//       user: {
//         id: user!.id,
//         name: user!.name || 'Utilisateur',
//         username: user!.username,
//       },
//     };

//     // Ajout immédiat du commentaire
//     const newComments = [optimisticComment, ...comments];
//     setComments(newComments);
//     setNewComment('');
//     if (onCommentChange) onCommentChange(newComments);

//     try {
//       const response = await commentService.create(articleId, trimmedComment);
      
//       if (response && response.id) {
//         // Remplacement du commentaire temporaire par le vrai
//         const finalComments = newComments.map(c => 
//           c.id === optimisticComment.id ? response : c
//         );
//         setComments(finalComments);
//         if (onCommentChange) onCommentChange(finalComments);
//         showSuccess('Commentaire ajouté !');
//       } else {
//         // Échec : on revient en arrière
//         setComments(comments);
//         showError('Erreur lors de l\'ajout du commentaire');
//       }
//     } catch (error) {
//       console.error('Erreur:', error);
//       setComments(comments);
//       showError('Erreur lors de l\'ajout du commentaire');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDelete = async (commentId: number) => {
//     if (!isAuthenticated) return;
    
//     const comment = comments.find(c => c.id === commentId);
//     if (comment?.user_id !== user?.id) {
//       showWarning('Vous ne pouvez pas supprimer ce commentaire');
//       return;
//     }

//     if (!confirm('Supprimer ce commentaire ?')) return;

//     const updatedComments = comments.filter(c => c.id !== commentId);
//     setComments(updatedComments);

//     try {
//       await commentService.delete(commentId);
//       showSuccess('Commentaire supprimé');
//       if (onCommentChange) onCommentChange(updatedComments);
//     } catch (error) {
//       setComments(comments);
//       showError('Erreur lors de la suppression');
//     }
//   };

//   const handleEdit = async (commentId: number, content: string) => {
//     if (!isAuthenticated) return;

//     const comment = comments.find(c => c.id === commentId);
//     if (comment?.user_id !== user?.id) {
//       showWarning('Vous ne pouvez pas modifier ce commentaire');
//       return;
//     }

//     const previousComments = [...comments];
//     const updatedComments = comments.map(c => c.id === commentId ? { ...c, content } : c);
//     setComments(updatedComments);

//     try {
//       await commentService.update(commentId, content);
//       showSuccess('Commentaire modifié');
//       if (onCommentChange) onCommentChange(updatedComments);
//     } catch (error) {
//       setComments(previousComments);
//       showError('Erreur lors de la modification');
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit(e as any);
//     }
//   };

//   return (
//     <div className="mt-8 border-t border-gray-200 pt-8">
//       {/* En-tête */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-3">
//           <MessageSquare className="w-6 h-6 text-blue-600" />
//           <h3 className="font-display font-bold text-xl text-[#222222]">
//             Commentaires
//           </h3>
//           {comments.length > 0 && (
//             <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
//               {comments.length}
//             </span>
//           )}
//         </div>
//         {isLoading && <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />}
//       </div>

//       {/* Formulaire d'ajout */}
//       {isAuthenticated ? (
//         <form onSubmit={handleSubmit} className="mb-6">
//           <div className="flex flex-col gap-2">
//             <div className="relative">
//               <div className="absolute left-3 top-3">
//                 <User className="w-5 h-5 text-gray-400" />
//               </div>
//               <textarea
//                 ref={textareaRef}
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 placeholder="Écrire un commentaire..."
//                 className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none min-h-[60px] max-h-[150px] bg-gray-50 hover:bg-white focus:bg-white"
//                 rows={2}
//                 disabled={isSubmitting}
//               />
//               <div className="absolute bottom-3 right-3 text-xs text-gray-400">
//                 {newComment.length}/1000
//               </div>
//             </div>
            
//             <div className="flex items-center justify-end gap-2">
//               {newComment.length > 0 && (
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   type="button"
//                   onClick={() => setNewComment('')}
//                   className="text-sm text-gray-400 hover:text-gray-600 transition-colors px-3 py-1"
//                 >
//                   Effacer
//                 </motion.button>
//               )}
//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 type="submit"
//                 disabled={isSubmitting || !newComment.trim()}
//                 className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-medium"
//               >
//                 {isSubmitting ? (
//                   <>
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                     Envoi...
//                   </>
//                 ) : (
//                   <>
//                     <Send className="w-4 h-4" />
//                     Commenter
//                   </>
//                 )}
//               </motion.button>
//             </div>
//           </div>
//         </form>
//       ) : (
//         <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 text-center mb-6">
//           <p className="text-gray-600">
//             <button 
//               onClick={() => showWarning('Connectez-vous pour commenter')}
//               className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-all"
//             >
//               Connectez-vous
//             </button> pour rejoindre la discussion
//           </p>
//         </div>
//       )}

//       {/* Message d'erreur */}
//       {error && (
//         <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
//           <AlertCircle className="w-5 h-5 flex-shrink-0" />
//           <span>{error}</span>
//           <button 
//             onClick={loadComments}
//             className="ml-auto text-sm font-medium hover:underline"
//           >
//             Réessayer
//           </button>
//         </div>
//       )}

//       {/* Liste des commentaires */}
//       {!isLoading && (
//         <AnimatePresence>
//           <div className="space-y-4">
//             {comments.length === 0 ? (
//               <div className="text-center py-8">
//                 <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                   <MessageSquare className="w-8 h-8 text-gray-400" />
//                 </div>
//                 <p className="text-gray-400 font-medium">
//                   Aucun commentaire pour le moment
//                 </p>
//                 <p className="text-sm text-gray-300">
//                   Soyez le premier à partager votre avis !
//                 </p>
//               </div>
//             ) : (
//               comments.map((comment) => (
//                 <CommentItem
//                   key={comment.id}
//                   comment={comment}
//                   onEdit={handleEdit}
//                   onDelete={handleDelete}
//                 />
//               ))
//             )}
//           </div>
//         </AnimatePresence>
//       )}
//     </div>
//   );
// }



// import { motion, AnimatePresence } from 'framer-motion';
// import { useState, useEffect, useRef } from 'react';
// import { commentService } from '../services/commentService';
// import { useAuth } from '../store/authContext';
// import { useToast } from '../hooks/useToast';
// import { Send, User, MessageSquare, Loader2, AlertCircle } from 'lucide-react';
// import { Comment } from '../types';
// import NotificationBadge from './Animations/NotificationBadge';
// import CommentItem from './CommentItem';

// interface CommentSectionProps {
//   articleId: number;
//   initialComments?: Comment[];
//   onCommentChange?: (comments: Comment[]) => void;
//   maxHeight?: string;
// }

// export default function CommentSection({ 
//   articleId, 
//   initialComments = [],
//   onCommentChange,
//   maxHeight = '600px'
// }: CommentSectionProps) {
//   const [comments, setComments] = useState<Comment[]>(initialComments);
//   const [newComment, setNewComment] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const textareaRef = useRef<HTMLTextAreaElement>(null);
//   const commentsEndRef = useRef<HTMLDivElement>(null);
//   const { user, isAuthenticated } = useAuth();
//   const { showSuccess, showError, showWarning } = useToast();

//   useEffect(() => {
//     if (initialComments.length === 0) {
//       loadComments();
//     }
//   }, [articleId]);

//   useEffect(() => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = 'auto';
//       textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
//     }
//   }, [newComment]);

//   useEffect(() => {
//     if (comments.length > 0 && commentsEndRef.current) {
//       commentsEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
//     }
//   }, [comments]);

//   const loadComments = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const data = await commentService.getComments(articleId);
//       setComments(data || []);
//     } catch (error) {
//       console.error('Erreur chargement commentaires:', error);
//       setError('Impossible de charger les commentaires. Veuillez réessayer.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!isAuthenticated) {
//       showWarning('Connectez-vous pour commenter');
//       return;
//     }

//     const trimmedComment = newComment.trim();
//     if (!trimmedComment) {
//       showWarning('Écrivez un commentaire');
//       return;
//     }

//     if (trimmedComment.length < 2) {
//       showWarning('Le commentaire doit faire au moins 2 caractères');
//       return;
//     }

//     if (trimmedComment.length > 1000) {
//       showWarning('Le commentaire ne peut pas dépasser 1000 caractères');
//       return;
//     }

//     setIsSubmitting(true);
//     setError(null);
    
//     const optimisticComment: Comment = {
//       id: Date.now(),
//       user_id: user!.id,
//       article_id: articleId,
//       parent_id: null,
//       content: trimmedComment,
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString(),
//       user: {
//         id: user!.id,
//         name: user!.name || 'Utilisateur',
//         username: user!.username,
//       },
//     };

//     const newComments = [optimisticComment, ...comments];
//     setComments(newComments);
//     setNewComment('');
//     if (onCommentChange) onCommentChange(newComments);

//     try {
//       const response = await commentService.create(articleId, trimmedComment);
      
//       if (response && response.id) {
//         const finalComments = [response, ...comments];
//         setComments(finalComments);
//         if (onCommentChange) onCommentChange(finalComments);
//         showSuccess('Commentaire ajouté !');
//       } else {
//         setComments(comments);
//         showError('Erreur lors de l\'ajout du commentaire');
//       }
//     } catch (error) {
//       console.error('Erreur:', error);
//       setComments(comments);
//       showError('Erreur lors de l\'ajout du commentaire');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDelete = async (commentId: number) => {
//     if (!isAuthenticated) return;
    
//     const comment = comments.find(c => c.id === commentId);
//     if (comment?.user_id !== user?.id) {
//       showWarning('Vous ne pouvez pas supprimer ce commentaire');
//       return;
//     }

//     if (!confirm('Supprimer ce commentaire ?')) return;

//     const updatedComments = comments.filter(c => c.id !== commentId);
//     setComments(updatedComments);

//     try {
//       await commentService.delete(commentId);
//       showSuccess('Commentaire supprimé');
//       if (onCommentChange) onCommentChange(updatedComments);
//     } catch (error) {
//       setComments(comments);
//       showError('Erreur lors de la suppression');
//     }
//   };

//   const handleEdit = async (commentId: number, content: string) => {
//     if (!isAuthenticated) return;

//     const comment = comments.find(c => c.id === commentId);
//     if (comment?.user_id !== user?.id) {
//       showWarning('Vous ne pouvez pas modifier ce commentaire');
//       return;
//     }

//     const previousComments = [...comments];
//     const updatedComments = comments.map(c => c.id === commentId ? { ...c, content } : c);
//     setComments(updatedComments);

//     try {
//       await commentService.update(commentId, content);
//       showSuccess('Commentaire modifié');
//       if (onCommentChange) onCommentChange(updatedComments);
//     } catch (error) {
//       setComments(previousComments);
//       showError('Erreur lors de la modification');
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit(e as any);
//     }
//   };

//   return (
//     <div className="mt-8 border-t border-gray-200 pt-8">
//       {/* En-tête avec animations */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-3">
//           <div className="relative">
//             <MessageSquare className="w-6 h-6 text-blue-600" />
//             <NotificationBadge 
//               count={comments.length} 
//               className="absolute -top-2 -right-2" 
//             />
//           </div>
//           <h3 className="font-display font-bold text-xl text-[#222222]">
//             Commentaires
//           </h3>
//         </div>
//         <div className="flex items-center gap-3">
//           {isLoading && <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />}
//           {comments.length > 0 && (
//             <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
//               {comments.length}
//             </span>
//           )}
//         </div>
//       </div>

//       {/* Formulaire d'ajout amélioré */}
//       {isAuthenticated ? (
//         <motion.form 
//           onSubmit={handleSubmit} 
//           className="mb-6"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3 }}
//         >
//           <div className="flex flex-col gap-2">
//             <div className="relative">
//               <div className="absolute left-3 top-3">
//                 <User className="w-5 h-5 text-gray-400" />
//               </div>
//               <textarea
//                 ref={textareaRef}
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 placeholder="Écrire un commentaire..."
//                 className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none min-h-[60px] max-h-[150px] bg-gray-50 hover:bg-white focus:bg-white"
//                 rows={2}
//                 disabled={isSubmitting}
//               />
//               <div className="absolute bottom-3 right-3 text-xs text-gray-400">
//                 {newComment.length}/1000
//               </div>
//             </div>
            
//             <div className="flex items-center justify-between">
//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 type="submit"
//                 disabled={isSubmitting || !newComment.trim()}
//                 className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-medium"
//               >
//                 {isSubmitting ? (
//                   <>
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                     Envoi...
//                   </>
//                 ) : (
//                   <>
//                     <Send className="w-4 h-4" />
//                     Commenter
//                   </>
//                 )}
//               </motion.button>
              
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 type="button"
//                 onClick={() => setNewComment('')}
//                 className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 Effacer
//               </motion.button>
//             </div>
//           </div>
//         </motion.form>
//       ) : (
//         <motion.div 
//           className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 text-center mb-6"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//         >
//           <p className="text-gray-600">
//             <button 
//               onClick={() => showWarning('Connectez-vous pour commenter')}
//               className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-all"
//             >
//               Connectez-vous
//             </button> pour rejoindre la discussion
//           </p>
//         </motion.div>
//       )}

//       {/* Message d'erreur */}
//       {error && (
//         <motion.div 
//           className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700"
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//         >
//           <AlertCircle className="w-5 h-5 flex-shrink-0" />
//           <span>{error}</span>
//           <button 
//             onClick={loadComments}
//             className="ml-auto text-sm font-medium hover:underline"
//           >
//             Réessayer
//           </button>
//         </motion.div>
//       )}

//       {/* Liste des commentaires */}
//       <div className={`overflow-y-auto transition-all duration-300 ${!isExpanded ? 'max-h-[400px]' : ''}`}>
//         {!isLoading && (
//           <AnimatePresence mode="popLayout">
//             <div className="space-y-4">
//               {comments.length === 0 ? (
//                 <motion.div 
//                   className="text-center py-8"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                 >
//                   <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                     <MessageSquare className="w-8 h-8 text-gray-400" />
//                   </div>
//                   <p className="text-gray-400 font-medium">
//                     Aucun commentaire pour le moment
//                   </p>
//                   <p className="text-sm text-gray-300">
//                     Soyez le premier à partager votre avis !
//                   </p>
//                 </motion.div>
//               ) : (
//                 comments.map((comment, index) => (
//                   <motion.div
//                     key={comment.id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, x: -100 }}
//                     transition={{ delay: index * 0.05 }}
//                   >
//                     <CommentItem
//                       comment={comment}
//                       onEdit={handleEdit}
//                       onDelete={handleDelete}
//                       isLast={index === comments.length - 1}
//                     />
//                   </motion.div>
//                 ))
//               )}
//               <div ref={commentsEndRef} />
//             </div>
//           </AnimatePresence>
//         )}
//       </div>

//       {/* Bouton pour voir plus */}
//       {comments.length > 5 && !isExpanded && (
//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           onClick={() => setIsExpanded(!isExpanded)}
//           className="mt-4 w-full py-3 text-center text-blue-600 hover:text-blue-700 font-medium transition-colors border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-200"
//         >
//           {isExpanded ? 'Voir moins' : `Voir tous les commentaires (${comments.length})`}
//         </motion.button>
//       )}
//     </div>
//   );
// }