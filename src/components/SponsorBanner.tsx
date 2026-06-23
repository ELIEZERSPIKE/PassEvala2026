import React, { useState, useEffect } from 'react';
import { Sponsor } from '../types';
import { sponsorService } from '../services';

import { getImageUrl } from '../utils/imageUtils'; // Import de la fonction utilitaire

export default function SponsorBanner() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const data = await sponsorService.getSidebarSponsors();
        setSponsors(data);
      } catch (error) {
        console.error('Error fetching sponsors:', error);
      }
    };
    fetchSponsors();
  }, []);

  if (sponsors.length === 0) return null;

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-sm p-4 w-full flex flex-col gap-3 shadow-sm" id="component-sponsor-banner">
      <h4 className="font-display font-black text-[10px] uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2 text-center">Partenaires Officiels</h4>
      <div className="flex flex-col sm:flex-row lg:flex-col gap-4 items-center justify-center">
        {sponsors.map((sponsor) => (
          <a key={sponsor.id} href={sponsor.website_url || '#'} target="_blank" rel="noopener noreferrer" className="block w-full max-w-[160px] opacity-80 hover:opacity-100 transition-opacity" title={sponsor.name}>
            <img src={getImageUrl(sponsor.banner_url, 'https://placehold.co/300x150')} alt={sponsor.name} className="w-full h-auto object-contain max-h-16 mix-blend-multiply" />
          </a>
        ))}
      </div>
      <div className="text-center pt-2 mt-2 border-t border-gray-100">
        <a href="#" className="text-[9px] font-mono text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-wider">Devenir Partenaire</a>
      </div>
    </div>
  );
}
