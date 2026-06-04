import React, { useState, useEffect } from 'react';
import { BonPlan } from '../types';
import { bonPlanService } from '../services';
import { Star, MapPin } from 'lucide-react';

export default function BonsPlansKara() {
  const [bonsPlans, setBonsPlans] = useState<BonPlan[]>([]);

  useEffect(() => {
    const fetchBonsPlans = async () => {
      try {
        const data = await bonPlanService.getBonsPlans();
        setBonsPlans(data);
      } catch (error) {
        console.error('Error fetching bons plans:', error);
      }
    };
    fetchBonsPlans();
  }, []);

  if (bonsPlans.length === 0) return null;

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-sm overflow-hidden flex flex-col shadow-sm" id="component-bons-plans">
      <div className="bg-[#222222] text-white p-4">
        <h3 className="font-display font-black text-sm uppercase tracking-widest flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          Bons Plans Kara
        </h3>
        <p className="text-[10px] font-sans text-gray-400 mt-1 uppercase tracking-wider">Où manger, dormir, sortir pendant les Evala</p>
      </div>

      <div className="flex flex-col p-4 gap-4 max-h-[500px] overflow-y-auto">
        {bonsPlans.map((plan) => (
          <div key={plan.id} className="flex gap-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0 group">
            <div className="w-20 h-20 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0 relative">
              <img src={plan.image_path || 'https://via.placeholder.com/150'} alt={plan.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <span className="text-[9px] uppercase font-display font-black tracking-widest text-blue-600 mb-0.5 block">{plan.category}</span>
                <h4 className="font-display font-extrabold text-xs text-[#222222] group-hover:text-blue-600 transition-colors">{plan.title}</h4>
              </div>
              <p className="font-sans text-[10px] text-gray-500 line-clamp-2 mt-1">{plan.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
