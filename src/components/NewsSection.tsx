// components/NewsSection.tsx - Version avec likes et commentaires
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { articleService } from '../services';
import { Article } from '../types';
import { Search, Heart, MessageCircle, Clock, ChevronRight } from 'lucide-react';
import { getImageUrl } from '../utils/imageUtils';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface NewsSectionProps {
  onArticleClick: (article: Article) => void;
}

export default function NewsSection({ onArticleClick }: NewsSectionProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [visibleArticles, setVisibleArticles] = useState(6);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await articleService.getArticles();
        console.log(' Articles chargés:', data);
        setArticles(data);
      } catch (err) {
        console.error('❌ Erreur chargement articles:', err);
        setError('Impossible de charger les actualités.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    const handleLikeUpdate = (e: Event) => {
      const { articleId, isLiked, likesCount } = (e as CustomEvent).detail;
      setArticles(prev => prev.map(a => 
        a.id === articleId ? { ...a, is_liked_by_user: isLiked, likes_count: likesCount } : a
      ));
    };
    window.addEventListener('article-like-updated', handleLikeUpdate);
    return () => window.removeEventListener('article-like-updated', handleLikeUpdate);
  }, []);

  // Filtrer les articles par recherche
  const filteredArticles = articles.filter((article) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return article.title.toLowerCase().includes(query) ||
      (article.summary && article.summary.toLowerCase().includes(query)) ||
      (article.content && article.content.toLowerCase().includes(query));
  });

  // Trier par date (plus récent d'abord)
  const sortedArticles = [...filteredArticles].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const displayedArticles = sortedArticles.slice(0, visibleArticles);
  const hasMore = visibleArticles < sortedArticles.length;

  // Article hero - le plus récent
  const heroArticle = sortedArticles.length > 0 ? sortedArticles[0] : null;

  const loadMore = () => {
    setVisibleArticles(prev => Math.min(prev + 6, sortedArticles.length));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="text-gray-500 font-medium animate-pulse">Chargement des actualités...</p>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[400px] bg-red-50 rounded-xl p-8"
      >
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-red-600 font-medium">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Réessayer
        </button>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6" id="component-news-section">
      {/* En-tête */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Actualités
            </h1>
            <p className="text-gray-500 text-sm mt-1">Restez informé des dernières nouvelles</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
            <span>{articles.length} articles</span>
          </div>
        </div>
      </div>

      {/* Barre de recherche */}
      <motion.div 
        className={`relative w-full mb-6 transition-all duration-300 ${
          isSearchFocused ? 'scale-105' : 'scale-100'
        }`}
      >
        <div className="relative">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
            isSearchFocused ? 'text-blue-600' : 'text-gray-400'
          }`} />
          <input
            type="text"
            placeholder="Rechercher une actualité..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm"
          />
          {searchQuery && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Résultats */}
      <AnimatePresence mode="wait">
        {filteredArticles.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">
              {searchQuery 
                ? `Aucun résultat pour "${searchQuery}"` 
                : 'Aucune actualité pour le moment.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-blue-600 hover:underline text-sm"
              >
                Effacer la recherche
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-6"
          >
            {/* Article Hero - avec likes et commentaires */}
            {heroArticle && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                onClick={() => onArticleClick(heroArticle)}
              >
                <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.7 }}
                    src={getImageUrl(heroArticle.image_path)}
                    alt={heroArticle.title}
                    className="w-full h-full object-cover"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                    <span className="animate-pulse">●</span>
                    À la une
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center gap-3 text-xs mb-2 text-white/80 flex-wrap">
                      <span>{new Date(heroArticle.created_at).toLocaleDateString('fr-FR', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}</span>
                      <span>•</span>
                      {/* ✅ Likes */}
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 fill-red-500 text-red-500" />
                        {heroArticle.likes_count || 0}
                      </span>
                      <span>•</span>
                      {/* ✅ Commentaires */}
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {heroArticle.comments_count || 0}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2 line-clamp-2">
                      {heroArticle.title}
                    </h2>
                    <p className="text-sm text-white/80 line-clamp-2 mb-3">
                      {heroArticle.summary}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-blue-600 font-bold text-sm px-6 py-2 rounded-full hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
                    >
                      Lire l'article
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Grille d'articles - avec likes et commentaires */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ 
                    y: -8,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onArticleClick(article)}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                  <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                    <motion.img
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.5 }}
                      src={getImageUrl(article.image_path)}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <div className="flex items-center gap-4 text-sm">
                          {/* ✅ Likes sur le hover */}
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4 fill-white text-white" />
                            {article.likes_count || 0}
                          </span>
                          {/* ✅ Commentaires sur le hover */}
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {article.comments_count || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(article.created_at), { 
                        addSuffix: true,
                        locale: fr 
                      })}
                    </div>
                    
                    <h3 className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                      {article.summary}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {/* ✅ Likes */}
                        <span className="flex items-center gap-1">
                          <Heart className={`w-4 h-4 ${article.is_liked_by_user ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                          {article.likes_count || 0}
                        </span>
                        {/* ✅ Commentaires */}
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4 text-gray-400" />
                          {article.comments_count || 0}
                        </span>
                      </div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="text-blue-600 text-xs font-medium flex items-center gap-1"
                      >
                        Lire
                        <ChevronRight className="w-3 h-3" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bouton "Voir plus" */}
            {hasMore && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center mt-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={loadMore}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-medium hover:shadow-lg transition-all"
                >
                  Voir plus d'articles
                </motion.button>
              </motion.div>
            )}

            {/* Compteur d'articles */}
            <div className="text-center text-xs text-gray-400 mt-4">
              Affichage de {displayedArticles.length} sur {filteredArticles.length} articles
              {searchQuery && ` pour "${searchQuery}"`}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}








// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { articleService } from '../services';
// import { Article } from '../types';
// import { Search } from 'lucide-react';
// import { getImageUrl } from '../utils/imageUtils';

// interface NewsSectionProps {
//   onArticleClick: (article: Article) => void;
// }

// export default function NewsSection({ onArticleClick }: NewsSectionProps) {
//   const [articles, setArticles] = useState<Article[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchArticles = async () => {
//       try {
//         const data = await articleService.getArticles();
//         setArticles(data);
//       } catch (err) {
//         console.error('Erreur chargement articles:', err);
//         setError('Impossible de charger les actualités.');
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchArticles();
//   }, []);

//   useEffect(() => {
//     const handleLikeUpdate = (e: Event) => {
//       const { articleId, isLiked, likesCount } = (e as CustomEvent).detail;
//       setArticles(prev => prev.map(a => a.id === articleId ? { ...a, is_liked_by_user: isLiked, likes_count: likesCount } : a));
//     };
//     window.addEventListener('article-like-updated', handleLikeUpdate);
//     return () => window.removeEventListener('article-like-updated', handleLikeUpdate);
//   }, []);


//   const filteredArticles = articles.filter((article) =>
//     article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     (article.summary && article.summary.toLowerCase().includes(searchQuery.toLowerCase()))
//   );

//   const heroArticle = filteredArticles.find(a => a.is_hero) || filteredArticles[0];
//   const listArticles = filteredArticles.filter(a => a.id !== heroArticle?.id);

//   if (isLoading) {
//     return (
//       <div className="p-12 text-center text-gray-500">
//         Chargement des actualités...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-12 text-center text-red-500 text-sm">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="w-full flex flex-col gap-6" id="component-news-section">
//       {/* Search Bar avec animations */}
//       <motion.div 
//         className="relative w-full"
//         whileHover={{ scale: 1.01 }}
//         animate={{ 
//           boxShadow: searchQuery ? '0 4px 20px rgba(0,0,0,0.08)' : 'none'
//         }}
//       >
//         <Search className={`absolute left-3 top-2.5 h-4 w-4 transition-colors ${
//           searchQuery ? 'text-blue-600' : 'text-gray-400'
//         }`} />
//         <input
//           type="text"
//           placeholder="Rechercher une actualité..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="w-full pl-9 pr-4 py-2 bg-white border border-[#E5E5E5] rounded-sm text-sm focus:outline-none focus:border-blue-600 transition-all"
//         />
//         {searchQuery && (
//           <motion.button
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             exit={{ scale: 0 }}
//             onClick={() => setSearchQuery('')}
//             className="absolute right-3 top-2.5 p-0.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             ✕
//           </motion.button>
//         )}
//       </motion.div>

//       <AnimatePresence mode="wait">
//         {filteredArticles.length === 0 ? (
//           <motion.div
//             key="empty"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className="bg-white border border-[#E5E5E5] p-12 text-center rounded-sm"
//           >
//             <p className="text-gray-500 text-sm">
//               {searchQuery ? 'Aucun résultat pour cette recherche.' : 'Aucune actualité pour le moment.'}
//             </p>
//           </motion.div>
//         ) : (
//           <motion.div
//             key="content"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="flex flex-col gap-6"
//           >
//             {heroArticle && (
//               <motion.div
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ type: 'spring', stiffness: 300 }}
//                 whileHover={{ 
//                   scale: 1.01,
//                   boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
//                 }}
//                 className="bg-white border border-[#E5E5E5] rounded-sm overflow-hidden shadow-sm flex flex-col group cursor-pointer"
//                 onClick={() => onArticleClick(heroArticle)}
//               >
//                 <div className="bg-[#222222] text-white py-2 px-4 flex justify-between items-center text-xs font-display font-black tracking-widest uppercase">
//                   <span>À la Une</span>
//                   <span className="text-[10px] text-gray-400">⭐</span>
//                 </div>
//                 <div className="relative h-64 md:h-80 w-full overflow-hidden">
//                   <motion.img
//                     whileHover={{ scale: 1.05 }}
//                     transition={{ duration: 0.7 }}
//                     src={getImageUrl(heroArticle.image_path)}
//                     alt={heroArticle.title}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div className="p-6 flex flex-col gap-3">
//                   <span className="text-xs font-mono text-gray-500">
//                     {new Date(heroArticle.created_at).toLocaleDateString('fr-FR')}
//                   </span>
//                   <h3 className="font-display font-black text-xl md:text-2xl text-[#222222] group-hover:text-blue-600 transition-colors">
//                     {heroArticle.title}
//                   </h3>
//                   <p className="font-sans text-sm text-gray-600">
//                     {heroArticle.summary}
//                   </p>
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => onArticleClick(heroArticle)}
//                     className="bg-blue-600 text-white font-display font-extrabold text-xs uppercase py-2 px-4 rounded-sm mt-2 self-start hover:bg-blue-700 transition-colors"
//                   >
//                     Lire l'Article
//                   </motion.button>
//                 </div>
//               </motion.div>
//             )}

//             {listArticles.length > 0 && (
//               <div className="flex flex-col gap-4">
//                 <h4 className="font-display font-black text-xs uppercase text-gray-500 mb-1 border-b border-gray-100 pb-2">
//                   Dernières Actualités
//                 </h4>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {listArticles.map((article, index) => (
//                     <motion.div
//                       key={article.id}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.05 }}
//                       whileHover={{ 
//                         scale: 1.03,
//                         boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
//                       }}
//                       whileTap={{ scale: 0.98 }}
//                       onClick={() => onArticleClick(article)}
//                       className="bg-white border border-[#E5E5E5] rounded-sm hover:border-gray-400 transition-all duration-200 cursor-pointer group flex flex-col overflow-hidden"
//                     >
//                       <div className="w-full h-48 bg-gray-100 overflow-hidden flex-shrink-0">
//                         <motion.img
//                           whileHover={{ scale: 1.05 }}
//                           transition={{ duration: 0.5 }}
//                           src={getImageUrl(article.image_path)}
//                           alt={article.title}
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                       <div className="p-4 flex flex-col flex-grow gap-2">
//                         <span className="font-mono text-[10px] text-gray-500">
//                           {new Date(article.created_at).toLocaleDateString('fr-FR')}
//                         </span>
//                         <h3 className="font-display font-extrabold text-sm text-[#222222] group-hover:text-blue-600 transition-colors line-clamp-2">
//                           {article.title}
//                         </h3>
//                         <p className="font-sans text-xs text-gray-500 line-clamp-3 flex-grow">
//                           {article.summary}
//                         </p>
//                         <motion.div
//                           initial={{ opacity: 0 }}
//                           whileHover={{ opacity: 1 }}
//                           className="text-blue-600 text-xs font-bold uppercase mt-2"
//                         >
//                           Lire plus →
//                         </motion.div>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }