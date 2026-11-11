import type { Metadata } from 'next';
import { SportMate } from '@/components/SportMate';
import { seedEvents } from '@/features/events/demo';
import { sports } from '@/features/events/model';

export const metadata: Metadata = {
  title: 'Sporttreffen entdecken · sportmate.',
  description:
    'Sporttreffen in Flensburg erkunden: Sportarten, Karte und freie Plätze. Aktuell eine Demo mit fiktiven Treffen.',
};

export default async function MeetingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const initialSport = sports.find((sport) => sport === query.sport);
  const initialCreate = query.aktion === 'erstellen';
  return (
    <SportMate
      key={`${initialSport ?? 'alle'}:${initialCreate}`}
      initialEvents={seedEvents()}
      initialSport={initialSport}
      initialCreate={initialCreate}
    />
  );
}
