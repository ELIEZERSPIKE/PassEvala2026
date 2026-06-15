import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useShorts } from '../hooks/useShorts';
import ShortCard from '../components/ShortCard';
import ShortForm from '../components/ShortForm';
import { Short, ShortPayload, ShortUpdatePayload } from '../types/short';

const ShortList: React.FC = () => {
  const { shorts, loading, error, createShort, updateShort, deleteShort } = useShorts();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Short | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCreate = async (data: ShortPayload) => {
    setSubmitting(true);
    try {
      await createShort(data);
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (data: ShortUpdatePayload) => {
    if (!editing) return;
    setSubmitting(true);
    try {
      await updateShort(editing.id, data);
      setEditing(null);
      setSuccess('Le short a été mis à jour avec succès.');
      setTimeout(() => setSuccess(null), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce short et ses fichiers associés ?')) return;
    await deleteShort(id);
  };

  if (loading) return <p className="text-center py-8 text-gray-500">Chargement...</p>;
  if (error) return <p className="text-center py-8 text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-top-2">
          {success}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Shorts</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={16} />
          Publier un short
        </button>
      </div>

      {showForm && (
        <div className="mb-6 border rounded-lg p-4 bg-white shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Nouveau short</h2>
          <ShortForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} loading={submitting} />
        </div>
      )}

      {editing && (
        <div className="mb-6 border rounded-lg p-4 bg-white shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Modifier le short</h2>
          <ShortForm
            initial={editing}
            onSubmit={data => handleUpdate(data as ShortUpdatePayload)}
            onCancel={() => setEditing(null)}
            loading={submitting}
          />
        </div>
      )}

      <div className="space-y-3">
        {shorts.map(s => (
          <ShortCard
            key={s.id}
            short={s}
            onEdit={setEditing}
            onDelete={handleDelete}
            canEdit
          />
        ))}
        {shorts.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">Aucun short publié.</p>
        )}
      </div>
    </div>
  );
};

export default ShortList;