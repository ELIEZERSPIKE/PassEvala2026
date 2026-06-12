import React from 'react';
import { Article } from '@/types'; // Utilisation de l'alias @ pour pointer vers src/types
import { getImageUrl } from '@/utils/imageUtils';
import { ChevronRight } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onSelect: (article: Article) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(article)}
      className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Image Container */}
      <div className="block aspect-video overflow-hidden bg-gray-100">
        {article.image_path ? (
          <img
            src={getImageUrl(article.image_path)}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 italic">
            Pas d'image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-blue-600 mb-2">
          {/* On utilise ici le user de ton eager loading */}
          <span>{article.user?.name || 'Auteur anonyme'}</span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-500">
            {article.created_at ? new Date(article.created_at).toLocaleDateString('fr-FR') : 'Date inconnue'}
          </span>
        </div>

        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
          {article.title}
        </h3>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
          {article.summary || "Découvrez les derniers détails de cet événement sur Evala..."}
        </p>

        <span className="mt-auto inline-flex items-center text-sm font-bold text-gray-900 group-hover:text-blue-600">
          Lire l'article
          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </div>
  );
};