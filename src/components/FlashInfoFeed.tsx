import React, { useState, useEffect } from 'react';
import { FlashInfo } from '../types';
import { flashInfoService } from '../services';
import { Zap } from 'lucide-react';

interface FlashInfoFeedProps {
  onFlashInfoClick: (item: FlashInfo) => void;
}

export default function FlashInfoFeed({ onFlashInfoClick }: FlashInfoFeedProps) {
  const [flashInfos, setFlashInfos] = useState<FlashInfo[]>([]);

  useEffect(() => {
    const fetchFlashInfos = async () => {
      try {
        const data = await flashInfoService.getFlashInfos();
        setFlashInfos(data);
      } catch (error) {
        console.error('Error fetching flash infos:', error);
      }
    };
    fetchFlashInfos();
  }, []);

  if (flashInfos.length === 0) return null;

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-sm overflow-hidden flex flex-col shadow-sm" id="component-flash-info">
      <div className="bg-[#222222] text-white p-3 flex items-center justify-between">
        <h3 className="font-display font-black text-xs uppercase tracking-widest flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-500 fill-current" />
          Flash Info
        </h3>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
      </div>
      <div className="flex flex-col divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
        {flashInfos.map((item) => (
          <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group" onClick={() => onFlashInfoClick(item)}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-[10px] text-gray-500">{new Date(item.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
            <p className="font-sans text-sm text-[#222222] group-hover:text-blue-600 transition-colors leading-snug">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

