import React from 'react';
import { Link } from 'react-router-dom';

interface Article {
  id: number;
  title: string;
  slug: string;
  summary: string | null;
  image_path: string | null;
  author: string;
  created_at: string;
  is_hero: boolean;
}

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Image Container */}
      <Link to={`/article/${article.slug}`} className="block aspect-video overflow-hidden bg-gray-100">
        {article.image_path ? (
          <img
            src={article.image_path}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 italic">
            Pas d'image
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-blue-600 mb-2">
          <span>{article.author}</span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-500">{article.created_at}</span>
        </div>

        <Link to={`/article/${article.slug}`}>
          <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
            {article.title}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
          {article.summary || "Découvrez les derniers détails de cet événement sur Evala..."}
        </p>

        <Link
          to={`/article/${article.slug}`}
          className="inline-flex items-center text-sm font-bold text-gray-900 group-hover:text-blue-600"
        >
          Lire l'article
          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};
