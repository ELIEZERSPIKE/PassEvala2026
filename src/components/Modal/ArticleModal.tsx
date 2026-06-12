import React from 'react';
import { X } from 'lucide-react';
import { Article } from '../../types'; // Utilise la même interface
import { getImageUrl } from '../../utils/imageUtils';

interface ArticleModalProps {
  article: Article;
  onClose: () => void;
}

export default function ArticleModal({ article, onClose }: ArticleModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{article.title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {article.image_path && (
            <img
              src={getImageUrl(article.image_path)}
              alt={article.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
          )}
          
          {/* On affiche le contenu complet en priorité, sinon le résumé */}
          <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
            {article.content || article.summary}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
            <span>Par {article.user?.name || 'Auteur anonyme'}</span>
            <span>Publié le {new Date(article.created_at).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}