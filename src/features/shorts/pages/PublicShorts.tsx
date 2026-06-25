// features/shorts/pages/PublicShorts.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { usePublicShorts } from '../hooks/usePublicShorts';

export const PublicShorts: React.FC = () => {
  const { shorts, loading, error } = usePublicShorts();
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // ─── IntersectionObserver — détecte la vidéo active ───────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container || shorts.length === 0) return;

    const slides = container.querySelectorAll<HTMLElement>('[data-short-index]');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.shortIndex);
            setCurrentIndex(idx);
          }
        });
      },
      { root: container, threshold: 0.6 }
    );

    slides.forEach(slide => observer.observe(slide));
    return () => observer.disconnect();
  }, [shorts]);

  // ─── Lecture / pause auto selon l'index actif ─────────────────────────────
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === currentIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [currentIndex]);

  // ─── États ────────────────────────────────────────────────────────────────

  if (loading && shorts.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Loader2 className="animate-spin text-white" size={40} />
      </div>
    );
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen bg-black text-red-400">{error}</div>;
  }

  if (shorts.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-gray-400">
        <div className="text-center">
          <p className="text-4xl mb-4">📱</p>
          <p>Aucun short publié pour le moment</p>
          <p className="text-sm">Soyez le premier à publier !</p>
        </div>
      </div>
    );
  }

  // ─── Affichage ────────────────────────────────────────────────────────────

  return (
    <div
      ref={containerRef}
      className="h-screen bg-black overflow-y-scroll"
      style={{ scrollSnapType: 'y mandatory', scrollbarWidth: 'none' }}
    >
      {shorts.map((short, index) => (
        <div
          key={short.id}
          data-short-index={index}
          className="relative h-screen flex items-center justify-center"
          style={{ scrollSnapAlign: 'start' }}
        >
          {/* Vidéo */}
          <video
            ref={el => { videoRefs.current[index] = el; }}
            src={short.processed_path ? `http://localhost:8000/storage/${short.processed_path}` : undefined}
            className="h-full w-full object-contain"
            loop
            muted
            playsInline
          />

          {/* Overlay informations */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-end justify-between text-white">
              {/* Informations gauche */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                    {short.user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="font-medium">@{short.user?.username || 'Utilisateur'}</span>
                  <span className="text-xs text-white/60">
                    • {formatDistanceToNow(new Date(short.created_at), { locale: fr, addSuffix: true })}
                  </span>
                </div>
                {short.text && <p className="text-sm text-white/90">{short.text}</p>}
              </div>

              {/* Actions style TikTok */}
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

          {/* Indicateur de position (barre verticale droite) */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1">
            {shorts.map((_, i) => (
              <div
                key={i}
                className="w-1 rounded-full transition-all duration-300"
                style={{
                  height: i === currentIndex ? '32px' : '16px',
                  background: i === currentIndex ? 'white' : 'rgba(255,255,255,0.3)',
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};