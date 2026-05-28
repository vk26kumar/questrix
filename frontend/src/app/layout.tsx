import type { Metadata } from 'next';
import { Bricolage_Grotesque } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-bricolage',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'VedaAI — AI Assessment Creator',
  description:
    'Create AI-powered question papers for your students in seconds.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={bricolage.variable}>
      <body className={`${bricolage.className} bg-[#EFEFEF] antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}