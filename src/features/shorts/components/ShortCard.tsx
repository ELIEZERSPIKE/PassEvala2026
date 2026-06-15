import React from 'react';
import { Short } from '../types/short';
import { Pencil, Trash2, Video, Clock, CheckCircle, Archive } from 'lucide-react';

const STATUS_CONFIG = {
  draft: { label: 'Brouillon', icon: Clock, className: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  published: { label: 'Publié', icon: CheckCircle, className: 'text-green-600 bg-green-50 border-green-200' },
  archived: { label: 'Archivé', icon: Archive, className: 'text-gray-500 bg-gray-50 border-gray-200' },
};

interface Props {
  short: Short;
  onEdit: (short: Short) => void;
  onDelete: (id: number) => void;
  canEdit?: boolean;
}

const ShortCard: React.FC<Props> = ({ short, onEdit, onDelete, canEdit }) => {
  const status = STATUS_CONFIG[short.status];
  const StatusIcon = status.icon;

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Video size={16} className="text-gray-400 shrink-0" />
          <p className="text-sm text-gray-800 line-clamp-2">
            {short.text ?? <span className="text-gray-400 italic">Aucun texte</span>}
          </p>
        </div>

        {canEdit && (
          <div className="flex gap-2 shrink-0">
            <button onClick={() => onEdit(short)} className="text-gray-400 hover:text-blue-600 p-1">
              <Pencil size={15} />
            </button>
            <button onClick={() => onDelete(short.id)} className="text-gray-400 hover:text-red-500 p-1">
              <Trash2 size={15} />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${status.className}`}>
          <StatusIcon size={11} />
          {status.label}
        </span>
        {short.user && (
          <span className="text-xs text-gray-400">@{short.user.username}</span>
        )}
      </div>
    </div>
  );
};

export default ShortCard;