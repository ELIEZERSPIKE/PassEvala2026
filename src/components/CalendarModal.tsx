// components/CalendarModal.tsx
import React, { useState } from 'react';
import { X, Filter, Calendar, Clock, MapPin } from 'lucide-react';
import { CALENDAR_EVENTS } from '../data';

type CalendarFilter = 'All' | 'Wrestling' | 'Culture';

const FILTERS: CalendarFilter[] = ['All', 'Wrestling', 'Culture'];

const TYPE_STYLES: Record<string, string> = {
  Wrestling: 'bg-red-100 text-red-700',
  Culture: 'bg-purple-100 text-purple-700',
  default: 'bg-blue-100 text-blue-700',
};

interface CalendarModalProps {
  onClose: () => void;
}

export default function CalendarModal({ onClose }: CalendarModalProps) {
  const [filter, setFilter] = useState<CalendarFilter>('All');

  const events = filter === 'All'
    ? CALENDAR_EVENTS
    : CALENDAR_EVENTS.filter(e => e.type === filter);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Calendrier EVALA 2026</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Filtres */}
          <div className="flex gap-2 mb-6">
            {FILTERS.map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                  filter === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Filter className="w-4 h-4" />
                {type}
              </button>
            ))}
          </div>

          {/* Événements */}
          <div className="space-y-3">
            {events.map(evt => (
              <div key={evt.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <h3 className="font-semibold text-gray-900">{evt.title}</h3>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4" />{evt.date}</div>
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4" />{evt.time}</div>
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{evt.location}</div>
                </div>
                <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold ${TYPE_STYLES[evt.type] ?? TYPE_STYLES.default}`}>
                  {evt.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}