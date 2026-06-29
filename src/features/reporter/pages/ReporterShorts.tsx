import { Link } from 'react-router-dom';
import { Video } from 'lucide-react';

export const ReporterShorts = () => (
  <div className="p-6 max-w-5xl mx-auto">
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-black text-gray-900">Shorts</h1>
      <Link
        to="/reporter/shorts/new"
        className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
      >
        <Video className="w-4 h-4" /> Nouveau short
      </Link>
    </div>
    {/* Réutilise AdminShorts ou ton composant existant ici */}
  </div>
);