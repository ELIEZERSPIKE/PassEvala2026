// components/CommentItem.tsx
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '../store/authContext';
import { useToast } from '../hooks/useToast';
import { Trash2, Edit2, Check, X, Clock } from 'lucide-react';
import { Comment } from '../types';

interface CommentItemProps {
  comment: Comment;
  onEdit: (commentId: number, content: string) => Promise<void>;
  onDelete: (commentId: number) => Promise<void>;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'à l\'instant';
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `il y a ${days} jour${days > 1 ? 's' : ''}`;
  }
  
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export default function CommentItem({ comment, onEdit, onDelete }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { showWarning } = useToast();

  const isOwner = isAuthenticated && user?.id === comment.user_id;

  const handleEdit = async () => {
    if (!editContent.trim() || editContent === comment.content) {
      setIsEditing(false);
      return;
    }

    setIsSubmitting(true);
    try {
      await onEdit(comment.id, editContent);
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEdit();
    }
    if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className="group p-4 rounded-xl transition-all duration-200 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>

        {/* Contenu */}
        <div className="flex-1 min-w-0">
          {/* En-tête */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-[#222222] text-sm">
                {comment.user?.name || 'Utilisateur'}
              </span>
              <span className="text-xs text-gray-400">
                @{comment.user?.username || 'unknown'}
              </span>
              <span className="text-xs text-gray-300 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTimeAgo(new Date(comment.created_at))}
              </span>
            </div>

            {/* Actions */}
            {isOwner && !isEditing && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  aria-label="Modifier"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(comment.id)}
                  className="p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  aria-label="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Contenu du commentaire */}
          {isEditing ? (
            <div className="mt-2">
              <div className="flex flex-col gap-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none min-h-[60px]"
                  rows={3}
                  autoFocus
                  disabled={isSubmitting}
                />
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
                    disabled={isSubmitting}
                  >
                    <X className="w-4 h-4" />
                    Annuler
                  </button>
                  <button
                    onClick={handleEdit}
                    disabled={isSubmitting || !editContent.trim() || editContent === comment.content}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                  >
                    <Check className="w-4 h-4" />
                    {isSubmitting ? 'En cours...' : 'Enregistrer'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 text-sm leading-relaxed break-words whitespace-pre-wrap">
              {comment.content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}





// import { motion } from 'framer-motion';
// import { useState } from 'react';
// import { useAuth } from '../store/authContext';
// import { useToast } from '../hooks/useToast';
// import { Trash2, Edit2, Check, X, User, Clock } from 'lucide-react';
// import { Comment } from '../types';
// import { formatDistanceToNow } from 'date-fns';
// import { fr } from 'date-fns/locale';

// interface CommentItemProps {
//   comment: Comment;
//   onEdit: (commentId: number, content: string) => Promise<void>;
//   onDelete: (commentId: number) => Promise<void>;
//   isLast?: boolean; 
// }

// export default function CommentItem({ 
//   comment, 
//   onEdit, 
//   onDelete,
//   isLast = false 
// }: CommentItemProps) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [editContent, setEditContent] = useState(comment.content);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { user, isAuthenticated } = useAuth();
//   const { showWarning } = useToast();

//   const isOwner = isAuthenticated && user?.id === comment.user_id;

//   const handleEdit = async () => {
//     if (!editContent.trim() || editContent === comment.content) {
//       setIsEditing(false);
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       await onEdit(comment.id, editContent);
//       setIsEditing(false);
//     } catch (error) {
//       console.error('Erreur:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditContent(comment.content);
//     setIsEditing(false);
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleEdit();
//     }
//     if (e.key === 'Escape') {
//       handleCancelEdit();
//     }
//   };

//   return (
//     <motion.div 
//       className={`group p-4 rounded-xl transition-all duration-200 ${
//         isLast ? '' : 'border-b border-gray-100'
//       } hover:bg-gray-50`}
//       layout
//     >
//       <div className="flex items-start gap-3">
//         <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
//           {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
//         </div>

//         <div className="flex-1 min-w-0">
//           <div className="flex items-center justify-between gap-2 mb-1">
//             <div className="flex items-center gap-2 flex-wrap">
//               <span className="font-semibold text-[#222222] text-sm">
//                 {comment.user?.name || 'Utilisateur'}
//               </span>
//               <span className="text-xs text-gray-400">
//                 @{comment.user?.username || 'unknown'}
//               </span>
//               <span className="text-xs text-gray-300 flex items-center gap-1">
//                 <Clock className="w-3 h-3" />
//                 {formatDistanceToNow(new Date(comment.created_at), { 
//                   addSuffix: true,
//                   locale: fr 
//                 })}
//               </span>
//             </div>

//             {isOwner && !isEditing && (
//               <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => setIsEditing(true)}
//                   className="p-1 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
//                   aria-label="Modifier"
//                 >
//                   <Edit2 className="w-4 h-4" />
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => onDelete(comment.id)}
//                   className="p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
//                   aria-label="Supprimer"
//                 >
//                   <Trash2 className="w-4 h-4" />
//                 </motion.button>
//               </div>
//             )}
//           </div>

//           {isEditing ? (
//             <motion.div 
//               className="mt-2"
//               initial={{ opacity: 0, y: 5 }}
//               animate={{ opacity: 1, y: 0 }}
//             >
//               <div className="flex flex-col gap-2">
//                 <textarea
//                   value={editContent}
//                   onChange={(e) => setEditContent(e.target.value)}
//                   onKeyDown={handleKeyDown}
//                   className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none min-h-[60px]"
//                   rows={3}
//                   autoFocus
//                   disabled={isSubmitting}
//                 />
//                 <div className="flex items-center gap-2 justify-end">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={handleCancelEdit}
//                     className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
//                     disabled={isSubmitting}
//                   >
//                     <X className="w-4 h-4" />
//                     Annuler
//                   </motion.button>
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={handleEdit}
//                     disabled={isSubmitting || !editContent.trim() || editContent === comment.content}
//                     className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
//                   >
//                     <Check className="w-4 h-4" />
//                     {isSubmitting ? 'En cours...' : 'Enregistrer'}
//                   </motion.button>
//                 </div>
//               </div>
//             </motion.div>
//           ) : (
//             <p className="text-gray-700 text-sm leading-relaxed break-words whitespace-pre-wrap">
//               {comment.content}
//             </p>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );
// }