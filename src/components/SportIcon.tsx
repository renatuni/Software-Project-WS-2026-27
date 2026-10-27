import { CircleDot, CircleDashed, Goal, Volleyball } from 'lucide-react';
import type { Sport } from '@/features/events/model';
export function SportIcon({ sport, size = 22 }: { sport: Sport; size?: number }) {
  const Icon =
    sport === 'Fußball'
      ? Goal
      : sport === 'Volleyball'
        ? Volleyball
        : sport === 'Basketball'
          ? CircleDashed
          : CircleDot;
  return <Icon size={size} aria-hidden="true" strokeWidth={1.7} />;
}
