import './globals.css';
import { Inter, Playfair_Display } from 'next/font/google';
import NavBar from '@/components/NavBar';
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
// Attempting to load a Serif font. If it fails due to network, it will fallback to system serif.
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair-display' });

export const metadata = {
  title: '纸上相遇 | Meet Between Pages',
  description: 'Talk with characters from books and understand a book faster than finishing it.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans min-h-screen bg-[#fdfbf7] text-[#1c1917] antialiased selection:bg-neutral-900 selection:text-white">
        <Suspense fallback={<div className="h-16 bg-[#fdfbf7]" />}>
          <NavBar />
        </Suspense>
        <div className="pt-16">
          {children}
        </div>
      </body>
    </html>
  );
}
