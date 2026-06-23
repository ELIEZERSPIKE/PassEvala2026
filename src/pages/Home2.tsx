// import React, { useState } from 'react';
// import Header from '../components/Header';
// import SponsorBanner from '../components/SponsorBanner';
// import FlashInfoFeed from '../components/FlashInfoFeed';
// import NewsSection from '../components/NewsSection';
// import FilEvalaShorts from '../components/FilEvalaShorts';
// import BonsPlansKara from '../components/BonsPlansKara';
// import UsefulNumbersStack from '../components/UsefulNumbersStack';
// import Footer from '../components/Footer';
// import ArticleModal from '../components/Modal/ArticleModal';
// import CalendarModal from '../components/CalendarModal';
// import { useHighlight } from '../hooks/useHighlight';
// import { Article } from '../types';
// import { Calendar } from 'lucide-react';

// export default function HomePage() {
//   const [activeNavSection, setActiveNavSection] = useState('all');
//   const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
//   const [isCalendarOpen, setIsCalendarOpen] = useState(false);

//   // Custom hook to handle highlighting
//   const { highlightedId, setHighlightedId } = useHighlight();

//   // Handle Navigation clicks (anchoring / highlight trigger)
//   const handleNavigation = (section: string) => {
//     setActiveNavSection(section);

//     if (section === 'calendar') {
//       setIsCalendarOpen(true);
//       return;
//     }

//     let elementId = '';
//     switch (section) {
//       case 'news':
//         elementId = 'component-news-section-wrapper';
//         break;
//       case 'evala-feed':
//         elementId = 'component-fil-evala-wrapper';
//         break;
//       case 'kara-tips':
//         elementId = 'component-bons-plans-wrapper';
//         break;
//       case 'numbers':
//         elementId = 'component-useful-numbers-wrapper';
//         break;
//       default:
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//         return;
//     }

//     if (elementId) {
//       const element = document.getElementById(elementId);
//       if (element) {
//         element.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         setHighlightedId(elementId);
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F5F5F5] font-sans text-gray-900 flex flex-col relative" id="pass-evala-root">

//       {/* Header component */}
//       <Header onNavClick={handleNavigation} activeSection={activeNavSection} />

//       {/* Main Container Area */}
//       <main className="flex-grow max-w-[1440px] mx-auto w-full px-4 md:px-8 py-6 md:py-10">

//         {/* Top welcome info alert */}
//         <div className="mb-6 bg-white border-l-4 border-blue-600 border-y border-r border-gray-200 p-4 rounded-r-md text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
//           <div>
//             <span className="text-[10px] uppercase font-display font-black text-blue-600 tracking-wider block">Information officielle PASS AFRICA</span>
//             <p className="font-display font-extrabold text-sm text-[#222222]">
//               Bienvenue sur PASS EVALA 2026. Suivez en direct l'actualité des luttes traditionnelles de la Kara.
//             </p>
//           </div>
//           <button
//             onClick={() => handleNavigation('calendar')}
//             className="flex items-center gap-1.5 flex-shrink-0 bg-[#222222] hover:bg-blue-600 text-white font-display font-extrabold text-[11px] uppercase py-2 px-3.5 rounded-sm tracking-wider transition-colors shadow-xs cursor-pointer"
//             id="btn-headline-calendar"
//           >
//             <Calendar className="w-3.5 h-3.5" /> Programme complet
//           </button>
//         </div>

//         {/* 
//           Senior UX/UI Portal Layout: 
//           3 physical columns on desktop (1/4 - 2/4 - 1/4)
//           This guarantees perfect vertical alignment and puts Flash Info in a premium spot (top left).
//         */}
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative">

//           {/* LEFT SIDEBAR (Width 25% -> lg:col-span-1) */}
//           <div className="order-2 lg:order-none lg:col-span-1">
//             <div className="sticky top-24 flex flex-col gap-6">
//               <SponsorBanner />

//               <div
//                 className={`transition-all duration-500 rounded-sm ${highlightedId === 'component-flash-info-wrapper'
//                   ? 'ring-4 ring-blue-600 ring-offset-2 scale-[1.01] shadow-lg'
//                   : ''
//                   }`}
//               >
//                 <FlashInfoFeed onArticleClick={setSelectedArticle} />
//               </div>

//               <div
//                 className={`transition-all duration-500 rounded-sm ${highlightedId === 'component-useful-numbers-wrapper'
//                   ? 'ring-4 ring-blue-600 ring-offset-2 scale-[1.01] shadow-lg'
//                   : ''
//                   }`}
//               >
//                 <UsefulNumbersStack />
//               </div>
//             </div>
//           </div>

//           {/* <div className="order-2 lg:order-none lg:col-span-1 flex flex-col gap-6">
//             <div
//               className={`transition-all duration-500 rounded-sm ${highlightedId === 'component-flash-info-wrapper' ? 'ring-4 ring-blue-600 ring-offset-2 z-10 scale-[1.01] shadow-lg' : ''
//                 }`}
//               id="component-flash-info-wrapper"
//             >
//               <FlashInfoFeed onArticleClick={setSelectedArticle} />
//             </div>

//             <div
//               className={`transition-all duration-500 rounded-sm ${highlightedId === 'component-useful-numbers-wrapper' ? 'ring-4 ring-blue-600 ring-offset-2 z-10 scale-[1.01] shadow-lg' : ''
//                 }`}
//               id="component-useful-numbers-wrapper"
//             >
//               <UsefulNumbersStack />
//             </div>

//             <div
//               className="transition-all duration-500"
//               id="component-sponsor-banner-wrapper"
//             >
//               <SponsorBanner />
//             </div>
//           </div> */}


//           {/* CENTER MAIN (Width 50% -> lg:col-span-2) */}
//           <div
//             className={`order-1 lg:order-none lg:col-span-2 transition-all duration-500 rounded-sm h-full ${highlightedId === 'component-news-section-wrapper' ? 'ring-4 ring-blue-600 ring-offset-2 z-10 scale-[1.01] shadow-lg' : ''
//               }`}
//             id="component-news-section-wrapper"
//           >
//             <NewsSection onArticleClick={setSelectedArticle} />
//           </div>

//           {/* RIGHT SIDEBAR (Width 25% -> lg:col-span-1) */}
//           {/* <div className="order-3 lg:order-none lg:col-span-1">
//             <div className="sticky top-24 flex flex-col gap-6">

//               <div
//                 id="component-fil-evala-wrapper"
//                 className={`transition-all duration-500 rounded-sm ${highlightedId === 'component-fil-evala-wrapper'
//                     ? 'ring-4 ring-blue-600 ring-offset-2 scale-[1.01] shadow-lg'
//                     : ''
//                   }`}
//               >
//                 <FilEvalaShorts />
//               </div>

//               <div
//                 id="component-bons-plans-wrapper"
//                 className={`transition-all duration-500 rounded-sm ${highlightedId === 'component-bons-plans-wrapper'
//                     ? 'ring-4 ring-blue-600 ring-offset-2 scale-[1.01] shadow-lg'
//                     : ''
//                   }`}
//               >
//                 <BonsPlansKara />
//               </div>

//             </div>
//           </div> */}
//           <div className="order-3 lg:order-none lg:col-span-1 flex flex-col gap-6">

//             {/* GRID RIGHT BAR */}
//             <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

//               {/* VIDEOS */}
//               <div
//                 id="component-fil-evala-wrapper"
//                 className={`transition-all duration-500 rounded-sm ${highlightedId === 'component-fil-evala-wrapper'
//                     ? 'ring-4 ring-blue-600 ring-offset-2 scale-[1.01] shadow-lg'
//                     : ''
//                   }`}
//               >
//                 <FilEvalaShorts />
//               </div>

//               {/* BONS PLANS */}
//               <div
//                 id="component-bons-plans-wrapper"
//                 className={`transition-all duration-500 rounded-sm ${highlightedId === 'component-bons-plans-wrapper'
//                     ? 'ring-4 ring-blue-600 ring-offset-2 scale-[1.01] shadow-lg'
//                     : ''
//                   }`}
//               >
//                 <BonsPlansKara />
//               </div>

//             </div>

//           </div>


//         </div>

//         {/* Sponsor Banner spanning below the grid for a cleaner look */}


//       </main>

//       {/* Footer component */}
//       <Footer />

//       {/* DYNAMIC MODALS AND DETAILS VIEW overlays */}
//       {selectedArticle && (
//         <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
//       )}

//       {isCalendarOpen && (
//         <CalendarModal onClose={() => setIsCalendarOpen(false)} />
//       )}

//     </div>
//   );
// }