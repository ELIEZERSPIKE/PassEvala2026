import React from 'react';
import { useNumberForm } from '../hooks/useNumberForm';
import { UsefulNumber, UsefulNumberPayload } from '../types/usefulNumber';

const COLOR_OPTIONS = [
  { label: 'Rouge', value: 'red' },
  { label: 'Bleu', value: 'blue' },
  { label: 'Vert', value: 'green' },
  { label: 'Orange', value: 'orange' },
  { label: 'Violet', value: 'purple' },
];

interface Props {
  initial?: UsefulNumber;
  onSubmit: (data: UsefulNumberPayload) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

const UsefulNumberForm: React.FC<Props> = ({ initial, onSubmit, onCancel, loading }) => {
  const { form, errors, handleChange, validate, reset } = useNumberForm(initial);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
    if (!initial) reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
        <input
          type="text"
          value={form.name}
          onChange={e => handleChange('name', e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ex: Hôpital Sylvanus Olympio"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone</label>
        <input
          type="tel"
          value={form.phone_number}
          onChange={e => handleChange('phone_number', e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ex: +228 90 00 00 00"
        />
        {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Couleur (optionnel)</label>
        <select
          value={form.color_tag ?? ''}
          onChange={e => handleChange('color_tag', e.target.value || null)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Aucune --</option>
          {COLOR_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : initial ? 'Mettre à jour' : 'Créer'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-50"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
};

export default UsefulNumberForm;