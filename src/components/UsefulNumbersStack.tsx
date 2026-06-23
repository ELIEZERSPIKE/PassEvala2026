import React, { useState, useEffect } from 'react';
import { UsefulNumber } from '../types';
import { usefulNumberService } from '../services';
import { Phone, ShieldAlert, Ambulance, FireExtinguisher, Loader2 } from 'lucide-react';

// 1. Sortie de la fonction pour éviter sa recréation à chaque render
const getIcon = (name: string) => {
  const l = name.toLowerCase();
  if (l.includes('police') || l.includes('gendarmerie')) return <ShieldAlert className="w-5 h-5 text-red-500" />;
  if (l.includes('pompier') || l.includes('sapeur')) return <FireExtinguisher className="w-5 h-5 text-orange-500" />;
  if (l.includes('hopital') || l.includes('chu') || l.includes('ambulance')) return <Ambulance className="w-5 h-5 text-blue-500" />;
  return <Phone className="w-5 h-5 text-gray-500" />;
};

export default function UsefulNumbersStack() {
  const [numbers, setNumbers] = useState<UsefulNumber[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // Évite les fuites de mémoire si le composant est démonté

    const fetchNumbers = async () => {
      try {
        setIsLoading(true);
        const data = await usefulNumberService.getUsefulNumbers();
        if (isMounted) {
          setNumbers(data);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching useful numbers:', err);
        if (isMounted) {
          setError('Impossible de charger les numéros.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchNumbers();

    return () => {
      isMounted = false;
    };
  }, []);

  // Base du conteneur pour garder une structure visuelle constante
  const renderContainer = (content: React.ReactNode) => (
    <div className="bg-white border border-[#E5E5E5] rounded-sm overflow-hidden flex flex-col shadow-sm" id="component-useful-numbers">
      <div className="bg-[#222222] text-white p-4">
        <h3 className="font-display font-black text-sm uppercase tracking-widest flex items-center gap-2">
          <Phone className="w-4 h-4 text-green-500 fill-current" />
          Urgences & Utiles
        </h3>
        <p className="text-[10px] font-sans text-gray-400 mt-1 uppercase tracking-wider">Numéros directs Kara</p>
      </div>
      <div className="flex flex-col p-2 min-h-[100px] justify-center">
        {content}
      </div>
    </div>
  );

  // 2. Gestion de l'affichage pendant le chargement (Skeleton)
  if (isLoading) {
    return renderContainer(
      <div className="flex flex-col gap-3 p-2 animate-pulse">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
            <div className="h-4 bg-gray-200 rounded w-1/3 flex-grow" />
            <div className="h-8 bg-gray-200 rounded w-20" />
          </div>
        ))}
      </div>
    );
  }

  // 3. Gestion de l'affichage en cas d'erreur
  if (error) {
    return renderContainer(
      <div className="p-4 text-center text-xs text-red-500 font-sans">
        {error}
      </div>
    );
  }

  // 4. Si la liste est vide après chargement réussi
  if (numbers.length === 0) return null;

  // 5. Affichage final de la liste
  return renderContainer(
    <>
      {numbers.map((item) => (
        <a 
          key={item.id} 
          href={`tel:${item.phone_number.replace(/\s+/g, '')}`} 
          className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 group focus:outline-none focus:bg-gray-50"
          aria-label={`Appeler ${item.name} au ${item.phone_number}`}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100">
            {getIcon(item.name)}
          </div>
          <div className="flex flex-col flex-grow">
            <span className="font-display font-black text-xs text-[#222222] uppercase tracking-wide group-hover:text-blue-600 group-focus:text-blue-600 transition-colors">
              {item.name}
            </span>
          </div>
          <div className="bg-gray-100 px-3 py-1.5 rounded-sm font-mono font-bold text-xs text-[#222222] tracking-wider group-hover:bg-blue-600 group-hover:text-white group-focus:bg-blue-600 group-focus:text-white transition-colors">
            {item.phone_number}
          </div>
        </a>
      ))}
    </>
  );
}