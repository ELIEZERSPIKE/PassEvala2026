import React, { useState, useEffect } from 'react';
import { UsefulNumber } from '../types';
import { usefulNumberService } from '../services';
import { Phone, ShieldAlert, Ambulance, FireExtinguisher } from 'lucide-react';

export default function UsefulNumbersStack() {
  const [numbers, setNumbers] = useState<UsefulNumber[]>([]);

  useEffect(() => {
    const fetchNumbers = async () => {
      try {
        const data = await usefulNumberService.getUsefulNumbers();
        setNumbers(data);
      } catch (error) {
        console.error('Error fetching useful numbers:', error);
      }
    };
    fetchNumbers();
  }, []);

  if (numbers.length === 0) return null;

  const getIcon = (name: string) => {
    const l = name.toLowerCase();
    if (l.includes('police') || l.includes('gendarmerie')) return <ShieldAlert className="w-5 h-5 text-red-500" />;
    if (l.includes('pompier') || l.includes('sapeur')) return <FireExtinguisher className="w-5 h-5 text-orange-500" />;
    if (l.includes('hopital') || l.includes('chu') || l.includes('ambulance')) return <Ambulance className="w-5 h-5 text-blue-500" />;
    return <Phone className="w-5 h-5 text-gray-500" />;
  };

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-sm overflow-hidden flex flex-col shadow-sm" id="component-useful-numbers">
      <div className="bg-[#222222] text-white p-4">
        <h3 className="font-display font-black text-sm uppercase tracking-widest flex items-center gap-2">
          <Phone className="w-4 h-4 text-green-500 fill-current" />
          Urgences & Utiles
        </h3>
        <p className="text-[10px] font-sans text-gray-400 mt-1 uppercase tracking-wider">Numéros directs Kara</p>
      </div>

      <div className="flex flex-col p-2">
        {numbers.map((item) => (
          <a key={item.id} href={`tel:${item.phone_number.replace(/\s+/g, '')}`} className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 group">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100`}>
              {getIcon(item.name)}
            </div>
            <div className="flex flex-col flex-grow">
              <span className="font-display font-black text-xs text-[#222222] uppercase tracking-wide group-hover:text-blue-600 transition-colors">{item.name}</span>
            </div>
            <div className="bg-gray-100 px-3 py-1.5 rounded-sm font-mono font-bold text-xs text-[#222222] tracking-wider group-hover:bg-blue-600 group-hover:text-white transition-colors">
              {item.phone_number}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
