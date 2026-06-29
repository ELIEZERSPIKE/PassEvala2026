import React, { useState, useEffect } from 'react';
import { Sponsor } from '../types';
import { sponsorService } from '../services';
import { getImageUrl } from '../utils/imageUtils';

// Icône SVG pour le lien "Devenir Partenaire"
const PartnerIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

export default function SponsorBanner() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        setIsLoading(true);
        const data = await sponsorService.getSidebarSponsors();
        setSponsors(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching sponsors:', error);
        setError('Impossible de charger les partenaires');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSponsors();
  }, []);

  // États de chargement et d'erreur
  if (isLoading) {
    return (
      <div className="bg-white border border-[#E5E5E5] rounded-lg p-4 w-full shadow-sm animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-4"></div>
        <div className="flex flex-col gap-3 items-center">
          {[1, 2].map((i) => (
            <div key={i} className="w-32 h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-[#E5E5E5] rounded-lg p-4 w-full shadow-sm">
        <p className="text-xs text-gray-500 text-center">{error}</p>
      </div>
    );
  }

  if (sponsors.length === 0) return null;

  return (
    <div 
      className="bg-white border border-[#E5E5E5] rounded-lg p-4 w-full shadow-sm hover:shadow-md transition-shadow duration-300"
      id="component-sponsor-banner"
      role="complementary"
      aria-label="Partenaires officiels"
    >
      {/* En-tête */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-display font-bold text-xs uppercase tracking-widest text-gray-500">
          Partenaires Officiels
        </h4>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-medium bg-blue-50 text-blue-600 border border-blue-100">
          {sponsors.length}
        </span>
      </div>

      {/* Liste des sponsors - design amélioré */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
        {sponsors.map((sponsor) => (
          <a
            key={sponsor.id}
            href={sponsor.website_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center p-3 bg-gray-50 rounded-lg border border-transparent hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200"
            title={`Visiter le site de ${sponsor.name}`}
          >
            <img
              src={getImageUrl(sponsor.banner_url, 'https://placehold.co/300x150/F3F4F6/9CA3AF?text=Logo')}
              alt={`Logo de ${sponsor.name}`}
              className="w-full h-auto max-h-12 object-contain transition-all duration-200 group-hover:scale-105"
              loading="lazy"
            />
            {/* Tooltip au survol */}
            <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/5 rounded-lg backdrop-blur-[1px]">
              <span className="text-[10px] font-medium text-gray-700 bg-white/90 px-2 py-1 rounded shadow-sm">
                Découvrir
              </span>
            </span>
          </a>
        ))}
      </div>

      {/* Pied de page - CTA amélioré */}
      {/* <div className="mt-4 pt-4 border-t border-gray-100">
        <a
          href="#"
          className="group flex items-center justify-center gap-2 text-[10px] font-mono text-gray-400 hover:text-blue-600 transition-colors duration-200 uppercase tracking-wider"
          aria-label="Devenir partenaire officiel"
        >
          <span>Devenir Partenaire</span>
          <PartnerIcon />
        </a>
      </div> */}
    </div>
  );
}