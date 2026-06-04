import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { articleService } from '../services';
import { Search, Heart, MessageSquare, Clock, Bookmark } from 'lucide-react';

interface NewsSectionProps {
  onArticleClick: (article: Article) => void;
}

export default function NewsSection({ onArticleClick }: NewsSectionProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await articleService.getArticles();
        setArticles(data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const filteredArticles = articles.filter((article) => {
    return article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           (article.summary && article.summary.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const heroArticle = filteredArticles.find(a => a.is_hero) || filteredArticles[0];
  const listArticles = filteredArticles.filter(a => a.id !== heroArticle?.id);

  if (isLoading) {
    return <div className="p-12 text-center text-gray-500">Chargement des actualités...</div>;
  }

  return (
    <div className="w-full flex flex-col gap-6" id="component-news-section">
      {/* Search Bar */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher une actualité..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white border border-[#E5E5E5] rounded-sm text-sm focus:outline-none focus:border-[#222222]"
        />
      </div>

      {filteredArticles.length === 0 ? (
        <div className="bg-white border border-[#E5E5E5] p-12 text-center rounded-sm">
          <p className="text-gray-500 text-sm">Aucune actualité trouvée.</p>
        </div>
      ) : (
        <>
          {/* Hero Article */}
          {heroArticle && (
            <div className="bg-white border border-[#E5E5E5] rounded-sm overflow-hidden shadow-sm flex flex-col group cursor-pointer" onClick={() => onArticleClick(heroArticle)}>
              <div className="bg-[#222222] text-white py-2 px-4 flex justify-between items-center text-xs font-display font-black tracking-widest uppercase">
                <span>À la Une</span>
              </div>
              <div className="relative h-64 md:h-80 w-full overflow-hidden">
                <img src={heroArticle.image_path || 'https://via.placeholder.com/800'} alt={heroArticle.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-6 flex flex-col gap-3">
                <span className="text-xs font-mono text-gray-500">{new Date(heroArticle.created_at).toLocaleDateString()}</span>
                <h3 className="font-display font-black text-xl md:text-2xl text-[#222222] group-hover:text-blue-600 transition-colors">
                  {heroArticle.title}
                </h3>
                <p className="font-sans text-sm text-gray-600">
                  {heroArticle.summary}
                </p>
                <button className="bg-blue-600 text-white font-display font-extrabold text-xs uppercase py-2 px-4 rounded-sm mt-2 self-start hover:bg-blue-700">Lire l'Article</button>
              </div>
            </div>
          )}

          {/* List Articles */}
          {listArticles.length > 0 && (
            <div className="flex flex-col gap-4 text-left">
              <h4 className="font-display font-black text-xs uppercase text-gray-500 mb-1 border-b border-gray-100 pb-2">Dernières Actualités</h4>
              <div className="flex flex-col gap-4">
                {listArticles.map((article) => (
                  <div key={article.id} onClick={() => onArticleClick(article)} className="bg-white border border-[#E5E5E5] rounded-sm p-4 hover:border-gray-400 transition-all duration-200 flex flex-col sm:flex-row gap-4 cursor-pointer group">
                    <div className="w-full sm:w-32 h-24 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0 relative">
                      <img src={article.image_path || 'https://via.placeholder.com/150'} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="flex flex-col justify-between flex-grow gap-2">
                      <div>
                        <span className="font-mono text-[10px] text-gray-500">{new Date(article.created_at).toLocaleDateString()}</span>
                        <h3 className="font-display font-extrabold text-sm text-[#222222] group-hover:text-blue-600 transition-colors">{article.title}</h3>
                        <p className="font-sans text-xs text-gray-500 line-clamp-2 mt-1">{article.summary}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
