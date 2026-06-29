import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { articleService } from '../../services/articleService';
import { getImageUrl } from '@/utils/imageUtils';
import { useAuth } from '@/store/authContext';
import { ArrowLeft, Save, Loader2, ImagePlus, Star, X } from 'lucide-react';

export const ArticleForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = !!id && id !== 'new';
  const previewRef = useRef<string | null>(null);

  const backPath = user?.role === 'reporter' ? '/reporter/articles' : '/admin/articles';

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    is_hero: false,
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isBlob, setIsBlob] = useState(false); // ✅ on sait si c'est une image locale ou serveur
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit) {
      setFetchLoading(true);
      articleService.getById(id!)
        .then(data => {
          setFormData({
            title: data.title,
            summary: data.summary || '',
            content: data.content || '',
            is_hero: !!data.is_hero,
          });
          if (data.image_path) {
            setPreview(data.image_path); // chemin serveur → passera dans getImageUrl
            setIsBlob(false);
          }
        })
        .catch(() => setError("Impossible de charger l'article."))
        .finally(() => setFetchLoading(false));
    } else {
      setFormData({ title: '', summary: '', content: '', is_hero: false });
      setPreview(null);
      setImage(null);
      setIsBlob(false);
    }

    return () => {
      if (previewRef.current?.startsWith('blob:')) {
        URL.revokeObjectURL(previewRef.current);
      }
    };
  }, [id, isEdit]);

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
    setIsBlob(false);
    if (previewRef.current?.startsWith('blob:')) {
      URL.revokeObjectURL(previewRef.current);
    }
    previewRef.current = null;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (previewRef.current?.startsWith('blob:')) {
        URL.revokeObjectURL(previewRef.current);
      }
      const url = URL.createObjectURL(file);
      previewRef.current = url;
      setImage(file);
      setPreview(url);
      setIsBlob(true); // ✅ image locale — ne pas passer dans getImageUrl
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('summary', formData.summary);
    data.append('content', formData.content);
    data.append('is_hero', formData.is_hero ? '1' : '0');
    if (image) data.append('image', image);
    else if (isEdit && !preview) {
      data.append('remove_image', '1');
    }

    try {
      if (isEdit) {
        await articleService.update(id!, data);
      } else {
        await articleService.create(data);
      }
      navigate(backPath);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Erreur lors de l'enregistrement.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logique d'affichage propre — blob direct, serveur via getImageUrl
  const displayPreview = preview
    ? isBlob
      ? preview
      : getImageUrl(preview)
    : null;

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center py-32 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Chargement de l'article...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          to={backPath}
          className="text-blue-600 hover:text-blue-700 flex items-center gap-1 mb-4 text-sm font-bold uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" /> Retour aux articles
        </Link>
        <h1 className="text-3xl font-black text-gray-900">
          {isEdit ? "Modifier l'article" : 'Nouvel article'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 space-y-5">

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Titre *</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="Titre de l'article"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Résumé <span className="text-gray-400 font-normal">(optionnel)</span>
            </label>
            <textarea
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              value={formData.summary}
              onChange={e => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Courte description de votre article (affichée sur la page d'accueil)"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Contenu *</label>
            <textarea
              rows={10}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-y"
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              placeholder="Contenu de l'article..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Image à la une</label>
            <div className="flex items-start gap-4">
              <label className="flex items-center gap-2 cursor-pointer bg-gray-50 hover:bg-gray-100 border border-dashed border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-600 transition">
                <ImagePlus className="w-4 h-4" />
                {image ? image.name : 'Choisir une image'}
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>

              {/* ✅ displayPreview gère blob et serveur séparément */}
              {displayPreview && (
                <div className="relative group/img">
                  <img
                    src={displayPreview}
                    alt="Aperçu"
                    className="w-32 h-20 object-cover rounded-xl border border-gray-200 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-red-600"
                    title="Supprimer l'image"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-10 h-6 rounded-full transition-colors ${formData.is_hero ? 'bg-blue-600' : 'bg-gray-200'} relative`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${formData.is_hero ? 'left-5' : 'left-1'}`} />
            </div>
            <input
              type="checkbox"
              className="hidden"
              checked={formData.is_hero}
              onChange={e => setFormData({ ...formData, is_hero: e.target.checked })}
            />
            <span className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
              <Star className="w-4 h-4 text-yellow-500" />
              Mettre en avant (Hero Section)
            </span>
          </label>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <Link
            to={backPath}
            className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-all"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
};