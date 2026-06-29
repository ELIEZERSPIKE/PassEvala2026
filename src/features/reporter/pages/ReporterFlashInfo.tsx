import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { FlashInfoForm } from '@/features/flash-info/components/flashInfoForm';
import { FlashInfoTable } from '@/features/flash-info/components/flashInfoTable';
import { useFlashList } from '@/features/flash-info/hooks/useflashList';
import { useFlashMutation } from '@/features/flash-info/hooks/useFlashInfoMutation';
import { FlashInfo } from '@/features/flash-info/api/flashApi';

export const ReporterFlashInfo = () => {
  const { data, loading, refresh }  = useFlashList();
  const { mutate, loading: mutating } = useFlashMutation();
  const [showForm, setShowForm]     = useState(false);
  const [editing, setEditing]       = useState<FlashInfo | null>(null);

  const openCreate = () => { setEditing(null); setShowForm(true); };
  const openEdit   = (f: FlashInfo) => { setEditing(f); setShowForm(true); };
  const close      = () => { setShowForm(false); setEditing(null); };
  const onSuccess  = () => { close(); refresh(); };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce flash info ?')) return;
    const result = await mutate('delete', { id });
    if (result.success) refresh();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900">Flash infos</h1>
        {!showForm && (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
          >
            <Plus className="w-4 h-4" /> Nouveau flash
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 relative">
          <button
            onClick={close}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
          <FlashInfoForm
            initialData={editing}
            onSuccess={onSuccess}
            onCancel={close}
          />
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-400 py-12">Chargement...</p>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <FlashInfoTable
            data={data}
            onEdit={openEdit}
            onDelete={handleDelete}
            isMutating={mutating}
          />
        </div>
      )}
    </div>
  );
};