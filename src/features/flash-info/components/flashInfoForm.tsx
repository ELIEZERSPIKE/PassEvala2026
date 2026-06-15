import React, { useState } from 'react';
import { useFlashMutation } from '../hooks/useflahInfo';
import { FlashInfo } from '../api/flashApi';

interface FlashInfoFormProps {
  initialData?: FlashInfo | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const FlashInfoForm: React.FC<FlashInfoFormProps> = ({ initialData = null, onSuccess, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [link, setLink] = useState(initialData?.link || '');
  const { mutate, loading, error, validationErrors } = useFlashMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const action = initialData ? 'update' : 'create';
    const payload = initialData
      ? { id: initialData.id, title, link: link.trim() || null }
      : { title, link: link.trim() || null };

    const result = await mutate(action, payload);
    if (result.success) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>
        {initialData ? 'Modifier le Flash Info' : 'Créer un Flash Info'}
      </h3>

      {error && (
        <div style={{ padding: '10px', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '6px', color: '#991b1b', fontSize: '14px' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label htmlFor="title" style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>
          Titre du Flash Info *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Entrez le titre du flash info..."
          required
          style={{
            padding: '10px 12px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            fontSize: '14px',
            outline: 'none',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            width: '100%'
          }}
        />
        {validationErrors.title && (
          <span style={{ color: '#dc2626', fontSize: '12px' }}>{validationErrors.title.join(', ')}</span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label htmlFor="link" style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>
          Lien (Optionnel)
        </label>
        <input
          id="link"
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://example.com"
          style={{
            padding: '10px 12px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            fontSize: '14px',
            outline: 'none',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            width: '100%'
          }}
        />
        {validationErrors.link && (
          <span style={{ color: '#dc2626', fontSize: '12px' }}>{validationErrors.link.join(', ')}</span>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          style={{
            padding: '10px 20px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#fff',
            color: '#475569',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'background-color 0.2s'
          }}
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading || !title.trim()}
          style={{
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: loading ? '#94a3b8' : '#2563eb',
            color: '#fff',
            fontWeight: '600',
            cursor: loading || !title.trim() ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            transition: 'background-color 0.2s'
          }}
        >
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
};

export default FlashInfoForm;
