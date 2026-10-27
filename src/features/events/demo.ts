import type { SportEvent } from './model';
// Fiktive Personen, Orte und Treffen aus dem bereitgestellten P3-Prototyp.
export function seedEvents(now = new Date()): SportEvent[] {
  const time = (days: number, hour: number) => {
    const date = new Date(now);
    date.setDate(date.getDate() + days);
    date.setHours(hour, 0, 0, 0);
    return date.toISOString();
  };
  const common = { organizerId: 'alex', status: 'published' as const };
  return [
    {
      ...common,
      id: 'fussball',
      title: 'Fußball am Campus',
      sport: 'Fußball',
      meetingPoint: 'Campus Flensburg, Sportplatz (Beispiel)',
      latitude: 54.7753,
      longitude: 9.4479,
      startsAt: time(1, 17),
      endsAt: time(1, 19),
      capacity: 10,
      minParticipants: 6,
      level: 'Anfänger',
      ageGroup: '20–25',
      description: 'Entspannt zusammen kicken. Bitte eigene Sportschuhe mitbringen.',
      participants: ['alex', 'kim', 'sam', 'nora', 'emi'],
    },
    {
      ...common,
      id: 'volleyball',
      title: 'Volleyball am Hafen',
      sport: 'Volleyball',
      meetingPoint: 'Flensburg, Hafenspitze (Beispiel)',
      latitude: 54.7923,
      longitude: 9.4347,
      startsAt: time(1, 18),
      endsAt: time(1, 20),
      capacity: 4,
      minParticipants: 4,
      level: 'Fortgeschritten',
      ageGroup: '',
      description: 'Fiktives Treffen für den Testfall Ausgebucht.',
      participants: ['alex', 'kim', 'sam', 'nora'],
    },
    {
      ...common,
      id: 'badminton',
      title: 'Badminton zu zweit',
      sport: 'Badminton',
      meetingPoint: 'Campus Flensburg, Sporthalle (Beispiel)',
      latitude: 54.7707,
      longitude: 9.4559,
      startsAt: time(2, 16),
      endsAt: time(2, 17),
      capacity: 2,
      minParticipants: 2,
      level: 'Alle Niveaus',
      ageGroup: '',
      description:
        'Fiktive Beispieldaten. Die Halle ist nicht reserviert. Genau ein Platz ist frei.',
      participants: ['alex'],
    },
  ];
}
