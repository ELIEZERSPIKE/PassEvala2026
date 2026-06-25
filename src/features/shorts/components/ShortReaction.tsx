// features/shorts/components/ShortReactions.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import shortService from '../services/shortService';
import { Short } from '../types/short';

const EMOJIS = ['🔥', '👏', '❤️', '😂', '🎯'] as const;
type Emoji = typeof EMOJIS[number];

interface Props {
  short: Short;
  isActive: boolean;
  onNext: () => void;
  onPrev: () => void;
  onTogglePlay: () => void;
  onOpenComments: () => void;
}

const ShortReactions: React.FC<Props> = ({
  short, isActive, onNext, onPrev, onTogglePlay, onOpenComments,
}) => {
  const [likes, setLikes]             = useState(short.likes_count ?? 0);
  const [liked, setLiked]             = useState(false);
  const [reactions, setReactions]     = useState<Record<string, number>>(short.reactions ?? {});
  const [likeAnimating, setLikeAnimating] = useState(false);
  const [activeEmoji, setActiveEmoji] = useState<Emoji | null>(null);
  const [pickerOpen, setPickerOpen]   = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // ✅ Charger le statut like au montage si le short est actif
  useEffect(() => {
    if (!isActive) return;
    shortService.likeStatus(short.id)
      .then(res => {
        setLiked(res.liked);
        setLikes(res.likes_count);
      })
      .catch(() => {});
  }, [isActive, short.id]);

  // Fermer picker si clic extérieur
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isActive) return;
    const handleKey = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      if (e.code === 'Space')     { e.preventDefault(); onTogglePlay(); }
      if (e.code === 'ArrowDown') { e.preventDefault(); onNext(); }
      if (e.code === 'ArrowUp')   { e.preventDefault(); onPrev(); }
      if (e.code === 'KeyL')      { e.preventDefault(); handleLike(); }
      if (e.code === 'KeyC')      { e.preventDefault(); onOpenComments(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isActive, liked, likes, onTogglePlay, onOpenComments]);

  const handleLike = async () => {
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikes(prev => wasLiked ? prev - 1 : prev + 1);
    setLikeAnimating(true);
    setTimeout(() => setLikeAnimating(false), 400);
    try {
      const res = await shortService.like(short.id);
      setLiked(res.liked);
      setLikes(res.likes_count);
    } catch {
      setLiked(wasLiked);
      setLikes(prev => wasLiked ? prev + 1 : prev - 1);
    }
  };

  const handleReact = async (emoji: Emoji) => {
    setActiveEmoji(emoji);
    setPickerOpen(false);
    setReactions(prev => ({ ...prev, [emoji]: (prev[emoji] ?? 0) + 1 }));
    setTimeout(() => setActiveEmoji(null), 600);
    try {
      await shortService.react(short.id, emoji);
    } catch {
      setReactions(prev => ({
        ...prev,
        [emoji]: Math.max(0, (prev[emoji] ?? 1) - 1),
      }));
    }
  };

  return (
    // ✅ Wrapper principal — tous les boutons dans la même colonne, bien alignés
    <div style={{
      position: 'absolute', right: 10, bottom: 60,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 14, zIndex: 10,
    }}>

      {/* ── Like ── */}
      <button
        onClick={handleLike}
        title="Like (L)"
        style={{
          background: liked ? 'rgba(255,77,109,0.25)' : 'rgba(0,0,0,0.45)',
          border: liked ? '1px solid rgba(255,77,109,0.5)' : 'none',
          borderRadius: '50%', width: 44, height: 44,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', cursor: 'pointer',
          transform: likeAnimating ? 'scale(1.35)' : 'scale(1)',
          transition: 'transform 0.25s ease, background 0.2s',
        }}
      >
        <Heart
          size={20}
          style={{
            color: liked ? '#ff4d6d' : '#fff',
            fill: liked ? '#ff4d6d' : 'none',
            transition: 'color 0.25s, fill 0.25s',
          }}
        />
        <span style={{ color: '#fff', fontSize: 10, marginTop: 2 }}>{likes}</span>
      </button>

      {/* ── Commentaires ── */}
      <button
        onClick={onOpenComments}
        title="Commentaires (C)"
        style={{
          background: 'rgba(0,0,0,0.45)', border: 'none',
          borderRadius: '50%', width: 44, height: 44,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', cursor: 'pointer',
        }}
      >
        <MessageCircle size={20} style={{ color: '#fff' }} />
        <span style={{ color: '#fff', fontSize: 10, marginTop: 2 }}>
          {short.comments_count ?? 0}
        </span>
      </button>

      {/* ── Picker emoji — aligné dans la colonne, picker s'ouvre vers la gauche ── */}
      <div ref={pickerRef} style={{ position: 'relative', width: 44, height: 44 }}>
        <button
          onClick={() => setPickerOpen(prev => !prev)}
          title="Réagir"
          style={{
            background: 'rgba(0,0,0,0.45)', border: 'none',
            borderRadius: '50%', width: 44, height: 44,
            fontSize: 20, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          😊
        </button>

        {/* ✅ Picker s'ouvre à gauche du bouton, centré verticalement sur lui */}
        {pickerOpen && (
          <div style={{
            position: 'absolute',
            right: 52,       // à gauche du bouton
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(26,10,0,0.92)', borderRadius: 12,
            padding: '8px 10px', display: 'flex', gap: 6,
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(212,130,42,0.3)',
            whiteSpace: 'nowrap',
            zIndex: 20,
          }}>
            {EMOJIS.map(emoji => {
              const count = reactions[emoji] ?? 0;
              const isJustReacted = activeEmoji === emoji;
              return (
                <button
                  key={emoji}
                  onClick={() => handleReact(emoji)}
                  style={{
                    background: isJustReacted ? 'rgba(139,37,0,0.6)' : 'rgba(255,255,255,0.08)',
                    border: 'none', borderRadius: 8, padding: '4px 7px',
                    cursor: 'pointer', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: 2,
                    transform: isJustReacted ? 'scale(1.25)' : 'scale(1)',
                    transition: 'transform 0.2s, background 0.2s',
                  }}
                >
                  <span style={{ fontSize: 18 }}>{emoji}</span>
                  <span style={{ color: '#fff', fontSize: 9 }}>{count > 0 ? count : ''}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Résumé réactions ── */}
      {Object.values(reactions).some(v => v > 0) && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          {EMOJIS.filter(e => (reactions[e] ?? 0) > 0).slice(0, 3).map(emoji => (
            <span key={emoji} style={{ fontSize: 11, color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
              {emoji}{reactions[emoji]}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShortReactions;