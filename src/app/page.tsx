import { SportMate } from '@/components/SportMate';
import { seedEvents } from '@/features/events/demo';
export const dynamic = 'force-dynamic';
export default function Page() {
  return <SportMate initialEvents={seedEvents()} />;
}
