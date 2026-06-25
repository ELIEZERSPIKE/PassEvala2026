// features/shorts/components/ShortComments.tsx
import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import shortService from '../services/shortService';
import { ShortComment } from '../types/short';

interface Props {
  shortId: number;
  onClose: () => void;
  onCommentAdded: () => void;
}

const ShortComments: React.FC<Props> = ({ shortId, onClose, onCommentAdded }) => {
  const [comments, setComments] = useState<ShortComment[]>([]);
  const [body, setBody]         = useState('');
  const [loading, setLoading]   = useState(true);
  const [sending, setSending]   = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    shortService.getComments(shortId)
      .then(res => setComments(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));

    setTimeout(() => inputRef.current?.focus(), 100);
  }, [shortId]);

  const handleSubmit = async () => {
    if (!body.trim() || sending) return;
    setSending(true);
    try {
      const res = await shortService.addComment(shortId, body.trim());
      setComments(prev => [res.data, ...prev]);
      setBody('');
      onCommentAdded();
      onClose(); // ✅ ferme après envoi
    } catch {
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      await shortService.deleteComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch {}
  };

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 20,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex', flexDirection: 'column',
      borderRadius: 8,
    }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Commentaires</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <X size={20} color="#fff" />
        </button>
      </div>

      {/* Liste */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '12px 16px',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 24 }}>
            <Loader2 size={24} className="animate-spin" color="#D4822A" />
          </div>
        )}

        {!loading && comments.length === 0 && (
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textAlign: 'center', paddingTop: 24 }}>
            Aucun commentaire. Soyez le premier !
          </p>
        )}

        {comments.map(comment => (
          <div key={comment.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            {/* Avatar */}
            <div style={{
              width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
              background: '#8B2500',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 11, fontWeight: 900,
            }}>
              {comment.user?.name?.charAt(0).toUpperCase() ?? 'U'}
            </div>

            {/* Contenu */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <span style={{ color: '#D4822A', fontSize: 11, fontWeight: 700 }}>
                  {comment.user?.name ?? 'Inconnu'}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>
                  {new Date(comment.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                </span>
              </div>
              <p style={{ color: '#fff', fontSize: 13, lineHeight: 1.4, margin: 0 }}>
                {comment.body}
              </p>
            </div>

            {/* Supprimer */}
            <button
              onClick={() => handleDelete(comment.id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(255,255,255,0.2)', padding: 4,
                flexShrink: 0,
              }}
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{
        padding: '10px 16px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', gap: 8, alignItems: 'center',
      }}>
        <input
          ref={inputRef}
          value={body}
          onChange={e => setBody(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
          placeholder="Ajouter un commentaire..."
          maxLength={500}
          style={{
            flex: 1, background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(212,130,42,0.3)',
            borderRadius: 20, padding: '8px 14px',
            color: '#fff', fontSize: 13, outline: 'none',
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={!body.trim() || sending}
          style={{
            background: body.trim() ? '#8B2500' : 'rgba(255,255,255,0.1)',
            border: 'none', borderRadius: '50%',
            width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: body.trim() ? 'pointer' : 'default',
            transition: 'background 0.2s',
          }}
        >
          {sending
            ? <Loader2 size={16} color="#fff" className="animate-spin" />
            : <Send size={16} color="#fff" />
          }
        </button>
      </div>
    </div>
  );
};

export default ShortComments;