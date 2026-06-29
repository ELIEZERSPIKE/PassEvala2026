// components/CommentSection.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { commentService } from '../services/commentService';
import { useAuth } from '../store/authContext';
import { useToast } from '../hooks/useToast';
import { Send, User, MessageSquare, Loader2, AlertCircle } from 'lucide-react';
import { Comment } from '../types';
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

  // Émettre l'événement de mise à jour du compteur de commentaires
  const emitCommentCountUpdate = (count: number) => {
    window.dispatchEvent(new CustomEvent('article-comment-updated', {
      detail: { articleId, commentsCount: count }
    }));
  };

  useEffect(() => {
    if (initialComments.length === 0) {
      loadComments();
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
    setIsLoading(true);
    setError(null);
    try {
      const data = await commentService.getComments(articleId);
      const commentsData = Array.isArray(data) ? data : [];
      setComments(commentsData);
      emitCommentCountUpdate(commentsData.length);
    } catch (error) {
      console.error('Erreur chargement commentaires:', error);
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

    const newComments = [optimisticComment, ...comments];
    setComments(newComments);
    setNewComment('');
    emitCommentCountUpdate(newComments.length);
    if (onCommentChange) onCommentChange(newComments);

    try {
      const response = await commentService.create(articleId, trimmedComment);
      
      if (response && response.id) {
        const finalComments = newComments.map(c => 
          c.id === optimisticComment.id ? response : c
        );
        setComments(finalComments);
        emitCommentCountUpdate(finalComments.length);
        if (onCommentChange) onCommentChange(finalComments);
        showSuccess('Commentaire ajouté !');
      } else {
        setComments(comments);
        emitCommentCountUpdate(comments.length);
        showError("Erreur lors de l'ajout du commentaire");
      }
    } catch (error) {
      console.error('Erreur:', error);
      setComments(comments);
      emitCommentCountUpdate(comments.length);
      showError("Erreur lors de l'ajout du commentaire");
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
    emitCommentCountUpdate(updatedComments.length);

    try {
      await commentService.delete(commentId);
      showSuccess('Commentaire supprimé');
      if (onCommentChange) onCommentChange(updatedComments);
    } catch (error) {
      setComments(comments);
      emitCommentCountUpdate(comments.length);
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
    e.stopPropagation();
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