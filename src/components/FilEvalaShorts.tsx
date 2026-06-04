import React, { useState, useEffect } from 'react';
import { Short } from '../types';
import { shortService } from '../services';
import { Play, Heart, MessageSquare, Share2 } from 'lucide-react';

export default function FilEvalaShorts() {
  const [shorts, setShorts] = useState<Short[]>([]);

  useEffect(() => {
    const fetchShorts = async () => {
      try {
        const data = await shortService.getShorts();
        // Only show published shorts
        setShorts(data.filter(s => s.status === 'published'));
      } catch (error) {
        console.error('Error fetching shorts:', error);
      }
    };
    fetchShorts();
  }, []);

  if (shorts.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-4" id="component-fil-evala">
      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
        <h2 className="font-display font-black text-xl text-[#222222] uppercase tracking-wide flex items-center gap-2">
          <Play className="w-5 h-5 text-red-600 fill-current" />
          Fil Evala
        </h2>
        <span className="text-[10px] font-mono font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-sm uppercase tracking-widest animate-pulse">
          Shorts
        </span>
      </div>

      <div className="flex flex-col gap-6">
        {shorts.map((post) => (
          <div key={post.id} className="bg-white border border-[#E5E5E5] rounded-sm overflow-hidden flex flex-col shadow-sm">
            <div className="p-3 flex items-center justify-between border-b border-gray-50">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-black text-xs text-white bg-blue-600`}>
                  {post.user?.name ? post.user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs text-[#222222] leading-none">{post.user?.name || 'Unknown User'}</h4>
                  <span className="text-[10px] font-sans text-gray-500">@{post.user?.username || 'user'}</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-gray-400">{new Date(post.created_at).toLocaleDateString()}</span>
            </div>

            <div className="p-3">
              <p className="font-sans text-sm text-[#222222] whitespace-pre-wrap">{post.text}</p>
            </div>

            {post.processed_path && (
              <div className="relative bg-black w-full aspect-[4/5] flex items-center justify-center overflow-hidden group cursor-pointer">
                <img src={post.thumbnail_path || 'https://via.placeholder.com/400x500'} alt="Video thumbnail" className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-white fill-current ml-1" />
                  </div>
                </div>
                {post.duration && (
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] font-mono px-2 py-1 rounded-sm backdrop-blur-sm">
                    0:{post.duration.toString().padStart(2, '0')}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between p-3 border-t border-gray-50 bg-gray-50/50">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1.5 text-gray-500 hover:text-red-600 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </button>
              </div>
              <button className="text-gray-400 hover:text-[#222222] transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
