import React from 'react';
import { UsefulNumber } from '../types/usefulNumber';
import { Pencil, Trash2, Phone } from 'lucide-react';

const COLOR_MAP: Record<string, string> = {
  red: 'bg-red-100 text-red-700 border-red-300',
  blue: 'bg-blue-100 text-blue-700 border-blue-300',
  green: 'bg-green-100 text-green-700 border-green-300',
  orange: 'bg-orange-100 text-orange-700 border-orange-300',
  purple: 'bg-purple-100 text-purple-700 border-purple-300',
};

interface Props {
  number: UsefulNumber;
  onEdit: (number: UsefulNumber) => void;
  onDelete: (id: number) => void;
  canEdit?: boolean;
}

const UsefulNumberCard: React.FC<Props> = ({ number, onEdit, onDelete, canEdit }) => {
  const colorClass = number.color_tag ? COLOR_MAP[number.color_tag] ?? 'bg-gray-100 text-gray-700' : 'bg-gray-100 text-gray-700';

  return (
    <div className={`border rounded-lg p-4 flex items-center justify-between ${colorClass}`}>
      <div className="flex items-center gap-3">
        <Phone size={18} />
        <div>
          <p className="font-semibold text-sm">{number.name}</p>
          <p className="text-sm">{number.phone_number}</p>
        </div>
      </div>

      {canEdit && (
        <div className="flex gap-2">
          <button onClick={() => onEdit(number)} className="p-1 hover:opacity-70">
            <Pencil size={16} />
          </button>
          <button onClick={() => onDelete(number.id)} className="p-1 hover:opacity-70">
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default UsefulNumberCard;