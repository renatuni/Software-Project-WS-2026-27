export const sports = ['Fußball', 'Volleyball', 'Badminton', 'Basketball'] as const;
export const levels = ['Alle Niveaus', 'Anfänger', 'Fortgeschritten', 'Erfahren'] as const;
export const ages = ['unter 20', '20–25', '26–30', '31–40', 'über 40'] as const;
export type Sport = (typeof sports)[number];
export type Level = (typeof levels)[number];
export type Age = (typeof ages)[number] | '';
export type Point = { latitude: number; longitude: number };
export type EventInput = Point & {
  title: string;
  sport: Sport;
  meetingPoint: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
  minParticipants: number;
  level: Level;
  ageGroup: Age;
  description: string;
};
export type SportEvent = EventInput & {
  id: string;
  organizerId: string;
  status: 'published' | 'cancelled';
  participants: string[];
};
export type Filters = {
  query: string;
  sports: Sport[];
  level: string;
  ageGroup: string;
  period: '' | 'today' | 'tomorrow' | 'week' | 'date';
  date: string;
  mine: boolean;
};
export const emptyFilters: Filters = {
  query: '',
  sports: [],
  level: '',
  ageGroup: '',
  period: '',
  date: '',
  mine: false,
};
export const people: Record<string, string> = {
  lea: 'Lea',
  tom: 'Tom',
  alex: 'Alex',
  kim: 'Kim',
  sam: 'Sam',
  nora: 'Nora',
  emi: 'Emi',
};
