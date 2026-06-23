// hooks/useComments.ts
import { useState, useEffect } from 'react';
import { commentService } from '../services/commentService';
import { Comment } from '../types';

// ✅ Cache des commentaires
const commentCache = new Map<number, { data: Comment[]; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 secondes

export function useComments(articleId: number, initialComments: Comment[] = []) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // ✅ Vérifier le cache
    const cached = commentCache.get(articleId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setComments(cached.data);
      setIsLoaded(true);
      return;
    }

    if (initialComments.length > 0) {
      setComments(initialComments);
      commentCache.set(articleId, { data: initialComments, timestamp: Date.now() });
      setIsLoaded(true);
      return;
    }

    loadComments();
  }, [articleId]);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const data = await commentService.getComments(articleId);
      setComments(data || []);
      commentCache.set(articleId, { data: data || [], timestamp: Date.now() });
    } catch (error) {
      console.error('Erreur chargement commentaires:', error);
    } finally {
      setIsLoading(false);
      setIsLoaded(true);
    }
  };

  const addComment = (comment: Comment) => {
    setComments(prev => [comment, ...prev]);
    // ✅ Mettre à jour le cache
    const cached = commentCache.get(articleId);
    if (cached) {
      commentCache.set(articleId, { 
        data: [comment, ...cached.data], 
        timestamp: Date.now() 
      });
    }
  };

  const removeComment = (commentId: number) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
    const cached = commentCache.get(articleId);
    if (cached) {
      commentCache.set(articleId, { 
        data: cached.data.filter(c => c.id !== commentId), 
        timestamp: Date.now() 
      });
    }
  };

  const updateComment = (commentId: number, content: string) => {
    setComments(prev => 
      prev.map(c => c.id === commentId ? { ...c, content } : c)
    );
    const cached = commentCache.get(articleId);
    if (cached) {
      commentCache.set(articleId, { 
        data: cached.data.map(c => c.id === commentId ? { ...c, content } : c),
        timestamp: Date.now() 
      });
    }
  };

  return { 
    comments, 
    isLoading, 
    isLoaded, 
    setComments, 
    addComment, 
    removeComment, 
    updateComment,
    reload: loadComments 
  };
}