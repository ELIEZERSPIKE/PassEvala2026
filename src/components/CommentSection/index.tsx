// components/CommentSection/index.tsx
import { useState, useEffect } from 'react';
import { MessageSquare, Loader2, AlertCircle } from 'lucide-react';
import { commentService } from '../../services/commentService';
import { useAuth } from '../../store/authContext';
import { useToast } from '../../hooks/useToast';
import { Comment } from '../../types';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

interface CommentSectionProps {
  articleId: number;
  initialComments?: Comment[];
  onCommentChange?: (comments: Comment[]) => void;
}

export default function CommentSection({
  articleId,
  initialComments = [],
  onCommentChange,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError, showWarning } = useToast();

  const emitCommentCountUpdate = (count: number) => {
    window.dispatchEvent(new CustomEvent('article-comment-updated', {
      detail: { articleId, commentsCount: count },
    }));
  };

  useEffect(() => {
    if (initialComments.length === 0) {
      loadComments();
    }
  }, [articleId]);

  const loadComments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await commentService.getComments(articleId);
      const commentsData = Array.isArray(data) ? data : [];
      setComments(commentsData);
      emitCommentCountUpdate(commentsData.length);
    } catch {
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

    // Commentaire optimiste
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

      if (response?.id) {
        // Remplace le commentaire optimiste par la vraie réponse serveur
        const finalComments = newComments.map((c) =>
          c.id === optimisticComment.id ? response : c
        );
        setComments(finalComments);
        emitCommentCountUpdate(finalComments.length);
        if (onCommentChange) onCommentChange(finalComments);
        showSuccess('Commentaire ajouté !');
      } else {
        throw new Error('Réponse invalide');
      }
    } catch {
      // Rollback optimiste
      setComments(comments);
      emitCommentCountUpdate(comments.length);
      if (onCommentChange) onCommentChange(comments);
      showError("Erreur lors de l'ajout du commentaire");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!isAuthenticated) return;

    const comment = comments.find((c) => c.id === commentId);
    if (comment?.user_id !== user?.id) {
      showWarning('Vous ne pouvez pas supprimer ce commentaire');
      return;
    }
    if (!confirm('Supprimer ce commentaire ?')) return;

    // Optimiste
    const updatedComments = comments.filter((c) => c.id !== commentId);
    setComments(updatedComments);
    emitCommentCountUpdate(updatedComments.length);

    try {
      await commentService.delete(commentId);
      showSuccess('Commentaire supprimé');
      if (onCommentChange) onCommentChange(updatedComments);
    } catch {
      // Rollback
      setComments(comments);
      emitCommentCountUpdate(comments.length);
      showError('Erreur lors de la suppression');
    }
  };

  const handleEdit = async (commentId: number, content: string) => {
    if (!isAuthenticated) return;

    const comment = comments.find((c) => c.id === commentId);
    if (comment?.user_id !== user?.id) {
      showWarning('Vous ne pouvez pas modifier ce commentaire');
      return;
    }

    const previousComments = [...comments];

    // Optimiste : mise à jour immédiate du contenu
    const optimisticComments = comments.map((c) =>
      c.id === commentId ? { ...c, content } : c
    );
    setComments(optimisticComments);

    try {
      // Le serveur renvoie le commentaire complet mis à jour
      const updated = await commentService.update(commentId, content);

      if (updated?.id) {
        // Remplace avec la vraie réponse serveur (updated_at correct, etc.)
        const finalComments = comments.map((c) =>
          c.id === commentId ? updated : c
        );
        setComments(finalComments);
        if (onCommentChange) onCommentChange(finalComments);
      }

      showSuccess('Commentaire modifié');
    } catch {
      // Rollback
      setComments(previousComments);
      showError('Erreur lors de la modification');
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

      {/* Formulaire ou message de connexion */}
      {isAuthenticated ? (
        <CommentForm
          value={newComment}
          onChange={setNewComment}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      ) : (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 text-center mb-6">
          <p className="text-gray-600">
            <button
              onClick={() => showWarning('Connectez-vous pour commenter')}
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-all"
            >
              Connectez-vous
            </button>{' '}
            pour rejoindre la discussion
          </p>
        </div>
      )}

      {/* Erreur */}
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

      {/* Liste */}
      {!isLoading && (
        <CommentList
          comments={comments}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}