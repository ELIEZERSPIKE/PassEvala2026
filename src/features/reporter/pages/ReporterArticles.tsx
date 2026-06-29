import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Loader2, ImagePlus } from 'lucide-react';
import { getImageUrl } from '@/utils/imageUtils';
import { articleService } from '@/services/articleService';


interface Article {
  id: number;
  title: string;
  summary?: string;
  image_path?: string;
  is_hero: boolean;
  created_at: string;
}

export const ReporterArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading]   = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError]       = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    articleService.getAll()
      .then(setArticles)
      .catch(() => setError('Impossible de charger les articles.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cet article ?')) return;
    setDeleting(id);
    try {
      await articleService.delete(id);
      setArticles(prev => prev.filter(a => a.id !== id));
    } catch {
      setError('Erreur lors de la suppression.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900">Articles</h1>
        <Link
          to="/reporter/articles/new"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
        >
          <Plus className="w-4 h-4" /> Nouvel article
        </Link>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-24 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <ImagePlus className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>Aucun article publié pour l'instant.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-left">
                <th className="px-4 py-3 font-bold text-gray-600">Image</th>
                <th className="px-4 py-3 font-bold text-gray-600">Titre</th>
                <th className="px-4 py-3 font-bold text-gray-600 hidden md:table-cell">Date</th>
                <th className="px-4 py-3 font-bold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map(article => (
                <tr key={article.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    {article.image_path ? (
                      <img
                        src={getImageUrl(article.image_path)}
                        alt={article.title}
                        className="w-12 h-8 object-cover rounded-lg border border-gray-100"
                      />
                    ) : (
                      <div className="w-12 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        <ImagePlus className="w-3 h-3 text-gray-300" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900 line-clamp-1">{article.title}</p>
                    {article.is_hero && (
                      <span className="text-xs text-yellow-600 font-medium">⭐ Hero</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell">
                    {new Date(article.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/reporter/articles/${article.id}/edit`}
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id)}
                        disabled={deleting === article.id}
                        className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        {deleting === article.id
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <Trash2 className="w-3.5 h-3.5" />
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};