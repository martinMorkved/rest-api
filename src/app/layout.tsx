import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Driftstatus',
  description: 'Service status og driftsmeldinger',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
