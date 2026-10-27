import type { Metadata } from 'next';
import 'leaflet/dist/leaflet.css';
import './globals.css';
export const metadata: Metadata = {
  title: 'SportMate · Gemeinsam in Bewegung',
  description: 'Sporttreffen in Flensburg entdecken. Lokale Demo mit fiktiven Daten.',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
