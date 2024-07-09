import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '~/global.scss';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Semantic Search',
  description: 'Query uploaded documents via a semantic LLM.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
