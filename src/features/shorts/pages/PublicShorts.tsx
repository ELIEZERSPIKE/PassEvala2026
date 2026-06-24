// pages/PublicShorts.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useShorts } from '../hooks/useShorts';
import { Heart, MessageCircle, Share2, User, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export const PublicShorts: React.FC = () => {
  const { shorts, loading, error, loadShorts } = useShorts();
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    loadShorts();
  }, []);

  useEffect(() => {
    // Auto-play la vidéo courante
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [currentIndex]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // Simulation de scroll style TikTok
    // À implémenter avec Intersection Observer
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (shorts.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        <div className="text-center">
          <p className="text-4xl mb-4">📱</p>
          <p>Aucun short publié pour le moment</p>
          <p className="text-sm">Soyez le premier à publier !</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black overflow-y-scroll snap-y snap-mandatory">
      {shorts.map((short, index) => (
        <div 
          key={short.id}
          className="relative h-screen snap-start flex items-center justify-center"
        >
          {/* ✅ Vidéo */}
          <video
            ref={index === currentIndex ? videoRef : null}
            src={short.processed_path ? `http://localhost:8000/storage/${short.processed_path}` : undefined}
            className="h-full w-full object-contain"
            loop
            muted
            playsInline
          />

          {/* ✅ Overlay informations */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-end justify-between text-white">
              {/* Informations gauche */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                    {short.user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="font-medium">@{short.user?.username || 'Utilisateur'}</span>
                  <span className="text-xs text-white/60">• {formatDistanceToNow(new Date(short.created_at), { locale: fr, addSuffix: true })}</span>
                </div>
                <p className="text-sm text-white/90">{short.text}</p>
              </div>

              {/* ✅ Actions style TikTok */}
              <div className="flex flex-col items-center gap-4 ml-4">
                <button className="flex flex-col items-center gap-1 group">
                  <div className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                    <Heart size={24} className="group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-xs">12.5k</span>
                </button>

                <button className="flex flex-col items-center gap-1 group">
                  <div className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                    <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-xs">234</span>
                </button>

                <button className="flex flex-col items-center gap-1 group">
                  <div className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                    <Share2 size={24} className="group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-xs">Partager</span>
                </button>

                <button className="flex flex-col items-center gap-1 group">
                  <div className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                    <MoreHorizontal size={24} className="group-hover:scale-110 transition-transform" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* ✅ Indicateur de progression */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1">
            {shorts.map((_, i) => (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-300 ${
                  i === currentIndex 
                    ? 'h-8 bg-white' 
                    : 'h-4 bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};