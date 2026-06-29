// import React from 'react';
// import { Calendar } from 'lucide-react';

// interface OfficialBannerProps {
//   onCalendarClick: () => void;
// }

// export default function OfficialBanner({ onCalendarClick }: OfficialBannerProps) {
//   return (
//     <div className="mb-6 bg-white border-l-4 border-blue-600 border-y border-r border-gray-200 p-4 rounded-r-md text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
//       <div>
//         <span className="text-[10px] uppercase font-display font-black text-blue-600 tracking-wider block">
//           Information officielle PASS AFRICA
//         </span>
//         <p className="font-display font-extrabold text-sm text-[#222222]">
//           Bienvenue sur PASS EVALA 2026. Suivez en direct l'actualité des luttes traditionnelles de la Kara.
//         </p>
//       </div>
//       <button
//         onClick={onCalendarClick}
//         className="flex items-center gap-1.5 flex-shrink-0 bg-[#222222] hover:bg-blue-600 text-white font-display font-extrabold text-[11px] uppercase py-2 px-3.5 rounded-sm tracking-wider transition-colors shadow-xs"
//       >
//         <Calendar className="w-3.5 h-3.5" />
//         Programme complet
//       </button>
//     </div>
//   );
// }