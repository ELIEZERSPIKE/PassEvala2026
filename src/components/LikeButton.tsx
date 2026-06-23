// components/LikeButton.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { likeService } from '../services/likeService';
import { useAuth } from '../store/authContext';
import { useToast } from '../hooks/useToast';

interface LikeButtonProps {
  articleId: number;
  initialLikesCount: number;
  initialIsLiked?: boolean;
  onLikeChange?: (isLiked: boolean, count: number) => void;
}

export default function LikeButton({
  articleId,
  initialLikesCount,
  initialIsLiked = false,
  onLikeChange,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLoading, setIsLoading] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const { isAuthenticated } = useAuth();
  const { showWarning, showError } = useToast();

  useEffect(() => {
    setIsLiked(initialIsLiked);
    setLikesCount(initialLikesCount);
  }, [initialIsLiked, initialLikesCount]);

  const createHeartExplosion = () => {
    const newHearts = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 100, // -50 à +50
      y: (Math.random() - 0.5) * 100 - 30, // -80 à -30 (vers le haut)
    }));
    setHearts(newHearts);
    setTimeout(() => setHearts([]), 1500);
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      showWarning('Connectez-vous pour liker');
      return;
    }

    // ✅ Si déjà liké, on ne fait rien (ou on peut déliker)
    if (isLiked) {
      // Option 1: Ne rien faire
      // Option 2: Déliker (comportement toggle)
      // On va faire un toggle classique
    }

    const previousIsLiked = isLiked;
    const previousCount = likesCount;
    
    // Optimistic update
    const newIsLiked = !isLiked;
    const newCount = newIsLiked ? likesCount + 1 : likesCount - 1;
    
    setIsLiked(newIsLiked);
    setLikesCount(newCount);
    
    // ✅ Animation TikTok : explosion de cœurs
    if (newIsLiked) {
      createHeartExplosion();
    }
    
    setIsLoading(true);

    try {
      const response = await likeService.toggle(articleId);
      setIsLiked(response.is_liked);
      setLikesCount(response.likes_count);
      
      if (onLikeChange) {
        onLikeChange(response.is_liked, response.likes_count);
      }
    } catch (error) {
      setIsLiked(previousIsLiked);
      setLikesCount(previousCount);
      showError('Erreur lors du like');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative inline-flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleLike}
        disabled={isLoading}
        className={`relative flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
          isLiked 
            ? 'border-red-300 bg-red-50' 
            : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
        }`}
      >
        <motion.div
          animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Heart
            className={`w-5 h-5 transition-all ${
              isLiked 
                ? 'fill-red-500 text-red-500' 
                : 'fill-none text-gray-500'
            }`}
          />
        </motion.div>
        <span className={`text-sm font-medium ${isLiked ? 'text-red-500' : 'text-gray-600'}`}>
          {likesCount}
        </span>
      </motion.button>

      {/* ✅ Animation TikTok : cœurs qui explosent */}
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ 
              opacity: 1, 
              scale: 0.5,
              x: 0,
              y: 0,
            }}
            animate={{ 
              opacity: 0,
              scale: 1.5,
              x: heart.x,
              y: heart.y,
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 1.2,
              ease: 'easeOut',
            }}
            className="absolute pointer-events-none"
            style={{
              left: '50%',
              top: '50%',
            }}
          >
            <Heart className="w-8 h-8 fill-red-500 text-red-500" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}