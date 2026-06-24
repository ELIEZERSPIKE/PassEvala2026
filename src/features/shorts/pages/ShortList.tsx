import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Filter, Search, Grid, List, LayoutGrid } from 'lucide-react';
import { useShorts } from '../hooks/useShorts';
import ShortCard from '../components/ShortCard';
import ShortForm from '../components/ShortForm';
import { Short, ShortPayload, ShortUpdatePayload } from '../types/short';

type ViewMode = 'grid' | 'list';
type StatusFilter = 'all' | 'draft' | 'published' | 'archived';

const ShortList: React.FC = () => {
  const { 
    shorts, 
    loading, 
    error, 
    isRefreshing,
    createShort, 
    updateShort, 
    deleteShort, 
    refreshShorts 
  } = useShorts();
  
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Short | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Filtrer les shorts
  const filteredShorts = shorts.filter(s => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const textMatch = s.text?.toLowerCase().includes(query) || false;
      const userMatch = s.user?.username?.toLowerCase().includes(query) || false;
      return textMatch || userMatch;
    }
    return true;
  });

  // Compteurs par statut
  const counts = {
    all: shorts.length,
    draft: shorts.filter(s => s.status === 'draft').length,
    published: shorts.filter(s => s.status === 'published').length,
    archived: shorts.filter(s => s.status === 'archived').length,
  };

  const handleCreate = async (data: ShortPayload | ShortUpdatePayload) => {
    setSubmitting(true);
    try {
      if ('video' in data && data.video instanceof File) {
        await createShort(data as ShortPayload);
        setShowForm(false);
        setSuccess('✅ Short publié avec succès !');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Erreur création:', err);
      setSuccess('❌ Erreur lors de la publication');
      setTimeout(() => setSuccess(null), 3000);
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
      setSuccess('✅ Short mis à jour avec succès.');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Erreur mise à jour:', err);
      setSuccess('❌ Erreur lors de la mise à jour');
      setTimeout(() => setSuccess(null), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce short et ses fichiers associés ?')) return;
    try {
      await deleteShort(id);
      setSuccess('✅ Short supprimé avec succès.');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Erreur suppression:', err);
      setSuccess('❌ Erreur lors de la suppression');
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  if (loading && shorts.length === 0) {
    return (
      <div className="py-8 px-4">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Chargement des shorts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 px-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <p className="text-red-600 font-medium">❌ {error}</p>
          <button 
            onClick={refreshShorts}
            className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <RefreshCw size={16} />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4">
      {/* Message de succès */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2 flex items-center justify-between">
          <span>{success}</span>
          <button 
            onClick={() => setSuccess(null)}
            className="text-green-500 hover:text-green-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            📱 Shorts
            <span className="text-sm font-normal text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
              {counts.all}
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {counts.draft > 0 && `⏳ ${counts.draft} en traitement`}
            {counts.draft > 0 && counts.published > 0 && ' · '}
            {counts.published > 0 && `✅ ${counts.published} publiés`}
            {counts.published > 0 && counts.archived > 0 && ' · '}
            {counts.archived > 0 && `📦 ${counts.archived} archivés`}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={refreshShorts}
            disabled={isRefreshing}
            className="bg-gray-100 text-gray-600 px-3.5 py-2 rounded-lg text-sm hover:bg-gray-200 flex items-center gap-2 disabled:opacity-50 transition-colors"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? 'Chargement...' : 'Recharger'}
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={18} />
            Publier
          </button>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Recherche */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher par texte ou utilisateur..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filtres de statut */}
        <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg p-1 overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs rounded-md transition-all whitespace-nowrap ${
              statusFilter === 'all' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tous ({counts.all})
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-3 py-1.5 text-xs rounded-md transition-all whitespace-nowrap ${
              statusFilter === 'draft' 
                ? 'bg-white text-yellow-700 shadow-sm' 
                : 'text-yellow-600 hover:bg-gray-200'
            }`}
          >
            ⏳ {counts.draft}
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-3 py-1.5 text-xs rounded-md transition-all whitespace-nowrap ${
              statusFilter === 'published' 
                ? 'bg-white text-green-700 shadow-sm' 
                : 'text-green-600 hover:bg-gray-200'
            }`}
          >
            ✅ {counts.published}
          </button>
          <button
            onClick={() => setStatusFilter('archived')}
            className={`px-3 py-1.5 text-xs rounded-md transition-all whitespace-nowrap ${
              statusFilter === 'archived' 
                ? 'bg-white text-gray-700 shadow-sm' 
                : 'text-gray-500 hover:bg-gray-200'
            }`}
          >
            📦 {counts.archived}
          </button>
        </div>

        {/* Vue mode */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-all ${
              viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:bg-gray-200'
            }`}
            title="Vue grille"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-all ${
              viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:bg-gray-200'
            }`}
            title="Vue liste"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Formulaire de création */}
      {showForm && (
        <div className="mb-6 border rounded-xl p-5 bg-white shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold text-gray-700">📤 Nouveau short</h2>
            <span className="text-xs text-gray-400">La vidéo sera traitée automatiquement</span>
          </div>
          <ShortForm 
            onSubmit={handleCreate} 
            onCancel={() => setShowForm(false)} 
            loading={submitting} 
          />
        </div>
      )}

      {/* Formulaire d'édition */}
      {editing && (
        <div className="mb-6 border rounded-xl p-5 bg-white shadow-sm animate-in fade-in slide-in-from-top-2">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">✏️ Modifier le short</h2>
          <ShortForm
            initial={editing}
            onSubmit={(data) => handleUpdate(data as ShortUpdatePayload)}
            onCancel={() => setEditing(null)}
            loading={submitting}
          />
        </div>
      )}

      {/* ✅ Liste des shorts avec largeur contrôlée */}
      {filteredShorts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-gray-400 text-sm font-medium">
            {searchQuery 
              ? 'Aucun résultat pour cette recherche' 
              : statusFilter !== 'all' 
                ? `Aucun short avec le statut "${statusFilter}"`
                : 'Aucun short publié.'}
          </p>
          <p className="text-gray-300 text-xs mt-1">
            {!searchQuery && statusFilter === 'all' && 'Publiez votre premier short !'}
            {searchQuery && 'Essayez de modifier votre recherche'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-blue-600 text-sm hover:underline"
            >
              Effacer la recherche
            </button>
          )}
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' 
            : 'space-y-3 max-w-4xl mx-auto'
        }>
          {filteredShorts.map(s => (
            <ShortCard
              key={s.id}
              short={s}
              onEdit={setEditing}
              onDelete={handleDelete}
              canEdit
              viewMode={viewMode}
            />
          ))}
        </div>
      )}

      {/* Indicateur de rafraîchissement */}
      {isRefreshing && (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-full px-4 py-2 text-xs text-gray-500 flex items-center gap-2 animate-in fade-in">
          <span className="animate-spin">⟳</span>
          Mise à jour...
        </div>
      )}
    </div>
  );
};

export default ShortList;



// import React, { useState } from 'react';
// import { Plus, RefreshCw } from 'lucide-react';
// import { useShorts } from '../hooks/useShorts';
// import ShortCard from '../components/ShortCard';
// import ShortForm from '../components/ShortForm';
// import { Short, ShortPayload, ShortUpdatePayload } from '../types/short';

// const ShortList: React.FC = () => {
//   const { 
//     shorts, 
//     loading, 
//     error, 
//     isRefreshing,
//     createShort, 
//     updateShort, 
//     deleteShort, 
//     refreshShorts 
//   } = useShorts();
  
//   const [showForm, setShowForm] = useState(false);
//   const [editing, setEditing] = useState<Short | null>(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');

//   // Filtrer les shorts selon le statut
//   const filteredShorts = shorts.filter(s => {
//     if (statusFilter === 'all') return true;
//     return s.status === statusFilter;
//   });

//   const handleCreate = async (data: ShortPayload | ShortUpdatePayload) => {
//     setSubmitting(true);
//     try {
//       if ('video' in data && data.video instanceof File) {
//         await createShort(data as ShortPayload);
//         setShowForm(false);
//         setSuccess('✅ Short publié avec succès !');
//         setTimeout(() => setSuccess(null), 3000);
//       } else {
//         throw new Error('Données invalides pour la création');
//       }
//     } catch (err) {
//       console.error('Erreur création:', err);
//       setSuccess('❌ Erreur lors de la publication');
//       setTimeout(() => setSuccess(null), 3000);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleUpdate = async (data: ShortUpdatePayload) => {
//     if (!editing) return;
//     setSubmitting(true);
//     try {
//       await updateShort(editing.id, data);
//       setEditing(null);
//       setSuccess('✅ Short mis à jour avec succès.');
//       setTimeout(() => setSuccess(null), 3000);
//     } catch (err) {
//       console.error('Erreur mise à jour:', err);
//       setSuccess('❌ Erreur lors de la mise à jour');
//       setTimeout(() => setSuccess(null), 3000);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm('Supprimer ce short et ses fichiers associés ?')) return;
//     try {
//       await deleteShort(id);
//       setSuccess('✅ Short supprimé avec succès.');
//       setTimeout(() => setSuccess(null), 3000);
//     } catch (err) {
//       console.error('Erreur suppression:', err);
//       setSuccess('❌ Erreur lors de la suppression');
//       setTimeout(() => setSuccess(null), 3000);
//     }
//   };

//   // Compteurs par statut
//   const counts = {
//     all: shorts.length,
//     draft: shorts.filter(s => s.status === 'draft').length,
//     published: shorts.filter(s => s.status === 'published').length,
//     archived: shorts.filter(s => s.status === 'archived').length,
//   };

//   if (loading && shorts.length === 0) {
//     return (
//       <div className="max-w-2xl mx-auto py-6 px-4">
//         <p className="text-center py-8 text-gray-500"> Chargement...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="max-w-2xl mx-auto py-6 px-4">
//         <p className="text-center py-8 text-red-500">❌ {error}</p>
//         <button 
//           onClick={refreshShorts}
//           className="mx-auto block bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
//         >
//           Réessayer
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto py-6 px-4">
//       {/* Message de succès */}
//       {success && (
//         <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium">
//           {success}
//         </div>
//       )}

//       {/* En-tête */}
//       <div className="flex items-center justify-between mb-4">
//         <div>
//           <h1 className="text-xl font-bold text-gray-800"> Shorts</h1>
//           <p className="text-xs text-gray-400 mt-0.5">
//             {counts.all} short{counts.all > 1 ? 's' : ''}
//             {counts.draft > 0 && `  ${counts.draft} en traitement`}
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <button
//             onClick={refreshShorts}
//             disabled={isRefreshing}
//             className="bg-gray-100 text-gray-600 px-3 py-2 rounded-md text-sm hover:bg-gray-200 flex items-center gap-1 disabled:opacity-50 transition-colors"
//             title="Recharger"
//           >
//             <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
//             {isRefreshing ? 'Chargement...' : 'Recharger'}
//           </button>
//           <button
//             onClick={() => setShowForm(true)}
//             className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 flex items-center gap-2 transition-colors"
//           >
//             <Plus size={16} />
//             Publier un short
//           </button>
//         </div>
//       </div>

//       {/* Filtres */}
//       <div className="flex items-center gap-2 mb-4 flex-wrap">
//         <button
//           onClick={() => setStatusFilter('all')}
//           className={`px-3 py-1 text-xs rounded-md transition-colors ${
//             statusFilter === 'all' 
//               ? 'bg-blue-600 text-white' 
//               : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//           }`}
//         >
//           Tous ({counts.all})
//         </button>
//         <button
//           onClick={() => setStatusFilter('draft')}
//           className={`px-3 py-1 text-xs rounded-md transition-colors ${
//             statusFilter === 'draft' 
//               ? 'bg-yellow-600 text-white' 
//               : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
//           }`}
//         >
//            En traitement ({counts.draft})
//         </button>
//         <button
//           onClick={() => setStatusFilter('published')}
//           className={`px-3 py-1 text-xs rounded-md transition-colors ${
//             statusFilter === 'published' 
//               ? 'bg-green-600 text-white' 
//               : 'bg-green-50 text-green-600 hover:bg-green-100'
//           }`}
//         >
//           ✅ Publiés ({counts.published})
//         </button>
//         <button
//           onClick={() => setStatusFilter('archived')}
//           className={`px-3 py-1 text-xs rounded-md transition-colors ${
//             statusFilter === 'archived' 
//               ? 'bg-gray-600 text-white' 
//               : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
//           }`}
//         >
//           📦 Archivés ({counts.archived})
//         </button>
//       </div>

//       {/* Formulaire de création */}
//       {showForm && (
//         <div className="mb-6 border rounded-lg p-4 bg-white shadow-sm animate-in fade-in slide-in-from-top-2">
//           <div className="flex justify-between items-center mb-3">
//             <h2 className="text-sm font-semibold text-gray-700">📤 Nouveau short</h2>
//             <span className="text-xs text-gray-400">La vidéo sera traitée automatiquement</span>
//           </div>
//           <ShortForm 
//             onSubmit={handleCreate} 
//             onCancel={() => setShowForm(false)} 
//             loading={submitting} 
//           />
//         </div>
//       )}

//       {/* Formulaire d'édition */}
//       {editing && (
//         <div className="mb-6 border rounded-lg p-4 bg-white shadow-sm animate-in fade-in slide-in-from-top-2">
//           <h2 className="text-sm font-semibold text-gray-700 mb-3">✏️ Modifier le short</h2>
//           <ShortForm
//             initial={editing}
//             onSubmit={(data) => handleUpdate(data as ShortUpdatePayload)}
//             onCancel={() => setEditing(null)}
//             loading={submitting}
//           />
//         </div>
//       )}

//       {/* Liste des shorts */}
//       <div className="space-y-3">
//         {filteredShorts.length === 0 ? (
//           <div className="text-center py-12">
//             <p className="text-gray-400 text-sm">
//               {statusFilter === 'all' 
//                 ? 'Aucun short publié.' 
//                 : `Aucun short avec le statut "${statusFilter}"`}
//             </p>
//             <p className="text-gray-300 text-xs mt-1">
//               {statusFilter === 'all' && 'Publiez votre premier short !'}
//             </p>
//           </div>
//         ) : (
//           filteredShorts.map(s => (
//             <ShortCard
//               key={s.id}
//               short={s}
//               onEdit={setEditing}
//               onDelete={handleDelete}
//               canEdit
//             />
//           ))
//         )}
//       </div>

//       {/* Indicateur de mise à jour */}
//       {isRefreshing && (
//         <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-full px-4 py-2 text-xs text-gray-500 flex items-center gap-2">
//           <span className="animate-spin">⟳</span>
//           Mise à jour...
//         </div>
//       )}
//     </div>
//   );
// };

// export default ShortList;