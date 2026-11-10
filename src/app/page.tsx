import type { Metadata } from 'next';
import { LandingPage } from '@/components/landing/LandingPage';

export const metadata: Metadata = {
  title: 'sportmate. · Gemeinsam Sport machen. Einfach Leute finden.',
  description:
    'Lerne sportmate kennen: die Idee für gemeinsame Sporttreffen in deiner Nähe. Entdecke Fußball, Volleyball, Basketball und Badminton in unserer Flensburger Projekt-Demo.',
};

export default function Page() {
  return <LandingPage />;
}
