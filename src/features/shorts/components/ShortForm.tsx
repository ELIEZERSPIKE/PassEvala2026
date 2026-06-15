import React, { useRef } from 'react';
import { useShortForm } from '../hooks/useShortForm';
import { Short, ShortPayload, ShortUpdatePayload } from '../types/short';
import { Upload, X } from 'lucide-react';

interface Props {
  initial?: Short;
  onSubmit: (data: ShortPayload | ShortUpdatePayload) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

const STATUS_OPTIONS = [
  { label: 'Brouillon', value: 'draft' },
  { label: 'Publié', value: 'published' },
  { label: 'Archivé', value: 'archived' },
];

const ShortForm: React.FC<Props> = ({ initial, onSubmit, onCancel, loading }) => {
  const isEdit = !!initial;
  const { form, errors, handleChange, validate, reset, toCreatePayload, toUpdatePayload } = useShortForm(initial);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(isEdit)) return;
    await onSubmit(isEdit ? toUpdatePayload() : toCreatePayload());
    if (!isEdit) reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Texte */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Texte <span className="text-gray-400 font-normal">(optionnel)</span>
        </label>
        <textarea
          value={form.text}
          onChange={e => handleChange('text', e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Décrivez votre short..."
        />
      </div>

      {/* Statut (edit uniquement) */}
      {isEdit && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
          <select
            value={form.status}
            onChange={e => handleChange('status', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Upload vidéo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Vidéo {isEdit && <span className="text-gray-400 font-normal">(laisser vide pour conserver l'actuelle)</span>}
        </label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
        >
          {form.video ? (
            <div className="flex items-center justify-between px-2">
              <span className="text-sm text-gray-700 truncate">{form.video.name}</span>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); handleChange('video', null); }}
                className="ml-2 text-gray-400 hover:text-red-500"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <Upload size={24} />
              <span className="text-sm">
                {isEdit ? 'Cliquez pour remplacer la vidéo' : 'Cliquez pour sélectionner une vidéo'}
              </span>
              <span className="text-xs">MP4, MOV, AVI, WMV, WebM — max 50 Mo</span>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/quicktime,video/x-msvideo,video/x-ms-wmv,video/webm"
          onChange={e => handleChange('video', e.target.files?.[0] ?? null)}
          className="hidden"
        />
        {errors.video && <p className="text-red-500 text-xs mt-1">{errors.video}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Publier le short'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}
            className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-50"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
};

export default ShortForm;