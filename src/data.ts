import { CalendarEvent } from './types';

export const CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    date: '11 Juillet 2026',
    time: '08:00',
    title: 'Cérémonie d\'ouverture - Pya Hodo',
    location: 'Terrain de Pya Hodo',
    type: 'Official'
  },
  {
    id: '2',
    date: '12 Juillet 2026',
    time: '14:00',
    title: 'Luttes traditionnelles (Quarts de finale)',
    location: 'Arène de Tchitchao',
    type: 'Wrestling'
  },
  {
    id: '3',
    date: '13 Juillet 2026',
    time: '20:00',
    title: 'Concert des Artistes Locaux',
    location: 'Palais des Congrès, Kara',
    type: 'Culture'
  },
  {
    id: '4',
    date: '14 Juillet 2026',
    time: '15:00',
    title: 'Grande Finale des Luttes',
    location: 'Stade Municipal de Kara',
    type: 'Wrestling'
  }
];
