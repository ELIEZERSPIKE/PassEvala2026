import React, { useState } from 'react';
import { useNumbers } from '../hooks/useNumbers';
import UsefulNumberCard from '../components/UsefulNumberCard';
import UsefulNumberForm from '../components/UsefulNumberForm';
import { UsefulNumber, UsefulNumberPayload } from '../types/usefulNumber';

const UsefulNumberList: React.FC = () => {
  const { numbers, loading, error, createNumber, updateNumber, deleteNumber } = useNumbers();
  const [editing, setEditing] = useState<UsefulNumber | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (data: UsefulNumberPayload) => {
    setSubmitting(true);
    try {
      await createNumber(data);
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (data: UsefulNumberPayload) => {
    if (!editing) return;
    setSubmitting(true);
    try {
      await updateNumber(editing.id, data);
      setEditing(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce numéro ?')) return;
    await deleteNumber(id);
  };

  if (loading) return <p className="text-center py-8 text-gray-500">Chargement...</p>;
  if (error) return <p className="text-center py-8 text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Numéros utiles</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
        >
          + Ajouter
        </button>
      </div>

      {showForm && (
        <div className="mb-6 border rounded-lg p-4 bg-white shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Nouveau numéro</h2>
          <UsefulNumberForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} loading={submitting} />
        </div>
      )}

      {editing && (
        <div className="mb-6 border rounded-lg p-4 bg-white shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Modifier le numéro</h2>
          <UsefulNumberForm initial={editing} onSubmit={handleUpdate} onCancel={() => setEditing(null)} loading={submitting} />
        </div>
      )}

      <div className="space-y-3">
        {numbers.map(n => (
          <UsefulNumberCard
            key={n.id}
            number={n}
            onEdit={setEditing}
            onDelete={handleDelete}
            canEdit
          />
        ))}
        {numbers.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">Aucun numéro enregistré.</p>
        )}
      </div>
    </div>
  );
};

export default UsefulNumberList;