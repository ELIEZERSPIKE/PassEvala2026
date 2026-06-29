// pages/profile/ProfileLikes.tsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Loader, ExternalLink, FileText } from 'lucide-react';
import { profileService, LikedArticle } from '../../services/profilService';
import getImageUrl from '../../utils/imageUtils';
import ArticleSkeleton from '../../components/Animations/ArticleSkeleton'; // ← Ton composant

const STYLE = {
  page: { 
    minHeight: '100vh', 
    background: 'linear-gradient(160deg, #0A1628 0%, #1A2A4A 100%)' 
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(59,130,246,0.15)',
    borderRadius: '1rem',
    backdropFilter: 'blur(12px)',
  },
};

export default function ProfileLikes() {
  const [likes, setLikes] = useState<LikedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingIds, setRemovingIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await profileService.getMyLikedArticles();
        setLikes(data);
      } catch (err: any) {
        console.error('Erreur lors du chargement des likes:', err);
        setError('Impossible de charger vos articles likés.');
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, []);

  const handleUnlike = async (articleId: number) => {
    if (removingIds.includes(articleId)) return;

    try {
      setRemovingIds(prev => [...prev, articleId]);
      
      await profileService.unlikeArticle(articleId);

      // Animation de suppression
      setTimeout(() => {
        setLikes(prev => prev.filter(item => item.id !== articleId));
        setRemovingIds(prev => prev.filter(id => id !== articleId));
      }, 300);

    } catch (err) {
      console.error('Erreur unlike:', err);
      setRemovingIds(prev => prev.filter(id => id !== articleId));
      alert("Impossible de retirer le like");
    }
  };

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
            <Heart className="w-7 h-7" style={{ color: '#F87171' }} />
            Mes likes
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#93A8C9' }}>
            {likes.length} article{likes.length !== 1 ? 's' : ''} aimé{likes.length !== 1 ? 's' : ''}
          </p>
        </motion.div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <ArticleSkeleton key={i} />)}
          </div>
        ) : error ? (
          <motion.div style={STYLE.card} className="p-12 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-blue-600 rounded-lg">
              Réessayer
            </button>
          </motion.div>
        ) : likes.length === 0 ? (
          <motion.div style={STYLE.card} className="p-12 text-center">
            <Heart className="w-16 h-16 mx-auto mb-4" style={{ color: '#60A5FA', opacity: 0.3 }} />
            <p className="text-lg font-semibold" style={{ color: '#93A8C9' }}>
              Vous n'avez encore aimé aucun article
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="space-y-3">
              {likes.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  style={STYLE.card}
                  className="p-4 flex items-start gap-4 group"
                >
                  {/* Image */}
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 mt-0.5">
                    <img 
                      src={getImageUrl(item.image)} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/600x600?text=Pas+d\'image';
                      }}
                    />
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate" style={{ color: '#F0F7FF' }}>
                      {item.title}
                    </p>

                    <div className="flex items-center gap-4 text-xs mt-1.5" style={{ color: '#93A8C9' }}>
                      <span>{new Date(item.created_at).toLocaleDateString('fr-FR')}</span>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" style={{ color: '#F87171' }} />
                        <span>{item.likes_count}</span>
                      </div>
                      <div className="flex items-center gap-1">💬 <span>{item.comments_count}</span></div>
                    </div>

                    {item.summary && (
                      <p className="text-xs mt-2 line-clamp-2" style={{ color: '#93A8C9' }}>
                        {item.summary}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <a
                      href={`/articles/${item.slug}`}
                      className="p-2 rounded-lg opacity-70 hover:opacity-100 transition-all"
                      style={{ background: 'rgba(59,130,246,0.1)' }}
                    >
                      <ExternalLink className="w-4 h-4" style={{ color: '#60A5FA' }} />
                    </a>

                    <button
                      onClick={() => handleUnlike(item.id)}
                      disabled={removingIds.includes(item.id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 transition-all group-hover:opacity-100 opacity-70"
                    >
                      <Heart 
                        className="w-4 h-4 transition-all" 
                        style={{ color: '#F87171', fill: '#F87171' }} 
                      />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}