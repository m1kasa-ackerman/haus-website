import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Haus Design Studio — Haneesha',
  description:
    'Haus by Haneesha — a luxury interior design studio in Hyderabad. Crafting luxury residences and vibrant commercial interiors that feel inevitable.',
  metadataBase: new URL(process.env.AUTH_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Haus Design Studio — Haneesha',
    description: 'Luxury interior design studio in Hyderabad.',
    type: 'website'
  },
  icons: { icon: '/favicon.ico' }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
